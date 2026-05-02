import { NextRequest, NextResponse } from "next/server";
import { sendSlackNotification } from "@/lib/domain/slack/notifications";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    await sendSlackNotification(typeof body === "string" ? body : JSON.stringify(body));
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
