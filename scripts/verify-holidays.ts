/**
 * 커밋된 `packages/holidays-core/src/holidays-data.ts`의 공휴일 데이터가 한국천문연구원
 * 「특일 정보」 API와 일치하는지 검증한다.
 *
 *   DATA_GO_KR_SERVICE_KEY=... pnpm verify:holidays [시작연도] [끝연도]   (또는 .env)
 *
 * - 비교 기준: **공휴일 날짜 집합**. API 에만 있는 날(우리가 빠뜨림) / 우리에게만 있는 날(잘못 넣음)이
 *   하나라도 있으면 실패한다.
 * - 이름 표기 차이(예: API "1월1일" ↔ 데이터 "신정", API "대통령선거일" ↔ 데이터 "제21대 대통령선거")는
 *   우리가 고른 라벨링이라 **실패로 치지 않고** 참고로만 출력한다.
 */

import { HOLIDAYS } from "../packages/holidays-core/src/holidays-data";
import { fetchHolidayYear, requireServiceKey } from "./lib/data-go-kr";

function normalizeName(name: string): string {
  return name
    .replace(/\s|[ㆍ·]/g, "")
    .replace(/^임시공휴일\((.+)\)$/, "$1")
    .replace(/^제\d+[대회]/, "")
    .replace(/^대체공휴일.*$/, "대체공휴일")
    .replace(/^1월1일$/, "신정")
    .replace(/선거일$/, "선거");
}

async function main(): Promise<void> {
  const serviceKey = requireServiceKey();
  const now = new Date();
  const dataYears = Object.keys(HOLIDAYS)
    .map(Number)
    .sort((a, b) => a - b);
  const startYear = Number(process.argv[2] ?? dataYears[0] ?? 2004);
  const endYear = Number(
    process.argv[3] ?? Math.min(dataYears[dataYears.length - 1] ?? now.getFullYear(), now.getFullYear() + 1),
  );

  const dateErrors: { year: number; date: string; side: "API에만 있음" | "데이터에만 있음" }[] = [];
  const nameNotes: { year: number; date: string; data: string; api: string }[] = [];

  for (let year = startYear; year <= endYear; year += 1) {
    const dataList = HOLIDAYS[String(year)];
    if (!dataList) {
      console.error(`  ${year}: 데이터 없음 — 건너뜀`);
      continue;
    }
    const apiList = await fetchHolidayYear(serviceKey, year);

    const groupByDate = (list: { date: string; name: string }[]): Map<string, string[]> => {
      const m = new Map<string, string[]>();
      for (const h of list) {
        const arr = m.get(h.date);
        if (arr) arr.push(h.name);
        else m.set(h.date, [h.name]);
      }
      return m;
    };
    const dataNamesByDate = groupByDate([...dataList]);
    const apiNamesByDate = groupByDate(apiList);
    const dataDates = new Set(dataNamesByDate.keys());
    const apiDates = new Set(apiNamesByDate.keys());

    let yearDateErrors = 0;
    for (const date of [...new Set([...dataDates, ...apiDates])].sort()) {
      const inData = dataDates.has(date);
      const inApi = apiDates.has(date);
      if (inData && !inApi) {
        dateErrors.push({ year, date, side: "데이터에만 있음" });
        yearDateErrors += 1;
      } else if (!inData && inApi) {
        dateErrors.push({ year, date, side: "API에만 있음" });
        yearDateErrors += 1;
      } else {
        const dn = (dataNamesByDate.get(date) ?? []).map(normalizeName).sort().join("/");
        const an = (apiNamesByDate.get(date) ?? []).map(normalizeName).sort().join("/");
        if (dn !== an) {
          nameNotes.push({
            year,
            date,
            data: (dataNamesByDate.get(date) ?? []).join(", "),
            api: (apiNamesByDate.get(date) ?? []).join(", "),
          });
        }
      }
    }
    console.error(
      `  ${year}: 데이터 ${dataDates.size}일 / API ${apiDates.size}일 / 날짜 불일치 ${yearDateErrors}건`,
    );
  }

  if (nameNotes.length > 0) {
    console.error(`\n참고 — 이름 표기 차이 ${nameNotes.length}건 (검증 실패 아님):`);
    for (const { year, date, data, api } of nameNotes) {
      console.error(`  [${year}] ${date}  데이터: "${data}"  /  API: "${api}"`);
    }
  }

  if (dateErrors.length === 0) {
    console.error(`\n✔ 공휴일 날짜 집합이 한국천문연구원 API와 일치합니다 (${startYear}~${endYear}).`);
    return;
  }

  console.error(`\n✗ 날짜 불일치 ${dateErrors.length}건:`);
  for (const { year, date, side } of dateErrors) console.error(`  [${year}] ${date}  ${side}`);
  console.error(
    "\n→ legal/substitute 면 packages/holidays-core/src/holidays-data.ts 를,\n" +
      "  임시공휴일/선거일이 API 에 아직 없는 경우엔 scripts/fetch-holidays.ts 의 MANUAL_OVERRIDES 를 고친 뒤 다시 검증하세요.",
  );
  process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
