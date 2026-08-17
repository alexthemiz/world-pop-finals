# Evergreen Trivia Kicks Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Transform Trivia Kicks from WC2026-specific into a year-round country trivia game with tournament archive pages, all ~211 FIFA nations, and H2H soccer history on the results screen.

**Architecture:** Nullable `CountryStats` fields allow thin-data nations; shared `TournamentPage` component driven by typed config files; new evergreen main page with searchable dropdowns; `country_h2h` Supabase table populated from Kaggle CSV; H2H panel on game-over screen.

**Tech Stack:** Next.js App Router, TypeScript, Supabase, inline CSS only (no Tailwind), Press Start 2P font

---

### Task 0: Make CountryStats fields nullable + filter in question generation

Allows nations with missing data to participate — questions for null fields are simply skipped.

**Files:**
- Modify: `lib/countries.ts` — `CountryStats` interface
- Modify: `lib/questions.ts` — `allQuestionsForMatch`, `makeStatQuestion`

**Step 1: Make all stat fields optional/nullable in the interface**

In `lib/countries.ts`, change the `CountryStats` interface so every numeric field is `number | null`. The `pop`, `area`, `founded` fields should stay required (used for display, not just questions). Everything else becomes nullable:

```typescript
export interface CountryStats {
  pop: number;
  area: number;
  founded: number;
  gdp: number | null;
  lifeExp: number | null;
  medianAge: number | null;
  co2pc: number | null;
  unesco: number | null;
  fifa: number | null;
  wcApps: number | null;
  nobel: number | null;
  unemployment: number | null;
  elevation: number | null;
  forest: number | null;
  coastline: number | null;
  fertilityRate: number | null;
  obesityRate: number | null;
  happinessScore: number | null;
  birdSpecies: number | null;
  firearmsRate: number | null;
  teaPc: number | null;
  publicHolidays: number | null;
  internetSpeed: number | null;
  renewableEnergy: number | null;
  prisonRate: number | null;
  homicideRate: number | null;
  tourists: number | null;
  languages: number | null;
  precipitation: number | null;
  coffeePc: number | null;
  cheesePc: number | null;
  honeyProduction: number | null;
  hospitalBeds: number | null;
  avgSchooling: number | null;
  electricityPc: number | null;
  roadLength: number | null;
  threatenedSpecies: number | null;
  protectedLand: number | null;
  disasterRisk: number | null;
}
```

**Step 2: Update `allQuestionsForMatch` in `lib/questions.ts` to skip null-valued question types**

The existing check `qType.getValue(home) !== qType.getValue(away)` already skips ties. Add a null check before it:

```typescript
function allQuestionsForMatch(match: MatchPair): Question[] {
  const { home, away } = match;
  const questions: Question[] = [];
  QUESTION_TYPES.forEach((qType, i) => {
    const homeValue = qType.getValue(home);
    const awayValue = qType.getValue(away);
    if (homeValue === null || awayValue === null) return;
    if (homeValue !== awayValue) {
      questions.push(makeStatQuestion(match, i));
    }
  });
  const diaspora = makeDiasporaQuestion(match);
  if (diaspora) questions.push(diaspora);
  return shuffle(questions);
}
```

**Step 3: Update `makeStatQuestion` to handle nullable getValue**

`getValue` in `QUESTION_TYPES` returns `number` currently. After the interface change, TypeScript will complain when passing nullable values. The null guard in `allQuestionsForMatch` prevents null values from reaching `makeStatQuestion`, but you need to tell TypeScript that. The simplest fix: assert non-null inside `makeStatQuestion`, since it is only called after the null check:

```typescript
function makeStatQuestion(match: MatchPair, qTypeIndex: number): Question {
  const { home, away, group } = match;
  const qType = QUESTION_TYPES[qTypeIndex];
  const homeValue = qType.getValue(home)!;
  const awayValue = qType.getValue(away)!;
  // ... rest unchanged
}
```

Also update `getValue` in `QUESTION_TYPES` (in `lib/countries.ts`) to return `number | null`. Each entry currently does something like `getValue: (c) => COUNTRIES[c].gdp`. After the interface change these will naturally return `number | null`.

**Step 4: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```
Expected: no errors

**Step 5: Commit**

```bash
git add lib/countries.ts lib/questions.ts
git commit -m "feat: make CountryStats fields nullable, skip null fields in question generation"
```

---

### Task 1: Tournament config type system + migrate WC2026 data

Creates the shared config structure that all tournament pages use.

**Files:**
- Create: `lib/tournaments/types.ts`
- Create: `lib/tournaments/wc2026.ts`
- Create: `lib/tournaments/index.ts`
- Modify: `lib/knockoutMatches.ts` — re-export from new location for backward compat

**Step 1: Create `lib/tournaments/types.ts`**

```typescript
import type { Match } from "@/lib/matches";

export interface TournamentConfig {
  id: string;                  // used in URL: /wc2026
  name: string;                // "FIFA World Cup 2026"
  shortName: string;           // "WC 2026"
  hosts: string;               // "USA / Canada / Mexico"
  year: number;
  emoji: string;               // "🏆"
  nations: string[];           // all participating nations
  groups: Match[];             // group stage fixtures + results
  knockoutRounds: string[];    // ordered list of round names for dropdown
  knockout: Match[];           // knockout bracket entries
  finalsMatch?: { home: string; away: string }; // for quick-pick button
}
```

**Step 2: Create `lib/tournaments/wc2026.ts`**

Move the existing data from `lib/knockoutMatches.ts` and `lib/matches.ts` into a config object. The `nations` array is all 48 WC2026 participants. The `groups` array is the existing `MATCHES` array from `lib/matches.ts`. The `knockout` array is the existing `KNOCKOUT_MATCHES` from `lib/knockoutMatches.ts`.

```typescript
import type { TournamentConfig } from "./types";
import { MATCHES } from "@/lib/matches";
import { KNOCKOUT_MATCHES, KNOCKOUT_ROUNDS } from "@/lib/knockoutMatches";

export const wc2026: TournamentConfig = {
  id: "wc2026",
  name: "FIFA World Cup 2026",
  shortName: "WC 2026",
  hosts: "USA / Canada / Mexico",
  year: 2026,
  emoji: "🏆",
  nations: [
    "Mexico", "USA", "Canada", "Brazil", "Argentina", "Uruguay", "Colombia",
    "Ecuador", "Chile", "Paraguay", "Bolivia", "Venezuela", "Peru",
    "France", "Germany", "Spain", "Portugal", "Netherlands", "Belgium",
    "England", "Scotland", "Croatia", "Switzerland", "Austria", "Serbia",
    "Turkey", "Norway", "Sweden", "Slovakia", "Czechia", "Hungary",
    "Albania", "Slovenia", "Georgia", "Romania", "Ukraine", "Morocco",
    "Senegal", "Nigeria", "Egypt", "South Africa", "Cameroon", "Ivory Coast",
    "Mali", "DR Congo", "Algeria", "Tunisia", "Cabo Verde",
    "Saudi Arabia", "Iran", "Australia", "Japan", "South Korea",
    "New Zealand", "Indonesia", "Qatar", "Curaçao", "Bosnia", "Paraguay",
    "Haiti",
  ],
  groups: MATCHES,
  knockoutRounds: KNOCKOUT_ROUNDS,
  knockout: KNOCKOUT_MATCHES,
  finalsMatch: { home: "Spain", away: "Argentina" },
};
```

Note: keep `lib/matches.ts` and `lib/knockoutMatches.ts` unchanged — they're still imported by the game pages and question logic. This config just references them.

**Step 3: Create `lib/tournaments/index.ts`**

```typescript
export { wc2026 } from "./wc2026";
export type { TournamentConfig } from "./types";

