"use client";

import { useState, useTransition } from "react";
import type { RecentCheckout } from "@/lib/domain/admin/queries";
import { updateMeetingAction, deleteMeetingAction } from "../actions";

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
  checkout: RecentCheckout;
  onClose: () => void;
  onDone: () => void;
};

export function EditMeetingDialog({ checkout, onClose, onDone }: Props) {
  const [meetingDate, setMeetingDate] = useState(checkout.meeting_date);
  const [meetingTime, setMeetingTime] = useState(checkout.meeting_time ?? "");
  const [activation, setActivation] = useState(checkout.activation);
  const [location, setLocation] = useState(checkout.location);
  const [founder, setFounder] = useState(checkout.founder);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleSave = () => {
    setError(null);
    startTransition(async () => {
      const result = await updateMeetingAction(checkout._id, {
        meeting_date: meetingDate,
        meeting_time: meetingTime ? meetingTime : null,
        activation,
        location,
        founder,
      });
      if (result.ok) {
        onDone();
      } else {
        setError(result.message);
      }
    });
  };

  const handleDelete = () => {
    setError(null);
    startTransition(async () => {
      const result = await deleteMeetingAction(checkout._id);
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
          padding:
            "18px 20px calc(20px + env(safe-area-inset-bottom)) 20px",
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
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 14 }}>
          <h2 style={{ fontSize: 17, fontWeight: 800, margin: 0 }}>출석 기록 수정</h2>
          <span style={{ fontSize: 12, color: "var(--tcrc-text-tertiary)" }}>
            {checkout.name} ({checkout.birthYear}년생)
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div>
            <label className="field-label">참여일</label>
            <input className="field-input" type="date" value={meetingDate} onChange={(e) => setMeetingDate(e.target.value)} />
          </div>
          <div>
            <label className="field-label">참여 시각</label>
            <input className="field-input" type="time" step={60} value={meetingTime} onChange={(e) => setMeetingTime(e.target.value)} />
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
              value={founder ? "true" : "false"}
              onChange={(e) => setFounder(e.target.value === "true")}
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
            onClick={handleSave}
            disabled={pending}
            className="btn btn-block"
            style={{
              flex: 1,
              background: "var(--tcrc-accent-green)",
              color: "#fff",
              opacity: pending ? 0.6 : 1,
            }}
          >
            {pending ? "저장 중..." : "저장"}
          </button>
        </div>

        <div
          style={{
            marginTop: 18,
            paddingTop: 14,
            borderTop: "1px solid var(--tcrc-line)",
          }}
        >
          {!confirmDelete ? (
            <button
              type="button"
              onClick={() => setConfirmDelete(true)}
              disabled={pending}
              className="btn btn-block"
              style={{
                width: "100%",
                background: "transparent",
                color: "var(--tcrc-accent-red)",
                border: "1px solid rgba(255,92,77,0.4)",
              }}
            >
              이 출석 기록 삭제
            </button>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ fontSize: 13, color: "var(--tcrc-text-secondary)", textAlign: "center" }}>
                정말 삭제하시겠습니까? 되돌릴 수 없습니다.
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  type="button"
                  onClick={() => setConfirmDelete(false)}
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
                  onClick={handleDelete}
                  disabled={pending}
                  className="btn btn-block"
                  style={{
                    flex: 1,
                    background: "var(--tcrc-accent-red)",
                    color: "#fff",
                    opacity: pending ? 0.6 : 1,
                  }}
                >
                  {pending ? "삭제 중..." : "삭제"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
