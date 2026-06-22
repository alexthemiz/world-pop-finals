"use client";

import { Suspense, useEffect, useState, type CSSProperties } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase, type GameRow } from "@/lib/supabase";
import { generateQuestions } from "@/lib/questions";
import { getOrCreateUUID } from "@/lib/uuid";
import { getAllMatchPairs } from "@/lib/matches";
import { subscribeToGamePush, isPushSupported } from "@/lib/push";
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
  const items = [...FLAG_CODES, ...FLAG_CODES];
  return (
    <div style={{ position: "fixed", left: 0, right: 0, zIndex: 10, overflow: "hidden", background: "rgba(0,0,0,0.7)", borderTop: "1px solid rgba(255,255,255,0.07)", borderBottom: "1px solid rgba(255,255,255,0.07)", padding: "5px 0", ...(direction === "left" ? { top: 0 } : { bottom: 0 }) }}>
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
  const [pickedMatch, setPickedMatch] = useState("");
  const [waitingGameId, setWaitingGameId] = useState<string | null>(null);
  const [gameUrl, setGameUrl] = useState("");
  const [gamesPlayed, setGamesPlayed] = useState<number | null>(null);
  const [notifyState, setNotifyState] = useState<"idle" | "on" | "blocked">("idle");
  const [outstandingGames, setOutstandingGames] = useState<GameRow[]>([]);

  const allPairs = getAllMatchPairs();

  const groupedMatches: Record<string, typeof allPairs> = {};
  allPairs.forEach((p) => {
    if (!groupedMatches[p.group]) groupedMatches[p.group] = [];
    groupedMatches[p.group].push(p);
  });
  const groups = Object.keys(groupedMatches).sort();

  function getMatchPairs() {
    if (pickedMatch) {
      const [home, away] = pickedMatch.split("|");
      const pair = allPairs.find((p) => p.home === home && p.away === away);
      return pair ? [pair] : allPairs;
    }
    return allPairs;
  }

  useEffect(() => {
    if (searchParams.get("mode") === "challenge") setMode("vs-friend");
  }, [searchParams]);

  useEffect(() => {
    supabase
      .from("games_played_counter")
      .select("count")
      .eq("id", 1)
      .single()
      .then(({ data }) => { if (data) setGamesPlayed(Number(data.count)); });
  }, []);

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

  useEffect(() => {
    const uuid = getOrCreateUUID();
    if (!uuid) return;
    supabase
      .from("games")
      .select("id, player1_name, player2_name, player1_answers, player2_answers, phase, player1_uuid, player2_uuid")
      .in("phase", ["waiting", "active", "sudden_death"])
      .or(`player1_uuid.eq.${uuid},player2_uuid.eq.${uuid}`)
      .order("created_at", { ascending: false })
      .then(({ data }) => { if (data) setOutstandingGames(data as GameRow[]); });
  }, []);

  useEffect(() => {
    if (!waitingGameId) return;
    const channel = supabase
      .channel(`home-waiting-${waitingGameId}`)
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "games", filter: `id=eq.${waitingGameId}` },
        (payload) => {
          if ((payload.new as { phase: string }).phase === "active") {
            router.push(`/game/${waitingGameId}`);
          }
        }
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [waitingGameId, router]);

  async function handleCreateGame() {
    if (!name.trim()) {
      setError("ENTER YOUR NAME FIRST");
      return;
    }
    setCreating(true);
    setError(null);
    try {
      const id = makeGameId();
      const questions = generateQuestions(getMatchPairs(), new Set(), 5);
      const { error: insertError } = await supabase.from("games").insert({
        id,
        questions,
        player1_name: name.trim(),
        player1_uuid: getOrCreateUUID(),
        phase: "waiting",
        round: 1,
      });
      if (insertError) throw insertError;
      supabase.rpc("increment_games_played").then(({ error }) => { if (error) console.error(error); });
      localStorage.setItem(`world-pop-finals:${id}`, "player1");
      setWaitingGameId(id);
      setGameUrl(`${window.location.origin}/game/${id}`);
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
        @media (min-width: 768px) {
          .wpf-main { padding-top: 100px !important; }
        }
      `}</style>

      <PitchBackground />

      <FlagTicker direction="left" />
      <FlagTicker direction="right" />

      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", position: "relative", zIndex: 1 }}>
        <main
          className="wpf-main"
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-start",
            padding: "24px 24px",
            paddingTop: 58,
            paddingBottom: 58,
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
            {gamesPlayed !== null && (
              <p style={{ fontSize: 8, color: "var(--gold)", marginTop: 12 }}>
                {gamesPlayed.toLocaleString()} GAMES PLAYED
              </p>
            )}
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

          {/* Match picker */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%", maxWidth: 340 }}>
            <button
              onClick={() => setPickedMatch("")}
              style={{ fontSize: 8, padding: "10px 24px", background: !pickedMatch ? "var(--gold)" : "var(--panel)", color: !pickedMatch ? "#000" : "var(--text-dim)", border: `2px solid ${!pickedMatch ? "var(--gold)" : "var(--panel-border)"}`, borderRadius: 4, cursor: "pointer" }}
            >
              RANDOM
            </button>
            <label style={{ fontSize: 8, color: "var(--text-dim)", marginTop: 14 }}>OR PICK A MATCH</label>
            <select
              value={pickedMatch}
              onChange={(e) => setPickedMatch(e.target.value)}
              style={{ fontFamily: "var(--font-press-start), monospace", fontSize: 7, padding: "9px 10px", background: "#0a0e14", border: `2px solid ${pickedMatch ? "var(--gold)" : "var(--panel-border)"}`, color: "var(--text)", borderRadius: 4, width: "100%", cursor: "pointer" }}
            >
              <option value="">— SELECT A MATCH —</option>
              {groups.map((g) => (
                <optgroup key={g} label={`── GROUP ${g} ──`}>
                  {groupedMatches[g].map((p) => (
                    <option key={`${p.home}|${p.away}`} value={`${p.home}|${p.away}`}>
                      {p.home.toUpperCase()} vs {p.away.toUpperCase()}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          {/* Single player */}
          {mode === "single" && (
            <button
              onClick={() => {
                if (pickedMatch) {
                  const [home, away] = pickedMatch.split("|");
                  router.push(`/single?home=${encodeURIComponent(home)}&away=${encodeURIComponent(away)}`);
                } else {
                  router.push("/single");
                }
              }}
              style={ctaButtonStyle}
            >
              PLAY
            </button>
          )}

          {/* VS Friend */}
          {mode === "vs-friend" && !waitingGameId && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
              {outstandingGames.length > 0 && (
                <div style={{ fontSize: 8, color: "var(--text-dim)", width: "100%", maxWidth: 340 }}>
                  <div style={{ color: "var(--gold)", marginBottom: 8, fontSize: 9, textAlign: "center" }}>
                    OUTSTANDING CHALLENGES
                  </div>
                  {outstandingGames.map((g) => {
                    const iP1 = g.player1_uuid === uuid;
                    const myName = iP1 ? g.player1_name : g.player2_name;
                    const oppName = iP1 ? g.player2_name : g.player1_name;
                    const statusLabel = g.phase === "waiting" ? "UNCLAIMED" : "IN PROGRESS";
                    const statusColor = g.phase === "waiting" ? "var(--text-dim)" : "var(--green)";
                    return (
                      <button
                        key={g.id}
                        onClick={() => router.push(`/game/${g.id}`)}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          width: "100%",
                          padding: "8px 0",
                          background: "transparent",
                          border: "none",
                          borderBottom: "1px solid var(--panel-border)",
                          color: "var(--text)",
                          cursor: "pointer",
                          fontFamily: "inherit",
                          fontSize: 8,
                          textAlign: "left",
                        }}
                      >
                        <span>{myName?.toUpperCase() ?? "YOU"} vs {oppName?.toUpperCase() ?? "?"}</span>
                        <span style={{ color: statusColor }}>{statusLabel}</span>
                      </button>
                    );
                  })}
                </div>
              )}
              <label style={{ fontSize: 8, color: "var(--text-dim)", textAlign: "center" }}>
                YOUR NAME
              </label>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
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
                    width: 140,
                  }}
                />
                <button onClick={handleCreateGame} disabled={creating} style={ctaButtonStyle}>
                  {creating ? "..." : "CREATE GAME"}
                </button>
              </div>
              {error && <div style={{ fontSize: 8, color: "var(--red)" }}>{error}</div>}
              {myGames.length > 0 && (
                <div style={{ fontSize: 8, color: "var(--text-dim)", width: "100%", marginTop: 6 }}>
                  <div style={{ color: "var(--gold)", marginBottom: 8, fontSize: 9, textAlign: "center" }}>
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
            </div>
          )}

          {/* Waiting for opponent */}
          {waitingGameId && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, maxWidth: 340, width: "100%", textAlign: "center" }}>
              <div style={{ fontSize: 12, color: "var(--gold)" }}>WAITING FOR OPPONENT...</div>
              <div style={{ fontSize: 8, color: "var(--text-dim)" }}>SHARE THIS LINK:</div>
              <div style={{ fontSize: 7, background: "var(--panel)", border: "2px solid var(--panel-border)", borderRadius: 6, padding: 12, wordBreak: "break-all", width: "100%" }}>
                {gameUrl}
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={() => navigator.clipboard.writeText(gameUrl)} style={ctaButtonStyle}>
                  COPY LINK
                </button>
                {typeof navigator !== "undefined" && "share" in navigator && (
                  <button onClick={() => navigator.share({ title: "World Pop Finals", text: `Join my game!`, url: gameUrl })} style={ctaButtonStyle}>
                    SHARE
                  </button>
                )}
              </div>
              <button onClick={() => setWaitingGameId(null)} style={{ fontSize: 8, background: "transparent", border: "none", color: "var(--text-dim)", cursor: "pointer", marginTop: 4 }}>
                CANCEL
              </button>
              {isPushSupported() ? (
                notifyState === "on" ? (
                  <div style={{ fontSize: 8, color: "var(--green)" }}>🔔 ON</div>
                ) : notifyState === "blocked" ? (
                  <div style={{ fontSize: 8, color: "var(--text-dim)" }}>NOTIFICATIONS BLOCKED</div>
                ) : (
                  <button
                    onClick={async () => {
                      const gameId = waitingGameId;
                      const ok = await subscribeToGamePush(gameId, "player1");
                      setNotifyState(ok ? "on" : "blocked");
                    }}
                    style={{ ...ctaButtonStyle, fontSize: 8, padding: "10px 16px" }}
                  >
                    🔔 NOTIFY ME WHEN THEY JOIN
                  </button>
                )
              ) : (
                <div style={{ fontSize: 7, color: "var(--text-dim)", maxWidth: 280 }}>
                  ADD THIS SITE TO YOUR HOME SCREEN TO ENABLE NOTIFICATIONS
                </div>
              )}
            </div>
          )}
        </main>

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
