# @hangukit/date-fns

> [`@hangukit/holidays-core`](../holidays-core)를 `Date` 인/아웃으로 노출 ([date-fns](https://date-fns.org/) 와 함께 쓰는 사이드카) · `Date`-in/`Date`-out wrapper around `@hangukit/holidays-core`, designed to sit alongside date-fns

[한국어](#한국어) · [English](#english)

---

## 한국어

date-fns 사용자처럼 **`Date` 인스턴스로 모든 걸 처리**하는 코드베이스를 위한 어댑터입니다. 내부적으로 date-fns 의 `format(date, "yyyy-MM-dd")` 와 `parseISO()` 로 변환하므로 시간대 함정이 없습니다(로컬 날짜 구성요소 일관).

### 설치

```bash
npm i @hangukit/date-fns date-fns
# date-fns@^3.0.0 || ^4.0.0
```

### 빠른 예

```ts
import { format } from "date-fns";
import {
  isKoreanHoliday, isKoreanBusinessDay,
  addKoreanBusinessDays, koreanBusinessDaysBetween,
  isKrxBusinessDay, koreanHolidaysOf,
} from "@hangukit/date-fns";

isKoreanHoliday(new Date(2024, 1, 12));                              // true (설날 대체공휴일)
isKoreanBusinessDay(new Date(2024, 1, 13));                          // true

const r = addKoreanBusinessDays(new Date(2025, 0, 27), 3);
format(r, "yyyy-MM-dd");                                             // "2025-02-04"

koreanBusinessDaysBetween(new Date(2024, 11, 30), new Date(2025, 0, 3));   // 3

isKrxBusinessDay(new Date(2024, 11, 31));                            // false (KRX 연말 폐장)

// 추가 휴무(회사 창립기념일 등) — Date[] 로 전달
addKoreanBusinessDays(new Date(2024, 1, 13), 1, { extraHolidays: [new Date(2024, 1, 14)] });
```

### API

모든 함수는 `Date` 를 받아 `Date` 또는 원시값을 돌려줍니다(`Date` 는 로컬 자정).

| Export | 시그니처 | 비고 |
| --- | --- | --- |
| `isKoreanHoliday(date)` | `(Date) => boolean` | 대체·임시공휴일·선거일 포함 |
| `koreanHolidaysOf(date)` | `(Date) => readonly HolidayEntry[]` | 겹치는 날 여러 엔트리 |
| `isKoreanBusinessDay(date)` | `(Date) => boolean` | 토·일·공휴일 제외 |
| `addKoreanBusinessDays(date, n, opts?)` / `subKoreanBusinessDays` | `(Date, number) => Date` | 설날·추석 연휴 자동 건너뜀 |
| `nextKoreanBusinessDay` / `previousKoreanBusinessDay` | `(Date) => Date` | = `add(±1)` |
| `nearestKoreanBusinessDayForward` / `Backward` | `(Date) => Date` | 영업일이면 그대로, 아니면 가까운 다음/이전 |
| `koreanBusinessDaysBetween(start, end, opts?)` | `(Date, Date) => number` | start 제외, end 포함 |
| `isKrxHoliday(date)` / `isKrxBusinessDay(date)` | `(Date) => boolean` | KRX(한국거래소) 휴장/매매거래일 |
| `type KrDateOptions` | `{ extraHolidays?: readonly Date[] }` | 추가 휴무 |
| `type HolidayEntry` | `holidays-core` 재출력 | — |

### 주의사항

- **로컬 날짜 구성요소를 씁니다.** `new Date(2024, 1, 12)` (월은 0-기반) 또는 date-fns 의 `parseISO("2024-02-12")` 로 만든 Date 를 권장합니다. `new Date("2024-02-12")` 는 UTC 자정이라 시간대에 따라 하루 밀릴 수 있습니다.
- date-fns 는 `peerDependencies` — v3 와 v4 모두 호환.
- 2021~2026 범위 밖 연도는 [`@hangukit/holidays-core`](../holidays-core) 의 동작(빈 결과 + 1회 경고)을 따릅니다.

### 모노레포

[hangukit](../../) 모노레포의 일부. dayjs 사용자는 [`@hangukit/dayjs`](../dayjs), `Temporal.PlainDate` 사용자는 [`@hangukit/temporal`](../temporal).

---

## English

An adapter for codebases that work with `Date` instances (the date-fns style). Internally uses date-fns's `format(date, "yyyy-MM-dd")` and `parseISO()` for conversion, keeping local-component semantics consistent and free of timezone gotchas.

### Install

```bash
npm i @hangukit/date-fns date-fns
# date-fns@^3.0.0 || ^4.0.0
```

### Quick example

```ts
import { format } from "date-fns";
import {
  isKoreanHoliday, isKoreanBusinessDay,
  addKoreanBusinessDays, koreanBusinessDaysBetween,
  isKrxBusinessDay, koreanHolidaysOf,
} from "@hangukit/date-fns";

isKoreanHoliday(new Date(2024, 1, 12));                              // true (Lunar New Year substitute)
isKoreanBusinessDay(new Date(2024, 1, 13));                          // true

const r = addKoreanBusinessDays(new Date(2025, 0, 27), 3);
format(r, "yyyy-MM-dd");                                             // "2025-02-04"

koreanBusinessDaysBetween(new Date(2024, 11, 30), new Date(2025, 0, 3));   // 3

isKrxBusinessDay(new Date(2024, 11, 31));                            // false (KRX year-end closure)

// Extra closures (e.g., company founding day) as Date[]
addKoreanBusinessDays(new Date(2024, 1, 13), 1, { extraHolidays: [new Date(2024, 1, 14)] });
```

### API

All functions take `Date` and return `Date` or a primitive (`Date` values are local midnight).

| Export | Signature | Notes |
| --- | --- | --- |
| `isKoreanHoliday(date)` | `(Date) => boolean` | Includes substitute/temporary/election days |
| `koreanHolidaysOf(date)` | `(Date) => readonly HolidayEntry[]` | Multiple entries when days overlap |
| `isKoreanBusinessDay(date)` | `(Date) => boolean` | Excludes weekends & holidays |
| `addKoreanBusinessDays(date, n, opts?)` / `subKoreanBusinessDays` | `(Date, number) => Date` | Auto-skips Lunar New Year/Chuseok stretches |
| `nextKoreanBusinessDay` / `previousKoreanBusinessDay` | `(Date) => Date` | = `add(±1)` |
| `nearestKoreanBusinessDayForward` / `Backward` | `(Date) => Date` | Return as-is if already a business day |
| `koreanBusinessDaysBetween(start, end, opts?)` | `(Date, Date) => number` | Excludes start, includes end |
| `isKrxHoliday(date)` / `isKrxBusinessDay(date)` | `(Date) => boolean` | KRX (Korea Exchange) closure / trading day |
| `type KrDateOptions` | `{ extraHolidays?: readonly Date[] }` | Extra closures |
| `type HolidayEntry` | Re-exported from `holidays-core` | — |

### Notes

- **Uses local date components.** Prefer `new Date(2024, 1, 12)` (month is 0-indexed) or date-fns's `parseISO("2024-02-12")`. `new Date("2024-02-12")` is UTC midnight and may slip by a day depending on timezone.
- `date-fns` is a peer dependency — v3 and v4 both work.
- For years outside 2021–2026, behavior follows [`@hangukit/holidays-core`](../holidays-core) (empty result + one-time warning).

### Monorepo

Part of the [hangukit](../../) monorepo. dayjs users: [`@hangukit/dayjs`](../dayjs); `Temporal.PlainDate` users: [`@hangukit/temporal`](../temporal).

---

MIT License
