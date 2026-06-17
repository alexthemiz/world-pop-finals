"use client";

import { Suspense, useEffect, useState, type CSSProperties } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase, type GameRow } from "@/lib/supabase";
import { generateQuestions } from "@/lib/questions";
import { getOrCreateUUID } from "@/lib/uuid";
import { getAllMatchPairs } from "@/lib/matches";
import Footer from "@/components/Footer";

function makeGameId(): string {
  return Math.random().toString(36).slice(2, 9);
}

function HomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<"single" | "vs-friend">("single");
  const [name, setName] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [myGames, setMyGames] = useState<GameRow[]>([]);

  useEffect(() => {
    if (searchParams.get("mode") === "challenge") setMode("vs-friend");
  }, [searchParams]);

  useEffect(() => {
    const uuid = getOrCreateUUID();
    if (!uuid) return;
    supabase
      .from("games")
      .select("id, player1_name, player2_name, player1_answers, player2_answers, player1_uuid, player2_uuid")
      .eq("phase", "finished")
      .or(`player1_uuid.eq.${uuid},player2_uuid.eq.${uuid}`)
      .order("created_at", { ascending: false })
      .limit(5)
      .then(({ data }) => { if (data) setMyGames(data as GameRow[]); });
  }, []);

  async function handleCreateGame() {
    if (!name.trim()) {
      setError("ENTER YOUR NAME FIRST");
      return;
    }
    setCreating(true);
    setError(null);
    try {
      const id = makeGameId();
      const questions = generateQuestions(getAllMatchPairs());
      const { error: insertError } = await supabase.from("games").insert({
        id,
        questions,
        player1_name: name.trim(),
        player1_uuid: getOrCreateUUID(),
        phase: "waiting",
        round: 1,
      });
      if (insertError) throw insertError;
      localStorage.setItem(`world-pop-finals:${id}`, "player1");
      router.push(`/game/${id}`);
    } catch (e) {
      setError("COULDN'T CREATE GAME. TRY AGAIN.");
      console.error(e);
    } finally {
      setCreating(false);
    }
  }

  const uuid = typeof localStorage !== "undefined" ? localStorage.getItem("wpf-uuid") ?? "" : "";
  const record = myGames.reduce(
    (acc, g) => {
      const iP1 = g.player1_uuid === uuid;
      const my = iP1 ? g.player1_answers : g.player2_answers;
      const opp = iP1 ? g.player2_answers : g.player1_answers;
      const ms = my.filter(Boolean).length;
      const os = opp.filter(Boolean).length;
      if (ms > os) acc.w++;
      else if (ms < os) acc.l++;
      else acc.d++;
      return acc;
    },
    { w: 0, l: 0, d: 0 }
  );

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <main
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 24,
          gap: 28,
          textAlign: "center",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "clamp(20px, 5vw, 32px)",
              color: "var(--gold)",
              margin: 0,
              lineHeight: 1.6,
            }}
          >
            WORLD POP FINALS
          </h1>
          <p style={{ fontSize: 9, color: "var(--text-dim)", marginTop: 10 }}>
            COUNTRY TRIVIA SHOOTOUT
          </p>
        </div>

        {/* Mode toggle */}
        <div
          style={{
            display: "flex",
            background: "var(--panel)",
            border: "3px solid var(--panel-border)",
            borderRadius: 6,
            overflow: "hidden",
          }}
        >
          {(["single", "vs-friend"] as const).map((m) => (
            <button
              key={m}
              onClick={() => { setMode(m); setError(null); }}
              style={{
                fontSize: 9,
                padding: "12px 20px",
                background: mode === m ? "var(--gold)" : "transparent",
                color: mode === m ? "#000" : "var(--text-dim)",
                border: "none",
                cursor: "pointer",
              }}
            >
              {m === "single" ? "SINGLE PLAYER" : "CHALLENGE"}
            </button>
          ))}
        </div>

        {myGames.length > 0 && (
          <div style={{ width: "100%", maxWidth: 340, fontSize: 8, color: "var(--text-dim)" }}>
            <div style={{ color: "var(--gold)", marginBottom: 10, fontSize: 9 }}>
              YOUR RECORD: {record.w}W · {record.l}L · {record.d}D
            </div>
            {myGames.map((g) => {
              const iP1 = g.player1_uuid === uuid;
              const myName = iP1 ? g.player1_name : g.player2_name;
              const oppName = iP1 ? g.player2_name : g.player1_name;
              const my = (iP1 ? g.player1_answers : g.player2_answers).filter(Boolean).length;
              const opp = (iP1 ? g.player2_answers : g.player1_answers).filter(Boolean).length;
              const result = my > opp ? "W" : my < opp ? "L" : "D";
              const color = result === "W" ? "var(--green)" : result === "L" ? "var(--red)" : "var(--text-dim)";
              return (
                <div key={g.id} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: "1px solid var(--panel-border)" }}>
                  <span>{myName?.toUpperCase()} vs {oppName?.toUpperCase()}</span>
                  <span style={{ color }}>{result} {my}–{opp}</span>
                </div>
              );
            })}
          </div>
        )}

        {/* Single player */}
        {mode === "single" && (
          <button onClick={() => router.push("/single")} style={ctaButtonStyle}>
            PLAY
          </button>
        )}

        {/* VS Friend */}
        {mode === "vs-friend" && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 14,
              width: 280,
              background: "var(--panel)",
              border: "3px solid var(--panel-border)",
              borderRadius: 6,
              padding: 20,
            }}
          >
            <label style={{ fontSize: 8, color: "var(--text-dim)", textAlign: "left" }}>
              YOUR NAME
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="PLAYER 1"
              maxLength={16}
              style={{
                fontFamily: "var(--font-press-start), monospace",
                fontSize: 10,
                padding: 10,
                background: "#0a0e14",
                border: "2px solid var(--panel-border)",
                color: "var(--text)",
                borderRadius: 4,
              }}
            />
            {error && <div style={{ fontSize: 8, color: "var(--red)" }}>{error}</div>}
            <button onClick={handleCreateGame} disabled={creating} style={ctaButtonStyle}>
              {creating ? "CREATING..." : "CREATE GAME"}
            </button>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default function Home() {
  return (
    <Suspense>
      <HomeContent />
    </Suspense>
  );
}

const ctaButtonStyle: CSSProperties = {
  fontSize: 11,
  padding: "16px 20px",
  background: "var(--panel)",
  border: "3px solid var(--gold)",
  color: "var(--text)",
  borderRadius: 6,
  cursor: "pointer",
};
