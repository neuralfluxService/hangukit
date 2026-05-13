// CJS 소비자 시점에서 @kr-kit/* 가 정상 동작하는지 확인.
// (특히 require("@kr-kit/dayjs") 가 .default 없이 플러그인 함수를 돌려줘야 한다.)
const assert = require("node:assert/strict");
const { Temporal } = require("@js-temporal/polyfill");
const dayjs = require("dayjs");
const { format } = require("date-fns");
const v = require("valibot");
const { isBrn, maskRrn } = require("@kr-kit/core-validate");
const { addKoreanBusinessDays: dfAddBusinessDays } = require("@kr-kit/date-fns");
const koreaHolidays = require("@kr-kit/dayjs");
const { addBusinessDays, isHoliday } = require("@kr-kit/holidays-core");
const { addKoreanBusinessDays: tAddBusinessDays } = require("@kr-kit/temporal");
const { brn: vbrn } = require("@kr-kit/valibot");
const { brn } = require("@kr-kit/zod");

assert.equal(isBrn("124-81-00998"), true);
assert.equal(maskRrn("900101-1234568"), "900101-1******");
assert.equal(isHoliday("2026-07-17"), true); // 제헌절(2026 부활)
assert.equal(addBusinessDays("2025-01-27", 3), "2025-02-04");
assert.equal(brn().safeParse("124-81-00998").success, true);
assert.equal(v.safeParse(v.pipe(v.string(), vbrn()), "124-81-00998").success, true);

assert.equal(typeof koreaHolidays, "function", "require('@kr-kit/dayjs') 는 플러그인 함수여야 한다");
dayjs.extend(koreaHolidays);
assert.equal(dayjs("2024-02-12").isKoreanHoliday(), true);
assert.equal(dayjs("2024-12-31").isKrxBusinessDay(), false);

assert.equal(format(dfAddBusinessDays(new Date(2025, 0, 27), 3), "yyyy-MM-dd"), "2025-02-04");
assert.equal(tAddBusinessDays(Temporal.PlainDate.from("2025-01-27"), 3).toString(), "2025-02-04");

console.log("✔ CJS smoke OK");
