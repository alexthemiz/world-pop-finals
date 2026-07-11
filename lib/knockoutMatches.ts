// World Cup 2026 knockout stage. Round of 32 and Round of 16 are complete;
// later rounds (quarterfinals onward) aren't added yet since they were still
// in progress as of the last data pull — add them once fully resolved.
//
// Kickoff times are approximate slot times, not verified to the minute —
// dates, matchups, venues, and scores are the parts that were cross-checked
// against multiple sources.

import type { Match } from "./matches";

export const KNOCKOUT_ROUNDS = ["Round of 32", "Round of 16"];

export const KNOCKOUT_MATCHES: Match[] = [
  // ROUND OF 32
  { group: "Round of 32", home: "Canada", away: "South Africa", date: "Sun Jun 28", time: "3:00 PM ET", venue: "SoFi Stadium, Los Angeles", result: "1-0" },
  { group: "Round of 32", home: "Brazil", away: "Japan", date: "Mon Jun 29", time: "12:00 PM ET", venue: "NRG Stadium, Houston", result: "2-1" },
  { group: "Round of 32", home: "Germany", away: "Paraguay", date: "Mon Jun 29", time: "4:30 PM ET", venue: "Gillette Stadium, Boston", result: "1-1", penaltyWinner: "Paraguay", penaltyScore: "4-3" },
  { group: "Round of 32", home: "Netherlands", away: "Morocco", date: "Mon Jun 29", time: "7:00 PM ET", venue: "Estadio BBVA, Monterrey", result: "1-1", penaltyWinner: "Morocco", penaltyScore: "3-2" },
  { group: "Round of 32", home: "Norway", away: "Ivory Coast", date: "Tue Jun 30", time: "12:00 PM ET", venue: "AT&T Stadium, Dallas", result: "2-1" },
  { group: "Round of 32", home: "France", away: "Sweden", date: "Tue Jun 30", time: "3:00 PM ET", venue: "MetLife Stadium, New York", result: "3-0" },
  { group: "Round of 32", home: "Mexico", away: "Ecuador", date: "Tue Jun 30", time: "6:00 PM ET", venue: "Estadio Azteca, Mexico City", result: "2-0" },
  { group: "Round of 32", home: "England", away: "DR Congo", date: "Wed Jul 1", time: "12:00 PM ET", venue: "Mercedes-Benz Stadium, Atlanta", result: "2-1" },
  { group: "Round of 32", home: "Belgium", away: "Senegal", date: "Wed Jul 1", time: "3:00 PM ET", venue: "Lumen Field, Seattle", result: "3-2" },
  { group: "Round of 32", home: "USA", away: "Bosnia", date: "Wed Jul 1", time: "6:00 PM ET", venue: "Levi's Stadium, San Francisco", result: "2-0" },
  { group: "Round of 32", home: "Spain", away: "Austria", date: "Thu Jul 2", time: "12:00 PM ET", venue: "SoFi Stadium, Los Angeles", result: "3-0" },
  { group: "Round of 32", home: "Portugal", away: "Croatia", date: "Thu Jul 2", time: "3:00 PM ET", venue: "BMO Field, Toronto", result: "2-1" },
  { group: "Round of 32", home: "Switzerland", away: "Algeria", date: "Thu Jul 2", time: "6:00 PM ET", venue: "BC Place, Vancouver", result: "2-0" },
  { group: "Round of 32", home: "Egypt", away: "Australia", date: "Fri Jul 3", time: "12:00 PM ET", venue: "AT&T Stadium, Dallas", result: "1-1", penaltyWinner: "Egypt", penaltyScore: "4-2" },
  { group: "Round of 32", home: "Argentina", away: "Cabo Verde", date: "Fri Jul 3", time: "3:00 PM ET", venue: "Hard Rock Stadium, Miami", result: "3-2" },
  { group: "Round of 32", home: "Colombia", away: "Ghana", date: "Fri Jul 3", time: "6:00 PM ET", venue: "Arrowhead Stadium, Kansas City", result: "1-0" },

  // ROUND OF 16
  { group: "Round of 16", home: "Morocco", away: "Canada", date: "Sat Jul 4", time: "1:00 PM ET", venue: "NRG Stadium, Houston", result: "3-0" },
  { group: "Round of 16", home: "France", away: "Paraguay", date: "Sat Jul 4", time: "4:30 PM ET", venue: "Lincoln Financial Field, Philadelphia", result: "1-0" },
  { group: "Round of 16", home: "Norway", away: "Brazil", date: "Sun Jul 5", time: "4:00 PM ET", venue: "MetLife Stadium, New York", result: "2-0" },
  { group: "Round of 16", home: "England", away: "Mexico", date: "Sun Jul 5", time: "8:00 PM ET", venue: "Estadio Azteca, Mexico City", result: "3-2" },
  { group: "Round of 16", home: "Spain", away: "Portugal", date: "Mon Jul 6", time: "3:00 PM ET", venue: "AT&T Stadium, Dallas", result: "1-0" },
  { group: "Round of 16", home: "Belgium", away: "USA", date: "Mon Jul 6", time: "8:00 PM ET", venue: "Lumen Field, Seattle", result: "4-1" },
  { group: "Round of 16", home: "Argentina", away: "Egypt", date: "Tue Jul 7", time: "4:00 PM ET", venue: "Mercedes-Benz Stadium, Atlanta", result: "3-2" },
  { group: "Round of 16", home: "Switzerland", away: "Colombia", date: "Tue Jul 7", time: "8:00 PM ET", venue: "BC Place, Vancouver", result: "0-0", penaltyWinner: "Switzerland", penaltyScore: "4-3" },
];

/** All knockout {home, away, group} pairs, grouped by round for the picker dropdown. */
export function getAllKnockoutPairs(): { home: string; away: string; group: string }[] {
  return KNOCKOUT_MATCHES.map(({ home, away, group }) => ({ home, away, group }));
}
