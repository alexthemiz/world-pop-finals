"use client";

import { useEffect, useRef } from "react";
import { flagUrl } from "@/lib/countries";
import type { Question } from "@/lib/questions";

// FIFA Laws of the Game proportions, in meters.
const PITCH_W = 105;
const PITCH_H = 68;
const CENTER_CIRCLE_R = 9.15;
const PENALTY_AREA_W = 40.32;
const PENALTY_AREA_D = 16.5;
const SIX_YARD_W = 18.32;
const SIX_YARD_D = 5.5;
const PENALTY_SPOT_DIST = 11;
const PENALTY_ARC_R = 9.15;
const CORNER_ARC_R = 1;
const GOAL_W = 7.32;
const GOAL_DEPTH = 2;

interface PitchProps {
  question: Question;
  onAnswer: (country: string) => void;
  chosen: string | null;
  disabled?: boolean;
}

function drawPitch(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const scale = w / PITCH_W;
  const m = (v: number) => v * scale;

  ctx.clearRect(0, 0, w, h);

  // Grass stripes (vertical bands across the pitch).
  const stripeCount = 11;
  const stripeW = w / stripeCount;
  for (let i = 0; i < stripeCount; i++) {
    ctx.fillStyle = i % 2 === 0 ? "#2e8b3a" : "#277a32";
    ctx.fillRect(i * stripeW, 0, stripeW, h);
  }

  ctx.strokeStyle = "#f4f4f4";
  ctx.lineWidth = Math.max(1.5, m(0.12));
  ctx.lineCap = "round";

  // Touchline border.
  ctx.strokeRect(ctx.lineWidth / 2, ctx.lineWidth / 2, w - ctx.lineWidth, h - ctx.lineWidth);

  // Halfway line.
  ctx.beginPath();
  ctx.moveTo(m(PITCH_W / 2), 0);
  ctx.lineTo(m(PITCH_W / 2), h);
  ctx.stroke();

  // Center circle + spot.
  ctx.beginPath();
  ctx.arc(m(PITCH_W / 2), m(PITCH_H / 2), m(CENTER_CIRCLE_R), 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = "#f4f4f4";
  ctx.beginPath();
  ctx.arc(m(PITCH_W / 2), m(PITCH_H / 2), Math.max(2, m(0.2)), 0, Math.PI * 2);
  ctx.fill();

  const midY = PITCH_H / 2;

  // Penalty areas, six-yard boxes, spots, and arcs — once per end.
  [0, PITCH_W].forEach((goalX) => {
    const dir = goalX === 0 ? 1 : -1; // direction the box extends, into the field

    // Penalty area.
    ctx.strokeRect(
      m(goalX),
      m(midY - PENALTY_AREA_W / 2),
      m(PENALTY_AREA_D) * dir,
      m(PENALTY_AREA_W)
    );

    // Six-yard box.
    ctx.strokeRect(
      m(goalX),
      m(midY - SIX_YARD_W / 2),
      m(SIX_YARD_D) * dir,
      m(SIX_YARD_W)
    );

    // Penalty spot.
    const spotX = goalX + PENALTY_SPOT_DIST * dir;
    ctx.beginPath();
    ctx.arc(m(spotX), m(midY), Math.max(2, m(0.2)), 0, Math.PI * 2);
    ctx.fill();

    // Penalty arc — only the portion outside the penalty area.
    // theta = angle from the goal-to-center axis where the arc crosses the box edge.
    const boxEdgeX = goalX + PENALTY_AREA_D * dir;
    const adjacent = Math.abs(boxEdgeX - spotX);
    const theta = Math.acos(adjacent / PENALTY_ARC_R);
    const baseAngle = dir === 1 ? 0 : Math.PI; // direction pointing toward center
    ctx.beginPath();
    ctx.arc(m(spotX), m(midY), m(PENALTY_ARC_R), baseAngle - theta, baseAngle + theta);
    ctx.stroke();

    // Goal — drawn as a shallow rectangle just outside the touchline.
    ctx.strokeRect(
      goalX === 0 ? -m(GOAL_DEPTH) : w,
      m(midY - GOAL_W / 2),
      m(GOAL_DEPTH), // always extends outward, away from the pitch
      m(GOAL_W)
    );
  });

  // Corner arcs (quarter circles, radius 1m) at all four corners.
  const corners: [number, number, number, number][] = [
    [0, 0, 0, Math.PI / 2],
    [PITCH_W, 0, Math.PI / 2, Math.PI],
    [0, PITCH_H, -Math.PI / 2, 0],
    [PITCH_W, PITCH_H, Math.PI, (3 * Math.PI) / 2],
  ];
  corners.forEach(([cx, cy, start, end]) => {
    ctx.beginPath();
    ctx.arc(m(cx), m(cy), m(CORNER_ARC_R), start, end);
    ctx.stroke();
  });
}

export default function Pitch({ question, onAnswer, chosen, disabled }: PitchProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const resize = () => {
      const width = container.clientWidth;
      const height = (width * PITCH_H) / PITCH_W;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.scale(dpr, dpr);
      drawPitch(ctx, width, height);
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  const matchInfo = question.matchInfo;

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        width: "100%",
        maxWidth: 760,
        margin: "0 auto",
        border: "4px solid #0d2210",
        borderRadius: 4,
      }}
    >
      <canvas ref={canvasRef} style={{ display: "block", width: "100%" }} />

      {/* Top row: flags + names, group badge */}
      <div
        style={{
          position: "absolute",
          top: "3%",
          left: 0,
          right: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 4%",
        }}
      >
        <FlagLabel country={question.home} />
        <div
          style={{
            background: "rgba(0,0,0,0.6)",
            color: "var(--gold)",
            fontSize: 8,
            padding: "4px 6px",
            borderRadius: 4,
            border: "1px solid var(--gold)",
          }}
        >
          GROUP {question.group}
        </div>
        <FlagLabel country={question.away} reverse />
      </div>

      {/* Question band */}
      <div
        style={{
          position: "absolute",
          top: "20%",
          left: 0,
          right: 0,
          background: "rgba(0,0,0,0.78)",
          color: "var(--text)",
          textAlign: "center",
          padding: "8px 12px",
          fontSize: "clamp(7px, 1.6vw, 10px)",
          lineHeight: 1.8,
        }}
      >
        {question.questionText}
      </div>

      {/* Choice buttons, one per half of the field */}
      <div
        style={{
          position: "absolute",
          top: "52%",
          left: "28%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <ChoiceButton
          label={question.choiceA}
          isChosen={chosen === question.choiceA}
          isWinner={chosen !== null && question.winner === question.choiceA}
          disabled={!!disabled}
          handleClick={() => onAnswer(question.choiceA)}
        />
      </div>
      <div
        style={{
          position: "absolute",
          top: "52%",
          left: "72%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <ChoiceButton
          label={question.choiceB}
          isChosen={chosen === question.choiceB}
          isWinner={chosen !== null && question.winner === question.choiceB}
          disabled={!!disabled}
          handleClick={() => onAnswer(question.choiceB)}
        />
      </div>

      {/* Bottom strip: match info */}
      {matchInfo && (
        <div
          style={{
            position: "absolute",
            bottom: "3%",
            left: 0,
            right: 0,
            textAlign: "center",
            fontSize: "clamp(6px, 1.3vw, 8px)",
            color: matchInfo.type === "result" ? "var(--gold)" : "var(--text-dim)",
            background: "rgba(0,0,0,0.55)",
            padding: "4px 2px",
          }}
        >
          <div>{matchInfo.text}</div>
          <div style={{ marginTop: 2, opacity: 0.85 }}>{matchInfo.venue}</div>
        </div>
      )}
    </div>
  );
}

function FlagLabel({ country, reverse }: { country: string; reverse?: boolean }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: reverse ? "row-reverse" : "row",
        alignItems: "center",
        gap: 6,
        background: "rgba(0,0,0,0.55)",
        padding: "4px 6px",
        borderRadius: 4,
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={flagUrl(country)} width={28} height={19} alt={`${country} flag`} style={{ display: "block" }} />
    </div>
  );
}

function ChoiceButton({
  label,
  isChosen,
  isWinner,
  disabled,
  handleClick,
}: {
  label: string;
  isChosen: boolean;
  isWinner: boolean;
  disabled: boolean;
  handleClick: () => void;
}) {
  let bg = "rgba(10,14,20,0.85)";
  let border = "2px solid var(--gold)";
  if (isChosen && isWinner) {
    bg = "rgba(46,204,113,0.85)";
    border = "2px solid var(--green)";
  } else if (isChosen && !isWinner) {
    bg = "rgba(255,59,59,0.85)";
    border = "2px solid var(--red)";
  } else if (disabled && isWinner) {
    bg = "rgba(46,204,113,0.4)";
  }

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      style={{
        background: bg,
        border,
        color: "var(--text)",
        fontSize: "clamp(7px, 1.5vw, 9px)",
        padding: "10px 12px",
        borderRadius: 4,
        whiteSpace: "nowrap",
        opacity: disabled && !isChosen ? 0.6 : 1,
      }}
    >
      {label.toUpperCase()}
    </button>
  );
}
