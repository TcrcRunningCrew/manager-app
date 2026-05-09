import { supabaseServer } from "@/lib/supabase/server";

export type AdminUser = {
  accountId: string;
  name: string;
  email: string;
  birthYear: string;
  activation: boolean;
  isAdmin: boolean;
};

export async function getAllUsers(): Promise<AdminUser[]> {
  const { data, error } = await supabaseServer
    .from("user")
    .select("accountId, name, email, birthYear, activation, isAdmin")
    .order("name");

  if (error) throw error;
  return (data ?? []) as AdminUser[];
}

export async function isAdminUser(accountId: string): Promise<boolean> {
  const { data, error } = await supabaseServer
    .from("user")
    .select("isAdmin")
    .eq("accountId", accountId)
    .single();

  if (error) return false;
  return data?.isAdmin === true;
}

export type RecentCheckout = {
  name: string;
  birthYear: string;
  meeting_date: string;
  activation: string;
  location: string;
  founder: boolean;
};

export async function getRecentCheckouts(limit = 30): Promise<RecentCheckout[]> {
  const { data, error } = await supabaseServer
    .from("meeting")
    .select("name, birthYear, meeting_date, activation, location, founder")
    .order("meeting_date", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data ?? []) as RecentCheckout[];
}

export async function getAdminPushStatus(): Promise<{ accountId: string; name: string; hasSub: boolean }[]> {
  // Step 1: 운영진 목록
  const { data: admins, error: adminError } = await supabaseServer
    .from("user")
    .select("accountId, name")
    .eq("isAdmin", true);

  if (adminError || !admins) return [];

  if (admins.length === 0) return [];

  // Step 2: 구독 목록
  const adminIds = admins.map((a: any) => a.accountId);
  const { data: subs } = await supabaseServer
    .from("push_subscriptions")
    .select("account_id")
    .in("account_id", adminIds);

  const subsSet = new Set((subs ?? []).map((s: any) => s.account_id));

  return admins.map((a: any) => ({
    accountId: a.accountId,
    name: a.name,
    hasSub: subsSet.has(a.accountId),
  }));
}
