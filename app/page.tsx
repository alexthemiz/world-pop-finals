"use client";

import { Suspense, useEffect, useState, type CSSProperties } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { supabase, type GameRow } from "@/lib/supabase";
import { generateQuestions } from "@/lib/questions";
import { getOrCreateUUID } from "@/lib/uuid";
import { COUNTRIES } from "@/lib/countries";
import { TOURNAMENTS } from "@/lib/tournaments";
import { subscribeToGamePush, isPushSupported } from "@/lib/push";
import Footer from "@/components/Footer";
import { PitchBackground, FlagTicker } from "@/components/HomeDecorations";

function makeGameId(): string {
  return Math.random().toString(36).slice(2, 9);
}

function getRandomMatchup() {
  const nations = Object.keys(COUNTRIES);
  let a = nations[Math.floor(Math.random() * nations.length)];
  let b = nations[Math.floor(Math.random() * nations.length)];
  while (b === a) b = nations[Math.floor(Math.random() * nations.length)];
  return { home: a, away: b };
}

function HomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<"single" | "vs-friend">(() => {
    if (typeof localStorage === "undefined") return "single";
    const saved = localStorage.getItem("tk-mode");
    return saved === "single" || saved === "vs-friend" ? saved : "single";
  });
  const [name, setName] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [myGames, setMyGames] = useState<GameRow[]>([]);
  const [countryA, setCountryA] = useState("");
  const [countryB, setCountryB] = useState("");
  const [searchA, setSearchA] = useState("");
  const [searchB, setSearchB] = useState("");
  const [openA, setOpenA] = useState(false);
  const [openB, setOpenB] = useState(false);
  const [waitingGameId, setWaitingGameId] = useState<string | null>(null);
  const [gameUrl, setGameUrl] = useState("");
  const [gamesPlayed, setGamesPlayed] = useState<number | null>(null);
  const [notifyState, setNotifyState] = useState<"idle" | "on" | "blocked">("idle");
  const [outstandingGames, setOutstandingGames] = useState<GameRow[]>([]);

  const allNations = Object.keys(COUNTRIES).sort();
  const filteredA = allNations.filter(n => n.toLowerCase().includes(searchA.toLowerCase()) && n !== countryB);
  const filteredB = allNations.filter(n => n.toLowerCase().includes(searchB.toLowerCase()) && n !== countryA);

  useEffect(() => {
    if (searchParams.get("mode") === "challenge") setMode("vs-friend");
  }, [searchParams]);

  useEffect(() => {
    localStorage.setItem("tk-mode", mode);
  }, [mode]);

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
    const dismissed = JSON.parse(localStorage.getItem("tk-dismissed-games") ?? "[]") as string[];
    supabase
      .from("games")
      .select("id, questions, player1_name, player2_name, player1_answers, player2_answers, phase, player1_uuid, player2_uuid")
      .in("phase", ["waiting", "active", "sudden_death"])
      .or(`player1_uuid.eq.${uuid},player2_uuid.eq.${uuid}`)
      .order("created_at", { ascending: false })
      .then(({ data }) => { if (data) setOutstandingGames((data as GameRow[]).filter((g) => !dismissed.includes(g.id))); });
  }, []);

  const outstandingIds = outstandingGames.map((g) => g.id).join(",");
  useEffect(() => {
    if (!outstandingIds) return;
    const channels = outstandingIds.split(",").map((id) =>
      supabase
        .channel(`outstanding-${id}`)
        .on(
          "postgres_changes",
          { event: "UPDATE", schema: "public", table: "games", filter: `id=eq.${id}` },
          (payload) => {
            const updated = payload.new as GameRow;
            setOutstandingGames((prev) =>
              updated.phase === "finished"
                ? prev.filter((g) => g.id !== updated.id)
                : prev.map((g) => (g.id === updated.id ? updated : g))
            );
          }
        )
        .subscribe()
    );
    return () => { channels.forEach((c) => supabase.removeChannel(c)); };
  }, [outstandingIds]);

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
      const pair = countryA && countryB
        ? { home: countryA, away: countryB, group: "Custom" }
        : { ...getRandomMatchup(), group: "Custom" };
      const questions = generateQuestions([pair], undefined, 5);
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
      localStorage.setItem(`trivia-kicks:${id}`, "player1");
      setWaitingGameId(id);
      setGameUrl(`${window.location.origin}/game/${id}`);
    } catch (e) {
      setError("COULDN'T CREATE GAME. TRY AGAIN.");
      console.error(e);
    } finally {
      setCreating(false);
    }
  }

  const uuid = typeof localStorage !== "undefined" ? localStorage.getItem("tk-uuid") ?? "" : "";
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
        @keyframes tk-scroll-left {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes tk-scroll-right {
          0%   { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
      `}</style>

      <PitchBackground />

      <FlagTicker direction="left" />
      <FlagTicker direction="right" />

      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", position: "relative", zIndex: 1 }}>
        <main
          className="tk-main"
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-start",
            padding: "24px 24px",
            paddingTop: 64,
            paddingBottom: 48,
            gap: 26,
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
              TRIVIA KICKS
            </h1>
            <p style={{ fontSize: 9, color: "var(--text)", marginTop: 10 }}>
              COUNTRY TRIVIA SHOOTOUT
            </p>
          </div>

          {/* Mode toggle */}
          <div
            style={{
              display: "flex",
              background: "#0a0e14",
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
                  width: 170,
                  whiteSpace: "nowrap",
                  background: mode === m ? "var(--gold)" : "transparent",
                  color: mode === m ? "#000" : "var(--text-dim)",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                {m === "single" ? "SINGLE PLAYER" : "VERSUS MODE"}
              </button>
            ))}
          </div>

          {/* Tournament cards row */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center", maxWidth: 460 }}>
            {TOURNAMENTS.map(t => (
              <Link key={t.id} href={`/${t.id}`} style={{
                display: "flex", flexDirection: "column", alignItems: "center",
                padding: "10px 16px", background: "#0a0e14",
                border: "2px solid var(--panel-border)", borderRadius: 6,
                color: "var(--gold)", textDecoration: "none", fontSize: 8, gap: 4,
                fontFamily: "var(--font-press-start), monospace",
              }}>
                <span style={{ fontSize: 20 }}>{t.emoji}</span>
                <span>{t.shortName}</span>
                <span style={{ color: "var(--text-dim)", fontSize: 7 }}>{t.hosts}</span>
              </Link>
            ))}
          </div>

          {/* Searchable country pickers */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%", maxWidth: 460 }}>
            <div style={{ fontSize: 8, color: "var(--text)" }}>PICK ANY TWO NATIONS</div>
            <div style={{ display: "flex", gap: 8, width: "100%", flexWrap: "wrap" }}>
              {/* Country A picker */}
              <div style={{ position: "relative", flex: 1, minWidth: 140 }}>
                <input
                  value={countryA || searchA}
                  onFocus={() => { setOpenA(true); if (countryA) { setSearchA(""); setCountryA(""); } }}
                  onChange={e => { setSearchA(e.target.value); setCountryA(""); }}
                  onBlur={() => setTimeout(() => setOpenA(false), 150)}
                  placeholder="COUNTRY 1"
                  style={{
                    fontFamily: "var(--font-press-start), monospace",
                    fontSize: 8, padding: "9px 10px", width: "100%", boxSizing: "border-box",
                    background: "#0a0e14", border: `2px solid ${countryA ? "var(--gold)" : "var(--panel-border)"}`,
                    color: "var(--text)", borderRadius: 4, cursor: "pointer",
                  }}
                />
                {openA && filteredA.length > 0 && (
                  <div style={{
                    position: "absolute", top: "100%", left: 0, right: 0, zIndex: 100,
                    background: "#0a0e14", border: "2px solid var(--panel-border)",
                    borderTop: "none", maxHeight: 200, overflowY: "auto",
                  }}>
                    {filteredA.map(n => (
                      <div
                        key={n}
                        onMouseDown={() => { setCountryA(n); setSearchA(""); setOpenA(false); }}
                        style={{
                          padding: "8px 10px", cursor: "pointer", fontSize: 8,
                          color: "var(--text)", fontFamily: "var(--font-press-start), monospace",
                        }}
                        onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,200,0,0.1)")}
                        onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                      >
                        {n}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {/* Country B picker */}
              <div style={{ position: "relative", flex: 1, minWidth: 140 }}>
                <input
                  value={countryB || searchB}
                  onFocus={() => { setOpenB(true); if (countryB) { setSearchB(""); setCountryB(""); } }}
                  onChange={e => { setSearchB(e.target.value); setCountryB(""); }}
                  onBlur={() => setTimeout(() => setOpenB(false), 150)}
                  placeholder="COUNTRY 2"
                  style={{
                    fontFamily: "var(--font-press-start), monospace",
                    fontSize: 8, padding: "9px 10px", width: "100%", boxSizing: "border-box",
                    background: "#0a0e14", border: `2px solid ${countryB ? "var(--gold)" : "var(--panel-border)"}`,
                    color: "var(--text)", borderRadius: 4, cursor: "pointer",
                  }}
                />
                {openB && filteredB.length > 0 && (
                  <div style={{
                    position: "absolute", top: "100%", left: 0, right: 0, zIndex: 100,
                    background: "#0a0e14", border: "2px solid var(--panel-border)",
                    borderTop: "none", maxHeight: 200, overflowY: "auto",
                  }}>
                    {filteredB.map(n => (
                      <div
                        key={n}
                        onMouseDown={() => { setCountryB(n); setSearchB(""); setOpenB(false); }}
                        style={{
                          padding: "8px 10px", cursor: "pointer", fontSize: 8,
                          color: "var(--text)", fontFamily: "var(--font-press-start), monospace",
                        }}
                        onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,200,0,0.1)")}
                        onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                      >
                        {n}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={() => { const m = getRandomMatchup(); setCountryA(m.home); setCountryB(m.away); setSearchA(""); setSearchB(""); }}
              style={{ fontSize: 8, background: "transparent", border: "2px solid var(--panel-border)", color: "var(--text)", cursor: "pointer", padding: "8px 14px", borderRadius: 4, fontFamily: "var(--font-press-start), monospace" }}
            >
              🎲 RANDOM MATCHUP
            </button>
          </div>

          {/* Single player */}
          {mode === "single" && (
            <button
              onClick={() => {
                const pair = countryA && countryB
                  ? { home: countryA, away: countryB }
                  : getRandomMatchup();
                router.push(`/single?home=${encodeURIComponent(pair.home)}&away=${encodeURIComponent(pair.away)}`);
              }}
              style={ctaButtonStyle}
            >
              PLAY
            </button>
          )}

          {/* Enter name + create game (Versus mode only) */}
          {mode === "vs-friend" && !waitingGameId && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 26 }}>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <label style={{ fontSize: 8, color: "var(--text)" }}>
                  ENTER YOUR NAME:
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="PLAYER 1"
                  maxLength={16}
                  style={{
                    fontFamily: "var(--font-press-start), monospace",
                    fontSize: 16,
                    padding: 16,
                    background: "#0a0e14",
                    border: `2px solid ${name.trim() ? "var(--panel-border)" : "var(--gold)"}`,
                    color: "var(--text)",
                    borderRadius: 4,
                    width: 224,
                    transform: "scale(0.625)",
                    transformOrigin: "left center",
                    marginRight: -84,
                  }}
                />
              </div>
              {error && <div style={{ fontSize: 8, color: "var(--red)" }}>{error}</div>}
              <button
                onClick={handleCreateGame}
                disabled={creating}
                style={{ fontSize: 9, padding: "12px 20px", width: 170, background: "var(--panel)", color: "var(--text)", border: `2px solid ${name.trim() ? "var(--gold)" : "var(--panel-border)"}`, borderRadius: 4, cursor: "pointer" }}
              >
                {creating ? "..." : "CREATE GAME"}
              </button>
            </div>
          )}
          {/* Outstanding challenges */}
          {mode === "vs-friend" && !waitingGameId && outstandingGames.length > 0 && (
            <div style={{ fontSize: 8, color: "var(--text)", width: "100%", maxWidth: 460 }}>
              <div style={{ color: "var(--gold)", marginBottom: 8, fontSize: 9, textAlign: "center" }}>
                OUTSTANDING CHALLENGES
              </div>
              {outstandingGames.map((g) => {
                const iP1 = g.player1_uuid === uuid;
                const myName = iP1 ? g.player1_name : g.player2_name;
                const oppName = iP1 ? g.player2_name : g.player1_name;
                const myAnswers = iP1 ? g.player1_answers : g.player2_answers;
                const myTurn = g.phase !== "waiting" && myAnswers.length < g.questions.length;
                const statusLabel = g.phase === "waiting" ? "UNCLAIMED" : myTurn ? "YOUR TURN" : "WAITING ON OPPONENT";
                const statusColor = g.phase === "waiting" ? "var(--text-dim)" : myTurn ? "var(--gold)" : "var(--green)";
                return (
                  <div
                    key={g.id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      width: "100%",
                      padding: "8px 0",
                      borderBottom: "1px solid var(--panel-border)",
                      fontSize: 8,
                    }}
                  >
                    <button
                      onClick={() => router.push(`/game/${g.id}`)}
                      style={{ background: "transparent", border: "none", color: "var(--text)", cursor: "pointer", fontFamily: "inherit", fontSize: 8, textAlign: "left", padding: 0, flex: 1 }}
                    >
                      {myName?.toUpperCase() ?? "YOU"} vs {oppName?.toUpperCase() ?? "?"}
                    </button>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
                      <span style={{ color: statusColor }}>{statusLabel}</span>
                      <button
                        onClick={async (e) => {
                          e.stopPropagation();
                          if (g.phase === "waiting") {
                            await supabase.from("games").delete().eq("id", g.id).eq("phase", "waiting");
                            localStorage.removeItem(`trivia-kicks:${g.id}`);
                          } else {
                            const dismissed = JSON.parse(localStorage.getItem("tk-dismissed-games") ?? "[]") as string[];
                            if (!dismissed.includes(g.id)) {
                              localStorage.setItem("tk-dismissed-games", JSON.stringify([...dismissed, g.id]));
                            }
                          }
                          setOutstandingGames((prev) => prev.filter((x) => x.id !== g.id));
                        }}
                        style={{ background: "transparent", border: "none", color: "var(--text-dim)", cursor: "pointer", fontSize: 12, padding: "0 4px", lineHeight: 1 }}
                        title="Remove"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {mode === "vs-friend" && !waitingGameId && myGames.length > 0 && (
            <div style={{ fontSize: 8, color: "var(--text)", width: "100%", maxWidth: 460 }}>
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

          {/* Waiting for opponent */}
          {waitingGameId && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, maxWidth: 340, width: "100%", textAlign: "center" }}>
              <div style={{ fontSize: 12, color: "var(--gold)" }}>WAITING FOR OPPONENT...</div>
              <div style={{ fontSize: 8, color: "var(--text-dim)" }}>SHARE THIS LINK:</div>
              <div style={{ fontSize: 7, background: "var(--panel)", border: "2px solid var(--panel-border)", borderRadius: 6, padding: 12, wordBreak: "break-all", width: "100%" }}>
                {gameUrl}
              </div>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center" }}>
                <button onClick={() => navigator.clipboard.writeText(gameUrl)} style={ctaButtonStyle}>
                  COPY LINK
                </button>
                {typeof navigator !== "undefined" && "share" in navigator && (
                  <button onClick={() => navigator.share({ title: "Trivia Kicks", text: `Join my game!`, url: gameUrl })} style={ctaButtonStyle}>
                    SHARE
                  </button>
                )}
                <button onClick={() => window.open("/?mode=challenge", "_blank")} style={ctaButtonStyle}>
                  CREATE ANOTHER GAME
                </button>
              </div>
              <button
                onClick={async () => {
                  await supabase.from("games").delete().eq("id", waitingGameId).eq("phase", "waiting");
                  localStorage.removeItem(`trivia-kicks:${waitingGameId}`);
                  setWaitingGameId(null);
                }}
                style={{ fontSize: 8, background: "transparent", border: "none", color: "var(--text-dim)", cursor: "pointer", marginTop: 4 }}
              >
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

          {gamesPlayed !== null && (
            <p style={{ fontSize: 8, color: "var(--gold)" }}>
              {gamesPlayed.toLocaleString()} GAMES PLAYED
            </p>
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
