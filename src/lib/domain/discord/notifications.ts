export async function sendDiscordNotification(message: string) {
  const url =
    process.env.DISCORD_WEBHOOK_URL ||
    process.env.NEXT_DISCORD_WEB_HOOK_URL ||
    "";

  if (!url) {
    console.warn("[discord] webhook URL not configured; skipping");
    return;
  }

  // Discord webhook payload: { content } (max 2000 chars)
  const content = message.length > 1990 ? message.slice(0, 1990) + "…" : message;

  const result = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content }),
  });

  if (!result.ok) {
    throw new Error("Discord notification failed");
  }
}
