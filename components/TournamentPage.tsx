"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase, type GameRow } from "@/lib/supabase";
import { generateQuestions } from "@/lib/questions";
import { getOrCreateUUID } from "@/lib/uuid";
import { subscribeToGamePush, isPushSupported } from "@/lib/push";
import Footer from "@/components/Footer";
import type { TournamentConfig } from "@/lib/tournaments/types";

function makeGameId(): string {
  return Math.random().toString(36).slice(2, 9);
}

function pickerSelectStyle(active: boolean): CSSProperties {
  return {
    fontFamily: "var(--font-press-start), monospace",
    fontSize: 8,
    padding: "9px 10px",
    background: "#0a0e14",
    border: `2px solid ${active ? "var(--gold)" : "var(--panel-border)"}`,
    color: "var(--text)",
    borderRadius: 4,
    width: "100%",
    cursor: "pointer",
  };
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

interface TournamentPageProps {
  config: TournamentConfig;
}

export default function TournamentPage({ config }: TournamentPageProps) {
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
  const [pickerMode, setPickerMode] = useState<"random" | "knockout" | "group" | "custom">("random");
  const [pickedKnockout, setPickedKnockout] = useState("");
  const [pickedGroupMatch, setPickedGroupMatch] = useState("");
  const [customHome, setCustomHome] = useState("");
  const [customAway, setCustomAway] = useState("");
  const [waitingGameId, setWaitingGameId] = useState<string | null>(null);
  const [gameUrl, setGameUrl] = useState("");
  const [gamesPlayed, setGamesPlayed] = useState<number | null>(null);
  const [notifyState, setNotifyState] = useState<"idle" | "on" | "blocked">("idle");
  const [outstandingGames, setOutstandingGames] = useState<GameRow[]>([]);

  const allPairs = config.groups.map((m) => ({ home: m.home, away: m.away, group: m.group }));
  const knockoutPairs = config.knockout.map((m) => ({ home: m.home, away: m.away, group: m.group }));
  const countryNames = [...config.nations].sort();

  const groupedMatches: Record<string, typeof allPairs> = {};
  allPairs.forEach((p) => {
    if (!groupedMatches[p.group]) groupedMatches[p.group] = [];
    groupedMatches[p.group].push(p);
  });
  const groups = Object.keys(groupedMatches).sort();

  const groupedKnockout: Record<string, typeof knockoutPairs> = {};
  knockoutPairs.forEach((p) => {
    if (!groupedKnockout[p.group]) groupedKnockout[p.group] = [];
    groupedKnockout[p.group].push(p);
  });

  function getMatchPairs() {
    if (pickerMode === "knockout" && pickedKnockout) {
      const [home, away] = pickedKnockout.split("|");
      const pair = knockoutPairs.find((p) => p.home === home && p.away === away);
      if (pair) return [pair];
    } else if (pickerMode === "group" && pickedGroupMatch) {
      const [home, away] = pickedGroupMatch.split("|");
      const pair = allPairs.find((p) => p.home === home && p.away === away);
      if (pair) return [pair];
    } else if (pickerMode === "custom" && customHome && customAway) {
      return [{ home: customHome, away: customAway, group: "" }];
    }
    return allPairs;
  }

  function selectRandom() {
    setPickerMode("random");
    setPickedKnockout("");
    setPickedGroupMatch("");
    setCustomHome("");
    setCustomAway("");
  }

  function selectKnockout(value: string) {
    setPickedKnockout(value);
    setPickedGroupMatch("");
    setCustomHome("");
    setCustomAway("");
    setPickerMode(value ? "knockout" : "random");
  }

  function selectGroupMatch(value: string) {
    setPickedGroupMatch(value);
    setPickedKnockout("");
    setCustomHome("");
    setCustomAway("");
    setPickerMode(value ? "group" : "random");
  }

  function selectCustomHome(value: string) {
    setCustomHome(value);
    setPickedKnockout("");
    setPickedGroupMatch("");
    setPickerMode("custom");
  }

  function selectCustomAway(value: string) {
    setCustomAway(value);
    setPickedKnockout("");
    setPickedGroupMatch("");
    setPickerMode("custom");
  }

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
      const questions = generateQuestions(getMatchPairs(), undefined, 5);
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

  const finalsKey = config.finalsMatch ? `${config.finalsMatch.home}|${config.finalsMatch.away}` : null;

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
          {/* Back link + tournament header */}
          <div>
            <div style={{ marginBottom: 4 }}>
              <a href="/" style={{ fontSize: 9, color: "var(--gold)", textDecoration: "none" }}>◀ TRIVIA KICKS</a>
            </div>
            <div style={{ fontSize: 16, color: "var(--gold)", letterSpacing: 2 }}>{config.emoji} {config.name.toUpperCase()}</div>
            <div style={{ fontSize: 8, color: "var(--text-dim)", marginBottom: 4 }}>{config.hosts} · {config.year}</div>
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

          {/* Finals quick-pick */}
          {config.finalsMatch && finalsKey && (
            <button
              onClick={() => selectKnockout(finalsKey)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 18px",
                background: pickerMode === "knockout" && pickedKnockout === finalsKey ? "rgba(255,200,0,0.15)" : "#0a0e14",
                border: `2px solid ${pickerMode === "knockout" && pickedKnockout === finalsKey ? "var(--gold)" : "var(--panel-border)"}`,
                borderRadius: 6,
                cursor: "pointer",
                color: "var(--text)",
              }}
            >
              <span style={{ fontSize: 8, color: "var(--gold)", whiteSpace: "nowrap" }}>⚽ THE FINAL ⚽</span>
              <span style={{ fontSize: 8, color: "var(--text)" }}>{config.finalsMatch.home.toUpperCase()} vs {config.finalsMatch.away.toUpperCase()}</span>
            </button>
          )}

          {/* Match picker */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%", maxWidth: 460 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 22, width: "100%" }}>
              <div>
                <div style={{ fontSize: 8, color: "var(--text)", marginBottom: 10 }}>SELECT A MATCH FROM THE {config.name.toUpperCase()}</div>
                <div style={{ display: "flex", gap: 8, width: "100%", flexWrap: "wrap", maxWidth: 440 }}>
                  <select
                    value={pickedKnockout}
                    onChange={(e) => selectKnockout(e.target.value)}
                    style={{ ...pickerSelectStyle(pickerMode === "knockout"), width: "calc(50% - 4px)", minWidth: 140 }}
                  >
                    <option value="">— KNOCKOUT STAGE —</option>
                    {config.knockoutRounds.map((round) => (
                      <optgroup key={round} label={`── ${round.toUpperCase()} ──`}>
                        {(groupedKnockout[round] ?? []).map((p) => (
                          <option key={`${p.home}|${p.away}`} value={`${p.home}|${p.away}`}>
                            {p.home.toUpperCase()} vs {p.away.toUpperCase()}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                  <select
                    value={pickedGroupMatch}
                    onChange={(e) => selectGroupMatch(e.target.value)}
                    style={{ ...pickerSelectStyle(pickerMode === "group"), width: "calc(50% - 4px)", minWidth: 140 }}
                  >
                    <option value="">— GROUP STAGE —</option>
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
              </div>

              <div>
                <div style={{ fontSize: 8, color: "var(--text)", marginBottom: 10 }}>OR PICK YOUR TWO {config.name.toUpperCase()} PARTICIPANTS</div>
                <div style={{ display: "flex", gap: 8, width: "100%", flexWrap: "wrap", maxWidth: 440 }}>
                  <select
                    value={customHome}
                    onChange={(e) => selectCustomHome(e.target.value)}
                    style={{ ...pickerSelectStyle(pickerMode === "custom"), width: "calc(50% - 4px)", minWidth: 140 }}
                  >
                    <option value="">— COUNTRY 1 —</option>
                    {countryNames.filter((c) => c !== customAway).map((c) => (
                      <option key={c} value={c}>{c.toUpperCase()}</option>
                    ))}
                  </select>
                  <select
                    value={customAway}
                    onChange={(e) => selectCustomAway(e.target.value)}
                    style={{ ...pickerSelectStyle(pickerMode === "custom"), width: "calc(50% - 4px)", minWidth: 140 }}
                  >
                    <option value="">— COUNTRY 2 —</option>
                    {countryNames.filter((c) => c !== customHome).map((c) => (
                      <option key={c} value={c}>{c.toUpperCase()}</option>
                    ))}
                  </select>
                </div>
              </div>

              {pickerMode !== "random" && (
                <button
                  onClick={selectRandom}
                  style={{ fontSize: 8, background: "transparent", border: "none", color: "var(--text)", cursor: "pointer", padding: 0, textDecoration: "underline", fontFamily: "inherit" }}
                >
                  CLEAR — USE RANDOM MATCHUP
                </button>
              )}
              {pickerMode === "random" && (
                <div style={{ fontSize: 8, color: "var(--text)" }}>NO SELECTION = RANDOM MATCHUP</div>
              )}
            </div>
          </div>

          {/* Single player */}
          {mode === "single" && (
            <button
              onClick={() => {
                const pairs = getMatchPairs();
                if (pickerMode !== "random" && pairs.length === 1) {
                  const pair = pairs[0];
                  router.push(`/single?home=${encodeURIComponent(pair.home)}&away=${encodeURIComponent(pair.away)}`);
                  return;
                }
                router.push("/single");
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
