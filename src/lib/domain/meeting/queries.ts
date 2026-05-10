import { supabaseServer } from "@/lib/supabase/server";

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

export async function getMeetingsByDateRange(startDay: string, endDay: string) {
  const { data, error } = await supabaseServer
    .from("meeting")
    .select("name, birthYear, founder")
    .gte("meeting_date", startDay)
    .lte("meeting_date", endDay);

  if (error) throw error;
  return data;
}

export async function getParticipationByDateRange(startDay: string, endDay: string) {
  const { data, error } = await supabaseServer
    .from("meeting")
    .select("name, birthYear")
    .gte("meeting_date", startDay)
    .lte("meeting_date", endDay);

  if (error) throw error;
  return data;
}

export async function getFounderMeetingsByDateRange(startDay: string, endDay: string) {
  const { data, error } = await supabaseServer
    .from("meeting")
    .select("name, birthYear")
    .eq("founder", true)
    .gte("meeting_date", startDay)
    .lte("meeting_date", endDay);

  if (error) throw error;
  return data;
}
