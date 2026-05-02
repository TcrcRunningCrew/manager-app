import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { RankingCard } from "@/components/molecules/RankingCard";

describe("RankingCard", () => {
  it("'나의 랭킹' 텍스트가 항상 표시된다", () => {
    render(<RankingCard userRanking={1} allRank={10} />);
    expect(screen.getByText("나의 랭킹")).toBeInTheDocument();
  });

  it("userRanking이 있으면 순위를 표시한다", () => {
    render(<RankingCard userRanking={3} allRank={10} />);
    expect(screen.getByText("3위(전체10)")).toBeInTheDocument();
  });

  it("userRanking이 1위이면 1위를 표시한다", () => {
    render(<RankingCard userRanking={1} allRank={5} />);
    expect(screen.getByText("1위(전체5)")).toBeInTheDocument();
  });

  it("userRanking이 undefined이면 '랭킹없음'을 표시한다", () => {
    render(<RankingCard userRanking={undefined} allRank={10} />);
    expect(screen.getByText("랭킹없음")).toBeInTheDocument();
  });

  it("userRanking이 undefined이면 순위 텍스트가 없다", () => {
    render(<RankingCard userRanking={undefined} allRank={10} />);
    expect(screen.queryByText(/위\(전체/)).not.toBeInTheDocument();
  });

  it("커스텀 bgColor 클래스가 적용된다", () => {
    const { container } = render(
      <RankingCard userRanking={1} allRank={5} bgColor="bg-blue-500" />
    );
    expect(container.querySelector(".bg-blue-500")).toBeInTheDocument();
  });

  it("기본 bgColor는 bg-tcrc-accent이다", () => {
    const { container } = render(<RankingCard userRanking={1} allRank={5} />);
    expect(container.querySelector(".bg-tcrc-accent")).toBeInTheDocument();
  });
});
