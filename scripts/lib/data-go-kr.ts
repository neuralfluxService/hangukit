/**
 * 한국천문연구원 「특일 정보」(공공데이터포털, data.go.kr/data/15012690) 클라이언트.
 * `fetch-holidays.ts`(데이터 생성)와 `verify-holidays.ts`(검증)가 공유한다.
 *
 * 설정값(둘 다 환경변수, 저장소 루트의 `.env`로도 가능 — `.env.example` 참고):
 *  - `DATA_GO_KR_SERVICE_KEY`        (필수) data.go.kr 일반 인증키 — **Decoding 키**를 넣을 것
 *  - `DATA_GO_KR_HOLIDAY_API_URL`    (선택) 엔드포인트 — 보통 기본값 그대로면 된다
 */

import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

// 저장소 루트의 .env 가 있으면 읽어 들인다 (이미 설정된 환경변수는 덮어쓰지 않음).
const ENV_FILE = resolve(dirname(fileURLToPath(import.meta.url)), "../../.env");
if (existsSync(ENV_FILE)) {
  try {
    process.loadEnvFile(ENV_FILE);
  } catch {
    /* .env 파싱 실패는 무시하고 실제 환경변수만 사용 */
  }
}

const DEFAULT_REST_DE_INFO_URL =
  "https://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService/getRestDeInfo";
const REST_DE_INFO_URL = process.env.DATA_GO_KR_HOLIDAY_API_URL?.trim() || DEFAULT_REST_DE_INFO_URL;

export type HolidayKind = "legal" | "substitute" | "temporary" | "election";

export interface HolidayEntry {
  /** YYYY-MM-DD */
  date: string;
  name: string;
  kind: HolidayKind;
}

interface RestItem {
  dateName: string;
  isHoliday: "Y" | "N";
  locdate: number;
}

/** 서비스키를 환경변수(또는 .env)에서 읽는다. 없으면 친절한 메시지와 함께 종료. */
export function requireServiceKey(): string {
  const key = process.env.DATA_GO_KR_SERVICE_KEY?.trim();
  if (!key) {
    console.error(
      "DATA_GO_KR_SERVICE_KEY 가 설정돼 있지 않습니다.\n" +
        "  → data.go.kr 「한국천문연구원_특일 정보」 활용신청 후 받은 일반 인증키(Decoding 키)를 넣으세요.\n" +
        "  방법 ① 저장소 루트에 .env 파일을 만들고: DATA_GO_KR_SERVICE_KEY=발급키   (.env.example 참고, .env 는 .gitignore 됨)\n" +
        "  방법 ② 실행 시 직접:  $env:DATA_GO_KR_SERVICE_KEY=\"발급키\"; pnpm verify:holidays   (bash: DATA_GO_KR_SERVICE_KEY=... pnpm verify:holidays)\n" +
        "  CI:  GitHub 저장소 Settings → Secrets and variables → Actions 에 동일 이름으로 등록",
    );
    process.exit(1);
  }
  return key;
}

export function localdateToYmd(locdate: number | string): string {
  const s = String(locdate);
  return `${s.slice(0, 4)}-${s.slice(4, 6)}-${s.slice(6, 8)}`;
}

export function classifyHoliday(dateName: string): HolidayKind {
  if (dateName.includes("대체")) return "substitute";
  if (dateName.includes("임시")) return "temporary";
  if (dateName.includes("선거")) return "election";
  return "legal";
}

/** 특정 연-월의 공휴일(`isHoliday === "Y"`) 항목들을 가져온다. */
export async function fetchHolidayMonth(
  serviceKey: string,
  year: number,
  month: number,
): Promise<RestItem[]> {
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
    throw new Error(`API 오류 ${code}: ${json.response?.header?.resultMsg ?? "(메시지 없음)"} (${year}-${month})`);
  }
  const items = json.response?.body?.items;
  if (!items || items === "" || !items.item) return [];
  return Array.isArray(items.item) ? items.item : [items.item];
}

/** 한 해의 공휴일 엔트리(날짜 오름차순). */
export async function fetchHolidayYear(serviceKey: string, year: number): Promise<HolidayEntry[]> {
  const entries: HolidayEntry[] = [];
  for (let month = 1; month <= 12; month += 1) {
    for (const item of await fetchHolidayMonth(serviceKey, year, month)) {
      if (item.isHoliday !== "Y") continue;
      entries.push({
        date: localdateToYmd(item.locdate),
        name: item.dateName,
        kind: classifyHoliday(item.dateName),
      });
    }
  }
  entries.sort((a, b) => (a.date === b.date ? 0 : a.date < b.date ? -1 : 1));
  return entries;
}
