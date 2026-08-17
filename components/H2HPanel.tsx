"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface H2HRecord {
  country_a: string;
  country_b: string;
  a_wins: number;
  b_wins: number;
  draws: number;
  total_matches: number;
  last_matches: {
    date: string;
    home_team: string;
    away_team: string;
    home_score: number;
    away_score: number;
    tournament: string;
  }[];
}

export default function H2HPanel({ home, away }: { home: string; away: string }) {
  const [record, setRecord] = useState<H2HRecord | null | "none">(null);

  useEffect(() => {
    const [a, b] = home < away ? [home, away] : [away, home];
    supabase
      .from("country_h2h")
      .select("*")
      .eq("country_a", a)
      .eq("country_b", b)
      .single()
      .then(({ data }) => setRecord(data ?? "none"));
  }, [home, away]);

  if (record === null) return null; // loading
  if (record === "none") return (
    <div style={{ fontSize: 8, color: "var(--text-dim)", textAlign: "center", padding: "16px 0" }}>
      {home.toUpperCase()} AND {away.toUpperCase()} HAVE NEVER MET IN OFFICIAL COMPETITION
    </div>
  );

  const [a] = home < away ? [home, away] : [away, home];
  const aWins = home === a ? record.a_wins : record.b_wins;
  const bWins = home === a ? record.b_wins : record.a_wins;
  const total = record.total_matches;
  const barMax = Math.max(aWins, bWins, record.draws, 1);

  return (
    <div style={{ borderTop: "2px solid var(--panel-border)", paddingTop: 16, marginTop: 16 }}>
      <div style={{ fontSize: 9, color: "var(--gold)", letterSpacing: 2, marginBottom: 12, textAlign: "center" }}>
        HEAD TO HEAD — {total} MATCHES
      </div>

      {[
        { label: home.toUpperCase(), wins: aWins },
        { label: "DRAWS", wins: record.draws },
        { label: away.toUpperCase(), wins: bWins },
      ].map(({ label, wins }) => (
        <div key={label} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, fontSize: 8 }}>
          <span style={{ width: 100, textAlign: "right", color: "var(--text-dim)" }}>{label}</span>
          <div style={{ flex: 1, background: "var(--panel-border)", height: 8, borderRadius: 2, overflow: "hidden" }}>
            <div style={{ width: `${(wins / barMax) * 100}%`, height: "100%", background: "var(--gold)", borderRadius: 2 }} />
          </div>
          <span style={{ width: 24, color: "var(--text)" }}>{wins}</span>
        </div>
      ))}

      {record.last_matches.length > 0 && (
        <div style={{ marginTop: 12, fontSize: 7, color: "var(--text-dim)" }}>
          <div style={{ marginBottom: 6, color: "var(--text)", letterSpacing: 1 }}>RECENT MEETINGS</div>
          {record.last_matches.slice().reverse().slice(0, 5).map((m, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, gap: 8 }}>
              <span style={{ flexShrink: 0 }}>{m.date.slice(0, 7)}</span>
              <span style={{ flex: 1, textAlign: "center" }}>{m.home_team} {m.home_score}–{m.away_score} {m.away_team}</span>
              <span style={{ color: "var(--text-dim)", maxWidth: 100, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flexShrink: 0 }}>{m.tournament}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
