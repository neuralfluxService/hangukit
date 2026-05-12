/**
 * 커밋된 `packages/holidays-core/src/holidays-data.ts`의 공휴일 데이터가 한국천문연구원
 * 「특일 정보」 API와 일치하는지 검증한다. 불일치가 있으면 표로 찍고 exit 1.
 *
 *   DATA_GO_KR_SERVICE_KEY=... pnpm verify:holidays [시작연도] [끝연도]
 *
 * - 기본 범위: 데이터가 보유한 연도 중 API가 커버하는 범위(보통 ~올해+1)와의 교집합.
 * - `kind`(legal/substitute/temporary/election)는 분류 규칙이 패키지마다 달라 비교하지 않고,
 *   날짜 집합과 (legal/substitute)에 한해 정규화한 이름을 비교한다. temporary/election은 날짜만.
 */

import { HOLIDAYS } from "../packages/holidays-core/src/holidays-data";
import { fetchHolidayYear, requireServiceKey } from "./lib/data-go-kr";

function normalizeName(name: string): string {
  // 표기 차이 흡수: 공백·중점 제거, 대체공휴일은 괄호 안 원인 제거
  return name.replace(/\s/g, "").replace(/[ㆍ·]/g, "").replace(/^대체공휴일.*$/, "대체공휴일");
}

interface Diff {
  year: number;
  date: string;
  inData: string | null;
  inApi: string | null;
}

async function main(): Promise<void> {
  const serviceKey = requireServiceKey();
  const now = new Date();
  const dataYears = Object.keys(HOLIDAYS).map(Number).sort((a, b) => a - b);
  const startYear = Number(process.argv[2] ?? dataYears[0] ?? 2004);
  const endYear = Number(process.argv[3] ?? Math.min(dataYears[dataYears.length - 1] ?? now.getFullYear(), now.getFullYear() + 1));

  const diffs: Diff[] = [];
  for (let year = startYear; year <= endYear; year += 1) {
    const dataList = HOLIDAYS[String(year)];
    if (!dataList) {
      console.error(`  ${year}: 데이터 없음 — 건너뜀`);
      continue;
    }
    const apiList = await fetchHolidayYear(serviceKey, year);

    const dataByDate = new Map(dataList.map((h) => [h.date, h.name] as const));
    const apiByDate = new Map(apiList.map((h) => [h.date, h.name] as const));
    const allDates = new Set<string>([...dataByDate.keys(), ...apiByDate.keys()]);

    let mismatch = 0;
    for (const date of [...allDates].sort()) {
      const d = dataByDate.get(date) ?? null;
      const a = apiByDate.get(date) ?? null;
      if (d === null || a === null) {
        diffs.push({ year, date, inData: d, inApi: a });
        mismatch += 1;
      } else if (normalizeName(d) !== normalizeName(a)) {
        diffs.push({ year, date, inData: d, inApi: a });
        mismatch += 1;
      }
    }
    console.error(`  ${year}: 데이터 ${dataList.length}건 / API ${apiList.length}건 / 불일치 ${mismatch}건`);
  }

  if (diffs.length === 0) {
    console.error("\n✔ 모든 연도가 한국천문연구원 API와 일치합니다.");
    return;
  }

  console.error(`\n✗ 불일치 ${diffs.length}건:`);
  for (const { year, date, inData, inApi } of diffs) {
    const tag = inData === null ? "API에만 있음" : inApi === null ? "데이터에만 있음" : "이름 불일치";
    console.error(`  [${year}] ${date}  ${tag}  (데이터: ${inData ?? "—"} / API: ${inApi ?? "—"})`);
  }
  console.error(
    "\n→ packages/holidays-core/src/holidays-data.ts 를 고치거나 (legal/substitute),\n" +
      "  임시공휴일/선거일이면 scripts/fetch-holidays.ts 의 MANUAL_OVERRIDES 에 반영한 뒤 다시 검증하세요.",
  );
  process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
