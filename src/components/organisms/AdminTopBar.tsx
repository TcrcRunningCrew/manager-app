import Link from "next/link";

type Props = {
  title: string;
  subtitle?: string;
  backHref?: string;
};

export function AdminTopBar({ title, subtitle, backHref = "/admin" }: Props) {
  const isRoot = backHref === "/";
  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 40,
        background: "var(--tcrc-bg-primary)",
        borderBottom: "1px solid var(--tcrc-line)",
        padding:
          "calc(14px + env(safe-area-inset-top)) calc(20px + env(safe-area-inset-right)) 14px calc(20px + env(safe-area-inset-left))",
        display: "flex",
        alignItems: "center",
        gap: 12,
      }}
    >
      <Link
        href={backHref}
        aria-label={isRoot ? "홈으로" : "관리자 메인으로"}
        style={{
          color: "var(--tcrc-text-primary)",
          textDecoration: "none",
          fontSize: 22,
          lineHeight: 1,
          padding: "4px 8px",
        }}
      >
        ←
      </Link>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 800, fontSize: 17, letterSpacing: "-0.02em" }}>{title}</div>
        {subtitle && (
          <div style={{ color: "var(--tcrc-text-tertiary)", fontSize: 11, marginTop: 1 }}>
            {subtitle}
          </div>
        )}
      </div>
      <div
        style={{
          background: "rgba(200,255,62,0.12)",
          border: "1px solid rgba(200,255,62,0.3)",
          borderRadius: 100,
          padding: "4px 12px",
          fontSize: 11,
          fontWeight: 700,
          color: "#C8FF3E",
          flexShrink: 0,
        }}
      >
        ADMIN
      </div>
    </header>
  );
}
