"use client";

import { useEffect, useState } from "react";

// 인앱브라우저 감지: 카카오톡/페이스북/인스타/네이버/라인 등 OAuth 콜백이 자주 깨지는 환경
function detectInApp(): { isInApp: boolean; isKakao: boolean; isAndroid: boolean } {
  if (typeof navigator === "undefined") {
    return { isInApp: false, isKakao: false, isAndroid: false };
  }
  const ua = navigator.userAgent;
  const isKakao = /KAKAOTALK/i.test(ua);
  const isInstagram = /Instagram/i.test(ua);
  const isFacebook = /FB(AN|AV|_IAB)/i.test(ua);
  const isLine = /Line/i.test(ua);
  const isNaver = /NAVER\(inapp|naver\(inapp/i.test(ua);
  const isInApp = isKakao || isInstagram || isFacebook || isLine || isNaver;
  const isAndroid = /Android/i.test(ua);
  return { isInApp, isKakao, isAndroid };
}

function openExternalBrowser(targetUrl: string, info: ReturnType<typeof detectInApp>) {
  const { isKakao, isAndroid } = info;

  if (isKakao) {
    // 카카오톡의 외부 브라우저 인텐트
    window.location.href = `kakaotalk://web/openExternal?url=${encodeURIComponent(targetUrl)}`;
    return;
  }

  if (isAndroid) {
    // 안드로이드 Chrome 인텐트
    const url = targetUrl.replace(/^https?:\/\//, "");
    window.location.href = `intent://${url}#Intent;scheme=https;package=com.android.chrome;end`;
    return;
  }

  // iOS 인스타/페이스북/라인 등: 자동 외부 열기 불가. 안내만 표시.
  window.location.href = targetUrl;
}

export function InAppBrowserGuard() {
  const [info, setInfo] = useState<ReturnType<typeof detectInApp>>({
    isInApp: false,
    isKakao: false,
    isAndroid: false,
  });

  useEffect(() => {
    setInfo(detectInApp());
  }, []);

  if (!info.isInApp) return null;

  const currentUrl = typeof window !== "undefined" ? window.location.href : "";

  return (
    <div
      role="alert"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "rgba(0, 0, 0, 0.85)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "calc(24px + env(safe-area-inset-top)) 24px calc(24px + env(safe-area-inset-bottom))",
        gap: 16,
        color: "#fff",
      }}
    >
      <div style={{ fontSize: 40 }}>🌐</div>
      <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0, textAlign: "center" }}>
        외부 브라우저에서 열어주세요
      </h2>
      <p style={{ fontSize: 14, lineHeight: 1.6, textAlign: "center", color: "#ddd", margin: 0, maxWidth: 320 }}>
        {info.isKakao
          ? "카카오톡 인앱브라우저에서는 로그인이 정상 작동하지 않습니다.\n아래 버튼을 누르거나 우측 상단 메뉴에서\n'다른 브라우저로 열기'를 선택해주세요."
          : "현재 사용 중인 앱 내 브라우저에서는 로그인이 정상 작동하지 않습니다.\nSafari 또는 Chrome 등 기본 브라우저로 열어주세요."}
      </p>
      {(info.isKakao || info.isAndroid) && (
        <button
          type="button"
          onClick={() => openExternalBrowser(currentUrl, info)}
          className="btn btn-block btn-tall"
          style={{
            background: "var(--tcrc-accent-green, #2EBE5C)",
            color: "#fff",
            maxWidth: 320,
            border: "none",
            borderRadius: 14,
            padding: "14px 20px",
            fontSize: 16,
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          {info.isKakao ? "Safari/Chrome으로 열기" : "Chrome으로 열기"}
        </button>
      )}
      {!info.isKakao && !info.isAndroid && (
        <div
          style={{
            fontSize: 13,
            color: "#bbb",
            background: "#1a1a1a",
            border: "1px solid #333",
            borderRadius: 10,
            padding: "12px 14px",
            maxWidth: 320,
            wordBreak: "break-all",
            lineHeight: 1.5,
          }}
        >
          주소를 복사해서 Safari/Chrome에 붙여넣어주세요:
          <br />
          <code style={{ color: "#fff" }}>{currentUrl}</code>
        </div>
      )}
    </div>
  );
}
