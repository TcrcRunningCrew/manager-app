"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { isAdminUser } from "@/lib/domain/admin/queries";
import { setUserAdminStatus, setUserActivation } from "@/lib/domain/admin/mutations";
import { sendPushToAdmins } from "@/lib/push/vapid";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Unauthorized");
  const ok = await isAdminUser(session.user.id);
  if (!ok) throw new Error("Forbidden");
  return session.user.id;
}

export async function toggleAdminAction(accountId: string, isAdmin: boolean) {
  await requireAdmin();
  await setUserAdminStatus(accountId, isAdmin);
  revalidatePath("/admin");
  return { ok: true };
}

export async function toggleActivationAction(accountId: string, activation: boolean) {
  await requireAdmin();
  await setUserActivation(accountId, activation);
  revalidatePath("/admin");
  return { ok: true };
}

export async function sendTestPushAction() {
  await requireAdmin();
  await sendPushToAdmins({
    title: "테스트 알림",
    body: "푸시 알림이 정상적으로 작동합니다!",
    url: "/admin",
  });
  return { ok: true };
}
