import type { HolidayEntry } from "@hangukit/holidays-core";
import { expectTypeOf } from "expect-type";
import {
  addKoreanBusinessDays,
  isKoreanBusinessDay,
  isKoreanHoliday,
  koreanBusinessDaysBetween,
  koreanHolidaysOf,
  type KrDateOptions,
} from "../src/index";

const now = new Date();
expectTypeOf(isKoreanHoliday(now)).toEqualTypeOf<boolean>();
expectTypeOf(isKoreanBusinessDay(now)).toEqualTypeOf<boolean>();
expectTypeOf(koreanHolidaysOf(now)).toEqualTypeOf<readonly HolidayEntry[]>();
expectTypeOf(addKoreanBusinessDays(now, 3)).toEqualTypeOf<Date>();
expectTypeOf(addKoreanBusinessDays(now, 3, { extraHolidays: [now] })).toEqualTypeOf<Date>();
expectTypeOf(koreanBusinessDaysBetween(now, now)).toEqualTypeOf<number>();
expectTypeOf<KrDateOptions["extraHolidays"]>().toEqualTypeOf<readonly Date[] | undefined>();
