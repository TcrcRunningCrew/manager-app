import { describe, it, expect, vi, beforeAll } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ConfirmDialog } from "@/components/molecules/ConfirmDialog";

beforeAll(() => {
  HTMLDialogElement.prototype.showModal = vi.fn();
  HTMLDialogElement.prototype.close = vi.fn();
});

describe("ConfirmDialog", () => {
  it("isOpen=true일 때 메시지를 렌더링한다", () => {
    render(
      <ConfirmDialog isOpen={true} onClose={vi.fn()} message="확인 메시지입니다" />
    );
    expect(screen.getByText("확인 메시지입니다")).toBeInTheDocument();
  });

  it("isOpen=false일 때 렌더링하지 않는다", () => {
    render(
      <ConfirmDialog isOpen={false} onClose={vi.fn()} message="숨겨진 메시지" />
    );
    expect(screen.queryByText("숨겨진 메시지")).not.toBeInTheDocument();
  });

  it("기본 버튼 텍스트는 'Close'이다", () => {
    render(<ConfirmDialog isOpen={true} onClose={vi.fn()} message="메시지" />);
    expect(screen.getByRole("button", { name: "Close", hidden: true })).toBeInTheDocument();
  });

  it("buttonText를 커스텀할 수 있다", () => {
    render(
      <ConfirmDialog isOpen={true} onClose={vi.fn()} message="메시지" buttonText="확인" />
    );
    expect(screen.getByRole("button", { name: "확인", hidden: true })).toBeInTheDocument();
  });

  it("버튼 클릭 시 onClose가 호출된다", () => {
    const onClose = vi.fn();
    render(<ConfirmDialog isOpen={true} onClose={onClose} message="메시지" />);
    fireEvent.click(screen.getByRole("button", { hidden: true }));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("isOpen=true일 때 showModal이 호출된다", () => {
    render(<ConfirmDialog isOpen={true} onClose={vi.fn()} message="메시지" />);
    expect(HTMLDialogElement.prototype.showModal).toHaveBeenCalled();
  });

  it("배경 오버레이 클릭 시 onClose가 호출된다", () => {
    const onClose = vi.fn();
    const { container } = render(
      <ConfirmDialog isOpen={true} onClose={onClose} message="메시지" />
    );
    const overlay = container.querySelector(".fixed.inset-0.bg-black\\/60");
    if (overlay) fireEvent.click(overlay);
    expect(onClose).toHaveBeenCalledOnce();
  });
});
