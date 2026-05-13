import { HOLIDAYS, type HolidayEntry, type HolidayKind } from "./holidays-data";

export type { HolidayEntry, HolidayKind };
export { HOLIDAYS };

/** 문자열(`YYYY-MM-DD` 또는 그것으로 시작하는 ISO) 또는 `Date`. */
export type DateInput = string | Date;

function pad2(n: number): string {
  return n < 10 ? `0${n}` : String(n);
}

/**
 * 입력을 `YYYY-MM-DD`로 정규화한다. `Date`는 **로컬** 날짜 구성요소를 사용한다
 * (즉 사용자가 보는 그 날짜). 따라서 시간대 변환으로 날짜가 밀리는 함정이 없다.
 */
export function toYmd(input: DateInput): string {
  if (typeof input === "string") {
    const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(input.trim());
    if (!m) throw new TypeError(`날짜 형식이 올바르지 않습니다(YYYY-MM-DD 필요): ${input}`);
    return `${m[1]}-${m[2]}-${m[3]}`;
  }
  if (input instanceof Date && !Number.isNaN(input.getTime())) {
    return `${input.getFullYear()}-${pad2(input.getMonth() + 1)}-${pad2(input.getDate())}`;
  }
  throw new TypeError("유효한 날짜가 아닙니다.");
}

function parsedParts(ymd: string): { y: number; mo: number; d: number } {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(ymd)!;
  return { y: Number(m[1]), mo: Number(m[2]), d: Number(m[3]) };
}

function utcDate(ymd: string): Date {
  const { y, mo, d } = parsedParts(ymd);
  return new Date(Date.UTC(y, mo - 1, d));
}

function fromUtc(date: Date): string {
  return `${date.getUTCFullYear()}-${pad2(date.getUTCMonth() + 1)}-${pad2(date.getUTCDate())}`;
}

function addDays(ymd: string, n: number): string {
  const dt = utcDate(ymd);
  dt.setUTCDate(dt.getUTCDate() + n);
  return fromUtc(dt);
}

/** 요일 (0=일 … 6=토). */
export function weekday(input: DateInput): number {
  return utcDate(toYmd(input)).getUTCDay();
}

/** 토요일 또는 일요일인가. */
export function isWeekend(input: DateInput): boolean {
  const w = weekday(input);
  return w === 0 || w === 6;
}

// ---------------------------------------------------------------------------
// 공휴일 조회
// ---------------------------------------------------------------------------

/** 데이터를 보유한 연도 목록(오름차순). */
export function coveredYears(): number[] {
  return Object.keys(HOLIDAYS)
    .map(Number)
    .sort((a, b) => a - b);
}

/** 해당 연도 데이터를 보유하고 있는가. */
export function hasYear(year: number): boolean {
  return Object.prototype.hasOwnProperty.call(HOLIDAYS, String(year));
}

const warnedYears = new Set<number>();
function warnUncovered(year: number): void {
  if (warnedYears.has(year)) return;
  warnedYears.add(year);
  const years = coveredYears();
  console.warn(
    `[@hangukit/holidays-core] ${year}년 공휴일 데이터가 없습니다(보유: ${years[0]}~${years[years.length - 1]}). \`pnpm fetch:holidays\`로 갱신하세요.`,
  );
}

/** 해당 연도의 공휴일 목록(겹치는 날은 여러 엔트리). 데이터가 없으면 빈 배열 + 1회 경고. */
export function getHolidays(year: number): readonly HolidayEntry[] {
  const list = HOLIDAYS[String(year)];
  if (!list) {
    warnUncovered(year);
    return [];
  }
  return list;
}

/** 해당 날짜에 해당하는 공휴일 엔트리들. 공휴일이 아니면 빈 배열. */
export function holidaysOn(input: DateInput): readonly HolidayEntry[] {
  const ymd = toYmd(input);
  const year = Number(ymd.slice(0, 4));
  return getHolidays(year).filter((h) => h.date === ymd);
}

/** 관공서 공휴일인가(대체공휴일·임시공휴일·선거일 포함). 토·일 자체는 포함하지 않는다. */
export function isHoliday(input: DateInput): boolean {
  return holidaysOn(input).length > 0;
}

/** 영업일인가(= 토·일이 아니고 공휴일도 아님). */
export function isBusinessDay(input: DateInput): boolean {
  return !isWeekend(input) && !isHoliday(input);
}

