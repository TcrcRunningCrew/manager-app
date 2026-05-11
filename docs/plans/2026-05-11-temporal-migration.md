# Temporal Migration Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 프로젝트의 모든 시간/날짜 처리(`Date`)를 Temporal API로 치환해 타임존(KST) 안전성과 의도 명확성을 확보한다.

**Architecture:**
- `temporal-polyfill` (Stage 3 TC39, ~16KB ESM) 도입. Node 22 + Next.js 14 환경에서 서버/클라이언트 동작 검증된 패키지.
- 공통 시간 유틸 `src/lib/time/`를 만들어 모든 호출자가 동일한 KST 기준 헬퍼를 쓰도록 강제(고무도장 패턴 방지).
- ESLint `no-restricted-syntax` 룰로 신규 `Date` 사용을 차단해 회귀 방지 — 이게 **관리자(나)의 검증 수단** 그 자체.

**Tech Stack:** Next.js 14 (App Router), TypeScript, Vitest, ESLint, `temporal-polyfill`

---

## 검증 수단 (Verification Strategy)

매니저(나) 관점에서 에이전트의 작업이 “제대로 됐는지” 자동으로 판정할 수 있는 4중 게이트:

| Gate | 명령 | 합격 조건 |
|---|---|---|
| **G1. 정적 차단** | `pnpm lint` | `src/` 전역에서 `new Date(`, `Date.now(`, `getHours()/getMinutes()/...` 발견 시 ESLint 에러 (legacy/test 제외) |
| **G2. 타입** | `npx tsc --noEmit` | 변경 파일에서 신규 TS 에러 0건 |
| **G3. 단위 테스트** | `pnpm test` | `src/lib/time/__tests__/` 통과 + 기존 `MonthSelector.test.tsx` 통과 |
| **G4. 런타임** | `pnpm build` + 수동 스모크 | 빌드 성공, 출석 시 KST 시각이 푸시에 정확히 표기 |

각 Task의 마지막 Step에서 위 게이트를 부분 실행. 최종 Task 9에서 전체 게이트 통과 확인.

**스코프 격리:** `src/pages_legacy/**`, `src/__tests__/**` (테스트 픽스처용 `new Date(2025,0,1)` 같은 케이스)는 ESLint에서 화이트리스트 처리. 단, 활성 테스트는 가능하면 Temporal로 갱신.

---

## 영향받는 파일 (Audit)

### 활성 (refactor 필수)
| # | 경로 | 사용 패턴 |
|---|---|---|
| A1 | `src/app/(main)/checkout/actions.ts` | `getCurrentMonthRange()`, KST push 포맷 |
| A2 | `src/app/(main)/checkout/_components/CheckoutForm.tsx` | `new Date().toISOString().split("T")[0]` (오늘 기본값) |
| A3 | `src/app/(main)/ranking/actions.ts` | `getMonthRange(month)` |
| A4 | `src/components/organisms/RankingList.tsx` | 현재월 state + 월 이동 + `toISOString().substring(0,7)` |
| A5 | `src/components/molecules/MonthSelector.tsx` | `getFullYear`, `getMonth` 라벨 |

### 데드코드 (삭제 권장)
| # | 경로 | 근거 |
|---|---|---|
| D1 | `src/app/(main)/ranking/_components/RankingTable.tsx` | 활성 import 0건 (RankingList가 대체) |
| D2 | `src/components/common/MonthNavigation.tsx` | D1에서만 사용 |
| D3 | `src/components/common/calender.tsx` | import 0건 |
| D4 | `src/components/common/DayNavigation.tsx` | import 0건 |

---

## Task 0: 패키지 설치 + ESLint 룰 (검증 게이트 구축)

**Files:**
- Modify: `package.json`
- Modify: `.eslintrc.json` (없으면 create)

**Step 1: 패키지 설치**

```bash
npm install temporal-polyfill
```

**Step 2: ESLint 차단 룰 추가**

`.eslintrc.json`에 아래 규칙 추가. legacy/test 디렉터리는 `overrides`로 예외:

```jsonc
{
  "extends": "next/core-web-vitals",
  "rules": {
    "no-restricted-syntax": [
      "error",
      {
        "selector": "NewExpression[callee.name='Date']",
        "message": "Use Temporal.* (src/lib/time helpers) instead of new Date()."
      },
      {
        "selector": "CallExpression[callee.object.name='Date'][callee.property.name='now']",
        "message": "Use Temporal.Now.* instead of Date.now()."
      },
      {
        "selector": "CallExpression[callee.object.name='Date'][callee.property.name='UTC']",
        "message": "Use Temporal.PlainDate/ZonedDateTime instead of Date.UTC()."
      },
      {
        "selector": "MemberExpression[property.name=/^(getFullYear|getMonth|getDate|getHours|getMinutes|getSeconds|getDay|setMonth|setDate|setHours|setMinutes|toISOString|toLocaleDateString|toLocaleTimeString|toLocaleString)$/]",
        "message": "Date.prototype.* is banned. Use Temporal via src/lib/time helpers."
      }
    ]
  },
  "overrides": [
    {
      "files": ["src/pages_legacy/**", "src/__tests__/**"],
      "rules": { "no-restricted-syntax": "off" }
    }
  ]
}
```

