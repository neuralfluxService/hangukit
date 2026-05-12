// ESM 소비자 시점에서 @kr-kit/* 가 정상 동작하는지 확인.
import assert from "node:assert/strict";
import dayjs from "dayjs";
import { isBrn, maskRrn } from "@kr-kit/core-validate";
import koreaHolidays from "@kr-kit/dayjs";
import { addBusinessDays, isHoliday } from "@kr-kit/holidays-core";
import { brn, koreanMobile } from "@kr-kit/zod";

assert.equal(isBrn("124-81-00998"), true);
assert.equal(isBrn("124-81-00997"), false);
assert.equal(maskRrn("900101-1234568"), "900101-1******");

assert.equal(isHoliday("2024-02-12"), true);
assert.equal(addBusinessDays("2025-01-27", 3), "2025-02-04");

assert.equal(brn().safeParse("124-81-00998").success, true);
assert.equal(koreanMobile().safeParse("010-1234-5678").success, true);

dayjs.extend(koreaHolidays);
assert.equal(typeof koreaHolidays, "function");
assert.equal(dayjs("2024-02-12").isKoreanHoliday(), true);
assert.equal(dayjs("2025-01-27").addBusinessDays(3).format("YYYY-MM-DD"), "2025-02-04");
assert.equal(dayjs("2024-12-31").isKrxBusinessDay(), false);

console.log("✔ ESM smoke OK");
