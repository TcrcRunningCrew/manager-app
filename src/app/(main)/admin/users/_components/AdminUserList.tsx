"use client";

import { useState, useTransition, useMemo, useDeferredValue } from "react";
import { useRouter } from "next/navigation";
import { toggleAdminAction, toggleActivationAction } from "../actions";
import type { AdminUser } from "@/lib/domain/admin/queries";
import { ProxyCheckoutDialog } from "./ProxyCheckoutDialog";

interface Props {
  users: AdminUser[];
  currentAccountId: string;
}

function Toggle({
  value,
  onToggle,
  disabled,
  activeColor,
}: {
  value: boolean;
  onToggle: () => void;
  disabled: boolean;
  activeColor: string;
}) {
  return (
    <div
      onClick={() => !disabled && onToggle()}
      style={{
        width: 36,
        height: 20,
        borderRadius: 100,
        background: value ? activeColor : "var(--tcrc-bg-muted)",
        position: "relative",
        transition: "background 0.2s",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.7 : 1,
        flexShrink: 0,
      }}
    >
      <div
        style={{
          position: "absolute",
          width: 14,
          height: 14,
          borderRadius: "50%",
          background: value ? "#0B0D10" : "#6B7480",
          top: 3,
          left: value ? 19 : 3,
          transition: "left 0.2s",
        }}
      />
    </div>
  );
}

export function AdminUserList({ users, currentAccountId }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [optimistic, setOptimistic] = useState<Record<string, Partial<AdminUser>>>({});
  const [proxyUser, setProxyUser] = useState<AdminUser | null>(null);
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);

  const get = (u: AdminUser): AdminUser => ({ ...u, ...(optimistic[u.accountId] ?? {}) });

  const filteredUsers = useMemo(() => {
    const q = deferredQuery.trim().toLowerCase();
    if (!q) return users;
    return users.filter((u) => {
      const merged = get(u);
      return (
        merged.name?.toLowerCase().includes(q) ||
        merged.email?.toLowerCase().includes(q) ||
        String(merged.birthYear ?? "").includes(q)
      );
    });
    // optimistic 변동도 검색 반영
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [users, deferredQuery, optimistic]);

  const handleToggleAdmin = (user: AdminUser) => {
    const cur = get(user);
    const newVal = !cur.isAdmin;
    setOptimistic((prev) => ({ ...prev, [user.accountId]: { ...prev[user.accountId], isAdmin: newVal } }));
    startTransition(() => {
      toggleAdminAction(user.accountId, newVal);
    });
  };

  const handleToggleActivation = (user: AdminUser) => {
    const cur = get(user);
    const newVal = !cur.activation;
    setOptimistic((prev) => ({ ...prev, [user.accountId]: { ...prev[user.accountId], activation: newVal } }));
    startTransition(() => {
      toggleActivationAction(user.accountId, newVal);
    });
  };

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
        <div style={{ position: "relative" }}>
          <span
            aria-hidden="true"
            style={{
              position: "absolute",
              left: 12,
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--tcrc-text-tertiary)",
              fontSize: 14,
              pointerEvents: "none",
            }}
          >
            🔍
          </span>
          <input
            type="search"
            inputMode="search"
            placeholder="이름, 이메일, 년생으로 검색"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="회원 검색"
            style={{
              width: "100%",
              padding: "10px 36px 10px 36px",
              borderRadius: 10,
              border: "1px solid var(--tcrc-line)",
              background: "var(--tcrc-bg-surface)",
              color: "var(--tcrc-text-primary)",
              fontSize: 14,
              outline: "none",
            }}
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="검색어 지우기"
              style={{
                position: "absolute",
                right: 8,
                top: "50%",
                transform: "translateY(-50%)",
                background: "var(--tcrc-bg-muted)",
                border: "none",
                borderRadius: "50%",
                width: 22,
                height: 22,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 12,
                color: "var(--tcrc-text-secondary)",
                cursor: "pointer",
                padding: 0,
              }}
            >
              ✕
            </button>
          )}
        </div>
        {query && (
          <div style={{ fontSize: 11, color: "var(--tcrc-text-tertiary)", marginTop: 6, paddingLeft: 4 }}>
            {filteredUsers.length}명 일치 · 전체 {users.length}명
          </div>
        )}
      </div>

      {filteredUsers.length === 0 ? (
        <div
          style={{
            padding: "40px 16px",
            textAlign: "center",
            color: "var(--tcrc-text-tertiary)",
            fontSize: 14,
          }}
        >
          &ldquo;{query}&rdquo; 검색 결과가 없습니다.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {filteredUsers.map((rawUser) => {
          const u = get(rawUser);
          const isMe = u.accountId === currentAccountId;
          return (
            <div
              key={u.accountId}
              style={{
                background: "var(--tcrc-bg-surface)",
                border: `1px solid ${u.isAdmin ? "rgba(200,255,62,0.3)" : "var(--tcrc-line)"}`,
                borderRadius: 12,
                padding: "12px 14px",
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: "50%",
                    background: u.isAdmin ? "rgba(200,255,62,0.12)" : "var(--tcrc-bg-muted)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    fontSize: 18,
                  }}
                >
                  {u.isAdmin ? "👑" : "🏃"}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 5, flexWrap: "wrap" }}>
                    <span style={{ color: "var(--tcrc-text-primary)", fontWeight: 700, fontSize: 14 }}>
                      {u.name}
                    </span>
                    <span style={{ color: "var(--tcrc-text-tertiary)", fontSize: 12 }}>
                      {u.birthYear}년생
                    </span>
                    {isMe && (
                      <span
                        style={{
                          background: "#C8FF3E",
                          color: "#0B0D10",
                          fontSize: 10,
                          fontWeight: 700,
                          padding: "1px 6px",
                          borderRadius: 100,
                        }}
                      >
                        나
                      </span>
                    )}
                  </div>
                  <div
                    style={{
                      color: "var(--tcrc-text-tertiary)",
                      fontSize: 11,
                      marginTop: 2,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {u.email}
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 7, alignItems: "flex-end" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ color: "var(--tcrc-text-tertiary)", fontSize: 11 }}>운영진</span>
                    <Toggle
                      value={!!u.isAdmin}
                      onToggle={() => handleToggleAdmin(rawUser)}
                      disabled={pending}
                      activeColor="#C8FF3E"
                    />
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ color: "var(--tcrc-text-tertiary)", fontSize: 11 }}>활성</span>
                    <Toggle
                      value={!!u.activation}
                      onToggle={() => handleToggleActivation(rawUser)}
                      disabled={pending}
                      activeColor="#2FCB6F"
                    />
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setProxyUser(rawUser)}
                disabled={!u.activation}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  borderRadius: 8,
                  border: "1px solid var(--tcrc-line)",
                  background: "var(--tcrc-bg-muted)",
                  color: "var(--tcrc-text-primary)",
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: u.activation ? "pointer" : "not-allowed",
                  opacity: u.activation ? 1 : 0.5,
                }}
                aria-label={`${u.name} 대리 출석`}
              >
                🏃 대리 출석체크
              </button>
            </div>
          );
        })}
        </div>
      )}

      {proxyUser && (
        <ProxyCheckoutDialog
          user={proxyUser}
          onClose={() => setProxyUser(null)}
          onDone={() => {
            setProxyUser(null);
            router.refresh();
          }}
        />
      )}
    </>
  );
}
