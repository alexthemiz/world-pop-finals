"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { generateQuestions } from "@/lib/questions";
import { getAllMatchPairs } from "@/lib/matches";
import Footer from "@/components/Footer";

function makeGameId(): string {
  return Math.random().toString(36).slice(2, 9);
}

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<"single" | "vs-friend">("single");
  const [name, setName] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (searchParams.get("mode") === "challenge") setMode("vs-friend");
  }, [searchParams]);

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
            WORLD CUP 2026 · COUNTRY TRIVIA SHOOTOUT
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

const ctaButtonStyle: CSSProperties = {
  fontSize: 11,
  padding: "16px 20px",
  background: "var(--panel)",
  border: "3px solid var(--gold)",
  color: "var(--text)",
  borderRadius: 6,
  cursor: "pointer",
};
