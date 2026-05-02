"use client";

interface LoginScreenProps {
  onLogin: () => void;
}

// 12개씩 반복된 콘텐츠를 두 번 렌더링 → seamless-marquee가 -50% 이동하여 끊김 없이 루프
function RunContent() {
  return (
    <>
      {Array.from({ length: 12 }).map((_, i) => (
        <span key={i} style={{ paddingRight: 32 }}>
          RUN RUN RUN
        </span>
      ))}
    </>
  );
}

function RunRow({ direction = "left", speed = 14 }: { direction?: "left" | "right"; speed?: number }) {
  return (
    <div
      style={{
        display: "inline-flex",
        whiteSpace: "nowrap",
        animation: `seamless-marquee ${speed}s linear infinite`,
        animationDirection: direction === "right" ? "reverse" : "normal",
        fontFamily: "var(--font-display)",
        fontStyle: "italic",
        fontSize: 56,
        letterSpacing: "-0.01em",
        lineHeight: 1,
        color: "#000",
      }}
    >
      <RunContent />
      <RunContent />
    </div>
  );
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  return (
    <div
      style={{
        background: "#000",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* 상단 — 크루 이름 */}
      <div style={{ padding: "60px 24px 0", position: "relative", zIndex: 2 }}>
        <div
          className="t-mono"
          style={{ color: "var(--tcrc-text-tertiary)", fontSize: 11, letterSpacing: "0.08em" }}
        >
          RUNNING CREW · SEONGNAM
        </div>
        <div
          className="t-display"
          style={{ fontSize: 56, color: "#fff", marginTop: 10, lineHeight: 0.92 }}
        >
          T.C.R.C
        </div>
        <div
          style={{
            fontWeight: 700,
            fontSize: 16,
            color: "var(--tcrc-text-secondary)",
            marginTop: 8,
          }}
        >
          러닝크루
        </div>
      </div>

      {/* 중단 — 대각선 마퀴 밴드 2개 */}
      <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
        {/* 밴드 1 — 왼쪽으로 / -10도 */}
        <div
          style={{
            position: "absolute",
            top: "40%",
            left: "50%",
            width: 720,
            transform: "translate(-50%, -50%) rotate(-10deg)",
            display: "flex",
            alignItems: "center",
            overflow: "hidden",
            background: "#fff",
            padding: "8px 0",
          }}
        >
          <RunRow direction="left" speed={14} />
        </div>

        {/* 밴드 2 — 오른쪽으로 / +10도 */}
        <div
          style={{
            position: "absolute",
            top: "65%",
            left: "50%",
            width: 720,
            transform: "translate(-50%, -50%) rotate(10deg)",
            display: "flex",
            alignItems: "center",
            overflow: "hidden",
            background: "#fff",
            padding: "8px 0",
          }}
        >
          <RunRow direction="right" speed={16} />
        </div>
      </div>

      {/* 하단 — 카카오 로그인 버튼 */}
      <div style={{ padding: "0 20px 40px", position: "relative", zIndex: 2 }}>
        <button
          onClick={onLogin}
          className="ios-button"
          style={{
            width: "100%",
            height: 52,
            background: "#FEE500",
            color: "#000",
            border: 0,
            borderRadius: "var(--card-radius)",
            fontFamily: "var(--font-body)",
            fontWeight: 700,
            fontSize: 15,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            cursor: "pointer",
          }}
        >
          {/* 카카오 말풍선 아이콘 */}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 4C6.5 4 2 7.6 2 12c0 2.8 1.9 5.3 4.7 6.7L5.5 22l4.2-2.5c.7.1 1.5.2 2.3.2 5.5 0 10-3.6 10-8S17.5 4 12 4z"
              fill="#000"
            />
          </svg>
          카카오로 시작하기
        </button>
      </div>
    </div>
  );
}