**Step 3: 룰 작동 확인**

Run: `npx next lint --dir src/app/\(main\)/checkout 2>&1 | head -30`
Expected: 활성 파일에서 다수의 error 출력 (이후 Task들에서 해소).

**Step 4: Commit**

```bash
git add package.json package-lock.json .eslintrc.json
git commit -m "chore: add temporal-polyfill and lint rule banning raw Date usage"
```

---

## Task 1: 공통 시간 유틸 `src/lib/time/`

**Files:**
- Create: `src/lib/time/index.ts`
- Create: `src/lib/time/__tests__/index.test.ts`

**Step 1: 실패 테스트 작성**

`src/lib/time/__tests__/index.test.ts`:

```ts
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
} from "@/lib/time";
import { Temporal } from "temporal-polyfill";

describe("time helpers", () => {
  it("KST is Asia/Seoul", () => {
    expect(KST).toBe("Asia/Seoul");
  });

  it("todayInKST returns PlainDate", () => {
    const d = todayInKST();
    expect(d).toBeInstanceOf(Temporal.PlainDate);
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

  it("addMonths handles year wrap", () => {
    const ym = Temporal.PlainYearMonth.from("2026-12");
    expect(addMonths(ym, 1).toString()).toBe("2027-01");
    expect(addMonths(ym, -13).toString()).toBe("2025-11");
  });

  it("formatKstNotification uses Asia/Seoul instant", () => {
    // 2026-05-09T15:30:00Z == 2026-05-10 00:30 KST
    const instant = Temporal.Instant.from("2026-05-09T15:30:00Z");
    expect(formatKstNotification(instant)).toEqual({
      month: 5,
      day: 10,
      hour: "00",
      minute: "30",
    });
  });
});
```

Run: `npm test -- src/lib/time` — Expected: FAIL (module not found).

**Step 2: 구현**

`src/lib/time/index.ts`:

```ts
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
  return d.toString(); // ISO YYYY-MM-DD
}

export function formatYM(ym: Temporal.PlainYearMonth): string {
  return ym.toString(); // ISO YYYY-MM
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
```

Run: `npm test -- src/lib/time` — Expected: PASS.

**Step 3: Commit**

```bash
git add src/lib/time
git commit -m "feat(time): add Temporal-based KST helpers"
```

---

## Task 2: `checkout/actions.ts` 리팩토링

**Files:**
- Modify: `src/app/(main)/checkout/actions.ts`

**Step 1: `getCurrentMonthRange()` 치환**

기존 `function getCurrentMonthRange()` 블록을 다음으로 교체:

```ts
import { currentYearMonthKST, formatYM, monthRangeFromYM, formatKstNotification } from "@/lib/time";

function getCurrentMonthRange() {
  return monthRangeFromYM(formatYM(currentYearMonthKST()));
}
```

**Step 2: 푸시 알림 KST 포맷 치환**

기존 `Intl.DateTimeFormat ... formatToParts` 블록을 다음으로 교체:

```ts
const { month, day, hour, minute } = formatKstNotification();
const locationLabel = LOCATION_MAP[location] ?? location;

await sendPushToAdmins({
  title: "🏃 출석 알림",
  body: `${username}님이 ${locationLabel}에서 ${month}월 ${day}일 ${hour}:${minute} 출석했습니다`,
  url: "/admin",
});
```

**Step 3: 게이트 G1+G2**

```bash
npx next lint --dir 'src/app/(main)/checkout/actions.ts'
npx tsc --noEmit 2>&1 | grep checkout/actions || echo "OK"
```
Expected: lint 무에러, tsc 무에러.

**Step 4: Commit**

```bash
git add src/app/\(main\)/checkout/actions.ts
git commit -m "refactor(checkout): use Temporal helpers for month range and KST push time"
```

---

## Task 3: `ranking/actions.ts` 리팩토링

**Files:**
- Modify: `src/app/(main)/ranking/actions.ts:9-15`

**Step 1: 치환**

```ts
import { monthRangeFromYM } from "@/lib/time";

function getMonthRange(month: string) {
  return monthRangeFromYM(month);
}
```

(원하면 호출자에서 직접 `monthRangeFromYM(month)`를 부르고 로컬 함수 제거.)

**Step 2: 게이트 + Commit**

```bash
npx tsc --noEmit && npx next lint --dir 'src/app/(main)/ranking'
git add src/app/\(main\)/ranking/actions.ts
git commit -m "refactor(ranking): use Temporal monthRangeFromYM"
```

---

## Task 4: `CheckoutForm.tsx` 기본 참여일

**Files:**
- Modify: `src/app/(main)/checkout/_components/CheckoutForm.tsx:48`

**Step 1: 치환**

