import { describe, expect, it } from "vitest";
import {
  isBrn,
  isCorporateRegistrationNumber,
  isKoreanMobile,
  isKoreanPhone,
  isPostalCode,
  isValidRrnFormat,
} from "../src/index";

// ── 외부에서 확인 가능한 실제 값 ──────────────────────────────────────────────
// 사업자등록번호: 한국전력공사 124-81-00998 (공개 정보).
// 법인등록번호:   삼성전자(주) 130111-0006246 (공개 등기 정보).
const REAL_VALID_BRN = ["124-81-00998", "1248100998"];
const REAL_VALID_CRN = ["130111-0006246", "1301110006246"];

// ── 명백히 무효인 값 ─────────────────────────────────────────────────────────
const INVALID_BRN = [
  "124-81-00997", // 체크섬 -1
  "124-81-00999", // 체크섬 +1
  "000-00-00000", // 전부 0 (플레이스홀더)
  "123-45-67890", // 체크섬 불일치
  "12481009980", // 11자리
  "124-81-0099", // 9자리
  "abc-81-00998", // 비숫자
  "", // 빈 문자열
];
const INVALID_CRN = [
  "130111-0006245", // 체크섬 -1
  "130111-0006247", // 체크섬 +1
  "0000000000000", // 전부 0
  "130111-000624", // 12자리
  "13011100062460", // 14자리
];

describe("[gate] 검증 fixture — 사업자등록번호", () => {
  it.each(REAL_VALID_BRN)("유효: %s", (v) => expect(isBrn(v)).toBe(true));
  it.each(INVALID_BRN)("무효: %j", (v) => expect(isBrn(v)).toBe(false));
});

describe("[gate] 검증 fixture — 법인등록번호", () => {
  it.each(REAL_VALID_CRN)("유효: %s", (v) => expect(isCorporateRegistrationNumber(v)).toBe(true));
  it.each(INVALID_CRN)("무효: %j", (v) => expect(isCorporateRegistrationNumber(v)).toBe(false));
});

describe("검증 fixture — 전화번호 / 우편번호 / 주민번호 형식", () => {
  it.each(["010-1234-5678", "01012345678", "011-123-4567", "016-1234-5678"])(
    "유효 휴대폰: %s",
    (v) => expect(isKoreanMobile(v)).toBe(true),
  );
  it.each(["02-123-4567", "031-123-4567", "070-1234-5678", "1588-1234"])(
    "유효 전화: %s",
    (v) => expect(isKoreanPhone(v)).toBe(true),
  );
  it.each(["010-123-4567", "012-1234-5678", "1234567"])(
    "무효 휴대폰: %s",
    (v) => expect(isKoreanMobile(v)).toBe(false),
  );
  it.each(["06236", "03187", "48058"])("유효 우편번호: %s", (v) => expect(isPostalCode(v)).toBe(true));
  it.each(["1234", "123456", "135-080", "abcde"])(
    "무효 우편번호: %s",
    (v) => expect(isPostalCode(v)).toBe(false),
  );
  it("주민번호 구 체크섬 (검증된 합성 벡터)", () => {
    expect(isValidRrnFormat("900101-1234568")).toBe(true);
    expect(isValidRrnFormat("900101-1234567")).toBe(false);
    expect(isValidRrnFormat("901301-1234568")).toBe(false); // 13월
  });
});
