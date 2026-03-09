import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "MacroTrackr - AI Nutrition Tracker";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          background: "linear-gradient(120deg, #0f172a 0%, #1d4ed8 45%, #7c3aed 100%)",
          color: "white",
          padding: "56px",
          fontFamily: "Inter, system-ui, sans-serif",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            borderRadius: 999,
            padding: "10px 18px",
            border: "1px solid rgba(255,255,255,0.35)",
            fontSize: 28,
            fontWeight: 700,
          }}
        >
          MacroTrackr
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18, maxWidth: 900 }}>
          <div style={{ fontSize: 76, fontWeight: 800, lineHeight: 1.05 }}>
            AI Nutrition Tracker
          </div>
          <div style={{ fontSize: 34, opacity: 0.95 }}>
            Log meals fast. Track macros clearly. Edit instantly.
          </div>
        </div>

        <div style={{ fontSize: 24, opacity: 0.9 }}>macrotrackr.vercel.app</div>
      </div>
    ),
    {
      ...size,
    },
  );
}
