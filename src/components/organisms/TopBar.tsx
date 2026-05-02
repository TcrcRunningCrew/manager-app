"use client";

import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface TopBarProps {
  title: string;
  subtitle?: string;
  accent?: string;
  textColor?: string;
  showBack?: boolean;
  className?: string;
}

export function TopBar({
  title,
  subtitle,
  accent = "var(--tcrc-accent)",
  textColor = "var(--tcrc-text-inverted)",
  showBack = true,
  className,
}: TopBarProps) {
  const router = useRouter();

  return (
    <div
      className={cn("sticky top-0 z-40", className)}
      style={{
        background: accent,
        color: textColor,
        padding: "20px 20px 22px",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        gap: 12,
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <div className="t-display" style={{ fontSize: 26 }}>{title}</div>
        {subtitle && (
          <div style={{ fontWeight: 700, fontSize: 18, letterSpacing: "-0.01em" }}>
            {subtitle}
          </div>
        )}
      </div>
      {showBack && (
        <button
          onClick={() => router.back()}
          aria-label="뒤로"
          className="ios-button"
          style={{
            width: 36,
            height: 36,
            borderRadius: 999,
            border: 0,
            background: "rgba(0,0,0,0.12)",
            color: textColor,
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path
              d="M5 12h14M5 12l5-5M5 12l5 5"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )}
    </div>
  );
}
