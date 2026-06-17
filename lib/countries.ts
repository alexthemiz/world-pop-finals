// Country stats, ISO codes for flags, and diaspora data for World Cup 2026 trivia.
// Country data is approximate. Sources listed in SOURCES array below.

export interface CountryStats {
  pop: number;        // population
  area: number;       // km²
  founded: number;    // year established
  gdp: number;        // USD (nominal)
  lifeExp: number;    // life expectancy at birth (years)
  medianAge: number;  // median age (years)
  co2pc: number;      // CO2 emissions per capita (tonnes)
  unesco: number;     // UNESCO World Heritage Sites
  fifa: number;       // FIFA ranking (lower = better; use -fifa for getValue)
  wcApps: number;     // FIFA World Cup appearances (all-time)
  nobel: number;      // Nobel Prize winners (all-time, by country of birth/citizenship)
  unemployment: number; // unemployment rate (%)
  elevation: number;  // mean elevation (metres)
  forest: number;     // forest coverage (%)
  coastline: number;  // coastline length (km)
}

export const COUNTRIES: Record<string, CountryStats> = {
  //                    pop        area      founded  gdp         lifeExp medAge  co2pc  unesco  fifa  wcApps  nobel  unemp   elev  forest  coast
  Mexico:           { pop:130e6,  area:1964375, founded:1821, gdp:1322e9,  lifeExp:75,  medianAge:29, co2pc:3.7,  unesco:35, fifa:15,  wcApps:17, nobel:2,   unemployment:2.8,  elevation:1111, forest:34,  coastline:9330 },
  "South Africa":   { pop:60e6,   area:1219090, founded:1961, gdp:419e9,   lifeExp:64,  medianAge:28, co2pc:7.0,  unesco:10, fifa:66,  wcApps:3,  nobel:11,  unemployment:32.9, elevation:1034, forest:8,   coastline:2798 },
  "South Korea":    { pop:52e6,   area:100210,  founded:1948, gdp:1709e9,  lifeExp:83,  medianAge:44, co2pc:11.6, unesco:16, fifa:22,  wcApps:11, nobel:2,   unemployment:2.7,  elevation:282,  forest:64,  coastline:2413 },
  Czechia:          { pop:10.9e6, area:78866,   founded:1993, gdp:330e9,   lifeExp:78,  medianAge:43, co2pc:9.0,  unesco:17, fifa:37,  wcApps:9,  nobel:12,  unemployment:2.6,  elevation:433,  forest:34,  coastline:0 },
  Canada:           { pop:38e6,   area:9984670, founded:1867, gdp:2140e9,  lifeExp:82,  medianAge:41, co2pc:14.2, unesco:22, fifa:45,  wcApps:4,  nobel:30,  unemployment:5.8,  elevation:487,  forest:38,  coastline:202080 },
  Bosnia:           { pop:3.2e6,  area:51197,   founded:1992, gdp:24e9,    lifeExp:77,  medianAge:43, co2pc:5.8,  unesco:4,  fifa:65,  wcApps:1,  nobel:1,   unemployment:14.5, elevation:500,  forest:43,  coastline:20 },
  Qatar:            { pop:2.9e6,  area:11586,   founded:1971, gdp:219e9,   lifeExp:78,  medianAge:33, co2pc:31.7, unesco:1,  fifa:37,  wcApps:2,  nobel:0,   unemployment:0.1,  elevation:28,   forest:0,   coastline:563 },
  Switzerland:      { pop:8.7e6,  area:41285,   founded:1848, gdp:869e9,   lifeExp:83,  medianAge:43, co2pc:4.2,  unesco:13, fifa:19,  wcApps:11, nobel:32,  unemployment:4.2,  elevation:1350, forest:32,  coastline:0 },
  Brazil:           { pop:215e6,  area:8515767, founded:1822, gdp:2081e9,  lifeExp:75,  medianAge:34, co2pc:2.3,  unesco:23, fifa:6,   wcApps:22, nobel:1,   unemployment:7.8,  elevation:320,  forest:59,  coastline:7491 },
  Morocco:          { pop:37e6,   area:446550,  founded:1956, gdp:142e9,   lifeExp:77,  medianAge:29, co2pc:1.9,  unesco:9,  fifa:14,  wcApps:7,  nobel:1,   unemployment:11.8, elevation:909,  forest:13,  coastline:1835 },
  Haiti:            { pop:11.4e6, area:27750,   founded:1804, gdp:21e9,    lifeExp:64,  medianAge:23, co2pc:0.3,  unesco:1,  fifa:83,  wcApps:1,  nobel:1,   unemployment:14.6, elevation:470,  forest:4,   coastline:1771 },
  Scotland:         { pop:5.5e6,  area:77933,   founded:843,  gdp:245e9,   lifeExp:77,  medianAge:42, co2pc:5.5,  unesco:6,  fifa:40,  wcApps:8,  nobel:14,  unemployment:4.1,  elevation:457,  forest:19,  coastline:11800 },
  USA:              { pop:335e6,  area:9833517, founded:1776, gdp:27360e9, lifeExp:77,  medianAge:38, co2pc:14.4, unesco:24, fifa:11,  wcApps:11, nobel:400, unemployment:3.7,  elevation:760,  forest:33,  coastline:19924 },
  Paraguay:         { pop:7.4e6,  area:406752,  founded:1811, gdp:42e9,    lifeExp:74,  medianAge:28, co2pc:0.9,  unesco:1,  fifa:53,  wcApps:9,  nobel:0,   unemployment:5.8,  elevation:178,  forest:44,  coastline:0 },
  Australia:        { pop:26e6,   area:7692024, founded:1901, gdp:1675e9,  lifeExp:83,  medianAge:38, co2pc:14.8, unesco:20, fifa:23,  wcApps:5,  nobel:15,  unemployment:3.7,  elevation:330,  forest:17,  coastline:25760 },
  Türkiye:          { pop:85e6,   area:783356,  founded:1923, gdp:1108e9,  lifeExp:77,  medianAge:33, co2pc:5.9,  unesco:21, fifa:29,  wcApps:2,  nobel:1,   unemployment:9.7,  elevation:1132, forest:28,  coastline:7200 },
  Germany:          { pop:84e6,   area:357114,  founded:1871, gdp:4456e9,  lifeExp:81,  medianAge:45, co2pc:8.1,  unesco:52, fifa:14,  wcApps:20, nobel:114, unemployment:3.0,  elevation:263,  forest:32,  coastline:2389 },
  Curaçao:          { pop:151e3,  area:444,     founded:2010, gdp:3e9,     lifeExp:78,  medianAge:39, co2pc:8.5,  unesco:0,  fifa:82,  wcApps:0,  nobel:0,   unemployment:13.0, elevation:61,   forest:1,   coastline:364 },
  "Ivory Coast":    { pop:28e6,   area:322463,  founded:1960, gdp:76e9,    lifeExp:59,  medianAge:19, co2pc:0.5,  unesco:5,  fifa:40,  wcApps:4,  nobel:1,   unemployment:2.6,  elevation:250,  forest:33,  coastline:515 },
  Ecuador:          { pop:18e6,   area:283561,  founded:1830, gdp:115e9,   lifeExp:77,  medianAge:28, co2pc:2.3,  unesco:5,  fifa:32,  wcApps:4,  nobel:0,   unemployment:3.8,  elevation:1117, forest:57,  coastline:2237 },
  Netherlands:      { pop:17.9e6, area:41543,   founded:1815, gdp:1118e9,  lifeExp:82,  medianAge:43, co2pc:8.8,  unesco:13, fifa:7,   wcApps:11, nobel:22,  unemployment:3.6,  elevation:30,   forest:11,  coastline:451 },
  Japan:            { pop:124e6,  area:377930,  founded:660,  gdp:4213e9,  lifeExp:84,  medianAge:49, co2pc:8.5,  unesco:25, fifa:18,  wcApps:8,  nobel:29,  unemployment:2.6,  elevation:438,  forest:69,  coastline:29751 },
  Sweden:           { pop:10.5e6, area:450295,  founded:1523, gdp:592e9,   lifeExp:83,  medianAge:41, co2pc:3.9,  unesco:15, fifa:25,  wcApps:12, nobel:33,  unemployment:8.5,  elevation:320,  forest:69,  coastline:3218 },
  Tunisia:          { pop:12e6,   area:163610,  founded:1956, gdp:49e9,    lifeExp:76,  medianAge:32, co2pc:2.8,  unesco:8,  fifa:28,  wcApps:6,  nobel:1,   unemployment:15.3, elevation:246,  forest:7,   coastline:1148 },
  Belgium:          { pop:11.6e6, area:30528,   founded:1830, gdp:627e9,   lifeExp:81,  medianAge:42, co2pc:8.2,  unesco:16, fifa:3,   wcApps:14, nobel:11,  unemployment:5.5,  elevation:181,  forest:23,  coastline:66 },
  Egypt:            { pop:105e6,  area:1001449, founded:1953, gdp:476e9,   lifeExp:72,  medianAge:25, co2pc:2.3,  unesco:7,  fifa:35,  wcApps:3,  nobel:4,   unemployment:7.3,  elevation:321,  forest:0,   coastline:2450 },
  Iran:             { pop:87e6,   area:1648195, founded:1979, gdp:366e9,   lifeExp:77,  medianAge:32, co2pc:8.4,  unesco:27, fifa:20,  wcApps:6,  nobel:1,   unemployment:9.0,  elevation:1305, forest:7,   coastline:2440 },
  "New Zealand":    { pop:5.1e6,  area:270467,  founded:1907, gdp:247e9,   lifeExp:82,  medianAge:38, co2pc:6.9,  unesco:3,  fifa:98,  wcApps:3,  nobel:3,   unemployment:3.7,  elevation:388,  forest:38,  coastline:15134 },
  "Saudi Arabia":   { pop:35e6,   area:2149690, founded:1932, gdp:1069e9,  lifeExp:76,  medianAge:31, co2pc:18.6, unesco:7,  fifa:56,  wcApps:6,  nobel:0,   unemployment:5.6,  elevation:665,  forest:1,   coastline:2640 },
  Uruguay:          { pop:3.5e6,  area:176215,  founded:1825, gdp:77e9,    lifeExp:78,  medianAge:36, co2pc:2.2,  unesco:3,  fifa:18,  wcApps:14, nobel:2,   unemployment:8.3,  elevation:109,  forest:10,  coastline:660 },
  "Cabo Verde":     { pop:550e3,  area:4033,    founded:1975, gdp:2e9,     lifeExp:73,  medianAge:27, co2pc:1.0,  unesco:1,  fifa:78,  wcApps:0,  nobel:0,   unemployment:11.0, elevation:442,  forest:21,  coastline:965 },
  Spain:            { pop:47.4e6, area:505990,  founded:1479, gdp:1582e9,  lifeExp:83,  medianAge:45, co2pc:5.8,  unesco:50, fifa:3,   wcApps:16, nobel:8,   unemployment:12.2, elevation:660,  forest:37,  coastline:4964 },
  France:           { pop:68e6,   area:551695,  founded:843,  gdp:3031e9,  lifeExp:82,  medianAge:42, co2pc:4.6,  unesco:53, fifa:2,   wcApps:16, nobel:73,  unemployment:7.3,  elevation:375,  forest:31,  coastline:4853 },
  Senegal:          { pop:17e6,   area:196722,  founded:1960, gdp:27e9,    lifeExp:68,  medianAge:19, co2pc:0.7,  unesco:7,  fifa:20,  wcApps:4,  nobel:1,   unemployment:18.9, elevation:69,   forest:45,  coastline:531 },
  Norway:           { pop:5.5e6,  area:385207,  founded:1905, gdp:579e9,   lifeExp:83,  medianAge:40, co2pc:7.6,  unesco:8,  fifa:22,  wcApps:3,  nobel:14,  unemployment:3.6,  elevation:460,  forest:33,  coastline:25148 },
  Iraq:             { pop:42e6,   area:438317,  founded:1958, gdp:264e9,   lifeExp:70,  medianAge:20, co2pc:4.4,  unesco:6,  fifa:59,  wcApps:1,  nobel:0,   unemployment:15.5, elevation:312,  forest:2,   coastline:58 },
  Argentina:        { pop:46e6,   area:2780400, founded:1816, gdp:621e9,   lifeExp:77,  medianAge:31, co2pc:4.2,  unesco:12, fifa:1,   wcApps:18, nobel:5,   unemployment:6.9,  elevation:809,  forest:10,  coastline:4989 },
  Algeria:          { pop:45e6,   area:2381741, founded:1962, gdp:194e9,   lifeExp:77,  medianAge:29, co2pc:4.0,  unesco:7,  fifa:52,  wcApps:4,  nobel:0,   unemployment:11.7, elevation:800,  forest:1,   coastline:998 },
  Austria:          { pop:9.1e6,  area:83871,   founded:1918, gdp:512e9,   lifeExp:81,  medianAge:44, co2pc:7.3,  unesco:12, fifa:27,  wcApps:7,  nobel:22,  unemployment:5.2,  elevation:910,  forest:47,  coastline:0 },
  Jordan:           { pop:10.8e6, area:89342,   founded:1946, gdp:50e9,    lifeExp:74,  medianAge:23, co2pc:2.9,  unesco:6,  fifa:87,  wcApps:0,  nobel:0,   unemployment:18.1, elevation:812,  forest:1,   coastline:26 },
  Portugal:         { pop:10.3e6, area:92212,   founded:1143, gdp:287e9,   lifeExp:81,  medianAge:46, co2pc:4.7,  unesco:17, fifa:6,   wcApps:9,  nobel:1,   unemployment:6.6,  elevation:372,  forest:35,  coastline:1793 },
  "DR Congo":       { pop:100e6,  area:2344858, founded:1960, gdp:65e9,    lifeExp:61,  medianAge:17, co2pc:0.03, unesco:5,  fifa:60,  wcApps:1,  nobel:0,   unemployment:4.5,  elevation:726,  forest:56,  coastline:37 },
  England:          { pop:57e6,   area:130279,  founded:927,  gdp:3340e9,  lifeExp:81,  medianAge:40, co2pc:5.5,  unesco:19, fifa:5,   wcApps:17, nobel:90,  unemployment:4.2,  elevation:162,  forest:13,  coastline:3230 },
  Croatia:          { pop:4e6,    area:56594,   founded:1991, gdp:70e9,    lifeExp:78,  medianAge:44, co2pc:4.4,  unesco:10, fifa:10,  wcApps:6,  nobel:2,   unemployment:6.1,  elevation:331,  forest:34,  coastline:5835 },
  Ghana:            { pop:33e6,   area:238533,  founded:1957, gdp:77e9,    lifeExp:64,  medianAge:22, co2pc:0.6,  unesco:2,  fifa:59,  wcApps:4,  nobel:0,   unemployment:3.2,  elevation:190,  forest:22,  coastline:539 },
  Panama:           { pop:4.4e6,  area:75417,   founded:1903, gdp:67e9,    lifeExp:78,  medianAge:29, co2pc:3.0,  unesco:5,  fifa:48,  wcApps:2,  nobel:1,   unemployment:7.1,  elevation:360,  forest:57,  coastline:2490 },
  Colombia:         { pop:52e6,   area:1141748, founded:1819, gdp:363e9,   lifeExp:77,  medianAge:31, co2pc:1.8,  unesco:9,  fifa:9,   wcApps:6,  nobel:1,   unemployment:9.2,  elevation:593,  forest:53,  coastline:3208 },
  Uzbekistan:       { pop:36e6,   area:448978,  founded:1991, gdp:90e9,    lifeExp:75,  medianAge:29, co2pc:3.5,  unesco:7,  fifa:74,  wcApps:0,  nobel:0,   unemployment:9.3,  elevation:1021, forest:8,   coastline:0 },
};

