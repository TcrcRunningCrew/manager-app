import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/domain/user/queries", () => ({
  findUserByAccountId: vi.fn(),
}));

vi.mock("@/lib/domain/meeting/mutations", () => ({
  insertMeeting: vi.fn(),
}));

vi.mock("@/lib/domain/slack/notifications", () => ({
  sendSlackNotification: vi.fn(),
}));

import { checkoutAction } from "@/app/(main)/checkout/actions";
import { findUserByAccountId } from "@/lib/domain/user/queries";
import { insertMeeting } from "@/lib/domain/meeting/mutations";
import { sendSlackNotification } from "@/lib/domain/slack/notifications";

const mockFindUser = vi.mocked(findUserByAccountId);
const mockInsertMeeting = vi.mocked(insertMeeting);
const mockSlack = vi.mocked(sendSlackNotification);

const defaultParams = {
  userId: "kakao-123",
  username: "홍길동",
  userEmail: "hong@test.com",
  userAge: "1990",
  participationDate: "2025-01-15",
  activation: "running",
  location: "한강",
  isFounder: false,
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("checkoutAction", () => {
  it("미등록 회원이면 실패 응답을 반환한다", async () => {
    mockFindUser.mockResolvedValue([]);

    const result = await checkoutAction(defaultParams);

    expect(result.success).toBe(false);
    expect(result.message).toBe("회원이 아닙니다. 회원가입 바랍니다");
    expect(mockInsertMeeting).not.toHaveBeenCalled();
  });

  it("회원 조회 결과가 null이면 실패 응답을 반환한다", async () => {
    mockFindUser.mockResolvedValue(null as any);

    const result = await checkoutAction(defaultParams);

    expect(result.success).toBe(false);
    expect(mockInsertMeeting).not.toHaveBeenCalled();
  });

  it("출석 삽입 성공 시 슬랙 알림을 보내고 성공 응답을 반환한다", async () => {
    mockFindUser.mockResolvedValue([{ accountId: "kakao-123" }] as any);
    mockInsertMeeting.mockResolvedValue({ id: 1 } as any);
    mockSlack.mockResolvedValue(undefined);

    const result = await checkoutAction(defaultParams);

    expect(result.success).toBe(true);
    expect(result.message).toBe("출석 완료");
    expect(mockSlack).toHaveBeenCalledOnce();
  });

  it("출석 삽입 실패(falsy 반환) 시 에러 응답을 반환한다", async () => {
    mockFindUser.mockResolvedValue([{ accountId: "kakao-123" }] as any);
    mockInsertMeeting.mockResolvedValue(null as any);

    const result = await checkoutAction(defaultParams);

    expect(result.success).toBe(false);
    expect(result.message).toBe("출석체크 에러 운영진 문의");
    expect(mockSlack).not.toHaveBeenCalled();
  });

  it("올바른 파라미터로 insertMeeting을 호출한다", async () => {
    mockFindUser.mockResolvedValue([{ accountId: "kakao-123" }] as any);
    mockInsertMeeting.mockResolvedValue({ id: 1 } as any);
    mockSlack.mockResolvedValue(undefined);

    await checkoutAction({ ...defaultParams, isFounder: true });

    expect(mockInsertMeeting).toHaveBeenCalledWith({
      accountId: "kakao-123",
      name: "홍길동",
      email: "hong@test.com",
      birthYear: "1990",
      meeting_date: "2025-01-15",
      activation: "running",
      location: "한강",
      founder: true,
    });
  });
});
