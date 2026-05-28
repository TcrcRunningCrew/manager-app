"use server";

import { requireAdminAction } from "@/lib/auth/admin-guard";
import { sendPushToAdmins } from "@/lib/push/vapid";

export async function sendTestPushAction() {
  await requireAdminAction();
  await sendPushToAdmins({
    title: "테스트 알림",
    body: "푸시 알림이 정상적으로 작동합니다!",
    url: "/admin",
  });
  return { ok: true };
}
