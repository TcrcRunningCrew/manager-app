"use client";

import { useRouter } from "next/navigation";

export function HomeAdminButton() {
  const router = useRouter();
  return (
    <button
      onClick={() => router.push("/admin")}
      style={{
        background: "rgba(200,255,62,0.08)",
        border: "1px solid rgba(200,255,62,0.25)",
        borderRadius: 10,
        padding: "12px 16px",
        color: "#C8FF3E",
        fontWeight: 700,
        fontSize: 14,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: 10,
        width: "100%",
        textAlign: "left",
      }}
    >
      <span style={{ fontSize: 16 }}>👑</span>
      <span>관리자 패널</span>
    </button>
  );
}
