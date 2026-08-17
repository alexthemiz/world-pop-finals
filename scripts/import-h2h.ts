import fs from "fs";
import path from "path";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const CSV_PATH = path.join(__dirname, "results.csv");

if (!fs.existsSync(CSV_PATH)) {
  console.error(`CSV not found at ${CSV_PATH}`);
  console.error("Download from: https://www.kaggle.com/datasets/martj42/international-football-results-from-1872-to-2024");
  console.error("Save as scripts/results.csv, then re-run.");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

interface MatchRecord {
  date: string;
  home_team: string;
  away_team: string;
  home_score: number;
  away_score: number;
  tournament: string;
  neutral: boolean;
}

interface PairStats {
  a_wins: number;
  b_wins: number;
  draws: number;
  total_matches: number;
  last_matches: MatchRecord[];
}

function canonicalPair(t1: string, t2: string): [string, string] {
  return t1 < t2 ? [t1, t2] : [t2, t1];
}

async function main() {
  const raw = fs.readFileSync(CSV_PATH, "utf-8");
  const lines = raw.split("\n").slice(1).filter(Boolean);

  const pairs = new Map<string, PairStats>();

  for (const line of lines) {
    const [date, home_team, away_team, home_score_s, away_score_s, tournament, , neutral_s] = line.split(",");
    if (!home_team || !away_team) continue;
    const home_score = parseInt(home_score_s, 10);
    const away_score = parseInt(away_score_s, 10);
    if (isNaN(home_score) || isNaN(away_score)) continue;

    const [a, b] = canonicalPair(home_team.trim(), away_team.trim());
    const key = `${a}|||${b}`;

    if (!pairs.has(key)) {
      pairs.set(key, { a_wins: 0, b_wins: 0, draws: 0, total_matches: 0, last_matches: [] });
    }

    const stats = pairs.get(key)!;
    stats.total_matches++;

    const aIsHome = a === home_team.trim();
    if (home_score > away_score) {
      if (aIsHome) stats.a_wins++; else stats.b_wins++;
    } else if (away_score > home_score) {
      if (aIsHome) stats.b_wins++; else stats.a_wins++;
    } else {
      stats.draws++;
    }

    stats.last_matches.push({
      date: date.trim(),
      home_team: home_team.trim(),
      away_team: away_team.trim(),
      home_score,
      away_score,
      tournament: tournament.trim(),
      neutral: neutral_s?.trim() === "TRUE",
    });
  }

  // Keep only the 5 most recent matches per pair (CSV is chronological)
  const rows = [];
  for (const [key, stats] of pairs.entries()) {
    const [country_a, country_b] = key.split("|||");
    rows.push({
      country_a,
      country_b,
      a_wins: stats.a_wins,
      b_wins: stats.b_wins,
      draws: stats.draws,
      total_matches: stats.total_matches,
      last_matches: stats.last_matches.slice(-5),
      last_updated: new Date().toISOString(),
    });
  }

  console.log(`Upserting ${rows.length} pairs...`);

  for (let i = 0; i < rows.length; i += 500) {
    const chunk = rows.slice(i, i + 500);
    const { error } = await supabase.from("country_h2h").upsert(chunk, { onConflict: "country_a,country_b" });
    if (error) { console.error(error); process.exit(1); }
    console.log(`  ${Math.min(i + 500, rows.length)}/${rows.length}`);
  }

  console.log("Done.");
}

main();
