"use server";

import { findUserByAccountId } from "@/lib/domain/user/queries";
import { createUser, updateUserInfo } from "@/lib/domain/user/mutations";
import { sendDiscordNotification } from "@/lib/domain/discord/notifications";

type SignupParams = {
  name: string;
  birthYear: string;
  email: string;
  accountId: string;
};

export async function signupAction(params: SignupParams) {
  const { name, birthYear, email, accountId } = params;

  if (!accountId) {
    throw new Error("signupAction: accountId가 비어있습니다.");
  }

  let mode: "create" | "update";
  try {
    const res = await findUserByAccountId(accountId);
    if (res && res.length > 0 && res[0]) {
      mode = "update";
      await updateUserInfo({ name, birthYear, email, accountId });
    } else {
      mode = "create";
      await createUser({ name, birthYear, email, accountId });
    }
  } catch (err) {
    console.error("[signup] DB write failed", { accountId, name, email, birthYear, err });
    // DB 실패는 사용자에게 알려야 함 — rethrow
    throw err;
  }

  // 슬랙 알림은 부수효과. 실패해도 가입 자체는 성공으로 처리.
  try {
    await sendDiscordNotification(`회원${mode === "create" ? "등록" : "수정"}/${name}/${birthYear}/${email}`);
  } catch (err) {
    console.error("[signup] Slack notification failed (non-fatal)", err);
  }

  return { success: true, mode };
}

// 클라이언트 catch에서 발생한 에러를 슬랙으로 보고 (진단용)
export async function reportSignupError(payload: {
  stage: string;
  accountId?: string;
  message: string;
  userAgent?: string;
}) {
  try {
    await sendDiscordNotification(
      `[signup-error] stage=${payload.stage} accountId=${payload.accountId ?? "?"} ua=${payload.userAgent ?? "?"} msg=${payload.message}`
    );
  } catch (err) {
    console.error("[signup] reportSignupError failed", err);
  }
}
