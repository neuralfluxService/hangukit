# @hangukit/core-validate

> 한국 식별자 검증·포맷·마스킹 (의존성 0) · Korean identifier validation, formatting & masking (zero deps)

[한국어](#한국어) · [English](#english)

---

## 한국어

사업자등록번호·법인등록번호·휴대폰/전화·계좌번호·우편번호·한글 이름의 형식과 체크섬을 검증하고, 표준 형식으로 포맷하며, 주민등록번호를 마스킹합니다. **의존성 0** — 런타임에 어떤 라이브러리도 부르지 않습니다. zod 사용자는 [`@hangukit/zod`](../zod), valibot 사용자는 [`@hangukit/valibot`](../valibot) 어댑터를 같이 쓰면 됩니다.

### 설치

```bash
npm i @hangukit/core-validate
# 또는 pnpm i @hangukit/core-validate
```

### 빠른 예

```ts
import {
  isBrn, formatBrn, parseBrn,
  isKoreanMobile, formatKoreanMobile,
  maskName, maskRrn,
} from "@hangukit/core-validate";

isBrn("124-81-00998");                  // true  (한국전력공사)
isBrn("124-81-00997");                  // false (체크섬 불일치)
formatBrn("1248100998");                // "124-81-00998"
parseBrn("124-81-00998");               // { raw: "1248100998", formatted: "124-81-00998" }

isKoreanMobile("010-1234-5678");        // true
formatKoreanMobile("01012345678");      // "010-1234-5678"

maskName("홍길동");                       // "홍*동"
maskRrn("900101-1234568");              // "900101-1******"
```

### API

| Export | 설명 | 비고 |
| --- | --- | --- |
| `isBrn(value)` / `isBusinessRegistrationNumber` | 사업자등록번호(10자리) 형식 + 체크섬 | 전부 0/체크섬 ±1 거부 |
| `formatBrn` / `parseBrn` | `XXX-XX-XXXXX` 형식·정규화 | `parseBrn` 무효 시 `null` |
| `isCorporateRegistrationNumber` / `isCrn` | 법인등록번호(13자리) 체크섬 | `formatCrn` 동봉 |
| `isKoreanMobile` / `formatKoreanMobile` / `maskKoreanMobile` | 휴대폰 (010 / 011·016~019) | 010은 11자리, 레거시는 10·11 |
| `isKoreanPhone` / `formatKoreanPhone` / `isRepresentativeNumber` | 휴대폰·지역번호·070·050X·대표번호(15XX 등) | 모두 합쳐 단일 판정 |
| `isPostalCode` / `isLegacyPostalCode` | 5자리(현행) / 6자리(구) 우편번호 형식 | 6→5 변환은 미제공(매핑이 1:1 아님) |
| `isKoreanName(name, opts?)` / `maskName` | 완성형 한글 이름, 마스킹(`홍*동`) | `KoreanNameOptions: minLength·maxLength·allowSpace` |
| `BANK_CODES` / `isBankCode` / `getBankName` | 금융결제원 표준코드(부분) | KB/신한/카카오뱅크/토스 등 |
| `isBankAccountNumber` / `maskBankAccount` | 계좌번호 형식(8~16자리)·마스킹 | 체크섬은 은행 비공개라 형식만 |
| `isValidRrnFormat` / `isRrnLike` / `maskRrn(v, opts?)` | 주민등록번호 형식 + 구 체크섬 / 형식만 / 마스킹 | 아래 보안 정책 필독 |

### 주의사항 — 주민등록번호(RRN) 보안 정책

이 패키지는 **형식 검증과 마스킹만** 제공합니다. **생년월일·성별 추출 함수는 의도적으로 제공하지 않습니다.** 「개인정보 보호법」 제24조의2에 따라 주민등록번호 처리는 법령에 구체적 근거가 있는 경우로 제한되므로, 라이브러리가 저장·가공을 부추기지 않도록 한 결정입니다. 검증한 RRN을 로그·DB에 평문으로 남기지 마세요. 표시가 필요하면 `maskRrn`(기본은 `YYMMDD-G******`, 강한 모드는 `YYMMDD-*******`)을 쓰세요. 2020-10 이후 발급분은 뒷자리가 임의화되어 구 체크섬을 따르지 않으므로, 신규분까지 받으려면 `isRrnLike`(형식만)를 쓰세요.

### 모노레포

이 패키지는 [hangukit](../../) 모노레포의 일부입니다. 함께 쓰는 패키지: [`@hangukit/zod`](../zod), [`@hangukit/valibot`](../valibot).

---

## English

Validates, formats, and masks Korean identifiers: business/corporate registration numbers, phone numbers, bank accounts, postal codes, Korean names. **Zero deps**, no runtime imports. Use [`@hangukit/zod`](../zod) or [`@hangukit/valibot`](../valibot) for schema-library integration.

### Install

```bash
npm i @hangukit/core-validate
```

### Quick example

```ts
import {
  isBrn, formatBrn, parseBrn,
  isKoreanMobile, formatKoreanMobile,
  maskName, maskRrn,
} from "@hangukit/core-validate";

isBrn("124-81-00998");                  // true  (KEPCO)
isBrn("124-81-00997");                  // false (checksum mismatch)
formatBrn("1248100998");                // "124-81-00998"
parseBrn("124-81-00998");               // { raw: "1248100998", formatted: "124-81-00998" }

isKoreanMobile("010-1234-5678");        // true
formatKoreanMobile("01012345678");      // "010-1234-5678"

maskName("홍길동");                       // "홍*동"
maskRrn("900101-1234568");              // "900101-1******"
```

### API

| Export | Description | Notes |
| --- | --- | --- |
| `isBrn` / `isBusinessRegistrationNumber` | 10-digit BRN format + checksum | rejects all-zeros & ±1 checksum |
| `formatBrn` / `parseBrn` | `XXX-XX-XXXXX` formatting / normalization | `parseBrn` returns `null` on invalid |
| `isCorporateRegistrationNumber` / `isCrn` | 13-digit CRN checksum | also `formatCrn` |
| `isKoreanMobile` / `formatKoreanMobile` / `maskKoreanMobile` | mobile (010 / 011·016~019) | 010 is 11 digits; legacy 10 or 11 |
| `isKoreanPhone` / `formatKoreanPhone` / `isRepresentativeNumber` | mobile · area-code · 070 · 050X · 15XX-type | unified predicate |
| `isPostalCode` / `isLegacyPostalCode` | 5-digit (current) / 6-digit (legacy) format | 6→5 conversion not provided (not 1:1) |
| `isKoreanName(name, opts?)` / `maskName` | Hangul syllable name, masking (`홍*동`) | `{ minLength, maxLength, allowSpace }` |
| `BANK_CODES` / `isBankCode` / `getBankName` | KFTC standard codes (partial) | KB, Shinhan, Kakao Bank, Toss, etc. |
| `isBankAccountNumber` / `maskBankAccount` | account format (8–16 digits) / masking | bank-specific checksums are private — format only |
| `isValidRrnFormat` / `isRrnLike` / `maskRrn(v, opts?)` | RRN format + legacy checksum / format only / masking | see security note below |

### Notes — RRN security policy

This package provides **only format validation and masking**. **It deliberately does NOT expose birthdate/gender extraction.** Under Korea's Personal Information Protection Act (Article 24-2), processing a RRN is restricted to legally mandated cases; we don't want the library to encourage storing or analyzing raw RRNs. Don't keep validated RRNs in plaintext logs or databases. Use `maskRrn` for display (default `YYMMDD-G******`; strict mode `YYMMDD-*******`). RRNs issued after 2020-10 use randomized back digits and won't satisfy the legacy checksum — use `isRrnLike` (format only) when you must accept those.

### Monorepo

Part of the [hangukit](../../) monorepo. See companion packages: [`@hangukit/zod`](../zod), [`@hangukit/valibot`](../valibot).

---

MIT License
