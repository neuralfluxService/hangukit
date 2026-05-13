import { Temporal } from "@js-temporal/polyfill";
import { describe, expect, it } from "vitest";
import {
  addKoreanBusinessDays,
  isKoreanBusinessDay,
  isKoreanHoliday,
  isKrxBusinessDay,
  isKrxHoliday,
  koreanBusinessDaysBetween,
  koreanHolidaysOf,
  nearestKoreanBusinessDayBackward,
  nearestKoreanBusinessDayForward,
  nextKoreanBusinessDay,
  previousKoreanBusinessDay,
  subKoreanBusinessDays,
} from "../src/index";

const pd = (s: string): Temporal.PlainDate => Temporal.PlainDate.from(s);

describe("@kr-kit/temporal — Temporal.PlainDate 기반 헬퍼", () => {
  it("isKoreanHoliday / koreanHolidaysOf", () => {
    expect(isKoreanHoliday(pd("2024-02-12"))).toBe(true); // 설날 대체공휴일
    expect(isKoreanHoliday(pd("2024-02-13"))).toBe(false);
    expect(isKoreanHoliday(pd("2026-07-17"))).toBe(true); // 제헌절(2026 부활)
    const names = koreanHolidaysOf(pd("2025-05-05")).map((h) => h.name);
    expect(names).toContain("어린이날");
    expect(names).toContain("부처님오신날");
  });

  it("isKoreanBusinessDay", () => {
    expect(isKoreanBusinessDay(pd("2024-02-12"))).toBe(false);
    expect(isKoreanBusinessDay(pd("2024-02-13"))).toBe(true);
    expect(isKoreanBusinessDay(pd("2024-02-10"))).toBe(false); // 토
  });

  it("addKoreanBusinessDays — 설날 연휴를 건너뛴다 (PlainDate 인/아웃)", () => {
    const result = addKoreanBusinessDays(pd("2025-01-27"), 3);
    expect(result).toBeInstanceOf(Temporal.PlainDate);
    expect(result.toString()).toBe("2025-02-04");
    expect(subKoreanBusinessDays(pd("2025-02-04"), 3).toString()).toBe("2025-01-24");
    expect(addKoreanBusinessDays(pd("2024-02-13"), 0).toString()).toBe("2024-02-13");
  });

  it("nextKoreanBusinessDay / previousKoreanBusinessDay / nearest*", () => {
    expect(nextKoreanBusinessDay(pd("2024-02-09")).toString()).toBe("2024-02-13");
    expect(previousKoreanBusinessDay(pd("2024-02-13")).toString()).toBe("2024-02-08");
    expect(nearestKoreanBusinessDayForward(pd("2024-02-12")).toString()).toBe("2024-02-13"); // 대체공휴일 → 다음
    expect(nearestKoreanBusinessDayForward(pd("2024-02-13")).toString()).toBe("2024-02-13");
    expect(nearestKoreanBusinessDayBackward(pd("2024-02-11")).toString()).toBe("2024-02-08"); // 일+설날 → 이전
    expect(nearestKoreanBusinessDayBackward(pd("2024-02-13")).toString()).toBe("2024-02-13");
  });

  it("extraHolidays 옵션 (PlainDate[])", () => {
    expect(
      addKoreanBusinessDays(pd("2024-02-13"), 1, { extraHolidays: [pd("2024-02-14")] }).toString(),
    ).toBe("2024-02-15");
  });

  it("koreanBusinessDaysBetween — 연 경계 포함", () => {
    expect(koreanBusinessDaysBetween(pd("2024-02-08"), pd("2024-02-13"))).toBe(1);
    expect(koreanBusinessDaysBetween(pd("2024-12-30"), pd("2025-01-03"))).toBe(3);
  });

  it("KRX 휴장일", () => {
    expect(isKrxBusinessDay(pd("2024-12-31"))).toBe(false);
    expect(isKrxHoliday(pd("2024-12-31"))).toBe(true);
    expect(isKrxBusinessDay(pd("2024-12-30"))).toBe(true);
    expect(isKrxHoliday(pd("2025-05-01"))).toBe(true); // 근로자의날
    expect(isKoreanHoliday(pd("2025-05-01"))).toBe(false);
    expect(isKoreanHoliday(pd("2026-05-01"))).toBe(true); // 2026~ 노동절 공휴일
  });
});
