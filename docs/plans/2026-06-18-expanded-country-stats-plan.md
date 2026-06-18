# Expanded Country Stats Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Grow the trivia question pool from 17 to ~42 stat types by adding ~25 verified, whimsical country data fields; fix tie questions; bump solo mode to 10 questions.

**Architecture:** All stats live in `lib/countries.ts` as numeric fields on `CountryStats`. Each stat becomes a `QuestionType` entry in `QUESTION_TYPES`. No DB changes — entirely client-side. Data is researched and hard-coded per the existing pattern.

**Tech Stack:** TypeScript, Next.js App Router, no test runner — verification is manual (run dev server, play through questions).

---

## Preliminary: How this codebase works

- `lib/countries.ts` holds `CountryStats` (interface) + `COUNTRIES` (48-entry record) + `QUESTION_TYPES` (array of question definitions) + `SOURCES` (citation list).
- `lib/questions.ts` generates questions by iterating `QUESTION_TYPES`, calling `getValue(country)` on each, comparing the two countries, and returning the higher-value country as winner.
- Adding a stat = (1) new field on `CountryStats`, (2) value for all 48 entries in `COUNTRIES`, (3) new entry in `QUESTION_TYPES`, (4) new entry in `SOURCES`.
- The 48 WC 2026 countries are: Mexico, South Africa, South Korea, Czechia, Canada, Bosnia, Qatar, Switzerland, Brazil, Morocco, Haiti, Scotland, USA, Paraguay, Australia, Türkiye, Germany, Curaçao, Ivory Coast, Ecuador, Netherlands, Japan, Sweden, Tunisia, Belgium, Egypt, Iran, New Zealand, Saudi Arabia, Uruguay, Cabo Verde, Spain, France, Senegal, Norway, Iraq, Argentina, Algeria, Austria, Jordan, Portugal, DR Congo, England, Croatia, Ghana, Panama, Colombia, Uzbekistan.
- Scotland, England, and Curaçao are non-sovereign but have their own stats in this game — use their own data where available, or best available estimate.
- **Rule:** Every new stat must be non-trivial (non-zero) for all 48 countries. If a source shows 0 for any country, that stat is dropped or substituted.

---

## Task 0: Code-only changes (tie-skip + solo bump)

**Files:**
- Modify: `lib/questions.ts` (allQuestionsForMatch, generateQuestions)
- Modify: `CLAUDE.md`

**Step 1: Add tie-skip filter in allQuestionsForMatch**

In `lib/questions.ts`, `allQuestionsForMatch` currently returns all stat questions with no filtering. Add a filter after building the questions array so questions where both countries have identical values are excluded:

```typescript
function allQuestionsForMatch(match: MatchPair): Question[] {
  const questions: Question[] = QUESTION_TYPES
    .map((_, i) => makeStatQuestion(match, i))
    .filter((q) => {
      const qType = QUESTION_TYPES.find(qt => qt.question === q.questionText)!;
      const homeVal = qType.getValue(q.home);
      const awayVal = qType.getValue(q.away);
      return homeVal !== awayVal;
    });
  const diaspora = makeDiasporaQuestion(match);
  if (diaspora) questions.push(diaspora);
  return shuffle(questions);
}
```

Actually, a cleaner approach — filter by index before mapping:

```typescript
function allQuestionsForMatch(match: MatchPair): Question[] {
  const questions: Question[] = QUESTION_TYPES
    .filter((qType) => qType.getValue(match.home) !== qType.getValue(match.away))
    .map((qType, _, filtered) => makeStatQuestion(match, QUESTION_TYPES.indexOf(qType)))
    .filter(Boolean) as Question[];
  const diaspora = makeDiasporaQuestion(match);
  if (diaspora) questions.push(diaspora);
  return shuffle(questions);
}
```

Cleanest approach — filter QUESTION_TYPES first, then map:

```typescript
function allQuestionsForMatch(match: MatchPair): Question[] {
  const { home, away } = match;
  const questions: Question[] = [];
  QUESTION_TYPES.forEach((qType, i) => {
    if (qType.getValue(home) !== qType.getValue(away)) {
      questions.push(makeStatQuestion(match, i));
    }
  });
  const diaspora = makeDiasporaQuestion(match);
  if (diaspora) questions.push(diaspora);
  return shuffle(questions);
}
```