import { wc2026 } from "./wc2026";
import type { TournamentConfig } from "./types";

export const TOURNAMENTS: TournamentConfig[] = [
  wc2026,
  // wc2022 and wwc2023 added in Tasks 2 and 3
];
```

**Step 4: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

**Step 5: Commit**

```bash
git add lib/tournaments/
git commit -m "feat: tournament config type system, migrate WC2026 data"
```

---

### Task 2: WC2022 tournament data

**Files:**
- Create: `lib/tournaments/wc2022.ts`
- Modify: `lib/tournaments/index.ts`

**Step 1: Research WC2022 structure**

Qatar 2022: 32 nations, 8 groups (A–H), Round of 16 → QF → SF → 3rd Place → Final.
- Winner: Argentina (beat France 3-3 AET, 4-2 pens in Final)
- Third Place: Croatia beat Morocco 2-1
- Semis: Argentina beat Croatia 3-0; France beat Morocco 2-0
- Host: Qatar

**Step 2: Create `lib/tournaments/wc2022.ts`**

This file needs the full 48 group-stage matches (6 per group × 8 groups) plus knockout bracket. Structure mirrors `lib/matches.ts` and `lib/knockoutMatches.ts`. Write the complete data:

```typescript
import type { TournamentConfig } from "./types";
import type { Match } from "@/lib/matches";

const GROUPS: Match[] = [
  // Group A (Qatar, Ecuador, Senegal, Netherlands)
  { group: "A", home: "Qatar", away: "Ecuador", date: "Sun Nov 20", time: "11:00 AM ET", venue: "Al Bayt Stadium", result: "0-2" },
  { group: "A", home: "Senegal", away: "Netherlands", date: "Mon Nov 21", time: "11:00 AM ET", venue: "Al Thumama Stadium", result: "0-2" },
  { group: "A", home: "Qatar", away: "Senegal", date: "Fri Nov 25", time: "11:00 AM ET", venue: "Al Thumama Stadium", result: "1-3" },
  { group: "A", home: "Netherlands", away: "Ecuador", date: "Fri Nov 25", time: "2:00 PM ET", venue: "Khalifa International Stadium", result: "1-1" },
  { group: "A", home: "Ecuador", away: "Senegal", date: "Tue Nov 29", time: "10:00 AM ET", venue: "Khalifa International Stadium", result: "1-2" },
  { group: "A", home: "Netherlands", away: "Qatar", date: "Tue Nov 29", time: "10:00 AM ET", venue: "Al Bayt Stadium", result: "2-0" },

  // Group B (England, Iran, USA, Wales)
  { group: "B", home: "England", away: "Iran", date: "Mon Nov 21", time: "2:00 PM ET", venue: "Khalifa International Stadium", result: "6-2" },
  { group: "B", home: "USA", away: "Wales", date: "Mon Nov 21", time: "2:00 PM ET", venue: "Ahmad bin Ali Stadium", result: "1-1" },
  { group: "B", home: "Wales", away: "Iran", date: "Fri Nov 25", time: "8:00 AM ET", venue: "Ahmad bin Ali Stadium", result: "0-2" },
  { group: "B", home: "England", away: "USA", date: "Fri Nov 25", time: "2:00 PM ET", venue: "Al Bayt Stadium", result: "0-0" },
  { group: "B", home: "Wales", away: "England", date: "Tue Nov 29", time: "2:00 PM ET", venue: "Ahmad bin Ali Stadium", result: "0-3" },
  { group: "B", home: "Iran", away: "USA", date: "Tue Nov 29", time: "2:00 PM ET", venue: "Al Thumama Stadium", result: "0-1" },

  // Group C (Argentina, Saudi Arabia, Mexico, Poland)
  { group: "C", home: "Argentina", away: "Saudi Arabia", date: "Tue Nov 22", time: "5:00 AM ET", venue: "Lusail Stadium", result: "1-2" },
  { group: "C", home: "Poland", away: "Mexico", date: "Tue Nov 22", time: "11:00 AM ET", venue: "Stadium 974", result: "0-0" },
  { group: "C", home: "Argentina", away: "Mexico", date: "Sat Nov 26", time: "2:00 PM ET", venue: "Lusail Stadium", result: "2-0" },
  { group: "C", home: "Saudi Arabia", away: "Poland", date: "Sat Nov 26", time: "8:00 AM ET", venue: "Education City Stadium", result: "0-2" },
  { group: "C", home: "Argentina", away: "Poland", date: "Wed Nov 30", time: "2:00 PM ET", venue: "Stadium 974", result: "2-0" },
  { group: "C", home: "Mexico", away: "Saudi Arabia", date: "Wed Nov 30", time: "2:00 PM ET", venue: "Lusail Stadium", result: "2-1" },

  // Group D (France, Australia, Denmark, Tunisia)
  { group: "D", home: "France", away: "Australia", date: "Tue Nov 22", time: "2:00 PM ET", venue: "Al Janoub Stadium", result: "4-1" },
  { group: "D", home: "Denmark", away: "Tunisia", date: "Tue Nov 22", time: "8:00 AM ET", venue: "Education City Stadium", result: "0-0" },
  { group: "D", home: "France", away: "Denmark", date: "Sat Nov 26", time: "11:00 AM ET", venue: "Stadium 974", result: "2-1" },
  { group: "D", home: "Tunisia", away: "Australia", date: "Sat Nov 26", time: "5:00 AM ET", venue: "Al Janoub Stadium", result: "0-1" },
  { group: "D", home: "Australia", away: "Denmark", date: "Wed Nov 30", time: "10:00 AM ET", venue: "Al Janoub Stadium", result: "1-0" },
  { group: "D", home: "Tunisia", away: "France", date: "Wed Nov 30", time: "10:00 AM ET", venue: "Education City Stadium", result: "1-0" },

  // Group E (Spain, Costa Rica, Germany, Japan)
  { group: "E", home: "Spain", away: "Costa Rica", date: "Wed Nov 23", time: "11:00 AM ET", venue: "Al Thumama Stadium", result: "7-0" },
  { group: "E", home: "Japan", away: "Germany", date: "Wed Nov 23", time: "2:00 PM ET", venue: "Khalifa International Stadium", result: "2-1" },
  { group: "E", home: "Spain", away: "Germany", date: "Sun Nov 27", time: "2:00 PM ET", venue: "Al Bayt Stadium", result: "1-1" },
  { group: "E", home: "Japan", away: "Costa Rica", date: "Sun Nov 27", time: "5:00 AM ET", venue: "Ahmad bin Ali Stadium", result: "0-1" },
  { group: "E", home: "Japan", away: "Spain", date: "Thu Dec 1", time: "2:00 PM ET", venue: "Khalifa International Stadium", result: "2-1" },
  { group: "E", home: "Costa Rica", away: "Germany", date: "Thu Dec 1", time: "2:00 PM ET", venue: "Al Bayt Stadium", result: "2-4" },

  // Group F (Belgium, Canada, Morocco, Croatia)
  { group: "F", home: "Belgium", away: "Canada", date: "Wed Nov 23", time: "5:00 AM ET", venue: "Ahmad bin Ali Stadium", result: "1-0" },
  { group: "F", home: "Morocco", away: "Croatia", date: "Wed Nov 23", time: "8:00 AM ET", venue: "Al Bayt Stadium", result: "0-0" },
  { group: "F", home: "Belgium", away: "Morocco", date: "Sun Nov 27", time: "8:00 AM ET", venue: "Al Thumama Stadium", result: "0-2" },
  { group: "F", home: "Croatia", away: "Canada", date: "Sun Nov 27", time: "11:00 AM ET", venue: "Khalifa International Stadium", result: "4-1" },
  { group: "F", home: "Croatia", away: "Belgium", date: "Thu Dec 1", time: "10:00 AM ET", venue: "Ahmad bin Ali Stadium", result: "0-0" },
  { group: "F", home: "Morocco", away: "Canada", date: "Thu Dec 1", time: "10:00 AM ET", venue: "Al Thumama Stadium", result: "2-1" },

  // Group G (Brazil, Serbia, Switzerland, Cameroon)
  { group: "G", home: "Brazil", away: "Serbia", date: "Thu Nov 24", time: "2:00 PM ET", venue: "Lusail Stadium", result: "2-0" },
  { group: "G", home: "Switzerland", away: "Cameroon", date: "Thu Nov 24", time: "8:00 AM ET", venue: "Al Janoub Stadium", result: "1-0" },
  { group: "G", home: "Brazil", away: "Switzerland", date: "Mon Nov 28", time: "2:00 PM ET", venue: "Stadium 974", result: "1-0" },
  { group: "G", home: "Cameroon", away: "Serbia", date: "Mon Nov 28", time: "8:00 AM ET", venue: "Al Janoub Stadium", result: "3-3" },
  { group: "G", home: "Cameroon", away: "Brazil", date: "Fri Dec 2", time: "2:00 PM ET", venue: "Lusail Stadium", result: "1-0" },
  { group: "G", home: "Serbia", away: "Switzerland", date: "Fri Dec 2", time: "2:00 PM ET", venue: "Stadium 974", result: "2-3" },

  // Group H (Portugal, Ghana, Uruguay, South Korea)
  { group: "H", home: "Portugal", away: "Ghana", date: "Thu Nov 24", time: "11:00 AM ET", venue: "Stadium 974", result: "3-2" },
  { group: "H", home: "South Korea", away: "Uruguay", date: "Thu Nov 24", time: "5:00 AM ET", venue: "Education City Stadium", result: "0-0" },
  { group: "H", home: "Portugal", away: "Uruguay", date: "Mon Nov 28", time: "11:00 AM ET", venue: "Lusail Stadium", result: "2-0" },
  { group: "H", home: "South Korea", away: "Ghana", date: "Mon Nov 28", time: "5:00 AM ET", venue: "Education City Stadium", result: "2-3" },
  { group: "H", home: "South Korea", away: "Portugal", date: "Fri Dec 2", time: "10:00 AM ET", venue: "Education City Stadium", result: "2-1" },
  { group: "H", home: "Uruguay", away: "Ghana", date: "Fri Dec 2", time: "10:00 AM ET", venue: "Al Janoub Stadium", result: "2-0" },
];

