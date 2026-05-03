import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MonthSelector } from "@/components/molecules/MonthSelector";

vi.mock("lucide-react", () => ({
  ChevronLeft: () => <svg data-testid="chevron-left" />,
  ChevronRight: () => <svg data-testid="chevron-right" />,
}));

describe("MonthSelector", () => {
  const jan2025 = new Date(2025, 0, 1);

  it("현재 월을 한국어 형식으로 표시한다", () => {
    render(<MonthSelector currentMonth={jan2025} changeMonth={vi.fn()} />);
    expect(screen.getByText(/2025년 1월/)).toBeInTheDocument();
  });

  it("이전 버튼 클릭 시 changeMonth(-1)을 호출한다", () => {
    const changeMonth = vi.fn();
    render(<MonthSelector currentMonth={jan2025} changeMonth={changeMonth} />);
    const buttons = screen.getAllByRole("button");
    fireEvent.click(buttons[0]);
    expect(changeMonth).toHaveBeenCalledWith(-1);
  });

  it("다음 버튼 클릭 시 changeMonth(1)을 호출한다", () => {
    const changeMonth = vi.fn();
    render(<MonthSelector currentMonth={jan2025} changeMonth={changeMonth} />);
    const buttons = screen.getAllByRole("button");
    fireEvent.click(buttons[1]);
    expect(changeMonth).toHaveBeenCalledWith(1);
  });

  it("다른 월도 올바르게 표시한다", () => {
    const dec2024 = new Date(2024, 11, 1);
    render(<MonthSelector currentMonth={dec2024} changeMonth={vi.fn()} />);
    expect(screen.getByText(/2024년 12월/)).toBeInTheDocument();
  });

  it("이전/다음 버튼이 각각 한 번씩만 호출된다", () => {
    const changeMonth = vi.fn();
    render(<MonthSelector currentMonth={jan2025} changeMonth={changeMonth} />);
    const buttons = screen.getAllByRole("button");
    fireEvent.click(buttons[0]);
    fireEvent.click(buttons[1]);
    expect(changeMonth).toHaveBeenCalledTimes(2);
    expect(changeMonth).toHaveBeenNthCalledWith(1, -1);
    expect(changeMonth).toHaveBeenNthCalledWith(2, 1);
  });
});
