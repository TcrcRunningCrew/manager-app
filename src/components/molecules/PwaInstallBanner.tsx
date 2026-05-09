"use client";

import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function PwaInstallBanner() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsStandalone(true);
      return;
    }
    if (localStorage.getItem("pwa-banner-dismissed")) {
      setDismissed(true);
      return;
    }

    const ua = navigator.userAgent;
    const isIOSDevice = /iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream;
    setIsIOS(isIOSDevice);

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    localStorage.setItem("pwa-banner-dismissed", "1");
    setDismissed(true);
    setDeferredPrompt(null);
  };

  if (isStandalone || dismissed) return null;
  if (!deferredPrompt && !isIOS) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        padding: "16px 20px 32px",
        background: "var(--tcrc-bg-surface)",
        borderTop: "1px solid var(--tcrc-line)",
        display: "flex",
        flexDirection: "column",
        gap: 12,
        boxShadow: "0 -8px 32px rgba(0,0,0,0.4)",
      }}
    >
      <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 12,
            background: "#0B0D10",
            border: "1.5px solid #C8FF3E",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <span
            style={{ color: "#C8FF3E", fontWeight: 900, fontSize: 13, letterSpacing: "-0.5px" }}
          >
            TCRC
          </span>
        </div>
        <div style={{ flex: 1 }}>
          <div
            style={{
              color: "var(--tcrc-text-primary)",
              fontWeight: 700,
              fontSize: 15,
              marginBottom: 2,
            }}
          >
            홈화면에 추가하기
          </div>
          <div style={{ color: "var(--tcrc-text-tertiary)", fontSize: 13 }}>
            {isIOS
              ? "Safari 하단 공유 버튼 → 홈 화면에 추가"
              : "앱처럼 빠르게 출석체크"}
          </div>
        </div>
        <button
          onClick={handleDismiss}
          style={{
            background: "none",
            border: "none",
            color: "var(--tcrc-text-tertiary)",
            fontSize: 22,
            cursor: "pointer",
            padding: "4px 8px",
          }}
          aria-label="닫기"
        >
          ×
        </button>
      </div>

      {!isIOS && (
        <button
          onClick={handleInstall}
          style={{
            background: "#C8FF3E",
            color: "#0B0D10",
            border: "none",
            borderRadius: 10,
            padding: "13px",
            fontWeight: 800,
            fontSize: 15,
            cursor: "pointer",
            letterSpacing: "-0.01em",
          }}
        >
          지금 설치
        </button>
      )}
    </div>
  );
}
