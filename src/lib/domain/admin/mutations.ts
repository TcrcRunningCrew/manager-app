import { supabaseServer } from "@/lib/supabase/server";

export async function setUserAdminStatus(accountId: string, isAdmin: boolean): Promise<void> {
  const { error } = await supabaseServer
    .from("user")
    .update({ isAdmin })
    .eq("accountId", accountId);

  if (error) throw error;
}

export async function setUserActivation(accountId: string, activation: boolean): Promise<void> {
  const { error } = await supabaseServer
    .from("user")
    .update({ activation })
    .eq("accountId", accountId);

  if (error) throw error;
}