const KNOCKOUT: Match[] = [
  { group: "Final", home: "Argentina", away: "France", date: "Sun Dec 18", time: "10:00 AM ET", venue: "Lusail Stadium", result: "3-3 AET", penaltyWinner: "Argentina", penaltyScore: "4-2" },
  { group: "Third Place", home: "Croatia", away: "Morocco", date: "Sat Dec 17", time: "10:00 AM ET", venue: "Khalifa International Stadium", result: "2-1" },
  { group: "Semifinals", home: "Argentina", away: "Croatia", date: "Tue Dec 13", time: "2:00 PM ET", venue: "Lusail Stadium", result: "3-0" },
  { group: "Semifinals", home: "France", away: "Morocco", date: "Wed Dec 14", time: "2:00 PM ET", venue: "Al Bayt Stadium", result: "2-0" },
  { group: "Quarterfinals", home: "Croatia", away: "Brazil", date: "Fri Dec 9", time: "2:00 PM ET", venue: "Education City Stadium", result: "1-1 AET", penaltyWinner: "Croatia", penaltyScore: "4-2" },
  { group: "Quarterfinals", home: "Netherlands", away: "Argentina", date: "Fri Dec 9", time: "10:00 AM ET", venue: "Lusail Stadium", result: "2-2 AET", penaltyWinner: "Argentina", penaltyScore: "4-3" },
  { group: "Quarterfinals", home: "Morocco", away: "Portugal", date: "Sat Dec 10", time: "2:00 PM ET", venue: "Al Thumama Stadium", result: "1-0" },
  { group: "Quarterfinals", home: "England", away: "France", date: "Sat Dec 10", time: "10:00 AM ET", venue: "Al Bayt Stadium", result: "1-2" },
  { group: "Round of 16", home: "Netherlands", away: "USA", date: "Sat Dec 3", time: "10:00 AM ET", venue: "Khalifa International Stadium", result: "3-1" },
  { group: "Round of 16", home: "Argentina", away: "Australia", date: "Sat Dec 3", time: "2:00 PM ET", venue: "Ahmad bin Ali Stadium", result: "2-1" },
  { group: "Round of 16", home: "France", away: "Poland", date: "Sun Dec 4", time: "10:00 AM ET", venue: "Al Thumama Stadium", result: "3-1" },
  { group: "Round of 16", home: "England", away: "Senegal", date: "Sun Dec 4", time: "2:00 PM ET", venue: "Al Bayt Stadium", result: "3-0" },
  { group: "Round of 16", home: "Japan", away: "Croatia", date: "Mon Dec 5", time: "10:00 AM ET", venue: "Al Janoub Stadium", result: "1-1 AET", penaltyWinner: "Croatia", penaltyScore: "3-1" },
  { group: "Round of 16", home: "Brazil", away: "South Korea", date: "Mon Dec 5", time: "2:00 PM ET", venue: "Stadium 974", result: "4-1" },
  { group: "Round of 16", home: "Morocco", away: "Spain", date: "Tue Dec 6", time: "10:00 AM ET", venue: "Education City Stadium", result: "0-0 AET", penaltyWinner: "Morocco", penaltyScore: "3-0" },
  { group: "Round of 16", home: "Portugal", away: "Switzerland", date: "Tue Dec 6", time: "2:00 PM ET", venue: "Lusail Stadium", result: "6-1" },
];

export const wc2022: TournamentConfig = {
  id: "wc2022",
  name: "FIFA World Cup 2022",
  shortName: "WC 2022",
  hosts: "Qatar",
  year: 2022,
  emoji: "🏆",
  nations: [
    "Qatar", "Ecuador", "Senegal", "Netherlands", "England", "Iran", "USA",
    "Wales", "Argentina", "Saudi Arabia", "Mexico", "Poland", "France",
    "Australia", "Denmark", "Tunisia", "Spain", "Costa Rica", "Germany",
    "Japan", "Belgium", "Canada", "Morocco", "Croatia", "Brazil", "Serbia",
    "Switzerland", "Cameroon", "Portugal", "Ghana", "Uruguay", "South Korea",
  ],
  groups: GROUPS,
  knockoutRounds: ["Final", "Third Place", "Semifinals", "Quarterfinals", "Round of 16"],
  knockout: KNOCKOUT,
  finalsMatch: { home: "Argentina", away: "France" },
};
```

**Step 3: Add wc2022 to `lib/tournaments/index.ts`**

```typescript
export { wc2026 } from "./wc2026";
export { wc2022 } from "./wc2022";
export type { TournamentConfig } from "./types";

