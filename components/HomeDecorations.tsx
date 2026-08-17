"use client";

// All 48 WC 2026 nations — ISO codes for flagcdn.com
const FLAG_CODES = [
  "us","mx","ca","br","ar","fr","de","es","pt","nl","be","gb-eng",
  "it","hr","pl","ch","ua","at","ro","hu","si","al","ge","sk","cz",
  "gb-sct","tr","kz","ma","sn","ng","cm","eg","za","ci","tn","ml",
  "cd","jp","kr","au","sa","ir","id","cn","nz","uy","co","ec","bo",
  "cl","py","ve",
];

export function FlagTicker({ direction }: { direction: "left" | "right" }) {
  const animName = direction === "left" ? "tk-scroll-left" : "tk-scroll-right";
  const items = [...FLAG_CODES, ...FLAG_CODES];
  return (
    <div style={{ position: "fixed", left: 0, right: 0, zIndex: 10, overflow: "hidden", background: "rgba(0,0,0,0.7)", borderTop: "1px solid rgba(255,255,255,0.07)", borderBottom: "1px solid rgba(255,255,255,0.07)", padding: "5px 0", ...(direction === "left" ? { top: 0 } : { bottom: 0 }) }}>
      <div style={{ display: "inline-flex", alignItems: "center", gap: 12, animation: `${animName} 40s linear infinite`, paddingRight: 12 }}>
        {items.map((code, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={i} src={`https://flagcdn.com/32x24/${code}.png`} width={32} height={24} alt={code} style={{ display: "block", imageRendering: "pixelated" }} />
        ))}
      </div>
    </div>
  );
}

export function PitchBackground() {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 0, overflow: "hidden", pointerEvents: "none" }}>
      {/* Grass stripes */}
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} style={{ position: "absolute", top: 0, bottom: 0, left: `${i * 10}%`, width: "10%", background: i % 2 === 0 ? "#1a3d1a" : "#1e4a1e" }} />
      ))}
      {/* Pitch outline */}
      <div style={{ position: "absolute", top: "8%", bottom: "8%", left: "5%", right: "5%", border: "2px solid rgba(255,255,255,0.12)", borderRadius: 2 }} />
      {/* Halfway line */}
      <div style={{ position: "absolute", top: "8%", bottom: "8%", left: "50%", width: 2, background: "rgba(255,255,255,0.12)", transform: "translateX(-50%)" }} />
      {/* Center circle */}
      <div style={{ position: "absolute", top: "50%", left: "50%", width: 140, height: 140, border: "2px solid rgba(255,255,255,0.12)", borderRadius: "50%", transform: "translate(-50%, -50%)" }} />
      {/* Center spot */}
      <div style={{ position: "absolute", top: "50%", left: "50%", width: 6, height: 6, background: "rgba(255,255,255,0.2)", borderRadius: "50%", transform: "translate(-50%, -50%)" }} />
      {/* Left penalty box */}
      <div style={{ position: "absolute", top: "30%", bottom: "30%", left: "5%", width: "14%", border: "2px solid rgba(255,255,255,0.09)", borderLeft: "none" }} />
      {/* Right penalty box */}
      <div style={{ position: "absolute", top: "30%", bottom: "30%", right: "5%", width: "14%", border: "2px solid rgba(255,255,255,0.09)", borderRight: "none" }} />
      {/* Dark vignette overlay so content stays readable */}
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at center, rgba(10,14,20,0.55) 0%, rgba(10,14,20,0.82) 100%)" }} />
    </div>
  );
}
