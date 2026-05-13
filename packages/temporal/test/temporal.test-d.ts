import type { HolidayEntry } from "@hangukit/holidays-core";
import { Temporal } from "@js-temporal/polyfill";
import { expectTypeOf } from "expect-type";
import {
  addKoreanBusinessDays,
  isKoreanBusinessDay,
  isKoreanHoliday,
  koreanBusinessDaysBetween,
  koreanHolidaysOf,
  type KrTemporalOptions,
} from "../src/index";

const pd = Temporal.PlainDate.from("2024-01-01");
expectTypeOf(isKoreanHoliday(pd)).toEqualTypeOf<boolean>();
expectTypeOf(isKoreanBusinessDay(pd)).toEqualTypeOf<boolean>();
expectTypeOf(koreanHolidaysOf(pd)).toEqualTypeOf<readonly HolidayEntry[]>();
expectTypeOf(addKoreanBusinessDays(pd, 3)).toEqualTypeOf<Temporal.PlainDate>();
expectTypeOf(addKoreanBusinessDays(pd, 3, { extraHolidays: [pd] })).toEqualTypeOf<Temporal.PlainDate>();
expectTypeOf(koreanBusinessDaysBetween(pd, pd)).toEqualTypeOf<number>();
expectTypeOf<KrTemporalOptions["extraHolidays"]>().toEqualTypeOf<readonly Temporal.PlainDate[] | undefined>();
