import type { HolidayEntry } from "@hangukit/holidays-core";
import dayjs from "dayjs";
import { expectTypeOf } from "expect-type";
import koreaHolidaysPlugin from "../src/index";

dayjs.extend(koreaHolidaysPlugin);
const d = dayjs();

expectTypeOf(koreaHolidaysPlugin).toExtend<dayjs.PluginFunc>();
expectTypeOf(d.isKoreanHoliday()).toEqualTypeOf<boolean>();
expectTypeOf(d.isKoreanBusinessDay()).toEqualTypeOf<boolean>();
expectTypeOf(d.koreanHolidays()).toEqualTypeOf<readonly HolidayEntry[]>();
expectTypeOf(d.addBusinessDays(3)).toEqualTypeOf<dayjs.Dayjs>();
expectTypeOf(d.subtractBusinessDays(1)).toEqualTypeOf<dayjs.Dayjs>();
expectTypeOf(d.nextKoreanBusinessDay()).toEqualTypeOf<dayjs.Dayjs>();
expectTypeOf(d.previousKoreanBusinessDay()).toEqualTypeOf<dayjs.Dayjs>();
expectTypeOf(d.businessDaysTo("2024-01-01")).toEqualTypeOf<number>();
expectTypeOf(d.businessDaysTo(dayjs())).toEqualTypeOf<number>();
expectTypeOf(d.isKrxHoliday()).toEqualTypeOf<boolean>();
expectTypeOf(d.isKrxBusinessDay()).toEqualTypeOf<boolean>();