import { wc2026 } from "./wc2026";
import { wc2022 } from "./wc2022";
import type { TournamentConfig } from "./types";

export const TOURNAMENTS: TournamentConfig[] = [wc2026, wc2022];
```

**Step 4: Verify TypeScript**

```bash
npx tsc --noEmit
```

**Step 5: Commit**

```bash
git add lib/tournaments/
git commit -m "feat: add WC2022 tournament config (Qatar)"
```

---

### Task 3: WWC2023 tournament data

**Files:**
- Create: `lib/tournaments/wwc2023.ts`
- Modify: `lib/tournaments/index.ts`

**Step 1: Key facts**

Australia/New Zealand 2023: 32 nations, 8 groups (A–H), Round of 16 → QF → SF → 3rd Place → Final.
- Winner: Spain (beat England 1-0 in Final)
- Third Place: Sweden beat Australia 2-0
- Semis: Spain beat Sweden 2-1; Australia beat France 0-0 AET (7-6 pens)
- Co-hosts: Australia, New Zealand

**Step 2: Create `lib/tournaments/wwc2023.ts`**

Same structure as wc2022.ts. Full 48 group matches + knockout:

```typescript
import type { TournamentConfig } from "./types";
import type { Match } from "@/lib/matches";

const GROUPS: Match[] = [
  // Group A (New Zealand, Norway, Philippines, Switzerland)
  { group: "A", home: "New Zealand", away: "Norway", date: "Thu Jul 20", time: "3:00 AM ET", venue: "Eden Park, Auckland", result: "1-0" },
  { group: "A", home: "Philippines", away: "Switzerland", date: "Thu Jul 20", time: "6:00 AM ET", venue: "Dunedin Stadium", result: "0-2" },
  { group: "A", home: "New Zealand", away: "Philippines", date: "Mon Jul 25", time: "3:00 AM ET", venue: "Wellington Regional Stadium", result: "1-0" },
  { group: "A", home: "Switzerland", away: "Norway", date: "Mon Jul 25", time: "6:00 AM ET", venue: "Eden Park, Auckland", result: "0-0" },
  { group: "A", home: "Switzerland", away: "New Zealand", date: "Sat Jul 29", time: "3:00 AM ET", venue: "Dunedin Stadium", result: "0-0" },
  { group: "A", home: "Norway", away: "Philippines", date: "Sat Jul 29", time: "3:00 AM ET", venue: "Eden Park, Auckland", result: "6-0" },

  // Group B (Australia, Ireland, Nigeria, Canada)
  { group: "B", home: "Australia", away: "Ireland", date: "Thu Jul 20", time: "9:00 AM ET", venue: "Stadium Australia, Sydney", result: "1-0" },
  { group: "B", home: "Nigeria", away: "Canada", date: "Thu Jul 20", time: "6:00 AM ET", venue: "Melbourne Rectangular Stadium", result: "0-0" },
  { group: "B", home: "Canada", away: "Ireland", date: "Mon Jul 24", time: "3:00 AM ET", venue: "Perth Rectangular Stadium", result: "2-1" },  // Canada lost later via points but won this match
  { group: "B", home: "Australia", away: "Nigeria", date: "Mon Jul 24", time: "6:00 AM ET", venue: "Brisbane Stadium", result: "3-2" },
  { group: "B", home: "Australia", away: "Canada", date: "Fri Jul 28", time: "6:00 AM ET", venue: "Melbourne Rectangular Stadium", result: "4-0" },
  { group: "B", home: "Nigeria", away: "Ireland", date: "Fri Jul 28", time: "6:00 AM ET", venue: "Brisbane Stadium", result: "1-0" },

  // Group C (Spain, Costa Rica, Zambia, Japan)
  { group: "C", home: "Spain", away: "Costa Rica", date: "Fri Jul 21", time: "3:00 AM ET", venue: "Wellington Regional Stadium", result: "3-0" },
  { group: "C", home: "Japan", away: "Zambia", date: "Fri Jul 21", time: "6:00 AM ET", venue: "Waikato Stadium, Hamilton", result: "5-0" },
  { group: "C", home: "Spain", away: "Zambia", date: "Tue Jul 25", time: "6:00 AM ET", venue: "Eden Park, Auckland", result: "5-0" },
  { group: "C", home: "Japan", away: "Costa Rica", date: "Tue Jul 25", time: "3:00 AM ET", venue: "Dunedin Stadium", result: "2-0" },
  { group: "C", home: "Japan", away: "Spain", date: "Sat Jul 29", time: "3:00 AM ET", venue: "Wellington Regional Stadium", result: "4-0" },
  { group: "C", home: "Zambia", away: "Costa Rica", date: "Sat Jul 29", time: "3:00 AM ET", venue: "Waikato Stadium, Hamilton", result: "3-4" },

  // Group D (England, Haiti, Denmark, China)
  { group: "D", home: "England", away: "Haiti", date: "Sat Jul 22", time: "9:00 AM ET", venue: "Brisbane Stadium", result: "1-0" },
  { group: "D", home: "Denmark", away: "China", date: "Sat Jul 22", time: "3:00 AM ET", venue: "Perth Rectangular Stadium", result: "1-0" },
  { group: "D", home: "England", away: "Denmark", date: "Fri Jul 28", time: "9:00 AM ET", venue: "Stadium Australia, Sydney", result: "1-0" },
  { group: "D", home: "China", away: "Haiti", date: "Fri Jul 28", time: "3:00 AM ET", venue: "Adelaide Oval", result: "1-0" },
  { group: "D", home: "England", away: "China", date: "Tue Aug 1", time: "9:00 AM ET", venue: "Hindmarsh Stadium, Adelaide", result: "6-1" },
  { group: "D", home: "Haiti", away: "Denmark", date: "Tue Aug 1", time: "6:00 AM ET", venue: "Perth Rectangular Stadium", result: "0-2" },

  // Group E (USA, Vietnam, Netherlands, Portugal)
  { group: "E", home: "USA", away: "Vietnam", date: "Fri Jul 21", time: "9:00 AM ET", venue: "Eden Park, Auckland", result: "3-0" },
  { group: "E", home: "Netherlands", away: "Portugal", date: "Fri Jul 21", time: "6:00 AM ET", venue: "Dunedin Stadium", result: "1-0" },
  { group: "E", home: "USA", away: "Netherlands", date: "Wed Jul 26", time: "9:00 AM ET", venue: "Wellington Regional Stadium", result: "1-1" },
  { group: "E", home: "Portugal", away: "Vietnam", date: "Wed Jul 26", time: "3:00 AM ET", venue: "Waikato Stadium, Hamilton", result: "0-2" },
  { group: "E", home: "USA", away: "Portugal", date: "Tue Aug 1", time: "3:00 AM ET", venue: "Eden Park, Auckland", result: "0-0" },
  { group: "E", home: "Netherlands", away: "Vietnam", date: "Tue Aug 1", time: "6:00 AM ET", venue: "Dunedin Stadium", result: "7-0" },

  // Group F (France, Jamaica, Brazil, Panama)
  { group: "F", home: "France", away: "Jamaica", date: "Sun Jul 23", time: "6:00 AM ET", venue: "Stadium Australia, Sydney", result: "2-0" },
  { group: "F", home: "Brazil", away: "Panama", date: "Sun Jul 23", time: "3:00 AM ET", venue: "Hindmarsh Stadium, Adelaide", result: "4-0" },
  { group: "F", home: "France", away: "Brazil", date: "Thu Jul 27", time: "9:00 AM ET", venue: "Brisbane Stadium", result: "2-1" },
  { group: "F", home: "Jamaica", away: "Panama", date: "Thu Jul 27", time: "3:00 AM ET", venue: "Perth Rectangular Stadium", result: "1-1" },
  { group: "F", home: "France", away: "Panama", date: "Wed Aug 2", time: "3:00 AM ET", venue: "Waikato Stadium, Hamilton", result: "6-3" },
  { group: "F", home: "Brazil", away: "Jamaica", date: "Wed Aug 2", time: "3:00 AM ET", venue: "Melbourne Rectangular Stadium", result: "0-0" },

  // Group G (Sweden, South Africa, Italy, Argentina)
  { group: "G", home: "Sweden", away: "South Africa", date: "Sun Jul 23", time: "9:00 AM ET", venue: "Wellington Regional Stadium", result: "2-1" },
  { group: "G", home: "Italy", away: "Argentina", date: "Mon Jul 24", time: "9:00 AM ET", venue: "Eden Park, Auckland", result: "1-0" },
  { group: "G", home: "Sweden", away: "Italy", date: "Fri Jul 28", time: "9:00 AM ET", venue: "Wellington Regional Stadium", result: "5-0" },
  { group: "G", home: "South Africa", away: "Argentina", date: "Fri Jul 28", time: "9:00 AM ET", venue: "Dunedin Stadium", result: "2-2" },
  { group: "G", home: "Sweden", away: "Argentina", date: "Wed Aug 2", time: "9:00 AM ET", venue: "Stadium Australia, Sydney", result: "2-0" },
  { group: "G", home: "South Africa", away: "Italy", date: "Wed Aug 2", time: "6:00 AM ET", venue: "Wellington Regional Stadium", result: "3-2" },

  // Group H (Germany, Morocco, Colombia, South Korea)
  { group: "H", home: "Germany", away: "Morocco", date: "Mon Jul 24", time: "12:00 PM ET", venue: "Melbourne Rectangular Stadium", result: "6-0" },
  { group: "H", home: "Colombia", away: "South Korea", date: "Mon Jul 24", time: "3:00 AM ET", venue: "Stadium Australia, Sydney", result: "2-0" },
  { group: "H", home: "Germany", away: "Colombia", date: "Sat Jul 29", time: "9:00 AM ET", venue: "Stadium Australia, Sydney", result: "1-2" },
  { group: "H", home: "South Korea", away: "Morocco", date: "Sat Jul 29", time: "6:00 AM ET", venue: "Hindmarsh Stadium, Adelaide", result: "1-0" },
  { group: "H", home: "Germany", away: "South Korea", date: "Thu Aug 3", time: "6:00 AM ET", venue: "Brisbane Stadium", result: "1-1" },
  { group: "H", home: "Colombia", away: "Morocco", date: "Thu Aug 3", time: "6:00 AM ET", venue: "Melbourne Rectangular Stadium", result: "1-0" },
];