export const ISO_CODES: Record<string, string> = {
  Mexico: "mx",
  "South Africa": "za",
  "South Korea": "kr",
  Czechia: "cz",
  Canada: "ca",
  Bosnia: "ba",
  Qatar: "qa",
  Switzerland: "ch",
  Brazil: "br",
  Morocco: "ma",
  Haiti: "ht",
  Scotland: "gb-sct",
  USA: "us",
  Paraguay: "py",
  Australia: "au",
  Türkiye: "tr",
  Germany: "de",
  Curaçao: "cw",
  "Ivory Coast": "ci",
  Ecuador: "ec",
  Netherlands: "nl",
  Japan: "jp",
  Sweden: "se",
  Tunisia: "tn",
  Belgium: "be",
  Egypt: "eg",
  Iran: "ir",
  "New Zealand": "nz",
  "Saudi Arabia": "sa",
  Uruguay: "uy",
  "Cabo Verde": "cv",
  Spain: "es",
  France: "fr",
  Senegal: "sn",
  Norway: "no",
  Iraq: "iq",
  Argentina: "ar",
  Algeria: "dz",
  Austria: "at",
  Jordan: "jo",
  Portugal: "pt",
  "DR Congo": "cd",
  England: "gb-eng",
  Croatia: "hr",
  Ghana: "gh",
  Panama: "pa",
  Colombia: "co",
  Uzbekistan: "uz",
};

