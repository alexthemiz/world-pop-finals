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
  // Batch 1 — whimsy stats
  fertilityRate: number;  // births per woman (UN/World Bank)
  obesityRate: number;    // % adults obese, age-standardised (WHO/World Obesity Federation)
  happinessScore: number; // World Happiness Report 2025 ladder score (0–10)
  birdSpecies: number;    // recorded bird species (BirdLife International / BioDB)
  firearmsRate: number;   // civilian firearms per 100 people (Small Arms Survey 2018)
  teaPc: number;          // kg tea consumed per capita per year (FAO; includes mate for S. America)
  publicHolidays: number; // national public holidays (count)
}

export const COUNTRIES: Record<string, CountryStats> = {
  //                    pop        area      founded  gdp         lifeExp medAge  co2pc  unesco  fifa  wcApps  nobel  unemp   elev  forest  coast          fertRate  obesity  happy   birds  firearms  teaPc   pubHol
  Mexico:           { pop:130e6,  area:1964375, founded:1821, gdp:1322e9,  lifeExp:75,  medianAge:29, co2pc:3.7,  unesco:35, fifa:14,  wcApps:17, nobel:2,   unemployment:2.8,  elevation:1111, forest:34,  coastline:9330,   fertilityRate:1.87, obesityRate:32.22, happinessScore:6.98, birdSpecies:1137, firearmsRate:12.9,  teaPc:0.01,  publicHolidays:7 },
  "South Africa":   { pop:60e6,   area:1219090, founded:1961, gdp:419e9,   lifeExp:64,  medianAge:28, co2pc:7.0,  unesco:10, fifa:60,  wcApps:3,  nobel:11,  unemployment:32.9, elevation:1034, forest:8,   coastline:2798,   fertilityRate:2.19, obesityRate:14.50, happinessScore:5.01, birdSpecies:762,  firearmsRate:9.7,   teaPc:0.28,  publicHolidays:12 },
  "South Korea":    { pop:52e6,   area:100210,  founded:1948, gdp:1709e9,  lifeExp:83,  medianAge:44, co2pc:11.6, unesco:16, fifa:25,  wcApps:11, nobel:2,   unemployment:2.7,  elevation:282,  forest:64,  coastline:2413,   fertilityRate:0.75, obesityRate:8.82,  happinessScore:6.04, birdSpecies:357,  firearmsRate:0.2,   teaPc:0.07,  publicHolidays:14 },
  Czechia:          { pop:10.9e6, area:78866,   founded:1993, gdp:330e9,   lifeExp:78,  medianAge:43, co2pc:9.0,  unesco:17, fifa:40,  wcApps:9,  nobel:12,  unemployment:2.6,  elevation:433,  forest:34,  coastline:0,      fertilityRate:1.47, obesityRate:30.72, happinessScore:6.77, birdSpecies:282,  firearmsRate:27.5,  teaPc:0.26,  publicHolidays:13 },
  Canada:           { pop:38e6,   area:9984670, founded:1867, gdp:2140e9,  lifeExp:82,  medianAge:41, co2pc:14.2, unesco:22, fifa:30,  wcApps:4,  nobel:30,  unemployment:5.8,  elevation:487,  forest:38,  coastline:202080, fertilityRate:1.33, obesityRate:28.16, happinessScore:6.80, birdSpecies:495,  firearmsRate:34.7,  teaPc:0.40,  publicHolidays:10 },
  Bosnia:           { pop:3.2e6,  area:51197,   founded:1992, gdp:24e9,    lifeExp:77,  medianAge:43, co2pc:5.8,  unesco:4,  fifa:64,  wcApps:1,  nobel:1,   unemployment:14.5, elevation:500,  forest:43,  coastline:20,     fertilityRate:1.50, obesityRate:22.41, happinessScore:6.38, birdSpecies:281,  firearmsRate:31.2,  teaPc:0.04,  publicHolidays:10 },
  Qatar:            { pop:2.9e6,  area:11586,   founded:1971, gdp:219e9,   lifeExp:78,  medianAge:33, co2pc:31.7, unesco:1,  fifa:56,  wcApps:2,  nobel:0,   unemployment:0.1,  elevation:28,   forest:0,   coastline:563,    fertilityRate:1.70, obesityRate:40.79, happinessScore:6.37, birdSpecies:230,  firearmsRate:16.7,  teaPc:1.50,  publicHolidays:4 },
  Switzerland:      { pop:8.7e6,  area:41285,   founded:1848, gdp:869e9,   lifeExp:83,  medianAge:43, co2pc:4.2,  unesco:13, fifa:19,  wcApps:11, nobel:32,  unemployment:4.2,  elevation:1350, forest:32,  coastline:0,      fertilityRate:1.44, obesityRate:15.07, happinessScore:6.94, birdSpecies:286,  firearmsRate:27.6,  teaPc:0.29,  publicHolidays:9 },
  Brazil:           { pop:215e6,  area:8515767, founded:1822, gdp:2081e9,  lifeExp:75,  medianAge:34, co2pc:2.3,  unesco:23, fifa:6,   wcApps:22, nobel:1,   unemployment:7.8,  elevation:320,  forest:59,  coastline:7491,   fertilityRate:1.60, obesityRate:25.05, happinessScore:6.55, birdSpecies:1864, firearmsRate:8.3,   teaPc:2.57,  publicHolidays:12 },  // teaPc includes yerba mate
  Morocco:          { pop:37e6,   area:446550,  founded:1956, gdp:142e9,   lifeExp:77,  medianAge:29, co2pc:1.9,  unesco:9,  fifa:7,   wcApps:7,  nobel:1,   unemployment:11.8, elevation:909,  forest:13,  coastline:1835,   fertilityRate:1.98, obesityRate:13.79, happinessScore:4.65, birdSpecies:343,  firearmsRate:4.8,   teaPc:2.15,  publicHolidays:16 },
  Haiti:            { pop:11.4e6, area:27750,   founded:1804, gdp:21e9,    lifeExp:64,  medianAge:23, co2pc:0.3,  unesco:1,  fifa:82,  wcApps:1,  nobel:1,   unemployment:14.6, elevation:470,  forest:4,   coastline:1771,   fertilityRate:2.59, obesityRate:6.73,  happinessScore:3.62, birdSpecies:244,  firearmsRate:2.6,   teaPc:0.02,  publicHolidays:14 },  // happiness estimated from most recent available WHR data
  Scotland:         { pop:5.5e6,  area:77933,   founded:843,  gdp:245e9,   lifeExp:77,  medianAge:42, co2pc:5.5,  unesco:6,  fifa:42,  wcApps:8,  nobel:14,  unemployment:4.1,  elevation:457,  forest:19,  coastline:11800,  fertilityRate:1.54, obesityRate:26.94, happinessScore:6.73, birdSpecies:535,  firearmsRate:5.6,   teaPc:1.94,  publicHolidays:9 },  // happiness=UK value, fertility=UK value, firearms=Scotland figure
  USA:              { pop:335e6,  area:9833517, founded:1776, gdp:27360e9, lifeExp:77,  medianAge:38, co2pc:14.4, unesco:24, fifa:17,  wcApps:11, nobel:400, unemployment:3.7,  elevation:760,  forest:33,  coastline:19924,  fertilityRate:1.62, obesityRate:41.64, happinessScore:6.72, birdSpecies:820,  firearmsRate:120.5, teaPc:0.49,  publicHolidays:11 },
  Paraguay:         { pop:7.4e6,  area:406752,  founded:1811, gdp:42e9,    lifeExp:74,  medianAge:28, co2pc:0.9,  unesco:1,  fifa:41,  wcApps:9,  nobel:0,   unemployment:5.8,  elevation:178,  forest:44,  coastline:0,      fertilityRate:2.40, obesityRate:30.76, happinessScore:6.20, birdSpecies:707,  firearmsRate:16.7,  teaPc:14.12, publicHolidays:12 },  // teaPc includes yerba mate
  Australia:        { pop:26e6,   area:7692024, founded:1901, gdp:1675e9,  lifeExp:83,  medianAge:38, co2pc:14.8, unesco:20, fifa:27,  wcApps:5,  nobel:15,  unemployment:3.7,  elevation:330,  forest:17,  coastline:25760,  fertilityRate:1.64, obesityRate:32.05, happinessScore:6.97, birdSpecies:726,  firearmsRate:14.5,  teaPc:0.55,  publicHolidays:13 },
  Türkiye:          { pop:85e6,   area:783356,  founded:1923, gdp:1108e9,  lifeExp:77,  medianAge:33, co2pc:5.9,  unesco:21, fifa:22,  wcApps:2,  nobel:1,   unemployment:9.7,  elevation:1132, forest:28,  coastline:7200,   fertilityRate:1.62, obesityRate:26.22, happinessScore:5.19, birdSpecies:393,  firearmsRate:16.5,  teaPc:15.05, publicHolidays:14 },
  Germany:          { pop:84e6,   area:357114,  founded:1871, gdp:4456e9,  lifeExp:81,  medianAge:45, co2pc:8.1,  unesco:52, fifa:10,  wcApps:20, nobel:114, unemployment:3.0,  elevation:263,  forest:32,  coastline:2389,   fertilityRate:1.46, obesityRate:23.08, happinessScore:6.75, birdSpecies:311,  firearmsRate:19.6,  teaPc:0.36,  publicHolidays:10 },
  Curaçao:          { pop:151e3,  area:444,     founded:2010, gdp:3e9,     lifeExp:78,  medianAge:39, co2pc:8.5,  unesco:0,  fifa:83,  wcApps:0,  nobel:0,   unemployment:13.0, elevation:61,   forest:1,   coastline:364,    fertilityRate:1.07, obesityRate:20.00, happinessScore:5.80, birdSpecies:141,  firearmsRate:2.6,   teaPc:0.15,  publicHolidays:14 },  // happiness estimated (~5.80, not in WHR); obesity estimated (~20.0%)
  "Ivory Coast":    { pop:28e6,   area:322463,  founded:1960, gdp:76e9,    lifeExp:59,  medianAge:19, co2pc:0.5,  unesco:5,  fifa:33,  wcApps:4,  nobel:1,   unemployment:2.6,  elevation:250,  forest:33,  coastline:515,    fertilityRate:4.17, obesityRate:7.95,  happinessScore:5.15, birdSpecies:723,  firearmsRate:4.4,   teaPc:0.14,  publicHolidays:14 },
  Ecuador:          { pop:18e6,   area:283561,  founded:1830, gdp:115e9,   lifeExp:77,  medianAge:28, co2pc:2.3,  unesco:5,  fifa:23,  wcApps:4,  nobel:0,   unemployment:3.8,  elevation:1117, forest:57,  coastline:2237,   fertilityRate:1.79, obesityRate:23.06, happinessScore:6.14, birdSpecies:1684, firearmsRate:2.4,   teaPc:0.06,  publicHolidays:11 },
  Netherlands:      { pop:17.9e6, area:41543,   founded:1815, gdp:1118e9,  lifeExp:82,  medianAge:43, co2pc:8.8,  unesco:13, fifa:8,   wcApps:11, nobel:22,  unemployment:3.6,  elevation:30,   forest:11,  coastline:451,    fertilityRate:1.44, obesityRate:15.05, happinessScore:7.31, birdSpecies:271,  firearmsRate:2.6,   teaPc:0.49,  publicHolidays:9 },
  Japan:            { pop:124e6,  area:377930,  founded:660,  gdp:4213e9,  lifeExp:84,  medianAge:49, co2pc:8.5,  unesco:25, fifa:18,  wcApps:8,  nobel:29,  unemployment:2.6,  elevation:438,  forest:69,  coastline:29751,  fertilityRate:1.23, obesityRate:7.63,  happinessScore:6.13, birdSpecies:441,  firearmsRate:0.3,   teaPc:2.84,  publicHolidays:16 },
  Sweden:           { pop:10.5e6, area:450295,  founded:1523, gdp:592e9,   lifeExp:83,  medianAge:41, co2pc:3.9,  unesco:15, fifa:38,  wcApps:12, nobel:33,  unemployment:8.5,  elevation:320,  forest:69,  coastline:3218,   fertilityRate:1.44, obesityRate:17.18, happinessScore:7.35, birdSpecies:277,  firearmsRate:23.1,  teaPc:0.38,  publicHolidays:12 },
  Tunisia:          { pop:12e6,   area:163610,  founded:1956, gdp:49e9,    lifeExp:76,  medianAge:32, co2pc:2.8,  unesco:8,  fifa:45,  wcApps:6,  nobel:1,   unemployment:15.3, elevation:246,  forest:7,   coastline:1148,   fertilityRate:1.80, obesityRate:19.92, happinessScore:4.80, birdSpecies:308,  firearmsRate:1.1,   teaPc:0.52,  publicHolidays:13 },
  Belgium:          { pop:11.6e6, area:30528,   founded:1830, gdp:627e9,   lifeExp:81,  medianAge:42, co2pc:8.2,  unesco:16, fifa:9,   wcApps:14, nobel:11,  unemployment:5.5,  elevation:181,  forest:23,  coastline:66,     fertilityRate:1.39, obesityRate:19.79, happinessScore:6.91, birdSpecies:264,  firearmsRate:12.7,  teaPc:0.21,  publicHolidays:10 },
  Egypt:            { pop:105e6,  area:1001449, founded:1953, gdp:476e9,   lifeExp:72,  medianAge:25, co2pc:2.3,  unesco:7,  fifa:29,  wcApps:3,  nobel:4,   unemployment:7.3,  elevation:321,  forest:0,   coastline:2450,   fertilityRate:2.71, obesityRate:32.48, happinessScore:3.86, birdSpecies:377,  firearmsRate:4.1,   teaPc:0.84,  publicHolidays:12 },
  Iran:             { pop:87e6,   area:1648195, founded:1979, gdp:366e9,   lifeExp:77,  medianAge:32, co2pc:8.4,  unesco:27, fifa:20,  wcApps:6,  nobel:1,   unemployment:9.0,  elevation:1305, forest:7,   coastline:2440,   fertilityRate:1.67, obesityRate:18.26, happinessScore:5.15, birdSpecies:473,  firearmsRate:7.3,   teaPc:1.69,  publicHolidays:26 },
  "New Zealand":    { pop:5.1e6,  area:270467,  founded:1907, gdp:247e9,   lifeExp:82,  medianAge:38, co2pc:6.9,  unesco:3,  fifa:85,  wcApps:3,  nobel:3,   unemployment:3.7,  elevation:388,  forest:38,  coastline:15134,  fertilityRate:1.65, obesityRate:32.99, happinessScore:6.95, birdSpecies:230,  firearmsRate:26.3,  teaPc:0.45,  publicHolidays:12 },
  "Saudi Arabia":   { pop:35e6,   area:2149690, founded:1932, gdp:1069e9,  lifeExp:76,  medianAge:31, co2pc:18.6, unesco:7,  fifa:61,  wcApps:6,  nobel:0,   unemployment:5.6,  elevation:665,  forest:1,   coastline:2640,   fertilityRate:2.29, obesityRate:38.13, happinessScore:6.59, birdSpecies:392,  firearmsRate:16.7,  teaPc:0.94,  publicHolidays:9 },
  Uruguay:          { pop:3.5e6,  area:176215,  founded:1825, gdp:77e9,    lifeExp:78,  medianAge:36, co2pc:2.2,  unesco:3,  fifa:16,  wcApps:14, nobel:2,   unemployment:8.3,  elevation:109,  forest:10,  coastline:660,    fertilityRate:1.39, obesityRate:31.64, happinessScore:6.64, birdSpecies:408,  firearmsRate:34.7,  teaPc:9.12,  publicHolidays:12 },  // teaPc includes yerba mate
  "Cabo Verde":     { pop:550e3,  area:4033,    founded:1975, gdp:2e9,     lifeExp:73,  medianAge:27, co2pc:1.0,  unesco:1,  fifa:67,  wcApps:0,  nobel:0,   unemployment:11.0, elevation:442,  forest:21,  coastline:965,    fertilityRate:1.50, obesityRate:8.79,  happinessScore:5.00, birdSpecies:87,   firearmsRate:2.0,   teaPc:0.08,  publicHolidays:13 },  // happiness estimated from most recent available WHR data
  Spain:            { pop:47.4e6, area:505990,  founded:1479, gdp:1582e9,  lifeExp:83,  medianAge:45, co2pc:5.8,  unesco:50, fifa:2,   wcApps:16, nobel:8,   unemployment:12.2, elevation:660,  forest:37,  coastline:4964,   fertilityRate:1.21, obesityRate:19.39, happinessScore:6.53, birdSpecies:379,  firearmsRate:7.5,   teaPc:0.16,  publicHolidays:12 },
  France:           { pop:68e6,   area:551695,  founded:843,  gdp:3031e9,  lifeExp:82,  medianAge:42, co2pc:4.6,  unesco:53, fifa:3,   wcApps:16, nobel:73,  unemployment:7.3,  elevation:375,  forest:31,  coastline:4853,   fertilityRate:1.64, obesityRate:10.18, happinessScore:6.59, birdSpecies:359,  firearmsRate:19.6,  teaPc:0.26,  publicHolidays:11 },
  Senegal:          { pop:17e6,   area:196722,  founded:1960, gdp:27e9,    lifeExp:68,  medianAge:19, co2pc:0.7,  unesco:7,  fifa:15,  wcApps:4,  nobel:1,   unemployment:18.9, elevation:69,   forest:45,  coastline:531,    fertilityRate:3.71, obesityRate:4.06,  happinessScore:4.79, birdSpecies:560,  firearmsRate:2.0,   teaPc:0.63,  publicHolidays:14 },
  Norway:           { pop:5.5e6,  area:385207,  founded:1905, gdp:579e9,   lifeExp:83,  medianAge:40, co2pc:7.6,  unesco:8,  fifa:31,  wcApps:3,  nobel:14,  unemployment:3.6,  elevation:460,  forest:33,  coastline:25148,  fertilityRate:1.42, obesityRate:20.93, happinessScore:7.26, birdSpecies:256,  firearmsRate:28.8,  teaPc:0.24,  publicHolidays:12 },
  Iraq:             { pop:42e6,   area:438317,  founded:1958, gdp:264e9,   lifeExp:70,  medianAge:20, co2pc:4.4,  unesco:6,  fifa:57,  wcApps:1,  nobel:0,   unemployment:15.5, elevation:312,  forest:2,   coastline:58,     fertilityRate:3.17, obesityRate:33.35, happinessScore:5.21, birdSpecies:374,  firearmsRate:19.6,  teaPc:1.77,  publicHolidays:15 },
  Argentina:        { pop:46e6,   area:2780400, founded:1816, gdp:621e9,   lifeExp:77,  medianAge:31, co2pc:4.2,  unesco:12, fifa:1,   wcApps:18, nobel:5,   unemployment:6.9,  elevation:809,  forest:10,  coastline:4989,   fertilityRate:1.51, obesityRate:35.53, happinessScore:6.40, birdSpecies:1002, firearmsRate:7.4,   teaPc:27.08, publicHolidays:16 },  // teaPc includes yerba mate
  Algeria:          { pop:45e6,   area:2381741, founded:1962, gdp:194e9,   lifeExp:77,  medianAge:29, co2pc:4.0,  unesco:7,  fifa:28,  wcApps:4,  nobel:0,   unemployment:11.7, elevation:800,  forest:1,   coastline:998,    fertilityRate:2.67, obesityRate:16.03, happinessScore:5.71, birdSpecies:445,  firearmsRate:2.1,   teaPc:0.29,  publicHolidays:11 },
  Austria:          { pop:9.1e6,  area:83871,   founded:1918, gdp:512e9,   lifeExp:81,  medianAge:44, co2pc:7.3,  unesco:12, fifa:24,  wcApps:7,  nobel:22,  unemployment:5.2,  elevation:910,  forest:47,  coastline:0,      fertilityRate:1.33, obesityRate:18.81, happinessScore:6.81, birdSpecies:302,  firearmsRate:30.0,  teaPc:0.42,  publicHolidays:13 },
  Jordan:           { pop:10.8e6, area:89342,   founded:1946, gdp:50e9,    lifeExp:74,  medianAge:23, co2pc:2.9,  unesco:6,  fifa:63,  wcApps:0,  nobel:0,   unemployment:18.1, elevation:812,  forest:1,   coastline:26,     fertilityRate:2.57, obesityRate:34.20, happinessScore:4.48, birdSpecies:332,  firearmsRate:18.7,  teaPc:0.31,  publicHolidays:13 },
  Portugal:         { pop:10.3e6, area:92212,   founded:1143, gdp:287e9,   lifeExp:81,  medianAge:46, co2pc:4.7,  unesco:17, fifa:5,   wcApps:9,  nobel:1,   unemployment:6.6,  elevation:372,  forest:35,  coastline:1793,   fertilityRate:1.52, obesityRate:21.97, happinessScore:6.34, birdSpecies:311,  firearmsRate:21.3,  teaPc:0.34,  publicHolidays:13 },
  "DR Congo":       { pop:100e6,  area:2344858, founded:1960, gdp:65e9,    lifeExp:61,  medianAge:17, co2pc:0.03, unesco:5,  fifa:46,  wcApps:1,  nobel:0,   unemployment:4.5,  elevation:726,  forest:56,  coastline:37,     fertilityRate:5.90, obesityRate:4.38,  happinessScore:3.76, birdSpecies:1155, firearmsRate:1.2,   teaPc:0.03,  publicHolidays:11 },
  England:          { pop:57e6,   area:130279,  founded:927,  gdp:3340e9,  lifeExp:81,  medianAge:40, co2pc:5.5,  unesco:19, fifa:4,   wcApps:17, nobel:90,  unemployment:4.2,  elevation:162,  forest:13,  coastline:3230,   fertilityRate:1.54, obesityRate:26.94, happinessScore:6.73, birdSpecies:625,  firearmsRate:4.6,   teaPc:1.94,  publicHolidays:8 },  // happiness=UK value, fertility=UK value, firearms=England+Wales figure
  Croatia:          { pop:4e6,    area:56594,   founded:1991, gdp:70e9,    lifeExp:78,  medianAge:44, co2pc:4.4,  unesco:10, fifa:11,  wcApps:6,  nobel:2,   unemployment:6.1,  elevation:331,  forest:34,  coastline:5835,   fertilityRate:1.47, obesityRate:34.80, happinessScore:6.01, birdSpecies:306,  firearmsRate:13.7,  teaPc:0.09,  publicHolidays:14 },
  Ghana:            { pop:33e6,   area:238533,  founded:1957, gdp:77e9,    lifeExp:64,  medianAge:22, co2pc:0.6,  unesco:2,  fifa:73,  wcApps:4,  nobel:0,   unemployment:3.2,  elevation:190,  forest:22,  coastline:539,    fertilityRate:3.30, obesityRate:5.37,  happinessScore:4.55, birdSpecies:681,  firearmsRate:8.0,   teaPc:1.12,  publicHolidays:13 },
  Panama:           { pop:4.4e6,  area:75417,   founded:1903, gdp:67e9,    lifeExp:78,  medianAge:29, co2pc:3.0,  unesco:5,  fifa:34,  wcApps:2,  nobel:1,   unemployment:7.1,  elevation:360,  forest:57,  coastline:2490,   fertilityRate:2.09, obesityRate:29.88, happinessScore:6.55, birdSpecies:889,  firearmsRate:10.8,  teaPc:0.11,  publicHolidays:13 },
  Colombia:         { pop:52e6,   area:1141748, founded:1819, gdp:363e9,   lifeExp:77,  medianAge:31, co2pc:1.8,  unesco:9,  fifa:13,  wcApps:6,  nobel:1,   unemployment:9.2,  elevation:593,  forest:53,  coastline:3208,   fertilityRate:1.62, obesityRate:18.58, happinessScore:6.04, birdSpecies:1917, firearmsRate:10.1,  teaPc:0.02,  publicHolidays:18 },
  Uzbekistan:       { pop:36e6,   area:448978,  founded:1991, gdp:90e9,    lifeExp:75,  medianAge:29, co2pc:3.5,  unesco:7,  fifa:50,  wcApps:0,  nobel:0,   unemployment:9.3,  elevation:1021, forest:8,   coastline:0,      fertilityRate:3.45, obesityRate:27.88, happinessScore:6.28, birdSpecies:354,  firearmsRate:0.4,   teaPc:0.89,  publicHolidays:10 },
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
  key: string;
  question: string;
  getValue: (country: string) => number;
  explain: (winner: string, loser: string, wv: number, lv: number) => string;
}