const KNOCKOUT: Match[] = [
  { group: "Final", home: "Spain", away: "England", date: "Sun Aug 20", time: "6:00 AM ET", venue: "Stadium Australia, Sydney", result: "1-0" },
  { group: "Third Place", home: "Sweden", away: "Australia", date: "Sat Aug 19", time: "5:00 AM ET", venue: "Lang Park, Brisbane", result: "2-0" },
  { group: "Semifinals", home: "Spain", away: "Sweden", date: "Tue Aug 15", time: "6:00 AM ET", venue: "Eden Park, Auckland", result: "2-1" },
  { group: "Semifinals", home: "Australia", away: "England", date: "Wed Aug 16", time: "6:00 AM ET", venue: "Stadium Australia, Sydney", result: "1-3" },
  { group: "Quarterfinals", home: "Spain", away: "Netherlands", date: "Fri Aug 11", time: "6:00 AM ET", venue: "Stadium Australia, Sydney", result: "2-1" },
  { group: "Quarterfinals", home: "Japan", away: "Sweden", date: "Fri Aug 11", time: "3:00 AM ET", venue: "Eden Park, Auckland", result: "1-2" },
  { group: "Quarterfinals", home: "Australia", away: "France", date: "Sat Aug 12", time: "6:00 AM ET", venue: "Brisbane Stadium", result: "0-0 AET", penaltyWinner: "Australia", penaltyScore: "7-6" },
  { group: "Quarterfinals", home: "England", away: "Colombia", date: "Sat Aug 12", time: "3:00 AM ET", venue: "Stadium Australia, Sydney", result: "2-1 AET" },
  { group: "Round of 16", home: "Switzerland", away: "Spain", date: "Sat Aug 5", time: "3:00 AM ET", venue: "Eden Park, Auckland", result: "1-5" },
  { group: "Round of 16", home: "Japan", away: "Norway", date: "Sat Aug 5", time: "6:00 AM ET", venue: "Wellington Regional Stadium", result: "3-1" },
  { group: "Round of 16", home: "Australia", away: "Denmark", date: "Mon Aug 7", time: "6:00 AM ET", venue: "Stadium Australia, Sydney", result: "2-0" },
  { group: "Round of 16", home: "England", away: "Nigeria", date: "Mon Aug 7", time: "3:00 AM ET", venue: "Brisbane Stadium", result: "0-0 AET", penaltyWinner: "England", penaltyScore: "4-2" },
  { group: "Round of 16", home: "Colombia", away: "Jamaica", date: "Tue Aug 8", time: "3:00 AM ET", venue: "Melbourne Rectangular Stadium", result: "1-0" },
  { group: "Round of 16", home: "France", away: "Morocco", date: "Tue Aug 8", time: "6:00 AM ET", venue: "Hindmarsh Stadium, Adelaide", result: "4-0" },
  { group: "Round of 16", home: "Netherlands", away: "South Africa", date: "Wed Aug 9", time: "3:00 AM ET", venue: "Cape Town Stadium", result: "2-0" },
  { group: "Round of 16", home: "Sweden", away: "USA", date: "Sun Aug 6", time: "9:00 AM ET", venue: "Melbourne Rectangular Stadium", result: "0-0 AET", penaltyWinner: "Sweden", penaltyScore: "5-4" },
];

