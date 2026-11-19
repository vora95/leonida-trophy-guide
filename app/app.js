// Leonida Trophy Guide — boot and state.
//
// The app is a single-page guide and tracker for GTA VI's 55 PlayStation 5
// trophies. Progress lives in localStorage, exports to a JSON file and
// imports back. Everything runs offline from the app's own files: the trophy
// data is fetched from data/trophies.json, nothing else is fetched at all.
//
// Screenshot helper: ?view=roadmap|trophies|missable picks the opening view,
// ?spoiler=on|off sets the spoiler switch, and ?demo=1 seeds a sample
// checklist (12 trophies) when no saved progress exists yet.

import { PHASES } from './roadmap.js';
import { trophyCard, detailPanel, trophyMatches } from './guide.js';

const STORAGE_KEY = 'leonida-trophy-guide-v1';
const DEMO_EARNED = [2, 3, 4, 8, 15, 16, 21, 28, 35, 42, 55, 5];

const params = new URLSearchParams(location.search);

function loadEarned() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw);
    return new Set(Array.isArray(parsed) ? parsed.filter((n) => Number.isInteger(n)) : []);
  } catch {
    return new Set();
  }
}

function saveEarned(earned) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...earned].sort((a, b) => a - b)));
}

const state = {
  trophies: [],
  earned: loadEarned(),
  spoiler: params.get('spoiler') !== 'off',
  view: params.get('view') === 'roadmap' || params.get('view') === 'missable' ? params.get('view') : 'trophies',
  detailId: null,
  filters: { kind: 'all', grade: 'all', hideEarned: false },
  search: '',
  toggleEarned(id) {
    if (state.earned.has(id)) state.earned.delete(id);
    else state.earned.add(id);
    saveEarned(state.earned);
    render();
  },
  openDetail(id) {
    state.detailId = id;
    render();
    document.getElementById('detail')?.scrollIntoView({ block: 'start' });
  },
  closeDetail() {
    state.detailId = null;
    render();
  },
};

if (params.get('demo') === '1' && state.earned.size === 0) {
  state.earned = new Set(DEMO_EARNED);
  saveEarned(state.earned);
}
if (params.get('view') === 'missable') state.filters.kind = 'missable';

const $ = (id) => document.getElementById(id);

function progressLine() {
  const total = state.trophies.length;
  const done = state.earned.size;
  const pct = total ? Math.round((done / total) * 100) : 0;
  $('progress-text').textContent = `${done} of ${total} earned · ${pct}% to the platinum`;
  $('progress-fill').style.width = `${pct}%`;
  const byGrade = {};
  for (const t of state.trophies) {
    byGrade[t.grade] = byGrade[t.grade] ?? { done: 0, total: 0 };
    byGrade[t.grade].total += 1;
    if (state.earned.has(t.id)) byGrade[t.grade].done += 1;
  }
  $('grade-counts').textContent = ['platinum', 'gold', 'silver', 'bronze']
    .map((g) => `${g} ${byGrade[g]?.done ?? 0}/${byGrade[g]?.total ?? 0}`)
    .join(' · ');
}

function renderRoadmap() {
  const wrap = $('roadmap');
  wrap.replaceChildren();
  for (const phase of PHASES) {
    const section = document.createElement('section');
    section.className = 'phase';
    const title = document.createElement('h3');
    title.textContent = phase.title;
    const goal = document.createElement('p');
    goal.className = 'phase-goal';
    goal.textContent = phase.goal;
    const advice = document.createElement('p');
    advice.textContent = phase.advice;
    section.append(title, goal, advice);
    if (phase.ids.length) {
      const list = document.createElement('ol');
      list.className = 'phase-trophies';
      for (const id of phase.ids) {
        const t = state.trophies.find((x) => x.id === id);
        if (!t) continue;
        const li = document.createElement('li');
        li.className = state.earned.has(id) ? 'done' : '';
        const box = document.createElement('input');
        box.type = 'checkbox';
        box.checked = state.earned.has(id);
        box.setAttribute('aria-label', `Mark ${t.name} earned`);
        box.addEventListener('change', () => state.toggleEarned(id));
        const label = document.createElement('span');
        label.textContent = `${state.spoiler && t.hidden && !state.earned.has(id) ? 'Hidden trophy' : t.name}${t.missable ? ' ⚠ missable' : ''} — ${t.grade}`;
        li.append(box, label);
        list.append(li);
      }
      section.append(list);
    }
    wrap.append(section);
  }
}

