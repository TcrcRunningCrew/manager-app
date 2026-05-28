import { NextRequest, NextResponse } from "next/server";
import { sendDiscordNotification } from "@/lib/domain/discord/notifications";

// 경로명은 하위 호환을 위해 /api/slack 유지하지만 내부는 Discord webhook 사용
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    await sendDiscordNotification(typeof body === "string" ? body : JSON.stringify(body));
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
