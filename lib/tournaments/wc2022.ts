import type { TournamentConfig } from "./types";
import type { Match } from "@/lib/matches";

const GROUPS: Match[] = [
  // Group A (Qatar, Ecuador, Senegal, Netherlands)
  { group: "A", home: "Qatar", away: "Ecuador", date: "Sun Nov 20", time: "11:00 AM ET", venue: "Al Bayt Stadium", result: "0-2" },
  { group: "A", home: "Senegal", away: "Netherlands", date: "Mon Nov 21", time: "11:00 AM ET", venue: "Al Thumama Stadium", result: "0-2" },
  { group: "A", home: "Qatar", away: "Senegal", date: "Fri Nov 25", time: "11:00 AM ET", venue: "Al Thumama Stadium", result: "1-3" },
  { group: "A", home: "Netherlands", away: "Ecuador", date: "Fri Nov 25", time: "2:00 PM ET", venue: "Khalifa International Stadium", result: "1-1" },
  { group: "A", home: "Ecuador", away: "Senegal", date: "Tue Nov 29", time: "10:00 AM ET", venue: "Khalifa International Stadium", result: "1-2" },
  { group: "A", home: "Netherlands", away: "Qatar", date: "Tue Nov 29", time: "10:00 AM ET", venue: "Al Bayt Stadium", result: "2-0" },

  // Group B (England, Iran, USA, Wales)
  { group: "B", home: "England", away: "Iran", date: "Mon Nov 21", time: "2:00 PM ET", venue: "Khalifa International Stadium", result: "6-2" },
  { group: "B", home: "USA", away: "Wales", date: "Mon Nov 21", time: "2:00 PM ET", venue: "Ahmad bin Ali Stadium", result: "1-1" },
  { group: "B", home: "Wales", away: "Iran", date: "Fri Nov 25", time: "8:00 AM ET", venue: "Ahmad bin Ali Stadium", result: "0-2" },
  { group: "B", home: "England", away: "USA", date: "Fri Nov 25", time: "2:00 PM ET", venue: "Al Bayt Stadium", result: "0-0" },
  { group: "B", home: "Wales", away: "England", date: "Tue Nov 29", time: "2:00 PM ET", venue: "Ahmad bin Ali Stadium", result: "0-3" },
  { group: "B", home: "Iran", away: "USA", date: "Tue Nov 29", time: "2:00 PM ET", venue: "Al Thumama Stadium", result: "0-1" },

  // Group C (Argentina, Saudi Arabia, Mexico, Poland)
  { group: "C", home: "Argentina", away: "Saudi Arabia", date: "Tue Nov 22", time: "5:00 AM ET", venue: "Lusail Stadium", result: "1-2" },
  { group: "C", home: "Poland", away: "Mexico", date: "Tue Nov 22", time: "11:00 AM ET", venue: "Stadium 974", result: "0-0" },
  { group: "C", home: "Argentina", away: "Mexico", date: "Sat Nov 26", time: "2:00 PM ET", venue: "Lusail Stadium", result: "2-0" },
  { group: "C", home: "Saudi Arabia", away: "Poland", date: "Sat Nov 26", time: "8:00 AM ET", venue: "Education City Stadium", result: "0-2" },
  { group: "C", home: "Argentina", away: "Poland", date: "Wed Nov 30", time: "2:00 PM ET", venue: "Stadium 974", result: "2-0" },
  { group: "C", home: "Mexico", away: "Saudi Arabia", date: "Wed Nov 30", time: "2:00 PM ET", venue: "Lusail Stadium", result: "2-1" },

  // Group D (France, Australia, Denmark, Tunisia)
  { group: "D", home: "France", away: "Australia", date: "Tue Nov 22", time: "2:00 PM ET", venue: "Al Janoub Stadium", result: "4-1" },
  { group: "D", home: "Denmark", away: "Tunisia", date: "Tue Nov 22", time: "8:00 AM ET", venue: "Education City Stadium", result: "0-0" },
  { group: "D", home: "France", away: "Denmark", date: "Sat Nov 26", time: "11:00 AM ET", venue: "Stadium 974", result: "2-1" },
  { group: "D", home: "Tunisia", away: "Australia", date: "Sat Nov 26", time: "5:00 AM ET", venue: "Al Janoub Stadium", result: "0-1" },
  { group: "D", home: "Australia", away: "Denmark", date: "Wed Nov 30", time: "10:00 AM ET", venue: "Al Janoub Stadium", result: "1-0" },
  { group: "D", home: "Tunisia", away: "France", date: "Wed Nov 30", time: "10:00 AM ET", venue: "Education City Stadium", result: "1-0" },

  // Group E (Spain, Costa Rica, Germany, Japan)
  { group: "E", home: "Spain", away: "Costa Rica", date: "Wed Nov 23", time: "11:00 AM ET", venue: "Al Thumama Stadium", result: "7-0" },
  { group: "E", home: "Japan", away: "Germany", date: "Wed Nov 23", time: "2:00 PM ET", venue: "Khalifa International Stadium", result: "2-1" },
  { group: "E", home: "Spain", away: "Germany", date: "Sun Nov 27", time: "2:00 PM ET", venue: "Al Bayt Stadium", result: "1-1" },
  { group: "E", home: "Japan", away: "Costa Rica", date: "Sun Nov 27", time: "5:00 AM ET", venue: "Ahmad bin Ali Stadium", result: "0-1" },
  { group: "E", home: "Japan", away: "Spain", date: "Thu Dec 1", time: "2:00 PM ET", venue: "Khalifa International Stadium", result: "2-1" },
  { group: "E", home: "Costa Rica", away: "Germany", date: "Thu Dec 1", time: "2:00 PM ET", venue: "Al Bayt Stadium", result: "2-4" },

  // Group F (Belgium, Canada, Morocco, Croatia)
  { group: "F", home: "Belgium", away: "Canada", date: "Wed Nov 23", time: "5:00 AM ET", venue: "Ahmad bin Ali Stadium", result: "1-0" },
  { group: "F", home: "Morocco", away: "Croatia", date: "Wed Nov 23", time: "8:00 AM ET", venue: "Al Bayt Stadium", result: "0-0" },
  { group: "F", home: "Belgium", away: "Morocco", date: "Sun Nov 27", time: "8:00 AM ET", venue: "Al Thumama Stadium", result: "0-2" },
  { group: "F", home: "Croatia", away: "Canada", date: "Sun Nov 27", time: "11:00 AM ET", venue: "Khalifa International Stadium", result: "4-1" },
  { group: "F", home: "Croatia", away: "Belgium", date: "Thu Dec 1", time: "10:00 AM ET", venue: "Ahmad bin Ali Stadium", result: "0-0" },
  { group: "F", home: "Morocco", away: "Canada", date: "Thu Dec 1", time: "10:00 AM ET", venue: "Al Thumama Stadium", result: "2-1" },

  // Group G (Brazil, Serbia, Switzerland, Cameroon)
  { group: "G", home: "Brazil", away: "Serbia", date: "Thu Nov 24", time: "2:00 PM ET", venue: "Lusail Stadium", result: "2-0" },
  { group: "G", home: "Switzerland", away: "Cameroon", date: "Thu Nov 24", time: "8:00 AM ET", venue: "Al Janoub Stadium", result: "1-0" },
  { group: "G", home: "Brazil", away: "Switzerland", date: "Mon Nov 28", time: "2:00 PM ET", venue: "Stadium 974", result: "1-0" },
  { group: "G", home: "Cameroon", away: "Serbia", date: "Mon Nov 28", time: "8:00 AM ET", venue: "Al Janoub Stadium", result: "3-3" },
  { group: "G", home: "Cameroon", away: "Brazil", date: "Fri Dec 2", time: "2:00 PM ET", venue: "Lusail Stadium", result: "1-0" },
  { group: "G", home: "Serbia", away: "Switzerland", date: "Fri Dec 2", time: "2:00 PM ET", venue: "Stadium 974", result: "2-3" },

  // Group H (Portugal, Ghana, Uruguay, South Korea)
  { group: "H", home: "Portugal", away: "Ghana", date: "Thu Nov 24", time: "11:00 AM ET", venue: "Stadium 974", result: "3-2" },
  { group: "H", home: "South Korea", away: "Uruguay", date: "Thu Nov 24", time: "5:00 AM ET", venue: "Education City Stadium", result: "0-0" },
  { group: "H", home: "Portugal", away: "Uruguay", date: "Mon Nov 28", time: "11:00 AM ET", venue: "Lusail Stadium", result: "2-0" },
  { group: "H", home: "South Korea", away: "Ghana", date: "Mon Nov 28", time: "5:00 AM ET", venue: "Education City Stadium", result: "2-3" },
  { group: "H", home: "South Korea", away: "Portugal", date: "Fri Dec 2", time: "10:00 AM ET", venue: "Education City Stadium", result: "2-1" },
  { group: "H", home: "Uruguay", away: "Ghana", date: "Fri Dec 2", time: "10:00 AM ET", venue: "Al Janoub Stadium", result: "2-0" },
];

