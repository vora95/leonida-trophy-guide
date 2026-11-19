// The platinum roadmap: six phases in the order this guide recommends earning
// the 55 trophies. Each phase names the trophies it covers (by id) and the
// one habit that matters most inside it. The order is built from the official
// descriptions alone: story first, because every story trophy is hidden and
// chapter-gated; collectibles after Chapter 2, when the whole map opens;
// money last, when robberies have filled the wallet.

export const PHASES = [
  {
    n: 0,
    title: 'Before you start',
    goal: 'Set up so nothing can be missed.',
    advice:
      'Turn the spoiler setting on if you want story trophies hidden until earned. ' +
      'Make a manual save at the start of every chapter — GTA 6 has no mission replay, ' +
      'so a chapter-start save is the only way back (Output Lag, 19 Nov 2026). ' +
      'Never turn on a cheat: PowerPyx reports cheats disable trophies, and you cannot ' +
      'save once one is used. Expect a long road — about 200 hours for the platinum ' +
      '(Output Lag) — so treat this as a tour of Leonida, not a sprint.',
    ids: [],
  },
  {
    n: 1,
    title: 'Phase 1 — Play the story',
    goal: 'Chapters 1–4 and the finale: 13 trophies.',
    advice:
      'Finish the story first. Every mission trophy unlocks on completion, so just play. ' +
      'Two things must not wait: in Chapter 1, meditate at the balcony spot for Positive ' +
      'Mental Attitude before the chapter ends — launch-day reporting says that spot is ' +
      'only reachable in Chapter 1 (Output Lag; KeenGamer). And save before the final ' +
      'mission, because the ending choice (Actions Speak Louder) sits behind it.',
    ids: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 48],
  },
  {
    n: 2,
    title: 'Phase 2 — Strangers & freaks',
    goal: '8 stranger strands: 7 trophies.',
    advice:
      'After the story, meet the strangers: Andy, Kenton, Billy, Randy, Tyrone and Bret ' +
      'each have a strand with a final-mission trophy, and two more strangers out in the ' +
      'world take you to the 8 strands Strangers & Freaks counts. Strands appear as you ' +
      'explore, so sweep regions you have not visited and take a strand whenever its ' +
      'marker appears.',
    ids: [22, 23, 24, 25, 26, 27, 29],
  },
  {
    n: 3,
    title: 'Phase 3 — Know Leonida',
    goal: 'Explore, collect, register: 8 trophies.',
    advice:
      'Drive every region until the map is bare — that is The Goodtime State, and it feeds ' +
      'the rest of this phase: 100 vehicles discovered (Whip It Good), 10 of them registered ' +
      'to the Scooter Bros app (On the Spot), WAiNK It at 100 spots (You WAiNKer!), 3 card ' +
      'sets (Don\'t Touch My Deck) and every meditation spot (Positive Mental Attitude). ' +
      'Do the meditation sweep last, so the Chapter 1 spot is already done.',
    ids: [28, 30, 31, 35, 42, 44, 55],
  },
  {
    n: 4,
    title: 'Phase 4 — Play the activities',
    goal: 'Races, ranges, stunts and odd jobs: 18 trophies.',
    advice:
      'Start with Master of None — one of each activity type — then go deep: 250 stunts ' +
      '(Cunning Stunts), gold in all 42 Shooting Range challenges (The Shootist), 20 ' +
      'different race wins (Earn Cash, Not Kudos), a drone-race win at every location ' +
      '(Top Fun), 50 challenges (One Last Thing), and the one-offs: fishing against Cal, ' +
      'an arcade game, a 4-star escape with your partner, five takedowns in one Combat ' +
      'Focus, and the beach, bowling and showroom moments. Nothing here is missable; ' +
      'every activity can be replayed.',
    ids: [15, 16, 17, 18, 19, 20, 21, 32, 33, 36, 37, 38, 45, 46, 47, 49, 50, 51],
  },
  {
    n: 5,
    title: 'Phase 5 — Get paid',
    goal: 'Robberies, laundering, spending: 8 trophies.',
    advice:
      'Hit the robbery list in any order: 5 bank vaults (Maximum Withdrawal), an armored ' +
      'truck (A Classic Blitz Play), a jewelry store without being seen (Sneakthief), one ' +
      'illegal operation per gang (Pest Control), and 3 shops back-to-back with your partner ' +
      'without losing the wanted level (Retail Therapy). Launder the Marked Bills through ' +
      'your contacts until $250,000 is clean (Dime on the Dollar), then spend $100,000 ' +
      'across the shops (Treat Yo Self) and buy every garage (Little Boxes).',
    ids: [34, 39, 40, 41, 43, 52, 53, 54],
  },
  {
    n: 6,
    title: 'Phase 6 — The last two',
    goal: '100% completion, then the platinum.',
    advice:
      'With 53 trophies earned, open the in-game 100% checklist: Rockstar has not published ' +
      'what it covers (planetgta6, 18 Nov 2026), but the visible trophies map it — story, ' +
      'strands, collectibles, activities and full exploration. Finish whatever it still ' +
      'lists for A Long Road, and Vice Got a Price! pops with it. Leonida Legend.',
    ids: [14, 1],
  },
];

export function phaseOf(trophy) {
  return PHASES.find((p) => p.ids.includes(trophy.id)) ?? PHASES[0];
}
