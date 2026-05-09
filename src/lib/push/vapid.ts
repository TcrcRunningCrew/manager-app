import webpush from "web-push";
import { getAdminSubscriptions } from "@/lib/domain/push/subscriptions";

const publicKey = process.env.VAPID_PUBLIC_KEY ?? "";
const privateKey = process.env.VAPID_PRIVATE_KEY ?? "";
const subject = process.env.VAPID_SUBJECT ?? "mailto:admin@tcrc.com";

if (publicKey && privateKey) {
  webpush.setVapidDetails(subject, publicKey, privateKey);
}

export type PushPayload = {
  title: string;
  body: string;
  url?: string;
};

export async function sendPushToAdmins(payload: PushPayload): Promise<void> {
  if (!publicKey || !privateKey) {
    console.warn("[push] VAPID keys not configured; skipping push");
    return;
  }

  const subscriptions = await getAdminSubscriptions();
  if (subscriptions.length === 0) return;

  const results = await Promise.allSettled(
    subscriptions.map((sub) =>
      webpush.sendNotification(
        sub.subscription as webpush.PushSubscription,
        JSON.stringify(payload)
      )
    )
  );

  const failed = results.filter((r) => r.status === "rejected");
  if (failed.length > 0) {
    console.warn(`[push] ${failed.length}/${subscriptions.length} push(es) failed`);
  }
}
