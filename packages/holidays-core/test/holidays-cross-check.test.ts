import { y2021, y2022, y2023, y2024, y2025, y2026 } from "@hyunbinseo/holidays-kr";
import { describe, expect, it } from "vitest";
import { getHolidays } from "../src/index";

// 독립 레퍼런스: @hyunbinseo/holidays-kr ("based on the official gazette", 2018~2026 커버).
// kr-kit의 hand-seed 데이터(2021~2026)가 이것과 날짜 집합이 일치하는지 확인한다.
// (이름은 패키지마다 표기가 달라 비교하지 않고, 날짜 집합만 비교한다.)
const REFERENCE: Record<number, Readonly<Record<string, readonly string[]>>> = {
  2021: y2021,
  2022: y2022,
  2023: y2023,
  2024: y2024,
  2025: y2025,
  2026: y2026,
};

// 근로자의날(노동절, 5/1)은 2025년까지는 관공서 공휴일이 아니어서 양쪽 다 안 들고,
// 2026년부터는 양쪽 다 든다. 그러므로 별도 제외 없이 그대로 비교한다.
function referenceDates(year: number): Set<string> {
  return new Set(Object.keys(REFERENCE[year]!));
}

function ourDates(year: number): Set<string> {
  return new Set(getHolidays(year).map((h) => h.date));
}

describe("[gate] 공휴일 데이터 교차 대조 — @hyunbinseo/holidays-kr", () => {
  for (const year of [2021, 2022, 2023, 2024, 2025, 2026] as const) {
    it(`${year}년: 공휴일 날짜 집합이 레퍼런스와 일치`, () => {
      const ref = referenceDates(year);
      const ours = ourDates(year);
      const missing = [...ref].filter((d) => !ours.has(d)).sort(); // 레퍼런스엔 있는데 우리에겐 없음
      const extra = [...ours].filter((d) => !ref.has(d)).sort(); // 우리에겐 있는데 레퍼런스엔 없음
      expect({ year, missing, extra }).toStrictEqual({ year, missing: [], extra: [] });
    });
  }
});
