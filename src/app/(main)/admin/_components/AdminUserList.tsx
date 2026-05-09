"use client";

import { useState, useTransition } from "react";
import { toggleAdminAction, toggleActivationAction } from "../actions";
import type { AdminUser } from "@/lib/domain/admin/queries";

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
  const [pending, startTransition] = useTransition();
  const [optimistic, setOptimistic] = useState<Record<string, Partial<AdminUser>>>({});

  const get = (u: AdminUser): AdminUser => ({ ...u, ...(optimistic[u.accountId] ?? {}) });

  const handleToggleAdmin = (user: AdminUser) => {
    const cur = get(user);
    const newVal = !cur.isAdmin;
    setOptimistic((prev) => ({ ...prev, [user.accountId]: { ...prev[user.accountId], isAdmin: newVal } }));
    startTransition(() => { toggleAdminAction(user.accountId, newVal); });
  };

  const handleToggleActivation = (user: AdminUser) => {
    const cur = get(user);
    const newVal = !cur.activation;
    setOptimistic((prev) => ({ ...prev, [user.accountId]: { ...prev[user.accountId], activation: newVal } }));
    startTransition(() => { toggleActivationAction(user.accountId, newVal); });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {users.map((rawUser) => {
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
              alignItems: "center",
              gap: 10,
            }}
          >
            {/* 아바타 */}
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

            {/* 정보 */}
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
                      background: "#C8FF3E", color: "#0B0D10",
                      fontSize: 10, fontWeight: 700,
                      padding: "1px 6px", borderRadius: 100,
                    }}
                  >
                    나
                  </span>
                )}
              </div>
              <div
                style={{
                  color: "var(--tcrc-text-tertiary)", fontSize: 11, marginTop: 2,
                  overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                }}
              >
                {u.email}
              </div>
            </div>

            {/* 토글 영역 */}
            <div style={{ display: "flex", flexDirection: "column", gap: 7, alignItems: "flex-end" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ color: "var(--tcrc-text-tertiary)", fontSize: 11 }}>운영진</span>
                <Toggle value={!!u.isAdmin} onToggle={() => handleToggleAdmin(rawUser)} disabled={pending} activeColor="#C8FF3E" />
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ color: "var(--tcrc-text-tertiary)", fontSize: 11 }}>활성</span>
                <Toggle value={!!u.activation} onToggle={() => handleToggleActivation(rawUser)} disabled={pending} activeColor="#2FCB6F" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
