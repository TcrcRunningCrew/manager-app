import { describe, it, expect, vi, beforeEach } from "vitest";

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
import { findUserByAccountId } from "@/lib/domain/user/queries";
import { createUser, updateUserInfo } from "@/lib/domain/user/mutations";
import { sendDiscordNotification } from "@/lib/domain/discord/notifications";

const mockFindUser = vi.mocked(findUserByAccountId);
const mockCreateUser = vi.mocked(createUser);
const mockUpdateUser = vi.mocked(updateUserInfo);
const mockSlack = vi.mocked(sendDiscordNotification);

const defaultParams = {
  name: "홍길동",
  birthYear: "1990",
  email: "hong@test.com",
  accountId: "kakao-123",
};

beforeEach(() => {
  vi.clearAllMocks();
  mockSlack.mockResolvedValue(undefined);
});

describe("signupAction", () => {
  it("신규 회원이면 createUser를 호출한다", async () => {
    mockFindUser.mockResolvedValue([]);
    mockCreateUser.mockResolvedValue(undefined as any);

    const result = await signupAction(defaultParams);

    expect(mockCreateUser).toHaveBeenCalledWith(defaultParams);
    expect(mockUpdateUser).not.toHaveBeenCalled();
    expect(result).toEqual({ success: true, mode: "create" });
  });

  it("기존 회원이면 updateUserInfo를 호출한다", async () => {
    mockFindUser.mockResolvedValue([{ accountId: "kakao-123" }] as any);
    mockUpdateUser.mockResolvedValue(undefined as any);

    const result = await signupAction(defaultParams);

    expect(mockUpdateUser).toHaveBeenCalledWith(defaultParams);
    expect(mockCreateUser).not.toHaveBeenCalled();
    expect(result).toEqual({ success: true, mode: "update" });
  });

  it("조회 결과가 null이면 신규 회원으로 처리한다", async () => {
    mockFindUser.mockResolvedValue(null as any);
    mockCreateUser.mockResolvedValue(undefined as any);

    await signupAction(defaultParams);

    expect(mockCreateUser).toHaveBeenCalled();
  });

  it("신규/수정에 따라 슬랙 메시지가 다르다", async () => {
    mockFindUser.mockResolvedValue([]);
    mockCreateUser.mockResolvedValue(undefined as any);
    await signupAction(defaultParams);
    expect(mockSlack).toHaveBeenCalledWith(
      `회원등록/${defaultParams.name}/${defaultParams.birthYear}/${defaultParams.email}`
    );

    mockSlack.mockClear();
    mockFindUser.mockResolvedValue([{ accountId: "kakao-123" }] as any);
    mockUpdateUser.mockResolvedValue(undefined as any);
    await signupAction(defaultParams);
    expect(mockSlack).toHaveBeenCalledWith(
      `회원수정/${defaultParams.name}/${defaultParams.birthYear}/${defaultParams.email}`
    );
  });

  it("Slack 알림이 실패해도 가입은 성공으로 처리한다", async () => {
    mockFindUser.mockResolvedValue([]);
    mockCreateUser.mockResolvedValue(undefined as any);
    mockSlack.mockRejectedValueOnce(new Error("Slack down"));

    const result = await signupAction(defaultParams);

    expect(result).toEqual({ success: true, mode: "create" });
  });

  it("DB 쓰기 실패는 그대로 throw한다", async () => {
    mockFindUser.mockResolvedValue([]);
    mockCreateUser.mockRejectedValueOnce(new Error("duplicate key"));

    await expect(signupAction(defaultParams)).rejects.toThrow("duplicate key");
  });

  it("accountId가 비어있으면 즉시 에러", async () => {
    await expect(
      signupAction({ ...defaultParams, accountId: "" })
    ).rejects.toThrow(/accountId/);
    expect(mockFindUser).not.toHaveBeenCalled();
  });
});
