import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import {
  isAdminUser,
  getAllUsers,
  getRecentCheckouts,
  getAdminPushStatus,
} from "@/lib/domain/admin/queries";
import { AdminUserList } from "./_components/AdminUserList";
import { AdminPushSettings } from "./_components/AdminPushSettings";
import { AdminActivityLog } from "./_components/AdminActivityLog";

export const metadata = { title: "관리자 — T.C.R.C" };

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/");

  const ok = await isAdminUser(session.user.id);
  if (!ok) redirect("/");

  const [users, checkouts, adminPushStatus] = await Promise.all([
    getAllUsers(),
    getRecentCheckouts(30),
    getAdminPushStatus(),
  ]);

  const sectionLabel: React.CSSProperties = {
    fontSize: 11,
    fontWeight: 700,
    color: "var(--tcrc-text-tertiary)",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    marginBottom: 12,
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        background: "var(--tcrc-bg-primary)",
        color: "var(--tcrc-text-primary)",
      }}
    >
      {/* 헤더 */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 40,
          background: "var(--tcrc-bg-primary)",
          borderBottom: "1px solid var(--tcrc-line)",
          padding: "14px 20px",
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <a
          href="/"
          style={{
            color: "var(--tcrc-text-primary)",
            textDecoration: "none",
            fontSize: 22,
            lineHeight: 1,
            padding: "4px 8px",
          }}
        >
          ←
        </a>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 800, fontSize: 17, letterSpacing: "-0.02em" }}>
            관리자 패널
          </div>
          <div style={{ color: "var(--tcrc-text-tertiary)", fontSize: 11, marginTop: 1 }}>
            T.C.R.C 운영진 전용
          </div>
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
          }}
        >
          ADMIN
        </div>
      </header>

      {/* 본문 */}
      <div style={{ flex: 1, overflowY: "auto", padding: "20px 16px 48px" }}>

        {/* 푸시 알림 설정 */}
        <section style={{ marginBottom: 32 }}>
          <div style={sectionLabel}>푸시 알림 설정</div>
          <AdminPushSettings adminPushStatus={adminPushStatus} />
        </section>

        {/* 회원 관리 */}
        <section style={{ marginBottom: 32 }}>
          <div style={sectionLabel}>회원 관리 ({users.length}명)</div>
          <AdminUserList users={users} currentAccountId={session.user.id} />
        </section>

        {/* 최근 출석 */}
        <section style={{ marginBottom: 32 }}>
          <div style={sectionLabel}>최근 출석 ({checkouts.length}건)</div>
          <AdminActivityLog checkouts={checkouts} />
        </section>

      </div>
    </div>
  );
}
