import { supabaseServer } from "@/lib/supabase/server";
import { formatYMD, todayInKST } from "@/lib/time";

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
  _id: string | number;
  accountId: string;
  name: string;
  birthYear: string;
  meeting_date: string;
  meeting_time: string | null;
  activation: string;
  location: string;
  founder: boolean;
};

export async function getRecentCheckouts(limit = 30): Promise<RecentCheckout[]> {
  const { data, error } = await supabaseServer
    .from("meeting")
    .select("_id, accountId, name, birthYear, meeting_date, meeting_time, activation, location, founder")
    .order("meeting_date", { ascending: false })
    .order("meeting_time", { ascending: false, nullsFirst: false })
    .limit(limit);

  if (error) throw error;
  return (data ?? []) as RecentCheckout[];
}

export type CheckoutFilter = {
  from?: string | null;
  to?: string | null;
};

export async function getCheckoutsPage(params: {
  filter?: CheckoutFilter;
  limit: number;
  offset: number;
}): Promise<{ items: RecentCheckout[]; hasMore: boolean }> {
  const { filter, limit, offset } = params;

  let query = supabaseServer
    .from("meeting")
    .select("_id, accountId, name, birthYear, meeting_date, meeting_time, activation, location, founder")
    .order("meeting_date", { ascending: false })
    .order("meeting_time", { ascending: false, nullsFirst: false })
    .order("_id", { ascending: false });

  if (filter?.from && /^\d{4}-\d{2}-\d{2}$/.test(filter.from)) {
    query = query.gte("meeting_date", filter.from);
  }
  if (filter?.to && /^\d{4}-\d{2}-\d{2}$/.test(filter.to)) {
    query = query.lte("meeting_date", filter.to);
  }

  // limit+1 트릭: 한 건 더 가져와서 hasMore 판단
  const { data, error } = await query.range(offset, offset + limit);

  if (error) throw error;
  const rows = (data ?? []) as RecentCheckout[];
  const hasMore = rows.length > limit;
  return { items: hasMore ? rows.slice(0, limit) : rows, hasMore };
}

export async function getAdminPushStatus(): Promise<{ accountId: string; name: string; hasSub: boolean }[]> {
  const { data: admins, error: adminError } = await supabaseServer
    .from("user")
    .select("accountId, name")
    .eq("isAdmin", true);

  if (adminError || !admins) return [];
  if (admins.length === 0) return [];

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

export type AdminCounts = {
  usersActive: number;
  usersTotal: number;
  recentMeetings30d: number;
  meetingsToday: number;
  adminsTotal: number;
  adminsSubscribed: number;
};

/**
 * 인덱스 카드용 통계. 무거운 데이터는 안 가져오고 카운트만.
 */
export async function getAdminCounts(): Promise<AdminCounts> {
  const today = todayInKST();
  const todayKst = formatYMD(today);
  const from30d = formatYMD(today.subtract({ days: 30 }));

  const [usersTotal, usersActive, meetings30d, meetingsToday, adminsTotal, adminPush] = await Promise.all([
    supabaseServer.from("user").select("*", { count: "exact", head: true }),
    supabaseServer.from("user").select("*", { count: "exact", head: true }).eq("activation", true),
    supabaseServer.from("meeting").select("*", { count: "exact", head: true }).gte("meeting_date", from30d),
    supabaseServer.from("meeting").select("*", { count: "exact", head: true }).eq("meeting_date", todayKst),
    supabaseServer.from("user").select("accountId", { count: "exact" }).eq("isAdmin", true),
    supabaseServer.from("push_subscriptions").select("account_id"),
  ]);

  const adminIds = new Set((adminsTotal.data ?? []).map((a: any) => a.accountId));
  const subscribedAdmins = new Set(
    (adminPush.data ?? [])
      .map((s: any) => s.account_id)
      .filter((id: string) => adminIds.has(id))
  );

  return {
    usersTotal: usersTotal.count ?? 0,
    usersActive: usersActive.count ?? 0,
    recentMeetings30d: meetings30d.count ?? 0,
    meetingsToday: meetingsToday.count ?? 0,
    adminsTotal: adminIds.size,
    adminsSubscribed: subscribedAdmins.size,
  };
}
