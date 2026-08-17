# Evergreen Trivia Kicks Design

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Transform Trivia Kicks from a WC2026-specific game into a year-round country trivia game, while preserving tournament content as dedicated archive pages and adding H2H soccer history to the results screen.

**Architecture:** Evergreen main page (all ~211 FIFA nations, two searchable dropdowns + random) + shared `TournamentPage` component parameterized by config (WC2026, WC2022, WWC2023 and future tournaments). H2H records pre-computed from Kaggle dataset and stored in Supabase.

**Tech Stack:** Next.js App Router, Supabase (existing), Kaggle international football results CSV (one-time import), REST Countries API + World Bank (data expansion script)

---

## Section 1: Site Structure

```
triviakicks.com/           ← new evergreen main page
triviakicks.com/wc2026     ← current main page experience, archived
triviakicks.com/wc2022     ← Qatar 2022 World Cup
triviakicks.com/wwc2023    ← Australia/NZ 2023 Women's World Cup
triviakicks.com/single     ← unchanged
triviakicks.com/game/[id]  ← unchanged
```

Tournament pages share a single `TournamentPage` component parameterized by a `TournamentConfig` object. Adding future tournaments (WC2027W, WC2030) requires only a new config file and route — no new component code.

---

## Section 2: Data Layer

### Nations expansion

- **Current:** 48 nations, ~17 question types each, hand-curated in `lib/countries.ts`
- **New:** all ~211 FIFA member nations, same question types where data exists, `null` where it doesn't
- `generateQuestions` filters out null fields before sampling — small existing behavior, small code change
- Data sourced via one-time script pulling from REST Countries API + World Bank (same sources as current 48)

### H2H records — new Supabase table: `country_h2h`

```sql
country_a     text        -- alphabetically first of the pair
country_b     text        -- alphabetically second of the pair
a_wins        int
b_wins        int
draws         int
total_matches int
last_matches  jsonb       -- array of 5 most recent {date, home, away, home_score, away_score, tournament}
last_updated  timestamptz
PRIMARY KEY (country_a, country_b)
```

- Populated from the Kaggle "International Football Results 1872-2024" CSV (free download, ~48k rows)
- User downloads CSV from Kaggle, hands to Claude, who runs a Node import script to upsert into Supabase
- Canonical key: pair stored alphabetically so Spain+France = France+Spain, no duplicates
- Re-run import after major tournaments to stay current

### Tournament configs — new `lib/tournaments/` directory

```
lib/tournaments/
  types.ts       ← TournamentConfig type definition
  wc2026.ts      ← current matches/groups/knockout data, moved here
  wc2022.ts      ← Qatar 2022 full bracket + results
  wwc2023.ts     ← Australia/NZ 2023 Women's full bracket + results
  index.ts       ← exports all configs + TOURNAMENTS list for nav cards
```

Each config exports:
```typescript
export const config: TournamentConfig = {
  id: "wc2026",
  name: "FIFA World Cup 2026",
  shortName: "WC 2026",
  hosts: "USA / Canada / Mexico",
  year: 2026,
  emoji: "🏆",
  nations: string[],          // participating nations
  groups: Match[],            // group stage fixtures + results
  knockout: Match[],          // knockout bracket + results
  knockoutRounds: string[],   // round order for dropdown
  finalsMatch?: { home: string; away: string }, // for quick-pick button
}
```

---

## Section 3: Main Page (Evergreen)

### URL: `triviakicks.com/`

**Picker UI:**
- Two searchable dropdowns — type to filter, all ~211 FIFA nations, same country in both blocked
- Random button — picks any two nations from the full pool, no bias
- Play button — launches game with selected or random matchup

**Tournament cards row** (below picker):
- One card per tournament config in `TOURNAMENTS` list
- Each card shows: emoji, short name, hosts
- Links to the tournament subpage
- New tournaments appear automatically when a new config is added

**What's removed from current main page:**
- Knockout stage dropdown
- Group stage dropdown
- "The Final" Spain vs Argentina quick-pick button
- "No selection = random matchup" text

**What stays:**
- Single Player / Versus Mode toggle (NavBar)
- Name entry for Versus Mode
- Outstanding games / Your Record sections
- Games played counter

---

## Section 4: Tournament Pages

### URLs: `/wc2026`, `/wc2022`, `/wwc2023`

Single shared component: `app/tournament/[id]/page.tsx` with static params, or individual route files that import and render `<TournamentPage config={wc2026} />`.

**Each tournament page includes:**
- Tournament header: name, year, host(s)
- Finals quick-pick button (if `config.finalsMatch` set)
- Knockout stage dropdown (rounds, matches, results shown inline)
- Group stage dropdown (all groups, all fixtures + results)
- Pick-two dropdowns — scoped to that tournament's nations only
- Random — from that tournament's nations only
- Single Player / Versus Mode toggle + name entry
- Play button

**Navigation:**
- Back link to main page
- Links to other tournament pages (sibling nav)

**WC2022 data:** Full bracket, group stage, and results sourced from Wikipedia. 32 nations, 8 groups, standard knockout from Round of 16. Winner: Argentina.

**WWC2023 data:** Full bracket, group stage, results. 32 nations, 8 groups. Winner: Spain.

---

## Section 5: Results Screen — H2H Panel

Added to the game-over screen (`app/game/[id]/page.tsx`) after the existing score breakdown, above the Play Again button.

**Panel layout:**
```
SPAIN vs ARGENTINA
─────────────────────────────────────
47 matches  |  Since 1920

Spain      14  ████░░░░░░
Draws      18  ██████░░░░
Argentina  15  █████░░░░░

RECENT MEETINGS
Jul 2026  Spain 1–0 Argentina  (World Cup Final)
Jun 2021  Argentina 1–0 Spain  (Copa América)
Jun 2010  Argentina 2–4 Germany (unrelated example)
...
```

- Fetched from `country_h2h` table on game end (client-side, non-blocking)
- If pair has no record: "These nations have never met in official international competition" — interesting trivia in itself
- `last_matches` JSONB stores up to 5 most recent matches with date, teams, score, tournament name
- Bar chart proportional to total matches
- Works for all matchups — evergreen and tournament alike

---

## Implementation Order (Big Bang — all together)

1. **Data scripts** — expand `lib/countries.ts` to all FIFA nations; write + run H2H import from Kaggle CSV; source WC2022 + WWC2023 tournament data
2. **Supabase** — create `country_h2h` table + RLS; run import
3. **Tournament config system** — `lib/tournaments/` types + configs (wc2026 migrated, wc2022 + wwc2023 added)
4. **Tournament page** — shared `TournamentPage` component; routes `/wc2026`, `/wc2022`, `/wwc2023`
5. **Main page** — replace current picker with searchable dropdowns + random + tournament cards
6. **Results screen** — H2H panel component + data fetch
7. **QA pass** — test all three tournament pages, evergreen flow, H2H panel, single + versus modes

---

## Open Questions / Notes

- Kaggle CSV requires a free account to download — user handles this step, hands file to Claude for import script
- Some FIFA nations have very limited public data (population only, no GDP/coastline/etc.) — these will have fewer available question types; minimum viable is 2 question types to be playable
- Micro-nations (Vatican, San Marino, etc.) are FIFA members but may have only 1-2 data points — include them but they'll have thin question pools
- The `question_stats` table currently tracks by question type globally — no change needed for evergreen (still valid)
- `games_played_counter` — no change needed
- WC2022 group stage: 32 nations, 8 groups (A-H), standard format. All results known.
- WWC2023: 32 nations, 8 groups (A-H). Winner: Spain (beat England 1-0 in final).
