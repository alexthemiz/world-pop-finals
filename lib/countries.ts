// Country stats, ISO codes for flags, and diaspora data for World Cup 2026 trivia.
// Country data is approximate. Diaspora figures are estimates.

export interface CountryStats {
  pop: number; // population
  area: number; // km^2
  founded: number; // year (negative not used; ancient = small positive like 843)
  gdp: number; // USD
}

export const COUNTRIES: Record<string, CountryStats> = {
  Mexico: { pop: 130e6, area: 1964375, founded: 1821, gdp: 1322e9 },
  "South Africa": { pop: 60e6, area: 1219090, founded: 1961, gdp: 419e9 },
  "South Korea": { pop: 52e6, area: 100210, founded: 1948, gdp: 1709e9 },
  Czechia: { pop: 10.9e6, area: 78866, founded: 1993, gdp: 330e9 },
  Canada: { pop: 38e6, area: 9984670, founded: 1867, gdp: 2140e9 },
  Bosnia: { pop: 3.2e6, area: 51197, founded: 1992, gdp: 24e9 },
  Qatar: { pop: 2.9e6, area: 11586, founded: 1971, gdp: 219e9 },
  Switzerland: { pop: 8.7e6, area: 41285, founded: 1848, gdp: 869e9 },
  Brazil: { pop: 215e6, area: 8515767, founded: 1822, gdp: 2081e9 },
  Morocco: { pop: 37e6, area: 446550, founded: 1956, gdp: 142e9 },
  Haiti: { pop: 11.4e6, area: 27750, founded: 1804, gdp: 21e9 },
  Scotland: { pop: 5.5e6, area: 77933, founded: 843, gdp: 245e9 },
  USA: { pop: 335e6, area: 9833517, founded: 1776, gdp: 27360e9 },
  Paraguay: { pop: 7.4e6, area: 406752, founded: 1811, gdp: 42e9 },
  Australia: { pop: 26e6, area: 7692024, founded: 1901, gdp: 1675e9 },
  Türkiye: { pop: 85e6, area: 783356, founded: 1923, gdp: 1108e9 },
  Germany: { pop: 84e6, area: 357114, founded: 1871, gdp: 4456e9 },
  Curaçao: { pop: 151e3, area: 444, founded: 2010, gdp: 3e9 },
  "Ivory Coast": { pop: 28e6, area: 322463, founded: 1960, gdp: 76e9 },
  Ecuador: { pop: 18e6, area: 283561, founded: 1830, gdp: 115e9 },
  Netherlands: { pop: 17.9e6, area: 41543, founded: 1815, gdp: 1118e9 },
  Japan: { pop: 124e6, area: 377930, founded: 660, gdp: 4213e9 },
  Sweden: { pop: 10.5e6, area: 450295, founded: 1523, gdp: 592e9 },
  Tunisia: { pop: 12e6, area: 163610, founded: 1956, gdp: 49e9 },
  Belgium: { pop: 11.6e6, area: 30528, founded: 1830, gdp: 627e9 },
  Egypt: { pop: 105e6, area: 1001449, founded: 1953, gdp: 476e9 },
  Iran: { pop: 87e6, area: 1648195, founded: 1979, gdp: 366e9 },
  "New Zealand": { pop: 5.1e6, area: 270467, founded: 1907, gdp: 247e9 },
  "Saudi Arabia": { pop: 35e6, area: 2149690, founded: 1932, gdp: 1069e9 },
  Uruguay: { pop: 3.5e6, area: 176215, founded: 1825, gdp: 77e9 },
  "Cabo Verde": { pop: 550e3, area: 4033, founded: 1975, gdp: 2e9 },
  Spain: { pop: 47.4e6, area: 505990, founded: 1479, gdp: 1582e9 },
  France: { pop: 68e6, area: 551695, founded: 843, gdp: 3031e9 },
  Senegal: { pop: 17e6, area: 196722, founded: 1960, gdp: 27e9 },
  Norway: { pop: 5.5e6, area: 385207, founded: 1905, gdp: 579e9 },
  Iraq: { pop: 42e6, area: 438317, founded: 1958, gdp: 264e9 },
  Argentina: { pop: 46e6, area: 2780400, founded: 1816, gdp: 621e9 },
  Algeria: { pop: 45e6, area: 2381741, founded: 1962, gdp: 194e9 },
  Austria: { pop: 9.1e6, area: 83871, founded: 1918, gdp: 512e9 },
  Jordan: { pop: 10.8e6, area: 89342, founded: 1946, gdp: 50e9 },
  Portugal: { pop: 10.3e6, area: 92212, founded: 1143, gdp: 287e9 },
  "DR Congo": { pop: 100e6, area: 2344858, founded: 1960, gdp: 65e9 },
  England: { pop: 57e6, area: 130279, founded: 927, gdp: 3340e9 },
  Croatia: { pop: 4e6, area: 56594, founded: 1991, gdp: 70e9 },
  Ghana: { pop: 33e6, area: 238533, founded: 1957, gdp: 77e9 },
  Panama: { pop: 4.4e6, area: 75417, founded: 1903, gdp: 67e9 },
  Colombia: { pop: 52e6, area: 1141748, founded: 1819, gdp: 363e9 },
  Uzbekistan: { pop: 36e6, area: 448978, founded: 1991, gdp: 90e9 },
  Angola: { pop: 0, area: 0, founded: 0, gdp: 0 }, // present in COUNTRIES list but not in MATCHES; kept for completeness
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
  Angola: "ao",
};

