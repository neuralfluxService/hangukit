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
} from "@kr-kit/core-validate";
import * as v from "valibot";

// 각 헬퍼는 `v.string()` 뒤에 붙는 **검증 액션**(`v.check`)을 돌려준다.
//   const BizNo = v.pipe(v.string(), brn());
//   v.parse(BizNo, "124-81-00998");
// (zod 어댑터 `@kr-kit/zod`는 "스키마"를 돌려주지만, valibot은 액션 합성이 관용적이라 액션을 돌려준다.
//  `v.check`의 입력 타입은 검증 함수의 매개변수 타입(string)에서 추론되므로 명시적 타입 인자를 주지 않는다.)

/** 사업자등록번호 검증 액션 (형식 + 체크섬). */
export const brn = () => v.check(isBrn, "유효한 사업자등록번호가 아닙니다.");

/** 법인등록번호 검증 액션 (형식 + 체크섬). */
export const corporateRegistrationNumber = () =>
  v.check(isCorporateRegistrationNumber, "유효한 법인등록번호가 아닙니다.");

/** 휴대폰 번호 검증 액션 (010 / 011·016~019). */
export const koreanMobile = () => v.check(isKoreanMobile, "유효한 휴대폰 번호가 아닙니다.");

/** 한국 전화번호 검증 액션 (휴대폰·지역번호·대표번호 등). */
export const koreanPhone = () => v.check(isKoreanPhone, "유효한 전화번호가 아닙니다.");

/** 한글 이름 검증 액션 (완성형 한글). */
export const koreanName = (options?: KoreanNameOptions) =>
  v.check((value: string) => isKoreanName(value, options), "유효한 한글 이름이 아닙니다.");

/** 5자리 우편번호 검증 액션. */
export const postalCode = () => v.check(isPostalCode, "유효한 우편번호가 아닙니다.");

/**
 * 주민등록번호 **형식**(+ 구 체크섬) 검증 액션.
 *
 * ⚠️ 검증에 통과한 주민등록번호를 로그·DB에 저장하지 마세요. 표시가 필요하면
 * `@kr-kit/core-validate`의 `maskRrn`를 쓰세요. 신규 발급분(2020-10~)까지 받아야 한다면
 * 체크섬을 검사하지 않는 `rrnLike()`를 사용하세요.
 */
export const rrnFormat = () => v.check(isValidRrnFormat, "주민등록번호 형식이 올바르지 않습니다.");

/** 주민등록번호처럼 보이는 문자열인지만 검사하는 액션(체크섬 무시). */
export const rrnLike = () => v.check(isRrnLike, "주민등록번호 형식이 올바르지 않습니다.");

export { v };
