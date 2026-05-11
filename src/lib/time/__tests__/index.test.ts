import { describe, it, expect } from "vitest";
import {
  KST,
  todayInKST,
  nowInKST,
  monthRangeFromYM,
  formatYMD,
  formatYM,
  formatKstNotification,
  addMonths,
  currentYearMonthKST,
} from "@/lib/time";
import { Temporal } from "temporal-polyfill";

describe("time helpers", () => {
  it("KST is Asia/Seoul", () => {
    expect(KST).toBe("Asia/Seoul");
  });

  it("todayInKST returns a Temporal.PlainDate", () => {
    const d = todayInKST();
    expect(d).toBeInstanceOf(Temporal.PlainDate);
  });

  it("nowInKST returns a ZonedDateTime in Asia/Seoul", () => {
    const z = nowInKST();
    expect(z).toBeInstanceOf(Temporal.ZonedDateTime);
    expect(z.timeZoneId).toBe("Asia/Seoul");
  });

  it("currentYearMonthKST returns a PlainYearMonth", () => {
    const ym = currentYearMonthKST();
    expect(ym).toBeInstanceOf(Temporal.PlainYearMonth);
  });

  it("formatYMD returns YYYY-MM-DD", () => {
    const d = Temporal.PlainDate.from("2026-05-09");
    expect(formatYMD(d)).toBe("2026-05-09");
  });

  it("formatYM returns YYYY-MM", () => {
    expect(formatYM(Temporal.PlainYearMonth.from("2026-05"))).toBe("2026-05");
  });

  it("monthRangeFromYM returns first/last day of month", () => {
    const { startDay, endDay } = monthRangeFromYM("2026-02");
    expect(startDay).toBe("2026-02-01");
    expect(endDay).toBe("2026-02-28");
  });

  it("monthRangeFromYM handles leap year", () => {
    const { endDay } = monthRangeFromYM("2024-02");
    expect(endDay).toBe("2024-02-29");
  });

  it("addMonths handles year wrap forward", () => {
    const ym = Temporal.PlainYearMonth.from("2026-12");
    expect(addMonths(ym, 1).toString()).toBe("2027-01");
  });

  it("addMonths handles year wrap backward", () => {
    const ym = Temporal.PlainYearMonth.from("2026-12");
    expect(addMonths(ym, -13).toString()).toBe("2025-11");
  });

  it("formatKstNotification interprets instant in KST", () => {
    // 2026-05-09T15:30:00Z == 2026-05-10 00:30 KST
    const instant = Temporal.Instant.from("2026-05-09T15:30:00Z");
    expect(formatKstNotification(instant)).toEqual({
      month: 5,
      day: 10,
      hour: "00",
      minute: "30",
    });
  });

  it("formatKstNotification pads hour and minute to 2 digits", () => {
    const instant = Temporal.Instant.from("2026-05-09T00:05:00Z"); // 09:05 KST
    expect(formatKstNotification(instant)).toEqual({
      month: 5,
      day: 9,
      hour: "09",
      minute: "05",
    });
  });
});
