# @hangukit/zod

> [`@hangukit/core-validate`](../core-validate)의 [zod](https://zod.dev) (v3·v4) 어댑터 · zod (v3·v4) adapter for `@hangukit/core-validate`

[![npm](https://img.shields.io/npm/v/@hangukit/zod?label=npm)](https://www.npmjs.com/package/@hangukit/zod)
[![license](https://img.shields.io/npm/l/@hangukit/zod)](../../LICENSE)

[한국어](#한국어) · [English](#english)

---

## 한국어

zod 의 `.refine()` 시그니처가 v3·v4 동일하므로 이 패키지의 스키마 헬퍼는 **두 버전 모두에서 동작**합니다. 소비자가 설치한 zod 버전이 자동으로 적용됩니다.

### 설치

```bash
npm i @hangukit/zod zod
# v3 / v4 둘 다 OK: zod@^3.23.0 || ^4.0.0
```

### 빠른 예

```ts
import { z } from "zod";
import { brn, koreanMobile, koreanName, postalCode, rrnFormat } from "@hangukit/zod";

// 단독 스키마로 쓰거나 …
brn().safeParse("124-81-00998");                  // { success: true, data: "124-81-00998" }
brn().safeParse("124-81-00997");                  // { success: false, error: ... }

// 기존 string 스키마 뒤에 파이프해 쓰거나 …
z.string().pipe(brn()).parse("1248100998");

// z.object 안에서 조합
const Form = z.object({
  bizNo: brn(),
  phone: koreanMobile(),
  name: koreanName(),
  zip: postalCode(),
});
Form.safeParse({ bizNo: "124-81-00998", phone: "010-1234-5678", name: "홍길동", zip: "06236" });
```

### API

모든 헬퍼는 `() => z.ZodString` 형태(0-인자 또는 옵션 받음). 메시지는 한국어 기본.

| Export | 검증 대상 |
| --- | --- |
| `brn()` | 사업자등록번호(형식 + 체크섬) |
| `corporateRegistrationNumber()` | 법인등록번호 |
| `koreanMobile()` | 휴대폰 (010 / 011·016~019) |
| `koreanPhone()` | 휴대폰·지역번호·070·050X·15XX 대표번호 |
| `koreanName(options?)` | 완성형 한글 이름 (`{ minLength, maxLength, allowSpace }`) |
| `postalCode()` | 5자리 우편번호 |
| `rrnFormat()` | 주민번호 형식 + 구 체크섬 |
| `rrnLike()` | 주민번호 형식만(체크섬 무시; 2020-10 이후 신규분 대응) |

`z` 도 함께 재출력하므로 `import { z, brn } from "@hangukit/zod"`로 한 번에 받을 수 있습니다(권장은 `zod`에서 직접 받는 것).

### 주의사항

- **RRN 보안**: 검증을 통과한 주민등록번호를 로그·DB에 저장하지 마세요. 표시가 필요하면 `@hangukit/core-validate`의 `maskRrn`을 쓰세요. 자세한 정책은 [`@hangukit/core-validate`](../core-validate) README 참고.
- zod 는 `peerDependencies` — 소비자가 직접 설치한 zod 가 사용됩니다. v3·v4 동시에 한 프로젝트에 두면 안 됨(zod 자체 제약).

### 모노레포

이 패키지는 [hangukit](../../) 모노레포의 일부입니다. valibot 사용자는 [`@hangukit/valibot`](../valibot)을 보세요.

---

## English

zod's `.refine()` signature is identical in v3 and v4, so the helpers in this package **work with both versions** — the consumer's installed `zod` is used automatically.

### Install

```bash
npm i @hangukit/zod zod
# v3 / v4 both OK: zod@^3.23.0 || ^4.0.0
```

### Quick example

```ts
import { z } from "zod";
import { brn, koreanMobile, koreanName, postalCode, rrnFormat } from "@hangukit/zod";

// Use a helper as a standalone schema …
brn().safeParse("124-81-00998");                  // { success: true, data: "124-81-00998" }
brn().safeParse("124-81-00997");                  // { success: false, error: ... }

// or pipe after an existing string schema …
z.string().pipe(brn()).parse("1248100998");

// Compose inside z.object
const Form = z.object({
  bizNo: brn(),
  phone: koreanMobile(),
  name: koreanName(),
  zip: postalCode(),
});
Form.safeParse({ bizNo: "124-81-00998", phone: "010-1234-5678", name: "홍길동", zip: "06236" });
```

### API

Every helper returns a `z.ZodString` schema (0-arg or with options). Error messages are in Korean.

| Export | Validates |
| --- | --- |
| `brn()` | Business Registration Number (format + checksum) |
| `corporateRegistrationNumber()` | Corporate Registration Number |
| `koreanMobile()` | mobile (010 / 011·016~019) |
| `koreanPhone()` | mobile · area code · 070 · 050X · 15XX-type |
| `koreanName(options?)` | Hangul syllable name (`{ minLength, maxLength, allowSpace }`) |
| `postalCode()` | 5-digit postal code |
| `rrnFormat()` | RRN format + legacy checksum |
| `rrnLike()` | RRN format only (no checksum — accepts post-2020-10 issuances) |

`z` is re-exported as a convenience, but importing it directly from `zod` is recommended.

### Notes

- **RRN security**: do not store validated RRNs in plaintext logs or databases. Use `maskRrn` from `@hangukit/core-validate` for display. See [`@hangukit/core-validate`](../core-validate) for the full policy.
- `zod` is a peer dependency — the consumer's installed `zod` is used. Don't mix v3 and v4 in the same project (zod's own restriction).

### Monorepo

Part of the [hangukit](../../) monorepo. valibot users: see [`@hangukit/valibot`](../valibot).

---

MIT License
