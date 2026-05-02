import { supabaseServer } from "@/lib/supabase/server";

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
