import { supabaseServer } from "@/lib/supabase/server";

export async function insertMeeting(params: {
  accountId: string;
  name: string;
  email: string;
  birthYear: string;
  meeting_date: string;
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
