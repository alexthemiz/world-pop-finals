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

// All 48 WC 2026 nations — ISO codes for flagcdn.com
const FLAG_CODES = [
  "us","mx","ca","br","ar","fr","de","es","pt","nl","be","gb-eng",
  "it","hr","pl","ch","ua","at","ro","hu","si","al","ge","sk","cz",
  "gb-sct","tr","kz","ma","sn","ng","cm","eg","za","ci","tn","ml",
  "cd","jp","kr","au","sa","ir","id","cn","nz","uy","co","ec","bo",
  "cl","py","ve",
];

function FlagTicker({ direction }: { direction: "left" | "right" }) {
  const animName = direction === "left" ? "wpf-scroll-left" : "wpf-scroll-right";
  // Duplicate for seamless loop
  const items = [...FLAG_CODES, ...FLAG_CODES];
  return (
    <div style={{ overflow: "hidden", width: "100%", background: "rgba(0,0,0,0.55)", borderTop: direction === "right" ? "1px solid rgba(255,255,255,0.07)" : undefined, borderBottom: direction === "left" ? "1px solid rgba(255,255,255,0.07)" : undefined, padding: "5px 0" }}>
      <div style={{ display: "inline-flex", alignItems: "center", gap: 12, animation: `${animName} 40s linear infinite`, paddingRight: 12 }}>
        {items.map((code, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={i} src={`https://flagcdn.com/32x24/${code}.png`} width={32} height={24} alt={code} style={{ display: "block", imageRendering: "pixelated" }} />
        ))}
      </div>
    </div>
  );
}

function PitchBackground() {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 0, overflow: "hidden", pointerEvents: "none" }}>
      {/* Grass stripes */}
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} style={{ position: "absolute", top: 0, bottom: 0, left: `${i * 10}%`, width: "10%", background: i % 2 === 0 ? "#1a3d1a" : "#1e4a1e" }} />
      ))}
      {/* Pitch outline */}
      <div style={{ position: "absolute", top: "8%", bottom: "8%", left: "5%", right: "5%", border: "2px solid rgba(255,255,255,0.12)", borderRadius: 2 }} />
      {/* Halfway line */}
      <div style={{ position: "absolute", top: "8%", bottom: "8%", left: "50%", width: 2, background: "rgba(255,255,255,0.12)", transform: "translateX(-50%)" }} />
      {/* Center circle */}
      <div style={{ position: "absolute", top: "50%", left: "50%", width: 140, height: 140, border: "2px solid rgba(255,255,255,0.12)", borderRadius: "50%", transform: "translate(-50%, -50%)" }} />
      {/* Center spot */}
      <div style={{ position: "absolute", top: "50%", left: "50%", width: 6, height: 6, background: "rgba(255,255,255,0.2)", borderRadius: "50%", transform: "translate(-50%, -50%)" }} />
      {/* Left penalty box */}
      <div style={{ position: "absolute", top: "30%", bottom: "30%", left: "5%", width: "14%", border: "2px solid rgba(255,255,255,0.09)", borderLeft: "none" }} />
      {/* Right penalty box */}
      <div style={{ position: "absolute", top: "30%", bottom: "30%", right: "5%", width: "14%", border: "2px solid rgba(255,255,255,0.09)", borderRight: "none" }} />
      {/* Dark vignette overlay so content stays readable */}
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at center, rgba(10,14,20,0.55) 0%, rgba(10,14,20,0.82) 100%)" }} />
    </div>
  );
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
    <>
      <style>{`
        @keyframes wpf-scroll-left {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes wpf-scroll-right {
          0%   { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
      `}</style>

      <PitchBackground />

      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", position: "relative", zIndex: 1 }}>
        <FlagTicker direction="left" />

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
                textShadow: "0 0 20px rgba(255,200,0,0.4)",
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
                {m === "single" ? "SINGLE PLAYER" : "CHALLENGE MODE"}
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

        <FlagTicker direction="right" />
        <Footer />
      </div>
    </>
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