**Step 2: Bump solo mode from 5 to 10**

In `lib/questions.ts`, `generateQuestions` ends with:
```typescript
  return allQuestionsForMatch(match).slice(0, 5);
```
Change to:
```typescript
  return allQuestionsForMatch(match).slice(0, 10);
```

**Step 3: Update CLAUDE.md**

Find the line:
```
- app/single/page.tsx — single player (15Q, client-side only)
```
Change to:
```
- app/single/page.tsx — single player (10Q, client-side only)
```

**Step 4: Verify manually**

Run `npm run dev`, open single player, confirm a round now shows 10 questions. Confirm no duplicate or tied questions appear (play several rounds if needed).

**Step 5: Commit**

```bash
git add lib/questions.ts CLAUDE.md
git commit -m "Skip tied questions; bump solo mode to 10 questions"
```

---

## Task 1: Batch 1 — High-whimsy stats (7 fields)

**Fields:** `fertilityRate`, `obesityRate`, `happinessScore`, `birdSpecies`, `firearmsRate`, `teaPc`, `publicHolidays`

**Files:**
- Modify: `lib/countries.ts`

### Step 1: Research all 7 stats for all 48 countries

Use these authoritative sources. Open each, record values for all 48 countries in a scratch doc before touching code.

| Field | Source | Unit | URL |
|---|---|---|---|
| `fertilityRate` | World Bank — Fertility rate, total (births per woman) | births/woman (1 decimal) | https://data.worldbank.org/indicator/SP.DYN.TFRT.IN |
| `obesityRate` | WHO Global Health Observatory — Prevalence of obesity among adults | % adults (1 decimal) | https://www.who.int/data/gho/data/themes/topics/topic-details/GHO/ncd-risk-factors |
| `happinessScore` | World Happiness Report 2024 (most recent with full coverage) | score 0–10 (2 decimals) | https://worldhappiness.report/data/ |
| `birdSpecies` | BirdLife International State of the World's Birds | count (integer) | https://www.birdlife.org/data-zone/country |
| `firearmsRate` | Small Arms Survey — Civilian firearms per 100 people | per 100 people (1 decimal) | https://www.smallarmssurvey.org/database/global-firearms-holdings |
| `teaPc` | FAO Food Balance Sheets — Tea consumption | kg/person/year (2 decimals) | https://www.fao.org/faostat/en/#data/FBS |
| `publicHolidays` | Cross-reference government sources / Wikipedia list of public holidays | count (integer) | https://en.wikipedia.org/wiki/List_of_public_holidays_by_country |

**Verification rule:** If any country shows 0 for a field, that field is dropped from this batch. Check especially: Curaçao, Cabo Verde, Haiti, Bosnia for data availability.

**Notes on tricky countries:**
- Scotland/England: BirdLife has separate country pages for Scotland and England. Small Arms Survey may only have UK — use UK value for both. Happiness Report may only have UK — use UK value for both and note approximation.
- Curaçao: Many sources don't list it separately. For `birdSpecies`, use the Curaçao page on eBird (https://ebird.org/region/CW). For others, use Netherlands Antilles historical data or best available estimate — document the approximation in a code comment.
- Cabo Verde / Haiti: Check FAO FAOSTAT specifically — they are listed.

### Step 2: Add fields to CountryStats interface

In `lib/countries.ts`, add after the existing `coastline` field:

```typescript
export interface CountryStats {
  // ... existing fields ...
  coastline: number;
  // Batch 1
  fertilityRate: number;  // births per woman
  obesityRate: number;    // % of adults obese (WHO)
  happinessScore: number; // World Happiness Report score (0-10)
  birdSpecies: number;    // number of bird species (BirdLife International)
  firearmsRate: number;   // civilian firearms per 100 people (Small Arms Survey)
  teaPc: number;          // kg of tea consumed per capita per year (FAO)
  publicHolidays: number; // number of national public holidays
}
```

