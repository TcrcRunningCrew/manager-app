import { requireAdminPage } from "@/lib/auth/admin-guard";
import { getAllUsers } from "@/lib/domain/admin/queries";
import { AdminTopBar } from "@/components/organisms/AdminTopBar";
import { AdminUserList } from "./_components/AdminUserList";

export const metadata = { title: "회원 관리 — 관리자" };

export default async function AdminUsersPage() {
  const accountId = await requireAdminPage();
  const users = await getAllUsers();
  const activeCount = users.filter((u) => u.activation).length;

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
        title="회원 관리"
        subtitle={`활성 ${activeCount}명 · 전체 ${users.length}명`}
      />

      <div
        style={{
          flex: 1,
          padding:
            "16px calc(16px + env(safe-area-inset-right)) calc(48px + env(safe-area-inset-bottom)) calc(16px + env(safe-area-inset-left))",
        }}
      >
        <AdminUserList users={users} currentAccountId={accountId} />
      </div>
    </div>
  );
}
