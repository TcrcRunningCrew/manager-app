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

// 폼의 <input type="time"> 기본값으로 쓰기 위한 KST 현재 "HH:MM" 문자열
export function currentTimeKST(): string {
  const z = nowInKST();
  return `${String(z.hour).padStart(2, "0")}:${String(z.minute).padStart(2, "0")}`;
}

// 폼이 보내준 "YYYY-MM-DD" + "HH:MM" (KST wall-clock) 을 알림용 parts로 변환
export function kstNotificationFromDateTime(
  date: string,
  time: string,
): KstNotificationParts {
  const plain = Temporal.PlainDateTime.from(`${date}T${time}`);
  return {
    month: plain.month,
    day: plain.day,
    hour: String(plain.hour).padStart(2, "0"),
    minute: String(plain.minute).padStart(2, "0"),
  };
}
