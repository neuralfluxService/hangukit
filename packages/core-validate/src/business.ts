import { onlyDigits, toDigitArray } from "./internal";

// ---------------------------------------------------------------------------
// 사업자등록번호 (Business Registration Number, 10자리)
// ---------------------------------------------------------------------------

const BRN_WEIGHTS = [1, 3, 7, 1, 3, 7, 1, 3, 5] as const;

function brnChecksumOk(digits: number[]): boolean {
  if (digits.length !== 10) return false;
  // 전부 0인 값은 플레이스홀더이지 실제 번호가 아니다(국세청도 거부).
  if (digits.every((d) => d === 0)) return false;
  let sum = 0;
  for (let i = 0; i < 9; i++) sum += digits[i]! * BRN_WEIGHTS[i]!;
  sum += Math.floor((digits[8]! * 5) / 10);
  const check = (10 - (sum % 10)) % 10;
  return check === digits[9]!;
}

/** 사업자등록번호가 유효한가 (10자리 + 체크섬). 하이픈 유무는 무시한다. */
export function isBusinessRegistrationNumber(value: string): boolean {
  const digits = toDigitArray(onlyDigits(value));
  return digits !== null && brnChecksumOk(digits);
}

/** `XXX-XX-XXXXX` 형식으로 변환한다. 10자리 숫자가 아니면 입력을 그대로 돌려준다. */
export function formatBusinessRegistrationNumber(value: string): string {
  const d = onlyDigits(value);
  if (d.length !== 10) return value;
  return `${d.slice(0, 3)}-${d.slice(3, 5)}-${d.slice(5)}`;
}

export interface ParsedBusinessRegistrationNumber {
  /** 하이픈 없는 10자리 숫자 */
  raw: string;
  /** `XXX-XX-XXXXX` */
  formatted: string;
}

/** 검증에 통과하면 정규화 결과를, 실패하면 `null`을 돌려준다. */
export function parseBusinessRegistrationNumber(
  value: string,
): ParsedBusinessRegistrationNumber | null {
  const raw = onlyDigits(value);
  const digits = toDigitArray(raw);
  if (digits === null || !brnChecksumOk(digits)) return null;
  return { raw, formatted: `${raw.slice(0, 3)}-${raw.slice(3, 5)}-${raw.slice(5)}` };
}

// 짧은 별칭
export {
  isBusinessRegistrationNumber as isBrn,
  formatBusinessRegistrationNumber as formatBrn,
  parseBusinessRegistrationNumber as parseBrn,
};

// ---------------------------------------------------------------------------
// 법인등록번호 (Corporate Registration Number, 13자리)
// ---------------------------------------------------------------------------

const CRN_WEIGHTS = [1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2] as const;

function crnChecksumOk(digits: number[]): boolean {
  if (digits.length !== 13) return false;
  if (digits.every((d) => d === 0)) return false;
  let sum = 0;
  for (let i = 0; i < 12; i++) sum += digits[i]! * CRN_WEIGHTS[i]!;
  const check = (10 - (sum % 10)) % 10;
  return check === digits[12]!;
}

/** 법인등록번호가 유효한가 (13자리 + 체크섬). 하이픈 유무는 무시한다. */
export function isCorporateRegistrationNumber(value: string): boolean {
  const digits = toDigitArray(onlyDigits(value));
  return digits !== null && crnChecksumOk(digits);
}

/** `XXXXXX-XXXXXXX` 형식으로 변환한다. 13자리 숫자가 아니면 입력을 그대로 돌려준다. */
export function formatCorporateRegistrationNumber(value: string): string {
  const d = onlyDigits(value);
  if (d.length !== 13) return value;
  return `${d.slice(0, 6)}-${d.slice(6)}`;
}

export {
  isCorporateRegistrationNumber as isCrn,
  formatCorporateRegistrationNumber as formatCrn,
};

// ---------------------------------------------------------------------------
// 은행 코드 / 계좌번호
// ---------------------------------------------------------------------------

/** 금융결제원 표준 기관코드(일부). 키는 3자리 문자열 코드. */
export const BANK_CODES: Readonly<Record<string, string>> = Object.freeze({
  "002": "한국산업은행",
  "003": "IBK기업은행",
  "004": "KB국민은행",
  "007": "Sh수협은행",
  "011": "NH농협은행",
  "012": "단위농협",
  "020": "우리은행",
  "023": "SC제일은행",
  "027": "한국씨티은행",
  "031": "DGB대구은행",
  "032": "부산은행",
  "034": "광주은행",
  "035": "제주은행",
  "037": "전북은행",
  "039": "BNK경남은행",
  "045": "새마을금고",
  "048": "신협",
  "050": "저축은행",
  "064": "산림조합",
  "071": "우체국예금보험",
  "081": "하나은행",
  "088": "신한은행",
  "089": "케이뱅크",
  "090": "카카오뱅크",
  "092": "토스뱅크",
});

/** 표준 기관코드가 표에 있는가. */
export function isBankCode(code: string): boolean {
  return Object.prototype.hasOwnProperty.call(BANK_CODES, code);
}

/** 코드에 대응하는 은행명. 없으면 `undefined`. */
export function getBankName(code: string): string | undefined {
  return BANK_CODES[code];
}

/**
 * 계좌번호 형식 검증. 계좌번호의 체크 알고리즘은 은행별로 비공개이므로 자릿수(8~16자리)와
 * 숫자 여부만 확인한다. 실명조회는 별도 API(오픈뱅킹 등)가 필요하다.
 */
export function isBankAccountNumber(value: string): boolean {
  const d = onlyDigits(value);
  return d.length >= 8 && d.length <= 16 && toDigitArray(d) !== null;
}

/** 계좌번호 마스킹: 앞 4자리와 뒤 2자리만 노출. */
export function maskBankAccount(value: string): string {
  const d = onlyDigits(value);
  if (d.length < 8) return value;
  return d.slice(0, 4) + "*".repeat(d.length - 6) + d.slice(-2);
}
