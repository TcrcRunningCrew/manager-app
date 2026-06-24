import { unstable_cache } from "next/cache";
import { supabaseServer } from "@/lib/supabase/server";

// 랭킹 집계 쿼리는 month 단위로 캐시한다.
// 출석 mutation (insert / update / delete) 후 호출자가 revalidateTag(MEETING_CACHE_TAG)
// 로 무효화해 다음 조회 시 최신 데이터를 가져오도록 한다.
export const MEETING_CACHE_TAG = "meeting-aggregate";
const CACHE_REVALIDATE_SECONDS = 60 * 60; // 1h fallback — mutation 시 즉시 무효화 외에 보험

export async function findExistingMeeting(params: {
  accountId: string;
  meetingDate: string;
  activation: string;
  location: string;
}) {
  const { accountId, meetingDate, activation, location } = params;
  const { data, error } = await supabaseServer
    .from("meeting")
    .select("_id")
    .eq("accountId", accountId)
    .eq("meeting_date", meetingDate)
    .eq("activation", activation)
    .eq("location", location)
    .limit(1);

  if (error) throw error;
  return data && data.length > 0;
}

export const getMeetingsByDateRange = unstable_cache(
  async (startDay: string, endDay: string) => {
    const { data, error } = await supabaseServer
      .from("meeting")
      .select("name, birthYear, founder")
      .gte("meeting_date", startDay)
      .lte("meeting_date", endDay);

    if (error) throw error;
    return data;
  },
  ["meeting-by-date-range"],
  { tags: [MEETING_CACHE_TAG], revalidate: CACHE_REVALIDATE_SECONDS },
);

export const getParticipationByDateRange = unstable_cache(
  async (startDay: string, endDay: string) => {
    const { data, error } = await supabaseServer
      .from("meeting")
      .select("name, birthYear")
      .gte("meeting_date", startDay)
      .lte("meeting_date", endDay);

    if (error) throw error;
    return data;
  },
  ["meeting-participation-by-date-range"],
  { tags: [MEETING_CACHE_TAG], revalidate: CACHE_REVALIDATE_SECONDS },
);

export const getFounderMeetingsByDateRange = unstable_cache(
  async (startDay: string, endDay: string) => {
    const { data, error } = await supabaseServer
      .from("meeting")
      .select("name, birthYear")
      .eq("founder", true)
      .gte("meeting_date", startDay)
      .lte("meeting_date", endDay);

    if (error) throw error;
    return data;
  },
  ["meeting-founder-by-date-range"],
  { tags: [MEETING_CACHE_TAG], revalidate: CACHE_REVALIDATE_SECONDS },
);

// 본인 한 명의 월간 카운트는 데이터셋이 작아 캐시하지 않는다 (홈 진입마다 즉시 신선).
export async function getUserMonthlyCounts(params: {
  accountId: string;
  startDay: string;
  endDay: string;
}) {
  const { accountId, startDay, endDay } = params;
  const { data, error } = await supabaseServer
    .from("meeting")
    .select("founder")
    .eq("accountId", accountId)
    .gte("meeting_date", startDay)
    .lte("meeting_date", endDay);

  if (error) throw error;
  const rows = data ?? [];
  return {
    participation: rows.length,
    founder: rows.filter((r) => r.founder).length,
  };
}
