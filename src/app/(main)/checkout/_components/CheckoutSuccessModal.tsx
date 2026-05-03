"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { type CheckoutRankingData } from "../actions";

interface CheckoutSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  date: string;
  locationLabel: string;
  activityLabel: string;
  rankingData: CheckoutRankingData | null;
}

export function CheckoutSuccessModal({
  isOpen,
  onClose,
  date,
  locationLabel,
  activityLabel,
  rankingData,
}: CheckoutSuccessModalProps) {
  const router = useRouter();

  const confetti = useMemo(() => {
    const colors = [
      "var(--tcrc-accent-lime)",
      "var(--tcrc-accent-yellow)",
      "var(--tcrc-accent-blue)",
      "#fff",
      "var(--tcrc-accent-green)",
    ];
    return Array.from({ length: 28 }, (_, i) => ({
      id: i,
      left: 5 + Math.random() * 90,
      cx: ((Math.random() * 280 - 140) | 0) + "px",
      delay: Math.random() * 0.5,
      dur: 2 + Math.random() * 1.2,
      color: colors[i % colors.length],
      rot: (Math.random() * 60 - 30) | 0,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  if (!isOpen) return null;

  const formattedDate = date.replace(/(\d{4})-(\d{2})-(\d{2})/, "$1.$2.$3");

  return (
    /* position: absolute so it's contained within .mobile-viewport (position: relative + overflow: hidden) */
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 50,
        overflow: "hidden",
      }}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0,0,0,0.65)",
          backdropFilter: "blur(4px)",
          WebkitBackdropFilter: "blur(4px)",
        }}
      />

      {/* Confetti */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        {confetti.map((p) => (
          <span
            key={p.id}
            className="confetti"
            style={
              {
                left: p.left + "%",
                background: p.color,
                "--cx": p.cx,
                animationDelay: p.delay + "s",
                animationDuration: p.dur + "s",
                transform: `rotate(${p.rot}deg)`,
              } as React.CSSProperties
            }
          />
        ))}
      </div>

      {/* Modal card — bottom sheet */}
      <div
        className="pop-in"
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "absolute",
          left: 16,
          right: 16,
          bottom: 32,
          background: "var(--tcrc-bg-inset)",
          border: "1px solid var(--tcrc-line)",
          borderRadius: 22,
          padding: "26px 22px 22px",
          display: "flex",
          flexDirection: "column",
          gap: 16,
          boxShadow: "0 30px 80px -20px rgba(0,0,0,0.85)",
        }}
      >
        {/* Close button */}
        <button
          aria-label="닫기"
          onClick={onClose}
          style={{
            position: "absolute",
            top: 14,
            right: 14,
            width: 32,
            height: 32,
            borderRadius: 999,
            background: "var(--tcrc-bg-muted)",
            color: "var(--tcrc-text-secondary)",
            border: 0,
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path
              d="M6 6l12 12M18 6L6 18"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
          </svg>
        </button>

        {/* Check icon + headline */}
        <div
          style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, marginTop: 4 }}
        >
          <div
            style={{
              width: 84,
              height: 84,
              borderRadius: 999,
              background: "var(--tcrc-accent-lime)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 12px 36px -8px rgba(200,255,62,0.45)",
            }}
          >
            <svg width="42" height="42" viewBox="0 0 24 24" fill="none">
              <path
                d="M5 12.5l4.5 4.5L19 7.5"
                stroke="#0B0D10"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <div className="t-display" style={{ fontSize: 40, color: "var(--tcrc-text-primary)" }}>
              출석 완료
            </div>
            <div
              style={{
                fontWeight: 600,
                fontSize: 12,
                color: "var(--tcrc-text-tertiary)",
                letterSpacing: "0.04em",
                fontFamily: "var(--font-mono)",
              }}
            >
              {formattedDate} · {locationLabel} · {activityLabel}
            </div>
          </div>
        </div>

        {/* Stat tiles */}
        {rankingData && (
          <div style={{ display: "flex", gap: 12 }}>
            <div
              style={{
                flex: 1,
                background: "var(--tcrc-accent-lime)",
                color: "#0B0D10",
                borderRadius: "var(--card-radius)",
                padding: "12px 14px",
              }}
            >
              <div style={{ fontWeight: 700, fontSize: 11, opacity: 0.7 }}>이번 달 참여</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginTop: 2 }}>
                <div className="t-num" style={{ fontSize: 38 }}>
                  {String(rankingData.monthlyCount).padStart(2, "0")}
                </div>
                <div style={{ fontWeight: 700, fontSize: 13 }}>회</div>
              </div>
            </div>

            <div
              style={{
                flex: 1,
                background: "var(--tcrc-bg-surface)",
                borderRadius: "var(--card-radius)",
                padding: "12px 14px",
              }}
            >
              <div className="t-xs" style={{ marginBottom: 2 }}>참여 랭킹</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginTop: 2 }}>
                {rankingData.participationRank != null ? (
                  <>
                    <div className="t-num" style={{ fontSize: 38, color: "var(--tcrc-text-primary)" }}>
                      {rankingData.participationRank}
                    </div>
                    <div style={{ fontWeight: 700, fontSize: 13, color: "var(--tcrc-text-secondary)" }}>위</div>
                    <div
                      style={{
                        marginLeft: "auto",
                        fontFamily: "var(--font-mono)",
                        fontSize: 11,
                        fontWeight: 700,
                        color: "var(--tcrc-text-tertiary)",
                      }}
                    >
                      /{rankingData.participationTotal}
                    </div>
                  </>
                ) : (
                  <div style={{ fontWeight: 700, fontSize: 14, color: "var(--tcrc-text-tertiary)" }}>—</div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Founder rank row */}
        {rankingData && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "10px 0",
              borderTop: "1px solid var(--tcrc-line-soft)",
            }}
          >
            <div style={{ fontWeight: 700, fontSize: 13, color: "var(--tcrc-text-secondary)" }}>
              개설 랭킹
            </div>
            <div>
              {rankingData.founderRank != null ? (
                <div style={{ fontWeight: 700, fontSize: 14, color: "var(--tcrc-text-primary)" }}>
                  <span className="t-num" style={{ fontSize: 18, marginRight: 3 }}>
                    {rankingData.founderRank}
                  </span>
                  위 / {rankingData.founderTotal}
                </div>
              ) : (
                <div style={{ fontWeight: 700, fontSize: 13, color: "var(--tcrc-text-tertiary)" }}>
                  미개설
                </div>
              )}
            </div>
          </div>
        )}

        {/* CTAs */}
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn btn-ghost" style={{ flex: 1 }} onClick={onClose}>
            닫기
          </button>
          <button
            className="btn btn-primary"
            style={{ flex: 1.4 }}
            onClick={() => {
              onClose();
              router.push("/ranking");
            }}
          >
            랭킹 보기
          </button>
        </div>
      </div>
    </div>
  );
}