export function flagUrl(country: string): string {
  const code = ISO_CODES[country];
  return `https://flagcdn.com/w40/${code}.png`;
}

// Diaspora figures are in thousands (K). 11000 = 11M.
export const DIASPORA: Record<string, { aInB: number; bInA: number }> = {
  "Mexico|USA":          { aInB: 11000, bInA: 120 },
  "South Korea|Czechia": { aInB: 10,    bInA: 1 },
  "Canada|Bosnia":       { aInB: 60,    bInA: 2 },
  "Canada|Switzerland":  { aInB: 40,    bInA: 25 },
  "Bosnia|Qatar":        { aInB: 60,    bInA: 1 },
  "Brazil|Morocco":      { aInB: 20,    bInA: 5 },
  "Haiti|Scotland":      { aInB: 3,     bInA: 0.5 },
  "USA|Paraguay":        { aInB: 150,   bInA: 3 },
  "Australia|Türkiye":   { aInB: 90,    bInA: 20 },
  "Germany|Japan":       { aInB: 35,    bInA: 15 },
  "Netherlands|Japan":   { aInB: 15,    bInA: 8 },
  "Belgium|Egypt":       { aInB: 60,    bInA: 3 },
  "France|Senegal":      { aInB: 750,   bInA: 10 },
  "France|Iraq":         { aInB: 80,    bInA: 2 },
  "Norway|Senegal":      { aInB: 15,    bInA: 1 },
  "Argentina|Algeria":   { aInB: 5,     bInA: 8 },
  "Portugal|DR Congo":   { aInB: 40,    bInA: 3 },
  "England|Croatia":     { aInB: 15,    bInA: 8 },
  "England|Ghana":       { aInB: 80,    bInA: 3 },
  "Colombia|Uzbekistan": { aInB: 2,     bInA: 1 },
  "Portugal|Uzbekistan": { aInB: 3,     bInA: 1 },
  "Portugal|Colombia":   { aInB: 20,    bInA: 5 },
};

