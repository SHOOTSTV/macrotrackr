import { ImageResponse } from "next/og";

export const runtime = "edge";
export const contentType = "image/png";
export const size = { width: 1200, height: 630 };

function StatPill({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 6,
        padding: "12px 16px",
        borderRadius: 16,
        border: "1px solid rgba(255,255,255,0.22)",
        background: "rgba(255,255,255,0.08)",
        minWidth: 150,
      }}
    >
      <div style={{ fontSize: 20, opacity: 0.8 }}>{label}</div>
      <div style={{ fontSize: 34, fontWeight: 800 }}>{value}</div>
    </div>
  );
}

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 64,
          color: "#F8FAFC",
          background:
            "radial-gradient(circle at 15% 20%, rgba(56,189,248,0.35), transparent 35%), radial-gradient(circle at 85% 15%, rgba(168,85,247,0.25), transparent 40%), linear-gradient(135deg, #0f172a 0%, #1d4ed8 45%, #6d28d9 100%)",
          fontFamily:
            'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial',
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            borderRadius: 999,
            padding: "10px 18px",
            border: "1px solid rgba(255,255,255,0.35)",
            fontSize: 24,
            fontWeight: 700,
            background: "rgba(2,6,23,0.35)",
          }}
        >
          MacroTrackr • AI-first tracking
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18, maxWidth: 980 }}>
          <div style={{ fontSize: 78, fontWeight: 900, lineHeight: 1.02 }}>
            Track Nutrition Without Friction
          </div>
          <div style={{ fontSize: 32, opacity: 0.95 }}>
            Log meals in seconds, monitor macros clearly, and keep momentum every day.
          </div>
        </div>

        <div style={{ display: "flex", gap: 14 }}>
          <StatPill label="Add meal" value="&lt; 30s" />
          <StatPill label="Edit" value="Instant" />
          <StatPill label="Dashboard" value="Clear" />
        </div>

        <div style={{ fontSize: 22, opacity: 0.88 }}>macrotrackr.vercel.app</div>
      </div>
    ),
    { ...size },
  );
}
