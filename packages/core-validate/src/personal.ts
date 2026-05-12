import { toDigitArray } from "./internal";

// ---------------------------------------------------------------------------
// 한글 이름
// ---------------------------------------------------------------------------

// 완성형 한글 음절 영역(가–힣). 옛한글·자모 단독은 제외한다.
const HANGUL_SYLLABLE = /^[가-힣]+$/;

export interface KoreanNameOptions {
  /** 최소 글자 수(공백 제외). 기본 2 */
  minLength?: number;
  /** 최대 글자 수(공백 제외). 기본 30 */
  maxLength?: number;
  /** 공백을 허용할지(복성·외국인 한글 표기 등). 기본 false */
  allowSpace?: boolean;
}

/** 완성형 한글로만 이루어진 이름인가. */
export function isKoreanName(value: string, options: KoreanNameOptions = {}): boolean {
  const { minLength = 2, maxLength = 30, allowSpace = false } = options;
  const trimmed = value.trim();
  if (trimmed.length === 0) return false;
  if (allowSpace) {
    const parts = trimmed.split(/\s+/);
    const total = parts.reduce((n, p) => n + p.length, 0);
    if (total < minLength || total > maxLength) return false;
    return parts.every((p) => p.length > 0 && HANGUL_SYLLABLE.test(p));
  }
  if (trimmed.length < minLength || trimmed.length > maxLength) return false;
  return HANGUL_SYLLABLE.test(trimmed);
}

/**
 * 이름 마스킹. 2글자는 마지막 글자를, 3글자 이상은 양 끝을 제외한 가운데 전부를 `*`로 가린다.
 * 예: `홍길동` → `홍*동`, `김철` → `김*`, `남궁민수` → `남**수`. (성씨 사전 없이 동작하므로
 * 복성을 따로 인식하지는 않는다.)
 */
export function maskName(value: string): string {
  const chars = [...value];
  if (chars.length <= 1) return value;
  if (chars.length === 2) return `${chars[0]}*`;
  return `${chars[0]}${"*".repeat(chars.length - 2)}${chars[chars.length - 1]}`;
}

// ---------------------------------------------------------------------------
// 주민등록번호 (Resident Registration Number)
//
// ⚠️ 주민등록번호는 「개인정보 보호법」 제24조의2에 따라 법령에 구체적 근거가 있는 경우에만
//    처리할 수 있다. 이 모듈은 **형식 검증과 마스킹만** 제공하며, 생년월일·성별 등 구성
//    정보를 추출하는 함수는 의도적으로 제공하지 않는다. 원본 주민등록번호를 로그/DB에
//    남기지 말 것. (외국인등록번호도 같은 정책으로 다룬다.)
// ---------------------------------------------------------------------------

const RRN_RE = /^(\d{6})-?([1-8]\d{6})$/;
const RRN_WEIGHTS = [2, 3, 4, 5, 6, 7, 8, 9, 2, 3, 4, 5] as const;

function rrnMonthDayOk(d: number[]): boolean {
  const month = d[2]! * 10 + d[3]!;
  const day = d[4]! * 10 + d[5]!;
  return month >= 1 && month <= 12 && day >= 1 && day <= 31;
}

/** 주민등록번호처럼 보이는 문자열인가(체크섬은 보지 않음). 2020-10 이후 발급분 대응. */
export function isRrnLike(value: string): boolean {
  const m = RRN_RE.exec(value.trim());
  if (!m) return false;
  const d = toDigitArray(m[1]! + m[2]!);
  return d !== null && rrnMonthDayOk(d);
}

/**
 * 형식 + (구) 체크섬까지 검증한다. 단, 2020-10-05 이후 발급되는 주민등록번호는 뒷자리가
 * 임의로 부여되어 체크섬이 성립하지 않으므로, 신규 발급분까지 받아야 한다면 `isRrnLike`를
 * 쓰는 편이 안전하다.
 */
export function isValidRrnFormat(value: string): boolean {
  const m = RRN_RE.exec(value.trim());
  if (!m) return false;
  const d = toDigitArray(m[1]! + m[2]!);
  if (d === null || !rrnMonthDayOk(d)) return false;
  let sum = 0;
  for (let i = 0; i < 12; i++) sum += d[i]! * RRN_WEIGHTS[i]!;
  const check = (11 - (sum % 11)) % 10;
  return check === d[12]!;
}

/**
 * 주민등록번호 마스킹. 기본은 생년월일 6자리와 성별 1자리만 노출(`901010-1******`).
 * 생년월일도 개인정보이므로, 더 강하게 가리려면 `{ revealGenderDigit: false }`를 넘긴다
 * (`901010-*******`).
 */
export function maskRrn(value: string, options: { revealGenderDigit?: boolean } = {}): string {
  const m = RRN_RE.exec(value.trim());
  if (!m) return value;
  const front = m[1]!;
  const back = m[2]!;
  if (options.revealGenderDigit === false) return `${front}-${"*".repeat(7)}`;
  return `${front}-${back[0]}${"*".repeat(6)}`;
}
