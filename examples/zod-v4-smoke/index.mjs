// @hangukit/zod 의 스키마 헬퍼가 zod v4 에서도 동작하는지 확인.
import assert from "node:assert/strict";
import { z } from "zod";
import {
  brn,
  corporateRegistrationNumber,
  koreanMobile,
  koreanName,
  postalCode,
  rrnFormat,
} from "@hangukit/zod";

assert.equal(brn().safeParse("124-81-00998").success, true);
assert.equal(brn().safeParse("124-81-00997").success, false);
assert.equal(z.string().pipe(brn()).safeParse("1248100998").success, true);

const Form = z.object({
  bizNo: brn(),
  corpNo: corporateRegistrationNumber(),
  phone: koreanMobile(),
  name: koreanName(),
  zip: postalCode(),
});
assert.equal(
  Form.safeParse({
    bizNo: "124-81-00998",
    corpNo: "130111-0006246",
    phone: "010-1234-5678",
    name: "홍길동",
    zip: "06236",
  }).success,
  true,
);
assert.equal(
  Form.safeParse({
    bizNo: "000-00-00000",
    corpNo: "130111-0006246",
    phone: "010-1234-5678",
    name: "홍길동",
    zip: "06236",
  }).success,
  false,
);
assert.equal(rrnFormat().safeParse("900101-1234568").success, true);
assert.equal(rrnFormat().safeParse("900101-1234567").success, false);

console.log("✔ zod v4 smoke OK");
