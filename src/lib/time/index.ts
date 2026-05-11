import { Temporal } from "temporal-polyfill";

export const KST = "Asia/Seoul" as const;

export function nowInKST(): Temporal.ZonedDateTime {
  return Temporal.Now.zonedDateTimeISO(KST);
}

export function todayInKST(): Temporal.PlainDate {
  return Temporal.Now.plainDateISO(KST);
}

export function currentYearMonthKST(): Temporal.PlainYearMonth {
  const d = todayInKST();
  return Temporal.PlainYearMonth.from({ year: d.year, month: d.month });
}

export function formatYMD(d: Temporal.PlainDate): string {
  return d.toString();
}

export function formatYM(ym: Temporal.PlainYearMonth): string {
  return ym.toString();
}

export function monthRangeFromYM(ym: string): { startDay: string; endDay: string } {
  const pym = Temporal.PlainYearMonth.from(ym);
  const start = pym.toPlainDate({ day: 1 });
  const end = pym.toPlainDate({ day: pym.daysInMonth });
  return { startDay: start.toString(), endDay: end.toString() };
}

export function addMonths(
  ym: Temporal.PlainYearMonth,
  delta: number,
): Temporal.PlainYearMonth {
  return delta >= 0 ? ym.add({ months: delta }) : ym.subtract({ months: -delta });
}

export type KstNotificationParts = {
  month: number;
  day: number;
  hour: string;
  minute: string;
};

export function formatKstNotification(
  instant: Temporal.Instant = Temporal.Now.instant(),
): KstNotificationParts {
  const z = instant.toZonedDateTimeISO(KST);
  return {
    month: z.month,
    day: z.day,
    hour: String(z.hour).padStart(2, "0"),
    minute: String(z.minute).padStart(2, "0"),
  };
}
