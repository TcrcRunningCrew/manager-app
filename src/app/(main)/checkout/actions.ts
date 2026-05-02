"use server";

import { findUserByAccountId } from "@/lib/domain/user/queries";
import { insertMeeting } from "@/lib/domain/meeting/mutations";
import { sendSlackNotification } from "@/lib/domain/slack/notifications";

export async function checkoutAction(params: {
  userId: string;
  username: string;
  userEmail: string;
  userAge: string;
  participationDate: string;
  activation: string;
  location: string;
  isFounder: boolean;
}) {
  const {
    userId,
    username,
    userEmail,
    userAge,
    participationDate,
    activation,
    location,
    isFounder,
  } = params;

  const data = await findUserByAccountId(userId);

  if (!data || data.length === 0) {
    return { success: false, message: "회원이 아닙니다. 회원가입 바랍니다" };
  }

  const result = await insertMeeting({
    accountId: userId,
    name: username,
    email: userEmail,
    birthYear: userAge,
    meeting_date: participationDate,
    activation,
    location,
    founder: isFounder,
  });

  if (result) {
    await sendSlackNotification(
      `출석/${participationDate}/${username}/${userAge}/${userEmail}/activation: ${activation}/location:${location}/founder: ${isFounder}`
    );
    return { success: true, message: "출석 완료" };
  }

  return { success: false, message: "출석체크 에러 운영진 문의" };
}
