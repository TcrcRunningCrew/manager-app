"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { findUserByAccountId } from "@/lib/domain/user/queries";
import { createUser, updateUserInfo } from "@/lib/domain/user/mutations";
import { sendDiscordNotification } from "@/lib/domain/discord/notifications";

const NAME_RE = /^[^\x00-\x1f\x7f]{2,5}$/;
const BIRTH_RE = /^(\d{2}|\d{4})$/;
const EMAIL_RE = /^[a-zA-Z0-9+\-_.]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;

// Discord webhook content sanitization: 제어문자/mention/마크다운 토큰 제거
function sanitizeForDiscord(s: string, max: number): string {
  return s
    .replace(/[\x00-\x1f\x7f]/g, " ")
    .replace(/@(everyone|here)/gi, "@$1​")
    .replace(/<@[!&]?\d+>/g, "")
    .slice(0, max)
    .trim();
}

type SignupParams = {
  name: string;
  birthYear: string;
  email: string;
};

export async function signupAction(params: SignupParams) {
  const session = await getServerSession(authOptions);
  const accountId = session?.user?.id;
  if (!accountId) {
    return { success: false as const, reason: "unauthenticated" };
  }

  const name = (params.name ?? "").trim();
  const birthYearRaw = (params.birthYear ?? "").trim();
  const email = (params.email ?? "").trim();

  if (!NAME_RE.test(name)) {
    return { success: false as const, reason: "invalid_name" };
  }
  if (!BIRTH_RE.test(birthYearRaw)) {
    return { success: false as const, reason: "invalid_birth_year" };
  }
  if (!EMAIL_RE.test(email) || email.length > 254) {
    return { success: false as const, reason: "invalid_email" };
  }
  const birthYear = birthYearRaw.length === 4 ? birthYearRaw.slice(-2) : birthYearRaw;

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
    // 세션의 accountId 자체는 식별자라 운영 디버그를 위해 남기되, name/email은 빼서 로그 PII 면적을 줄임
    console.error("[signup] DB write failed", { accountId, mode: undefined, err });
    throw err;
  }

  // Discord 알림은 부수효과. 응답을 막지 않음.
  void sendDiscordNotification(
    `회원${mode === "create" ? "등록" : "수정"}/${sanitizeForDiscord(name, 50)}/${birthYear}/${sanitizeForDiscord(email, 254)}`,
  ).catch((err) => console.error("[signup] discord notification failed (non-fatal)", err));

  return { success: true as const, mode };
}

// 클라이언트 catch 진단용 (인증된 사용자만 발사 가능).
export async function reportSignupError(payload: {
  stage: string;
  message: string;
  userAgent?: string;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    // 비로그인 진단 노이즈는 거부 — open relay 차단
    return;
  }
  const stage = sanitizeForDiscord(payload.stage ?? "", 40);
  const message = sanitizeForDiscord(payload.message ?? "", 500);
  const userAgent = sanitizeForDiscord(payload.userAgent ?? "", 200);

  void sendDiscordNotification(
    `[signup-error] account=${session.user.id} stage=${stage} ua=${userAgent} msg=${message}`,
  ).catch((err) => console.error("[signup] reportSignupError discord failed", err));
}
