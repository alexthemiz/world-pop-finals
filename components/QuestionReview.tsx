"use client";

import { useState } from "react";
import type { Question } from "@/lib/questions";
import { flagUrl } from "@/lib/countries";

interface Props {
  questions: Question[];
  answers: boolean[];
  questionStats?: Record<string, { correct: number; total: number }>;
}

export default function QuestionReview({ questions, answers, questionStats }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div style={{ display: "flex", flexDirection: "column", width: "100%", maxWidth: 600, margin: "0 auto", textAlign: "left" }}>
      <div style={{ fontSize: 9, color: "var(--text-dim)", marginBottom: 10 }}>ANSWERS</div>
      {questions.map((q, i) => {
        const correct = answers[i] ?? null;
        const isOpen = openIndex === i;
        const isDiaspora = q.questionType === "diaspora";
        const winnerCountry = isDiaspora ? q.winner.split(" → ")[0] : q.winner;
        const stat = questionStats?.[q.statKey];

        return (
          <div key={i} style={{ borderBottom: "1px solid var(--panel-border)" }}>
            <button
              onClick={() => setOpenIndex(isOpen ? null : i)}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "11px 4px",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              <span style={{ fontSize: 10, color: correct ? "var(--green)" : "var(--red)", flexShrink: 0, width: 14 }}>
                {correct ? "✓" : "✗"}
              </span>
              <span style={{ fontSize: 7, color: "var(--text)", lineHeight: 1.8, flex: 1 }}>
                {q.questionText}
              </span>
              <span style={{
                fontSize: 8,
                color: "var(--text-dim)",
                flexShrink: 0,
                transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.15s",
                display: "inline-block",
              }}>▼</span>
            </button>

            {isOpen && (
              <div style={{ padding: "4px 4px 14px 24px", display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  {!isDiaspora && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={flagUrl(winnerCountry)} width={22} height={15} alt="" />
                  )}
                  <span style={{ fontSize: 7, color: "var(--gold)" }}>
                    {q.winner.toUpperCase()}
                  </span>
                </div>
                <div style={{ fontSize: 7, color: "var(--text-dim)", lineHeight: 1.8 }}>
                  {q.explanation}
                </div>
                {stat && stat.total > 0 && (
                  <div style={{ fontSize: 7, color: "var(--text-dim)" }}>
                    {Math.round((stat.correct / stat.total) * 100)}% OF PLAYERS GOT THIS RIGHT
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