### Step 3: Add values to all 48 COUNTRIES entries

Add each field to every country row in the `COUNTRIES` object. Keep the same inline style as existing data. Example row after update:

```typescript
Mexico: {
  pop:130e6, area:1964375, founded:1821, gdp:1322e9, lifeExp:75, medianAge:29,
  co2pc:3.7, unesco:35, fifa:14, wcApps:17, nobel:2, unemployment:2.8,
  elevation:1111, forest:34, coastline:9330,
  fertilityRate:1.8, obesityRate:28.9, happinessScore:6.67,
  birdSpecies:1107, firearmsRate:13.5, teaPc:0.19, publicHolidays:7,
},
```

Fill in verified values for all 48 countries. Double-check: no zeros, no missing fields.

### Step 4: Add QUESTION_TYPES entries

In `lib/countries.ts`, append to `QUESTION_TYPES` array:

```typescript
  {
    id: "fertilityRate",
    key: "fertilityRate",
    question: "WHICH HAS THE HIGHER FERTILITY RATE?",
    getValue: (c) => COUNTRIES[c].fertilityRate,
    explain: (w, l, wv, lv) => `${w}: ${wv.toFixed(1)} births/woman vs ${l}: ${lv.toFixed(1)} births/woman`,
  },
  {
    id: "obesityRate",
    key: "obesityRate",
    question: "WHICH HAS A HIGHER ADULT OBESITY RATE?",
    getValue: (c) => COUNTRIES[c].obesityRate,
    explain: (w, l, wv, lv) => `${w}: ${wv}% vs ${l}: ${lv}%`,
  },
  {
    id: "happinessScore",
    key: "happinessScore",
    question: "WHICH SCORES HIGHER ON THE WORLD HAPPINESS INDEX?",
    getValue: (c) => COUNTRIES[c].happinessScore,
    explain: (w, l, wv, lv) => `${w}: ${wv.toFixed(2)} vs ${l}: ${lv.toFixed(2)} (out of 10)`,
  },
  {
    id: "birdSpecies",
    key: "birdSpecies",
    question: "WHICH IS HOME TO MORE BIRD SPECIES?",
    getValue: (c) => COUNTRIES[c].birdSpecies,
    explain: (w, l, wv, lv) => `${w}: ${wv.toLocaleString()} species vs ${l}: ${lv.toLocaleString()} species`,
  },
  {
    id: "firearmsRate",
    key: "firearmsRate",
    question: "WHICH HAS MORE CIVILIAN FIREARMS PER 100 PEOPLE?",
    getValue: (c) => COUNTRIES[c].firearmsRate,
    explain: (w, l, wv, lv) => `${w}: ${wv} per 100 vs ${l}: ${lv} per 100`,
  },
  {
    id: "teaPc",
    key: "teaPc",
    question: "WHICH DRINKS MORE TEA PER PERSON?",
    getValue: (c) => COUNTRIES[c].teaPc,
    explain: (w, l, wv, lv) => `${w}: ${wv.toFixed(2)} kg/person vs ${l}: ${lv.toFixed(2)} kg/person`,
  },
  {
    id: "publicHolidays",
    key: "publicHolidays",
    question: "WHICH HAS MORE NATIONAL PUBLIC HOLIDAYS?",
    getValue: (c) => COUNTRIES[c].publicHolidays,
    explain: (w, l, wv, lv) => `${w}: ${wv} days vs ${l}: ${lv} days`,
  },
```

### Step 5: Add SOURCES entries

```typescript
  { label: "Fertility rate", url: "https://data.worldbank.org/indicator/SP.DYN.TFRT.IN" },
  { label: "Obesity rate", url: "https://www.who.int/data/gho/data/themes/topics/topic-details/GHO/ncd-risk-factors" },
  { label: "World Happiness Report", url: "https://worldhappiness.report/data/" },
  { label: "Bird species", url: "https://www.birdlife.org/data-zone/country" },
  { label: "Civilian firearms", url: "https://www.smallarmssurvey.org/database/global-firearms-holdings" },
  { label: "Tea consumption", url: "https://www.fao.org/faostat/en/#data/FBS" },
  { label: "Public holidays", url: "https://en.wikipedia.org/wiki/List_of_public_holidays_by_country" },
```

