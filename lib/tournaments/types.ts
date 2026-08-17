import type { Match } from "@/lib/matches";

export interface TournamentConfig {
  id: string;                  // used in URL: /wc2026
  name: string;                // "FIFA World Cup 2026"
  shortName: string;           // "WC 2026"
  hosts: string;               // "USA / Canada / Mexico"
  year: number;
  emoji: string;               // "🏆"
  nations: string[];           // all participating nations
  groups: Match[];             // group stage fixtures + results
  knockoutRounds: string[];    // ordered list of round names for dropdown
  knockout: Match[];           // knockout bracket entries
  finalsMatch?: { home: string; away: string }; // for quick-pick button
}
