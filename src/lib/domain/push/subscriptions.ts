import { supabaseServer } from "@/lib/supabase/server";

export type PushSubscriptionRow = {
  account_id: string;
  subscription: object;
};

// 운영진의 푸시 구독 목록 조회 (두 단계 쿼리)
export async function getAdminSubscriptions(): Promise<PushSubscriptionRow[]> {
  // Step 1: isAdmin=true 유저의 accountId 목록 조회
  const { data: adminUsers, error: userError } = await supabaseServer
    .from("user")
    .select("accountId")
    .eq("isAdmin", true);

  if (userError) {
    console.error("[push] getAdminSubscriptions userError:", userError);
    return [];
  }

  if (!adminUsers || adminUsers.length === 0) return [];

  const adminIds = adminUsers.map((u: any) => u.accountId);

  // Step 2: 해당 유저들의 구독 조회
  const { data: subs, error: subError } = await supabaseServer
    .from("push_subscriptions")
    .select("account_id, subscription")
    .in("account_id", adminIds);

  if (subError) {
    console.error("[push] getAdminSubscriptions subError:", subError);
    return [];
  }

  return (subs ?? []) as PushSubscriptionRow[];
}

// 구독 저장 (upsert)
export async function upsertPushSubscription(
  accountId: string,
  subscription: object
): Promise<void> {
  const { error } = await supabaseServer
    .from("push_subscriptions")
    .upsert(
      { account_id: accountId, subscription },
      { onConflict: "account_id" }
    );

  if (error) throw error;
}

// 구독 삭제
export async function deletePushSubscription(accountId: string): Promise<void> {
  const { error } = await supabaseServer
    .from("push_subscriptions")
    .delete()
    .eq("account_id", accountId);

  if (error) throw error;
}

// 특정 유저의 구독 여부 확인
export async function hasPushSubscription(accountId: string): Promise<boolean> {
  const { data, error } = await supabaseServer
    .from("push_subscriptions")
    .select("account_id")
    .eq("account_id", accountId)
    .limit(1);

  if (error) return false;
  return (data?.length ?? 0) > 0;
}