### Step 6: Verify

Run `npm run dev`. Play several games. Confirm new questions appear. Spot-check 2–3 answers against your research data.

### Step 7: Commit

```bash
git add lib/countries.ts
git commit -m "Batch 1: add fertilityRate, obesityRate, happinessScore, birdSpecies, firearmsRate, teaPc, publicHolidays"
```

---

## Task 2: Batch 2 — Society & environment (7 fields)

**Fields:** `internetSpeed`, `renewableEnergy`, `prisonRate`, `homicideRate`, `tourists`, `languages`, `precipitation`

**Files:**
- Modify: `lib/countries.ts`

### Step 1: Research all 7 stats

| Field | Source | Unit | URL |
|---|---|---|---|
| `internetSpeed` | Ookla Speedtest Global Index (most recent annual avg) | Mbps (1 decimal) | https://www.speedtest.net/global-index |
| `renewableEnergy` | Our World in Data — Share of electricity from renewables | % (1 decimal) | https://ourworldindata.org/renewable-energy |
| `prisonRate` | World Prison Brief — Prison population rate | per 100,000 (integer) | https://www.prisonstudies.org/highest-to-lowest/prison_population_rate |
| `homicideRate` | UNODC — Intentional homicides per 100,000 | per 100,000 (2 decimals) | https://dataunodc.un.org/dp-intentional-homicide-victims |
| `tourists` | UNWTO — International tourist arrivals | millions (2 decimals) | https://www.unwto.org/tourism-statistics/key-tourism-statistics |
| `languages` | Ethnologue — Number of living languages | count (integer) | https://www.ethnologue.com/country/ |
| `precipitation` | World Bank Climate Change Knowledge Portal — Mean annual precipitation | mm/year (integer) | https://climateknowledgeportal.worldbank.org/ |

**Watch for zeros:**
- `homicideRate`: Some countries report very low but non-zero rates. Qatar, Japan may be <0.5 but not 0.
- `tourists`: Cabo Verde, Curaçao, Haiti receive tourists but numbers are small. Check UNWTO carefully — if truly missing, use national tourism board data.
- `renewableEnergy`: Iraq and some oil states may be very low — verify it's not 0.

### Step 2: Add to CountryStats interface

```typescript
  // Batch 2
  internetSpeed: number;    // Mbps avg download (Ookla)
  renewableEnergy: number;  // % electricity from renewables (Our World in Data)
  prisonRate: number;       // per 100,000 people (World Prison Brief)
  homicideRate: number;     // per 100,000 people (UNODC)
  tourists: number;         // international arrivals per year in millions (UNWTO)
  languages: number;        // number of living languages (Ethnologue)
  precipitation: number;    // mean annual precipitation mm/year (World Bank)
```

### Step 3: Add values to all 48 COUNTRIES entries

Same pattern as Batch 1 — add inline to each country row.

### Step 4: Add QUESTION_TYPES entries

