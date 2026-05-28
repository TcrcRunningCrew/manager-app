import { requireAdminPage } from "@/lib/auth/admin-guard";
import { getCheckoutsPage } from "@/lib/domain/admin/queries";
import { AdminTopBar } from "@/components/organisms/AdminTopBar";
import { AdminActivityList } from "./_components/AdminActivityList";

export const metadata = { title: "최근 출석 — 관리자" };

const PAGE_SIZE = 30;

function normalizeDate(value: string | string[] | undefined): string | null {
  const v = Array.isArray(value) ? value[0] : value;
  if (!v) return null;
  return /^\d{4}-\d{2}-\d{2}$/.test(v) ? v : null;
}

export default async function AdminActivityPage({
  searchParams,
}: {
  searchParams?: { from?: string; to?: string };
}) {
  await requireAdminPage();

  const from = normalizeDate(searchParams?.from);
  const to = normalizeDate(searchParams?.to);

  const { items, hasMore } = await getCheckoutsPage({
    filter: { from, to },
    limit: PAGE_SIZE,
    offset: 0,
  });

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
        title="최근 출석"
        subtitle="행을 탭하면 수정/삭제 · 스크롤하면 더 보기"
      />

      <div
        style={{
          flex: 1,
          padding:
            "16px calc(16px + env(safe-area-inset-right)) calc(48px + env(safe-area-inset-bottom)) calc(16px + env(safe-area-inset-left))",
        }}
      >
        <AdminActivityList
          initialItems={items}
          initialHasMore={hasMore}
          pageSize={PAGE_SIZE}
          initialFilter={{ from, to }}
        />
      </div>
    </div>
  );
}
