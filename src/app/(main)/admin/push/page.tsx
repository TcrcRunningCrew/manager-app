import { requireAdminPage } from "@/lib/auth/admin-guard";
import { getAdminPushStatus } from "@/lib/domain/admin/queries";
import { AdminTopBar } from "@/components/organisms/AdminTopBar";
import { AdminPushSettings } from "./_components/AdminPushSettings";

export const metadata = { title: "푸시 알림 — 관리자" };

export default async function AdminPushPage() {
  await requireAdminPage();
  const adminPushStatus = await getAdminPushStatus();
  const subscribed = adminPushStatus.filter((a) => a.hasSub).length;

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
      <AdminTopBar
        title="푸시 알림 설정"
        subtitle={`운영진 ${adminPushStatus.length}명 중 ${subscribed}명 구독`}
      />

      <div
        style={{
          flex: 1,
          padding:
            "16px calc(16px + env(safe-area-inset-right)) calc(48px + env(safe-area-inset-bottom)) calc(16px + env(safe-area-inset-left))",
        }}
      >
        <AdminPushSettings adminPushStatus={adminPushStatus} />
      </div>
    </div>
  );
}
