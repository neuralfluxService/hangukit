/**
 * 한국천문연구원 「특일 정보」(공공데이터포털, data.go.kr/data/15012690) 클라이언트.
 * `fetch-holidays.ts`(데이터 생성)와 `verify-holidays.ts`(검증)가 공유한다.
 */

const REST_DE_INFO_URL =
  "https://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService/getRestDeInfo";

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

/** 서비스키를 환경변수에서 읽는다. 없으면 친절한 메시지와 함께 종료. */
export function requireServiceKey(): string {
  const key = process.env.DATA_GO_KR_SERVICE_KEY;
  if (!key) {
    console.error(
      "환경변수 DATA_GO_KR_SERVICE_KEY 가 필요합니다.\n" +
        "  → data.go.kr 에서 「한국천문연구원_특일 정보」 활용신청 후 발급된 일반 인증키(Decoding)를 설정하세요.\n" +
        "  예) DATA_GO_KR_SERVICE_KEY=... pnpm verify:holidays",
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
