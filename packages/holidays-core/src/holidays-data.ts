/**
 * 한국 공휴일 데이터.
 *
 * 이 파일은 `pnpm fetch:holidays`(scripts/fetch-holidays.ts)가 한국천문연구원
 * 「특일 정보」 공공데이터포털 API에서 받아 갱신하도록 설계되어 있다. 현재 시드 값은
 * 같은 출처의 공표 내용 + 정부 임시공휴일 지정 고시를 바탕으로 한 2021~2026년 데이터다.
 *
 * `kind`:
 *  - `legal`        법정공휴일·국경일(설날·추석·삼일절·광복절 등)
 *  - `substitute`   대체공휴일
 *  - `temporary`    정부가 지정한 임시공휴일
 *  - `election`     임기만료에 의한 선거일(대통령·국회의원·지방선거)
 */

export type HolidayKind = "legal" | "substitute" | "temporary" | "election";

export interface HolidayEntry {
  /** YYYY-MM-DD */
  readonly date: string;
  readonly name: string;
  readonly kind: HolidayKind;
}

export const HOLIDAYS: Readonly<Record<string, readonly HolidayEntry[]>> = {
  "2021": [
    { date: "2021-01-01", name: "신정", kind: "legal" },
    { date: "2021-02-11", name: "설날", kind: "legal" },
    { date: "2021-02-12", name: "설날", kind: "legal" },
    { date: "2021-02-13", name: "설날", kind: "legal" },
    { date: "2021-03-01", name: "삼일절", kind: "legal" },
    { date: "2021-05-05", name: "어린이날", kind: "legal" },
    { date: "2021-05-19", name: "부처님오신날", kind: "legal" },
    { date: "2021-06-06", name: "현충일", kind: "legal" },
    { date: "2021-08-15", name: "광복절", kind: "legal" },
    { date: "2021-08-16", name: "대체공휴일", kind: "substitute" },
    { date: "2021-09-20", name: "추석", kind: "legal" },
    { date: "2021-09-21", name: "추석", kind: "legal" },
    { date: "2021-09-22", name: "추석", kind: "legal" },
    { date: "2021-10-03", name: "개천절", kind: "legal" },
    { date: "2021-10-04", name: "대체공휴일", kind: "substitute" },
    { date: "2021-10-09", name: "한글날", kind: "legal" },
    { date: "2021-10-11", name: "대체공휴일", kind: "substitute" },
    { date: "2021-12-25", name: "기독탄신일", kind: "legal" },
  ],
  "2022": [
    { date: "2022-01-01", name: "신정", kind: "legal" },
    { date: "2022-01-31", name: "설날", kind: "legal" },
    { date: "2022-02-01", name: "설날", kind: "legal" },
    { date: "2022-02-02", name: "설날", kind: "legal" },
    { date: "2022-03-01", name: "삼일절", kind: "legal" },
    { date: "2022-03-09", name: "제20대 대통령선거", kind: "election" },
    { date: "2022-05-05", name: "어린이날", kind: "legal" },
    { date: "2022-05-08", name: "부처님오신날", kind: "legal" },
    { date: "2022-06-01", name: "제8회 전국동시지방선거", kind: "election" },
    { date: "2022-06-06", name: "현충일", kind: "legal" },
    { date: "2022-08-15", name: "광복절", kind: "legal" },
    { date: "2022-09-09", name: "추석", kind: "legal" },
    { date: "2022-09-10", name: "추석", kind: "legal" },
    { date: "2022-09-11", name: "추석", kind: "legal" },
    { date: "2022-09-12", name: "대체공휴일", kind: "substitute" },
    { date: "2022-10-03", name: "개천절", kind: "legal" },
    { date: "2022-10-09", name: "한글날", kind: "legal" },
    { date: "2022-10-10", name: "대체공휴일", kind: "substitute" },
    { date: "2022-12-25", name: "기독탄신일", kind: "legal" },
  ],
  "2023": [
    { date: "2023-01-01", name: "신정", kind: "legal" },
    { date: "2023-01-21", name: "설날", kind: "legal" },
    { date: "2023-01-22", name: "설날", kind: "legal" },
    { date: "2023-01-23", name: "설날", kind: "legal" },
    { date: "2023-01-24", name: "대체공휴일", kind: "substitute" },
    { date: "2023-03-01", name: "삼일절", kind: "legal" },
    { date: "2023-05-05", name: "어린이날", kind: "legal" },
    { date: "2023-05-27", name: "부처님오신날", kind: "legal" },
    { date: "2023-05-29", name: "대체공휴일", kind: "substitute" },
    { date: "2023-06-06", name: "현충일", kind: "legal" },
    { date: "2023-08-15", name: "광복절", kind: "legal" },
    { date: "2023-09-28", name: "추석", kind: "legal" },
    { date: "2023-09-29", name: "추석", kind: "legal" },
    { date: "2023-09-30", name: "추석", kind: "legal" },
    { date: "2023-10-02", name: "임시공휴일", kind: "temporary" },
    { date: "2023-10-03", name: "개천절", kind: "legal" },
    { date: "2023-10-09", name: "한글날", kind: "legal" },
    { date: "2023-12-25", name: "기독탄신일", kind: "legal" },
  ],
  "2024": [
    { date: "2024-01-01", name: "신정", kind: "legal" },
    { date: "2024-02-09", name: "설날", kind: "legal" },
    { date: "2024-02-10", name: "설날", kind: "legal" },
    { date: "2024-02-11", name: "설날", kind: "legal" },
    { date: "2024-02-12", name: "대체공휴일", kind: "substitute" },
    { date: "2024-03-01", name: "삼일절", kind: "legal" },
    { date: "2024-04-10", name: "제22대 국회의원선거", kind: "election" },
    { date: "2024-05-05", name: "어린이날", kind: "legal" },
    { date: "2024-05-06", name: "대체공휴일", kind: "substitute" },
    { date: "2024-05-15", name: "부처님오신날", kind: "legal" },
    { date: "2024-06-06", name: "현충일", kind: "legal" },
    { date: "2024-08-15", name: "광복절", kind: "legal" },
    { date: "2024-09-16", name: "추석", kind: "legal" },
    { date: "2024-09-17", name: "추석", kind: "legal" },
    { date: "2024-09-18", name: "추석", kind: "legal" },
    { date: "2024-10-01", name: "임시공휴일", kind: "temporary" },
    { date: "2024-10-03", name: "개천절", kind: "legal" },
    { date: "2024-10-09", name: "한글날", kind: "legal" },
    { date: "2024-12-25", name: "기독탄신일", kind: "legal" },
  ],
  "2025": [
    { date: "2025-01-01", name: "신정", kind: "legal" },
    { date: "2025-01-27", name: "임시공휴일", kind: "temporary" },
    { date: "2025-01-28", name: "설날", kind: "legal" },
    { date: "2025-01-29", name: "설날", kind: "legal" },
    { date: "2025-01-30", name: "설날", kind: "legal" },
    { date: "2025-03-01", name: "삼일절", kind: "legal" },
    { date: "2025-03-03", name: "대체공휴일", kind: "substitute" },
    { date: "2025-05-05", name: "어린이날", kind: "legal" },
    { date: "2025-05-05", name: "부처님오신날", kind: "legal" },
    { date: "2025-05-06", name: "대체공휴일", kind: "substitute" },
    { date: "2025-06-03", name: "제21대 대통령선거", kind: "election" },
    { date: "2025-06-06", name: "현충일", kind: "legal" },
    { date: "2025-08-15", name: "광복절", kind: "legal" },
    { date: "2025-10-03", name: "개천절", kind: "legal" },
    { date: "2025-10-05", name: "추석", kind: "legal" },
    { date: "2025-10-06", name: "추석", kind: "legal" },
    { date: "2025-10-07", name: "추석", kind: "legal" },
    { date: "2025-10-08", name: "대체공휴일", kind: "substitute" },
    { date: "2025-10-09", name: "한글날", kind: "legal" },
    { date: "2025-10-10", name: "임시공휴일", kind: "temporary" },
    { date: "2025-12-25", name: "기독탄신일", kind: "legal" },
  ],
  "2026": [
    { date: "2026-01-01", name: "신정", kind: "legal" },
    { date: "2026-02-16", name: "설날", kind: "legal" },
    { date: "2026-02-17", name: "설날", kind: "legal" },
    { date: "2026-02-18", name: "설날", kind: "legal" },
    { date: "2026-03-01", name: "삼일절", kind: "legal" },
    { date: "2026-03-02", name: "대체공휴일", kind: "substitute" },
    { date: "2026-05-05", name: "어린이날", kind: "legal" },
    { date: "2026-05-24", name: "부처님오신날", kind: "legal" },
    { date: "2026-05-25", name: "대체공휴일", kind: "substitute" },
    { date: "2026-06-03", name: "제9회 전국동시지방선거", kind: "election" },
    { date: "2026-06-06", name: "현충일", kind: "legal" },
    { date: "2026-08-15", name: "광복절", kind: "legal" },
    { date: "2026-08-17", name: "대체공휴일", kind: "substitute" },
    { date: "2026-09-24", name: "추석", kind: "legal" },
    { date: "2026-09-25", name: "추석", kind: "legal" },
    { date: "2026-09-26", name: "추석", kind: "legal" },
    { date: "2026-10-03", name: "개천절", kind: "legal" },
    { date: "2026-10-05", name: "대체공휴일", kind: "substitute" },
    { date: "2026-10-09", name: "한글날", kind: "legal" },
    { date: "2026-12-25", name: "기독탄신일", kind: "legal" },
  ],
};
