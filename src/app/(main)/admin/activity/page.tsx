import { requireAdminPage } from "@/lib/auth/admin-guard";
import { getRecentCheckouts } from "@/lib/domain/admin/queries";
import { AdminTopBar } from "@/components/organisms/AdminTopBar";
import { AdminActivityList } from "./_components/AdminActivityList";

export const metadata = { title: "최근 출석 — 관리자" };

export default async function AdminActivityPage() {
  await requireAdminPage();
  const checkouts = await getRecentCheckouts(50);

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
      <AdminTopBar title="최근 출석" subtitle={`${checkouts.length}건 · 행을 탭하면 수정/삭제`} />

      <div
        style={{
          flex: 1,
          padding:
            "16px calc(16px + env(safe-area-inset-right)) calc(48px + env(safe-area-inset-bottom)) calc(16px + env(safe-area-inset-left))",
        }}
      >
        <AdminActivityList checkouts={checkouts} />
      </div>
    </div>
  );
}
