import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/domain/meeting/queries", () => ({
  getMeetingsByDateRange: vi.fn(),
  getParticipationByDateRange: vi.fn(),
  getFounderMeetingsByDateRange: vi.fn(),
}));

import {
  fetchOverallRanking,
  fetchParticipationRanking,
  fetchFounderRanking,
} from "@/app/(main)/ranking/actions";
import {
  getMeetingsByDateRange,
  getParticipationByDateRange,
  getFounderMeetingsByDateRange,
} from "@/lib/domain/meeting/queries";

const mockGetMeetings = vi.mocked(getMeetingsByDateRange);
const mockGetParticipation = vi.mocked(getParticipationByDateRange);
const mockGetFounder = vi.mocked(getFounderMeetingsByDateRange);

beforeEach(() => {
  vi.clearAllMocks();
});

describe("fetchOverallRanking", () => {
  it("일반 참석은 1점, 창립자 참석은 1.5점으로 계산된다", async () => {
    mockGetMeetings.mockResolvedValue([
      { name: "Alice", birthYear: 1990, founder: false },
      { name: "Alice", birthYear: 1990, founder: true },
      { name: "Bob", birthYear: 1985, founder: false },
    ]);

    const result = await fetchOverallRanking("2025-01");

    const alice = result.find((r) => r.name === "Alice");
    const bob = result.find((r) => r.name === "Bob");
    expect(alice?.score).toBe(2.5); // 1 + 1.5
    expect(bob?.score).toBe(1);
  });

  it("점수 내림차순으로 정렬된다", async () => {
    mockGetMeetings.mockResolvedValue([
      { name: "C", birthYear: 2000, founder: false },
      { name: "A", birthYear: 1990, founder: true },
      { name: "A", birthYear: 1990, founder: true },
      { name: "B", birthYear: 1995, founder: false },
      { name: "B", birthYear: 1995, founder: false },
    ]);

    const result = await fetchOverallRanking("2025-01");

    expect(result[0].name).toBe("A"); // 3.0
    expect(result[1].name).toBe("B"); // 2.0
    expect(result[2].name).toBe("C"); // 1.0
  });

  it("데이터가 없으면 빈 배열을 반환한다", async () => {
    mockGetMeetings.mockResolvedValue([]);
    const result = await fetchOverallRanking("2025-01");
    expect(result).toEqual([]);
  });

  it("동일한 이름이라도 birthYear가 다르면 별도 사용자로 집계된다", async () => {
    mockGetMeetings.mockResolvedValue([
      { name: "Kim", birthYear: 1990, founder: false },
      { name: "Kim", birthYear: 1995, founder: false },
    ]);

    const result = await fetchOverallRanking("2025-01");
    expect(result).toHaveLength(2);
  });

  it("월 범위가 올바르게 계산된다 (2025-02의 마지막 날은 28일)", async () => {
    mockGetMeetings.mockResolvedValue([]);
    await fetchOverallRanking("2025-02");

    expect(mockGetMeetings).toHaveBeenCalledWith("2025-02-01", "2025-02-28");
  });
});

describe("fetchParticipationRanking", () => {
  it("참석 횟수로 점수를 집계한다", async () => {
    mockGetParticipation.mockResolvedValue([
      { name: "Alice", birthYear: 1990 },
      { name: "Alice", birthYear: 1990 },
      { name: "Bob", birthYear: 1985 },
    ]);

    const result = await fetchParticipationRanking("2025-01");

    const alice = result.find((r) => r.name === "Alice");
    const bob = result.find((r) => r.name === "Bob");
    expect(alice?.score).toBe(2);
    expect(bob?.score).toBe(1);
  });

  it("점수 내림차순으로 정렬된다", async () => {
    mockGetParticipation.mockResolvedValue([
      { name: "B", birthYear: 1995 },
      { name: "A", birthYear: 1990 },
      { name: "A", birthYear: 1990 },
    ]);

    const result = await fetchParticipationRanking("2025-01");
    expect(result[0].name).toBe("A");
    expect(result[0].score).toBe(2);
  });
});

describe("fetchFounderRanking", () => {
  it("창립자 참석 횟수로 점수를 집계한다", async () => {
    mockGetFounder.mockResolvedValue([
      { name: "Alice", birthYear: 1990 },
      { name: "Alice", birthYear: 1990 },
      { name: "Bob", birthYear: 1985 },
    ]);

    const result = await fetchFounderRanking("2025-01");

    const alice = result.find((r) => r.name === "Alice");
    const bob = result.find((r) => r.name === "Bob");
    expect(alice?.score).toBe(2);
    expect(bob?.score).toBe(1);
  });

  it("meetings가 null이면 빈 배열을 반환한다", async () => {
    mockGetFounder.mockResolvedValue(null as any);
    const result = await fetchFounderRanking("2025-01");
    expect(result).toEqual([]);
  });

  it("점수 내림차순으로 정렬된다", async () => {
    mockGetFounder.mockResolvedValue([
      { name: "B", birthYear: 1995 },
      { name: "A", birthYear: 1990 },
      { name: "A", birthYear: 1990 },
    ]);

    const result = await fetchFounderRanking("2025-01");
    expect(result[0].name).toBe("A");
  });
});