// ---------------------------------------------------------------------------
// 영업일 산술
// ---------------------------------------------------------------------------

export interface BusinessDayOptions {
  /** 추가로 휴무 처리할 날짜들(`YYYY-MM-DD`). 회사 창립기념일 등. */
  readonly extraHolidays?: readonly string[];
}

function businessDayCheck(ymd: string, opts?: BusinessDayOptions): boolean {
  if (isWeekend(ymd) || isHoliday(ymd)) return false;
  if (opts?.extraHolidays && opts.extraHolidays.includes(ymd)) return false;
  return true;
}

/** `date`로부터 `n` 영업일 뒤(`n<0`이면 앞)의 날짜를 `YYYY-MM-DD`로 돌려준다. */
export function addBusinessDays(input: DateInput, n: number, opts?: BusinessDayOptions): string {
  let ymd = toYmd(input);
  if (!Number.isInteger(n)) throw new TypeError("영업일 수는 정수여야 합니다.");
  if (n === 0) return ymd;
  const step = n > 0 ? 1 : -1;
  let remaining = Math.abs(n);
  while (remaining > 0) {
    ymd = addDays(ymd, step);
    if (businessDayCheck(ymd, opts)) remaining -= 1;
  }
  return ymd;
}

/** `addBusinessDays(input, -n)`. */
export function subBusinessDays(input: DateInput, n: number, opts?: BusinessDayOptions): string {
  return addBusinessDays(input, -n, opts);
}

/** `date` 이후의 첫 영업일(= `addBusinessDays(date, 1)`). */
export function nextBusinessDay(input: DateInput, opts?: BusinessDayOptions): string {
  return addBusinessDays(input, 1, opts);
}

/** `date` 이전의 첫 영업일(= `addBusinessDays(date, -1)`). */
export function previousBusinessDay(input: DateInput, opts?: BusinessDayOptions): string {
  return addBusinessDays(input, -1, opts);
}

/** `date`가 영업일이면 그대로, 아니면 그 이후의 첫 영업일. */
export function nearestBusinessDayForward(input: DateInput, opts?: BusinessDayOptions): string {
  let ymd = toYmd(input);
  while (!businessDayCheck(ymd, opts)) ymd = addDays(ymd, 1);
  return ymd;
}

/** `date`가 영업일이면 그대로, 아니면 그 이전의 첫 영업일. */
export function nearestBusinessDayBackward(input: DateInput, opts?: BusinessDayOptions): string {
  let ymd = toYmd(input);
  while (!businessDayCheck(ymd, opts)) ymd = addDays(ymd, -1);
  return ymd;
}

/** `start`(제외)부터 `end`(포함)까지 영업일 수. `start > end`면 음수. */
export function businessDaysBetween(
  start: DateInput,
  end: DateInput,
  opts?: BusinessDayOptions,
): number {
  let a = toYmd(start);
  const b = toYmd(end);
  if (a === b) return 0;
  const forward = a < b;
  const step = forward ? 1 : -1;
  let count = 0;
  while (a !== b) {
    a = addDays(a, step);
    if (businessDayCheck(a, opts)) count += forward ? 1 : -1;
  }
  return count;
}

// ---------------------------------------------------------------------------
// 한국거래소(KRX) 휴장일
// ---------------------------------------------------------------------------

/** 12월 31일(토·일이면 직전 평일)이 연말 폐장 휴장일이다. */
function yearEndKrxClosure(year: number): string {
  let ymd = `${year}-12-31`;
  while (isWeekend(ymd)) ymd = addDays(ymd, -1);
  return ymd;
}

/** KRX 휴장일인가(= 토·일 | 관공서 공휴일 | 근로자의날 5/1 | 연말 폐장일). */
export function isKrxHoliday(input: DateInput): boolean {
  const ymd = toYmd(input);
  if (isWeekend(ymd) || isHoliday(ymd)) return true;
  if (ymd.slice(5) === "05-01") return true; // 근로자의날
  const year = Number(ymd.slice(0, 4));
  return ymd === yearEndKrxClosure(year);
}

/** KRX 매매거래일인가. */
export function isKrxBusinessDay(input: DateInput): boolean {
  return !isKrxHoliday(input);
}