export function findDiaspora(
  a: string,
  b: string
): { aInB: number; bInA: number; a: string; b: string } | null {
  const direct = DIASPORA[`${a}|${b}`];
  if (direct) return { ...direct, a, b };
  const reversed = DIASPORA[`${b}|${a}`];
  if (reversed) return { aInB: reversed.bInA, bInA: reversed.aInB, a, b };
  return null;
}

export function formatDiasporaCount(thousands: number): string {
  if (thousands >= 1000) return `${(thousands / 1000).toFixed(1)}M`;
  return `${thousands}K`;
}

export interface QuestionType {
  id: string;
  question: string;
  getValue: (country: string) => number;
  explain: (winner: string, loser: string, wv: number, lv: number) => string;
}

export const QUESTION_TYPES: QuestionType[] = [
  {
    id: "pop",
    question: "WHICH HAS THE LARGER POPULATION?",
    getValue: (c) => COUNTRIES[c].pop,
    explain: (w, l, wv, lv) => `${w}: ${(wv/1e6).toFixed(1)}M vs ${l}: ${(lv/1e6).toFixed(1)}M`,
  },
  {
    id: "area",
    question: "WHICH HAS THE LARGER LAND AREA?",
    getValue: (c) => COUNTRIES[c].area,
    explain: (w, l, wv, lv) => `${w}: ${wv.toLocaleString()} km² vs ${l}: ${lv.toLocaleString()} km²`,
  },
  {
    id: "older",
    question: "WHICH COUNTRY IS OLDER?",
    getValue: (c) => -COUNTRIES[c].founded,
    explain: (w, l, wv, lv) => `${w}: est. ${-wv} vs ${l}: est. ${-lv}`,
  },
  {
    id: "gdp",
    question: "WHICH HAS THE HIGHER GDP?",
    getValue: (c) => COUNTRIES[c].gdp,
    explain: (w, l, wv, lv) => {
      const fmt = (v: number) => v >= 1e12 ? `$${(v/1e12).toFixed(1)}T` : `$${(v/1e9).toFixed(0)}B`;
      return `${w}: ${fmt(wv)} vs ${l}: ${fmt(lv)}`;
    },
  },
  {
    id: "gdppc",
    question: "WHICH HAS HIGHER GDP PER CAPITA?",
    getValue: (c) => COUNTRIES[c].gdp / COUNTRIES[c].pop,
    explain: (w, l, wv, lv) => `${w}: $${Math.round(wv).toLocaleString()}/person vs ${l}: $${Math.round(lv).toLocaleString()}/person`,
  },
  {
    id: "density",
    question: "WHICH IS MORE DENSELY POPULATED?",
    getValue: (c) => COUNTRIES[c].pop / COUNTRIES[c].area,
    explain: (w, l, wv, lv) => `${w}: ${wv.toFixed(1)}/km² vs ${l}: ${lv.toFixed(1)}/km²`,
  },
  {
    id: "lifeExp",
    question: "WHICH HAS HIGHER LIFE EXPECTANCY?",
    getValue: (c) => COUNTRIES[c].lifeExp,
    explain: (w, l, wv, lv) => `${w}: ${wv} yrs vs ${l}: ${lv} yrs`,
  },
  {
    id: "medianAge",
    question: "WHICH HAS THE HIGHER MEDIAN AGE?",
    getValue: (c) => COUNTRIES[c].medianAge,
    explain: (w, l, wv, lv) => `${w}: ${wv} yrs vs ${l}: ${lv} yrs`,
  },
  {
    id: "co2pc",
    question: "WHICH EMITS MORE CO₂ PER PERSON?",
    getValue: (c) => COUNTRIES[c].co2pc,
    explain: (w, l, wv, lv) => `${w}: ${wv}t vs ${l}: ${lv}t per capita`,
  },
  {
    id: "unesco",
    question: "WHICH HAS MORE UNESCO WORLD HERITAGE SITES?",
    getValue: (c) => COUNTRIES[c].unesco,
    explain: (w, l, wv, lv) => `${w}: ${wv} sites vs ${l}: ${lv} sites`,
  },
  {
    id: "fifa",
    question: "WHICH HAS THE BETTER FIFA RANKING?",
    getValue: (c) => -COUNTRIES[c].fifa,
    explain: (w, l, wv, lv) => `${w}: #${-wv} vs ${l}: #${-lv}`,
  },
  {
    id: "wcApps",
    question: "WHICH HAS MORE WORLD CUP APPEARANCES?",
    getValue: (c) => COUNTRIES[c].wcApps,
    explain: (w, l, wv, lv) => `${w}: ${wv} appearances vs ${l}: ${lv} appearances`,
  },
  {
    id: "nobel",
    question: "WHICH HAS WON MORE NOBEL PRIZES?",
    getValue: (c) => COUNTRIES[c].nobel,
    explain: (w, l, wv, lv) => `${w}: ${wv} prizes vs ${l}: ${lv} prizes`,
  },
  {
    id: "unemployment",
    question: "WHICH HAS LOWER UNEMPLOYMENT?",
    getValue: (c) => -COUNTRIES[c].unemployment,
    explain: (w, l, wv, lv) => `${w}: ${-wv}% vs ${l}: ${-lv}%`,
  },
  {
    id: "elevation",
    question: "WHICH HAS HIGHER AVERAGE ELEVATION?",
    getValue: (c) => COUNTRIES[c].elevation,
    explain: (w, l, wv, lv) => `${w}: ${wv}m vs ${l}: ${lv}m`,
  },
  {
    id: "forest",
    question: "WHICH HAS MORE FOREST COVERAGE?",
    getValue: (c) => COUNTRIES[c].forest,
    explain: (w, l, wv, lv) => `${w}: ${wv}% vs ${l}: ${lv}%`,
  },
  {
    id: "coastline",
    question: "WHICH HAS A LONGER COASTLINE?",
    getValue: (c) => COUNTRIES[c].coastline,
    explain: (w, l, wv, lv) => `${w}: ${wv.toLocaleString()} km vs ${l}: ${lv.toLocaleString()} km`,
  },
];

