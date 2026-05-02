"use client";

interface MonthSelectorProps {
  currentMonth: Date;
  changeMonth: (increment: number) => void;
}

export function MonthSelector({ currentMonth, changeMonth }: MonthSelectorProps) {
  const year = currentMonth.getFullYear();
  const month = String(currentMonth.getMonth() + 1).padStart(2, "0");

  return (
    <div style={{ padding: "16px 16px 12px" }}>
      <div
        style={{
          background: "var(--tcrc-bg-surface)",
          borderRadius: "var(--card-radius)",
          padding: "14px 12px",
          display: "grid",
          gridTemplateColumns: "44px 1fr 44px",
          alignItems: "center",
        }}
      >
        <button
          onClick={() => changeMonth(-1)}
          className="icon-btn"
          style={{ background: "transparent" }}
          aria-label="이전 달"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <div
          style={{
            textAlign: "center",
            fontWeight: 700,
            fontSize: 16,
            letterSpacing: "0.02em",
            color: "var(--tcrc-text-primary)",
          }}
        >
          {year}<span style={{ color: "var(--tcrc-text-tertiary)" }}>.</span>{month}
        </div>
        <button
          onClick={() => changeMonth(1)}
          className="icon-btn"
          style={{ background: "transparent" }}
          aria-label="다음 달"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}
