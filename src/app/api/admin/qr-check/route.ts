import { NextRequest, NextResponse } from "next/server";
import { findUserByAccountId } from "@/lib/domain/user/queries";
import { insertMeeting } from "@/lib/domain/meeting/mutations";
import { currentTimeKST } from "@/lib/time";

export async function POST(request: NextRequest) {
  const {
    userId,
    username,
    userEmail,
    participationDate,
    participationTime,
    activation,
    location,
    isFounder,
  } = await request.json();

  const isUser = await findUserByAccountId(userId);

  if (isUser && isUser.length > 0 && isUser[0].activation === true) {
    const userAge = isUser[0].birthYear;
    // QR 스캔은 시간 입력 폼이 없으므로 서버 KST 현재 시각으로 채움
    const meetingTime =
      typeof participationTime === "string" && /^\d{2}:\d{2}$/.test(participationTime)
        ? participationTime
        : currentTimeKST();

    await insertMeeting({
      accountId: userId,
      name: username,
      email: userEmail,
      birthYear: userAge,
      meeting_date: participationDate,
      meeting_time: meetingTime,
      activation,
      location,
      founder: isFounder,
    });

    return NextResponse.json({ message: "출석체크가 성공적으로 완료되었습니다." });
  }

  return NextResponse.json({ error: "출석체크 실패" }, { status: 401 });
}