상단 import 추가:
```ts
import { todayInKST, formatYMD } from "@/lib/time";
```

`participationDate` 기본값:
```ts
participationDate: formatYMD(todayInKST()),
```

**Step 2: 게이트 + Commit**

```bash
npx tsc --noEmit
git add src/app/\(main\)/checkout/_components/CheckoutForm.tsx
git commit -m "refactor(checkout): default participationDate to KST today"
```

---

## Task 5: `RankingList.tsx` 월 네비게이션

**Files:**
- Modify: `src/components/organisms/RankingList.tsx`
- Modify: `src/components/molecules/MonthSelector.tsx` (Props 시그니처 변경)

**Step 1: RankingList state를 `PlainYearMonth`로**

```ts
import { Temporal } from "temporal-polyfill";
import { currentYearMonthKST, formatYM, addMonths } from "@/lib/time";

const [currentMonth, setCurrentMonth] = useState<Temporal.PlainYearMonth>(
  currentYearMonthKST(),
);

const changeMonth = useCallback((increment: number) => {
  setCurrentMonth((prev) => addMonths(prev, increment));
}, []);

useEffect(() => {
  const monthStr = formatYM(currentMonth);
  setUsers([]);
  fetchRanking(monthStr).then((data) => {
    setUsers(data);
    setAnimKey((k) => k + 1);
  });
}, [currentMonth, fetchRanking]);
```

**Step 2: `MonthSelector` Props 변경**

```ts
import { Temporal } from "temporal-polyfill";

interface MonthSelectorProps {
  currentMonth: Temporal.PlainYearMonth;
  changeMonth: (increment: number) => void;
}

export function MonthSelector({ currentMonth, changeMonth }: MonthSelectorProps) {
  const year = currentMonth.year;
  const month = String(currentMonth.month).padStart(2, "0");
  // ...rest unchanged
}
```

**Step 3: 테스트 갱신**

`src/__tests__/components/MonthSelector.test.tsx`에서 `new Date(2025, 0, 1)` → `Temporal.PlainYearMonth.from("2025-01")`로 변경.

**Step 4: 게이트**

```bash
npm test -- MonthSelector
npx tsc --noEmit
```

**Step 5: Commit**

```bash
git add src/components/organisms/RankingList.tsx src/components/molecules/MonthSelector.tsx src/__tests__/components/MonthSelector.test.tsx
git commit -m "refactor(ranking): use Temporal.PlainYearMonth for month navigation"
```

---

## Task 6: 데드코드 정리

**Files:**
- Delete: `src/app/(main)/ranking/_components/RankingTable.tsx`
- Delete: `src/components/common/MonthNavigation.tsx`
- Delete: `src/components/common/calender.tsx`
- Delete: `src/components/common/DayNavigation.tsx`

**Step 1: 사용처 재확인**

```bash
npx grep -r "RankingTable\|MonthNavigation\|common/calender\|DayNavigation" src --include='*.ts*' | grep -v pages_legacy
```
Expected: 출력 없음 (자기 자신 제외).

**Step 2: 삭제**

```bash
rm src/app/\(main\)/ranking/_components/RankingTable.tsx
rm src/components/common/MonthNavigation.tsx
rm src/components/common/calender.tsx
rm src/components/common/DayNavigation.tsx
```

**Step 3: 빌드 확인**

```bash
npm run build 2>&1 | tail -20
```
Expected: 무에러.

**Step 4: Commit**

```bash
git add -A
git commit -m "chore: delete unused legacy date components (replaced by Temporal-based RankingList)"
```

---

## Task 7: 최종 검증 (G1~G4 풀 게이트)

**Step 1: Lint (G1)**

```bash
npx next lint
```
Expected: `new Date` / `Date.now` / `Date.UTC` / `Date.prototype.*` 에러 0건 (legacy/test 제외).

**Step 2: TypeScript (G2)**

```bash
npx tsc --noEmit
```
Expected: 변경 파일에서 신규 에러 0건. 사전 존재하는 `__tests__/` 에러만 남음.

**Step 3: 테스트 (G3)**

```bash
npm test
```
Expected: 모든 활성 테스트 PASS.

**Step 4: 빌드 (G4)**

```bash
npm run build
```
Expected: 성공.

**Step 5: 수동 KST 스모크**

- 사이트 띄워 출석 체크 → 운영진 디바이스 푸시 알림 확인.
- 알림 본문에 표시된 시각이 출석 시점 KST와 ±1분 일치.

**Step 6: 완료 보고**

매니저(사용자)에게 다음 형식으로 보고:
- 변경 파일 목록
- G1~G4 결과 (각 명령 출력 캡처)
- 삭제된 데드코드 파일
- 후속 권장사항 (예: `pages_legacy/` 마이그레이션)

---

## 실행 모드

이 계획은 **subagent-driven**으로 실행한다. Task별 fresh subagent 1개 + 매니저(메인 세션)의 코드 리뷰. 다음 단계로 `superpowers:subagent-driven-development` 호출.