export const wwc2023: TournamentConfig = {
  id: "wwc2023",
  name: "FIFA Women's World Cup 2023",
  shortName: "WWC 2023",
  hosts: "Australia / New Zealand",
  year: 2023,
  emoji: "🏆",
  nations: [
    "New Zealand", "Norway", "Philippines", "Switzerland", "Australia",
    "Ireland", "Nigeria", "Canada", "Spain", "Costa Rica", "Zambia",
    "Japan", "England", "Haiti", "Denmark", "China", "USA", "Vietnam",
    "Netherlands", "Portugal", "France", "Jamaica", "Brazil", "Panama",
    "Sweden", "South Africa", "Italy", "Argentina", "Germany", "Morocco",
    "Colombia", "South Korea",
  ],
  groups: GROUPS,
  knockoutRounds: ["Final", "Third Place", "Semifinals", "Quarterfinals", "Round of 16"],
  knockout: KNOCKOUT,
  finalsMatch: { home: "Spain", away: "England" },
};
```

**Step 3: Add wwc2023 to `lib/tournaments/index.ts`**

```typescript
export const TOURNAMENTS: TournamentConfig[] = [wc2026, wc2022, wwc2023];
```

**Step 4: Verify TypeScript**

```bash
npx tsc --noEmit
```

**Step 5: Commit**

```bash
git add lib/tournaments/
git commit -m "feat: add WWC2023 tournament config (Australia/New Zealand)"
```

---

### Task 4: Shared TournamentPage component + routes

**Files:**
- Create: `components/TournamentPage.tsx`
- Create: `app/wc2026/page.tsx`
- Create: `app/wc2022/page.tsx`
- Create: `app/wwc2023/page.tsx`

**Step 1: Create `components/TournamentPage.tsx`**

This is essentially the current `app/page.tsx` logic but parameterized by `TournamentConfig`. Extract the picker UI (knockout dropdown, group stage dropdown, pick-two dropdowns, random, finals button, play button, mode toggle) into this component. It accepts a `config: TournamentConfig` prop and uses `config.nations`, `config.groups`, `config.knockout`, `config.knockoutRounds`, `config.finalsMatch`.

Key things to preserve from the current `app/page.tsx`:
- `pickerMode` state ("random" | "knockout" | "group" | "custom")
- `selectKnockout`, `selectGroup`, `selectRandom` handlers
- The `getMatchPairs()` call scoped to the tournament's nations only
- Name entry and versus mode logic
- The "Create game" and "Join game" flows (Versus mode)

Replace `getAllMatchPairs()` / `getAllKnockoutPairs()` calls with equivalents derived from `config.groups` and `config.knockout`.

Add a back link to `/` at the top, and a tournament header:

```tsx
<div style={{ fontSize: 9, color: "var(--text-dim)", marginBottom: 4 }}>
  <Link href="/" style={{ color: "var(--gold)", textDecoration: "none" }}>◀ TRIVIA KICKS</Link>
</div>
<div style={{ fontSize: 18, color: "var(--gold)", letterSpacing: 3 }}>{config.emoji} {config.name}</div>
<div style={{ fontSize: 8, color: "var(--text-dim)", marginBottom: 8 }}>{config.hosts} · {config.year}</div>
```

**Step 2: Create the three route files**

`app/wc2026/page.tsx`:
```tsx
import { wc2026 } from "@/lib/tournaments";
import TournamentPage from "@/components/TournamentPage";

export default function WC2026Page() {
  return <TournamentPage config={wc2026} />;
}
```

`app/wc2022/page.tsx` and `app/wwc2023/page.tsx` follow the same pattern.

**Step 3: Verify the three tournament pages render correctly**

Start dev server and check:
- `http://localhost:3000/wc2026` — should look like the current home page but with the tournament header
- `http://localhost:3000/wc2022` — Qatar 2022 fixtures visible in dropdowns
- `http://localhost:3000/wwc2023` — 2023 Women's WC fixtures visible

```bash
npm run dev
```

**Step 4: Commit**

```bash
git add components/TournamentPage.tsx app/wc2026/ app/wc2022/ app/wwc2023/
git commit -m "feat: shared TournamentPage component, routes for WC2026/WC2022/WWC2023"
```

---

### Task 5: New evergreen main page

**Files:**
- Modify: `app/page.tsx` — replace current picker with searchable dropdowns + random + tournament cards

**Step 1: Replace the picker section in `app/page.tsx`**

The new main page keeps: mode toggle (via NavBar), name entry, outstanding games, Your Record, games-played counter.

It replaces the tournament picker with:

**Two searchable dropdowns:** Use `<input>` with a filtered dropdown list (not `<select>`) because `<select>` doesn't support type-to-filter. Pattern:

```tsx
const [countryA, setCountryA] = useState("");
const [countryB, setCountryB] = useState("");
const [searchA, setSearchA] = useState("");
const [searchB, setSearchB] = useState("");
const [openA, setOpenA] = useState(false);
const [openB, setOpenB] = useState(false);

const allNations = Object.keys(COUNTRIES).sort();
const filteredA = allNations.filter(n => n.toLowerCase().includes(searchA.toLowerCase()) && n !== countryB);
const filteredB = allNations.filter(n => n.toLowerCase().includes(searchB.toLowerCase()) && n !== countryA);
```

Render as a text input that, when focused, shows a scrollable list below it. Clicking a list item sets the country and closes the dropdown.

**Random button:** picks two random nations from `Object.keys(COUNTRIES)`, different from each other.

**Tournament cards row:**

```tsx
import { TOURNAMENTS } from "@/lib/tournaments";

// In render:
<div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
  {TOURNAMENTS.map(t => (
    <Link key={t.id} href={`/${t.id}`} style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      padding: "10px 16px", background: "#0a0e14",
      border: "2px solid var(--panel-border)", borderRadius: 6,
      color: "var(--gold)", textDecoration: "none", fontSize: 8, gap: 4
    }}>
      <span style={{ fontSize: 20 }}>{t.emoji}</span>
      <span>{t.shortName}</span>
      <span style={{ color: "var(--text-dim)", fontSize: 7 }}>{t.hosts}</span>
    </Link>
  ))}
</div>
```

**Step 2: Update `generateQuestions` call**

The new main page uses the full nations pool. Pass `Object.keys(COUNTRIES)` to build match pairs:

```tsx
function getRandomMatchup(): { home: string; away: string } {
  const nations = Object.keys(COUNTRIES);
  let a = nations[Math.floor(Math.random() * nations.length)];
  let b = nations[Math.floor(Math.random() * nations.length)];
  while (b === a) b = nations[Math.floor(Math.random() * nations.length)];
  return { home: a, away: b };
}
```

For generating questions, pass a single-pair match list:

```tsx
const pair = countryA && countryB
  ? { home: countryA, away: countryB, group: "Custom" }
  : getRandomMatchup();
const questions = generateQuestions([{ ...pair, group: "Custom" }], undefined, 10);
```

**Step 3: Test in browser**

- Type in search box → filtered list appears
- Select a country → closes, shows selected name
- Random button → fills both boxes with random nations
- Tournament cards → link to correct routes
- Play → game starts correctly

**Step 4: Commit**

```bash
git add app/page.tsx
git commit -m "feat: evergreen main page with searchable country dropdowns and tournament cards"
```

---

### Task 6: H2H Supabase table

**Files:**
- New Supabase migration (via Supabase dashboard or MCP)

**Step 1: Create the `country_h2h` table**

Run this SQL in the Supabase SQL editor:

