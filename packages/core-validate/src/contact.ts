import { onlyDigits, toDigitArray } from "./internal";

// ---------------------------------------------------------------------------
// 휴대폰 번호
// ---------------------------------------------------------------------------

const MOBILE_PREFIX = /^01[016789]/;

/**
 * 휴대폰 번호 검증. `010`은 11자리, 레거시(`011`/`016`/`017`/`018`/`019`)는 10자리 또는
 * 11자리를 허용한다. 하이픈/공백 등 구분자는 무시한다.
 */
export function isKoreanMobile(value: string): boolean {
  const d = onlyDigits(value);
  if (toDigitArray(d) === null || !MOBILE_PREFIX.test(d)) return false;
  if (d.startsWith("010")) return d.length === 11;
  return d.length === 10 || d.length === 11;
}

/** 휴대폰 번호를 `XXX-XXXX-XXXX` 또는 `XXX-XXX-XXXX`로 포맷한다. 형식이 안 맞으면 입력 그대로. */
export function formatKoreanMobile(value: string): string {
  const d = onlyDigits(value);
  if (!isKoreanMobile(d)) return value;
  if (d.length === 11) return `${d.slice(0, 3)}-${d.slice(3, 7)}-${d.slice(7)}`;
  return `${d.slice(0, 3)}-${d.slice(3, 6)}-${d.slice(6)}`;
}

/** 휴대폰 번호 마스킹: `010-1234-5678` → `010-****-5678`. */
export function maskKoreanMobile(value: string): string {
  const d = onlyDigits(value);
  if (!isKoreanMobile(d)) return value;
  if (d.length === 11) return `${d.slice(0, 3)}-****-${d.slice(7)}`;
  return `${d.slice(0, 3)}-***-${d.slice(6)}`;
}

// ---------------------------------------------------------------------------
// 일반 전화번호 (지역번호 / 인터넷전화 / 대표번호)
// ---------------------------------------------------------------------------

const AREA_CODES = new Set([
  "02",
  "031", "032", "033",
  "041", "042", "043", "044",
  "051", "052", "053", "054", "055",
  "061", "062", "063", "064",
]);

const REPRESENTATIVE_PREFIX = /^1[5678]\d{2}$/; // 15XX / 16XX / 17XX / 18XX 대표번호 (8자리)

function isLandline(d: string): boolean {
  if (toDigitArray(d) === null) return false;
  // 070 인터넷전화 (11자리), 050X 평생번호 (12자리 0504... )
  if (d.startsWith("070")) return d.length === 11;
  if (/^050\d/.test(d)) return d.length === 11 || d.length === 12;
  // 02: 9~10자리 (02-XXX-XXXX / 02-XXXX-XXXX)
  if (d.startsWith("02")) return d.length === 9 || d.length === 10;
  // 0XX 3자리 지역번호: 10~11자리
  const area3 = d.slice(0, 3);
  if (AREA_CODES.has(area3)) return d.length === 10 || d.length === 11;
  return false;
}

/** 대표번호(15XX/16XX/17XX/18XX-XXXX, 8자리) 인가. */
export function isRepresentativeNumber(value: string): boolean {
  const d = onlyDigits(value);
  return d.length === 8 && REPRESENTATIVE_PREFIX.test(d.slice(0, 4));
}

/** 휴대폰·지역번호·인터넷전화·대표번호 중 하나로 인식되면 true. */
export function isKoreanPhone(value: string): boolean {
  const d = onlyDigits(value);
  return isKoreanMobile(d) || isLandline(d) || isRepresentativeNumber(d);
}

/** 한국 전화번호를 하이픈 포맷으로. 대표번호는 `XXXX-XXXX`, 그 외는 길이 기반 추정. */
export function formatKoreanPhone(value: string): string {
  const d = onlyDigits(value);
  if (isRepresentativeNumber(d)) return `${d.slice(0, 4)}-${d.slice(4)}`;
  if (isKoreanMobile(d)) return formatKoreanMobile(d);
  if (!isLandline(d)) return value;
  if (d.startsWith("02")) {
    return d.length === 10
      ? `02-${d.slice(2, 6)}-${d.slice(6)}`
      : `02-${d.slice(2, 5)}-${d.slice(5)}`;
  }
  // 3자리 지역번호 / 070 / 050X
  return d.length === 11
    ? `${d.slice(0, 3)}-${d.slice(3, 7)}-${d.slice(7)}`
    : `${d.slice(0, 3)}-${d.slice(3, 6)}-${d.slice(6)}`;
}

// ---------------------------------------------------------------------------
// 우편번호
// ---------------------------------------------------------------------------

/** 2015-08-01 이후 도입된 5자리 우편번호인가. */
export function isPostalCode(value: string): boolean {
  const d = onlyDigits(value);
  return d.length === 5 && toDigitArray(d) !== null;
}

/**
 * 구 6자리 우편번호(`XXX-XXX`) 형식인가. 6자리 → 5자리 변환은 1:1 매핑이 아니어서
 * 우정사업본부 변환 DB가 필요하므로 이 패키지는 변환을 제공하지 않는다.
 */
export function isLegacyPostalCode(value: string): boolean {
  const d = onlyDigits(value);
  return d.length === 6 && toDigitArray(d) !== null;
}
