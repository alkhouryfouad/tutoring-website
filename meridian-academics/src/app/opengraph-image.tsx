import { ImageResponse } from "next/og";

export const alt =
  "Meridian Academics | Math & Science Tutoring in Oakville, ON";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#FAF7F2",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "60px",
        }}
      >
        {/* Logo mark */}
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: "50%",
            background: "#1B4332",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 32,
          }}
        >
          <span
            style={{
              color: "white",
              fontSize: 40,
              fontWeight: 700,
              fontFamily: "Georgia, serif",
              lineHeight: 1,
            }}
          >
            M
          </span>
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: 64,
            fontWeight: 700,
            color: "#1B4332",
            fontFamily: "Georgia, serif",
            textAlign: "center",
            lineHeight: 1.1,
            marginBottom: 16,
          }}
        >
          Meridian Academics
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: 28,
            color: "#5C6B5E",
            fontFamily: "sans-serif",
            textAlign: "center",
            marginBottom: 40,
          }}
        >
          Grade 9-12 Math & Science Tutoring - Oakville, ON
        </div>

        {/* 97% stat */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            background: "#1B4332",
            borderRadius: 16,
            padding: "24px 48px",
          }}
        >
          <span
            style={{
              fontSize: 56,
              fontWeight: 700,
              color: "#FAF7F2",
              fontFamily: "Georgia, serif",
              lineHeight: 1,
            }}
          >
            97%
          </span>
          <span
            style={{
              fontSize: 18,
              color: "#B7C9B7",
              fontFamily: "sans-serif",
              marginTop: 8,
            }}
          >
            Founder&apos;s Average
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
