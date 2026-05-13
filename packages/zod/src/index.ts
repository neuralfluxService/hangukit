import {
  isBrn,
  isCorporateRegistrationNumber,
  isKoreanMobile,
  isKoreanName,
  isKoreanPhone,
  isPostalCode,
  isRrnLike,
  isValidRrnFormat,
  type KoreanNameOptions,
} from "@hangukit/core-validate";
import { z } from "zod";

// `.refine()`의 시그니처는 zod v3·v4에서 동일하므로, 여기서 만든 스키마는 두 버전 모두에서
// 그대로 동작한다. 소비자가 설치한 zod 버전의 타입이 자동으로 적용된다.
const m = (message: string) => ({ message });

/** 사업자등록번호 문자열 스키마 (형식 + 체크섬). */
export const brn = () => z.string().refine(isBrn, m("유효한 사업자등록번호가 아닙니다."));

/** 법인등록번호 문자열 스키마 (형식 + 체크섬). */
export const corporateRegistrationNumber = () =>
  z.string().refine(isCorporateRegistrationNumber, m("유효한 법인등록번호가 아닙니다."));

/** 휴대폰 번호 문자열 스키마 (010 / 011·016~019). */
export const koreanMobile = () =>
  z.string().refine(isKoreanMobile, m("유효한 휴대폰 번호가 아닙니다."));

/** 한국 전화번호 문자열 스키마 (휴대폰·지역번호·대표번호 등). */
export const koreanPhone = () =>
  z.string().refine(isKoreanPhone, m("유효한 전화번호가 아닙니다."));

/** 한글 이름 문자열 스키마 (완성형 한글). */
export const koreanName = (options?: KoreanNameOptions) =>
  z.string().refine((v) => isKoreanName(v, options), m("유효한 한글 이름이 아닙니다."));

/** 5자리 우편번호 문자열 스키마. */
export const postalCode = () =>
  z.string().refine(isPostalCode, m("유효한 우편번호가 아닙니다."));

/**
 * 주민등록번호 **형식**(+ 구 체크섬) 스키마.
 *
 * ⚠️ 검증에 통과한 주민등록번호를 로그·DB에 저장하지 마세요. 표시가 필요하면
 * `@hangukit/core-validate`의 `maskRrn`를 쓰세요. 신규 발급분(2020-10~)까지 받아야 한다면
 * 체크섬을 검사하지 않는 `rrnLike()`를 사용하세요.
 */
export const rrnFormat = () =>
  z.string().refine(isValidRrnFormat, m("주민등록번호 형식이 올바르지 않습니다."));

/** 주민등록번호처럼 보이는 문자열인지만 검사한다(체크섬 무시). */
export const rrnLike = () =>
  z.string().refine(isRrnLike, m("주민등록번호 형식이 올바르지 않습니다."));

export { z };
