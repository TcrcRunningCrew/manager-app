import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/domain/user/queries", () => ({
  findUserByAccountId: vi.fn(),
}));

vi.mock("@/lib/domain/user/mutations", () => ({
  createUser: vi.fn(),
  updateUserInfo: vi.fn(),
}));

vi.mock("@/lib/domain/slack/notifications", () => ({
  sendSlackNotification: vi.fn(),
}));

import { signupAction } from "@/app/(auth)/signup/actions";
import { findUserByAccountId } from "@/lib/domain/user/queries";
import { createUser, updateUserInfo } from "@/lib/domain/user/mutations";
import { sendSlackNotification } from "@/lib/domain/slack/notifications";

const mockFindUser = vi.mocked(findUserByAccountId);
const mockCreateUser = vi.mocked(createUser);
const mockUpdateUser = vi.mocked(updateUserInfo);
const mockSlack = vi.mocked(sendSlackNotification);

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
    mockCreateUser.mockResolvedValue(undefined);

    const result = await signupAction(defaultParams);

    expect(mockCreateUser).toHaveBeenCalledWith(defaultParams);
    expect(mockUpdateUser).not.toHaveBeenCalled();
    expect(result).toEqual({ success: true });
  });

  it("기존 회원이면 updateUserInfo를 호출한다", async () => {
    mockFindUser.mockResolvedValue([{ accountId: "kakao-123" }] as any);
    mockUpdateUser.mockResolvedValue(undefined);

    const result = await signupAction(defaultParams);

    expect(mockUpdateUser).toHaveBeenCalledWith(defaultParams);
    expect(mockCreateUser).not.toHaveBeenCalled();
    expect(result).toEqual({ success: true });
  });

  it("항상 슬랙 알림을 보낸다", async () => {
    mockFindUser.mockResolvedValue([]);
    mockCreateUser.mockResolvedValue(undefined);

    await signupAction(defaultParams);

    expect(mockSlack).toHaveBeenCalledWith(
      `회원등록/${defaultParams.name}/${defaultParams.birthYear}/${defaultParams.email}`
    );
  });

  it("조회 결과가 null이면 신규 회원으로 처리한다", async () => {
    mockFindUser.mockResolvedValue(null as any);
    mockCreateUser.mockResolvedValue(undefined);

    await signupAction(defaultParams);

    expect(mockCreateUser).toHaveBeenCalled();
  });
});
