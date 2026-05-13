import {
  addBusinessDays as coreAddBusinessDays,
  businessDaysBetween as coreBusinessDaysBetween,
  holidaysOn as coreHolidaysOn,
  isBusinessDay as coreIsBusinessDay,
  isHoliday as coreIsHoliday,
  isKrxBusinessDay as coreIsKrxBusinessDay,
  isKrxHoliday as coreIsKrxHoliday,
  nearestBusinessDayBackward as coreNearestBackward,
  nearestBusinessDayForward as coreNearestForward,
  type BusinessDayOptions,
  type HolidayEntry,
} from "@kr-kit/holidays-core";
import { format, parseISO } from "date-fns";

export type { HolidayEntry };

// Date 의 로컬 날짜 구성요소를 쓴다(= @kr-kit/holidays-core 의 toYmd(Date) 동작과 일치).
// 즉 사용자가 보는 그 날짜로 동작하며, `new Date("2024-02-12")` 같은 UTC 자정 입력은 시간대에 따라
// 하루 밀릴 수 있으니 date-fns 의 parseISO 등으로 로컬 날짜를 만들어 넘기세요.
const toYmd = (date: Date): string => format(date, "yyyy-MM-dd");
const fromYmd = (ymd: string): Date => parseISO(ymd); // 날짜만 문자열 → 로컬 자정

/** 영업일 계산에 추가로 휴무 처리할 날짜들. */
export interface KrDateOptions {
  readonly extraHolidays?: readonly Date[];
}
const toCoreOptions = (options?: KrDateOptions): BusinessDayOptions | undefined =>
  options?.extraHolidays ? { extraHolidays: options.extraHolidays.map(toYmd) } : undefined;

/** 관공서 공휴일(대체·임시공휴일·선거일 포함)인가. 토·일 자체는 제외. */
export function isKoreanHoliday(date: Date): boolean {
  return coreIsHoliday(toYmd(date));
}

/** 해당 날짜에 해당하는 공휴일 엔트리들(겹치는 날은 여러 개). */
export function koreanHolidaysOf(date: Date): readonly HolidayEntry[] {
  return coreHolidaysOn(toYmd(date));
}

/** 영업일(토·일·공휴일이 아님)인가. */
export function isKoreanBusinessDay(date: Date): boolean {
  return coreIsBusinessDay(toYmd(date));
}

/** `n` 영업일 뒤(`n<0`이면 앞)의 날짜. */
export function addKoreanBusinessDays(date: Date, n: number, options?: KrDateOptions): Date {
  return fromYmd(coreAddBusinessDays(toYmd(date), n, toCoreOptions(options)));
}

/** `addKoreanBusinessDays(date, -n)`. */
export function subKoreanBusinessDays(date: Date, n: number, options?: KrDateOptions): Date {
  return addKoreanBusinessDays(date, -n, options);
}

/** `date` 이후의 첫 영업일. */
export function nextKoreanBusinessDay(date: Date, options?: KrDateOptions): Date {
  return addKoreanBusinessDays(date, 1, options);
}

/** `date` 이전의 첫 영업일. */
export function previousKoreanBusinessDay(date: Date, options?: KrDateOptions): Date {
  return addKoreanBusinessDays(date, -1, options);
}

/** `date`가 영업일이면 그대로, 아니면 그 이후의 첫 영업일. */
export function nearestKoreanBusinessDayForward(date: Date, options?: KrDateOptions): Date {
  return fromYmd(coreNearestForward(toYmd(date), toCoreOptions(options)));
}

/** `date`가 영업일이면 그대로, 아니면 그 이전의 첫 영업일. */
export function nearestKoreanBusinessDayBackward(date: Date, options?: KrDateOptions): Date {
  return fromYmd(coreNearestBackward(toYmd(date), toCoreOptions(options)));
}

/** `start`(제외)부터 `end`(포함)까지 영업일 수. `start > end`면 음수. */
export function koreanBusinessDaysBetween(start: Date, end: Date, options?: KrDateOptions): number {
  return coreBusinessDaysBetween(toYmd(start), toYmd(end), toCoreOptions(options));
}

/** 한국거래소(KRX) 휴장일인가(= 토·일 | 관공서 공휴일 | 근로자의날 5/1 | 연말 폐장일). */
export function isKrxHoliday(date: Date): boolean {
  return coreIsKrxHoliday(toYmd(date));
}

/** 한국거래소(KRX) 매매거래일인가. */
export function isKrxBusinessDay(date: Date): boolean {
  return coreIsKrxBusinessDay(toYmd(date));
}
