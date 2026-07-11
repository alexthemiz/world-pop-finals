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
  // Batch 2 — society & environment
  internetSpeed: number;   // avg download speed Mbps (Ookla/worldpopulationreview.com 2025)
  renewableEnergy: number; // % of electricity from renewables (IEA / Wikipedia)
  prisonRate: number;      // prison population per 100,000 (World Prison Brief)
  homicideRate: number;    // intentional homicide rate per 100,000 (UNODC / Wikipedia)
  tourists: number;        // international tourist arrivals millions/year (UNWTO 2023)
  languages: number;       // living languages spoken within borders (Ethnologue)
  precipitation: number;   // average annual rainfall mm/year (World Bank / Wikipedia)
  // Batch 3 — food & development
  coffeePc: number;       // kg coffee consumed per capita/year (ICO / worldpopulationreview.com)
  cheesePc: number;       // kg cheese consumed per capita/year (OECD / USDA FAS)
  honeyProduction: number; // tonnes of honey produced/year (FAO/FAOSTAT)
  hospitalBeds: number;   // hospital beds per 1,000 people (World Bank / WHO)
  avgSchooling: number;   // mean years of schooling, adults 25+ (UNDP HDR 2024)
  electricityPc: number;  // electricity consumption per capita kWh/year (World Bank / IEA)
  // Batch 4 — nature & infrastructure
  roadLength: number;      // total road network length, km (CIA World Factbook / Wikipedia)
  threatenedSpecies: number; // total threatened species count (IUCN Red List country profiles)
  protectedLand: number;   // % of land area under protection (World Bank ER.LND.PTLD.ZS)
  disasterRisk: number;    // INFORM Risk Index, 0-10 scale, higher = higher risk (EU JRC)
}

