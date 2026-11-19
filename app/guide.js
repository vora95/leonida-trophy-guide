// Rendering for the trophy list: cards, the detail panel, and the filters.
// A trophy is shown as a card with its official name, description and grade,
// its kind tags, a missable flag where one applies, and its guide with the
// sources that guide cites. Spoiler mode hides the name and description of
// any trophy PlayStation hides (28 of the 55) until it is earned.

const GRADE_LABEL = { platinum: 'Platinum', gold: 'Gold', silver: 'Silver', bronze: 'Bronze' };
const KIND_LABEL = { story: 'Story', collectible: 'Collectible', activity: 'Activity' };

export function gradeLabel(trophy) {
  return GRADE_LABEL[trophy.grade] ?? trophy.grade;
}

export function kindLabel(trophy) {
  return KIND_LABEL[trophy.kind] ?? trophy.kind;
}

// The visible face of a trophy under the spoiler setting: hidden trophies
// show as "Hidden trophy" with their grade only, until earned or revealed.
export function displayName(trophy, spoilerOn, earned) {
  if (spoilerOn && trophy.hidden && !earned) return 'Hidden trophy';
  return trophy.name;
}

export function displayDescription(trophy, spoilerOn, earned) {
  if (spoilerOn && trophy.hidden && !earned) return 'Hidden on PlayStation until earned — tick it off to reveal it.';
  return trophy.description;
}

export function trophyMatches(trophy, filters, earnedSet, searchText) {
  if (filters.kind === 'missable' && !trophy.missable) return false;
  if (filters.kind === 'online') return false; // no online trophies exist
  if (filters.kind !== 'all' && filters.kind !== 'missable' && filters.kind !== 'online' && trophy.kind !== filters.kind) return false;
  if (filters.grade !== 'all' && trophy.grade !== filters.grade) return false;
  if (filters.hideEarned && earnedSet.has(trophy.id)) return false;
  if (searchText) {
    const hay = `${trophy.name} ${trophy.description} ${trophy.guide}`.toLowerCase();
    if (!hay.includes(searchText.toLowerCase())) return false;
  }
  return true;
}

export function trophyCard(trophy, state) {
  const earned = state.earned.has(trophy.id);
  const card = document.createElement('article');
  card.className = `card grade-${trophy.grade}${earned ? ' earned' : ''}${trophy.missable ? ' missable' : ''}`;
  card.dataset.id = String(trophy.id);

  const head = document.createElement('div');
  head.className = 'card-head';
  const check = document.createElement('input');
  check.type = 'checkbox';
  check.checked = earned;
  check.setAttribute('aria-label', `Mark ${trophy.name} earned`);
  check.addEventListener('change', () => state.toggleEarned(trophy.id));
  const badge = document.createElement('span');
  badge.className = 'grade-badge';
  badge.textContent = gradeLabel(trophy);
  head.append(check, badge);
  if (trophy.missable) {
    const flag = document.createElement('span');
    flag.className = 'missable-flag';
    flag.textContent = '⚠ Missable';
    head.append(flag);
  }
  if (trophy.hidden) {
    const tag = document.createElement('span');
    tag.className = 'hidden-tag';
    tag.textContent = 'Hidden';
    head.append(tag);
  }

  const name = document.createElement('h3');
  name.textContent = displayName(trophy, state.spoiler, earned);
  const desc = document.createElement('p');
  desc.className = 'desc';
  desc.textContent = displayDescription(trophy, state.spoiler, earned);
  const tags = document.createElement('p');
  tags.className = 'tags';
  tags.textContent = [kindLabel(trophy), trophy.count ? `Count: ${trophy.count}` : null, `Phase ${trophy.phase}`]
    .filter(Boolean).join(' · ');

  const open = document.createElement('button');
  open.type = 'button';
  open.className = 'guide-link';
  open.textContent = earned || !trophy.hidden || !state.spoiler ? 'Read the guide →' : 'Guide (spoiler) →';
  open.addEventListener('click', () => state.openDetail(trophy.id));

  card.append(head, name, desc, tags, open);
  return card;
}

// The detail panel: the full guide for one trophy, with its sources listed
// line by line so every claim can be checked. Unconfirmed steps say so.
export function detailPanel(trophy, state) {
  const earned = state.earned.has(trophy.id);
  const panel = document.createElement('section');
  panel.className = 'detail';
  panel.id = 'detail';

  const close = document.createElement('button');
  close.type = 'button';
  close.className = 'detail-close';
  close.textContent = '✕ Close';
  close.addEventListener('click', () => state.closeDetail());

  const badge = document.createElement('span');
  badge.className = 'grade-badge';
  badge.textContent = gradeLabel(trophy);

  const name = document.createElement('h2');
  name.textContent = displayName(trophy, state.spoiler, earned);
  const desc = document.createElement('p');
  desc.className = 'desc';
  desc.textContent = displayDescription(trophy, state.spoiler, earned);

  const meta = document.createElement('p');
  meta.className = 'tags';
  meta.textContent = [
    kindLabel(trophy),
    trophy.hidden ? 'Hidden on PlayStation' : 'Visible on PlayStation',
    trophy.missable ? '⚠ Missable — see the guide' : 'Not missable',
    trophy.count ? `Target: ${trophy.count}` : null,
    `Roadmap Phase ${trophy.phase}`,
  ].filter(Boolean).join(' · ');

  const guideTitle = document.createElement('h3');
  guideTitle.textContent = 'How to earn it';
  const guide = document.createElement('p');
  guide.className = 'guide-text';
  guide.textContent = trophy.guide;

  const srcTitle = document.createElement('h3');
  srcTitle.textContent = 'Sources';
  const srcList = document.createElement('ul');
  srcList.className = 'sources';
  for (const s of trophy.sources ?? []) {
    const li = document.createElement('li');
    li.textContent = s;
    srcList.append(li);
  }

  const tick = document.createElement('button');
  tick.type = 'button';
  tick.className = 'tick-button';
  tick.textContent = earned ? '✓ Earned — tap to unmark' : 'Mark as earned';
  tick.addEventListener('click', () => state.toggleEarned(trophy.id));

  panel.append(close, badge, name, desc, meta, guideTitle, guide, srcTitle, srcList, tick);
  return panel;
}
