import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Card } from "@/components/atoms/Card";

describe("Card", () => {
  it("children을 렌더링한다", () => {
    render(<Card>카드 내용</Card>);
    expect(screen.getByText("카드 내용")).toBeInTheDocument();
  });

  it("기본 ios-card 클래스가 적용된다", () => {
    const { container } = render(<Card>내용</Card>);
    expect(container.firstChild).toHaveClass("ios-card");
  });

  it("기본 p-4 패딩 클래스가 적용된다", () => {
    const { container } = render(<Card>내용</Card>);
    expect(container.firstChild).toHaveClass("p-4");
  });

  it("추가 className이 병합되어 적용된다", () => {
    const { container } = render(<Card className="mt-4 bg-white">내용</Card>);
    expect(container.firstChild).toHaveClass("mt-4");
    expect(container.firstChild).toHaveClass("bg-white");
  });

  it("여러 children을 렌더링한다", () => {
    render(
      <Card>
        <span>첫 번째</span>
        <span>두 번째</span>
      </Card>
    );
    expect(screen.getByText("첫 번째")).toBeInTheDocument();
    expect(screen.getByText("두 번째")).toBeInTheDocument();
  });
});
