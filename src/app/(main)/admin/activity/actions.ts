"use server";

import { revalidatePath } from "next/cache";
import { requireAdminAction } from "@/lib/auth/admin-guard";
import { updateMeeting, deleteMeeting, type MeetingUpdate } from "@/lib/domain/meeting/mutations";
import { getCheckoutsPage, type CheckoutFilter, type RecentCheckout } from "@/lib/domain/admin/queries";

const ALLOWED_ACTIVATION = new Set(["1", "2", "3", "4"]);
const ALLOWED_LOCATION = new Set(["1", "2", "3", "4", "5", "6", "7", "8"]);

export async function updateMeetingAction(
  id: string | number,
  changes: MeetingUpdate,
): Promise<{ ok: true } | { ok: false; message: string }> {
  try {
    await requireAdminAction();

    if (changes.meeting_date !== undefined && !/^\d{4}-\d{2}-\d{2}$/.test(changes.meeting_date)) {
      return { ok: false, message: "참여일 형식이 올바르지 않습니다." };
    }
    if (
      changes.meeting_time !== undefined &&
      changes.meeting_time !== null &&
      !/^\d{2}:\d{2}$/.test(changes.meeting_time)
    ) {
      return { ok: false, message: "모임 개설 시간 형식이 올바르지 않습니다." };
    }
    if (changes.activation !== undefined && !ALLOWED_ACTIVATION.has(changes.activation)) {
      return { ok: false, message: "운동 종류가 올바르지 않습니다." };
    }
    if (changes.location !== undefined && !ALLOWED_LOCATION.has(changes.location)) {
      return { ok: false, message: "장소가 올바르지 않습니다." };
    }

    await updateMeeting(id, changes);
    revalidatePath("/admin/activity");
    return { ok: true };
  } catch (e) {
    console.error("[admin/activity] updateMeeting failed", e);
    return { ok: false, message: "수정 중 오류가 발생했습니다." };
  }
}

export async function deleteMeetingAction(
  id: string | number,
): Promise<{ ok: true } | { ok: false; message: string }> {
  try {
    await requireAdminAction();
    await deleteMeeting(id);
    revalidatePath("/admin/activity");
    return { ok: true };
  } catch (e) {
    console.error("[admin/activity] deleteMeeting failed", e);
    return { ok: false, message: "삭제 중 오류가 발생했습니다." };
  }
}

export async function fetchMoreCheckoutsAction(params: {
  filter: CheckoutFilter;
  offset: number;
  limit: number;
}): Promise<{ ok: true; items: RecentCheckout[]; hasMore: boolean } | { ok: false; message: string }> {
  try {
    await requireAdminAction();
    const safeLimit = Math.min(Math.max(params.limit, 1), 100);
    const safeOffset = Math.max(params.offset, 0);
    const { items, hasMore } = await getCheckoutsPage({
      filter: params.filter,
      limit: safeLimit,
      offset: safeOffset,
    });
    return { ok: true, items, hasMore };
  } catch (e) {
    console.error("[admin/activity] fetchMore failed", e);
    return { ok: false, message: "추가 데이터를 불러오지 못했습니다." };
  }
}