```typescript
  {
    id: "internetSpeed",
    key: "internetSpeed",
    question: "WHICH HAS FASTER AVERAGE INTERNET DOWNLOAD SPEED?",
    getValue: (c) => COUNTRIES[c].internetSpeed,
    explain: (w, l, wv, lv) => `${w}: ${wv.toFixed(1)} Mbps vs ${l}: ${lv.toFixed(1)} Mbps`,
  },
  {
    id: "renewableEnergy",
    key: "renewableEnergy",
    question: "WHICH GENERATES MORE ELECTRICITY FROM RENEWABLES?",
    getValue: (c) => COUNTRIES[c].renewableEnergy,
    explain: (w, l, wv, lv) => `${w}: ${wv}% vs ${l}: ${lv}%`,
  },
  {
    id: "prisonRate",
    key: "prisonRate",
    question: "WHICH HAS A HIGHER PRISON POPULATION RATE?",
    getValue: (c) => COUNTRIES[c].prisonRate,
    explain: (w, l, wv, lv) => `${w}: ${wv} per 100,000 vs ${l}: ${lv} per 100,000`,
  },
  {
    id: "homicideRate",
    key: "homicideRate",
    question: "WHICH HAS A HIGHER HOMICIDE RATE?",
    getValue: (c) => COUNTRIES[c].homicideRate,
    explain: (w, l, wv, lv) => `${w}: ${wv.toFixed(2)}/100k vs ${l}: ${lv.toFixed(2)}/100k`,
  },
  {
    id: "tourists",
    key: "tourists",
    question: "WHICH RECEIVES MORE INTERNATIONAL TOURISTS PER YEAR?",
    getValue: (c) => COUNTRIES[c].tourists,
    explain: (w, l, wv, lv) => `${w}: ${wv.toFixed(1)}M vs ${l}: ${lv.toFixed(1)}M visitors`,
  },
  {
    id: "languages",
    key: "languages",
    question: "WHICH HAS MORE SPOKEN LANGUAGES?",
    getValue: (c) => COUNTRIES[c].languages,
    explain: (w, l, wv, lv) => `${w}: ${wv} languages vs ${l}: ${lv} languages`,
  },
  {
    id: "precipitation",
    key: "precipitation",
    question: "WHICH GETS MORE ANNUAL RAINFALL?",
    getValue: (c) => COUNTRIES[c].precipitation,
    explain: (w, l, wv, lv) => `${w}: ${wv.toLocaleString()} mm/yr vs ${l}: ${lv.toLocaleString()} mm/yr`,
  },
```

### Step 5: Add SOURCES entries

```typescript
  { label: "Internet speed", url: "https://www.speedtest.net/global-index" },
  { label: "Renewable energy", url: "https://ourworldindata.org/renewable-energy" },
  { label: "Prison population", url: "https://www.prisonstudies.org/highest-to-lowest/prison_population_rate" },
  { label: "Homicide rate", url: "https://dataunodc.un.org/dp-intentional-homicide-victims" },
  { label: "International tourism", url: "https://www.unwto.org/tourism-statistics/key-tourism-statistics" },
  { label: "Languages spoken", url: "https://www.ethnologue.com/country/" },
  { label: "Annual precipitation", url: "https://climateknowledgeportal.worldbank.org/" },
```

### Step 6: Verify + Commit

```bash
git add lib/countries.ts
git commit -m "Batch 2: add internetSpeed, renewableEnergy, prisonRate, homicideRate, tourists, languages, precipitation"
```

---

## Task 3: Batch 3 — Food & development (6 fields)

**Fields:** `coffeePc`, `cheesePc`, `honeyProduction`, `hospitalBeds`, `avgSchooling`, `electricityPc`

**Files:**
- Modify: `lib/countries.ts`

### Step 1: Research all 6 stats

| Field | Source | Unit | URL |
|---|---|---|---|
| `coffeePc` | ICO Coffee Report / FAO FAOSTAT Food Balance Sheets | kg/person/year (2 decimals) | https://www.fao.org/faostat/en/#data/FBS |
| `cheesePc` | FAO FAOSTAT Food Balance Sheets | kg/person/year (2 decimals) | https://www.fao.org/faostat/en/#data/FBS |
| `honeyProduction` | FAO FAOSTAT Production data | tonnes/year (integer) | https://www.fao.org/faostat/en/#data/QCL |
| `hospitalBeds` | World Bank — Hospital beds per 1,000 people | per 1,000 (1 decimal) | https://data.worldbank.org/indicator/SH.MED.BEDS.ZS |
| `avgSchooling` | UNDP Human Development Reports — Mean years of schooling | years (1 decimal) | https://hdr.undp.org/data-center/human-development-index |
| `electricityPc` | World Bank — Electric power consumption (kWh per capita) | kWh/person (integer) | https://data.worldbank.org/indicator/EG.USE.ELEC.KH.PC |

**Watch for zeros:**
- `cheesePc`: Many African/Asian countries consume little cheese but FAO still records small amounts. Haiti, Cabo Verde, DR Congo — verify carefully.
- `coffeePc`: Qatar and Gulf states have low coffee consumption vs. tea but should be non-zero.
- `honeyProduction`: Small island nations may have very low production. If Curaçao or Cabo Verde show 0, substitute with a small positive estimate from national sources, or drop this field.

