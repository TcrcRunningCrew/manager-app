import { describe, it, expect, vi, beforeEach } from "vitest";

// unstable_cache 는 Next.js 의 incrementalCache 컨텍스트가 없으면 동작하지 않으므로
// 테스트 환경에서는 pass-through 로 모킹 (캐싱은 통합 환경에서 검증).
vi.mock("next/cache", () => ({
  unstable_cache: (fn: (...args: unknown[]) => unknown) => fn,
  revalidateTag: vi.fn(),
  revalidatePath: vi.fn(),
}));

vi.mock("@/lib/supabase/server", () => ({
  supabaseServer: {
    from: vi.fn(),
  },
}));

import {
  getMeetingsByDateRange,
  getParticipationByDateRange,
  getFounderMeetingsByDateRange,
  getUserMonthlyCounts,
} from "@/lib/domain/meeting/queries";
import { insertMeeting, updateMeeting, deleteMeeting } from "@/lib/domain/meeting/mutations";
import { supabaseServer } from "@/lib/supabase/server";

const mockFrom = vi.mocked(supabaseServer.from);

function createChain(data: unknown = null, error: unknown = null, count: number | null = null) {
  const resolved = { data, error, count };
  const chain: Record<string, unknown> = {
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    gte: vi.fn().mockReturnThis(),
    lte: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    then: (onfulfilled: (v: typeof resolved) => unknown, onrejected?: (e: unknown) => unknown) =>
      Promise.resolve(resolved).then(onfulfilled, onrejected),
    catch: (onrejected: (e: unknown) => unknown) =>
      Promise.resolve(resolved).catch(onrejected),
    finally: (onfinally?: () => void) =>
      Promise.resolve(resolved).finally(onfinally),
  };
  return chain;
}

beforeEach(() => {
  vi.clearAllMocks();
});

// --- getMeetingsByDateRange ---

describe("getMeetingsByDateRange", () => {
  it("meeting 테이블을 날짜 범위로 조회한다", async () => {
    const meetings = [
      { name: "홍길동", birthYear: 1990, founder: false },
      { name: "김철수", birthYear: 1985, founder: true },
    ];
    mockFrom.mockReturnValue(createChain(meetings) as ReturnType<typeof supabaseServer.from>);

    const result = await getMeetingsByDateRange("2025-01-01", "2025-01-31");

    expect(mockFrom).toHaveBeenCalledWith("meeting");
    expect(result).toEqual(meetings);
  });

  it("데이터가 없으면 빈 배열을 반환한다", async () => {
    mockFrom.mockReturnValue(createChain([]) as ReturnType<typeof supabaseServer.from>);
    const result = await getMeetingsByDateRange("2025-01-01", "2025-01-31");
    expect(result).toEqual([]);
  });

  it("에러가 발생하면 throw한다", async () => {
    const error = new Error("Query failed");
    mockFrom.mockReturnValue(createChain(null, error) as ReturnType<typeof supabaseServer.from>);
    await expect(
      getMeetingsByDateRange("2025-01-01", "2025-01-31")
    ).rejects.toThrow("Query failed");
  });
});

// --- getParticipationByDateRange ---

describe("getParticipationByDateRange", () => {
  it("meeting 테이블에서 참여 데이터를 조회한다", async () => {
    const meetings = [
      { name: "홍길동", birthYear: 1990 },
      { name: "김철수", birthYear: 1985 },
    ];
    mockFrom.mockReturnValue(createChain(meetings) as ReturnType<typeof supabaseServer.from>);

    const result = await getParticipationByDateRange("2025-01-01", "2025-01-31");

    expect(mockFrom).toHaveBeenCalledWith("meeting");
    expect(result).toEqual(meetings);
  });

  it("에러가 발생하면 throw한다", async () => {
    const error = new Error("DB error");
    mockFrom.mockReturnValue(createChain(null, error) as ReturnType<typeof supabaseServer.from>);
    await expect(
      getParticipationByDateRange("2025-01-01", "2025-01-31")
    ).rejects.toThrow("DB error");
  });
});

// --- getFounderMeetingsByDateRange ---

describe("getFounderMeetingsByDateRange", () => {
  it("founder=true 조건으로 meeting 테이블을 조회한다", async () => {
    const meetings = [{ name: "홍길동", birthYear: 1990 }];
    mockFrom.mockReturnValue(createChain(meetings) as ReturnType<typeof supabaseServer.from>);

    const result = await getFounderMeetingsByDateRange("2025-01-01", "2025-01-31");

    expect(mockFrom).toHaveBeenCalledWith("meeting");
    expect(result).toEqual(meetings);
  });

  it("에러가 발생하면 throw한다", async () => {
    const error = new Error("Founder query error");
    mockFrom.mockReturnValue(createChain(null, error) as ReturnType<typeof supabaseServer.from>);
    await expect(
      getFounderMeetingsByDateRange("2025-01-01", "2025-01-31")
    ).rejects.toThrow("Founder query error");
  });
});

