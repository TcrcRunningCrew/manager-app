"use server";

import { revalidatePath } from "next/cache";
import { requireAdminAction } from "@/lib/auth/admin-guard";
import { setUserAdminStatus, setUserActivation } from "@/lib/domain/admin/mutations";
import { findUserByAccountId } from "@/lib/domain/user/queries";
import { insertMeeting } from "@/lib/domain/meeting/mutations";
import { findExistingMeeting } from "@/lib/domain/meeting/queries";
import { sendDiscordNotification } from "@/lib/domain/discord/notifications";
import { sendPushToAdmins } from "@/lib/push/vapid";
import { kstNotificationFromDateTime } from "@/lib/time";

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

export async function toggleAdminAction(accountId: string, isAdmin: boolean) {
  await requireAdminAction();
  await setUserAdminStatus(accountId, isAdmin);
  revalidatePath("/admin/users");
  return { ok: true };
}

export async function toggleActivationAction(accountId: string, activation: boolean) {
  await requireAdminAction();
  await setUserActivation(accountId, activation);
  revalidatePath("/admin/users");
  return { ok: true };
}

/**
 * 운영진이 특정 회원을 대신 출석체크.
 * 회원이 폰을 못 가져온 경우를 위해.
 */
export async function proxyCheckoutAction(params: {
  accountId: string;
  participationDate: string;
  participationTime: string;
  activation: string;
  location: string;
  isFounder: boolean;
}): Promise<{ ok: true } | { ok: false; message: string }> {
  try {
    const adminId = await requireAdminAction();
    const { accountId, participationDate, participationTime, activation, location, isFounder } = params;

    if (!/^\d{4}-\d{2}-\d{2}$/.test(participationDate)) {
      return { ok: false, message: "참여일 형식이 올바르지 않습니다." };
    }
    if (!/^\d{2}:\d{2}$/.test(participationTime)) {
      return { ok: false, message: "모임 개설 시간 형식이 올바르지 않습니다." };
    }
    if (!ALLOWED_ACTIVATION.has(activation)) {
      return { ok: false, message: "운동 종류가 올바르지 않습니다." };
    }
    if (!ALLOWED_LOCATION.has(location)) {
      return { ok: false, message: "장소가 올바르지 않습니다." };
    }

    const found = await findUserByAccountId(accountId);
    if (!found || found.length === 0) {
      return { ok: false, message: "해당 회원을 찾을 수 없습니다." };
    }
    const target = found[0] as { name: string | null; email: string | null; birthYear: number | string | null };
    const username = target.name ?? "";
    const userEmail = target.email ?? "";
    const userAge = String(target.birthYear ?? "");

    const already = await findExistingMeeting({
      accountId,
      meetingDate: participationDate,
      activation,
      location,
    });
    if (already) {
      return { ok: false, message: "이미 출석체크가 완료된 항목입니다." };
    }

    await insertMeeting({
      accountId,
      name: username,
      email: userEmail,
      birthYear: userAge,
      meeting_date: participationDate,
      meeting_time: participationTime,
      activation,
      location,
      founder: isFounder,
    });

    // 비치명적 알림
    try {
      await sendDiscordNotification(
        `대리출석/${participationDate} ${participationTime}/${username}/${userAge}/${userEmail}/장소:${location}/개설자:${isFounder}/by ${adminId}`
      );
    } catch (e) {
      console.error("[admin/users] discord notification failed", e);
    }

    try {
      const { month, day, hour, minute } = kstNotificationFromDateTime(participationDate, participationTime);
      const locationLabel = LOCATION_MAP[location] ?? location;
      await sendPushToAdmins({
        title: "🏃 출석 알림 (대리)",
        body: `${username}님이 ${locationLabel}에서 ${month}월 ${day}일 ${hour}:${minute} 출석했습니다 (대리)`,
        url: "/admin/activity",
      });
    } catch (e) {
      console.error("[admin/users] push failed", e);
    }

    revalidatePath("/admin/users");
    revalidatePath("/admin/activity");
    return { ok: true };
  } catch (e) {
    console.error("[admin/users] proxyCheckout failed", e);
    return { ok: false, message: "대리 출석 중 오류가 발생했습니다." };
  }
}