export function flagUrl(country: string): string {
  const code = ISO_CODES[country];
  return `https://flagcdn.com/w40/${code}.png`;
}

// Diaspora figures are in thousands (K). 11000 = 11M.
export const DIASPORA: Record<string, { aInB: number; bInA: number }> = {
  "Mexico|USA": { aInB: 11000, bInA: 120 },
  "South Korea|Czechia": { aInB: 10, bInA: 1 },
  "Canada|Bosnia": { aInB: 60, bInA: 2 },
  "Canada|Switzerland": { aInB: 40, bInA: 25 },
  "Bosnia|Qatar": { aInB: 60, bInA: 1 },
  "Brazil|Morocco": { aInB: 20, bInA: 5 },
  "Haiti|Scotland": { aInB: 3, bInA: 0.5 },
  "USA|Paraguay": { aInB: 150, bInA: 3 },
  "Australia|Türkiye": { aInB: 90, bInA: 20 },
  "Germany|Japan": { aInB: 35, bInA: 15 },
  "Netherlands|Japan": { aInB: 15, bInA: 8 },
  "Belgium|Egypt": { aInB: 60, bInA: 3 },
  "France|Senegal": { aInB: 750, bInA: 10 },
  "France|Iraq": { aInB: 80, bInA: 2 },
  "Norway|Senegal": { aInB: 15, bInA: 1 },
  "Argentina|Algeria": { aInB: 5, bInA: 8 },
  "Portugal|DR Congo": { aInB: 40, bInA: 3 },
  "England|Croatia": { aInB: 15, bInA: 8 },
  "England|Ghana": { aInB: 80, bInA: 3 },
  "Colombia|Uzbekistan": { aInB: 2, bInA: 1 },
  "Portugal|Uzbekistan": { aInB: 3, bInA: 1 },
  "Portugal|Colombia": { aInB: 20, bInA: 5 },
};

export function findDiaspora(
  a: string,
  b: string
): { aInB: number; bInA: number; a: string; b: string } | null {
  const direct = DIASPORA[`${a}|${b}`];
  if (direct) return { ...direct, a, b };
  const reversed = DIASPORA[`${b}|${a}`];
  if (reversed) {
    // reversed key is b|a, so its aInB is "b living in a" and bInA is "a living in b"
    return { aInB: reversed.bInA, bInA: reversed.aInB, a, b };
  }
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
    getValue: (country) => COUNTRIES[country].pop,
    explain: (winner, loser, wv, lv) =>
      `${winner}: ${(wv / 1e6).toFixed(1)}M vs ${loser}: ${(lv / 1e6).toFixed(1)}M`,
  },
  {
    id: "area",
    question: "WHICH HAS THE LARGER LAND AREA?",
    getValue: (country) => COUNTRIES[country].area,
    explain: (winner, loser, wv, lv) =>
      `${winner}: ${wv.toLocaleString()} km² vs ${loser}: ${lv.toLocaleString()} km²`,
  },
  {
    id: "older",
    question: "WHICH COUNTRY IS OLDER?",
    getValue: (country) => -COUNTRIES[country].founded,
    explain: (winner, loser, wv, lv) =>
      `${winner}: est. ${-wv} vs ${loser}: est. ${-lv}`,
  },
  {
    id: "gdp",
    question: "WHICH HAS THE HIGHER GDP?",
    getValue: (country) => COUNTRIES[country].gdp,
    explain: (winner, loser, wv, lv) => {
      const fmt = (v: number) =>
        v >= 1e12 ? `$${(v / 1e12).toFixed(1)}T` : `$${(v / 1e9).toFixed(0)}B`;
      return `${winner}: ${fmt(wv)} vs ${loser}: ${fmt(lv)}`;
    },
  },
  {
    id: "gdppc",
    question: "WHICH HAS HIGHER GDP PER CAPITA?",
    getValue: (country) => COUNTRIES[country].gdp / COUNTRIES[country].pop,
    explain: (winner, loser, wv, lv) =>
      `${winner}: $${Math.round(wv).toLocaleString()}/person vs ${loser}: $${Math.round(
        lv
      ).toLocaleString()}/person`,
  },
];

export const SOURCES = [
  {
    label: "Population & area",
    url: "https://www.worldometers.info/world-population/population-by-country/",
  },
  { label: "GDP", url: "https://data.worldbank.org/indicator/NY.GDP.MKTP.CD" },
  {
    label: "Founding years",
    url: "https://restcountries.com/",
  },
  {
    label: "Diaspora",
    url: "https://www.un.org/development/desa/pd/content/international-migrant-stock",
  },
  { label: "WC 2026 schedule", url: "https://worldcuppass.com/schedule/" },
  {
    label: "WC 2026 groups",
    url: "https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026",
  },
];
