"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { MonthSelector } from "@/components/molecules/MonthSelector";

interface RankingUser {
  name: string;
  birthYear: number;
  score: number;
}

interface RankingListProps {
  bgColor?: string;
  scoreLabel: string;
  fetchRanking: (month: string) => Promise<RankingUser[]>;
}

export function RankingList({
  bgColor = "bg-tcrc-accent-yellow",
  scoreLabel,
  fetchRanking,
}: RankingListProps) {
  const { data: session, status } = useSession();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [users, setUsers] = useState<RankingUser[]>([]);
  const [userRanking, setUserRanking] = useState<number>();
  const [animKey, setAnimKey] = useState(0);

  const changeMonth = useCallback((increment: number) => {
    setCurrentMonth((prev) => {
      const newMonth = new Date(prev);
      newMonth.setMonth(newMonth.getMonth() + increment);
      return newMonth;
    });
  }, []);

  useEffect(() => {
    const monthStr = currentMonth.toISOString().substring(0, 7);
    setUsers([]);
    fetchRanking(monthStr).then((data) => {
      setUsers(data);
      setAnimKey((k) => k + 1);
    });
  }, [currentMonth, fetchRanking]);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.name) {
      const ranking = users.findIndex((u) => u.name === session.user.name);
      setUserRanking(ranking === -1 ? undefined : ranking + 1);
    }
  }, [status, session, users]);

  const accentColor = bgColor.includes("yellow")
    ? "var(--tcrc-accent-yellow)"
    : bgColor.includes("blue")
    ? "var(--tcrc-accent-blue)"
    : "var(--tcrc-accent)";

  const accentTextColor = bgColor.includes("yellow") ? "#231A00" : "#fff";

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>

      {/* ── Fixed area: month selector + my rank + table header ── */}
      <div style={{ flexShrink: 0, background: "var(--tcrc-bg-primary)", zIndex: 1 }}>
        <MonthSelector currentMonth={currentMonth} changeMonth={changeMonth} />

        {/* My rank banner */}
        <div style={{ padding: "0 16px 10px" }}>
          <div
            style={{
              background: accentColor,
              color: accentTextColor,
              borderRadius: "var(--card-radius)",
              padding: "16px 18px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div style={{ fontWeight: 800, fontSize: 16 }}>나의 랭킹</div>
            <div style={{ fontWeight: 700, fontSize: 15, opacity: 0.82 }}>
              {userRanking != null
                ? `${userRanking}위 / ${users.length}명`
                : "랭킹없음"}
            </div>
          </div>
        </div>

        {/* Table header — top of card, rounded top corners */}
        <div style={{ padding: "0 16px" }}>
          <div
            style={{
              background: "var(--tcrc-bg-surface)",
              borderRadius: "var(--card-radius) var(--card-radius) 0 0",
              border: "1px solid var(--tcrc-line-soft)",
              borderBottom: "1px solid var(--tcrc-line)",
              display: "grid",
              gridTemplateColumns: "44px 1fr 80px",
              padding: "10px 16px",
            }}
          >
            <div className="t-xs">순위</div>
            <div className="t-xs">이름 (년생)</div>
            <div className="t-xs" style={{ textAlign: "right" }}>{scoreLabel}</div>
          </div>
        </div>
      </div>

      {/* ── Scrollable rows ── */}
      <div style={{ flex: 1, overflowY: "auto", padding: "0 16px 32px" }}>
        <div
          style={{
            background: "var(--tcrc-bg-surface)",
            borderRadius: "0 0 var(--card-radius) var(--card-radius)",
            border: "1px solid var(--tcrc-line-soft)",
            borderTop: "none",
          }}
        >
          {users.map((user, index) => {
            const rank = index + 1;
            const medal = rank <= 3;
            const isMe = status === "authenticated" && session?.user?.name === user.name;
            return (
              <div
                key={`${animKey}-${user.name}-${user.birthYear}`}
                style={{
                  display: "grid",
                  gridTemplateColumns: "44px 1fr 80px",
                  alignItems: "center",
                  padding: "14px 16px",
                  borderBottom: "1px solid var(--tcrc-line-soft)",
                  background: isMe ? "rgba(200,255,62,0.06)" : "transparent",
                  animation: "slide-up 0.3s ease-out both",
                  animationDelay: `${Math.min(index * 0.055, 0.44)}s`,
                }}
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 6,
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: medal ? accentColor : "transparent",
                    color: medal ? accentTextColor : "var(--tcrc-text-secondary)",
                    fontFamily: "var(--font-display)",
                    fontStyle: "italic",
                    fontSize: 18,
                  }}
                >
                  {rank}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <div style={{ fontWeight: 700, fontSize: 15, color: "var(--tcrc-text-primary)" }}>
                    {user.name}{" "}
                    <span style={{ color: "var(--tcrc-text-tertiary)", fontWeight: 500, fontSize: 13 }}>
                      &apos;{user.birthYear}
                    </span>
                  </div>
                </div>
                <div
                  className="t-num"
                  style={{ fontSize: 28, textAlign: "right", color: "var(--tcrc-text-primary)" }}
                >
                  {user.score}
                </div>
              </div>
            );
          })}

          {users.length === 0 && (
            <div style={{ padding: "32px 0", textAlign: "center", color: "var(--tcrc-text-tertiary)", fontSize: 14 }}>
              데이터가 없습니다
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
