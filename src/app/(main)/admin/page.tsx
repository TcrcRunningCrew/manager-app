import Link from "next/link";
import { requireAdminPage } from "@/lib/auth/admin-guard";
import { getAdminCounts } from "@/lib/domain/admin/queries";
import { AdminTopBar } from "@/components/organisms/AdminTopBar";

export const metadata = { title: "관리자 — T.C.R.C" };

type CardProps = {
  href: string;
  icon: string;
  title: string;
  detail: string;
};

function NavCard({ href, icon, title, detail }: CardProps) {
  return (
    <Link
      href={href}
      style={{
        textDecoration: "none",
        color: "inherit",
        background: "var(--tcrc-bg-surface)",
        border: "1px solid var(--tcrc-line)",
        borderRadius: 14,
        padding: "16px 18px",
        display: "flex",
        alignItems: "center",
        gap: 14,
      }}
    >
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 12,
          background: "var(--tcrc-bg-muted)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 22,
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: "var(--tcrc-text-primary)" }}>
          {title}
        </div>
        <div
          style={{
            fontSize: 12,
            color: "var(--tcrc-text-tertiary)",
            marginTop: 3,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {detail}
        </div>
      </div>
      <div style={{ color: "var(--tcrc-text-tertiary)", fontSize: 18, lineHeight: 1 }}>›</div>
    </Link>
  );
}

export default async function AdminIndexPage() {
  await requireAdminPage();
  const counts = await getAdminCounts();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100%",
        background: "var(--tcrc-bg-primary)",
        color: "var(--tcrc-text-primary)",
      }}
    >
      <AdminTopBar title="관리자 패널" subtitle="T.C.R.C 운영진 전용" backHref="/" />

      <div
        style={{
          flex: 1,
          padding:
            "20px calc(16px + env(safe-area-inset-right)) calc(48px + env(safe-area-inset-bottom)) calc(16px + env(safe-area-inset-left))",
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        <NavCard
          href="/admin/activity"
          icon="📋"
          title="최근 출석"
          detail={`최근 30일 ${counts.recentMeetings30d}건 · 오늘 ${counts.meetingsToday}건`}
        />
        <NavCard
          href="/admin/users"
          icon="👥"
          title="회원 관리"
          detail={`활성 ${counts.usersActive}명 · 전체 ${counts.usersTotal}명`}
        />
        <NavCard
          href="/admin/push"
          icon="🔔"
          title="푸시 알림 설정"
          detail={`운영진 ${counts.adminsTotal}명 중 ${counts.adminsSubscribed}명 구독`}
        />
      </div>
    </div>
  );
}
