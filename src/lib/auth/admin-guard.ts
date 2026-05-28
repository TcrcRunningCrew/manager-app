import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { isAdminUser } from "@/lib/domain/admin/queries";

/**
 * RSC 페이지 가드: 관리자가 아니면 / 로 리다이렉트. 통과 시 session.user.id 반환.
 */
export async function requireAdminPage(): Promise<string> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/");
  const ok = await isAdminUser(session.user.id);
  if (!ok) redirect("/");
  return session.user.id;
}

/**
 * Server Action 가드: 관리자가 아니면 throw. 통과 시 accountId 반환.
 */
export async function requireAdminAction(): Promise<string> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Unauthorized");
  const ok = await isAdminUser(session.user.id);
  if (!ok) throw new Error("Forbidden");
  return session.user.id;
}