### Step 2–5: Same pattern

Add to `CountryStats` interface:
```typescript
  // Batch 3
  coffeePc: number;       // kg coffee per person per year (FAO)
  cheesePc: number;       // kg cheese per person per year (FAO)
  honeyProduction: number; // tonnes of honey produced per year (FAO)
  hospitalBeds: number;   // per 1,000 people (World Bank)
  avgSchooling: number;   // mean years of schooling (UNDP)
  electricityPc: number;  // kWh per capita per year (World Bank)
```

Add QUESTION_TYPES:
```typescript
  {
    id: "coffeePc",
    key: "coffeePc",
    question: "WHICH DRINKS MORE COFFEE PER PERSON?",
    getValue: (c) => COUNTRIES[c].coffeePc,
    explain: (w, l, wv, lv) => `${w}: ${wv.toFixed(2)} kg/person vs ${l}: ${lv.toFixed(2)} kg/person`,
  },
  {
    id: "cheesePc",
    key: "cheesePc",
    question: "WHICH EATS MORE CHEESE PER PERSON?",
    getValue: (c) => COUNTRIES[c].cheesePc,
    explain: (w, l, wv, lv) => `${w}: ${wv.toFixed(2)} kg/person vs ${l}: ${lv.toFixed(2)} kg/person`,
  },
  {
    id: "honeyProduction",
    key: "honeyProduction",
    question: "WHICH PRODUCES MORE HONEY?",
    getValue: (c) => COUNTRIES[c].honeyProduction,
    explain: (w, l, wv, lv) => `${w}: ${wv.toLocaleString()} tonnes vs ${l}: ${lv.toLocaleString()} tonnes/yr`,
  },
  {
    id: "hospitalBeds",
    key: "hospitalBeds",
    question: "WHICH HAS MORE HOSPITAL BEDS PER 1,000 PEOPLE?",
    getValue: (c) => COUNTRIES[c].hospitalBeds,
    explain: (w, l, wv, lv) => `${w}: ${wv.toFixed(1)} vs ${l}: ${lv.toFixed(1)} beds per 1,000`,
  },
  {
    id: "avgSchooling",
    key: "avgSchooling",
    question: "WHICH HAS MORE AVERAGE YEARS OF SCHOOLING?",
    getValue: (c) => COUNTRIES[c].avgSchooling,
    explain: (w, l, wv, lv) => `${w}: ${wv.toFixed(1)} yrs vs ${l}: ${lv.toFixed(1)} yrs`,
  },
  {
    id: "electricityPc",
    key: "electricityPc",
    question: "WHICH CONSUMES MORE ELECTRICITY PER PERSON?",
    getValue: (c) => COUNTRIES[c].electricityPc,
    explain: (w, l, wv, lv) => `${w}: ${wv.toLocaleString()} kWh vs ${l}: ${lv.toLocaleString()} kWh/person`,
  },
```

Add SOURCES:
```typescript
  { label: "Coffee & cheese consumption", url: "https://www.fao.org/faostat/en/#data/FBS" },
  { label: "Honey production", url: "https://www.fao.org/faostat/en/#data/QCL" },
  { label: "Hospital beds", url: "https://data.worldbank.org/indicator/SH.MED.BEDS.ZS" },
  { label: "Mean years of schooling", url: "https://hdr.undp.org/data-center/human-development-index" },
  { label: "Electricity consumption", url: "https://data.worldbank.org/indicator/EG.USE.ELEC.KH.PC" },
```

### Step 6: Verify + Commit

```bash
git add lib/countries.ts
git commit -m "Batch 3: add coffeePc, cheesePc, honeyProduction, hospitalBeds, avgSchooling, electricityPc"
```

---

## Task 4: Batch 4 — Nature & infrastructure (5 fields)

**Fields:** `roadLength`, `threatenedSpecies`, `protectedLand`, `disasterRisk`

**Files:**
- Modify: `lib/countries.ts`

### Step 1: Research all 4 stats

