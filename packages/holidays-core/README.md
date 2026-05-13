# @hangukit/holidays-core

> 한국 공휴일·대체공휴일·임시공휴일 데이터 + 영업일 산술 + KRX 휴장일 (의존성 0, 런타임 네트워크 호출 없음) · Korean public holidays + business-day arithmetic + KRX market closures (zero deps, no runtime network calls)

[![npm](https://img.shields.io/npm/v/@hangukit/holidays-core?label=npm)](https://www.npmjs.com/package/@hangukit/holidays-core)
[![license](https://img.shields.io/npm/l/@hangukit/holidays-core)](../../LICENSE)

[한국어](#한국어) · [English](#english)

---

## 한국어

`YYYY-MM-DD` 문자열 또는 `Date`(로컬 날짜 구성요소 사용)를 입력으로 받습니다. 공휴일 데이터는 **빌드 시점에** [공공데이터포털 한국천문연구원 특일정보 API](https://www.data.go.kr/data/15012690/openapi.do)에서 받아 패키지에 정적으로 포함되어 있어, 런타임에 네트워크를 부르지 않습니다. 현재 **2021~2026** 범위를 커버하며, 천문연 API 와 자동 대조 검증을 통과한 상태입니다(2026년 신규: 노동절 5/1, 제헌절 7/17 부활 반영).

라이브러리 어디서든 쓰일 수 있도록 어댑터가 따로 있습니다 — [`@hangukit/dayjs`](../dayjs), [`@hangukit/date-fns`](../date-fns), [`@hangukit/temporal`](../temporal).

### 설치

```bash
npm i @hangukit/holidays-core
```

### 빠른 예

```ts
import {
  isHoliday, isBusinessDay, addBusinessDays, businessDaysBetween,
  isKrxBusinessDay, holidaysOn,
} from "@hangukit/holidays-core";

isHoliday("2024-02-12");                            // true (설날 대체공휴일)
isHoliday("2026-07-17");                            // true (제헌절 — 2026 부활)
isBusinessDay("2024-12-31");                        // true (관공서는 영업일)

// 설날 연휴를 건너뛰는 D+3 영업일
addBusinessDays("2025-01-27", 3);                   // "2025-02-04"

// 회사 창립기념일 같은 추가 휴무를 함께 반영
addBusinessDays("2024-02-13", 1, { extraHolidays: ["2024-02-14"] }); // "2024-02-15"

businessDaysBetween("2024-12-30", "2025-01-03");    // 3 (12/31 영업일, 1/1 신정 skip)

isKrxBusinessDay("2024-12-31");                     // false (KRX 연말 폐장)
isKrxBusinessDay("2025-05-01");                     // false (근로자의날)

holidaysOn("2025-05-05").map(h => h.name);          // ["어린이날", "부처님오신날"]
```

### API

| Export | 설명 |
| --- | --- |
| `isHoliday(date)` / `holidaysOn(date)` | 관공서 공휴일(대체·임시공휴일·선거일 포함) 판정 / 해당일 공휴일 엔트리들 |
| `isWeekend(date)` / `weekday(date)` | 토·일 / 요일(0=일~6=토) |
| `isBusinessDay(date)` | 토·일·공휴일이 아닌가 |
| `addBusinessDays(date, n, opts?)` / `subBusinessDays` | `n` 영업일 가감, 결과는 `YYYY-MM-DD` 문자열 |
| `nextBusinessDay(date, opts?)` / `previousBusinessDay` | 다음/이전 영업일 (= `addBusinessDays(±1)`) |
| `nearestBusinessDayForward(date, opts?)` / `Backward` | 영업일이면 그대로, 아니면 가까운 다음/이전 영업일 |
| `businessDaysBetween(start, end, opts?)` | start 제외 ~ end 포함, start>end 면 음수 |
| `isKrxHoliday(date)` / `isKrxBusinessDay(date)` | KRX(한국거래소) 휴장(= 주말·관공서공휴일·근로자의날 5/1·연말 폐장일)/매매거래일 |
| `getHolidays(year)` / `coveredYears()` / `hasYear(year)` | 연도별 공휴일 목록 / 커버하는 연도 / 보유 여부 |
| `toYmd(date)` | `Date` → `YYYY-MM-DD` (로컬 구성요소) |
| `type HolidayEntry` | `{ date: "YYYY-MM-DD"; name: string; kind: "legal"\|"substitute"\|"temporary"\|"election" }` |
| `BusinessDayOptions` | `{ extraHolidays?: readonly string[] }` (회사 창립기념일 등) |

### 주의사항

- **`Date` 입력은 로컬 날짜 구성요소** (`getFullYear`/`getMonth`/`getDate`)를 씁니다. `new Date("2024-02-12")` 같은 UTC 자정 입력은 시간대에 따라 하루 밀릴 수 있으니, 로컬 날짜로 만들거나 `YYYY-MM-DD` 문자열을 쓰세요. 라이브러리는 4개 시간대(Asia/Seoul·UTC·America/Los_Angeles·Pacific/Kiritimati)에서 회귀 테스트됩니다.
- 데이터 커버 범위 밖 연도(예: 2099)는 `getHolidays(year)`가 `[]`를 반환하고 1회 경고를 출력합니다. 갱신은 모노레포의 `pnpm fetch:holidays` / `pnpm verify:holidays`(천문연 API 와 자동 대조).
- **2026년 신규**: 근로자의날(5/1)이 2026년부터 관공서 공휴일로 지정됨. 제헌절(7/17)도 「공휴일에 관한 법률」 개정으로 2026년부터 부활.

### 모노레포

[hangukit](../../) 모노레포의 코어 패키지. 어댑터: [`@hangukit/dayjs`](../dayjs) · [`@hangukit/date-fns`](../date-fns) · [`@hangukit/temporal`](../temporal).

---

## English

Accepts `YYYY-MM-DD` strings or `Date` (local components). Holiday data is fetched at **build time** from [data.go.kr "Korea Astronomy and Space Science Institute — Special Days"](https://www.data.go.kr/data/15012690/openapi.do) and statically bundled, so there are **zero runtime network calls**. Currently covers **2021–2026** and is auto-verified against the upstream API (includes 2026's newly designated Labor Day on May 1 and restored Constitution Day on July 17).

Adapters live alongside: [`@hangukit/dayjs`](../dayjs), [`@hangukit/date-fns`](../date-fns), [`@hangukit/temporal`](../temporal).

### Install

```bash
npm i @hangukit/holidays-core
```

### Quick example

```ts
import {
  isHoliday, isBusinessDay, addBusinessDays, businessDaysBetween,
  isKrxBusinessDay, holidaysOn,
} from "@hangukit/holidays-core";

isHoliday("2024-02-12");                            // true (Lunar New Year substitute holiday)
isHoliday("2026-07-17");                            // true (Constitution Day — restored in 2026)
isBusinessDay("2024-12-31");                        // true (gov't business day)

// D+3 business days skipping the Lunar New Year stretch
addBusinessDays("2025-01-27", 3);                   // "2025-02-04"

// With extra company-specific closures
addBusinessDays("2024-02-13", 1, { extraHolidays: ["2024-02-14"] }); // "2024-02-15"

businessDaysBetween("2024-12-30", "2025-01-03");    // 3 (Dec 31 = bizday, Jan 1 = holiday)

isKrxBusinessDay("2024-12-31");                     // false (KRX year-end closure)
isKrxBusinessDay("2025-05-01");                     // false (Labor Day)

holidaysOn("2025-05-05").map(h => h.name);          // ["어린이날", "부처님오신날"]
```

### API

| Export | Description |
| --- | --- |
| `isHoliday(date)` / `holidaysOn(date)` | Government holiday predicate (incl. substitute/temporary/election days) / entries on that date |
| `isWeekend(date)` / `weekday(date)` | Sat/Sun / weekday (0=Sun … 6=Sat) |
| `isBusinessDay(date)` | not weekend and not a holiday |
| `addBusinessDays(date, n, opts?)` / `subBusinessDays` | Add/sub `n` business days; returns `YYYY-MM-DD` string |
| `nextBusinessDay` / `previousBusinessDay` | = `addBusinessDays(±1)` |
| `nearestBusinessDayForward` / `Backward` | If already a business day return as-is, else nearest next/prev |
| `businessDaysBetween(start, end, opts?)` | Excludes start, includes end; negative if start>end |
| `isKrxHoliday(date)` / `isKrxBusinessDay(date)` | KRX (Korea Exchange) closure (weekend ∪ gov holiday ∪ May 1 ∪ year-end closure) / trading day |
| `getHolidays(year)` / `coveredYears()` / `hasYear(year)` | Yearly holiday list / covered years / availability |
| `toYmd(date)` | `Date` → `YYYY-MM-DD` using local components |
| `type HolidayEntry` | `{ date; name; kind: "legal"\|"substitute"\|"temporary"\|"election" }` |
| `BusinessDayOptions` | `{ extraHolidays?: readonly string[] }` (company founding days, etc.) |

### Notes

- **`Date` inputs use local components** (`getFullYear`/`getMonth`/`getDate`). `new Date("2024-02-12")` is UTC-midnight and may slip by a day depending on timezone — pass a local `Date` or a `YYYY-MM-DD` string. The library is regression-tested across four timezones (Asia/Seoul · UTC · America/Los_Angeles · Pacific/Kiritimati).
- For years outside the bundled range (e.g. 2099) `getHolidays(year)` returns `[]` and warns once. To refresh data: `pnpm fetch:holidays` / `pnpm verify:holidays` in the monorepo (auto-diff against the upstream API).
- **2026 changes**: Labor Day (May 1) was designated a government holiday from 2026; Constitution Day (July 17) restored as a public holiday from 2026.

### Monorepo

Core package of the [hangukit](../../) monorepo. Adapters: [`@hangukit/dayjs`](../dayjs) · [`@hangukit/date-fns`](../date-fns) · [`@hangukit/temporal`](../temporal).

---

MIT License