function renderGrid() {
  const grid = $('grid');
  grid.replaceChildren();
  const shown = state.trophies.filter((t) => trophyMatches(t, state.filters, state.earned, state.search));
  if (state.filters.kind === 'online') {
    const note = document.createElement('p');
    note.className = 'empty-note';
    note.textContent = 'No online trophies: all 55 trophies are single-player, and none needs GTA Online (Exophase & PSNProfiles, 18 Nov 2026).';
    grid.append(note);
    $('result-count').textContent = '0 trophies — none online';
    return;
  }
  for (const t of shown) grid.append(trophyCard(t, state));
  $('result-count').textContent = `${shown.length} of ${state.trophies.length} trophies shown`;
}

function renderDetail() {
  const slot = $('detail-slot');
  slot.replaceChildren();
  if (state.detailId == null) return;
  const t = state.trophies.find((x) => x.id === state.detailId);
  if (t) slot.append(detailPanel(t, state));
}

function render() {
  progressLine();
  $('view-roadmap').hidden = state.view !== 'roadmap';
  $('view-trophies').hidden = state.view !== 'trophies';
  $('view-missable').hidden = state.view !== 'missable';
  document.querySelectorAll('.tab').forEach((b) => {
    b.setAttribute('aria-selected', String(b.dataset.view === state.view));
  });
  if (state.view === 'roadmap') renderRoadmap();
  if (state.view === 'trophies') renderGrid();
  if (state.view === 'missable') {
    const list = $('missable-list');
    list.replaceChildren();
    const missable = state.trophies.filter((t) => t.missable);
    for (const t of missable) list.append(trophyCard(t, state));
    const warn = document.createElement('p');
    warn.className = 'empty-note';
    warn.textContent = 'Only one trophy is reported missable at launch. The story trophies are not missable — they unlock by finishing the story — but with no mission replay, keep a manual save at the start of every chapter (Output Lag, 19 Nov 2026).';
    list.append(warn);
  }
  renderDetail();
}

function exportProgress() {
  const blob = new Blob([JSON.stringify([...state.earned].sort((a, b) => a - b), null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'leonida-trophy-progress.json';
  a.click();
  URL.revokeObjectURL(a.href);
}

async function importProgress(file) {
  const parsed = JSON.parse(await file.text());
  if (!Array.isArray(parsed)) throw new Error('not an array');
  state.earned = new Set(parsed.filter((n) => Number.isInteger(n) && n >= 1 && n <= 55));
  saveEarned(state.earned);
  render();
}

async function boot() {
  const doc = await (await fetch('data/trophies.json')).json();
  state.trophies = doc.trophies;

  document.querySelectorAll('.tab').forEach((b) => {
    b.addEventListener('click', () => {
      state.view = b.dataset.view;
      state.detailId = null;
      render();
    });
  });
  $('kind-filter').addEventListener('change', (e) => {
    state.filters.kind = e.target.value;
    state.detailId = null;
    render();
  });
  $('grade-filter').addEventListener('change', (e) => {
    state.filters.grade = e.target.value;
    render();
  });
  $('search').addEventListener('input', (e) => {
    state.search = e.target.value;
    render();
  });
  $('hide-earned').addEventListener('change', (e) => {
    state.filters.hideEarned = e.target.checked;
    render();
  });
  $('spoiler').checked = state.spoiler;
  $('spoiler').addEventListener('change', (e) => {
    state.spoiler = e.target.checked;
    render();
  });
  $('export').addEventListener('click', exportProgress);
  $('import').addEventListener('change', async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      await importProgress(file);
    } catch {
      alert('That file is not a trophy-progress export.');
    }
    e.target.value = '';
  });
  $('reset').addEventListener('click', () => {
    if (confirm('Clear all earned trophies?')) {
      state.earned = new Set();
      saveEarned(state.earned);
      render();
    }
  });

  render();

  const detailParam = Number(params.get('detail'));
  if (Number.isInteger(detailParam) && detailParam >= 1 && detailParam <= 55) {
    state.openDetail(detailParam);
  }
}

boot();
