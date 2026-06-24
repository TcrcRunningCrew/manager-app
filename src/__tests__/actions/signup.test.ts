import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("next-auth", () => ({
  getServerSession: vi.fn(),
}));

vi.mock("@/lib/auth/options", () => ({
  authOptions: {},
}));

vi.mock("@/lib/domain/user/queries", () => ({
  findUserByAccountId: vi.fn(),
}));

vi.mock("@/lib/domain/user/mutations", () => ({
  createUser: vi.fn(),
  updateUserInfo: vi.fn(),
}));

vi.mock("@/lib/domain/discord/notifications", () => ({
  sendDiscordNotification: vi.fn(),
}));

import { signupAction } from "@/app/(auth)/signup/actions";
import { getServerSession } from "next-auth";
import { findUserByAccountId } from "@/lib/domain/user/queries";
import { createUser, updateUserInfo } from "@/lib/domain/user/mutations";
import { sendDiscordNotification } from "@/lib/domain/discord/notifications";

const mockSession = vi.mocked(getServerSession);
const mockFindUser = vi.mocked(findUserByAccountId);
const mockCreateUser = vi.mocked(createUser);
const mockUpdateUser = vi.mocked(updateUserInfo);
const mockDiscord = vi.mocked(sendDiscordNotification);

const ACCOUNT_ID = "kakao-123";
const VALID_PARAMS = {
  name: "홍길동",
  birthYear: "1990",
  email: "hong@test.com",
};

beforeEach(() => {
  vi.clearAllMocks();
  mockDiscord.mockResolvedValue(undefined);
  mockSession.mockResolvedValue({ user: { id: ACCOUNT_ID } } as any);
});

describe("signupAction", () => {
  it("세션이 없으면 unauthenticated 실패", async () => {
    mockSession.mockResolvedValue(null as any);
    const result = await signupAction(VALID_PARAMS);
    expect(result).toEqual({ success: false, reason: "unauthenticated" });
    expect(mockFindUser).not.toHaveBeenCalled();
  });

  it("name 형식이 어긋나면 invalid_name 실패", async () => {
    const result = await signupAction({ ...VALID_PARAMS, name: "a" });
    expect(result).toEqual({ success: false, reason: "invalid_name" });
  });

  it("birthYear 형식이 어긋나면 invalid_birth_year 실패", async () => {
    const result = await signupAction({ ...VALID_PARAMS, birthYear: "abc" });
    expect(result).toEqual({ success: false, reason: "invalid_birth_year" });
  });

  it("email 형식이 어긋나면 invalid_email 실패", async () => {
    const result = await signupAction({ ...VALID_PARAMS, email: "not-an-email" });
    expect(result).toEqual({ success: false, reason: "invalid_email" });
  });

  it("신규 회원이면 createUser를 호출한다", async () => {
    mockFindUser.mockResolvedValue([] as any);
    mockCreateUser.mockResolvedValue(undefined as any);

    const result = await signupAction(VALID_PARAMS);

    expect(mockCreateUser).toHaveBeenCalledWith({
      name: "홍길동",
      birthYear: "90",
      email: "hong@test.com",
      accountId: ACCOUNT_ID,
    });
    expect(mockUpdateUser).not.toHaveBeenCalled();
    expect(result).toEqual({ success: true, mode: "create" });
  });

  it("기존 회원이면 updateUserInfo를 호출한다", async () => {
    mockFindUser.mockResolvedValue([{ accountId: ACCOUNT_ID }] as any);
    mockUpdateUser.mockResolvedValue(undefined as any);

    const result = await signupAction(VALID_PARAMS);

    expect(mockUpdateUser).toHaveBeenCalledWith({
      name: "홍길동",
      birthYear: "90",
      email: "hong@test.com",
      accountId: ACCOUNT_ID,
    });
    expect(mockCreateUser).not.toHaveBeenCalled();
    expect(result).toEqual({ success: true, mode: "update" });
  });

  it("클라이언트가 보낸 accountId는 무시되고 세션의 id가 사용된다", async () => {
    mockFindUser.mockResolvedValue([] as any);
    mockCreateUser.mockResolvedValue(undefined as any);

    await signupAction({ ...VALID_PARAMS, accountId: "ATTACKER-ID" } as any);

    expect(mockCreateUser).toHaveBeenCalledWith(
      expect.objectContaining({ accountId: ACCOUNT_ID }),
    );
  });

  it("DB 쓰기 실패는 그대로 throw한다", async () => {
    mockFindUser.mockResolvedValue([] as any);
    mockCreateUser.mockRejectedValueOnce(new Error("duplicate key"));

    await expect(signupAction(VALID_PARAMS)).rejects.toThrow("duplicate key");
  });
});
