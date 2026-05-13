# @hangukit/temporal

> [`@hangukit/holidays-core`](../holidays-core)를 [`Temporal.PlainDate`](https://tc39.es/proposal-temporal/docs/plaindate.html) 인/아웃으로 노출 · `Temporal.PlainDate` in/out wrapper around `@hangukit/holidays-core`

[한국어](#한국어) · [English](#english)

---

## 한국어

`Temporal.PlainDate` 는 시간대가 없는 달력 날짜라 한국 공휴일·영업일 모델과 정확히 일치합니다 — 시간대 함정이 원천적으로 없습니다. 네이티브 `Temporal` 이 표준화되기 전까지는 [`@js-temporal/polyfill`](https://github.com/js-temporal/temporal-polyfill) 이 런타임·타입 출처입니다(peerDependency).

### 설치

```bash
npm i @hangukit/temporal @js-temporal/polyfill
# @js-temporal/polyfill@^0.4.4 || ^0.5.0
```

### 빠른 예

```ts
import { Temporal } from "@js-temporal/polyfill";
import {
  isKoreanHoliday, isKoreanBusinessDay,
  addKoreanBusinessDays, koreanBusinessDaysBetween,
  isKrxBusinessDay, koreanHolidaysOf,
} from "@hangukit/temporal";

isKoreanHoliday(Temporal.PlainDate.from("2024-02-12"));                  // true (설날 대체공휴일)
isKoreanBusinessDay(Temporal.PlainDate.from("2024-02-13"));              // true

addKoreanBusinessDays(Temporal.PlainDate.from("2025-01-27"), 3).toString(); // "2025-02-04"

koreanBusinessDaysBetween(
  Temporal.PlainDate.from("2024-12-30"),
  Temporal.PlainDate.from("2025-01-03"),
);                                                                       // 3

isKrxBusinessDay(Temporal.PlainDate.from("2024-12-31"));                 // false
```

### API

모든 함수가 `Temporal.PlainDate` 를 받아 같은 타입 또는 원시값을 돌려줍니다.

| Export | 시그니처 |
| --- | --- |
| `isKoreanHoliday(date)` | `(PlainDate) => boolean` |
| `koreanHolidaysOf(date)` | `(PlainDate) => readonly HolidayEntry[]` |
| `isKoreanBusinessDay(date)` | `(PlainDate) => boolean` |
| `addKoreanBusinessDays(date, n, opts?)` / `subKoreanBusinessDays` | `(PlainDate, number) => PlainDate` |
| `nextKoreanBusinessDay` / `previousKoreanBusinessDay` | `(PlainDate) => PlainDate` |
| `nearestKoreanBusinessDayForward` / `Backward` | `(PlainDate) => PlainDate` |
| `koreanBusinessDaysBetween(start, end, opts?)` | `(PlainDate, PlainDate) => number` |
| `isKrxHoliday(date)` / `isKrxBusinessDay(date)` | `(PlainDate) => boolean` |
| `type KrTemporalOptions` | `{ extraHolidays?: readonly PlainDate[] }` |
| `type HolidayEntry` | `holidays-core` 재출력 |

### 주의사항

- 변환은 `PlainDate.toString()` 앞 10자(항상 ISO 날짜) ↔ `Temporal.PlainDate.from()` 으로 합니다. 비-ISO 달력의 PlainDate 도 `toString()` 이 ISO 날짜를 앞에 두므로 안전합니다.
- 네이티브 `Temporal` 이 환경에 있어도 본 패키지는 폴리필을 import 합니다(타입 일관성). 폴리필이 표준의 reference implementation 이라 동작은 동일합니다.
- 2021~2026 범위 밖 연도는 [`@hangukit/holidays-core`](../holidays-core) 의 동작(빈 결과 + 1회 경고)을 따릅니다.

### 모노레포

[hangukit](../../) 모노레포의 일부. dayjs 사용자는 [`@hangukit/dayjs`](../dayjs), native `Date` 사용자는 [`@hangukit/date-fns`](../date-fns).

---

## English

`Temporal.PlainDate` is a timezone-free calendar date, matching the Korean holiday/business-day model exactly — no timezone gotchas at all. Until native `Temporal` is standardized, [`@js-temporal/polyfill`](https://github.com/js-temporal/temporal-polyfill) is the runtime & type source (peer dependency).

### Install

```bash
npm i @hangukit/temporal @js-temporal/polyfill
# @js-temporal/polyfill@^0.4.4 || ^0.5.0
```

### Quick example

```ts
import { Temporal } from "@js-temporal/polyfill";
import {
  isKoreanHoliday, isKoreanBusinessDay,
  addKoreanBusinessDays, koreanBusinessDaysBetween,
  isKrxBusinessDay, koreanHolidaysOf,
} from "@hangukit/temporal";

isKoreanHoliday(Temporal.PlainDate.from("2024-02-12"));                  // true (Lunar New Year substitute)
isKoreanBusinessDay(Temporal.PlainDate.from("2024-02-13"));              // true

addKoreanBusinessDays(Temporal.PlainDate.from("2025-01-27"), 3).toString(); // "2025-02-04"

koreanBusinessDaysBetween(
  Temporal.PlainDate.from("2024-12-30"),
  Temporal.PlainDate.from("2025-01-03"),
);                                                                       // 3

isKrxBusinessDay(Temporal.PlainDate.from("2024-12-31"));                 // false
```

### API

Every function takes a `Temporal.PlainDate` and returns one (or a primitive).

| Export | Signature |
| --- | --- |
| `isKoreanHoliday(date)` | `(PlainDate) => boolean` |
| `koreanHolidaysOf(date)` | `(PlainDate) => readonly HolidayEntry[]` |
| `isKoreanBusinessDay(date)` | `(PlainDate) => boolean` |
| `addKoreanBusinessDays(date, n, opts?)` / `subKoreanBusinessDays` | `(PlainDate, number) => PlainDate` |
| `nextKoreanBusinessDay` / `previousKoreanBusinessDay` | `(PlainDate) => PlainDate` |
| `nearestKoreanBusinessDayForward` / `Backward` | `(PlainDate) => PlainDate` |
| `koreanBusinessDaysBetween(start, end, opts?)` | `(PlainDate, PlainDate) => number` |
| `isKrxHoliday(date)` / `isKrxBusinessDay(date)` | `(PlainDate) => boolean` |
| `type KrTemporalOptions` | `{ extraHolidays?: readonly PlainDate[] }` |
| `type HolidayEntry` | Re-exported from `holidays-core` |

### Notes

- Conversion uses the first 10 chars of `PlainDate.toString()` (always the ISO date) ↔ `Temporal.PlainDate.from()`. This stays safe even for non-ISO calendars because `toString()` always emits the ISO date first.
- The package imports the polyfill even when native `Temporal` is available (for type consistency). Behavior is identical — the polyfill is the standard's reference implementation.
- For years outside 2021–2026, behavior follows [`@hangukit/holidays-core`](../holidays-core) (empty result + one-time warning).

### Monorepo

Part of the [hangukit](../../) monorepo. dayjs users: [`@hangukit/dayjs`](../dayjs); native `Date` users: [`@hangukit/date-fns`](../date-fns).

---

MIT License