export const SOURCES = [
  { label: "Population & area", url: "https://www.worldometers.info/world-population/population-by-country/" },
  { label: "GDP", url: "https://data.worldbank.org/indicator/NY.GDP.MKTP.CD" },
  { label: "Founding years", url: "https://restcountries.com/" },
  { label: "Diaspora", url: "https://www.un.org/development/desa/pd/content/international-migrant-stock" },
  { label: "Life expectancy & median age", url: "https://www.worldometers.info/demographics/" },
  { label: "CO₂ emissions", url: "https://ourworldindata.org/co2-emissions" },
  { label: "UNESCO World Heritage Sites", url: "https://whc.unesco.org/en/list/" },
  { label: "FIFA rankings", url: "https://www.fifa.com/fifa-world-ranking/men" },
  { label: "World Cup history", url: "https://www.fifa.com/en/tournaments/mens/worldcup" },
  { label: "Nobel Prizes", url: "https://www.nobelprize.org/" },
  { label: "Unemployment", url: "https://data.worldbank.org/indicator/SL.UEM.TOTL.ZS" },
  { label: "Elevation", url: "https://www.worlddata.info/average-elevation.php" },
  { label: "Forest coverage", url: "https://data.worldbank.org/indicator/AG.LND.FRST.ZS" },
  { label: "Coastline", url: "https://www.cia.gov/the-world-factbook/" },
  { label: "WC 2026 schedule", url: "https://worldcuppass.com/schedule/" },
  { label: "WC 2026 groups", url: "https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026" },
];
