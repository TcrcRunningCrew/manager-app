import fetch from 'node-fetch';


const slackWebhookUrl = process.env.NEXT_SLACK_WEB_HOOK_URL || "";

export default async function sendSlackMessage(message) {
  try {
    const response = await fetch(slackWebhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: message }),
    });
    console.log("Slack으로 메시지가 전송되었습니다.");
  } catch (error) {
    console.error("Slack 메시지 전송 중 오류가 발생했습니다:", error);
  }
}