// --- getUserMonthlyCounts ---

describe("getUserMonthlyCounts", () => {
  it("accountId로 필터링된 참여/개설 수를 반환한다", async () => {
    const rows = [{ founder: false }, { founder: true }, { founder: true }];
    mockFrom.mockReturnValue(createChain(rows) as ReturnType<typeof supabaseServer.from>);

    const result = await getUserMonthlyCounts({
      accountId: "kakao-123",
      startDay: "2026-06-01",
      endDay: "2026-06-30",
    });

    expect(mockFrom).toHaveBeenCalledWith("meeting");
    expect(result).toEqual({ participation: 3, founder: 2 });
  });

  it("데이터가 없으면 0을 반환한다", async () => {
    mockFrom.mockReturnValue(createChain(null) as ReturnType<typeof supabaseServer.from>);

    const result = await getUserMonthlyCounts({
      accountId: "kakao-123",
      startDay: "2026-06-01",
      endDay: "2026-06-30",
    });

    expect(result).toEqual({ participation: 0, founder: 0 });
  });

  it("에러가 발생하면 throw한다", async () => {
    const error = new Error("Count query failed");
    mockFrom.mockReturnValue(createChain(null, error) as ReturnType<typeof supabaseServer.from>);
    await expect(
      getUserMonthlyCounts({
        accountId: "kakao-123",
        startDay: "2026-06-01",
        endDay: "2026-06-30",
      })
    ).rejects.toThrow("Count query failed");
  });
});

// --- insertMeeting ---

describe("insertMeeting", () => {
  const meetingParams = {
    accountId: "kakao-123",
    name: "홍길동",
    email: "hong@test.com",
    birthYear: "90",
    meeting_date: "2025-01-15",
    activation: "running",
    location: "한강",
    founder: false,
  };

  it("meeting 테이블에 데이터를 삽입한다", async () => {
    const inserted = [{ id: 1, ...meetingParams }];
    mockFrom.mockReturnValue(createChain(inserted) as ReturnType<typeof supabaseServer.from>);

    const result = await insertMeeting(meetingParams);

    expect(mockFrom).toHaveBeenCalledWith("meeting");
    expect(result).toEqual(inserted);
  });

  it("에러가 발생하면 throw한다", async () => {
    const error = new Error("Insert failed");
    mockFrom.mockReturnValue(createChain(null, error) as ReturnType<typeof supabaseServer.from>);
    await expect(insertMeeting(meetingParams)).rejects.toThrow("Insert failed");
  });
});

// --- updateMeeting ---

describe("updateMeeting", () => {
  it("meeting 테이블의 행을 수정한다", async () => {
    const updated = [{ _id: 7, meeting_time: "09:00" }];
    mockFrom.mockReturnValue(createChain(updated) as ReturnType<typeof supabaseServer.from>);

    const result = await updateMeeting(7, { meeting_time: "09:00" });

    expect(mockFrom).toHaveBeenCalledWith("meeting");
    expect(result).toEqual(updated[0]);
  });

  it("매칭되는 행이 없으면 throw한다", async () => {
    mockFrom.mockReturnValue(createChain([]) as ReturnType<typeof supabaseServer.from>);
    await expect(updateMeeting(99, { meeting_time: "09:00" })).rejects.toThrow(/no row matched/);
  });

  it("변경 사항이 비어있으면 즉시 throw한다", async () => {
    await expect(updateMeeting(7, {})).rejects.toThrow(/변경 사항/);
    expect(mockFrom).not.toHaveBeenCalled();
  });

  it("DB 에러가 발생하면 throw한다", async () => {
    const error = new Error("Update error");
    mockFrom.mockReturnValue(createChain(null, error) as ReturnType<typeof supabaseServer.from>);
    await expect(updateMeeting(7, { meeting_time: "09:00" })).rejects.toThrow("Update error");
  });
});

// --- deleteMeeting ---

describe("deleteMeeting", () => {
  it("meeting 테이블의 행을 삭제한다", async () => {
    mockFrom.mockReturnValue(createChain(null, null, 1) as ReturnType<typeof supabaseServer.from>);
    await expect(deleteMeeting(7)).resolves.toBeUndefined();
    expect(mockFrom).toHaveBeenCalledWith("meeting");
  });

  it("매칭되는 행이 없으면 throw한다", async () => {
    mockFrom.mockReturnValue(createChain(null, null, 0) as ReturnType<typeof supabaseServer.from>);
    await expect(deleteMeeting(99)).rejects.toThrow(/no row matched/);
  });

  it("DB 에러가 발생하면 throw한다", async () => {
    const error = new Error("Delete error");
    mockFrom.mockReturnValue(createChain(null, error) as ReturnType<typeof supabaseServer.from>);
    await expect(deleteMeeting(7)).rejects.toThrow("Delete error");
  });
});
