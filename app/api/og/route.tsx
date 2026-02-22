import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";
import { utilitiesBySlug } from "@/lib/generated/utilities-index";

export const runtime = "edge";

const imageSize = {
  width: 1200,
  height: 630,
};

export async function GET(request: NextRequest) {
  const utilitySlug = request.nextUrl.searchParams.get("utility");
  const utility = utilitySlug ? utilitiesBySlug.get(utilitySlug) : undefined;

  const title = utility ? utility.title : "Essential developer tools";
  const subtitle = utility
    ? utility.description
    : "Fast, free, and practical tools for everyday coding work.";
  const badge = utility ? utility.category : "Developer Utilities";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "56px",
          background:
            "radial-gradient(circle at 20% 10%, #2f3f66 0%, #111827 45%, #030712 100%)",
          color: "#f9fafb",
          fontFamily:
            "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica Neue, Arial",
        }}
      >
        <div
          style={{
            display: "flex",
            width: "100%",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
              fontSize: 34,
              fontWeight: 700,
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: "linear-gradient(135deg, #38bdf8, #22d3ee)",
              }}
            />
            utilities.dev
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              background: "rgba(148, 163, 184, 0.2)",
              border: "1px solid rgba(148, 163, 184, 0.4)",
              padding: "8px 16px",
              borderRadius: 9999,
              fontSize: 22,
              color: "#d1d5db",
            }}
          >
            {badge}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div
            style={{
              fontSize: utility ? 78 : 72,
              lineHeight: 1.1,
              fontWeight: 800,
              letterSpacing: "-0.03em",
              maxWidth: "1000px",
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: 32,
              lineHeight: 1.35,
              color: "#cbd5e1",
              maxWidth: "1020px",
            }}
          >
            {subtitle}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 24,
            color: "#cbd5e1",
          }}
        >
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: "#22d3ee",
              }}
            />
            Free developer tools
          </div>
          <div>utilities.dev</div>
        </div>
      </div>
    ),
    imageSize
  );
}