export const COUNTRIES: Record<string, CountryStats> = {
  //                    pop        area      founded  gdp         lifeExp medAge  co2pc  unesco  fifa  wcApps  nobel  unemp   elev  forest  coast          fertRate  obesity  happy   birds  firearms  teaPc   pubHol
  Mexico:           { pop:130e6,  area:1964375, founded:1821, gdp:1322e9,  lifeExp:75,  medianAge:29, co2pc:3.7,  unesco:35, fifa:14,  wcApps:17, nobel:2,   unemployment:2.8,  elevation:1111, forest:34,  coastline:9330,   fertilityRate:1.87, obesityRate:32.22, happinessScore:6.98, birdSpecies:1137, firearmsRate:12.9,  teaPc:0.01,  publicHolidays:7,  internetSpeed:91.83,  renewableEnergy:23.2,  prisonRate:192, homicideRate:24.86, tourists:41.95, languages:292, precipitation:758,  coffeePc:1.8,  cheesePc:3.5,  honeyProduction:64320,  hospitalBeds:1.0,  avgSchooling:9.0,  electricityPc:2220, roadLength:836603, threatenedSpecies:904, protectedLand:24.0, disasterRisk:4.3 },
  "South Africa":   { pop:60e6,   area:1219090, founded:1961, gdp:419e9,   lifeExp:64,  medianAge:28, co2pc:7.0,  unesco:10, fifa:60,  wcApps:3,  nobel:11,  unemployment:32.9, elevation:1034, forest:8,   coastline:2798,   fertilityRate:2.19, obesityRate:14.50, happinessScore:5.01, birdSpecies:762,  firearmsRate:9.7,   teaPc:0.28,  publicHolidays:12, internetSpeed:48.31,  renewableEnergy:13.7,  prisonRate:267, homicideRate:43.72, tourists:8.50,  languages:42,  precipitation:495,  coffeePc:0.5,  cheesePc:2.2,  honeyProduction:2000,   hospitalBeds:2.3,  avgSchooling:10.1, electricityPc:3980, roadLength:750000, threatenedSpecies:884, protectedLand:9.2, disasterRisk:4.0 },
  "South Korea":    { pop:52e6,   area:100210,  founded:1948, gdp:1709e9,  lifeExp:83,  medianAge:44, co2pc:11.6, unesco:16, fifa:25,  wcApps:11, nobel:2,   unemployment:2.7,  elevation:282,  forest:64,  coastline:2413,   fertilityRate:0.75, obesityRate:8.82,  happinessScore:6.04, birdSpecies:357,  firearmsRate:0.2,   teaPc:0.07,  publicHolidays:14, internetSpeed:232.86, renewableEnergy:9.2,   prisonRate:127, homicideRate:0.48,  tourists:11.0,  languages:5,   precipitation:1274, coffeePc:3.7,  cheesePc:3.7,  honeyProduction:29951,  hospitalBeds:12.8, avgSchooling:12.2, electricityPc:10360, roadLength:110714, threatenedSpecies:65, protectedLand:16.4, disasterRisk:2.1 },
  Czechia:          { pop:10.9e6, area:78866,   founded:1993, gdp:330e9,   lifeExp:78,  medianAge:43, co2pc:9.0,  unesco:17, fifa:40,  wcApps:9,  nobel:12,  unemployment:2.6,  elevation:433,  forest:34,  coastline:0,      fertilityRate:1.47, obesityRate:30.72, happinessScore:6.77, birdSpecies:282,  firearmsRate:27.5,  teaPc:0.26,  publicHolidays:13, internetSpeed:88.64,  renewableEnergy:16.9,  prisonRate:174, homicideRate:0.77,  tourists:10.0,  languages:26,  precipitation:677,  coffeePc:4.1,  cheesePc:16.0, honeyProduction:3200,   hospitalBeds:6.6,  avgSchooling:12.7, electricityPc:6100, roadLength:55744, threatenedSpecies:41, protectedLand:16.6, disasterRisk:1.6 },
  Canada:           { pop:38e6,   area:9984670, founded:1867, gdp:2140e9,  lifeExp:82,  medianAge:41, co2pc:14.2, unesco:22, fifa:30,  wcApps:4,  nobel:30,  unemployment:5.8,  elevation:487,  forest:38,  coastline:202080, fertilityRate:1.33, obesityRate:28.16, happinessScore:6.80, birdSpecies:495,  firearmsRate:34.7,  teaPc:0.40,  publicHolidays:10, internetSpeed:256.49, renewableEnergy:63.9,  prisonRate:98,  homicideRate:1.98,  tourists:18.34, languages:195, precipitation:537,  coffeePc:6.8,  cheesePc:13.7, honeyProduction:33745,  hospitalBeds:2.5,  avgSchooling:13.8, electricityPc:14800, roadLength:1042300, threatenedSpecies:130, protectedLand:13.7, disasterRisk:2.0 },
  Bosnia:           { pop:3.2e6,  area:51197,   founded:1992, gdp:24e9,    lifeExp:77,  medianAge:43, co2pc:5.8,  unesco:4,  fifa:64,  wcApps:1,  nobel:1,   unemployment:14.5, elevation:500,  forest:43,  coastline:20,     fertilityRate:1.50, obesityRate:22.41, happinessScore:6.38, birdSpecies:281,  firearmsRate:31.2,  teaPc:0.04,  publicHolidays:10, internetSpeed:38.18,  renewableEnergy:43.6,  prisonRate:79,  homicideRate:1.22,  tourists:1.30,  languages:12,  precipitation:1028, coffeePc:4.3,  cheesePc:8.5,  honeyProduction:4500,   hospitalBeds:3.5,  avgSchooling:10.2, electricityPc:3800, roadLength:22926, threatenedSpecies:26, protectedLand:2.4, disasterRisk:3.0 },
  Qatar:            { pop:2.9e6,  area:11586,   founded:1971, gdp:219e9,   lifeExp:78,  medianAge:33, co2pc:31.7, unesco:1,  fifa:56,  wcApps:2,  nobel:0,   unemployment:0.1,  elevation:28,   forest:0,   coastline:563,    fertilityRate:1.70, obesityRate:40.79, happinessScore:6.37, birdSpecies:230,  firearmsRate:16.7,  teaPc:1.50,  publicHolidays:4,  internetSpeed:196.96, renewableEnergy:0.3,   prisonRate:39,  homicideRate:0.07,  tourists:4.05,  languages:18,  precipitation:74,  coffeePc:0.5,  cheesePc:4.5,  honeyProduction:30,     hospitalBeds:1.2,  avgSchooling:9.7,  electricityPc:14900, roadLength:7039, threatenedSpecies:18, protectedLand:3.2, disasterRisk:2.0 },
  Switzerland:      { pop:8.7e6,  area:41285,   founded:1848, gdp:869e9,   lifeExp:83,  medianAge:43, co2pc:4.2,  unesco:13, fifa:19,  wcApps:11, nobel:32,  unemployment:4.2,  elevation:1350, forest:32,  coastline:0,      fertilityRate:1.44, obesityRate:15.07, happinessScore:6.94, birdSpecies:286,  firearmsRate:27.6,  teaPc:0.29,  publicHolidays:9,  internetSpeed:278.51, renewableEnergy:67.8,  prisonRate:78,  homicideRate:0.60,  tourists:9.0,   languages:33,  precipitation:1537, coffeePc:5.8,  cheesePc:22.2, honeyProduction:3000,   hospitalBeds:4.5,  avgSchooling:13.9, electricityPc:7700, roadLength:84114, threatenedSpecies:44, protectedLand:27.1, disasterRisk:1.3 },
  Brazil:           { pop:215e6,  area:8515767, founded:1822, gdp:2081e9,  lifeExp:75,  medianAge:34, co2pc:2.3,  unesco:23, fifa:6,   wcApps:22, nobel:1,   unemployment:7.8,  elevation:320,  forest:59,  coastline:7491,   fertilityRate:1.60, obesityRate:25.05, happinessScore:6.55, birdSpecies:1864, firearmsRate:8.3,   teaPc:2.57,  publicHolidays:12, internetSpeed:219.78, renewableEnergy:86.6,  prisonRate:416, homicideRate:19.28, tourists:5.91,  languages:228, precipitation:1761, coffeePc:4.8,  cheesePc:3.9,  honeyProduction:60966,  hospitalBeds:2.5,  avgSchooling:8.0,  electricityPc:2600, roadLength:2000000, threatenedSpecies:1173, protectedLand:30.2, disasterRisk:4.0 },  // teaPc includes yerba mate
  Morocco:          { pop:37e6,   area:446550,  founded:1956, gdp:142e9,   lifeExp:77,  medianAge:29, co2pc:1.9,  unesco:9,  fifa:7,   wcApps:7,  nobel:1,   unemployment:11.8, elevation:909,  forest:13,  coastline:1835,   fertilityRate:1.98, obesityRate:13.79, happinessScore:4.65, birdSpecies:343,  firearmsRate:4.8,   teaPc:2.15,  publicHolidays:16, internetSpeed:56.75,  renewableEnergy:23.3,  prisonRate:253, homicideRate:1.71,  tourists:14.52, languages:15,  precipitation:346,  coffeePc:1.3,  cheesePc:1.8,  honeyProduction:3500,   hospitalBeds:1.1,  avgSchooling:5.8,  electricityPc:910, roadLength:57334, threatenedSpecies:87, protectedLand:5.0, disasterRisk:3.7 },
  Haiti:            { pop:11.4e6, area:27750,   founded:1804, gdp:21e9,    lifeExp:64,  medianAge:23, co2pc:0.3,  unesco:1,  fifa:82,  wcApps:1,  nobel:1,   unemployment:14.6, elevation:470,  forest:4,   coastline:1771,   fertilityRate:2.59, obesityRate:6.73,  happinessScore:3.62, birdSpecies:244,  firearmsRate:2.6,   teaPc:0.02,  publicHolidays:14, internetSpeed:51.79,  renewableEnergy:18.6,  prisonRate:99,  homicideRate:41.15, tourists:0.10,  languages:4,   precipitation:1440, coffeePc:0.3,  cheesePc:0.4,  honeyProduction:500,    hospitalBeds:0.7,  avgSchooling:5.6,  electricityPc:40, roadLength:4266, threatenedSpecies:93, protectedLand:4.3, disasterRisk:6.6 },  // happiness estimated from most recent available WHR data
  Scotland:         { pop:5.5e6,  area:77933,   founded:843,  gdp:245e9,   lifeExp:77,  medianAge:42, co2pc:5.5,  unesco:6,  fifa:42,  wcApps:8,  nobel:14,  unemployment:4.1,  elevation:457,  forest:19,  coastline:11800,  fertilityRate:1.54, obesityRate:26.94, happinessScore:6.73, birdSpecies:535,  firearmsRate:5.6,   teaPc:1.94,  publicHolidays:9,  internetSpeed:100.24, renewableEnergy:97.0,  prisonRate:153, homicideRate:1.04,  tourists:3.30,  languages:12,  precipitation:1540, coffeePc:2.5,  cheesePc:11.0, honeyProduction:700,    hospitalBeds:2.5,  avgSchooling:13.4, electricityPc:4900, roadLength:56000, threatenedSpecies:33, protectedLand:28.6, disasterRisk:1.8 },  // happiness=UK value, fertility=UK value, firearms=Scotland figure
  USA:              { pop:335e6,  area:9833517, founded:1776, gdp:27360e9, lifeExp:77,  medianAge:38, co2pc:14.4, unesco:24, fifa:17,  wcApps:11, nobel:400, unemployment:3.7,  elevation:760,  forest:33,  coastline:19924,  fertilityRate:1.62, obesityRate:41.64, happinessScore:6.72, birdSpecies:820,  firearmsRate:120.5, teaPc:0.49,  publicHolidays:11, internetSpeed:302.68, renewableEnergy:25.6,  prisonRate:542, homicideRate:5.76,  tourists:66.48, languages:335, precipitation:715,  coffeePc:5.0,  cheesePc:17.4, honeyProduction:71000,  hospitalBeds:2.9,  avgSchooling:13.4, electricityPc:12150, roadLength:6586610, threatenedSpecies:1377, protectedLand:14.7, disasterRisk:3.7 },
  Paraguay:         { pop:7.4e6,  area:406752,  founded:1811, gdp:42e9,    lifeExp:74,  medianAge:28, co2pc:0.9,  unesco:1,  fifa:41,  wcApps:9,  nobel:0,   unemployment:5.8,  elevation:178,  forest:44,  coastline:0,      fertilityRate:2.40, obesityRate:30.76, happinessScore:6.20, birdSpecies:707,  firearmsRate:16.7,  teaPc:14.12, publicHolidays:12, internetSpeed:108.01, renewableEnergy:100.0, prisonRate:264, homicideRate:6.78,  tourists:0.50,  languages:27,  precipitation:1130, coffeePc:0.8,  cheesePc:2.0,  honeyProduction:2500,   hospitalBeds:0.8,  avgSchooling:8.3,  electricityPc:4769, roadLength:16630, threatenedSpecies:121, protectedLand:6.2, disasterRisk:4.0 },  // teaPc includes yerba mate
  Australia:        { pop:26e6,   area:7692024, founded:1901, gdp:1675e9,  lifeExp:83,  medianAge:38, co2pc:14.8, unesco:20, fifa:27,  wcApps:5,  nobel:15,  unemployment:3.7,  elevation:330,  forest:17,  coastline:25760,  fertilityRate:1.64, obesityRate:32.05, happinessScore:6.97, birdSpecies:726,  firearmsRate:14.5,  teaPc:0.55,  publicHolidays:13, internetSpeed:164.09, renewableEnergy:38.7,  prisonRate:170, homicideRate:0.85,  tourists:7.19,  languages:319, precipitation:534,  coffeePc:2.5,  cheesePc:12.5, honeyProduction:11795,  hospitalBeds:3.8,  avgSchooling:12.9, electricityPc:9700, roadLength:977874, threatenedSpecies:658, protectedLand:21.5, disasterRisk:2.9 },
  Türkiye:          { pop:85e6,   area:783356,  founded:1923, gdp:1108e9,  lifeExp:77,  medianAge:33, co2pc:5.9,  unesco:21, fifa:22,  wcApps:2,  nobel:1,   unemployment:9.7,  elevation:1132, forest:28,  coastline:7200,   fertilityRate:1.62, obesityRate:26.22, happinessScore:5.19, birdSpecies:393,  firearmsRate:16.5,  teaPc:15.05, publicHolidays:14, internetSpeed:69.11,  renewableEnergy:43.2,  prisonRate:489, homicideRate:3.23,  tourists:55.16, languages:54,  precipitation:593,  coffeePc:1.8,  cheesePc:9.5,  honeyProduction:118297, hospitalBeds:2.8,  avgSchooling:8.6,  electricityPc:3450, roadLength:438633, threatenedSpecies:109, protectedLand:8.5, disasterRisk:4.6 },
  Germany:          { pop:84e6,   area:357114,  founded:1871, gdp:4456e9,  lifeExp:81,  medianAge:45, co2pc:8.1,  unesco:52, fifa:10,  wcApps:20, nobel:114, unemployment:3.0,  elevation:263,  forest:32,  coastline:2389,   fertilityRate:1.46, obesityRate:23.08, happinessScore:6.75, birdSpecies:311,  firearmsRate:19.6,  teaPc:0.36,  publicHolidays:10, internetSpeed:102.03, renewableEnergy:59.1,  prisonRate:72,  homicideRate:0.91,  tourists:34.80, languages:95,  precipitation:700,  coffeePc:5.2,  cheesePc:22.9, honeyProduction:25000,  hospitalBeds:7.8,  avgSchooling:14.2, electricityPc:6900, roadLength:830000, threatenedSpecies:73, protectedLand:38.0, disasterRisk:1.5 },
  Curaçao:          { pop:151e3,  area:444,     founded:2010, gdp:3e9,     lifeExp:78,  medianAge:39, co2pc:8.5,  unesco:0,  fifa:83,  wcApps:0,  nobel:0,   unemployment:13.0, elevation:61,   forest:1,   coastline:364,    fertilityRate:1.07, obesityRate:20.00, happinessScore:5.80, birdSpecies:141,  firearmsRate:2.6,   teaPc:0.15,  publicHolidays:14, internetSpeed:49.61,  renewableEnergy:7.0,   prisonRate:262, homicideRate:16.92, tourists:0.60,  languages:6,   precipitation:560,  coffeePc:1.5,  cheesePc:5.0,  honeyProduction:50,     hospitalBeds:3.7,  avgSchooling:10.5, electricityPc:3200, roadLength:550, threatenedSpecies:25, protectedLand:6.0, disasterRisk:3.0 },  // happiness estimated (~5.80, not in WHR); obesity estimated (~20.0%)
  "Ivory Coast":    { pop:28e6,   area:322463,  founded:1960, gdp:76e9,    lifeExp:59,  medianAge:19, co2pc:0.5,  unesco:5,  fifa:33,  wcApps:4,  nobel:1,   unemployment:2.6,  elevation:250,  forest:33,  coastline:515,    fertilityRate:4.17, obesityRate:7.95,  happinessScore:5.15, birdSpecies:723,  firearmsRate:4.4,   teaPc:0.14,  publicHolidays:14, internetSpeed:58.80,  renewableEnergy:28.9,  prisonRate:94,  homicideRate:9.00,  tourists:0.60,  languages:101, precipitation:1348, coffeePc:0.3,  cheesePc:0.3,  honeyProduction:1200,   hospitalBeds:0.4,  avgSchooling:5.3,  electricityPc:310, roadLength:84000, threatenedSpecies:153, protectedLand:23.1, disasterRisk:4.4 },
  Ecuador:          { pop:18e6,   area:283561,  founded:1830, gdp:115e9,   lifeExp:77,  medianAge:28, co2pc:2.3,  unesco:5,  fifa:23,  wcApps:4,  nobel:0,   unemployment:3.8,  elevation:1117, forest:57,  coastline:2237,   fertilityRate:1.79, obesityRate:23.06, happinessScore:6.14, birdSpecies:1684, firearmsRate:2.4,   teaPc:0.06,  publicHolidays:11, internetSpeed:143.83, renewableEnergy:79.4,  prisonRate:202, homicideRate:45.72, tourists:1.60,  languages:24,  precipitation:2274, coffeePc:0.7,  cheesePc:1.5,  honeyProduction:3800,   hospitalBeds:1.5,  avgSchooling:9.5,  electricityPc:1500, roadLength:43216, threatenedSpecies:2381, protectedLand:19.2, disasterRisk:4.5 },
  Netherlands:      { pop:17.9e6, area:41543,   founded:1815, gdp:1118e9,  lifeExp:82,  medianAge:43, co2pc:8.8,  unesco:13, fifa:8,   wcApps:11, nobel:22,  unemployment:3.6,  elevation:30,   forest:11,  coastline:451,    fertilityRate:1.44, obesityRate:15.05, happinessScore:7.31, birdSpecies:271,  firearmsRate:2.6,   teaPc:0.49,  publicHolidays:9,  internetSpeed:224.14, renewableEnergy:51.2,  prisonRate:56,  homicideRate:0.69,  tourists:20.30, languages:50,  precipitation:778,  coffeePc:8.2,  cheesePc:21.6, honeyProduction:4700,   hospitalBeds:3.2,  avgSchooling:12.4, electricityPc:6000, roadLength:141820, threatenedSpecies:35, protectedLand:15.1, disasterRisk:1.4 },
  Japan:            { pop:124e6,  area:377930,  founded:660,  gdp:4213e9,  lifeExp:84,  medianAge:49, co2pc:8.5,  unesco:25, fifa:18,  wcApps:8,  nobel:29,  unemployment:2.6,  elevation:438,  forest:69,  coastline:29751,  fertilityRate:1.23, obesityRate:7.63,  happinessScore:6.13, birdSpecies:441,  firearmsRate:0.3,   teaPc:2.84,  publicHolidays:16, internetSpeed:229.84, renewableEnergy:23.5,  prisonRate:40,  homicideRate:0.23,  tourists:25.07, languages:19,  precipitation:1668, coffeePc:3.5,  cheesePc:2.7,  honeyProduction:47381,  hospitalBeds:12.6, avgSchooling:13.4, electricityPc:7500, roadLength:1218772, threatenedSpecies:414, protectedLand:20.5, disasterRisk:3.0 },
  Sweden:           { pop:10.5e6, area:450295,  founded:1523, gdp:592e9,   lifeExp:83,  medianAge:41, co2pc:3.9,  unesco:15, fifa:38,  wcApps:12, nobel:33,  unemployment:8.5,  elevation:320,  forest:69,  coastline:3218,   fertilityRate:1.44, obesityRate:17.18, happinessScore:7.35, birdSpecies:277,  firearmsRate:23.1,  teaPc:0.38,  publicHolidays:12, internetSpeed:190.42, renewableEnergy:71.2,  prisonRate:106, homicideRate:1.15,  tourists:7.0,   languages:37,  precipitation:624,  coffeePc:8.2,  cheesePc:19.1, honeyProduction:2700,   hospitalBeds:2.1,  avgSchooling:12.5, electricityPc:13200, roadLength:573134, threatenedSpecies:36, protectedLand:14.6, disasterRisk:1.2 },
  Tunisia:          { pop:12e6,   area:163610,  founded:1956, gdp:49e9,    lifeExp:76,  medianAge:32, co2pc:2.8,  unesco:8,  fifa:45,  wcApps:6,  nobel:1,   unemployment:15.3, elevation:246,  forest:7,   coastline:1148,   fertilityRate:1.80, obesityRate:19.92, happinessScore:4.80, birdSpecies:308,  firearmsRate:1.1,   teaPc:0.52,  publicHolidays:13, internetSpeed:18.75,  renewableEnergy:5.3,   prisonRate:267, homicideRate:4.69,  tourists:9.37,  languages:15,  precipitation:207,  coffeePc:2.2,  cheesePc:3.0,  honeyProduction:5000,   hospitalBeds:2.2,  avgSchooling:7.7,  electricityPc:1600, roadLength:19750, threatenedSpecies:75, protectedLand:7.5, disasterRisk:3.5 },
  Belgium:          { pop:11.6e6, area:30528,   founded:1830, gdp:627e9,   lifeExp:81,  medianAge:42, co2pc:8.2,  unesco:16, fifa:9,   wcApps:14, nobel:11,  unemployment:5.5,  elevation:181,  forest:23,  coastline:66,     fertilityRate:1.39, obesityRate:19.79, happinessScore:6.91, birdSpecies:264,  firearmsRate:12.7,  teaPc:0.21,  publicHolidays:10, internetSpeed:138.09, renewableEnergy:38.9,  prisonRate:113, homicideRate:1.08,  tourists:9.0,   languages:36,  precipitation:847,  coffeePc:4.9,  cheesePc:10.5, honeyProduction:4400,   hospitalBeds:5.7,  avgSchooling:12.2, electricityPc:7200, roadLength:118414, threatenedSpecies:38, protectedLand:14.0, disasterRisk:1.6 },
  Egypt:            { pop:105e6,  area:1001449, founded:1953, gdp:476e9,   lifeExp:72,  medianAge:25, co2pc:2.3,  unesco:7,  fifa:29,  wcApps:3,  nobel:4,   unemployment:7.3,  elevation:321,  forest:0,   coastline:2450,   fertilityRate:2.71, obesityRate:32.48, happinessScore:3.86, birdSpecies:377,  firearmsRate:4.1,   teaPc:0.84,  publicHolidays:12, internetSpeed:91.55,  renewableEnergy:13.0,  prisonRate:113, homicideRate:1.31,  tourists:14.91, languages:23,  precipitation:18,  coffeePc:0.8,  cheesePc:5.6,  honeyProduction:9200,   hospitalBeds:1.6,  avgSchooling:7.7,  electricityPc:1820, roadLength:325250, threatenedSpecies:95, protectedLand:14.6, disasterRisk:4.1 },
  Iran:             { pop:87e6,   area:1648195, founded:1979, gdp:366e9,   lifeExp:77,  medianAge:32, co2pc:8.4,  unesco:27, fifa:20,  wcApps:6,  nobel:1,   unemployment:9.0,  elevation:1305, forest:7,   coastline:2440,   fertilityRate:1.67, obesityRate:18.26, happinessScore:5.15, birdSpecies:473,  firearmsRate:7.3,   teaPc:1.69,  publicHolidays:26, internetSpeed:20.99,  renewableEnergy:3.5,   prisonRate:228, homicideRate:2.38,  tourists:5.87,  languages:84,  precipitation:228,  coffeePc:0.8,  cheesePc:7.0,  honeyProduction:79535,  hospitalBeds:1.6,  avgSchooling:10.2, electricityPc:3000, roadLength:223485, threatenedSpecies:161, protectedLand:10.3, disasterRisk:4.8 },
  "New Zealand":    { pop:5.1e6,  area:270467,  founded:1907, gdp:247e9,   lifeExp:82,  medianAge:38, co2pc:6.9,  unesco:3,  fifa:85,  wcApps:3,  nobel:3,   unemployment:3.7,  elevation:388,  forest:38,  coastline:15134,  fertilityRate:1.65, obesityRate:32.99, happinessScore:6.95, birdSpecies:230,  firearmsRate:26.3,  teaPc:0.45,  publicHolidays:12, internetSpeed:215.88, renewableEnergy:88.5,  prisonRate:211, homicideRate:1.46,  tourists:2.80,  languages:65,  precipitation:1732, coffeePc:2.1,  cheesePc:11.5, honeyProduction:22000,  hospitalBeds:2.6,  avgSchooling:12.8, electricityPc:9100, roadLength:96817, threatenedSpecies:178, protectedLand:33.2, disasterRisk:2.6 },
  "Saudi Arabia":   { pop:35e6,   area:2149690, founded:1932, gdp:1069e9,  lifeExp:76,  medianAge:31, co2pc:18.6, unesco:7,  fifa:61,  wcApps:6,  nobel:0,   unemployment:5.6,  elevation:665,  forest:1,   coastline:2640,   fertilityRate:2.29, obesityRate:38.13, happinessScore:6.59, birdSpecies:392,  firearmsRate:16.7,  teaPc:0.94,  publicHolidays:9,  internetSpeed:142.83, renewableEnergy:1.3,   prisonRate:140, homicideRate:0.94,  tourists:27.42, languages:25,  precipitation:59,  coffeePc:2.2,  cheesePc:6.7,  honeyProduction:6500,   hospitalBeds:2.2,  avgSchooling:10.4, electricityPc:9400, roadLength:221372, threatenedSpecies:76, protectedLand:17.7, disasterRisk:3.2 },
  Uruguay:          { pop:3.5e6,  area:176215,  founded:1825, gdp:77e9,    lifeExp:78,  medianAge:36, co2pc:2.2,  unesco:3,  fifa:16,  wcApps:14, nobel:2,   unemployment:8.3,  elevation:109,  forest:10,  coastline:660,    fertilityRate:1.39, obesityRate:31.64, happinessScore:6.64, birdSpecies:408,  firearmsRate:34.7,  teaPc:9.12,  publicHolidays:12, internetSpeed:193.86, renewableEnergy:97.8,  prisonRate:449, homicideRate:11.25, tourists:3.0,   languages:14,  precipitation:1300, coffeePc:1.2,  cheesePc:8.0,  honeyProduction:12000,  hospitalBeds:2.4,  avgSchooling:9.8,  electricityPc:3100, roadLength:77732, threatenedSpecies:47, protectedLand:1.6, disasterRisk:2.0 },  // teaPc includes yerba mate
  "Cabo Verde":     { pop:550e3,  area:4033,    founded:1975, gdp:2e9,     lifeExp:73,  medianAge:27, co2pc:1.0,  unesco:1,  fifa:67,  wcApps:0,  nobel:0,   unemployment:11.0, elevation:442,  forest:21,  coastline:965,    fertilityRate:1.50, obesityRate:8.79,  happinessScore:5.00, birdSpecies:87,   firearmsRate:2.0,   teaPc:0.08,  publicHolidays:13, internetSpeed:11.44,  renewableEnergy:30.8,  prisonRate:467, homicideRate:7.00,  tourists:1.0,   languages:3,   precipitation:228,  coffeePc:0.5,  cheesePc:0.8,  honeyProduction:150,    hospitalBeds:2.1,  avgSchooling:6.6,  electricityPc:700, roadLength:1350, threatenedSpecies:35, protectedLand:5.4, disasterRisk:4.0 },  // happiness estimated from most recent available WHR data
  Spain:            { pop:47.4e6, area:505990,  founded:1479, gdp:1582e9,  lifeExp:83,  medianAge:45, co2pc:5.8,  unesco:50, fifa:2,   wcApps:16, nobel:8,   unemployment:12.2, elevation:660,  forest:37,  coastline:4964,   fertilityRate:1.21, obesityRate:19.39, happinessScore:6.53, birdSpecies:379,  firearmsRate:7.5,   teaPc:0.16,  publicHolidays:12, internetSpeed:263.31, renewableEnergy:55.8,  prisonRate:121, homicideRate:0.69,  tourists:85.17, languages:34,  precipitation:636,  coffeePc:4.5,  cheesePc:9.0,  honeyProduction:30513,  hospitalBeds:3.0,  avgSchooling:10.4, electricityPc:5300, roadLength:683175, threatenedSpecies:207, protectedLand:28.2, disasterRisk:2.0 },
  France:           { pop:68e6,   area:551695,  founded:843,  gdp:3031e9,  lifeExp:82,  medianAge:42, co2pc:4.6,  unesco:53, fifa:3,   wcApps:16, nobel:73,  unemployment:7.3,  elevation:375,  forest:31,  coastline:4853,   fertilityRate:1.64, obesityRate:10.18, happinessScore:6.59, birdSpecies:359,  firearmsRate:19.6,  teaPc:0.26,  publicHolidays:11, internetSpeed:346.04, renewableEnergy:26.1,  prisonRate:129, homicideRate:1.34,  tourists:100.0, languages:95,  precipitation:867,  coffeePc:5.4,  cheesePc:26.3, honeyProduction:18000,  hospitalBeds:6.0,  avgSchooling:11.5, electricityPc:7400, roadLength:1053215, threatenedSpecies:250, protectedLand:27.0, disasterRisk:2.2 },
  Senegal:          { pop:17e6,   area:196722,  founded:1960, gdp:27e9,    lifeExp:68,  medianAge:19, co2pc:0.7,  unesco:7,  fifa:15,  wcApps:4,  nobel:1,   unemployment:18.9, elevation:69,   forest:45,  coastline:531,    fertilityRate:3.71, obesityRate:4.06,  happinessScore:4.79, birdSpecies:560,  firearmsRate:2.0,   teaPc:0.63,  publicHolidays:14, internetSpeed:21.86,  renewableEnergy:19.8,  prisonRate:76,  homicideRate:2.20,  tourists:1.70,  languages:46,  precipitation:686,  coffeePc:0.5,  cheesePc:0.3,  honeyProduction:1800,   hospitalBeds:0.3,  avgSchooling:3.5,  electricityPc:280, roadLength:16665, threatenedSpecies:89, protectedLand:11.4, disasterRisk:4.4 },
  Norway:           { pop:5.5e6,  area:385207,  founded:1905, gdp:579e9,   lifeExp:83,  medianAge:40, co2pc:7.6,  unesco:8,  fifa:31,  wcApps:3,  nobel:14,  unemployment:3.6,  elevation:460,  forest:33,  coastline:25148,  fertilityRate:1.42, obesityRate:20.93, happinessScore:7.26, birdSpecies:256,  firearmsRate:28.8,  teaPc:0.24,  publicHolidays:12, internetSpeed:168.69, renewableEnergy:98.9,  prisonRate:65,  homicideRate:0.73,  tourists:5.50,  languages:47,  precipitation:1414, coffeePc:9.9,  cheesePc:19.8, honeyProduction:1600,   hospitalBeds:3.5,  avgSchooling:13.1, electricityPc:27800, roadLength:97746, threatenedSpecies:33, protectedLand:17.6, disasterRisk:1.1 },
  Iraq:             { pop:42e6,   area:438317,  founded:1958, gdp:264e9,   lifeExp:70,  medianAge:20, co2pc:4.4,  unesco:6,  fifa:57,  wcApps:1,  nobel:0,   unemployment:15.5, elevation:312,  forest:2,   coastline:58,     fertilityRate:3.17, obesityRate:33.35, happinessScore:5.21, birdSpecies:374,  firearmsRate:19.6,  teaPc:1.77,  publicHolidays:15, internetSpeed:42.61,  renewableEnergy:3.2,   prisonRate:179, homicideRate:15.40, tourists:1.0,   languages:27,  precipitation:216,  coffeePc:0.5,  cheesePc:3.5,  honeyProduction:7500,   hospitalBeds:1.3,  avgSchooling:7.4,  electricityPc:1600, roadLength:59000, threatenedSpecies:79, protectedLand:0.6, disasterRisk:5.8 },
  Argentina:        { pop:46e6,   area:2780400, founded:1816, gdp:621e9,   lifeExp:77,  medianAge:31, co2pc:4.2,  unesco:12, fifa:1,   wcApps:18, nobel:5,   unemployment:6.9,  elevation:809,  forest:10,  coastline:4989,   fertilityRate:1.51, obesityRate:35.53, happinessScore:6.40, birdSpecies:1002, firearmsRate:7.4,   teaPc:27.08, publicHolidays:16, internetSpeed:109.90, renewableEnergy:34.6,  prisonRate:284, homicideRate:4.49,  tourists:7.29,  languages:40,  precipitation:591,  coffeePc:1.5,  cheesePc:8.6,  honeyProduction:70437,  hospitalBeds:5.0,  avgSchooling:10.9, electricityPc:3200, roadLength:240000, threatenedSpecies:481, protectedLand:8.6, disasterRisk:3.4 },  // teaPc includes yerba mate
  Algeria:          { pop:45e6,   area:2381741, founded:1962, gdp:194e9,   lifeExp:77,  medianAge:29, co2pc:4.0,  unesco:7,  fifa:28,  wcApps:4,  nobel:0,   unemployment:11.7, elevation:800,  forest:1,   coastline:998,    fertilityRate:2.67, obesityRate:16.03, happinessScore:5.71, birdSpecies:445,  firearmsRate:2.1,   teaPc:0.29,  publicHolidays:11, internetSpeed:51.80,  renewableEnergy:1.5,   prisonRate:217, homicideRate:1.16,  tourists:3.0,   languages:22,  precipitation:89,  coffeePc:1.0,  cheesePc:2.0,  honeyProduction:4500,   hospitalBeds:1.9,  avgSchooling:8.0,  electricityPc:1580, roadLength:141000, threatenedSpecies:99, protectedLand:6.3, disasterRisk:4.0 },
  Austria:          { pop:9.1e6,  area:83871,   founded:1918, gdp:512e9,   lifeExp:81,  medianAge:44, co2pc:7.3,  unesco:12, fifa:24,  wcApps:7,  nobel:22,  unemployment:5.2,  elevation:910,  forest:47,  coastline:0,      fertilityRate:1.33, obesityRate:18.81, happinessScore:6.81, birdSpecies:302,  firearmsRate:30.0,  teaPc:0.42,  publicHolidays:13, internetSpeed:114.48, renewableEnergy:83.6,  prisonRate:105, homicideRate:0.88,  tourists:30.91, languages:36,  precipitation:1110, coffeePc:5.5,  cheesePc:19.9, honeyProduction:4200,   hospitalBeds:7.3,  avgSchooling:12.3, electricityPc:8000, roadLength:126400, threatenedSpecies:41, protectedLand:28.1, disasterRisk:1.5 },
  Jordan:           { pop:10.8e6, area:89342,   founded:1946, gdp:50e9,    lifeExp:74,  medianAge:23, co2pc:2.9,  unesco:6,  fifa:63,  wcApps:0,  nobel:0,   unemployment:18.1, elevation:812,  forest:1,   coastline:26,     fertilityRate:2.57, obesityRate:34.20, happinessScore:4.48, birdSpecies:332,  firearmsRate:18.7,  teaPc:0.31,  publicHolidays:13, internetSpeed:195.47, renewableEnergy:24.1,  prisonRate:194, homicideRate:0.99,  tourists:5.35,  languages:14,  precipitation:111,  coffeePc:0.7,  cheesePc:4.0,  honeyProduction:1200,   hospitalBeds:1.5,  avgSchooling:10.3, electricityPc:2100, roadLength:7203, threatenedSpecies:60, protectedLand:7.2, disasterRisk:3.8 },
  Portugal:         { pop:10.3e6, area:92212,   founded:1143, gdp:287e9,   lifeExp:81,  medianAge:46, co2pc:4.7,  unesco:17, fifa:5,   wcApps:9,  nobel:1,   unemployment:6.6,  elevation:372,  forest:35,  coastline:1793,   fertilityRate:1.52, obesityRate:21.97, happinessScore:6.34, birdSpecies:311,  firearmsRate:21.3,  teaPc:0.34,  publicHolidays:13, internetSpeed:236.77, renewableEnergy:80.9,  prisonRate:124, homicideRate:0.72,  tourists:26.54, languages:23,  precipitation:854,  coffeePc:4.3,  cheesePc:13.5, honeyProduction:3000,   hospitalBeds:3.5,  avgSchooling:9.3,  electricityPc:5100, roadLength:82900, threatenedSpecies:71, protectedLand:21.4, disasterRisk:2.4 },
  "DR Congo":       { pop:100e6,  area:2344858, founded:1960, gdp:65e9,    lifeExp:61,  medianAge:17, co2pc:0.03, unesco:5,  fifa:46,  wcApps:1,  nobel:0,   unemployment:4.5,  elevation:726,  forest:56,  coastline:37,     fertilityRate:5.90, obesityRate:4.38,  happinessScore:3.76, birdSpecies:1155, firearmsRate:1.2,   teaPc:0.03,  publicHolidays:11, internetSpeed:46.38,  renewableEnergy:100.0, prisonRate:28,  homicideRate:13.50, tourists:0.20,  languages:214, precipitation:1543, coffeePc:0.1,  cheesePc:0.2,  honeyProduction:3500,   hospitalBeds:0.8,  avgSchooling:6.6,  electricityPc:120, roadLength:153500, threatenedSpecies:444, protectedLand:14.2, disasterRisk:7.5 },
  England:          { pop:57e6,   area:130279,  founded:927,  gdp:3340e9,  lifeExp:81,  medianAge:40, co2pc:5.5,  unesco:19, fifa:4,   wcApps:17, nobel:90,  unemployment:4.2,  elevation:162,  forest:13,  coastline:3230,   fertilityRate:1.54, obesityRate:26.94, happinessScore:6.73, birdSpecies:625,  firearmsRate:4.6,   teaPc:1.94,  publicHolidays:8,  internetSpeed:100.24, renewableEnergy:42.0,  prisonRate:136, homicideRate:1.15,  tourists:30.0,  languages:12,  precipitation:885,  coffeePc:2.5,  cheesePc:11.0, honeyProduction:6000,   hospitalBeds:2.5,  avgSchooling:13.4, electricityPc:4900, roadLength:320000, threatenedSpecies:33, protectedLand:28.6, disasterRisk:1.8 },  // happiness=UK value, fertility=UK value, firearms=England+Wales figure
  Croatia:          { pop:4e6,    area:56594,   founded:1991, gdp:70e9,    lifeExp:78,  medianAge:44, co2pc:4.4,  unesco:10, fifa:11,  wcApps:6,  nobel:2,   unemployment:6.1,  elevation:331,  forest:34,  coastline:5835,   fertilityRate:1.47, obesityRate:34.80, happinessScore:6.01, birdSpecies:306,  firearmsRate:13.7,  teaPc:0.09,  publicHolidays:14, internetSpeed:112.88, renewableEnergy:76.3,  prisonRate:128, homicideRate:0.67,  tourists:20.60, languages:27,  precipitation:1113, coffeePc:3.5,  cheesePc:11.0, honeyProduction:2300,   hospitalBeds:5.5,  avgSchooling:11.4, electricityPc:4000, roadLength:26958, threatenedSpecies:67, protectedLand:8.6, disasterRisk:2.3 },
  Ghana:            { pop:33e6,   area:238533,  founded:1957, gdp:77e9,    lifeExp:64,  medianAge:22, co2pc:0.6,  unesco:2,  fifa:73,  wcApps:4,  nobel:0,   unemployment:3.2,  elevation:190,  forest:22,  coastline:539,    fertilityRate:3.30, obesityRate:5.37,  happinessScore:4.55, birdSpecies:681,  firearmsRate:8.0,   teaPc:1.12,  publicHolidays:13, internetSpeed:53.47,  renewableEnergy:36.2,  prisonRate:58,  homicideRate:1.83,  tourists:1.10,  languages:87,  precipitation:1187, coffeePc:0.1,  cheesePc:0.4,  honeyProduction:2000,   hospitalBeds:0.9,  avgSchooling:8.0,  electricityPc:420, roadLength:109515, threatenedSpecies:137, protectedLand:15.8, disasterRisk:4.2 },
  Panama:           { pop:4.4e6,  area:75417,   founded:1903, gdp:67e9,    lifeExp:78,  medianAge:29, co2pc:3.0,  unesco:5,  fifa:34,  wcApps:2,  nobel:1,   unemployment:7.1,  elevation:360,  forest:57,  coastline:2490,   fertilityRate:2.09, obesityRate:29.88, happinessScore:6.55, birdSpecies:889,  firearmsRate:10.8,  teaPc:0.11,  publicHolidays:13, internetSpeed:197.02, renewableEnergy:68.0,  prisonRate:527, homicideRate:11.71, tourists:1.80,  languages:18,  precipitation:2928, coffeePc:1.2,  cheesePc:3.0,  honeyProduction:1000,   hospitalBeds:2.3,  avgSchooling:10.2, electricityPc:2600, roadLength:17343, threatenedSpecies:369, protectedLand:19.2, disasterRisk:3.9 },
  Colombia:         { pop:52e6,   area:1141748, founded:1819, gdp:363e9,   lifeExp:77,  medianAge:31, co2pc:1.8,  unesco:9,  fifa:13,  wcApps:6,  nobel:1,   unemployment:9.2,  elevation:593,  forest:53,  coastline:3208,   fertilityRate:1.62, obesityRate:18.58, happinessScore:6.04, birdSpecies:1917, firearmsRate:10.1,  teaPc:0.02,  publicHolidays:18, internetSpeed:206.83, renewableEnergy:77.1,  prisonRate:197, homicideRate:24.91, tourists:5.63,  languages:89,  precipitation:3240, coffeePc:1.3,  cheesePc:2.5,  honeyProduction:5000,   hospitalBeds:1.7,  avgSchooling:8.7,  electricityPc:1400, roadLength:204389, threatenedSpecies:1707, protectedLand:16.6, disasterRisk:5.0 },
  Uzbekistan:       { pop:36e6,   area:448978,  founded:1991, gdp:90e9,    lifeExp:75,  medianAge:29, co2pc:3.5,  unesco:7,  fifa:50,  wcApps:0,  nobel:0,   unemployment:9.3,  elevation:1021, forest:8,   coastline:0,      fertilityRate:3.45, obesityRate:27.88, happinessScore:6.28, birdSpecies:354,  firearmsRate:0.4,   teaPc:0.89,  publicHolidays:10, internetSpeed:89.89,  renewableEnergy:19.4,  prisonRate:85,  homicideRate:1.40,  tourists:6.63,  languages:37,  precipitation:206,  coffeePc:0.1,  cheesePc:3.0,  honeyProduction:8000,   hospitalBeds:4.0,  avgSchooling:11.6, electricityPc:2100, roadLength:209496, threatenedSpecies:49, protectedLand:8.1, disasterRisk:4.2 },
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
    question: "WHICH HAS MORE INTERNATIONAL TOURNAMENT APPEARANCES?",
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
    question: "WHICH GETS MORE OF ITS ELECTRICITY FROM RENEWABLES?",
    getValue: (c) => COUNTRIES[c].renewableEnergy,
    explain: (w, l, wv, lv) => `${w}: ${wv.toFixed(1)}% vs ${l}: ${lv.toFixed(1)}%`,
  },
  {
    id: "prisonRate",
    key: "prisonRate",
    question: "WHICH LOCKS UP MORE OF ITS POPULATION?",
    getValue: (c) => COUNTRIES[c].prisonRate,
    explain: (w, l, wv, lv) => `${w}: ${wv} per 100,000 people vs ${l}: ${lv} per 100,000 people`,
  },
  {
    id: "homicideRate",
    key: "homicideRate",
    question: "WHICH HAS A HIGHER MURDER RATE?",
    getValue: (c) => COUNTRIES[c].homicideRate,
    explain: (w, l, wv, lv) => `${w}: ${wv.toFixed(2)} per 100,000 people vs ${l}: ${lv.toFixed(2)} per 100,000 people`,
  },
  {
    id: "tourists",
    key: "tourists",
    question: "WHICH ATTRACTS MORE INTERNATIONAL TOURISTS PER YEAR?",
    getValue: (c) => COUNTRIES[c].tourists,
    explain: (w, l, wv, lv) => `${w}: ${wv.toFixed(1)}M visitors vs ${l}: ${lv.toFixed(1)}M visitors`,
  },
  {
    id: "languages",
    key: "languages",
    question: "WHICH HAS MORE LIVING LANGUAGES SPOKEN WITHIN ITS BORDERS?",
    getValue: (c) => COUNTRIES[c].languages,
    explain: (w, l, wv, lv) => `${w}: ${wv} languages vs ${l}: ${lv} languages`,
  },
  {
    id: "precipitation",
    key: "precipitation",
    question: "WHICH GETS MORE ANNUAL RAINFALL?",
    getValue: (c) => COUNTRIES[c].precipitation,
    explain: (w, l, wv, lv) => `${w}: ${wv.toLocaleString()} mm/year vs ${l}: ${lv.toLocaleString()} mm/year`,
  },
  {
    id: "coffeePc",
    key: "coffeePc",
    question: "WHICH DRINKS MORE COFFEE PER PERSON PER YEAR?",
    getValue: (c) => COUNTRIES[c].coffeePc,
    explain: (w, l, wv, lv) => `${w}: ${wv.toFixed(1)} kg/person vs ${l}: ${lv.toFixed(1)} kg/person`,
  },
  {
    id: "cheesePc",
    key: "cheesePc",
    question: "WHICH EATS MORE CHEESE PER PERSON PER YEAR?",
    getValue: (c) => COUNTRIES[c].cheesePc,
    explain: (w, l, wv, lv) => `${w}: ${wv.toFixed(1)} kg/person vs ${l}: ${lv.toFixed(1)} kg/person`,
  },
  {
    id: "honeyProduction",
    key: "honeyProduction",
    question: "WHICH PRODUCES MORE HONEY PER YEAR?",
    getValue: (c) => COUNTRIES[c].honeyProduction,
    explain: (w, l, wv, lv) => `${w}: ${wv.toLocaleString()} tonnes vs ${l}: ${lv.toLocaleString()} tonnes`,
  },
  {
    id: "hospitalBeds",
    key: "hospitalBeds",
    question: "WHICH HAS MORE HOSPITAL BEDS PER 1,000 PEOPLE?",
    getValue: (c) => COUNTRIES[c].hospitalBeds,
    explain: (w, l, wv, lv) => `${w}: ${wv.toFixed(1)} beds per 1,000 vs ${l}: ${lv.toFixed(1)} beds per 1,000`,
  },
  {
    id: "avgSchooling",
    key: "avgSchooling",
    question: "WHICH HAS MORE AVERAGE YEARS OF SCHOOLING?",
    getValue: (c) => COUNTRIES[c].avgSchooling,
    explain: (w, l, wv, lv) => `${w}: ${wv.toFixed(1)} years vs ${l}: ${lv.toFixed(1)} years`,
  },
  {
    id: "electricityPc",
    key: "electricityPc",
    question: "WHICH USES MORE ELECTRICITY PER PERSON PER YEAR?",
    getValue: (c) => COUNTRIES[c].electricityPc,
    explain: (w, l, wv, lv) => `${w}: ${wv.toLocaleString()} kWh vs ${l}: ${lv.toLocaleString()} kWh`,
  },
  {
    id: "roadLength",
    key: "roadLength",
    question: "WHICH HAS A LONGER TOTAL ROAD NETWORK?",
    getValue: (c) => COUNTRIES[c].roadLength,
    explain: (w, l, wv, lv) => `${w}: ${wv.toLocaleString()} km vs ${l}: ${lv.toLocaleString()} km`,
  },
  {
    id: "threatenedSpecies",
    key: "threatenedSpecies",
    question: "WHICH HAS MORE THREATENED SPECIES?",
    getValue: (c) => COUNTRIES[c].threatenedSpecies,
    explain: (w, l, wv, lv) => `${w}: ${wv.toLocaleString()} species vs ${l}: ${lv.toLocaleString()} species`,
  },
  {
    id: "protectedLand",
    key: "protectedLand",
    question: "WHICH HAS A HIGHER SHARE OF PROTECTED LAND?",
    getValue: (c) => COUNTRIES[c].protectedLand,
    explain: (w, l, wv, lv) => `${w}: ${wv.toFixed(1)}% of land protected vs ${l}: ${lv.toFixed(1)}% of land protected`,
  },
  {
    id: "disasterRisk",
    key: "disasterRisk",
    question: "WHICH FACES A HIGHER NATURAL DISASTER RISK?",
    getValue: (c) => COUNTRIES[c].disasterRisk,
    explain: (w, l, wv, lv) => `${w}: ${wv.toFixed(1)} INFORM risk score vs ${l}: ${lv.toFixed(1)} INFORM risk score`,
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
  { label: "International tournament history", url: "https://www.fifa.com/en/tournaments/mens/worldcup" },
  { label: "Nobel Prizes", url: "https://www.nobelprize.org/" },
  { label: "Unemployment", url: "https://data.worldbank.org/indicator/SL.UEM.TOTL.ZS" },
  { label: "Elevation", url: "https://www.worlddata.info/average-elevation.php" },
  { label: "Forest coverage", url: "https://data.worldbank.org/indicator/AG.LND.FRST.ZS" },
  { label: "Coastline", url: "https://www.cia.gov/the-world-factbook/" },
  { label: "2026 tournament schedule", url: "https://worldcuppass.com/schedule/" },
  { label: "2026 tournament groups", url: "https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026" },
  { label: "Fertility rate", url: "https://en.wikipedia.org/wiki/List_of_countries_by_total_fertility_rate" },
  { label: "Obesity rate", url: "https://data.worldobesity.org/rankings/" },
  { label: "World Happiness Report 2025", url: "https://worldhappiness.report/" },
  { label: "Bird species per country", url: "https://biodb.com/table/birds-per-country/" },
  { label: "Civilian firearms per capita", url: "https://en.wikipedia.org/wiki/Estimated_number_of_civilian_guns_per_capita_by_country" },
  { label: "Tea consumption per capita", url: "https://worldpopulationreview.com/country-rankings/tea-consumption-by-country" },
  { label: "Public holidays by country", url: "https://en.wikipedia.org/wiki/List_of_countries_by_number_of_public_holidays" },
  { label: "Speedtest Global Index 2025 (Ookla via worldpopulationreview.com)", url: "https://worldpopulationreview.com/country-rankings/internet-speeds-by-country" },
  { label: "Renewable Electricity Share (Wikipedia / IEA)", url: "https://en.wikipedia.org/wiki/List_of_countries_by_renewable_electricity_production" },
  { label: "World Prison Brief — Prison Population Rates", url: "https://www.prisonstudies.org/highest-to-lowest/prison_population_rate" },
  { label: "UNODC Intentional Homicide Rate (Wikipedia)", url: "https://en.wikipedia.org/wiki/List_of_countries_by_intentional_homicide_rate" },
  { label: "UNWTO International Tourist Arrivals 2023", url: "https://www.unwto.org/tourism-statistics/key-tourism-statistics" },
  { label: "Ethnologue — Languages of the World", url: "https://www.ethnologue.com" },
  { label: "Average Annual Precipitation (Wikipedia / World Bank)", url: "https://en.wikipedia.org/wiki/List_of_countries_by_average_annual_precipitation" },
  { label: "ICO Coffee Consumption per Capita (worldpopulationreview.com 2026)", url: "https://worldpopulationreview.com/country-rankings/coffee-consumption-by-country" },
  { label: "Cheese Consumption per Capita (OECD / worldpopulationreview.com 2026)", url: "https://worldpopulationreview.com/country-rankings/cheese-consumption-by-country" },
  { label: "FAO Honey Production by Country (worldpopulationreview.com 2026)", url: "https://worldpopulationreview.com/country-rankings/honey-production-by-country" },
  { label: "Hospital Beds per 1,000 People (World Bank / WHO)", url: "https://data.worldbank.org/indicator/SH.MED.BEDS.ZS" },
  { label: "Mean Years of Schooling (UNDP Human Development Report 2024)", url: "https://hdr.undp.org/data-center/human-development-index" },
  { label: "Electricity Consumption per Capita kWh (World Bank / IEA)", url: "https://data.worldbank.org/indicator/EG.USE.ELEC.KH.PC" },
  { label: "Road Network Length by Country (CIA World Factbook / Wikipedia)", url: "https://en.wikipedia.org/wiki/List_of_countries_by_road_network_size" },
  { label: "IUCN Red List — Threatened Species by Country", url: "https://www.iucnredlist.org" },
  { label: "Terrestrial Protected Areas, % of Land Area (World Bank)", url: "https://data.worldbank.org/indicator/ER.LND.PTLD.ZS" },
  { label: "INFORM Risk Index (European Commission Joint Research Centre)", url: "https://drmkc.jrc.ec.europa.eu/inform-index" },
];
