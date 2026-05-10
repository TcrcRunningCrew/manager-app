"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { ConfirmDialog } from "@/components/molecules/ConfirmDialog";
import { ActionCard } from "@/components/atoms/ActionCard";
import { StatTile } from "@/components/atoms/StatTile";
import { MarqueeStrip } from "@/components/molecules/MarqueeStrip";
import { LoginScreen } from "./LoginScreen";
import { HomeAdminButton } from "./HomeAdminButton";
import dynamic from "next/dynamic";

const Lottie = dynamic(() => import("lottie-react"), {
  ssr: false,
  loading: () => <div style={{ color: "var(--tcrc-text-secondary)" }}>로딩중...</div>,
});

// useSearchParams는 Suspense boundary 안에서만 안전하게 사용 가능 (Next.js 14)
function OAuthErrorWatcher({ onError }: { onError: (msg: string) => void }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const error = searchParams.get("error");
    if (error) {
      onError("로그인에 실패했습니다. 다시 시도해 주세요.");
      router.replace("/");
    }
  }, [searchParams, router, onError]);

  return null;
}

export default function HomeClient({ isAdmin }: { isAdmin: boolean }) {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [errorDialog, setErrorDialog] = useState({ open: false, message: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [lottieData, setLottieData] = useState<any>(null);

  const handleLoginClick = async () => {
    setIsLoading(true);
    try {
      await signIn("kakao", { callbackUrl: "/" });
    } catch {
      setErrorDialog({ open: true, message: "로그인 중 에러가 발생했습니다." });
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (
      status === "authenticated" &&
      session.user &&
      (!session.user.name || !session.user.birthYear)
    ) {
      router.push("/signup");
    }
  }, [router, session, status]);

  useEffect(() => {
    if (status === "authenticated") {
      import("@/lib/lottie.json").then((data) => setLottieData(data));
    }
  }, [status]);

  // 로딩 중
  if (status === "loading") {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          background: "#000",
        }}
      >
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: "var(--tcrc-accent)",
            animation: "fade-in 1s ease infinite alternate",
          }}
        />
      </div>
    );
  }

  // 비로그인 — 로그인 화면
  if (status === "unauthenticated") {
    return (
      <>
        <Suspense>
          <OAuthErrorWatcher onError={(msg) => setErrorDialog({ open: true, message: msg })} />
        </Suspense>
        <LoginScreen onLogin={handleLoginClick} />
        <ConfirmDialog
          isOpen={errorDialog.open}
          onClose={() => setErrorDialog({ open: false, message: "" })}
          message={errorDialog.message}
        />
      </>
    );
  }

  // 로그인됨 — 홈 화면
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100%",
        background: "var(--tcrc-bg-primary)",
        color: "var(--tcrc-text-primary)",
      }}
    >
      {/* 로딩 오버레이 */}
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-32 h-32">
            <Lottie animationData={lottieData} loop />
          </div>
        </div>
      )}

      {/* 브랜드 블록 */}
      <div
        style={{
          padding:
            "calc(32px + env(safe-area-inset-top)) calc(22px + env(safe-area-inset-right)) 20px calc(22px + env(safe-area-inset-left))",
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <div className="t-display" style={{ fontSize: 56, color: "var(--tcrc-text-primary)" }}>
              T.C.R.C
            </div>
            <div
              style={{
                fontWeight: 700,
                fontSize: 18,
                color: "var(--tcrc-text-secondary)",
                letterSpacing: "-0.01em",
              }}
            >
              러닝크루
            </div>
          </div>

          {/* 로그아웃 버튼 */}
          <button
            onClick={() => signOut()}
            className="icon-btn ios-button"
            style={{ background: "var(--tcrc-accent-green)", color: "#fff" }}
            aria-label="로그아웃"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M15 3h4v18h-4M10 17l5-5-5-5M15 12H3"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        {/* 메타 태그 */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 14 }}>
          <span className="tag tag-line">EST. 2024</span>
          <span className="tag tag-line">SEOUL · 탄천</span>
          <span
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              marginLeft: 4,
              fontSize: 12,
              color: "var(--tcrc-text-tertiary)",
              fontWeight: 600,
            }}
          >
            <span className="dot dot-live" />
            LIVE
          </span>
        </div>
      </div>

      {/* 마퀴 스트립 */}
      <MarqueeStrip />

      {/* 액션 카드 */}
      <div
        style={{
          flex: 1,
          padding:
            "20px calc(20px + env(safe-area-inset-right)) calc(32px + env(safe-area-inset-bottom)) calc(20px + env(safe-area-inset-left))",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <ActionCard
            label="출석체크"
            sub="오늘의 모임에 출석하기"
            color="var(--tcrc-accent-green)"
            onColor="#fff"
            onClick={() => router.push("/checkout")}
          />
          <ActionCard
            label="랭킹 확인"
            sub="참여 · 개설 · 월별 종합"
            color="var(--tcrc-accent-yellow)"
            onColor="#231A00"
            onClick={() => router.push("/ranking")}
          />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <ActionCard
              label={"참여\n랭킹"}
              sub="참여 순위"
              color="var(--tcrc-accent-blue)"
              onColor="#fff"
              onClick={() => router.push("/ranking/participation")}
            />
            <ActionCard
              label={"개설\n랭킹"}
              sub="개설 순위"
              color="var(--tcrc-accent-blue)"
              onColor="#fff"
              onClick={() => router.push("/ranking/founder")}
            />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 4 }}>
            <StatTile label="이번 달 참여" value="—" unit="회" color="var(--tcrc-bg-surface)" />
            <StatTile label="이번 달 개설" value="—" unit="회" color="var(--tcrc-bg-surface)" />
          </div>
          {isAdmin && (
            <div style={{ marginTop: 8 }}>
              <HomeAdminButton />
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        isOpen={errorDialog.open}
        onClose={() => setErrorDialog({ open: false, message: "" })}
        message={errorDialog.message}
      />
    </div>
  );
}
