"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { findUserByAccountId } from "@/lib/domain/user/queries";
import { insertMeeting } from "@/lib/domain/meeting/mutations";
import { sendDiscordNotification } from "@/lib/domain/discord/notifications";
import { sendPushToAdmins } from "@/lib/push/vapid";
import {
  getParticipationByDateRange,
  getFounderMeetingsByDateRange,
  findExistingMeeting,
} from "@/lib/domain/meeting/queries";
import {
  currentYearMonthKST,
  formatYM,
  monthRangeFromYM,
  kstNotificationFromDateTime,
} from "@/lib/time";

export type CheckoutRankingData = {
  monthlyCount: number;
  participationRank: number | null;
  participationTotal: number;
  founderRank: number | null;
  founderTotal: number;
};

function getCurrentMonthRange() {
  return monthRangeFromYM(formatYM(currentYearMonthKST()));
}

const ALLOWED_ACTIVATION = new Set(["1", "2", "3", "4"]);
const ALLOWED_LOCATION = new Set(["1", "2", "3", "4", "5", "6", "7", "8"]);

const LOCATION_MAP: Record<string, string> = {
  "1": "태평_탄천",
  "2": "서현_황새울공원",
  "3": "야탑_탄천종합운동장",
  "4": "모란_성남종합운동장",
  "5": "위례",
  "6": "정자",
  "7": "판교",
  "8": "그 외",
};

export async function checkoutAction(params: {
  participationDate: string;
  participationTime: string;
  activation: string;
  location: string;
  isFounder: boolean | string;
}): Promise<{ success: boolean; message: string; rankingData?: CheckoutRankingData }> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return { success: false, message: "로그인이 필요합니다." };
    }

    const { participationDate, participationTime, activation, location } = params;
    const isFounder = params.isFounder === true || params.isFounder === "true";

    if (!/^\d{4}-\d{2}-\d{2}$/.test(participationDate)) {
      return { success: false, message: "참여일 형식이 올바르지 않습니다." };
    }
    if (!/^\d{2}:\d{2}$/.test(participationTime)) {
      return { success: false, message: "참여 시각 형식이 올바르지 않습니다." };
    }
    if (!ALLOWED_ACTIVATION.has(activation)) {
      return { success: false, message: "운동 종류가 올바르지 않습니다." };
    }
    if (!ALLOWED_LOCATION.has(location)) {
      return { success: false, message: "장소가 올바르지 않습니다." };
    }

    const userId = session.user.id;
    const data = await findUserByAccountId(userId);
    if (!data || data.length === 0) {
      return { success: false, message: "회원이 아닙니다. 회원가입 바랍니다" };
    }

    const dbUser = data[0] as {
      name: string | null;
      email: string | null;
      birthYear: number | string | null;
    };
    const username = dbUser.name ?? session.user.name ?? "";
    const userEmail = dbUser.email ?? session.user.email ?? "";
    const userAge = String(dbUser.birthYear ?? session.user.birthYear ?? "");

    const alreadyChecked = await findExistingMeeting({
      accountId: userId,
      meetingDate: participationDate,
      activation,
      location,
    });
    if (alreadyChecked) {
      return { success: false, message: "이미 출석체크가 완료된 항목입니다." };
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

    if (!result) {
      return { success: false, message: "출석체크 에러 운영진 문의" };
    }

    // Discord 알림은 비치명적: 실패해도 출석은 성공 처리
    try {
      await sendDiscordNotification(
        `출석/${participationDate}/${username}/${userAge}/${userEmail}/activation: ${activation}/location:${location}/founder: ${isFounder}`
      );
    } catch (e) {
      console.error("[checkout] discord notification failed:", e);
    }

    // 운영진 푸시 알림 (비치명적). 시각은 폼에서 입력한 KST 기준 참여 시각.
    try {
      const { month, day, hour, minute } = kstNotificationFromDateTime(
        participationDate,
        participationTime,
      );
      const locationLabel = LOCATION_MAP[location] ?? location;

      await sendPushToAdmins({
        title: "🏃 출석 알림",
        body: `${username}님이 ${locationLabel}에서 ${month}월 ${day}일 ${hour}:${minute} 출석했습니다`,
        url: "/admin",
      });
    } catch (e) {
      console.error("[checkout] push notification failed:", e);
    }

    let rankingData: CheckoutRankingData = {
      monthlyCount: 0,
      participationRank: null,
      participationTotal: 0,
      founderRank: null,
      founderTotal: 0,
    };

    try {
      const { startDay, endDay } = getCurrentMonthRange();
      const [partMeetings, founderMeetings] = await Promise.all([
        getParticipationByDateRange(startDay, endDay),
        getFounderMeetingsByDateRange(startDay, endDay),
      ]);

      const userKey = `${username}-${userAge}`;

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

      const founderMap: Record<string, number> = {};
      for (const m of founderMeetings) {
        const k = `${m.name}-${m.birthYear}`;
        founderMap[k] = (founderMap[k] || 0) + 1;
      }
      const founderRanked = Object.entries(founderMap).sort(([, a], [, b]) => b - a);
      const founderRankIdx = founderRanked.findIndex(([k]) => k === userKey);
      const founderRank = founderRankIdx >= 0 ? founderRankIdx + 1 : null;
      const founderTotal = founderRanked.length;

      rankingData = {
        monthlyCount,
        participationRank,
        participationTotal,
        founderRank,
        founderTotal,
      };
    } catch (e) {
      console.error("[checkout] ranking calc failed:", e);
    }

    return { success: true, message: "출석 완료", rankingData };
  } catch (e) {
    console.error("[checkout] unexpected error:", e);
    return { success: false, message: "출석체크 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요." };
  }
}
