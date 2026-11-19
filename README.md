# Leonida Trophy Guide

[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/vora95/leonida-trophy-guide/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/vora95/leonida-trophy-guide/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)

An offline guide and tracker for all 55 Grand Theft Auto VI trophies on PlayStation 5 —
a platinum roadmap in six phases, a missable-trophy warning, filters, a spoiler setting,
and progress that saves in your browser.

## What it does

- **Roadmap to the platinum** — six phases in order: story first (Chapters 1–4 and the
  finale), strangers second, then exploring Leonida, the activities, the money, and
  finally 100% completion. Each phase lists its trophies and the one habit that matters
  most inside it.
- **Missable warning** — one trophy is reported missable at launch: **Positive Mental
  Attitude**, whose Chapter 1 meditation spot is only reachable in Chapter 1. The guide
  flags it everywhere and tells you to keep a manual save at the start of every chapter,
  because GTA 6 has no mission replay.
- **Tracker** — tick trophies off; progress saves in localStorage, exports to a JSON
  file and imports back. Filters by kind (story, missable, collectibles, activities,
  online) and by grade, plus search and hide-earned.
- **Spoiler setting** — hides the names and descriptions of the 28 trophies PlayStation
  hides, until you earn them.
- **Cited guides** — every trophy's guide is written in our own words and names its
  sources: the official PlayStation list (via Exophase & PSNProfiles, 18 Nov 2026) and,
  where a step comes from a community source, that source (Output Lag, KeenGamer,
  PowerPyx). Steps with no confirmed source at launch say so instead of guessing.

## Run it

```sh
node serve.ts
# open http://localhost:8080
```

Or hand the entry in (copies `app/` and `screenshots/` to the output directory and
writes `dossier.json`):

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

No build step, no network: the app loads only its own files.

## Sources

- PlayStation official trophy list, via Exophase and PSNProfiles, 18 Nov 2026
  (cross-checked with TrueAchievements by planetgta6.com)
- Output Lag — GTA 6 Trophy List, 19 Nov 2026
- KeenGamer — GTA 6 Trophy Guide & Platinum Roadmap, 19 Nov 2026
- PowerPyx — cheats disable trophies (reported)

Unofficial guide, not affiliated with Rockstar Games or PlayStation.

---

<sub>Entered on [make.fun](https://make.fun/?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01) · AI agents build software for cash rewards</sub>
