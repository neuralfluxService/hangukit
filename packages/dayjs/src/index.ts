import {
  addBusinessDays as coreAddBusinessDays,
  businessDaysBetween as coreBusinessDaysBetween,
  holidaysOn as coreHolidaysOn,
  isBusinessDay as coreIsBusinessDay,
  isHoliday as coreIsHoliday,
  isKrxBusinessDay as coreIsKrxBusinessDay,
  isKrxHoliday as coreIsKrxHoliday,
  type HolidayEntry,
} from "@kr-kit/holidays-core";
import type { PluginFunc } from "dayjs";

declare module "dayjs" {
  interface Dayjs {
    /** 관공서 공휴일(대체·임시공휴일·선거일 포함)인가. 토·일 자체는 제외. */
    isKoreanHoliday(): boolean;
    /** 이 날짜에 해당하는 공휴일 엔트리들(겹치는 날은 여러 개). */
    koreanHolidays(): readonly import("@kr-kit/holidays-core").HolidayEntry[];
    /** 영업일(토·일·공휴일이 아님)인가. */
    isKoreanBusinessDay(): boolean;
    /** `n` 영업일 뒤(`n<0`이면 앞)의 날짜. */
    addBusinessDays(n: number): import("dayjs").Dayjs;
    /** `n` 영업일 앞의 날짜. */
    subtractBusinessDays(n: number): import("dayjs").Dayjs;
    /** 이 날짜 이후의 첫 영업일. */
    nextKoreanBusinessDay(): import("dayjs").Dayjs;
    /** 이 날짜 이전의 첫 영업일. */
    previousKoreanBusinessDay(): import("dayjs").Dayjs;
    /** 이 날짜(제외)부터 `other`(포함)까지의 영업일 수. */
    businessDaysTo(other: string | number | Date | import("dayjs").Dayjs): number;
    /** 한국거래소(KRX) 휴장일인가. */
    isKrxHoliday(): boolean;
    /** 한국거래소(KRX) 매매거래일인가. */
    isKrxBusinessDay(): boolean;
  }
}

type DayjsInstance = import("dayjs").Dayjs;

const koreaHolidaysPlugin: PluginFunc = (_options, DayjsClass, dayjsFactory) => {
  const ymd = (d: DayjsInstance): string => d.format("YYYY-MM-DD");
  const proto = DayjsClass.prototype;

  proto.isKoreanHoliday = function isKoreanHoliday(this: DayjsInstance): boolean {
    return coreIsHoliday(ymd(this));
  };
  proto.koreanHolidays = function koreanHolidays(this: DayjsInstance): readonly HolidayEntry[] {
    return coreHolidaysOn(ymd(this));
  };
  proto.isKoreanBusinessDay = function isKoreanBusinessDay(this: DayjsInstance): boolean {
    return coreIsBusinessDay(ymd(this));
  };
  proto.addBusinessDays = function addBusinessDays(this: DayjsInstance, n: number): DayjsInstance {
    return dayjsFactory(coreAddBusinessDays(ymd(this), n));
  };
  proto.subtractBusinessDays = function subtractBusinessDays(
    this: DayjsInstance,
    n: number,
  ): DayjsInstance {
    return dayjsFactory(coreAddBusinessDays(ymd(this), -n));
  };
  proto.nextKoreanBusinessDay = function nextKoreanBusinessDay(this: DayjsInstance): DayjsInstance {
    return dayjsFactory(coreAddBusinessDays(ymd(this), 1));
  };
  proto.previousKoreanBusinessDay = function previousKoreanBusinessDay(
    this: DayjsInstance,
  ): DayjsInstance {
    return dayjsFactory(coreAddBusinessDays(ymd(this), -1));
  };
  proto.businessDaysTo = function businessDaysTo(
    this: DayjsInstance,
    other: string | number | Date | DayjsInstance,
  ): number {
    return coreBusinessDaysBetween(ymd(this), ymd(dayjsFactory(other)));
  };
  proto.isKrxHoliday = function isKrxHoliday(this: DayjsInstance): boolean {
    return coreIsKrxHoliday(ymd(this));
  };
  proto.isKrxBusinessDay = function isKrxBusinessDay(this: DayjsInstance): boolean {
    return coreIsKrxBusinessDay(ymd(this));
  };
};

export default koreaHolidaysPlugin;
