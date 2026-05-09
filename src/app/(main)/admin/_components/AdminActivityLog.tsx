import type { RecentCheckout } from "@/lib/domain/admin/queries";

const ACTIVATION_MAP: Record<string, string> = {
  "1": "러닝", "2": "등산", "3": "자전거", "4": "기타",
};
const LOCATION_MAP: Record<string, string> = {
  "1": "태평_탄천", "2": "서현_황새울공원", "3": "야탑_탄천종합운동장",
  "4": "모란_성남종합운동장", "5": "위례", "6": "정자", "7": "판교", "8": "그 외",
};
const ACTIVITY_EMOJI: Record<string, string> = {
  "1": "🏃", "2": "🏔️", "3": "🚴", "4": "💪",
};

interface Props {
  checkouts: RecentCheckout[];
}

export function AdminActivityLog({ checkouts }: Props) {
  if (checkouts.length === 0) {
    return (
      <div style={{ padding: "32px 16px", textAlign: "center", color: "var(--tcrc-text-tertiary)", fontSize: 14 }}>
        출석 기록이 없습니다.
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {checkouts.map((item, i) => (
        <div
          key={i}
          style={{
            background: "var(--tcrc-bg-surface)",
            border: "1px solid var(--tcrc-line)",
            borderRadius: 10,
            padding: "11px 14px",
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <div style={{ fontSize: 20, flexShrink: 0 }}>{ACTIVITY_EMOJI[item.activation] ?? "🏃"}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
              <span style={{ color: "var(--tcrc-text-primary)", fontWeight: 700, fontSize: 14 }}>{item.name}</span>
              <span style={{ color: "var(--tcrc-text-tertiary)", fontSize: 12 }}>{item.birthYear}년생</span>
              {item.founder && (
                <span style={{
                  background: "rgba(200,255,62,0.15)", color: "#C8FF3E",
                  fontSize: 10, fontWeight: 700, padding: "1px 6px", borderRadius: 100,
                }}>
                  개설자
                </span>
              )}
            </div>
            <div style={{ color: "var(--tcrc-text-tertiary)", fontSize: 12, marginTop: 2 }}>
              {item.meeting_date} · {LOCATION_MAP[item.location] ?? item.location} · {ACTIVATION_MAP[item.activation] ?? item.activation}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
