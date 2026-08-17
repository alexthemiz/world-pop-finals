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
  { group: "B", home: "Canada", away: "Ireland", date: "Mon Jul 24", time: "3:00 AM ET", venue: "Perth Rectangular Stadium", result: "2-1" },
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
