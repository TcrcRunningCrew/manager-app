import { supabaseServer } from "@/lib/supabase/server";

export async function findUserByAccountId(accountId: string) {
  const { data, error } = await supabaseServer
    .from("user")
    .select("*")
    .eq("accountId", accountId);

  if (error) throw error;
  return data;
}

export async function findUser(email: string, name: string) {
  const { data, error } = await supabaseServer
    .from("user")
    .select("*")
    .eq("email", email)
    .eq("name", name);

  if (error) throw error;
  return data;
}

export async function getActiveUsers() {
  const { data, error } = await supabaseServer
    .from("user")
    .select("name, birthYear")
    .eq("activation", true);

  if (error) throw error;
  return data;
}
