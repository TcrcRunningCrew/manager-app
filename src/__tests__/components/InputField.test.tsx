import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { InputField } from "@/components/atoms/InputField";

describe("InputField", () => {
  it("label이 있을 때 렌더링된다", () => {
    render(<InputField label="이름" />);
    expect(screen.getByText("이름")).toBeInTheDocument();
  });

  it("label이 없으면 label 요소가 없다", () => {
    render(<InputField placeholder="입력" />);
    expect(screen.queryByRole("label")).not.toBeInTheDocument();
  });

  it("error 메시지가 렌더링된다", () => {
    render(<InputField error="필수 입력입니다" />);
    expect(screen.getByText("필수 입력입니다")).toBeInTheDocument();
  });

  it("error가 없으면 에러 메시지가 표시되지 않는다", () => {
    render(<InputField label="이름" />);
    expect(screen.queryByText(/필수/)).not.toBeInTheDocument();
  });

  it("placeholder 속성이 input에 전달된다", () => {
    render(<InputField placeholder="홍길동" />);
    expect(screen.getByPlaceholderText("홍길동")).toBeInTheDocument();
  });

  it("disabled 상태일 때 input이 비활성화된다", () => {
    render(<InputField disabled />);
    expect(screen.getByRole("textbox")).toBeDisabled();
  });
});
