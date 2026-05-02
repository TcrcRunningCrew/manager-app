import { NextRequest, NextResponse } from "next/server";
import { findUserByAccountId } from "@/lib/domain/user/queries";
import { insertMeeting } from "@/lib/domain/meeting/mutations";

export async function POST(request: NextRequest) {
  const {
    userId,
    username,
    userEmail,
    participationDate,
    activation,
    location,
    isFounder,
  } = await request.json();

  const isUser = await findUserByAccountId(userId);

  if (isUser && isUser.length > 0 && isUser[0].activation === true) {
    const userAge = isUser[0].birthYear;

    await insertMeeting({
      accountId: userId,
      name: username,
      email: userEmail,
      birthYear: userAge,
      meeting_date: participationDate,
      activation,
      location,
      founder: isFounder,
    });

    return NextResponse.json({ message: "출석체크가 성공적으로 완료되었습니다." });
  }

  return NextResponse.json({ error: "출석체크 실패" }, { status: 401 });
}
