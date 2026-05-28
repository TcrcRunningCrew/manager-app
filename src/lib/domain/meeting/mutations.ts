import { supabaseServer } from "@/lib/supabase/server";

export type MeetingUpdate = {
  meeting_date?: string;
  meeting_time?: string | null;
  activation?: string;
  location?: string;
  founder?: boolean;
};

export async function updateMeeting(id: string | number, changes: MeetingUpdate) {
  if (Object.keys(changes).length === 0) {
    throw new Error("updateMeeting: 변경 사항이 없습니다.");
  }
  const { data, error } = await supabaseServer
    .from("meeting")
    .update(changes)
    .eq("_id", id)
    .select();

  if (error) throw error;
  if (!data || data.length === 0) {
    throw new Error(`updateMeeting: no row matched _id=${id}`);
  }
  return data[0];
}

export async function deleteMeeting(id: string | number) {
  const { error, count } = await supabaseServer
    .from("meeting")
    .delete({ count: "exact" })
    .eq("_id", id);

  if (error) throw error;
  if (count === 0) {
    throw new Error(`deleteMeeting: no row matched _id=${id}`);
  }
}

export async function insertMeeting(params: {
  accountId: string;
  name: string;
  email: string;
  birthYear: string;
  meeting_date: string;
  meeting_time?: string | null;
  activation: string;
  location: string;
  founder: boolean;
}) {
  const { data, error } = await supabaseServer
    .from("meeting")
    .insert(params)
    .select();

  if (error) throw error;
  return data;
}
