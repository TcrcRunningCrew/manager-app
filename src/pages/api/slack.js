
export default async function handler(req, res) {
    const slackWebhookUrl = process.env.NEXT_PUBLIC_SLACK_WEB_HOOK_URL; // .env 파일 또는 환경변수에서 Webhook URL을 가져옵니다.
  
    // 클라이언트에서 전송된 데이터를 사용하여 Slack에 요청을 보냅니다.
    const result = await fetch(slackWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: req.body }),
    });
  
    if (result.ok) {
      return res.status(200).json({ success: true });
    } else {
      return res.status(500).json({ success: false });
    }
  }
  