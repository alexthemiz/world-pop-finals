// World Cup 2026 group stage schedule. Times are ET. Today is treated as
// June 16, 2026 — matches on that date with no result yet display "Today".
//
// NOTE: the source brief listed Spain-Saudi Arabia and Uruguay-Cabo Verde
// matchday-2 fixtures under both Group G and Group H. Per the brief's own
// correction (Group H = Spain/Saudi Arabia/Uruguay/Cabo Verde), the G-labeled
// duplicates have been removed so each match appears exactly once.

export interface Match {
  group: string;
  home: string;
  away: string;
  date: string;
  time: string;
  venue: string;
  result: string | null;
}

export const MATCHES: Match[] = [
  // GROUP A
  { group: "A", home: "Mexico", away: "South Africa", date: "Thu Jun 11", time: "3:00 PM ET", venue: "Estadio Azteca, Mexico City", result: "2-0" },
  { group: "A", home: "South Korea", away: "Czechia", date: "Thu Jun 11", time: "10:00 PM ET", venue: "Estadio Akron, Guadalajara", result: "2-1" },
  { group: "A", home: "Czechia", away: "South Africa", date: "Thu Jun 18", time: "12:00 PM ET", venue: "Mercedes-Benz Stadium, Atlanta", result: null },
  { group: "A", home: "Mexico", away: "South Korea", date: "Thu Jun 18", time: "9:00 PM ET", venue: "Estadio Akron, Guadalajara", result: null },
  { group: "A", home: "South Africa", away: "South Korea", date: "Wed Jun 24", time: "9:00 PM ET", venue: "Estadio BBVA, Monterrey", result: null },
  { group: "A", home: "Czechia", away: "Mexico", date: "Wed Jun 24", time: "9:00 PM ET", venue: "Estadio Azteca, Mexico City", result: null },

  // GROUP B
  { group: "B", home: "Canada", away: "Bosnia", date: "Fri Jun 12", time: "3:00 PM ET", venue: "BMO Field, Toronto", result: "1-1" },
  { group: "B", home: "Qatar", away: "Switzerland", date: "Sat Jun 13", time: "3:00 PM ET", venue: "Levi's Stadium, San Francisco", result: "1-1" },
  { group: "B", home: "Switzerland", away: "Bosnia", date: "Thu Jun 18", time: "3:00 PM ET", venue: "SoFi Stadium, Los Angeles", result: null },
  { group: "B", home: "Canada", away: "Qatar", date: "Thu Jun 18", time: "6:00 PM ET", venue: "BC Place, Vancouver", result: null },
  { group: "B", home: "Switzerland", away: "Canada", date: "Wed Jun 24", time: "3:00 PM ET", venue: "BC Place, Vancouver", result: null },
  { group: "B", home: "Bosnia", away: "Qatar", date: "Wed Jun 24", time: "3:00 PM ET", venue: "Lumen Field, Seattle", result: null },

  // GROUP C
  { group: "C", home: "Brazil", away: "Morocco", date: "Sat Jun 13", time: "6:00 PM ET", venue: "MetLife Stadium, New York", result: "1-1" },
  { group: "C", home: "Haiti", away: "Scotland", date: "Sat Jun 13", time: "9:00 PM ET", venue: "Gillette Stadium, Boston", result: "0-1" },
  { group: "C", home: "Scotland", away: "Morocco", date: "Fri Jun 19", time: "6:00 PM ET", venue: "Gillette Stadium, Boston", result: null },
  { group: "C", home: "Brazil", away: "Haiti", date: "Fri Jun 19", time: "8:30 PM ET", venue: "Lincoln Financial Field, Philadelphia", result: null },
  { group: "C", home: "Scotland", away: "Brazil", date: "Wed Jun 24", time: "6:00 PM ET", venue: "Hard Rock Stadium, Miami", result: null },
  { group: "C", home: "Morocco", away: "Haiti", date: "Wed Jun 24", time: "6:00 PM ET", venue: "Mercedes-Benz Stadium, Atlanta", result: null },

  // GROUP D
  { group: "D", home: "USA", away: "Paraguay", date: "Fri Jun 12", time: "9:00 PM ET", venue: "SoFi Stadium, Los Angeles", result: "4-1" },
  { group: "D", home: "Australia", away: "Türkiye", date: "Sun Jun 14", time: "12:00 AM ET", venue: "BC Place, Vancouver", result: "2-0" },
  { group: "D", home: "Türkiye", away: "Paraguay", date: "Fri Jun 19", time: "12:00 AM ET", venue: "Levi's Stadium, San Francisco", result: null },
  { group: "D", home: "USA", away: "Australia", date: "Fri Jun 19", time: "3:00 PM ET", venue: "Lumen Field, Seattle", result: null },
  { group: "D", home: "Türkiye", away: "USA", date: "Thu Jun 25", time: "10:00 PM ET", venue: "SoFi Stadium, Los Angeles", result: null },
  { group: "D", home: "Paraguay", away: "Australia", date: "Thu Jun 25", time: "10:00 PM ET", venue: "Levi's Stadium, San Francisco", result: null },

  // GROUP E
  { group: "E", home: "Germany", away: "Curaçao", date: "Sun Jun 14", time: "1:00 PM ET", venue: "NRG Stadium, Houston", result: null },
  { group: "E", home: "Ivory Coast", away: "Ecuador", date: "Sun Jun 14", time: "7:00 PM ET", venue: "Lincoln Financial Field, Philadelphia", result: null },
  { group: "E", home: "Germany", away: "Ivory Coast", date: "Sat Jun 20", time: "4:00 PM ET", venue: "BMO Field, Toronto", result: null },
  { group: "E", home: "Ecuador", away: "Curaçao", date: "Sat Jun 20", time: "8:00 PM ET", venue: "Arrowhead Stadium, Kansas City", result: null },
  { group: "E", home: "Curaçao", away: "Ivory Coast", date: "Thu Jun 25", time: "4:00 PM ET", venue: "Lincoln Financial Field, Philadelphia", result: null },
  { group: "E", home: "Ecuador", away: "Germany", date: "Thu Jun 25", time: "4:00 PM ET", venue: "MetLife Stadium, New York", result: null },

  // GROUP F
  { group: "F", home: "Netherlands", away: "Japan", date: "Sun Jun 14", time: "4:00 PM ET", venue: "AT&T Stadium, Dallas", result: null },
  { group: "F", home: "Sweden", away: "Tunisia", date: "Sun Jun 14", time: "10:00 PM ET", venue: "Estadio BBVA, Monterrey", result: "5-1" },
  { group: "F", home: "Netherlands", away: "Sweden", date: "Sat Jun 20", time: "1:00 PM ET", venue: "NRG Stadium, Houston", result: null },
  { group: "F", home: "Tunisia", away: "Japan", date: "Sun Jun 21", time: "12:00 AM ET", venue: "Estadio BBVA, Monterrey", result: null },
  { group: "F", home: "Japan", away: "Sweden", date: "Thu Jun 25", time: "7:00 PM ET", venue: "AT&T Stadium, Dallas", result: null },
  { group: "F", home: "Tunisia", away: "Netherlands", date: "Thu Jun 25", time: "7:00 PM ET", venue: "Arrowhead Stadium, Kansas City", result: null },

  // GROUP G
  { group: "G", home: "Belgium", away: "Egypt", date: "Mon Jun 15", time: "3:00 PM ET", venue: "Lumen Field, Seattle", result: "1-1" },
  { group: "G", home: "Iran", away: "New Zealand", date: "Mon Jun 15", time: "9:00 PM ET", venue: "SoFi Stadium, Los Angeles", result: "2-2" },
  { group: "G", home: "Belgium", away: "Iran", date: "Sun Jun 21", time: "3:00 PM ET", venue: "SoFi Stadium, Los Angeles", result: null },
  { group: "G", home: "New Zealand", away: "Egypt", date: "Sun Jun 21", time: "9:00 PM ET", venue: "BC Place, Vancouver", result: null },
  { group: "G", home: "Egypt", away: "Iran", date: "Fri Jun 26", time: "11:00 PM ET", venue: "Lumen Field, Seattle", result: null },
  { group: "G", home: "New Zealand", away: "Belgium", date: "Fri Jun 26", time: "11:00 PM ET", venue: "BC Place, Vancouver", result: null },

  // GROUP H
  { group: "H", home: "Saudi Arabia", away: "Uruguay", date: "Mon Jun 15", time: "6:00 PM ET", venue: "Hard Rock Stadium, Miami", result: "1-1" },
  { group: "H", home: "Spain", away: "Cabo Verde", date: "Mon Jun 15", time: "12:00 PM ET", venue: "Mercedes-Benz Stadium, Atlanta", result: "0-0" },
  { group: "H", home: "Spain", away: "Saudi Arabia", date: "Sun Jun 21", time: "12:00 PM ET", venue: "Mercedes-Benz Stadium, Atlanta", result: null },
  { group: "H", home: "Uruguay", away: "Cabo Verde", date: "Sun Jun 21", time: "6:00 PM ET", venue: "Hard Rock Stadium, Miami", result: null },
  { group: "H", home: "Cabo Verde", away: "Saudi Arabia", date: "Fri Jun 26", time: "8:00 PM ET", venue: "NRG Stadium, Houston", result: null },
  { group: "H", home: "Uruguay", away: "Spain", date: "Fri Jun 26", time: "8:00 PM ET", venue: "Estadio Akron, Guadalajara", result: null },

  // GROUP I
  { group: "I", home: "France", away: "Senegal", date: "Tue Jun 16", time: "3:00 PM ET", venue: "MetLife Stadium, New York", result: null },
  { group: "I", home: "Iraq", away: "Norway", date: "Tue Jun 16", time: "6:00 PM ET", venue: "Gillette Stadium, Boston", result: null },
  { group: "I", home: "France", away: "Iraq", date: "Mon Jun 22", time: "5:00 PM ET", venue: "Lincoln Financial Field, Philadelphia", result: null },
  { group: "I", home: "Norway", away: "Senegal", date: "Mon Jun 22", time: "8:00 PM ET", venue: "MetLife Stadium, New York", result: null },
  { group: "I", home: "Norway", away: "France", date: "Fri Jun 26", time: "3:00 PM ET", venue: "Gillette Stadium, Boston", result: null },
  { group: "I", home: "Senegal", away: "Iraq", date: "Fri Jun 26", time: "3:00 PM ET", venue: "BMO Field, Toronto", result: null },

  // GROUP J
  { group: "J", home: "Argentina", away: "Algeria", date: "Tue Jun 16", time: "9:00 PM ET", venue: "Arrowhead Stadium, Kansas City", result: null },
  { group: "J", home: "Austria", away: "Jordan", date: "Wed Jun 17", time: "12:00 AM ET", venue: "Levi's Stadium, San Francisco", result: null },
  { group: "J", home: "Argentina", away: "Austria", date: "Mon Jun 22", time: "1:00 PM ET", venue: "AT&T Stadium, Dallas", result: null },
  { group: "J", home: "Jordan", away: "Algeria", date: "Mon Jun 22", time: "11:00 PM ET", venue: "Levi's Stadium, San Francisco", result: null },
  { group: "J", home: "Algeria", away: "Austria", date: "Sat Jun 27", time: "10:00 PM ET", venue: "Arrowhead Stadium, Kansas City", result: null },
  { group: "J", home: "Jordan", away: "Argentina", date: "Sat Jun 27", time: "10:00 PM ET", venue: "Arrowhead Stadium, Kansas City", result: null },

  // GROUP K
  { group: "K", home: "Portugal", away: "DR Congo", date: "Wed Jun 17", time: "1:00 PM ET", venue: "NRG Stadium, Houston", result: null },
  { group: "K", home: "Uzbekistan", away: "Colombia", date: "Wed Jun 17", time: "10:00 PM ET", venue: "Estadio Azteca, Mexico City", result: null },
  { group: "K", home: "Portugal", away: "Uzbekistan", date: "Tue Jun 23", time: "1:00 PM ET", venue: "NRG Stadium, Houston", result: null },
  { group: "K", home: "Colombia", away: "DR Congo", date: "Tue Jun 23", time: "10:00 PM ET", venue: "Estadio Akron, Guadalajara", result: null },
  { group: "K", home: "Colombia", away: "Portugal", date: "Sat Jun 27", time: "7:30 PM ET", venue: "Hard Rock Stadium, Miami", result: null },
  { group: "K", home: "DR Congo", away: "Uzbekistan", date: "Sat Jun 27", time: "7:30 PM ET", venue: "Mercedes-Benz Stadium, Atlanta", result: null },

  // GROUP L
  { group: "L", home: "England", away: "Croatia", date: "Wed Jun 17", time: "4:00 PM ET", venue: "AT&T Stadium, Dallas", result: null },
  { group: "L", home: "Ghana", away: "Panama", date: "Wed Jun 17", time: "7:00 PM ET", venue: "BMO Field, Toronto", result: null },
  { group: "L", home: "England", away: "Ghana", date: "Tue Jun 23", time: "4:00 PM ET", venue: "Gillette Stadium, Boston", result: null },
  { group: "L", home: "Panama", away: "Croatia", date: "Tue Jun 23", time: "7:00 PM ET", venue: "BMO Field, Toronto", result: null },
  { group: "L", home: "Panama", away: "England", date: "Sat Jun 27", time: "5:00 PM ET", venue: "MetLife Stadium, New York", result: null },
  { group: "L", home: "Croatia", away: "Ghana", date: "Sat Jun 27", time: "5:00 PM ET", venue: "Lincoln Financial Field, Philadelphia", result: null },
];

export interface MatchInfo {
  type: "result" | "upcoming";
  text: string;
  venue: string;
  date: string;
}

const TODAY = "Wed Jun 17";

export function getMatchInfo(home: string, away: string): MatchInfo | null {
  const match = MATCHES.find(
    (m) => (m.home === home && m.away === away) || (m.home === away && m.away === home)
  );
  if (!match) return null;

  if (match.result) {
    const [hGoals, aGoals] = match.result.split("-");
    const flipped = match.home !== home;
    return {
      type: "result",
      text: flipped
        ? `FINAL: ${away} ${aGoals}-${hGoals} ${home}`
        : `FINAL: ${home} ${hGoals}-${aGoals} ${away}`,
      venue: match.venue,
      date: match.date,
    };
  }

  const dateLabel = match.date === TODAY ? "Today" : match.date;
  return {
    type: "upcoming",
    text: `${dateLabel} · ${match.time}`,
    venue: match.venue,
    date: match.date,
  };
}

/** All unique {home, away, group} fixtures, used as the pool for question generation. */
export function getAllMatchPairs(): { home: string; away: string; group: string }[] {
  return MATCHES.map(({ home, away, group }) => ({ home, away, group }));
}
