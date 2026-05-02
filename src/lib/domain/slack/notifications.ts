const SLACK_WEBHOOK_URL = process.env.NEXT_PUBLIC_SLACK_WEB_HOOK_URL || "";

export async function sendSlackNotification(message: string) {
  const result = await fetch(SLACK_WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: message }),
  });

  if (!result.ok) {
    throw new Error("Slack notification failed");
  }
}
