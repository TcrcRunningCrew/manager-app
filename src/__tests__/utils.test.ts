import { describe, it, expect } from "vitest";
import { cn } from "@/lib/utils";

describe("cn", () => {
  it("단일 클래스를 반환한다", () => {
    expect(cn("text-red-500")).toBe("text-red-500");
  });

  it("여러 클래스를 공백으로 병합한다", () => {
    expect(cn("p-4", "m-2")).toBe("p-4 m-2");
  });

  it("falsy 값을 무시한다", () => {
    expect(cn("p-4", false, undefined, null, "m-2")).toBe("p-4 m-2");
  });

  it("조건부 객체 클래스를 처리한다", () => {
    expect(cn("p-4", { "text-red-500": true, "text-blue-500": false })).toBe(
      "p-4 text-red-500"
    );
  });

  it("Tailwind 중복 클래스를 마지막 것으로 병합한다", () => {
    expect(cn("p-4", "p-8")).toBe("p-8");
  });

  it("배열 클래스를 처리한다", () => {
    expect(cn(["p-4", "m-2"])).toBe("p-4 m-2");
  });

  it("빈 입력이면 빈 문자열을 반환한다", () => {
    expect(cn()).toBe("");
  });
});
