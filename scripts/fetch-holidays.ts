/**
 * 한국천문연구원 「특일 정보」(공공데이터포털, data.go.kr/data/15012690)에서 공휴일을
 * 받아와 `packages/holidays-core/src/holidays-data.ts`를 갱신한다.
 *
 *   DATA_GO_KR_SERVICE_KEY=... pnpm fetch:holidays [시작연도] [끝연도]
 *
 * - 서비스키는 data.go.kr에서 「한국천문연구원_특일 정보」 활용신청 후 발급받은 키(디코딩된 일반 인증키).
 * - 기본 범위: 2004 ~ (올해 + 1). API는 보통 올해+1까지 제공한다.
 * - API가 아직 반영하지 않은 임시공휴일/선거일은 아래 `MANUAL_OVERRIDES`에 손으로 보태면 머지된다.
 */

import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_FILE = resolve(__dirname, "../packages/holidays-core/src/holidays-data.ts");
const REST_DE_INFO_URL =
  "https://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService/getRestDeInfo";

type HolidayKind = "legal" | "substitute" | "temporary" | "election";
interface HolidayEntry {
  date: string;
  name: string;
  kind: HolidayKind;
}

/** API에 빠질 수 있는 임시공휴일/선거일을 손으로 보강. (검증 후 채워 넣을 것) */
const MANUAL_OVERRIDES: Record<string, HolidayEntry[]> = {
  // 예: "2025": [{ date: "2025-10-10", name: "임시공휴일", kind: "temporary" }],
};

function classify(dateName: string): HolidayKind {
  if (dateName.includes("대체")) return "substitute";
  if (dateName.includes("임시")) return "temporary";
  if (dateName.includes("선거")) return "election";
  return "legal";
}

function ymd(locdate: number | string): string {
  const s = String(locdate);
  return `${s.slice(0, 4)}-${s.slice(4, 6)}-${s.slice(6, 8)}`;
}

interface RestItem {
  dateName: string;
  isHoliday: "Y" | "N";
  locdate: number;
}

async function fetchMonth(serviceKey: string, year: number, month: number): Promise<RestItem[]> {
  const url = new URL(REST_DE_INFO_URL);
  url.searchParams.set("ServiceKey", serviceKey);
  url.searchParams.set("solYear", String(year));
  url.searchParams.set("solMonth", String(month).padStart(2, "0"));
  url.searchParams.set("numOfRows", "100");
  url.searchParams.set("_type", "json");

  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText} — ${year}-${month}`);
  const json = (await res.json()) as {
    response?: {
      header?: { resultCode?: string; resultMsg?: string };
      body?: { items?: "" | { item?: RestItem | RestItem[] } };
    };
  };
  const code = json.response?.header?.resultCode;
  if (code && code !== "00") {
    throw new Error(`API 오류 ${code}: ${json.response?.header?.resultMsg} (${year}-${month})`);
  }
  const items = json.response?.body?.items;
  if (!items || items === "" || !items.item) return [];
  return Array.isArray(items.item) ? items.item : [items.item];
}

async function main(): Promise<void> {
  const serviceKey = process.env.DATA_GO_KR_SERVICE_KEY;
  if (!serviceKey) {
    console.error(
      "DATA_GO_KR_SERVICE_KEY 환경변수가 필요합니다 (data.go.kr 「한국천문연구원_특일 정보」 일반 인증키).",
    );
    process.exit(1);
  }

  const now = new Date();
  const startYear = Number(process.argv[2] ?? 2004);
  const endYear = Number(process.argv[3] ?? now.getFullYear() + 1);

  const byYear: Record<string, HolidayEntry[]> = {};

  for (let year = startYear; year <= endYear; year += 1) {
    const entries: HolidayEntry[] = [];
    for (let month = 1; month <= 12; month += 1) {
      const items = await fetchMonth(serviceKey, year, month);
      for (const item of items) {
        if (item.isHoliday !== "Y") continue;
        entries.push({ date: ymd(item.locdate), name: item.dateName, kind: classify(item.dateName) });
      }
    }
    // 수동 오버라이드 머지(중복 날짜+이름은 제외)
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
