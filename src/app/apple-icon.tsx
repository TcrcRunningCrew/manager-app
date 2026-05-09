import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0B0D10",
        }}
      >
        <div
          style={{
            width: 140,
            height: 140,
            borderRadius: "50%",
            background: "#0B0D10",
            border: "4px solid #C8FF3E",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 3,
          }}
        >
          <div
            style={{
              color: "#C8FF3E",
              fontSize: 46,
              fontWeight: 900,
              letterSpacing: "-1px",
              lineHeight: 1,
            }}
          >
            TCRC
          </div>
          <div
            style={{
              color: "#6B7480",
              fontSize: 18,
              fontWeight: 600,
              letterSpacing: "2px",
            }}
          >
            러닝크루
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
