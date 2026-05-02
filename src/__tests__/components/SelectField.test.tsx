import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SelectField } from "@/components/atoms/SelectField";

const options = [
  { value: "1", label: "러닝" },
  { value: "2", label: "등산" },
  { value: "3", label: "자전거" },
];

describe("SelectField", () => {
  it("label이 있을 때 렌더링된다", () => {
    render(<SelectField label="운동종류" options={options} />);
    expect(screen.getByText("운동종류")).toBeInTheDocument();
  });

  it("label이 없으면 label 요소가 없다", () => {
    render(<SelectField options={options} />);
    expect(screen.queryByText(/운동/)).not.toBeInTheDocument();
  });

  it("모든 options가 렌더링된다", () => {
    render(<SelectField options={options} />);
    expect(screen.getByText("러닝")).toBeInTheDocument();
    expect(screen.getByText("등산")).toBeInTheDocument();
    expect(screen.getByText("자전거")).toBeInTheDocument();
  });

  it("options의 value가 올바르게 설정된다", () => {
    render(<SelectField options={options} />);
    const select = screen.getByRole("combobox");
    const optionEls = select.querySelectorAll("option");
    expect(optionEls[0]).toHaveValue("1");
    expect(optionEls[1]).toHaveValue("2");
  });

  it("disabled 상태일 때 select가 비활성화된다", () => {
    render(<SelectField options={options} disabled />);
    expect(screen.getByRole("combobox")).toBeDisabled();
  });

  it("빈 options 배열이면 select만 렌더링된다", () => {
    render(<SelectField options={[]} />);
    const select = screen.getByRole("combobox");
    expect(select.querySelectorAll("option")).toHaveLength(0);
  });
});
