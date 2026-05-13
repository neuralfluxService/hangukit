# @hangukit/dayjs

> [`@hangukit/holidays-core`](../holidays-core)의 [dayjs](https://day.js.org/) 플러그인 — `dayjs().isKoreanHoliday()` · dayjs plugin for `@hangukit/holidays-core` — `dayjs().isKoreanHoliday()`

[![npm](https://img.shields.io/npm/v/@hangukit/dayjs?label=npm)](https://www.npmjs.com/package/@hangukit/dayjs)
[![license](https://img.shields.io/npm/l/@hangukit/dayjs)](../../LICENSE)

[한국어](#한국어) · [English](#english)

---

## 한국어

`dayjs.extend()` 한 번으로 dayjs 인스턴스에 한국 공휴일·영업일·KRX 휴장일 메서드가 붙습니다. 데이터·로직은 [`@hangukit/holidays-core`](../holidays-core)에서 옵니다.

### 설치

```bash
npm i @hangukit/dayjs dayjs
# dayjs@^1.11.0
```

### 빠른 예

```ts
import dayjs from "dayjs";
import koreaHolidays from "@hangukit/dayjs";

dayjs.extend(koreaHolidays);

dayjs("2024-02-12").isKoreanHoliday();                       // true (설날 대체공휴일)
dayjs("2024-02-13").isKoreanBusinessDay();                   // true (영업일)
dayjs("2026-07-17").isKoreanHoliday();                       // true (제헌절 2026 부활)

dayjs("2025-01-27").addBusinessDays(3).format("YYYY-MM-DD"); // "2025-02-04" — 설날 연휴 건너뜀
dayjs("2024-02-13").subtractBusinessDays(3).format("YYYY-MM-DD");
dayjs("2024-02-09").nextKoreanBusinessDay().format("YYYY-MM-DD"); // "2024-02-13"

dayjs("2024-12-31").isKrxBusinessDay();                      // false — KRX 연말 폐장
dayjs("2025-05-01").isKrxHoliday();                          // true  — 근로자의날 (2025: KRX만)
```

### CJS 사용

```js
const dayjs = require("dayjs");
const koreaHolidays = require("@hangukit/dayjs");          // 플러그인 함수가 그대로 옴 (.default 불필요)
dayjs.extend(koreaHolidays);
```

### 추가되는 메서드

| 메서드 | 반환 |
| --- | --- |
| `dayjs().isKoreanHoliday()` | `boolean` |
| `dayjs().koreanHolidays()` | `readonly HolidayEntry[]` |
| `dayjs().isKoreanBusinessDay()` | `boolean` |
| `dayjs().addBusinessDays(n)` / `subtractBusinessDays(n)` | `Dayjs` |
| `dayjs().nextKoreanBusinessDay()` / `previousKoreanBusinessDay()` | `Dayjs` |
| `dayjs().businessDaysTo(other)` | `number` (start 제외, end 포함) |
| `dayjs().isKrxHoliday()` / `isKrxBusinessDay()` | `boolean` |

### 주의사항

- **CJS 인터롭**: 빌드는 `module.exports = plugin` 으로 나옵니다(즉 `require("@hangukit/dayjs")` 가 곧 플러그인 함수). 타입 선언은 `export default` 라 `attw` 가 `FalseExportDefault` 로 표시하지만 `esModuleInterop` 환경에서는 정상 동작합니다.
- 데이터 커버 범위(2021~2026) 밖 연도는 `holidays-core` 가 `[]` + 1회 경고를 돌려주며, 영업일 산술은 주말 여부로만 계산됩니다. 자세한 동작/주의는 [`@hangukit/holidays-core`](../holidays-core).

### 모노레포

[hangukit](../../) 모노레포의 일부. native `Date` 사용자는 [`@hangukit/date-fns`](../date-fns), `Temporal.PlainDate` 사용자는 [`@hangukit/temporal`](../temporal).

---

## English

A single `dayjs.extend()` attaches Korean holiday / business-day / KRX market methods to dayjs instances. Data & logic come from [`@hangukit/holidays-core`](../holidays-core).

### Install

```bash
npm i @hangukit/dayjs dayjs
# dayjs@^1.11.0
```

### Quick example

```ts
import dayjs from "dayjs";
import koreaHolidays from "@hangukit/dayjs";

dayjs.extend(koreaHolidays);

dayjs("2024-02-12").isKoreanHoliday();                       // true (substitute for Lunar New Year)
dayjs("2024-02-13").isKoreanBusinessDay();                   // true
dayjs("2026-07-17").isKoreanHoliday();                       // true (Constitution Day, restored 2026)

dayjs("2025-01-27").addBusinessDays(3).format("YYYY-MM-DD"); // "2025-02-04" — skips Lunar New Year stretch
dayjs("2024-02-13").subtractBusinessDays(3).format("YYYY-MM-DD");
dayjs("2024-02-09").nextKoreanBusinessDay().format("YYYY-MM-DD"); // "2024-02-13"

dayjs("2024-12-31").isKrxBusinessDay();                      // false — KRX year-end closure
dayjs("2025-05-01").isKrxHoliday();                          // true  — Labor Day (KRX only in 2025)
```

### CJS usage

```js
const dayjs = require("dayjs");
const koreaHolidays = require("@hangukit/dayjs");          // the plugin function directly (no .default)
dayjs.extend(koreaHolidays);
```

### Methods added

| Method | Returns |
| --- | --- |
| `dayjs().isKoreanHoliday()` | `boolean` |
| `dayjs().koreanHolidays()` | `readonly HolidayEntry[]` |
| `dayjs().isKoreanBusinessDay()` | `boolean` |
| `dayjs().addBusinessDays(n)` / `subtractBusinessDays(n)` | `Dayjs` |
| `dayjs().nextKoreanBusinessDay()` / `previousKoreanBusinessDay()` | `Dayjs` |
| `dayjs().businessDaysTo(other)` | `number` (excludes start, includes end) |
| `dayjs().isKrxHoliday()` / `isKrxBusinessDay()` | `boolean` |

### Notes

- **CJS interop**: the CJS build emits `module.exports = plugin` (i.e. `require("@hangukit/dayjs")` is the plugin function directly). The type declaration uses `export default`, so `attw` flags `FalseExportDefault`, but runtime works fine under `esModuleInterop` (the common default).
- For years outside the bundled 2021–2026 range, `holidays-core` returns `[]` and warns once; business-day arithmetic then considers weekends only. See [`@hangukit/holidays-core`](../holidays-core) for details.

### Monorepo

Part of the [hangukit](../../) monorepo. Native `Date` users: [`@hangukit/date-fns`](../date-fns); `Temporal.PlainDate` users: [`@hangukit/temporal`](../temporal).

---

MIT License
