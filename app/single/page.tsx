"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Pitch from "@/components/Pitch";
import ScoreBoard from "@/components/ScoreBoard";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import QuestionReview from "@/components/QuestionReview";
import { generateQuestions, type Question } from "@/lib/questions";
import { getAllMatchPairs } from "@/lib/matches";
import { SOURCES } from "@/lib/countries";
import { playCorrect, playWrong, playWin, playLose } from "@/lib/sounds";

export default function SinglePlayer() {
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [chosen, setChosen] = useState<string | null>(null);
  const resultSoundPlayed = useRef(false);

  useEffect(() => {
    setQuestions(generateQuestions(getAllMatchPairs()));
  }, []);

  const currentIndex = answers.length;
  const current = questions[currentIndex];
  const finished = questions.length > 0 && currentIndex >= questions.length;
  const score = useMemo(() => answers.filter(Boolean).length, [answers]);

  // Play win/lose sound once when results appear.
  useEffect(() => {
    if (finished && !resultSoundPlayed.current) {
      resultSoundPlayed.current = true;
      const passed = score >= Math.ceil(questions.length / 2);
      if (passed) playWin(); else playLose();
    }
  }, [finished, score, questions.length]);

  function handleAnswer(country: string) {
    if (chosen || !current) return;
    setChosen(country);
    const correct = country === current.winner;
    if (correct) playCorrect(); else playWrong();
    setTimeout(() => {
      setAnswers((prev) => [...prev, correct]);
      setChosen(null);
    }, 900);
  }

  if (finished) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <NavBar active="single" />
        <main style={{ flex: 1, display: "flex", justifyContent: "center", padding: 24 }}>
          <div style={{ maxWidth: 600, width: "100%", textAlign: "center" }}>
            <h1 style={{ color: "var(--gold)", fontSize: "clamp(16px, 4vw, 24px)", marginBottom: 16 }}>
              FULL TIME
            </h1>
            <p style={{ fontSize: 12, marginBottom: 20 }}>
              YOU SCORED {score} / {questions.length}
            </p>
            <ScoreBoard players={[{ name: "YOU", answers }]} totalQuestions={questions.length} />
            <div style={{ display: "flex", gap: 12, justifyContent: "center", margin: "20px 0" }}>
              <button onClick={() => window.location.assign("/single")} style={ctaButtonStyle}>
                PLAY AGAIN
              </button>
              <button onClick={() => router.push("/")} style={{ ...ctaButtonStyle, background: "transparent" }}>
                HOME
              </button>
            </div>
            <QuestionReview questions={questions} answers={answers} />
            <div style={{ textAlign: "left", fontSize: 7, color: "var(--text-dim)", marginTop: 24, lineHeight: 1.8 }}>
              <div style={{ marginBottom: 8 }}>SOURCES:</div>
              {SOURCES.map((s) => (
                <div key={s.url}>
                  <a href={s.url} target="_blank" rel="noreferrer">{s.label}</a>
                </div>
              ))}
              <p style={{ marginTop: 10 }}>Country data is approximate. Diaspora figures are estimates.</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <NavBar active="single" />
      <main style={{ flex: 1, padding: "20px 12px", display: "flex", flexDirection: "column", gap: 12 }}>
        {questions.length > 0 && (
          <div style={{ textAlign: "center", fontSize: 9, color: "var(--text-dim)" }}>
            QUESTION {currentIndex + 1} / {questions.length}
          </div>
        )}
        <ScoreBoard players={[{ name: "YOU", answers }]} totalQuestions={questions.length || 6} />
        {current && (
          <Pitch question={current} onAnswer={handleAnswer} chosen={chosen} disabled={!!chosen} />
        )}
        {chosen && current && (
          <div style={{ textAlign: "center", fontSize: 8, color: "var(--text-dim)" }}>
            {current.explanation}
          </div>
        )}
      </main>
      <Footer />
    </div>
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
