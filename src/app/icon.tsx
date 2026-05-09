import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0B0D10",
          borderRadius: 8,
          border: "1.5px solid #C8FF3E",
        }}
      >
        <div
          style={{
            color: "#C8FF3E",
            fontSize: 10,
            fontWeight: 900,
            letterSpacing: "-0.5px",
          }}
        >
          TC
        </div>
        <div
          style={{
            color: "#fff",
            fontSize: 10,
            fontWeight: 900,
            letterSpacing: "-0.5px",
          }}
        >
          RC
        </div>
      </div>
    ),
    { ...size }
  );
}
