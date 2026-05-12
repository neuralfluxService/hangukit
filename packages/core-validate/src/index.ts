export { onlyDigits } from "./internal";

export {
  isBusinessRegistrationNumber,
  formatBusinessRegistrationNumber,
  parseBusinessRegistrationNumber,
  isBrn,
  formatBrn,
  parseBrn,
  isCorporateRegistrationNumber,
  formatCorporateRegistrationNumber,
  isCrn,
  formatCrn,
  BANK_CODES,
  isBankCode,
  getBankName,
  isBankAccountNumber,
  maskBankAccount,
} from "./business";
export type { ParsedBusinessRegistrationNumber } from "./business";

export {
  isKoreanMobile,
  formatKoreanMobile,
  maskKoreanMobile,
  isRepresentativeNumber,
  isKoreanPhone,
  formatKoreanPhone,
  isPostalCode,
  isLegacyPostalCode,
} from "./contact";

export {
  isKoreanName,
  maskName,
  isRrnLike,
  isValidRrnFormat,
  maskRrn,
} from "./personal";
export type { KoreanNameOptions } from "./personal";
