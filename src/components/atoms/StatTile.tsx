interface StatTileProps {
  label: string;
  value: string | number;
  unit?: string;
  color?: string;
  onColor?: string;
  accent?: boolean;
}

export function StatTile({
  label,
  value,
  unit,
  color = "var(--tcrc-bg-surface)",
  onColor = "var(--tcrc-text-primary)",
  accent = false,
}: StatTileProps) {
  return (
    <div
      style={{
        background: color,
        color: onColor,
        borderRadius: "var(--card-radius)",
        padding: "16px 16px 18px",
        minHeight: 120,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        border: accent ? "0" : "1px solid var(--tcrc-line-soft)",
      }}
    >
      <div style={{ fontWeight: 700, fontSize: 13, lineHeight: 1.25, opacity: 0.92 }}>
        {label}
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
        <div className="t-num" style={{ fontSize: 56 }}>{value}</div>
        {unit && (
          <div style={{ fontWeight: 700, fontSize: 14, opacity: 0.7 }}>{unit}</div>
        )}
      </div>
    </div>
  );
}
