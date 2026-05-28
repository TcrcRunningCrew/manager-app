"use client";

import { useState, useEffect, useRef, useCallback, useTransition } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import type { RecentCheckout, CheckoutFilter } from "@/lib/domain/admin/queries";
import { EditMeetingDialog } from "./EditMeetingDialog";
import { fetchMoreCheckoutsAction } from "../actions";

const ACTIVATION_MAP: Record<string, string> = {
  "1": "러닝",
  "2": "등산",
  "3": "자전거",
  "4": "기타",
};
const LOCATION_MAP: Record<string, string> = {
  "1": "태평_탄천",
  "2": "서현_황새울공원",
  "3": "야탑_탄천종합운동장",
  "4": "모란_성남종합운동장",
  "5": "위례",
  "6": "정자",
  "7": "판교",
  "8": "그 외",
};
const ACTIVITY_EMOJI: Record<string, string> = {
  "1": "🏃",
  "2": "🏔️",
  "3": "🚴",
  "4": "💪",
};

interface Props {
  initialItems: RecentCheckout[];
  initialHasMore: boolean;
  pageSize: number;
  initialFilter: CheckoutFilter;
}

export function AdminActivityList({
  initialItems,
  initialHasMore,
  pageSize,
  initialFilter,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [items, setItems] = useState<RecentCheckout[]>(initialItems);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<RecentCheckout | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // searchParams 또는 initial 데이터가 바뀌면 (라우터 변경) 동기화
  useEffect(() => {
    setItems(initialItems);
    setHasMore(initialHasMore);
    setError(null);
  }, [initialItems, initialHasMore]);

  const handleLoadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    setError(null);
    const result = await fetchMoreCheckoutsAction({
      filter: initialFilter,
      offset: items.length,
      limit: pageSize,
    });
    if (result.ok) {
      // 중복 방지: _id 기준으로 dedupe
      setItems((prev) => {
        const ids = new Set(prev.map((p) => String(p._id)));
        const merged = [...prev];
        for (const it of result.items) {
          if (!ids.has(String(it._id))) merged.push(it);
        }
        return merged;
      });
      setHasMore(result.hasMore);
    } else {
      setError(result.message);
    }
    setLoading(false);
  }, [loading, hasMore, items.length, initialFilter, pageSize]);

  // IntersectionObserver로 sentinel 감지
  useEffect(() => {
    const node = sentinelRef.current;
    if (!node || !hasMore) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) handleLoadMore();
      },
      { rootMargin: "200px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [hasMore, handleLoadMore]);

  const applyFilter = (from: string, to: string) => {
    const params = new URLSearchParams(searchParams?.toString() ?? "");
    if (from) params.set("from", from);
    else params.delete("from");
    if (to) params.set("to", to);
    else params.delete("to");
    const qs = params.toString();
    startTransition(() => {
      router.push(qs ? `${pathname}?${qs}` : pathname);
    });
  };

  const resetFilter = () => {
    startTransition(() => {
      router.push(pathname);
    });
  };

  const fromValue = initialFilter.from ?? "";
  const toValue = initialFilter.to ?? "";
  const hasFilter = !!fromValue || !!toValue;

  return (
    <>
      <div
        style={{
          position: "sticky",
          top: "calc(56px + env(safe-area-inset-top))",
          zIndex: 10,
          background: "var(--tcrc-bg-primary)",
          paddingBottom: 10,
          marginBottom: 4,
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 8,
            alignItems: "center",
            background: "var(--tcrc-bg-surface)",
            border: "1px solid var(--tcrc-line)",
            borderRadius: 10,
            padding: "8px 10px",
          }}
        >
          <input
            type="date"
            value={fromValue}
            onChange={(e) => applyFilter(e.target.value, toValue)}
            aria-label="시작일"
            style={{
              flex: 1,
              minWidth: 0,
              border: "none",
              background: "transparent",
              color: "var(--tcrc-text-primary)",
              fontSize: 13,
              outline: "none",
            }}
          />
          <span style={{ color: "var(--tcrc-text-tertiary)", fontSize: 12 }}>~</span>
          <input
            type="date"
            value={toValue}
            onChange={(e) => applyFilter(fromValue, e.target.value)}
            aria-label="종료일"
            style={{
              flex: 1,
              minWidth: 0,
              border: "none",
              background: "transparent",
              color: "var(--tcrc-text-primary)",
              fontSize: 13,
              outline: "none",
            }}
          />
          {hasFilter && (
            <button
              type="button"
              onClick={resetFilter}
              aria-label="필터 초기화"
              style={{
                border: "none",
                background: "var(--tcrc-bg-muted)",
                borderRadius: 6,
                padding: "4px 8px",
                fontSize: 11,
                color: "var(--tcrc-text-secondary)",
                cursor: "pointer",
              }}
            >
              초기화
            </button>
          )}
        </div>
        <div style={{ fontSize: 11, color: "var(--tcrc-text-tertiary)", marginTop: 6, paddingLeft: 4 }}>
          {hasFilter
            ? `${fromValue || "처음"} ~ ${toValue || "오늘"} · ${items.length}건${hasMore ? "+" : ""} 로드`
            : `${items.length}건${hasMore ? "+" : ""} 로드`}
        </div>
      </div>

      {items.length === 0 ? (
        <div
          style={{
            padding: "40px 16px",
            textAlign: "center",
            color: "var(--tcrc-text-tertiary)",
            fontSize: 14,
          }}
        >
          {hasFilter ? "선택한 기간에 출석 기록이 없습니다." : "출석 기록이 없습니다."}
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {items.map((item) => (
            <button
              key={String(item._id)}
              type="button"
              onClick={() => setEditing(item)}
              style={{
                background: "var(--tcrc-bg-surface)",
                border: "1px solid var(--tcrc-line)",
                borderRadius: 10,
                padding: "11px 14px",
                display: "flex",
                alignItems: "center",
                gap: 10,
                textAlign: "left",
                cursor: "pointer",
                color: "inherit",
                width: "100%",
                font: "inherit",
              }}
              aria-label={`${item.name} ${item.meeting_date} 수정`}
            >
              <div style={{ fontSize: 20, flexShrink: 0 }}>
                {ACTIVITY_EMOJI[item.activation] ?? "🏃"}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                  <span style={{ color: "var(--tcrc-text-primary)", fontWeight: 700, fontSize: 14 }}>
                    {item.name}
                  </span>
                  <span style={{ color: "var(--tcrc-text-tertiary)", fontSize: 12 }}>
                    {item.birthYear}년생
                  </span>
                  {item.founder && (
                    <span
                      style={{
                        background: "rgba(200,255,62,0.15)",
                        color: "#C8FF3E",
                        fontSize: 10,
                        fontWeight: 700,
                        padding: "1px 6px",
                        borderRadius: 100,
                      }}
                    >
                      개설자
                    </span>
                  )}
                </div>
                <div style={{ color: "var(--tcrc-text-tertiary)", fontSize: 12, marginTop: 2 }}>
                  {item.meeting_date}
                  {item.meeting_time ? ` ${item.meeting_time}` : ""} ·{" "}
                  {LOCATION_MAP[item.location] ?? item.location} ·{" "}
                  {ACTIVATION_MAP[item.activation] ?? item.activation}
                </div>
              </div>
              <div style={{ color: "var(--tcrc-text-tertiary)", fontSize: 13, lineHeight: 1 }}>›</div>
            </button>
          ))}
        </div>
      )}

      {hasMore && (
        <div ref={sentinelRef} style={{ padding: "16px 0", textAlign: "center" }}>
          <span style={{ fontSize: 12, color: "var(--tcrc-text-tertiary)" }}>
            {loading ? "불러오는 중..." : "스크롤하면 더 보기"}
          </span>
        </div>
      )}

      {!hasMore && items.length > pageSize && (
        <div style={{ padding: "16px 0", textAlign: "center" }}>
          <span style={{ fontSize: 11, color: "var(--tcrc-text-tertiary)" }}>· 끝 ·</span>
        </div>
      )}

      {error && (
        <div
          style={{
            marginTop: 12,
            padding: "10px 12px",
            background: "rgba(255,92,77,0.1)",
            border: "1px solid rgba(255,92,77,0.3)",
            borderRadius: 8,
            color: "var(--tcrc-accent-red)",
            fontSize: 13,
            textAlign: "center",
          }}
        >
          {error}
          <button
            type="button"
            onClick={handleLoadMore}
            style={{
              marginLeft: 10,
              border: "none",
              background: "transparent",
              color: "var(--tcrc-accent-red)",
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
              textDecoration: "underline",
            }}
          >
            재시도
          </button>
        </div>
      )}

      {editing && (
        <EditMeetingDialog
          checkout={editing}
          onClose={() => setEditing(null)}
          onDone={() => {
            setEditing(null);
            router.refresh();
          }}
        />
      )}
    </>
  );
}
