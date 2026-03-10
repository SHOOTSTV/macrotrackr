import { ImageResponse } from "next/og";

export const alt = "MacroTrackr - OG B (bold)";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          background:
            "radial-gradient(circle at 20% 20%, #22d3ee 0%, transparent 35%), radial-gradient(circle at 80% 15%, #f472b6 0%, transparent 30%), linear-gradient(135deg, #111827 0%, #4f46e5 50%, #9333ea 100%)",
          color: "white",
          padding: "56px",
          fontFamily: "Inter, system-ui, sans-serif",
          flexDirection: "column",
          justifyContent: "space-between",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            borderRadius: 999,
            padding: "10px 18px",
            border: "1px solid rgba(255,255,255,0.45)",
            fontSize: 28,
            fontWeight: 800,
            background: "rgba(15, 23, 42, 0.35)",
          }}
        >
          MacroTrackr / fast tracking
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18, maxWidth: 920 }}>
          <div style={{ fontSize: 82, fontWeight: 900, lineHeight: 1.02 }}>
            Track Smarter With AI
          </div>
          <div style={{ fontSize: 34, opacity: 0.96 }}>
            Instant meal logs, clearer macros, faster progress.
          </div>
        </div>

        <div style={{ fontSize: 24, opacity: 0.92 }}>Version B - bold</div>
      </div>
    ),
    {
      ...size,
    },
  );
}

