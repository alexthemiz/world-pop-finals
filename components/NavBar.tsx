"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NavBar({ active }: { active: "single" | "challenge" | null }) {
  const router = useRouter();
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
      <Link
        href="/"
        style={{ fontSize: 9, color: "var(--gold)", textDecoration: "none" }}
      >
        ◀ WORLD POP FINALS
      </Link>
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
    </div>
  );
}
