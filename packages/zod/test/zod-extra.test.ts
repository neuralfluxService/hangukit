import { describe, expect, it } from "vitest";
import { koreanName, koreanPhone, postalCode, rrnLike } from "../src/index";

describe("@hangukit/zod — 나머지 스키마", () => {
  it("koreanPhone()", () => {
    expect(koreanPhone().safeParse("02-123-4567").success).toBe(true);
    expect(koreanPhone().safeParse("1588-1234").success).toBe(true);
    expect(koreanPhone().safeParse("hello").success).toBe(false);
  });

  it("rrnLike() — 체크섬 무시, 형식만", () => {
    expect(rrnLike().safeParse("900101-1234567").success).toBe(true);
    expect(rrnLike().safeParse("901301-1234567").success).toBe(false);
  });

  it("koreanName(options)", () => {
    expect(koreanName({ minLength: 2, maxLength: 5 }).safeParse("홍길동").success).toBe(true);
    expect(koreanName({ minLength: 2 }).safeParse("김").success).toBe(false);
    expect(koreanName({ allowSpace: true }).safeParse("남궁 민수").success).toBe(true);
  });

  it("postalCode()", () => {
    expect(postalCode().safeParse("06236").success).toBe(true);
    expect(postalCode().safeParse("123").success).toBe(false);
  });
});
