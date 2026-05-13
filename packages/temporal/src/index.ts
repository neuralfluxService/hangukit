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
} from "@hangukit/holidays-core";
import { Temporal } from "@js-temporal/polyfill";

export type { HolidayEntry };

type PlainDate = Temporal.PlainDate;

// Temporal.PlainDate 는 시간대 없는 달력 날짜라 @hangukit/holidays-core 모델과 정확히 일치한다.
// PlainDate#toString() 은 항상 ISO 날짜("YYYY-MM-DD")를 앞에 두고, 비-ISO 달력이면 "[u-ca=...]" 만
// 뒤에 붙으므로 앞 10자가 곧 ISO 날짜다.
const toYmd = (date: PlainDate): string => date.toString().slice(0, 10);
const fromYmd = (ymd: string): PlainDate => Temporal.PlainDate.from(ymd);

/** 영업일 계산에 추가로 휴무 처리할 날짜들. */
export interface KrTemporalOptions {
  readonly extraHolidays?: readonly PlainDate[];
}
const toCoreOptions = (options?: KrTemporalOptions): BusinessDayOptions | undefined =>
  options?.extraHolidays ? { extraHolidays: options.extraHolidays.map(toYmd) } : undefined;

/** 관공서 공휴일(대체·임시공휴일·선거일 포함)인가. 토·일 자체는 제외. */
export function isKoreanHoliday(date: PlainDate): boolean {
  return coreIsHoliday(toYmd(date));
}

/** 해당 날짜에 해당하는 공휴일 엔트리들(겹치는 날은 여러 개). */
export function koreanHolidaysOf(date: PlainDate): readonly HolidayEntry[] {
  return coreHolidaysOn(toYmd(date));
}

/** 영업일(토·일·공휴일이 아님)인가. */
export function isKoreanBusinessDay(date: PlainDate): boolean {
  return coreIsBusinessDay(toYmd(date));
}

/** `n` 영업일 뒤(`n<0`이면 앞)의 날짜. */
export function addKoreanBusinessDays(date: PlainDate, n: number, options?: KrTemporalOptions): PlainDate {
  return fromYmd(coreAddBusinessDays(toYmd(date), n, toCoreOptions(options)));
}

/** `addKoreanBusinessDays(date, -n)`. */
export function subKoreanBusinessDays(date: PlainDate, n: number, options?: KrTemporalOptions): PlainDate {
  return addKoreanBusinessDays(date, -n, options);
}

/** `date` 이후의 첫 영업일. */
export function nextKoreanBusinessDay(date: PlainDate, options?: KrTemporalOptions): PlainDate {
  return addKoreanBusinessDays(date, 1, options);
}

/** `date` 이전의 첫 영업일. */
export function previousKoreanBusinessDay(date: PlainDate, options?: KrTemporalOptions): PlainDate {
  return addKoreanBusinessDays(date, -1, options);
}

/** `date`가 영업일이면 그대로, 아니면 그 이후의 첫 영업일. */
export function nearestKoreanBusinessDayForward(date: PlainDate, options?: KrTemporalOptions): PlainDate {
  return fromYmd(coreNearestForward(toYmd(date), toCoreOptions(options)));
}

/** `date`가 영업일이면 그대로, 아니면 그 이전의 첫 영업일. */
export function nearestKoreanBusinessDayBackward(date: PlainDate, options?: KrTemporalOptions): PlainDate {
  return fromYmd(coreNearestBackward(toYmd(date), toCoreOptions(options)));
}

/** `start`(제외)부터 `end`(포함)까지 영업일 수. `start > end`면 음수. */
export function koreanBusinessDaysBetween(start: PlainDate, end: PlainDate, options?: KrTemporalOptions): number {
  return coreBusinessDaysBetween(toYmd(start), toYmd(end), toCoreOptions(options));
}

/** 한국거래소(KRX) 휴장일인가(= 토·일 | 관공서 공휴일 | 근로자의날 5/1 | 연말 폐장일). */
export function isKrxHoliday(date: PlainDate): boolean {
  return coreIsKrxHoliday(toYmd(date));
}

/** 한국거래소(KRX) 매매거래일인가. */
export function isKrxBusinessDay(date: PlainDate): boolean {
  return coreIsKrxBusinessDay(toYmd(date));
}
