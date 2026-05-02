import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { RankingList } from "@/components/organisms/RankingList";

vi.mock("next-auth/react", () => ({
  useSession: vi.fn(),
}));

vi.mock("lucide-react", () => ({
  ChevronLeft: () => <svg data-testid="chevron-left" />,
  ChevronRight: () => <svg data-testid="chevron-right" />,
}));

import { useSession } from "next-auth/react";
const mockUseSession = vi.mocked(useSession);

const mockUsers = [
  { name: "Alice", birthYear: 1990, score: 3 },
  { name: "Bob", birthYear: 1985, score: 1.5 },
];

beforeEach(() => {
  mockUseSession.mockReturnValue({
    data: null,
    status: "unauthenticated",
    update: vi.fn(),
  });
});

describe("RankingList", () => {
  it("fetchRanking 결과를 테이블에 렌더링한다", async () => {
    const fetchRanking = vi.fn().mockResolvedValue(mockUsers);
    render(<RankingList scoreLabel="점수" fetchRanking={fetchRanking} />);

    await waitFor(() => {
      expect(screen.getByText("Alice(1990)")).toBeInTheDocument();
      expect(screen.getByText("Bob(1985)")).toBeInTheDocument();
    });
  });

  it("scoreLabel을 테이블 헤더에 표시한다", () => {
    const fetchRanking = vi.fn().mockResolvedValue([]);
    render(<RankingList scoreLabel="참여횟수" fetchRanking={fetchRanking} />);
    expect(screen.getByText("참여횟수")).toBeInTheDocument();
  });

  it("데이터가 없으면 테이블 행이 없다", async () => {
    const fetchRanking = vi.fn().mockResolvedValue([]);
    const { container } = render(
      <RankingList scoreLabel="점수" fetchRanking={fetchRanking} />
    );

    await waitFor(() => {
      expect(container.querySelectorAll("tbody tr")).toHaveLength(0);
    });
  });

  it("인증된 사용자의 랭킹을 표시한다", async () => {
    mockUseSession.mockReturnValue({
      data: { user: { name: "Alice" }, expires: "" },
      status: "authenticated",
      update: vi.fn(),
    });

    const fetchRanking = vi.fn().mockResolvedValue(mockUsers);
    render(<RankingList scoreLabel="점수" fetchRanking={fetchRanking} />);

    await waitFor(() => {
      expect(screen.getByText("1위(전체2)")).toBeInTheDocument();
    });
  });

  it("목록에 없는 사용자는 '랭킹없음'을 표시한다", async () => {
    mockUseSession.mockReturnValue({
      data: { user: { name: "Unknown" }, expires: "" },
      status: "authenticated",
      update: vi.fn(),
    });

    const fetchRanking = vi.fn().mockResolvedValue(mockUsers);
    render(<RankingList scoreLabel="점수" fetchRanking={fetchRanking} />);

    await waitFor(() => {
      expect(screen.getByText("랭킹없음")).toBeInTheDocument();
    });
  });

  it("순위 번호가 1부터 순서대로 표시된다", async () => {
    const fetchRanking = vi.fn().mockResolvedValue(mockUsers);
    const { container } = render(
      <RankingList scoreLabel="점수" fetchRanking={fetchRanking} />
    );

    await waitFor(() => {
      const rows = container.querySelectorAll("tbody tr");
      expect(rows[0].textContent).toContain("1");
      expect(rows[1].textContent).toContain("2");
    });
  });

  it("현재 월로 fetchRanking을 호출한다", async () => {
    const fetchRanking = vi.fn().mockResolvedValue([]);
    render(<RankingList scoreLabel="점수" fetchRanking={fetchRanking} />);

    await waitFor(() => {
      expect(fetchRanking).toHaveBeenCalledOnce();
      const calledWith = fetchRanking.mock.calls[0][0] as string;
      expect(calledWith).toMatch(/^\d{4}-\d{2}$/);
    });
  });
});
