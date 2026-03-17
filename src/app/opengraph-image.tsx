import { ImageResponse } from "next/og";

export const runtime = "edge";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          background:
            "radial-gradient(circle at 0% 0%, rgba(34, 199, 200, 0.35) 0%, rgba(255,255,255,0) 48%), radial-gradient(circle at 80% 10%, rgba(34, 199, 200, 0.18) 0%, rgba(255,255,255,0) 55%), linear-gradient(180deg, #ffffff 0%, #f6fbfb 100%)",
          color: "white",
          fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 28 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 14,
              background: "rgba(34, 199, 200, 0.18)",
              border: "1px solid rgba(34, 199, 200, 0.35)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 800,
              color: "#22c7c8",
            }}
          >
            AI
          </div>
          <div style={{ fontSize: 26, letterSpacing: -0.5, fontWeight: 900 }}>Bitlance AI</div>
        </div>

        <div style={{ fontSize: 64, lineHeight: 1.05, letterSpacing: -1.5, fontWeight: 900, color: "#071318" }}>
          AI Voice Agents
          <br />
          for sales & support
        </div>

        <div style={{ marginTop: 22, fontSize: 26, color: "rgba(7,19,24,0.65)", maxWidth: 920 }}>
          Answer calls instantly. Qualify leads. Book appointments. Sync WhatsApp + CRM.
        </div>

        <div style={{ marginTop: 34, display: "flex", gap: 12, flexWrap: "wrap" }}>
          {["<1s response", "99.9% uptime", "24/7 coverage"].map((t) => (
            <div
              key={t}
              style={{
                fontSize: 18,
                padding: "10px 14px",
                borderRadius: 999,
                background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(255,255,255,0.12)",
                color: "rgba(226,232,240,0.9)",
              }}
            >
              {t}
            </div>
          ))}
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}

