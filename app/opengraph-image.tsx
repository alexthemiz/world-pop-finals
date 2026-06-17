import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "World Pop Finals";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#0a0e14",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 24,
        }}
      >
        <div style={{ fontSize: 160, lineHeight: 1 }}>⚽</div>
        <div style={{ color: "#f5c518", fontSize: 72, fontWeight: "bold", letterSpacing: 4 }}>
          WORLD POP FINALS
        </div>
        <div style={{ color: "#666", fontSize: 28, letterSpacing: 6 }}>
          COUNTRY TRIVIA SHOOTOUT
        </div>
      </div>
    ),
    { ...size }
  );
}
