"use server";

import { findUserByAccountId } from "@/lib/domain/user/queries";
import { insertMeeting } from "@/lib/domain/meeting/mutations";
import { sendSlackNotification } from "@/lib/domain/slack/notifications";
import {
  getParticipationByDateRange,
  getFounderMeetingsByDateRange,
} from "@/lib/domain/meeting/queries";

export type CheckoutRankingData = {
  monthlyCount: number;
  participationRank: number | null;
  participationTotal: number;
  founderRank: number | null;
  founderTotal: number;
};

function getCurrentMonthRange() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const pad = (n: number) => String(n).padStart(2, "0");
  const startDay = `${year}-${pad(month)}-01`;
  const lastDay = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const endDay = `${year}-${pad(month)}-${pad(lastDay)}`;
  return { startDay, endDay };
}

export async function checkoutAction(params: {
  userId: string;
  username: string;
  userEmail: string;
  userAge: string;
  participationDate: string;
  activation: string;
  location: string;
  isFounder: boolean;
}): Promise<{ success: boolean; message: string; rankingData?: CheckoutRankingData }> {
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

    // Fetch current month rankings for success modal
    const { startDay, endDay } = getCurrentMonthRange();
    const [partMeetings, founderMeetings] = await Promise.all([
      getParticipationByDateRange(startDay, endDay),
      getFounderMeetingsByDateRange(startDay, endDay),
    ]);

    const userKey = `${username}-${userAge}`;

    // Participation ranking
    const partMap: Record<string, number> = {};
    for (const m of partMeetings) {
      const k = `${m.name}-${m.birthYear}`;
      partMap[k] = (partMap[k] || 0) + 1;
    }
    const partRanked = Object.entries(partMap).sort(([, a], [, b]) => b - a);
    const monthlyCount = partMap[userKey] || 0;
    const partRankIdx = partRanked.findIndex(([k]) => k === userKey);
    const participationRank = partRankIdx >= 0 ? partRankIdx + 1 : null;
    const participationTotal = partRanked.length;

    // Founder ranking
    const founderMap: Record<string, number> = {};
    for (const m of founderMeetings) {
      const k = `${m.name}-${m.birthYear}`;
      founderMap[k] = (founderMap[k] || 0) + 1;
    }
    const founderRanked = Object.entries(founderMap).sort(([, a], [, b]) => b - a);
    const founderRankIdx = founderRanked.findIndex(([k]) => k === userKey);
    const founderRank = founderRankIdx >= 0 ? founderRankIdx + 1 : null;
    const founderTotal = founderRanked.length;

    return {
      success: true,
      message: "출석 완료",
      rankingData: {
        monthlyCount,
        participationRank,
        participationTotal,
        founderRank,
        founderTotal,
      },
    };
  }

  return { success: false, message: "출석체크 에러 운영진 문의" };
}
