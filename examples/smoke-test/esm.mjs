// ESM 소비자 시점에서 @hangukit/* 7개가 정상 동작하는지 확인.
import assert from "node:assert/strict";
import { Temporal } from "@js-temporal/polyfill";
import dayjs from "dayjs";
import { format } from "date-fns";
import * as v from "valibot";
import { isBrn, maskRrn } from "@hangukit/core-validate";
import { addKoreanBusinessDays as dfAddBusinessDays, isKoreanHoliday as dfIsHoliday } from "@hangukit/date-fns";
import koreaHolidays from "@hangukit/dayjs";
import { addBusinessDays, isHoliday } from "@hangukit/holidays-core";
import { addKoreanBusinessDays as tAddBusinessDays, isKoreanHoliday as tIsHoliday } from "@hangukit/temporal";
import { brn as vbrn } from "@hangukit/valibot";
import { brn, koreanMobile } from "@hangukit/zod";

// core-validate
assert.equal(isBrn("124-81-00998"), true);
assert.equal(isBrn("124-81-00997"), false);
assert.equal(maskRrn("900101-1234568"), "900101-1******");

// holidays-core
assert.equal(isHoliday("2024-02-12"), true);
assert.equal(addBusinessDays("2025-01-27", 3), "2025-02-04");

// zod 어댑터
assert.equal(brn().safeParse("124-81-00998").success, true);
assert.equal(koreanMobile().safeParse("010-1234-5678").success, true);

// valibot 어댑터
assert.equal(v.safeParse(v.pipe(v.string(), vbrn()), "124-81-00998").success, true);
assert.equal(v.safeParse(v.pipe(v.string(), vbrn()), "124-81-00997").success, false);

// dayjs 플러그인
dayjs.extend(koreaHolidays);
assert.equal(typeof koreaHolidays, "function");
assert.equal(dayjs("2024-02-12").isKoreanHoliday(), true);
assert.equal(dayjs("2025-01-27").addBusinessDays(3).format("YYYY-MM-DD"), "2025-02-04");
assert.equal(dayjs("2024-12-31").isKrxBusinessDay(), false);

// date-fns 어댑터 (Date 인/아웃)
assert.equal(dfIsHoliday(new Date(2024, 1, 12)), true);
assert.equal(format(dfAddBusinessDays(new Date(2025, 0, 27), 3), "yyyy-MM-dd"), "2025-02-04");

// temporal 어댑터 (Temporal.PlainDate 인/아웃)
assert.equal(tIsHoliday(Temporal.PlainDate.from("2024-02-12")), true);
assert.equal(tAddBusinessDays(Temporal.PlainDate.from("2025-01-27"), 3).toString(), "2025-02-04");

console.log("✔ ESM smoke OK");
