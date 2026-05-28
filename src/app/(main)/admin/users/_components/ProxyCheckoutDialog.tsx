"use client";

import { useState, useTransition } from "react";
import { todayInKST, formatYMD, currentTimeKST } from "@/lib/time";
import type { AdminUser } from "@/lib/domain/admin/queries";
import { proxyCheckoutAction } from "../actions";

const ACTIVITY_OPTIONS = [
  { value: "1", label: "러닝" },
  { value: "2", label: "등산" },
  { value: "3", label: "자전거" },
  { value: "4", label: "기타" },
];
const LOCATION_OPTIONS = [
  { value: "1", label: "태평_탄천" },
  { value: "2", label: "서현_황새울공원" },
  { value: "3", label: "야탑_탄천종합운동장" },
  { value: "4", label: "모란_성남종합운동장" },
  { value: "5", label: "위례" },
  { value: "6", label: "정자" },
  { value: "7", label: "판교" },
  { value: "8", label: "그 외" },
];

type Props = {
  user: AdminUser;
  onClose: () => void;
  onDone: () => void;
};

export function ProxyCheckoutDialog({ user, onClose, onDone }: Props) {
  const [participationDate, setParticipationDate] = useState(formatYMD(todayInKST()));
  const [participationTime, setParticipationTime] = useState(currentTimeKST());
  const [activation, setActivation] = useState("1");
  const [location, setLocation] = useState("1");
  const [isFounder, setIsFounder] = useState(false);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = () => {
    setError(null);
    startTransition(async () => {
      const result = await proxyCheckoutAction({
        accountId: user.accountId,
        participationDate,
        participationTime,
        activation,
        location,
        isFounder,
      });
      if (result.ok) {
        onDone();
      } else {
        setError(result.message);
      }
    });
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        background: "rgba(0,0,0,0.6)",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: 520,
          background: "var(--tcrc-bg-primary)",
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          padding: "18px 20px calc(20px + env(safe-area-inset-bottom)) 20px",
          maxHeight: "92vh",
          overflowY: "auto",
        }}
      >
        <div
          style={{
            width: 40,
            height: 4,
            background: "var(--tcrc-line)",
            borderRadius: 2,
            margin: "0 auto 14px",
          }}
        />
        <div style={{ marginBottom: 14 }}>
          <h2 style={{ fontSize: 17, fontWeight: 800, margin: 0 }}>대리 출석체크</h2>
          <div style={{ fontSize: 12, color: "var(--tcrc-text-tertiary)", marginTop: 3 }}>
            {user.name} ({user.birthYear}년생) 대신 출석 등록
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div>
            <label className="field-label">참여일</label>
            <input
              className="field-input"
              type="date"
              value={participationDate}
              onChange={(e) => setParticipationDate(e.target.value)}
            />
          </div>
          <div>
            <label className="field-label">참여 시각</label>
            <input
              className="field-input"
              type="time"
              step={60}
              value={participationTime}
              onChange={(e) => setParticipationTime(e.target.value)}
            />
          </div>
          <div>
            <label className="field-label">운동종류</label>
            <select className="field-select" value={activation} onChange={(e) => setActivation(e.target.value)}>
              {ACTIVITY_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="field-label">장소</label>
            <select className="field-select" value={location} onChange={(e) => setLocation(e.target.value)}>
              {LOCATION_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="field-label">개설자 여부</label>
            <select
              className="field-select"
              value={isFounder ? "true" : "false"}
              onChange={(e) => setIsFounder(e.target.value === "true")}
            >
              <option value="false">모임 개설자 X</option>
              <option value="true">모임 개설자 O</option>
            </select>
          </div>
        </div>

        {error && (
          <div
            style={{
              marginTop: 14,
              padding: "10px 12px",
              background: "rgba(255,92,77,0.1)",
              border: "1px solid rgba(255,92,77,0.3)",
              borderRadius: 8,
              color: "var(--tcrc-accent-red)",
              fontSize: 13,
            }}
          >
            {error}
          </div>
        )}

        <div style={{ display: "flex", gap: 8, marginTop: 18 }}>
          <button
            type="button"
            onClick={onClose}
            disabled={pending}
            className="btn btn-block"
            style={{
              flex: 1,
              background: "var(--tcrc-bg-muted)",
              color: "var(--tcrc-text-primary)",
              border: "1px solid var(--tcrc-line)",
            }}
          >
            취소
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={pending}
            className="btn btn-block"
            style={{
              flex: 1,
              background: "var(--tcrc-accent-green)",
              color: "#fff",
              opacity: pending ? 0.6 : 1,
            }}
          >
            {pending ? "처리 중..." : "출석 등록"}
          </button>
        </div>
      </div>
    </div>
  );
}
