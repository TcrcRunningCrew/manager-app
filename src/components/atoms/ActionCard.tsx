import { cn } from "@/lib/utils";

interface ActionCardProps {
  label: string;
  sub?: string;
  color?: string;
  onColor?: string;
  onClick?: () => void;
  className?: string;
}

export function ActionCard({
  label,
  sub,
  color = "var(--tcrc-accent)",
  onColor = "var(--tcrc-text-inverted)",
  onClick,
  className,
}: ActionCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn("w-full text-left cursor-pointer ios-button", className)}
      style={{
        background: color,
        color: onColor,
        border: 0,
        borderRadius: "var(--card-radius)",
        padding: "20px 22px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        boxShadow: "var(--sh-card)",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <div className="t-display" style={{ fontSize: 26, whiteSpace: "pre-line" }}>{label}</div>
        {sub && (
          <div style={{ fontWeight: 600, fontSize: 13, opacity: 0.78 }}>{sub}</div>
        )}
      </div>
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: 999,
          background: "rgba(0,0,0,0.18)",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path
            d="M7 17L17 7M17 7H9M17 7v8"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </button>
  );
}
