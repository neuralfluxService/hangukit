/**
 * 한국천문연구원 「특일 정보」 API로 공휴일을 받아 `packages/holidays-core/src/holidays-data.ts`를 갱신한다.
 *
 *   DATA_GO_KR_SERVICE_KEY=... pnpm fetch:holidays [시작연도] [끝연도]
 *
 * - 기본 범위: 2004 ~ (올해 + 1). API는 보통 올해+1까지 제공한다.
 * - API가 아직 반영하지 않은 임시공휴일/선거일은 `MANUAL_OVERRIDES`에 손으로 보태면 머지된다.
 */

import { writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { fetchHolidayYear, requireServiceKey, type HolidayEntry } from "./lib/data-go-kr";

const here = dirname(fileURLToPath(import.meta.url));
const OUT_FILE = resolve(here, "../packages/holidays-core/src/holidays-data.ts");

/** API에 빠질 수 있는 임시공휴일/선거일 보강. (검증 후 채워 넣을 것) */
const MANUAL_OVERRIDES: Record<string, HolidayEntry[]> = {
  // 예) "2027": [{ date: "2027-03-03", name: "제21대 대통령선거", kind: "election" }],
};

async function main(): Promise<void> {
  const serviceKey = requireServiceKey();
  const now = new Date();
  const startYear = Number(process.argv[2] ?? 2004);
  const endYear = Number(process.argv[3] ?? now.getFullYear() + 1);

  const byYear: Record<string, HolidayEntry[]> = {};
  for (let year = startYear; year <= endYear; year += 1) {
    const entries = await fetchHolidayYear(serviceKey, year);
    for (const extra of MANUAL_OVERRIDES[String(year)] ?? []) {
      if (!entries.some((e) => e.date === extra.date && e.name === extra.name)) entries.push(extra);
    }
    entries.sort((a, b) => (a.date === b.date ? 0 : a.date < b.date ? -1 : 1));
    if (entries.length > 0) byYear[String(year)] = entries;
    console.error(`  ${year}: ${entries.length}건`);
  }

  const body = Object.entries(byYear)
    .map(([year, entries]) => {
      const lines = entries
        .map((e) => `    { date: "${e.date}", name: "${e.name}", kind: "${e.kind}" },`)
        .join("\n");
      return `  "${year}": [\n${lines}\n  ],`;
    })
    .join("\n");

  const header = `/**
 * 한국 공휴일 데이터 — \`pnpm fetch:holidays\`로 자동 생성됨 (한국천문연구원 특일 정보 API).
 * 손으로 수정하지 말고 스크립트를 다시 돌리거나 scripts/fetch-holidays.ts의 MANUAL_OVERRIDES를 고칠 것.
 * \`pnpm verify:holidays\`로 API와 일치하는지 검증할 수 있다.
 *
 * \`kind\`: legal(법정공휴일·국경일) | substitute(대체공휴일) | temporary(임시공휴일) | election(선거일)
 */

export type HolidayKind = "legal" | "substitute" | "temporary" | "election";

export interface HolidayEntry {
  /** YYYY-MM-DD */
  readonly date: string;
  readonly name: string;
  readonly kind: HolidayKind;
}

export const HOLIDAYS: Readonly<Record<string, readonly HolidayEntry[]>> = {
`;
  await writeFile(OUT_FILE, `${header}${body}\n};\n`, "utf8");
  console.error(`\n✔ ${OUT_FILE} 갱신 완료 (${Object.keys(byYear).length}개 연도).`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
