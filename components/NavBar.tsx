"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getMuted, setMuted, initMuted } from "@/lib/sounds";

export default function NavBar({ active }: { active: "single" | "challenge" | null }) {
  const router = useRouter();
  const [muted, setMutedState] = useState(false);

  useEffect(() => {
    initMuted();
    setMutedState(getMuted());
  }, []);

  function toggleMute() {
    const next = !muted;
    setMuted(next);
    setMutedState(next);
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "10px 16px",
        background: "var(--panel)",
        borderBottom: "2px solid var(--panel-border)",
        flexWrap: "wrap",
        gap: 8,
      }}
    >
      <Link href="/" style={{ fontSize: 9, color: "var(--gold)", textDecoration: "none" }}>
        ◀ WORLD POP FINALS
      </Link>

      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ display: "flex", gap: 0, background: "#0a0e14", border: "2px solid var(--panel-border)", borderRadius: 4, overflow: "hidden" }}>
          {(["single", "challenge"] as const).map((m) => (
            <button
              key={m}
              onClick={() => router.push(m === "single" ? "/single" : "/?mode=challenge")}
              style={{
                fontSize: 8,
                padding: "7px 12px",
                background: active === m ? "var(--gold)" : "transparent",
                color: active === m ? "#000" : "var(--text-dim)",
                border: "none",
                cursor: "pointer",
              }}
            >
              {m === "single" ? "SINGLE" : "CHALLENGE"}
            </button>
          ))}
        </div>

        <button
          onClick={toggleMute}
          title={muted ? "Unmute" : "Mute"}
          style={{
            background: "transparent",
            border: "2px solid var(--panel-border)",
            borderRadius: 4,
            color: muted ? "var(--text-dim)" : "var(--text)",
            fontSize: 14,
            padding: "4px 8px",
            cursor: "pointer",
            lineHeight: 1,
          }}
        >
          {muted ? "🔇" : "🔊"}
        </button>
      </div>
    </div>
  );
}
