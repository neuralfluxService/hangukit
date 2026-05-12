import { describe, expect, it } from "vitest";
import {
  addBusinessDays,
  businessDaysBetween,
  coveredYears,
  getHolidays,
  hasYear,
  isBusinessDay,
  isHoliday,
  isKrxBusinessDay,
  isKrxHoliday,
  isWeekend,
  toYmd,
  weekday,
} from "../src/index";

describe("시간대 견고성 (run-tz-matrix.mjs가 4개 TZ에서 재실행)", () => {
  it("Date 입력은 로컬 날짜 구성요소를 쓴다 — TZ가 달라도 같은 결과", () => {
    expect(toYmd(new Date(2024, 1, 12))).toBe("2024-02-12"); // 2월=인덱스1
    expect(toYmd(new Date(2024, 11, 31, 23, 59, 59))).toBe("2024-12-31");
    expect(toYmd(new Date(2025, 0, 1, 0, 0, 0))).toBe("2025-01-01");
    expect(weekday(new Date(2024, 1, 10))).toBe(6); // 토
    expect(isHoliday(new Date(2024, 1, 12))).toBe(true); // 설날 대체공휴일
    expect(isHoliday(new Date(2024, 1, 13))).toBe(false);
  });
});

describe("연 경계", () => {
  it("12/31은 관공서 영업일이지만 KRX는 폐장", () => {
    expect(isBusinessDay("2024-12-31")).toBe(true); // 화요일, 관공서 공휴일 아님
    expect(isKrxBusinessDay("2024-12-31")).toBe(false); // KRX 연말 폐장
  });

  it("addBusinessDays가 연도를 넘어간다 (12/31은 영업일, 1/1 신정은 건너뜀)", () => {
    // 2024-12-30(월) +3: 12/31(화,1) → 1/1(수,신정 skip) → 1/2(목,2) → 1/3(금,3)
    expect(addBusinessDays("2024-12-30", 1)).toBe("2024-12-31");
    expect(addBusinessDays("2024-12-30", 3)).toBe("2025-01-03");
    expect(addBusinessDays("2024-12-31", 1)).toBe("2025-01-02");
    // 역방향: 2025-01-02(목) -2: 1/1(수,신정 skip) → 12/31(화,1) → 12/30(월,2)
    expect(addBusinessDays("2025-01-02", -2)).toBe("2024-12-30");
  });

  it("businessDaysBetween가 연도를 넘어간다", () => {
    expect(businessDaysBetween("2024-12-30", "2025-01-03")).toBe(3);
    expect(businessDaysBetween("2025-01-03", "2024-12-30")).toBe(-3);
  });

  it("12/31이 토·일이면 직전 평일이 KRX 폐장 휴장일", () => {
    // 2023-12-31 = 일요일 → 2023-12-29(금)이 폐장 휴장일
    expect(weekday("2023-12-31")).toBe(0);
    expect(isKrxHoliday("2023-12-29")).toBe(true);
    expect(isKrxHoliday("2023-12-31")).toBe(true); // 일요일이라 어차피 휴장
    expect(isKrxHoliday("2023-12-28")).toBe(false); // 목요일, 그해 마지막 거래일
  });
});

describe("데이터 미보유 연도", () => {
  it("빈 배열 + isHoliday=false (throw 아님)", () => {
    expect(hasYear(2099)).toBe(false);
    expect(getHolidays(2099)).toEqual([]);
    expect(() => isHoliday("2099-01-01")).not.toThrow();
    expect(isHoliday("2099-01-01")).toBe(false);
    expect(isHoliday("2099-12-25")).toBe(false); // 데이터 없으니 성탄절도 감지 안 됨
    // 데이터 없는 연도에서 영업일 판정은 주말 여부만으로 동작 (공휴일은 없는 것으로 간주)
    expect(isBusinessDay("2099-12-26")).toBe(!isWeekend("2099-12-26"));
  });

  it("coveredYears는 보유 연도만 (오름차순)", () => {
    expect(coveredYears()).toEqual([2021, 2022, 2023, 2024, 2025, 2026]);
    expect(hasYear(2026)).toBe(true);
    expect(hasYear(2020)).toBe(false);
  });
});
