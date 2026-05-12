import { describe, expect, it } from "vitest";
import { z } from "zod";
import {
  brn,
  corporateRegistrationNumber,
  koreanMobile,
  koreanName,
  postalCode,
  rrnFormat,
} from "../src/index";

describe("@kr-kit/zod 스키마 헬퍼", () => {
  it("brn() — 사업자등록번호 스키마", () => {
    const schema = brn();
    expect(schema.safeParse("124-81-00998").success).toBe(true);
    expect(schema.safeParse("124-81-00997").success).toBe(false);
  });

  it("z.string().pipe(brn()) 형태로도 쓸 수 있다", () => {
    const schema = z.string().pipe(brn());
    expect(schema.safeParse("1248100998").success).toBe(true);
  });

  it("z.object 안에서 조합", () => {
    const Form = z.object({
      bizNo: brn(),
      corpNo: corporateRegistrationNumber(),
      phone: koreanMobile(),
      name: koreanName(),
      zip: postalCode(),
    });
    const ok = Form.safeParse({
      bizNo: "124-81-00998",
      corpNo: "130111-0006246",
      phone: "010-1234-5678",
      name: "홍길동",
      zip: "06236",
    });
    expect(ok.success).toBe(true);

    const bad = Form.safeParse({
      bizNo: "000-00-00000",
      corpNo: "130111-0006246",
      phone: "010-1234-5678",
      name: "홍길동",
      zip: "06236",
    });
    expect(bad.success).toBe(false);
  });

  it("rrnFormat() — 형식 + 구 체크섬", () => {
    expect(rrnFormat().safeParse("900101-1234568").success).toBe(true);
    expect(rrnFormat().safeParse("900101-1234567").success).toBe(false);
  });
});
