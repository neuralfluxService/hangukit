import { format } from "date-fns";
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

const d = (y: number, m1to12: number, day: number): Date => new Date(y, m1to12 - 1, day);
const ymd = (date: Date): string => format(date, "yyyy-MM-dd");

describe("@hangukit/date-fns — Date 기반 헬퍼", () => {
  it("isKoreanHoliday / koreanHolidaysOf", () => {
    expect(isKoreanHoliday(d(2024, 2, 12))).toBe(true); // 설날 대체공휴일
    expect(isKoreanHoliday(d(2024, 2, 13))).toBe(false);
    expect(isKoreanHoliday(d(2026, 7, 17))).toBe(true); // 제헌절(2026 부활)
    const names = koreanHolidaysOf(d(2025, 5, 5)).map((h) => h.name);
    expect(names).toContain("어린이날");
    expect(names).toContain("부처님오신날");
  });

  it("isKoreanBusinessDay", () => {
    expect(isKoreanBusinessDay(d(2024, 2, 12))).toBe(false); // 대체공휴일
    expect(isKoreanBusinessDay(d(2024, 2, 13))).toBe(true); // 화요일
    expect(isKoreanBusinessDay(d(2024, 2, 10))).toBe(false); // 토요일
  });

  it("addKoreanBusinessDays — 설날 연휴를 건너뛴다 (Date 인/아웃)", () => {
    const result = addKoreanBusinessDays(d(2025, 1, 27), 3);
    expect(result).toBeInstanceOf(Date);
    expect(ymd(result)).toBe("2025-02-04");
    expect(ymd(subKoreanBusinessDays(d(2025, 2, 4), 3))).toBe("2025-01-24");
    expect(ymd(addKoreanBusinessDays(d(2024, 2, 13), 0))).toBe("2024-02-13");
  });

  it("nextKoreanBusinessDay / previousKoreanBusinessDay / nearest*", () => {
    expect(ymd(nextKoreanBusinessDay(d(2024, 2, 9)))).toBe("2024-02-13");
    expect(ymd(previousKoreanBusinessDay(d(2024, 2, 13)))).toBe("2024-02-08");
    expect(ymd(nearestKoreanBusinessDayForward(d(2024, 2, 12)))).toBe("2024-02-13"); // 대체공휴일 → 다음
    expect(ymd(nearestKoreanBusinessDayForward(d(2024, 2, 13)))).toBe("2024-02-13"); // 이미 영업일
    expect(ymd(nearestKoreanBusinessDayBackward(d(2024, 2, 11)))).toBe("2024-02-08"); // 일+설날 → 이전
    expect(ymd(nearestKoreanBusinessDayBackward(d(2024, 2, 13)))).toBe("2024-02-13"); // 이미 영업일
  });

  it("extraHolidays 옵션 (Date[])", () => {
    expect(ymd(addKoreanBusinessDays(d(2024, 2, 13), 1, { extraHolidays: [d(2024, 2, 14)] }))).toBe(
      "2024-02-15",
    );
  });

  it("koreanBusinessDaysBetween — 연 경계 포함", () => {
    expect(koreanBusinessDaysBetween(d(2024, 2, 8), d(2024, 2, 13))).toBe(1);
    expect(koreanBusinessDaysBetween(d(2024, 12, 30), d(2025, 1, 3))).toBe(3); // 12/31 영업일, 1/1 신정 skip
  });

  it("KRX 휴장일", () => {
    expect(isKrxBusinessDay(d(2024, 12, 31))).toBe(false); // 연말 폐장
    expect(isKrxHoliday(d(2024, 12, 31))).toBe(true);
    expect(isKrxBusinessDay(d(2024, 12, 30))).toBe(true);
    expect(isKrxHoliday(d(2025, 5, 1))).toBe(true); // 근로자의날
    expect(isKoreanHoliday(d(2025, 5, 1))).toBe(false); // 2025: 관공서 공휴일 아님
    expect(isKoreanHoliday(d(2026, 5, 1))).toBe(true); // 2026~: 노동절 공휴일
  });
});
