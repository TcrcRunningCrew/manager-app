import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { PageHeader } from "@/components/organisms/PageHeader";

const mockBack = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ back: mockBack }),
}));

vi.mock("next/link", () => ({
  default: ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => <a href={href}>{children}</a>,
}));

vi.mock("lucide-react", () => ({
  ArrowLeft: () => <svg data-testid="arrow-left" />,
}));

beforeEach(() => {
  mockBack.mockClear();
});

describe("PageHeader", () => {
  it("title을 렌더링한다", () => {
    render(<PageHeader title="출석체크" />);
    expect(screen.getByText("출석체크")).toBeInTheDocument();
  });

  it("subtitle이 있으면 렌더링한다", () => {
    render(<PageHeader title="출석체크" subtitle="TCRC 러닝크루" />);
    expect(screen.getByText("TCRC 러닝크루")).toBeInTheDocument();
  });

  it("subtitle이 없으면 렌더링하지 않는다", () => {
    render(<PageHeader title="출석체크" />);
    expect(screen.queryByText("TCRC 러닝크루")).not.toBeInTheDocument();
  });

  it("뒤로가기 버튼 클릭 시 router.back을 호출한다", () => {
    render(<PageHeader title="출석체크" />);
    fireEvent.click(screen.getByRole("button"));
    expect(mockBack).toHaveBeenCalledOnce();
  });

  it("기본 bgColor는 bg-tcrc-accent이다", () => {
    const { container } = render(<PageHeader title="출석체크" />);
    expect(container.querySelector("header")).toHaveClass("bg-tcrc-accent");
  });

  it("커스텀 bgColor를 적용할 수 있다", () => {
    const { container } = render(
      <PageHeader title="출석체크" bgColor="bg-tcrc-accent-yellow" />
    );
    expect(container.querySelector("header")).toHaveClass("bg-tcrc-accent-yellow");
  });

  it("헤더가 sticky top-0으로 고정된다", () => {
    const { container } = render(<PageHeader title="출석체크" />);
    const header = container.querySelector("header");
    expect(header).toHaveClass("sticky");
    expect(header).toHaveClass("top-0");
  });
});
