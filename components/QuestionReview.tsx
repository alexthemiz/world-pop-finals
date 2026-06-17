import type { Question } from "@/lib/questions";
import { flagUrl } from "@/lib/countries";

interface Props {
  questions: Question[];
  answers: boolean[]; // player's answers (for single player) — optional
}

export default function QuestionReview({ questions, answers }: Props) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, width: "100%", maxWidth: 600, margin: "0 auto", textAlign: "left" }}>
      <div style={{ fontSize: 9, color: "var(--text-dim)", marginBottom: 4 }}>ANSWERS</div>
      {questions.map((q, i) => {
        const playerCorrect = answers.length > 0 ? answers[i] : null;
        return (
          <div
            key={i}
            style={{
              background: "var(--panel)",
              border: `2px solid ${playerCorrect === null ? "var(--panel-border)" : playerCorrect ? "var(--green)" : "var(--red)"}`,
              borderRadius: 6,
              padding: "12px 14px",
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            <div style={{ fontSize: 7, color: "var(--text-dim)" }}>Q{i + 1}</div>
            <div style={{ fontSize: 8, color: "var(--text)", lineHeight: 1.8 }}>
              {q.questionText}
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {([q.choiceA, q.choiceB] as string[]).map((choice) => {
                const isWinner = choice === q.winner || choice === q.winner;
                // For diaspora questions choiceA/B are arrow labels not country names
                const isDiaspora = q.questionType === "diaspora";
                const displayLabel = choice;
                const countryName = isDiaspora
                  ? (choice.split(" → ")[0])
                  : choice;
                const iso = !isDiaspora ? flagUrl(countryName) : null;

                return (
                  <div
                    key={choice}
                    style={{
                      flex: 1,
                      minWidth: 120,
                      background: isWinner ? "rgba(46,204,113,0.15)" : "rgba(255,59,59,0.12)",
                      border: `2px solid ${isWinner ? "var(--green)" : "var(--red)"}`,
                      borderRadius: 4,
                      padding: "8px 10px",
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    {iso && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={iso} width={22} height={15} alt="" style={{ flexShrink: 0 }} />
                    )}
                    <span style={{ fontSize: 7, color: "var(--text)" }}>
                      {displayLabel.toUpperCase()}
                    </span>
                  </div>
                );
              })}
            </div>
            <div style={{ fontSize: 7, color: "var(--text-dim)", lineHeight: 1.8 }}>
              {q.explanation}
            </div>
          </div>
        );
      })}
    </div>
  );
}
