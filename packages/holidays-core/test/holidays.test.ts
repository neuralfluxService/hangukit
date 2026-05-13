import { describe, expect, it } from "vitest";
import {
  addBusinessDays,
  businessDaysBetween,
  coveredYears,
  getHolidays,
  hasYear,
  holidaysOn,
  isBusinessDay,
  isHoliday,
  isKrxBusinessDay,
  isKrxHoliday,
  isWeekend,
  nearestBusinessDayBackward,
  nearestBusinessDayForward,
  nextBusinessDay,
  previousBusinessDay,
  subBusinessDays,
  toYmd,
  weekday,
} from "../src/index";

describe("toYmd / weekday / isWeekend", () => {
  it("문자열·Date를 YYYY-MM-DD로 정규화", () => {
    expect(toYmd("2024-02-12")).toBe("2024-02-12");
    expect(toYmd("2024-02-12T09:30:00+09:00")).toBe("2024-02-12");
    expect(toYmd(new Date(2024, 1, 12))).toBe("2024-02-12"); // 로컬 날짜 구성요소
    expect(() => toYmd("2024/02/12")).toThrow();
  });

  it("요일/주말 판정", () => {
    expect(weekday("2024-02-10")).toBe(6); // 토
    expect(weekday("2024-02-11")).toBe(0); // 일
    expect(weekday("2024-02-13")).toBe(2); // 화
    expect(isWeekend("2024-02-10")).toBe(true);
    expect(isWeekend("2024-02-13")).toBe(false);
  });
});

describe("공휴일 데이터 (알려진 패턴)", () => {
  it("데이터 커버 연도", () => {
    expect(hasYear(2024)).toBe(true);
    expect(hasYear(2099)).toBe(false);
    expect(coveredYears()).toEqual([2021, 2022, 2023, 2024, 2025, 2026]);
  });

  it("설날 대체공휴일 2024-02-12", () => {
    expect(isHoliday("2024-02-12")).toBe(true);
    expect(holidaysOn("2024-02-12").map((h) => h.kind)).toContain("substitute");
  });

  it("부처님오신날 대체공휴일 2023-05-29 (2023년 신설 규칙)", () => {
    expect(isHoliday("2023-05-29")).toBe(true);
    expect(holidaysOn("2023-05-29").some((h) => h.kind === "substitute")).toBe(true);
    // 2021년에는 부처님오신날 대체공휴일 규칙이 없었다 (당시엔 평일이기도 했음)
    expect(isHoliday("2021-05-19")).toBe(true); // 부처님오신날 당일은 공휴일
    expect(isHoliday("2021-05-20")).toBe(false);
  });

  it("한글날이 일요일인 해(2022)는 대체공휴일이 생기고, 평일인 해(2024)는 안 생긴다", () => {
    expect(weekday("2022-10-09")).toBe(0); // 일
    expect(isHoliday("2022-10-10")).toBe(true); // 대체공휴일
    expect(weekday("2024-10-09")).toBe(3); // 수
    expect(isHoliday("2024-10-10")).toBe(false);
  });

  it("임시공휴일 오버라이드가 반영된다", () => {
    expect(holidaysOn("2025-01-27").map((h) => h.kind)).toEqual(["temporary"]); // 설날 끼인날
    expect(holidaysOn("2024-10-01").map((h) => h.kind)).toEqual(["temporary"]); // 국군의날
    expect(holidaysOn("2023-10-02").map((h) => h.kind)).toEqual(["temporary"]); // 추석 끼인날
  });

  it("선거일도 공휴일로 본다", () => {
    expect(isHoliday("2024-04-10")).toBe(true); // 제22대 국회의원선거
    expect(holidaysOn("2024-04-10").map((h) => h.kind)).toEqual(["election"]);
  });

  it("2026년 제헌절(7/17) 부활분이 반영된다", () => {
    expect(isHoliday("2026-07-17")).toBe(true);
    expect(holidaysOn("2026-07-17").map((h) => h.name)).toEqual(["제헌절"]);
  });

  it("같은 날 여러 공휴일(2025-05-05 = 어린이날 + 부처님오신날)", () => {
    expect(holidaysOn("2025-05-05").map((h) => h.name)).toEqual(["어린이날", "부처님오신날"]);
  });

  it("getHolidays — 데이터가 없는 연도는 빈 배열", () => {
    expect(getHolidays(1999)).toEqual([]);
  });
});

