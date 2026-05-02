import { supabaseServer } from "@/lib/supabase/server";

export async function createUser(user: {
  name: string;
  birthYear: string;
  email: string;
  accountId: string;
}) {
  const { name, birthYear, email, accountId } = user;

  const { error, data } = await supabaseServer
    .from("user")
    .insert([{ name, birthYear, email, accountId, activation: true }])
    .single();

  if (error) throw error;
  return data;
}

export async function updateUserInfo(user: {
  name: string;
  birthYear: string;
  email: string;
  accountId: string;
}) {
  const { birthYear, email, accountId } = user;

  const { error, data } = await supabaseServer
    .from("user")
    .update({ birthYear })
    .eq("accountId", accountId)
    .eq("email", email);

  if (error) throw error;
  return data;
}
