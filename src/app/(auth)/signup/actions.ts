"use server";

import { findUserByAccountId } from "@/lib/domain/user/queries";
import { createUser, updateUserInfo } from "@/lib/domain/user/mutations";
import { sendSlackNotification } from "@/lib/domain/slack/notifications";

export async function signupAction(params: {
  name: string;
  birthYear: string;
  email: string;
  accountId: string;
}) {
  const { name, birthYear, email, accountId } = params;

  const res = await findUserByAccountId(accountId);
  if (res && res.length > 0 && res[0]) {
    await updateUserInfo({ name, birthYear, email, accountId });
  } else {
    await createUser({ name, birthYear, email, accountId });
  }

  await sendSlackNotification(`회원등록/${name}/${birthYear}/${email}`);

  return { success: true };
}
