"use client";

interface PlayerRow {
  name: string;
  answers: boolean[];
}

interface ScoreBoardProps {
  players: PlayerRow[]; // 1 entry for single player, 2 for vs. friend
  totalQuestions: number;
}

function Dot({ state }: { state: "pending" | "correct" | "wrong" }) {
  const color =
    state === "correct" ? "var(--green)" : state === "wrong" ? "var(--red)" : "#2a3550";
  const border = state === "pending" ? "2px solid #44507a" : "2px solid #000";
  return (
    <div
      style={{
        width: 16,
        height: 16,
        borderRadius: "50%",
        background: color,
        border,
        boxShadow: state !== "pending" ? "0 0 4px rgba(0,0,0,0.5) inset" : "none",
      }}
    />
  );
}

/**
 * Dot capacity for challenge mode: starts at 5 (the main round), then
 * reserves progressively bigger blocks (+5, +10, +20, ...) once sudden
 * death pushes the real question count past the current capacity.
 */
function dotsCapacity(actual: number): number {
  let total = 5;
  let increment = 5;
  while (actual > total) {
    total += increment;
    increment *= 2;
  }
  return total;
}

export default function ScoreBoard({ players, totalQuestions }: ScoreBoardProps) {
  // Single player has no sudden death and can legitimately have fewer than
  // the usual question count (a match pair might not support that many
  // distinct stat types), so only extend capacity for 2-player games.
  const dotsTotal = players.length === 2 ? dotsCapacity(totalQuestions) : totalQuestions;

  return (
    <div
      style={{
        background: "var(--panel)",
        border: "3px solid var(--panel-border)",
        borderRadius: 6,
        padding: "10px 14px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 10,
        width: "100%",
        maxWidth: 700,
        margin: "0 auto 12px",
      }}
    >
      {players.map((p, idx) => {
        const score = p.answers.filter(Boolean).length;
        return (
          <div
            key={idx}
            style={{
              display: "grid",
              gridTemplateColumns: "110px auto 40px",
              alignItems: "center",
              gap: 10,
              width: "fit-content",
            }}
          >
            <div style={{ fontSize: 9, color: "var(--text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {p.name || (players.length === 1 ? "YOU" : `PLAYER ${idx + 1}`)}
            </div>
            <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
              {Array.from({ length: dotsTotal }).map((_, i) => {
                const answered = i < p.answers.length;
                const correct = p.answers[i];
                return (
                  <Dot key={i} state={!answered ? "pending" : correct ? "correct" : "wrong"} />
                );
              })}
            </div>
            <div style={{ fontSize: 10, color: "var(--gold)", textAlign: "right" }}>
              {score}/{totalQuestions}
            </div>
          </div>
        );
      })}
    </div>
  );
}
