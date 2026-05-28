import { supabaseServer } from "@/lib/supabase/server";

export async function createUser(user: {
  name: string;
  birthYear: string;
  email: string;
  accountId: string;
}) {
  const { name, birthYear, email, accountId } = user;

  // accountId UNIQUE 제약을 활용한 upsert. 동시 가입/재시도에서도 안전.
  const { error, data } = await supabaseServer
    .from("user")
    .upsert(
      [{ name, birthYear, email, accountId, activation: true }],
      { onConflict: "accountId" }
    )
    .select()
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
  const { name, birthYear, email, accountId } = user;

  const { error, data } = await supabaseServer
    .from("user")
    .update({ name, birthYear, email })
    .eq("accountId", accountId)
    .select();

  if (error) throw error;
  if (!data || data.length === 0) {
    throw new Error(`updateUserInfo: no row matched accountId=${accountId}`);
  }
  return data[0];
}
