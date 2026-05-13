import { describe, expect, it } from "vitest";
import * as v from "valibot";
import {
  brn,
  corporateRegistrationNumber,
  koreanMobile,
  koreanName,
  koreanPhone,
  postalCode,
  rrnFormat,
  rrnLike,
} from "../src/index";

const ok = <S extends v.GenericSchema>(schema: S, input: unknown): boolean =>
  v.safeParse(schema, input).success;

describe("@hangukit/valibot — 검증 액션", () => {
  it("brn — 사업자등록번호 (124-81-00998 = 한국전력공사)", () => {
    const Schema = v.pipe(v.string(), brn());
    expect(ok(Schema, "124-81-00998")).toBe(true);
    expect(ok(Schema, "1248100998")).toBe(true);
    expect(ok(Schema, "124-81-00997")).toBe(false);
    expect(ok(Schema, "000-00-00000")).toBe(false);
  });

  it("corporateRegistrationNumber (130111-0006246 = 삼성전자)", () => {
    const Schema = v.pipe(v.string(), corporateRegistrationNumber());
    expect(ok(Schema, "130111-0006246")).toBe(true);
    expect(ok(Schema, "130111-0006245")).toBe(false);
  });

  it("koreanMobile / koreanPhone", () => {
    expect(ok(v.pipe(v.string(), koreanMobile()), "010-1234-5678")).toBe(true);
    expect(ok(v.pipe(v.string(), koreanMobile()), "02-123-4567")).toBe(false);
    expect(ok(v.pipe(v.string(), koreanPhone()), "02-123-4567")).toBe(true);
    expect(ok(v.pipe(v.string(), koreanPhone()), "1588-1234")).toBe(true);
    expect(ok(v.pipe(v.string(), koreanPhone()), "hello")).toBe(false);
  });

  it("koreanName(options)", () => {
    expect(ok(v.pipe(v.string(), koreanName()), "홍길동")).toBe(true);
    expect(ok(v.pipe(v.string(), koreanName()), "Hong")).toBe(false);
    expect(ok(v.pipe(v.string(), koreanName({ minLength: 2 })), "김")).toBe(false);
    expect(ok(v.pipe(v.string(), koreanName({ allowSpace: true })), "남궁 민수")).toBe(true);
  });

  it("postalCode", () => {
    expect(ok(v.pipe(v.string(), postalCode()), "06236")).toBe(true);
    expect(ok(v.pipe(v.string(), postalCode()), "135-080")).toBe(false);
  });

  it("rrnFormat / rrnLike", () => {
    expect(ok(v.pipe(v.string(), rrnFormat()), "900101-1234568")).toBe(true);
    expect(ok(v.pipe(v.string(), rrnFormat()), "900101-1234567")).toBe(false); // 체크섬 틀림
    expect(ok(v.pipe(v.string(), rrnLike()), "900101-1234567")).toBe(true); // 형식만
    expect(ok(v.pipe(v.string(), rrnLike()), "901301-1234567")).toBe(false); // 13월
  });

  it("v.object 안에서 조합", () => {
    const Form = v.object({
      bizNo: v.pipe(v.string(), brn()),
      phone: v.pipe(v.string(), koreanMobile()),
      name: v.pipe(v.string(), koreanName()),
      zip: v.pipe(v.string(), postalCode()),
    });
    const good = v.safeParse(Form, {
      bizNo: "124-81-00998",
      phone: "010-1234-5678",
      name: "홍길동",
      zip: "06236",
    });
    expect(good.success).toBe(true);
    if (good.success) {
      // 출력 타입은 string 들의 객체
      expect(good.output.bizNo).toBe("124-81-00998");
    }
    expect(
      v.safeParse(Form, {
        bizNo: "000-00-00000",
        phone: "010-1234-5678",
        name: "홍길동",
        zip: "06236",
      }).success,
    ).toBe(false);
  });
});