const KNOCKOUT: Match[] = [
  { group: "Final", home: "Argentina", away: "France", date: "Sun Dec 18", time: "10:00 AM ET", venue: "Lusail Stadium", result: "3-3 AET", penaltyWinner: "Argentina", penaltyScore: "4-2" },
  { group: "Third Place", home: "Croatia", away: "Morocco", date: "Sat Dec 17", time: "10:00 AM ET", venue: "Khalifa International Stadium", result: "2-1" },
  { group: "Semifinals", home: "Argentina", away: "Croatia", date: "Tue Dec 13", time: "2:00 PM ET", venue: "Lusail Stadium", result: "3-0" },
  { group: "Semifinals", home: "France", away: "Morocco", date: "Wed Dec 14", time: "2:00 PM ET", venue: "Al Bayt Stadium", result: "2-0" },
  { group: "Quarterfinals", home: "Croatia", away: "Brazil", date: "Fri Dec 9", time: "2:00 PM ET", venue: "Education City Stadium", result: "1-1 AET", penaltyWinner: "Croatia", penaltyScore: "4-2" },
  { group: "Quarterfinals", home: "Netherlands", away: "Argentina", date: "Fri Dec 9", time: "10:00 AM ET", venue: "Lusail Stadium", result: "2-2 AET", penaltyWinner: "Argentina", penaltyScore: "4-3" },
  { group: "Quarterfinals", home: "Morocco", away: "Portugal", date: "Sat Dec 10", time: "2:00 PM ET", venue: "Al Thumama Stadium", result: "1-0" },
  { group: "Quarterfinals", home: "England", away: "France", date: "Sat Dec 10", time: "10:00 AM ET", venue: "Al Bayt Stadium", result: "1-2" },
  { group: "Round of 16", home: "Netherlands", away: "USA", date: "Sat Dec 3", time: "10:00 AM ET", venue: "Khalifa International Stadium", result: "3-1" },
  { group: "Round of 16", home: "Argentina", away: "Australia", date: "Sat Dec 3", time: "2:00 PM ET", venue: "Ahmad bin Ali Stadium", result: "2-1" },
  { group: "Round of 16", home: "France", away: "Poland", date: "Sun Dec 4", time: "10:00 AM ET", venue: "Al Thumama Stadium", result: "3-1" },
  { group: "Round of 16", home: "England", away: "Senegal", date: "Sun Dec 4", time: "2:00 PM ET", venue: "Al Bayt Stadium", result: "3-0" },
  { group: "Round of 16", home: "Japan", away: "Croatia", date: "Mon Dec 5", time: "10:00 AM ET", venue: "Al Janoub Stadium", result: "1-1 AET", penaltyWinner: "Croatia", penaltyScore: "3-1" },
  { group: "Round of 16", home: "Brazil", away: "South Korea", date: "Mon Dec 5", time: "2:00 PM ET", venue: "Stadium 974", result: "4-1" },
  { group: "Round of 16", home: "Morocco", away: "Spain", date: "Tue Dec 6", time: "10:00 AM ET", venue: "Education City Stadium", result: "0-0 AET", penaltyWinner: "Morocco", penaltyScore: "3-0" },
  { group: "Round of 16", home: "Portugal", away: "Switzerland", date: "Tue Dec 6", time: "2:00 PM ET", venue: "Lusail Stadium", result: "6-1" },
];

export const wc2022: TournamentConfig = {
  id: "wc2022",
  name: "FIFA World Cup 2022",
  shortName: "WC 2022",
  hosts: "Qatar",
  year: 2022,
  emoji: "🏆",
  nations: [
    "Qatar", "Ecuador", "Senegal", "Netherlands", "England", "Iran", "USA",
    "Wales", "Argentina", "Saudi Arabia", "Mexico", "Poland", "France",
    "Australia", "Denmark", "Tunisia", "Spain", "Costa Rica", "Germany",
    "Japan", "Belgium", "Canada", "Morocco", "Croatia", "Brazil", "Serbia",
    "Switzerland", "Cameroon", "Portugal", "Ghana", "Uruguay", "South Korea",
  ],
  groups: GROUPS,
  knockoutRounds: ["Final", "Third Place", "Semifinals", "Quarterfinals", "Round of 16"],
  knockout: KNOCKOUT,
  finalsMatch: { home: "Argentina", away: "France" },
};