describe("영업일 산술", () => {
  it("isBusinessDay", () => {
    expect(isBusinessDay("2024-02-12")).toBe(false); // 대체공휴일
    expect(isBusinessDay("2024-02-13")).toBe(true);
    expect(isBusinessDay("2024-02-10")).toBe(false); // 토
  });

  it("addBusinessDays — 설날 연휴(2025-01-28~30 + 임시공휴일 01-27)를 건너뛴다", () => {
    expect(addBusinessDays("2025-01-27", 3)).toBe("2025-02-04");
    expect(addBusinessDays("2025-01-24", 1)).toBe("2025-01-31");
    expect(subBusinessDays("2025-02-04", 3)).toBe("2025-01-24");
    expect(addBusinessDays("2024-02-13", 0)).toBe("2024-02-13");
  });

  it("nextBusinessDay / previousBusinessDay", () => {
    expect(nextBusinessDay("2024-02-09")).toBe("2024-02-13");
    expect(previousBusinessDay("2024-02-13")).toBe("2024-02-08");
  });

  it("nearestBusinessDayForward / nearestBusinessDayBackward — 영업일이면 그대로", () => {
    expect(nearestBusinessDayForward("2024-02-13")).toBe("2024-02-13"); // 화요일 = 영업일
    expect(nearestBusinessDayForward("2024-02-10")).toBe("2024-02-13"); // 토 → 다음 영업일
    expect(nearestBusinessDayForward("2024-02-12")).toBe("2024-02-13"); // 대체공휴일 → 다음 영업일
    expect(nearestBusinessDayBackward("2024-02-13")).toBe("2024-02-13");
    expect(nearestBusinessDayBackward("2024-02-11")).toBe("2024-02-08"); // 일+설날 → 이전 영업일
  });

  it("extraHolidays 옵션 (영업일 산술 + nearest)", () => {
    expect(addBusinessDays("2024-02-13", 1, { extraHolidays: ["2024-02-14"] })).toBe("2024-02-15");
    expect(nearestBusinessDayForward("2024-02-14", { extraHolidays: ["2024-02-14"] })).toBe(
      "2024-02-15",
    );
    expect(nearestBusinessDayBackward("2024-02-14", { extraHolidays: ["2024-02-14"] })).toBe(
      "2024-02-13",
    );
  });

  it("addBusinessDays — 정수가 아니면 throw", () => {
    expect(() => addBusinessDays("2024-02-13", 1.5)).toThrow();
  });

  it("businessDaysBetween", () => {
    expect(businessDaysBetween("2024-02-08", "2024-02-13")).toBe(1);
    expect(businessDaysBetween("2024-02-13", "2024-02-08")).toBe(-1);
    expect(businessDaysBetween("2024-02-13", "2024-02-13")).toBe(0);
  });
});

describe("한국거래소(KRX) 휴장일", () => {
  it("연말 폐장일(12-31, 평일이면 그날)", () => {
    expect(isKrxHoliday("2024-12-31")).toBe(true); // 2024-12-31 = 화요일 → 폐장
    expect(isKrxBusinessDay("2024-12-31")).toBe(false);
    expect(isKrxBusinessDay("2024-12-30")).toBe(true); // 마지막 거래일
  });

  it("근로자의날 5/1 — 2025년까지는 KRX 휴장이지만 관공서 공휴일 아님, 2026년부터는 공휴일", () => {
    expect(isKrxHoliday("2025-05-01")).toBe(true);
    expect(isHoliday("2025-05-01")).toBe(false); // 2025: 관공서 공휴일 아님
    expect(isHoliday("2026-05-01")).toBe(true); // 2026~: 노동절이 공휴일로 지정됨 (천문연 특일정보 기준)
    expect(isKrxHoliday("2026-05-01")).toBe(true);
  });

  it("관공서 공휴일은 KRX도 휴장", () => {
    expect(isKrxHoliday("2024-02-12")).toBe(true); // 설날 대체공휴일
  });
});
