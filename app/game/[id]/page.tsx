"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase, type GameRow } from "@/lib/supabase";
import { generateQuestions, generateSuddenDeathQuestion } from "@/lib/questions";
import { getOrCreateUUID } from "@/lib/uuid";
import { getAllMatchPairs } from "@/lib/matches"; // still needed for generateQuestions on game create / play again
import { SOURCES } from "@/lib/countries";
import Pitch from "@/components/Pitch";
import ScoreBoard from "@/components/ScoreBoard";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import QuestionReview from "@/components/QuestionReview";
import { playCorrect, playWrong, playWin, playLose } from "@/lib/sounds";

type Slot = "player1" | "player2" | null;

function storageKey(id: string) {
  return `world-pop-finals:${id}`;
}

export default function GameRoom() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params.id;

  const [game, setGame] = useState<GameRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [pageUrl, setPageUrl] = useState("");
  const [notFound, setNotFound] = useState(false);
  const [slot, setSlot] = useState<Slot>(null);
  const [joinName, setJoinName] = useState("");
  const [joining, setJoining] = useState(false);
  const [chosen, setChosen] = useState<string | null>(null);
  const [answering, setAnswering] = useState(false);
  const resultSoundPlayed = useRef(false);
  const [questionStats, setQuestionStats] = useState<Record<string, { correct: number; total: number }>>({});

  const gameRef = useRef<GameRow | null>(null);
  gameRef.current = game;

  useEffect(() => {
    const stored = localStorage.getItem(storageKey(id));
    if (stored === "player1" || stored === "player2") setSlot(stored);
    setPageUrl(window.location.href);
  }, [id]);

  useEffect(() => {
    let active = true;
    async function load() {
      const { data, error } = await supabase.from("games").select("*").eq("id", id).single();
      if (!active) return;
      if (error || !data) {
        setNotFound(true);
      } else {
        setGame(data as GameRow);
      }
      setLoading(false);
    }
    load();
    return () => { active = false; };
  }, [id]);

  useEffect(() => {
    const channel = supabase
      .channel(`game-${id}`)
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "games", filter: `id=eq.${id}` },
        (payload) => { setGame(payload.new as GameRow); }
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [id]);

  useEffect(() => {
    if (game?.phase !== "finished") return;
    supabase.from("question_stats").select("*").then(({ data }) => {
      if (!data) return;
      const map: Record<string, { correct: number; total: number }> = {};
      data.forEach((r: { question_type: string; correct: number; total: number }) => {
        map[r.question_type] = { correct: r.correct, total: r.total };
      });
      setQuestionStats(map);
    });
  }, [game?.phase]);

  const maybeAdvancePhase = useCallback(async (row: GameRow) => {
    const total = row.questions.length;
    const p1Done = row.player1_answers.length >= total;
    const p2Done = row.player2_answers.length >= total;
    if (!p1Done || !p2Done) return;

    const p1Score = row.player1_answers.filter(Boolean).length;
    const p2Score = row.player2_answers.filter(Boolean).length;

    // In sudden death, check if the last question broke the tie.
    if (row.phase === "sudden_death") {
      const lastP1 = row.player1_answers[total - 1];
      const lastP2 = row.player2_answers[total - 1];
      if (lastP1 !== lastP2) {
        // One got it right, one didn't — game over.
        await Promise.all([
          supabase.rpc("increment_question_stats", {
            p_question_types: row.questions.map((q) => q.statKey),
            p_correct_flags: row.player1_answers,
          }),
          supabase.rpc("increment_question_stats", {
            p_question_types: row.questions.map((q) => q.statKey),
            p_correct_flags: row.player2_answers,
          }),
        ]);
        await supabase.from("games").update({ phase: "finished" }).eq("id", id).eq("phase", row.phase);
        return;
      }
      // Both right or both wrong — add one more question.
    } else if (p1Score !== p2Score) {
      // Main round: clear winner.
      await Promise.all([
        supabase.rpc("increment_question_stats", {
          p_question_types: row.questions.map((q) => q.statKey),
          p_correct_flags: row.player1_answers,
        }),
        supabase.rpc("increment_question_stats", {
          p_question_types: row.questions.map((q) => q.statKey),
          p_correct_flags: row.player2_answers,
        }),
      ]);
      await supabase.from("games").update({ phase: "finished" }).eq("id", id).eq("phase", row.phase);
      return;
    }

    // Tied — add one more question from the same match pair, or draw if exhausted.
    const newQ = generateSuddenDeathQuestion(row.questions);
    if (!newQ) {
      await Promise.all([
        supabase.rpc("increment_question_stats", {
          p_question_types: row.questions.map((q) => q.statKey),
          p_correct_flags: row.player1_answers,
        }),
        supabase.rpc("increment_question_stats", {
          p_question_types: row.questions.map((q) => q.statKey),
          p_correct_flags: row.player2_answers,
        }),
      ]);
      await supabase.from("games").update({ phase: "finished" }).eq("id", id).eq("phase", row.phase);
      return;
    }
    await supabase
      .from("games")
      .update({ questions: [...row.questions, newQ], round: row.round + 1, phase: "sudden_death" })
      .eq("id", id)
      .eq("phase", row.phase);
  }, [id]);

  async function handleJoin() {
    if (!joinName.trim()) return;
    setJoining(true);
    try {
      const { data, error } = await supabase
        .from("games")
        .update({ player2_name: joinName.trim(), player2_uuid: getOrCreateUUID(), phase: "active" })
        .eq("id", id)
        .is("player2_name", null)
        .select()
        .single();
      if (error) throw error;
      localStorage.setItem(storageKey(id), "player2");
      setSlot("player2");
      if (data) setGame(data as GameRow);
    } catch (e) {
      console.error(e);
    } finally {
      setJoining(false);
    }
  }

  async function handleAnswer(country: string) {
    const current = gameRef.current;
    if (!current || !slot || chosen || answering) return;
    const column = slot === "player1" ? "player1_answers" : "player2_answers";
    const myAnswers = slot === "player1" ? current.player1_answers : current.player2_answers;
    const index = myAnswers.length;
    const question = current.questions[index];
    if (!question) return;

    setChosen(country);
    setAnswering(true);
    const correct = country === question.winner;
    if (correct) playCorrect(); else playWrong();

    setTimeout(async () => {
      const newAnswers = [...myAnswers, correct];
      const { data } = await supabase
        .from("games")
        .update({ [column]: newAnswers })
        .eq("id", id)
        .select()
        .single();
      const freshRow = (data as GameRow) ?? { ...current, [column]: newAnswers };
      setGame(freshRow);
      setChosen(null);
      setAnswering(false);
      await maybeAdvancePhase(freshRow);
    }, 900);
  }

  async function handlePlayAgain() {
    const current = gameRef.current;
    if (!current || !slot) return;
    const myName = slot === "player1" ? current.player1_name : current.player2_name;
    const newId = Math.random().toString(36).slice(2, 9);
    const questions = generateQuestions(getAllMatchPairs());
    const { error } = await supabase.from("games").insert({
      id: newId, questions, player1_name: myName ?? "PLAYER 1", phase: "waiting", round: 1,
    });
    if (error) { console.error(error); return; }
    localStorage.setItem(storageKey(newId), "player1");
    router.push(`/game/${newId}`);
  }

  if (loading) return <CenteredMessage>LOADING...</CenteredMessage>;
  if (notFound || !game) return <CenteredMessage>GAME NOT FOUND</CenteredMessage>;

  if (slot === null && !game.player2_name) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <NavBar active="challenge" />
        <main style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14, width: 280, background: "var(--panel)", border: "3px solid var(--panel-border)", borderRadius: 6, padding: 20, textAlign: "center" }}>
            <div style={{ fontSize: 10, color: "var(--gold)" }}>
              JOIN {game.player1_name?.toUpperCase()}&apos;S GAME
            </div>
            <input
              value={joinName}
              onChange={(e) => setJoinName(e.target.value)}
              placeholder="YOUR NAME"
              maxLength={16}
              style={{ fontFamily: "var(--font-press-start), monospace", fontSize: 10, padding: 10, background: "#0a0e14", border: "2px solid var(--panel-border)", color: "var(--text)", borderRadius: 4 }}
            />
            <button onClick={handleJoin} disabled={joining} style={ctaButtonStyle}>
              {joining ? "JOINING..." : "JOIN GAME"}
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (slot === null) {
    return <CenteredMessage>SPECTATING — OPEN ON YOUR OWN DEVICE TO PLAY</CenteredMessage>;
  }

  if (game.phase === "waiting") {
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <NavBar active="challenge" />
        <main style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 24, textAlign: "center" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, maxWidth: 400, width: "100%" }}>
            <div style={{ fontSize: 12, color: "var(--gold)" }}>WAITING FOR OPPONENT...</div>
            <div style={{ fontSize: 8, color: "var(--text-dim)" }}>SHARE THIS LINK:</div>
            <div style={{ fontSize: 8, background: "var(--panel)", border: "2px solid var(--panel-border)", borderRadius: 6, padding: 12, wordBreak: "break-all", width: "100%" }}>
              {pageUrl}
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => navigator.clipboard.writeText(pageUrl)}
                style={ctaButtonStyle}
              >
                COPY LINK
              </button>
              {typeof navigator !== "undefined" && "share" in navigator && (
                <button
                  onClick={() => navigator.share({ title: "World Pop Finals", text: `Join my game on World Pop Finals!`, url: pageUrl })}
                  style={ctaButtonStyle}
                >
                  SHARE
                </button>
              )}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const myAnswers = slot === "player1" ? game.player1_answers : game.player2_answers;
  const oppAnswers = slot === "player1" ? game.player2_answers : game.player1_answers;
  const myName = (slot === "player1" ? game.player1_name : game.player2_name) ?? "YOU";
  const oppName = (slot === "player1" ? game.player2_name : game.player1_name) ?? "OPPONENT";

  if (game.phase === "finished") {
    const myScore = myAnswers.filter(Boolean).length;
    const oppScore = oppAnswers.filter(Boolean).length;
    const result = myScore > oppScore ? "YOU WIN!" : myScore < oppScore ? "YOU LOSE" : "DRAW";

    // Play sound once on mount of finished screen.
    if (!resultSoundPlayed.current) {
      resultSoundPlayed.current = true;
      setTimeout(() => { if (myScore >= oppScore) playWin(); else playLose(); }, 300);
    }

    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <NavBar active="challenge" />
        <main style={{ flex: 1, display: "flex", justifyContent: "center", padding: 24 }}>
          <div style={{ maxWidth: 600, width: "100%", textAlign: "center" }}>
            <h1 style={{ color: "var(--gold)", fontSize: "clamp(16px, 4vw, 24px)", marginBottom: 16 }}>{result}</h1>
            <p style={{ fontSize: 11, marginBottom: 20 }}>
              {myName.toUpperCase()} {myScore} — {oppScore} {oppName.toUpperCase()}
            </p>
            <ScoreBoard
              players={[{ name: myName, answers: myAnswers }, { name: oppName, answers: oppAnswers }]}
              totalQuestions={game.questions.length}
            />
            <div style={{ display: "flex", gap: 12, justifyContent: "center", margin: "20px 0", flexWrap: "wrap" }}>
              <button onClick={handlePlayAgain} style={ctaButtonStyle}>PLAY AGAIN</button>
              <button
                onClick={() => {
                  const text = `${result} ${myName.toUpperCase()} ${myScore}–${oppScore} ${oppName.toUpperCase()} · World Pop Finals`;
                  if ("share" in navigator) {
                    (navigator as Navigator & { share: (d: object) => void }).share({ title: "World Pop Finals", text, url: window.location.href });
                  } else {
                    (navigator as Navigator).clipboard.writeText(text);
                  }
                }}
                style={ctaButtonStyle}
              >
                SHARE
              </button>
              <button onClick={() => router.push("/")} style={{ ...ctaButtonStyle, background: "transparent" }}>HOME</button>
            </div>
            <QuestionReview questions={game.questions} answers={myAnswers} questionStats={questionStats} />
            <div style={{ textAlign: "left", fontSize: 7, color: "var(--text-dim)", marginTop: 24, lineHeight: 1.8 }}>
              <div style={{ marginBottom: 8 }}>SOURCES:</div>
              {SOURCES.map((s) => (
                <div key={s.url}><a href={s.url} target="_blank" rel="noreferrer">{s.label}</a></div>
              ))}
              <p style={{ marginTop: 10 }}>Country data is approximate. Diaspora figures are estimates.</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // active or sudden_death
  const myIndex = myAnswers.length;
  const currentQuestion = game.questions[myIndex];
  const waitingForNextRound = myIndex >= game.questions.length;

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <NavBar active="challenge" />
      <main style={{ flex: 1, padding: "20px 12px", display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ textAlign: "center", fontSize: 9, color: "var(--text-dim)" }}>
          {game.phase === "sudden_death" ? `SUDDEN DEATH · ROUND ${game.round}` : `ROUND ${game.round}`}
        </div>
        <ScoreBoard
          players={[{ name: myName, answers: myAnswers }, { name: oppName, answers: oppAnswers }]}
          totalQuestions={game.questions.length}
        />
        {currentQuestion && !waitingForNextRound ? (
          <>
            <Pitch question={currentQuestion} onAnswer={handleAnswer} chosen={chosen} disabled={!!chosen || answering} />
            {chosen && (
              <div style={{ textAlign: "center", fontSize: 8, color: "var(--text-dim)" }}>
                {currentQuestion.explanation}
              </div>
            )}
          </>
        ) : (
          <CenteredMessage>WAITING FOR {oppName.toUpperCase()}...</CenteredMessage>
        )}
      </main>
      <Footer />
    </div>
  );
}

function CenteredMessage({ children }: { children: React.ReactNode }) {
  return (
    <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, textAlign: "center", fontSize: 11, color: "var(--text-dim)" }}>
      {children}
    </main>
  );
}

const ctaButtonStyle = {
  fontSize: 10,
  padding: "12px 20px",
  background: "var(--panel)",
  border: "3px solid var(--gold)",
  color: "var(--text)",
  borderRadius: 6,
  cursor: "pointer",
};
