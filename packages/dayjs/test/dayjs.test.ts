import dayjs from "dayjs";
import { beforeAll, describe, expect, it } from "vitest";
import koreaHolidays from "../src/index";

beforeAll(() => {
  dayjs.extend(koreaHolidays);
});

describe("@hangukit/dayjs 플러그인", () => {
  it("isKoreanHoliday — 법정/대체/임시공휴일", () => {
    expect(dayjs("2024-02-12").isKoreanHoliday()).toBe(true); // 설날 대체공휴일
    expect(dayjs("2023-05-29").isKoreanHoliday()).toBe(true); // 부처님오신날 대체공휴일
    expect(dayjs("2025-01-27").isKoreanHoliday()).toBe(true); // 임시공휴일
    expect(dayjs("2026-07-17").isKoreanHoliday()).toBe(true); // 제헌절(2026 부활)
    expect(dayjs("2024-02-13").isKoreanHoliday()).toBe(false);
    expect(dayjs("2024-10-10").isKoreanHoliday()).toBe(false); // 한글날(10/9 수)은 평일 → 대체 없음
  });

  it("koreanHolidays — 같은 날 여러 공휴일", () => {
    const names = dayjs("2025-05-05")
      .koreanHolidays()
      .map((h) => h.name);
    expect(names).toContain("어린이날");
    expect(names).toContain("부처님오신날");
  });

  it("isKoreanBusinessDay — 주말·공휴일 제외", () => {
    expect(dayjs("2024-02-12").isKoreanBusinessDay()).toBe(false); // 대체공휴일
    expect(dayjs("2024-02-13").isKoreanBusinessDay()).toBe(true); // 화요일 평일
    expect(dayjs("2024-02-10").isKoreanBusinessDay()).toBe(false); // 토요일
  });

  it("addBusinessDays — 설날 연휴를 건너뛴다", () => {
    // 2025-01-27(임시공휴일·월) 기준 +3 영업일:
    //  28~30(설날) 건너뛰고 → 31(금, 1) → 2/3(월, 2) → 2/4(화, 3)
    expect(dayjs("2025-01-27").addBusinessDays(3).format("YYYY-MM-DD")).toBe("2025-02-04");
    expect(dayjs("2025-02-04").subtractBusinessDays(3).format("YYYY-MM-DD")).toBe("2025-01-24");
  });

  it("nextKoreanBusinessDay / previousKoreanBusinessDay", () => {
    expect(dayjs("2024-02-09").nextKoreanBusinessDay().format("YYYY-MM-DD")).toBe("2024-02-13");
    expect(dayjs("2024-02-13").previousKoreanBusinessDay().format("YYYY-MM-DD")).toBe("2024-02-08");
  });

  it("businessDaysTo", () => {
    expect(dayjs("2024-02-08").businessDaysTo("2024-02-13")).toBe(1);
    expect(dayjs("2024-02-13").businessDaysTo(dayjs("2024-02-08"))).toBe(-1);
  });

  it("KRX 휴장일 — 연말 폐장일", () => {
    expect(dayjs("2024-12-31").isKrxBusinessDay()).toBe(false); // 12/31(화) 폐장
    expect(dayjs("2024-12-31").isKrxHoliday()).toBe(true);
    expect(dayjs("2024-12-30").isKrxBusinessDay()).toBe(true); // 12/30(월) 마지막 거래일
    expect(dayjs("2025-05-01").isKrxHoliday()).toBe(true); // 근로자의날
    expect(dayjs("2025-05-01").isKoreanHoliday()).toBe(false); // 근로자의날은 관공서 공휴일 아님
  });
});