| Field | Source | Unit | URL |
|---|---|---|---|
| `roadLength` | CIA World Factbook — Roadways total | km (integer) | https://www.cia.gov/the-world-factbook/field/roadways/ |
| `threatenedSpecies` | IUCN Red List — Total threatened species by country | count (integer) | https://www.iucnredlist.org/resources/summary-statistics |
| `protectedLand` | World Bank — Terrestrial protected areas (% of total land area) | % (1 decimal) | https://data.worldbank.org/indicator/ER.LND.PTLD.ZS |
| `disasterRisk` | INFORM Risk Index — Overall risk score | score 0–10 (1 decimal) | https://drmkc.jrc.ec.europa.eu/inform-index/INFORM-Risk |

**Watch for zeros:**
- `roadLength`: Curaçao is tiny but has roads. CIA Factbook may not list it — use OpenStreetMap stats or estimate from area. Cabo Verde should be fine.
- `threatenedSpecies`: All countries have some threatened species per IUCN. Smallest likely Curaçao — verify it's listed.
- `disasterRisk`: Qatar may be very low but non-zero. Check INFORM dataset directly.

### Step 2–5: Same pattern

Add to `CountryStats` interface:
```typescript
  // Batch 4
  roadLength: number;        // total road network km (CIA World Factbook)
  threatenedSpecies: number; // total threatened species (IUCN Red List)
  protectedLand: number;     // % of land area protected (World Bank)
  disasterRisk: number;      // INFORM Risk Index score (0-10)
```

Add QUESTION_TYPES:
```typescript
  {
    id: "roadLength",
    key: "roadLength",
    question: "WHICH HAS A LONGER ROAD NETWORK?",
    getValue: (c) => COUNTRIES[c].roadLength,
    explain: (w, l, wv, lv) => `${w}: ${wv.toLocaleString()} km vs ${l}: ${lv.toLocaleString()} km of roads`,
  },
  {
    id: "threatenedSpecies",
    key: "threatenedSpecies",
    question: "WHICH HAS MORE THREATENED SPECIES?",
    getValue: (c) => COUNTRIES[c].threatenedSpecies,
    explain: (w, l, wv, lv) => `${w}: ${wv} vs ${l}: ${lv} threatened species (IUCN)`,
  },
  {
    id: "protectedLand",
    key: "protectedLand",
    question: "WHICH HAS A HIGHER SHARE OF PROTECTED LAND?",
    getValue: (c) => COUNTRIES[c].protectedLand,
    explain: (w, l, wv, lv) => `${w}: ${wv}% vs ${l}: ${lv}% of territory protected`,
  },
  {
    id: "disasterRisk",
    key: "disasterRisk",
    question: "WHICH FACES HIGHER NATURAL DISASTER RISK?",
    getValue: (c) => COUNTRIES[c].disasterRisk,
    explain: (w, l, wv, lv) => `${w}: ${wv.toFixed(1)} vs ${l}: ${lv.toFixed(1)} (INFORM Risk score, higher = riskier)`,
  },
```

Add SOURCES:
```typescript
  { label: "Road network length", url: "https://www.cia.gov/the-world-factbook/field/roadways/" },
  { label: "Threatened species", url: "https://www.iucnredlist.org/resources/summary-statistics" },
  { label: "Protected land area", url: "https://data.worldbank.org/indicator/ER.LND.PTLD.ZS" },
  { label: "Disaster risk", url: "https://drmkc.jrc.ec.europa.eu/inform-index/INFORM-Risk" },
```

### Step 6: Verify + Commit

```bash
git add lib/countries.ts
git commit -m "Batch 4: add roadLength, threatenedSpecies, protectedLand, disasterRisk"
```

---

## Final verification checklist

- [ ] All 48 countries have values for every new field (no `undefined`, no `0` unless intentional)
- [ ] TypeScript compiles with no errors: `npx tsc --noEmit`
- [ ] `npm run dev` works, no console errors
- [ ] Play single player: confirm 10 questions appear per round
- [ ] Play several rounds: confirm new question types appear (birdSpecies, happinessScore, etc.)
- [ ] No tie questions appear (both countries same value)
- [ ] SOURCES array has an entry for every new data field