export const QUESTION_TYPES: QuestionType[] = [
  {
    id: "pop",
    key: "pop",
    question: "WHICH HAS THE LARGER POPULATION?",
    getValue: (c) => COUNTRIES[c].pop,
    explain: (w, l, wv, lv) => `${w}: ${(wv/1e6).toFixed(1)}M vs ${l}: ${(lv/1e6).toFixed(1)}M`,
  },
  {
    id: "area",
    key: "area",
    question: "WHICH HAS THE LARGER LAND AREA?",
    getValue: (c) => COUNTRIES[c].area,
    explain: (w, l, wv, lv) => `${w}: ${wv.toLocaleString()} km² vs ${l}: ${lv.toLocaleString()} km²`,
  },
  {
    id: "older",
    key: "older",
    question: "WHICH COUNTRY IS OLDER?",
    getValue: (c) => -COUNTRIES[c].founded,
    explain: (w, l, wv, lv) => `${w}: est. ${-wv} vs ${l}: est. ${-lv}`,
  },
  {
    id: "gdp",
    key: "gdp",
    question: "WHICH HAS THE HIGHER GDP?",
    getValue: (c) => COUNTRIES[c].gdp,
    explain: (w, l, wv, lv) => {
      const fmt = (v: number) => v >= 1e12 ? `$${(v/1e12).toFixed(1)}T` : `$${(v/1e9).toFixed(0)}B`;
      return `${w}: ${fmt(wv)} vs ${l}: ${fmt(lv)}`;
    },
  },
  {
    id: "gdppc",
    key: "gdppc",
    question: "WHICH HAS HIGHER GDP PER CAPITA?",
    getValue: (c) => COUNTRIES[c].gdp / COUNTRIES[c].pop,
    explain: (w, l, wv, lv) => `${w}: $${Math.round(wv).toLocaleString()}/person vs ${l}: $${Math.round(lv).toLocaleString()}/person`,
  },
  {
    id: "density",
    key: "density",
    question: "WHICH IS MORE DENSELY POPULATED?",
    getValue: (c) => COUNTRIES[c].pop / COUNTRIES[c].area,
    explain: (w, l, wv, lv) => `${w}: ${wv.toFixed(1)}/km² vs ${l}: ${lv.toFixed(1)}/km²`,
  },
  {
    id: "lifeExp",
    key: "lifeExp",
    question: "WHICH HAS HIGHER LIFE EXPECTANCY?",
    getValue: (c) => COUNTRIES[c].lifeExp,
    explain: (w, l, wv, lv) => `${w}: ${wv} yrs vs ${l}: ${lv} yrs`,
  },
  {
    id: "medianAge",
    key: "medianAge",
    question: "WHICH HAS THE HIGHER MEDIAN AGE?",
    getValue: (c) => COUNTRIES[c].medianAge,
    explain: (w, l, wv, lv) => `${w}: ${wv} yrs vs ${l}: ${lv} yrs`,
  },
  {
    id: "co2pc",
    key: "co2pc",
    question: "WHICH EMITS MORE CO₂ PER PERSON?",
    getValue: (c) => COUNTRIES[c].co2pc,
    explain: (w, l, wv, lv) => `${w}: ${wv}t vs ${l}: ${lv}t per capita`,
  },
  {
    id: "unesco",
    key: "unesco",
    question: "WHICH HAS MORE UNESCO WORLD HERITAGE SITES?",
    getValue: (c) => COUNTRIES[c].unesco,
    explain: (w, l, wv, lv) => `${w}: ${wv} sites vs ${l}: ${lv} sites`,
  },
  {
    id: "fifa",
    key: "fifa",
    question: "WHICH HAS THE BETTER FIFA RANKING?",
    getValue: (c) => -COUNTRIES[c].fifa,
    explain: (w, l, wv, lv) => `${w}: #${-wv} vs ${l}: #${-lv}`,
  },
  {
    id: "wcApps",
    key: "wcApps",
    question: "WHICH HAS MORE WORLD CUP APPEARANCES?",
    getValue: (c) => COUNTRIES[c].wcApps,
    explain: (w, l, wv, lv) => `${w}: ${wv} appearances vs ${l}: ${lv} appearances`,
  },
  {
    id: "nobel",
    key: "nobel",
    question: "WHICH HAS WON MORE NOBEL PRIZES?",
    getValue: (c) => COUNTRIES[c].nobel,
    explain: (w, l, wv, lv) => `${w}: ${wv} prizes vs ${l}: ${lv} prizes`,
  },
  {
    id: "unemployment",
    key: "unemployment",
    question: "WHICH HAS LOWER UNEMPLOYMENT?",
    getValue: (c) => -COUNTRIES[c].unemployment,
    explain: (w, l, wv, lv) => `${w}: ${-wv}% vs ${l}: ${-lv}%`,
  },
  {
    id: "elevation",
    key: "elevation",
    question: "WHICH HAS HIGHER AVERAGE ELEVATION?",
    getValue: (c) => COUNTRIES[c].elevation,
    explain: (w, l, wv, lv) => `${w}: ${wv}m vs ${l}: ${lv}m`,
  },
  {
    id: "forest",
    key: "forest",
    question: "WHICH HAS MORE FOREST COVERAGE?",
    getValue: (c) => COUNTRIES[c].forest,
    explain: (w, l, wv, lv) => `${w}: ${wv}% vs ${l}: ${lv}%`,
  },
  {
    id: "coastline",
    key: "coastline",
    question: "WHICH HAS A LONGER COASTLINE?",
    getValue: (c) => COUNTRIES[c].coastline,
    explain: (w, l, wv, lv) => `${w}: ${wv.toLocaleString()} km vs ${l}: ${lv.toLocaleString()} km`,
  },
  {
    id: "fertilityRate",
    key: "fertilityRate",
    question: "WHICH HAS THE HIGHER FERTILITY RATE?",
    getValue: (c) => COUNTRIES[c].fertilityRate,
    explain: (w, l, wv, lv) => `${w}: ${wv.toFixed(2)} vs ${l}: ${lv.toFixed(2)} births per woman`,
  },
  {
    id: "obesityRate",
    key: "obesityRate",
    question: "WHICH HAS A HIGHER ADULT OBESITY RATE?",
    getValue: (c) => COUNTRIES[c].obesityRate,
    explain: (w, l, wv, lv) => `${w}: ${wv.toFixed(1)}% vs ${l}: ${lv.toFixed(1)}%`,
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
    explain: (w, l, wv, lv) => `${w}: ${wv.toFixed(1)} per 100 people vs ${l}: ${lv.toFixed(1)} per 100 people`,
  },
  {
    id: "teaPc",
    key: "teaPc",
    question: "WHICH DRINKS MORE TEA (OR MATE) PER PERSON PER YEAR?",
    getValue: (c) => COUNTRIES[c].teaPc,
    explain: (w, l, wv, lv) => `${w}: ${wv.toFixed(2)} kg/person vs ${l}: ${lv.toFixed(2)} kg/person`,
  },
  {
    id: "publicHolidays",
    key: "publicHolidays",
    question: "WHICH HAS MORE NATIONAL PUBLIC HOLIDAYS?",
    getValue: (c) => COUNTRIES[c].publicHolidays,
    explain: (w, l, wv, lv) => `${w}: ${wv} holidays vs ${l}: ${lv} holidays`,
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
  { label: "Fertility rate", url: "https://en.wikipedia.org/wiki/List_of_countries_by_total_fertility_rate" },
  { label: "Obesity rate", url: "https://data.worldobesity.org/rankings/" },
  { label: "World Happiness Report 2025", url: "https://worldhappiness.report/" },
  { label: "Bird species per country", url: "https://biodb.com/table/birds-per-country/" },
  { label: "Civilian firearms per capita", url: "https://en.wikipedia.org/wiki/Estimated_number_of_civilian_guns_per_capita_by_country" },
  { label: "Tea consumption per capita", url: "https://worldpopulationreview.com/country-rankings/tea-consumption-by-country" },
  { label: "Public holidays by country", url: "https://en.wikipedia.org/wiki/List_of_countries_by_number_of_public_holidays" },
];