```sql
create table country_h2h (
  country_a       text not null,
  country_b       text not null,
  a_wins          int not null default 0,
  b_wins          int not null default 0,
  draws           int not null default 0,
  total_matches   int not null default 0,
  last_matches    jsonb not null default '[]',
  last_updated    timestamptz not null default now(),
  primary key (country_a, country_b)
);

-- Read-only from the client; writes come from the import script using service role
alter table country_h2h enable row level security;
create policy "Public read" on country_h2h for select using (true);
```

**Step 2: Verify table exists**

In the Supabase dashboard, confirm the table appears in the Table Editor with the correct columns.

**Step 3: Note — no commit needed for SQL migrations run via dashboard**

---

### Task 7: H2H import script

> ⚠️ **USER ACTION REQUIRED before this task:** Download the "International Football Results from 1872 to 2025" dataset from [kaggle.com/datasets/martj42/international-football-results-from-1872-to-2024](https://www.kaggle.com/datasets/martj42/international-football-results-from-1872-to-2024) (free account required). Save the CSV file as `scripts/results.csv` in the project directory. Then proceed with this task.

**Files:**
- Create: `scripts/import-h2h.ts`

**Step 1: Install required packages (if not present)**

```bash
npm install --save-dev tsx
```

**Step 2: Create `scripts/import-h2h.ts`**

```typescript
import fs from "fs";
import path from "path";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const CSV_PATH = path.join(__dirname, "results.csv");

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

interface MatchRecord {
  date: string;
  home_team: string;
  away_team: string;
  home_score: number;
  away_score: number;
  tournament: string;
  neutral: boolean;
}

interface PairStats {
  a_wins: number;
  b_wins: number;
  draws: number;
  total_matches: number;
  last_matches: MatchRecord[];
}

function canonicalPair(t1: string, t2: string): [string, string] {
  return t1 < t2 ? [t1, t2] : [t2, t1];
}

async function main() {
  const raw = fs.readFileSync(CSV_PATH, "utf-8");
  const lines = raw.split("\n").slice(1).filter(Boolean);

  const pairs = new Map<string, PairStats>();

  for (const line of lines) {
    const [date, home_team, away_team, home_score_s, away_score_s, tournament, , neutral_s] = line.split(",");
    if (!home_team || !away_team) continue;
    const home_score = parseInt(home_score_s, 10);
    const away_score = parseInt(away_score_s, 10);
    if (isNaN(home_score) || isNaN(away_score)) continue;

    const [a, b] = canonicalPair(home_team.trim(), away_team.trim());
    const key = `${a}|||${b}`;

    if (!pairs.has(key)) {
      pairs.set(key, { a_wins: 0, b_wins: 0, draws: 0, total_matches: 0, last_matches: [] });
    }

    const stats = pairs.get(key)!;
    stats.total_matches++;

    const aIsHome = a === home_team.trim();
    if (home_score > away_score) {
      if (aIsHome) stats.a_wins++; else stats.b_wins++;
    } else if (away_score > home_score) {
      if (aIsHome) stats.b_wins++; else stats.a_wins++;
    } else {
      stats.draws++;
    }

    stats.last_matches.push({
      date: date.trim(),
      home_team: home_team.trim(),
      away_team: away_team.trim(),
      home_score,
      away_score,
      tournament: tournament.trim(),
      neutral: neutral_s?.trim() === "TRUE",
    });
  }

  // Keep only the 5 most recent matches per pair (CSV is chronological)
  const rows = [];
  for (const [key, stats] of pairs.entries()) {
    const [country_a, country_b] = key.split("|||");
    rows.push({
      country_a,
      country_b,
      a_wins: stats.a_wins,
      b_wins: stats.b_wins,
      draws: stats.draws,
      total_matches: stats.total_matches,
      last_matches: stats.last_matches.slice(-5),
      last_updated: new Date().toISOString(),
    });
  }

  console.log(`Upserting ${rows.length} pairs...`);

  // Batch upsert in chunks of 500
  for (let i = 0; i < rows.length; i += 500) {
    const chunk = rows.slice(i, i + 500);
    const { error } = await supabase.from("country_h2h").upsert(chunk, { onConflict: "country_a,country_b" });
    if (error) { console.error(error); process.exit(1); }
    console.log(`  ${Math.min(i + 500, rows.length)}/${rows.length}`);
  }

  console.log("Done.");
}

main();
```

**Step 3: Run the script**

```bash
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key npx tsx scripts/import-h2h.ts
```

The service role key is in your Supabase project settings → API → `service_role` (secret). Do not commit it.

Expected output:
```
Upserting ~43000 pairs...
  500/43000
  1000/43000
  ...
Done.
```

**Step 4: Verify in Supabase**

Run in SQL editor:
```sql
select * from country_h2h where country_a = 'Argentina' and country_b = 'Brazil' limit 1;
```

Expected: one row with plausible win/draw counts and last_matches array.

**Step 5: Commit the script (not the CSV)**

```bash
echo "scripts/results.csv" >> .gitignore
git add scripts/import-h2h.ts .gitignore
git commit -m "feat: H2H import script for Kaggle international results CSV"
```

---

### Task 8: Expand nations data to all FIFA members

This is the largest data task. The goal is to add ~163 more nations to `lib/countries.ts`. Nations with incomplete data get `null` for missing fields.

**Files:**
- Modify: `lib/countries.ts` — add remaining FIFA member nations

**Step 1: Write a data-fetching script to gather stats**

Create `scripts/fetch-nations.ts` that pulls data from REST Countries API and World Bank API for all FIFA members not yet in `COUNTRIES`. This script outputs TypeScript objects you paste into `lib/countries.ts`.

```typescript
// scripts/fetch-nations.ts
// Run: npx tsx scripts/fetch-nations.ts > scripts/new-nations.txt
// Then review and paste into lib/countries.ts

const FIFA_NATIONS_NOT_IN_DB = [
  // Add the ~163 missing FIFA member nations here
  "Afghanistan", "Albania", "Andorra", "Angola", "Antigua and Barbuda",
  "Armenia", "Azerbaijan", "Bahrain", "Bangladesh", "Barbados",
  "Belarus", "Belize", "Benin", "Bhutan", "Bolivia", "Botswana",
  "Brunei", "Burkina Faso", "Burundi", "Cambodia", "Central African Republic",
  "Chad", "China", "Comoros", "Congo", "Cuba", "Cyprus",
  "Djibouti", "Dominican Republic", "El Salvador", "Equatorial Guinea",
  "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji", "Finland",
  "Gabon", "Gambia", "Ghana", "Greece", "Grenada", "Guatemala",
  "Guinea", "Guinea-Bissau", "Guyana", "Honduras", "Hungary",
  "Iceland", "India", "Indonesia", "Iraq", "Israel", "Jamaica",
  "Jordan", "Kenya", "Kosovo", "Kuwait", "Kyrgyzstan", "Laos",
  "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein",
  "Lithuania", "Luxembourg", "Madagascar", "Malawi", "Malaysia",
  "Maldives", "Mauritania", "Mauritius", "Moldova", "Mongolia",
  "Montenegro", "Mozambique", "Myanmar", "Namibia", "Nepal",
  "Nicaragua", "Niger", "North Korea", "North Macedonia", "Oman",
  "Pakistan", "Palestine", "Panama", "Papua New Guinea", "Philippines",
  "Poland", "Puerto Rico", "Rwanda", "San Marino", "São Tomé and Príncipe",
  "Sierra Leone", "Singapore", "Slovakia", "Solomon Islands", "Somalia",
  "Sri Lanka", "Sudan", "Suriname", "Syria", "Tajikistan",
  "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga",
  "Trinidad and Tobago", "Turkmenistan", "Uganda", "Uzbekistan",
  "Vanuatu", "Vietnam", "Wales", "Yemen", "Zambia", "Zimbabwe",
  // ... complete list
];

async function fetchCountryData(name: string) {
  // REST Countries API for basic stats
  const res = await fetch(`https://restcountries.com/v3.1/name/${encodeURIComponent(name)}?fullText=true`);
  if (!res.ok) return null;
  const data = await res.json();
  const c = data[0];
  return {
    pop: c.population,
    area: c.area,
    // etc — map REST Countries fields to CountryStats
  };
}
```

In practice, this is an AI-assisted step: Claude writes the complete nation entries using known data sources. Run `npx tsx scripts/fetch-nations.ts` to generate a starting point, then manually verify and fill in null for fields with no reliable source.

**Step 2: Add nations in batches**

Add nations alphabetically in batches of ~30 to keep diffs reviewable. For each batch:

```bash
git add lib/countries.ts
git commit -m "feat: add FIFA nations A-D to countries database"
```

**Step 3: Verify no TypeScript errors**

After each batch:
```bash
npx tsc --noEmit
```

**Step 4: Minimum viable nation entry**

Every nation needs at least `pop`, `area`, `founded` (required non-null fields). Everything else can be `null`. A nation with only those 3 fields will have very few questions, but it will work. Nations with fewer than 2 available question types will result in very short games — acceptable.

---

### Task 9: H2H panel on results screen

**Files:**
- Modify: `app/game/[id]/page.tsx` — add H2H panel after score breakdown
- Create: `components/H2HPanel.tsx`

**Step 1: Create `components/H2HPanel.tsx`**

```tsx
"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface H2HRecord {
  country_a: string;
  country_b: string;
  a_wins: number;
  b_wins: number;
  draws: number;
  total_matches: number;
  last_matches: {
    date: string;
    home_team: string;
    away_team: string;
    home_score: number;
    away_score: number;
    tournament: string;
  }[];
}

