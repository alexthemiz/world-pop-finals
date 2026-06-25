import { ImageResponse } from "next/og";
import { supabase } from "@/lib/supabase";
import { ISO_CODES } from "@/lib/countries";

export const runtime = "edge";
export const alt = "World Pop Finals matchup";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

function flagUrl(country: string): string | null {
  const code = ISO_CODES[country];
  return code ? `https://flagcdn.com/h240/${code}.png` : null;
}

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { data } = await supabase.from("games").select("questions").eq("id", id).single();
  const q = data?.questions?.[0];
  const home: string | null = q?.home ?? null;
  const away: string | null = q?.away ?? null;
  const homeFlag = home ? flagUrl(home) : null;
  const awayFlag = away ? flagUrl(away) : null;

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
          gap: 32,
        }}
      >
        {home && away ? (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: 40 }}>
              {homeFlag && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={homeFlag} width={180} height={120} style={{ borderRadius: 8 }} alt={home} />
              )}
              <div style={{ color: "#f5c518", fontSize: 56, fontWeight: "bold" }}>VS</div>
              {awayFlag && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={awayFlag} width={180} height={120} style={{ borderRadius: 8 }} alt={away} />
              )}
            </div>
            <div style={{ color: "#fff", fontSize: 64, fontWeight: "bold", letterSpacing: 2, display: "flex" }}>
              {home.toUpperCase()} VS {away.toUpperCase()}
            </div>
          </>
        ) : (
          <div style={{ fontSize: 160, lineHeight: 1, display: "flex" }}>⚽</div>
        )}
        <div style={{ color: "#f5c518", fontSize: 40, fontWeight: "bold", letterSpacing: 4, display: "flex" }}>
          WORLD POP FINALS
        </div>
      </div>
    ),
    { ...size }
  );
}
