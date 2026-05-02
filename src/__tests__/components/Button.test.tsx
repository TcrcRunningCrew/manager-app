import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "@/components/atoms/Button";

describe("Button", () => {
  it("children 텍스트를 렌더링한다", () => {
    render(<Button>클릭</Button>);
    expect(screen.getByRole("button", { name: "클릭" })).toBeInTheDocument();
  });

  it("onClick 핸들러가 호출된다", () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>클릭</Button>);
    fireEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("disabled 상태일 때 클릭이 차단된다", () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick} disabled>클릭</Button>);
    const btn = screen.getByRole("button");
    expect(btn).toBeDisabled();
  });

  it("variant='destructive'일 때 적절한 클래스를 적용한다", () => {
    render(<Button variant="destructive">삭제</Button>);
    const btn = screen.getByRole("button");
    expect(btn.className).toContain("bg-tcrc-status-error");
  });

  it("size='full'일 때 w-full 클래스를 적용한다", () => {
    render(<Button size="full">전체</Button>);
    const btn = screen.getByRole("button");
    expect(btn.className).toContain("w-full");
  });

  it("type 속성을 전달한다", () => {
    render(<Button type="submit">제출</Button>);
    expect(screen.getByRole("button")).toHaveAttribute("type", "submit");
  });
});