export default function H2HPanel({ home, away }: { home: string; away: string }) {
  const [record, setRecord] = useState<H2HRecord | null | "none">(null);

  useEffect(() => {
    const [a, b] = home < away ? [home, away] : [away, home];
    supabase
      .from("country_h2h")
      .select("*")
      .eq("country_a", a)
      .eq("country_b", b)
      .single()
      .then(({ data }) => setRecord(data ?? "none"));
  }, [home, away]);

  if (record === null) return null; // loading
  if (record === "none") return (
    <div style={{ fontSize: 8, color: "var(--text-dim)", textAlign: "center", padding: "16px 0" }}>
      {home.toUpperCase()} AND {away.toUpperCase()} HAVE NEVER MET IN OFFICIAL COMPETITION
    </div>
  );

  const [a, b] = home < away ? [home, away] : [away, home];
  const aWins = home === a ? record.a_wins : record.b_wins;
  const bWins = home === a ? record.b_wins : record.a_wins;
  const total = record.total_matches;
  const barMax = Math.max(aWins, bWins, record.draws, 1);

  return (
    <div style={{ borderTop: "2px solid var(--panel-border)", paddingTop: 16, marginTop: 16 }}>
      <div style={{ fontSize: 9, color: "var(--gold)", letterSpacing: 2, marginBottom: 12, textAlign: "center" }}>
        HEAD TO HEAD — {total} MATCHES
      </div>

      {[
        { label: home.toUpperCase(), wins: aWins },
        { label: "DRAWS", wins: record.draws },
        { label: away.toUpperCase(), wins: bWins },
      ].map(({ label, wins }) => (
        <div key={label} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, fontSize: 8 }}>
          <span style={{ width: 100, textAlign: "right", color: "var(--text-dim)" }}>{label}</span>
          <div style={{ flex: 1, background: "var(--panel-border)", height: 8, borderRadius: 2, overflow: "hidden" }}>
            <div style={{ width: `${(wins / barMax) * 100}%`, height: "100%", background: "var(--gold)", borderRadius: 2 }} />
          </div>
          <span style={{ width: 24, color: "var(--text)" }}>{wins}</span>
        </div>
      ))}

      <div style={{ marginTop: 12, fontSize: 7, color: "var(--text-dim)" }}>
        <div style={{ marginBottom: 6, color: "var(--text)", letterSpacing: 1 }}>RECENT MEETINGS</div>
        {record.last_matches.slice().reverse().slice(0, 5).map((m, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
            <span>{m.date.slice(0, 7)}</span>
            <span>{m.home_team} {m.home_score}–{m.away_score} {m.away_team}</span>
            <span style={{ color: "var(--text-dim)", maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.tournament}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
```

**Step 2: Add H2HPanel to the game-over screen**

In `app/game/[id]/page.tsx`, import and render `<H2HPanel>` in the finished-phase section, after the score breakdown and before the Play Again button:

```tsx
import H2HPanel from "@/components/H2HPanel";

// In the render, inside the finished phase block:
{game.phase === "finished" && (
  <>
    {/* ...existing score breakdown... */}
    <H2HPanel home={questions[0].home} away={questions[0].away} />
    {/* ...Play Again button... */}
  </>
)}
```

`questions[0].home` and `questions[0].away` are the two countries that were played — already available in the game state.

**Step 3: Test the H2H panel**

Start dev server, complete a game (or navigate to a finished game), verify:
- Panel appears below score breakdown
- Shows win/draw/loss counts as bars
- Shows up to 5 recent matches
- "Never met" message shows for obscure country pairs

**Step 4: Commit**

```bash
git add components/H2HPanel.tsx app/game/
git commit -m "feat: H2H soccer history panel on game results screen"
```

---

### Task 10: Update CLAUDE.md and PROJECT_BRAINDUMP.md

**Files:**
- Modify: `CLAUDE.md`
- Modify: `PROJECT_BRAINDUMP.md` (if it exists)

**Step 1: Update CLAUDE.md**

Add to Key files section:
```
- lib/tournaments/types.ts — TournamentConfig type
- lib/tournaments/wc2026.ts, wc2022.ts, wwc2023.ts — tournament configs
- lib/tournaments/index.ts — TOURNAMENTS list + exports
- components/TournamentPage.tsx — shared tournament picker UI
- components/H2HPanel.tsx — H2H soccer history panel
- scripts/import-h2h.ts — one-time Kaggle CSV → Supabase import
```

Add to Supabase tables section:
```
## Supabase table: country_h2h
country_a text | country_b text | a_wins int | b_wins int | draws int |
total_matches int | last_matches jsonb | last_updated timestamptz
PK: (country_a, country_b) — always stored alphabetically (a < b).
Populated by scripts/import-h2h.ts from Kaggle international results CSV.
Read by H2HPanel on the game results screen.
```

Update Notes to reflect new site structure:
```
- triviakicks.com routes: / (evergreen), /wc2026, /wc2022, /wwc2023, /single, /game/[id]
- Main page uses all FIFA nations (~211) with searchable dropdowns
- Tournament pages use TournamentPage component with a TournamentConfig
- Nations with null fields in CountryStats simply have fewer question types
```

**Step 2: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: update CLAUDE.md for evergreen architecture"
```
