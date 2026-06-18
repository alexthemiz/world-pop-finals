# Expanded Country Stats Design
_2026-06-18_

## Goal

Grow the trivia question pool from 17 stat types to ~42 by adding ~25 new country data fields to `lib/countries.ts`. Emphasis on whimsy, surprise, and real verifiable data. Simultaneously bump single-player mode from 5 to 10 questions per game.

## Constraints

- Every new stat must have a **non-trivial (non-zero) value for all 48 WC 2026 countries**.
- Every value must point to a **trustworthy, citable source** added to `SOURCES`.
- Questions where both countries share the same value are **skipped** at generation time.
- No DB/Supabase changes — all stats are client-side in `lib/countries.ts`.

---

## Candidate Stats (~25 new fields)

### Demography & Health
| Field | Question | Notes |
|---|---|---|
| `fertilityRate` | Which has the higher fertility rate? | DR Congo ~6.0 vs Japan ~1.2; World Bank |
| `obesityRate` | Which has a higher adult obesity rate? | WHO; Qatar surprisingly high |
| `hospitalBeds` | Which has more hospital beds per 1,000 people? | World Bank |
| `avgSchooling` | Which has more average years of schooling? | UNDP HDI |

### Economy & Infrastructure
| Field | Question | Notes |
|---|---|---|
| `internetSpeed` | Which has faster average internet download speed? | Ookla Speedtest Global Index |
| `electricityPc` | Which consumes more electricity per capita? | World Bank (kWh/person) |
| `roadLength` | Which has a longer road network? | CIA World Factbook (km) |
| `renewableEnergy` | Which generates more of its electricity from renewables? | Our World in Data / IEA (%) |

### Culture & Society
| Field | Question | Notes |
|---|---|---|
| `coffeePc` | Which consumes more coffee per capita? | ICO / FAO (kg/year) |
| `teaPc` | Which consumes more tea per capita? | FAO (kg/year); works for Muslim-majority countries |
| `happinessScore` | Which scores higher on the World Happiness Index? | World Happiness Report |
| `prisonRate` | Which has a higher prison population rate? | World Prison Brief (per 100,000) |
| `homicideRate` | Which has a higher homicide rate? | UNODC (per 100,000) |
| `tourists` | Which receives more international tourists per year? | UNWTO (millions) |
| `publicHolidays` | Which has more national public holidays? | Government/UN sources (count) |
| `firearmsRate` | Which has more civilian firearms per 100 people? | Small Arms Survey |
| `languages` | Which has more spoken languages? | Ethnologue |
| `cheesePc` | Which consumes more cheese per capita? | FAO (kg/year) |
| `honeyProduction` | Which produces more honey? | FAO (tonnes/year) |

### Nature & Environment
| Field | Question | Notes |
|---|---|---|
| `birdSpecies` | Which is home to more bird species? | BirdLife International / eBird; Colombia ~1,900 |
| `precipitation` | Which gets more annual rainfall? | World Bank climate data (mm/year) |
| `threatenedSpecies` | Which has more threatened species? | IUCN Red List (total count) |
| `protectedLand` | Which has a higher share of protected land? | World Bank (% of territory) |
| `disasterRisk` | Which faces higher natural disaster risk? | INFORM Risk Index |

---

## Architecture

### Data model
Add all new fields to the `CountryStats` interface in `lib/countries.ts`. Same pattern as existing fields — one number per country. No interface changes needed beyond the new fields.

### Tie-skip logic
In `allQuestionsForMatch` (currently in `lib/questions.ts`), filter out any question where `homeValue === awayValue` before returning the pool. One-liner addition.

### QUESTION_TYPES
Each new stat gets a `{ id, key, question, getValue, explain }` entry in `QUESTION_TYPES`. No structural changes — same shape as existing entries.

### SOURCES
Each new stat's data origin gets an entry in the `SOURCES` array with label and URL.

### Solo mode bump
In `generateQuestions`, change `.slice(0, 5)` to `.slice(0, 10)`. Update CLAUDE.md comment from "15Q" to "10Q".

---

## Batch Plan

Each batch: research → verify all 48 values → add fields + data + QUESTION_TYPES + SOURCES → commit.

| Batch | Stats | Theme |
|---|---|---|
| 1 | fertilityRate, obesityRate, happinessScore, birdSpecies, firearmsRate, teaPc, publicHolidays | High-whimsy, strong data |
| 2 | internetSpeed, renewableEnergy, prisonRate, homicideRate, tourists, languages, precipitation | Society & environment |
| 3 | coffeePc, cheesePc, honeyProduction, hospitalBeds, avgSchooling, electricityPc | Food & development |
| 4 | roadLength, threatenedSpecies, protectedLand, disasterRisk | Nature & infrastructure |

Also in Batch 1 (code-only): tie-skip logic + solo mode 5→10.
