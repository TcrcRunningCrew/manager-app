import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export function GET(
  _req: NextRequest,
  { params }: { params: { size: string } }
) {
  const size = params.size === "512" ? 512 : 192;
  const fontSize = size === 512 ? 140 : 52;
  const subFontSize = size === 512 ? 56 : 20;
  const circleSize = size * 0.72;

  return new ImageResponse(
    (
      <div
        style={{
          width: size,
          height: size,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0B0D10",
        }}
      >
        <div
          style={{
            width: circleSize,
            height: circleSize,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #1A1F27 0%, #0B0D10 100%)",
            border: `${size * 0.025}px solid #C8FF3E`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: size * 0.02,
          }}
        >
          <div
            style={{
              color: "#C8FF3E",
              fontSize: fontSize,
              fontWeight: 900,
              letterSpacing: "-0.03em",
              lineHeight: 1,
            }}
          >
            TCRC
          </div>
          <div
            style={{
              color: "#6B7480",
              fontSize: subFontSize,
              fontWeight: 600,
              letterSpacing: "0.1em",
            }}
          >
            러닝크루
          </div>
        </div>
      </div>
    ),
    { width: size, height: size }
  );
}
