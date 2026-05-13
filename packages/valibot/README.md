# @hangukit/valibot

> [`@hangukit/core-validate`](../core-validate)의 [valibot](https://valibot.dev) (v1) 어댑터 · valibot (v1) adapter for `@hangukit/core-validate`

[![npm](https://img.shields.io/npm/v/@hangukit/valibot?label=npm)](https://www.npmjs.com/package/@hangukit/valibot)
[![license](https://img.shields.io/npm/l/@hangukit/valibot)](../../LICENSE)

[한국어](#한국어) · [English](#english)

---

## 한국어

valibot 의 액션 합성 패턴(`v.pipe(v.string(), v.check(...))`)에 맞춰 **검증 액션**을 돌려줍니다. zod 어댑터([`@hangukit/zod`](../zod))는 완성된 스키마를 돌려주지만, valibot 은 액션 단위 합성이 관용적이라 액션을 그대로 노출합니다.

### 설치

```bash
npm i @hangukit/valibot valibot
# valibot@^1.0.0
```

### 빠른 예

```ts
import * as v from "valibot";
import { brn, koreanMobile, koreanName, postalCode } from "@hangukit/valibot";

const BizNo = v.pipe(v.string(), brn());
v.parse(BizNo, "124-81-00998");                    // "124-81-00998"
v.safeParse(BizNo, "124-81-00997").success;        // false

const Form = v.object({
  bizNo: v.pipe(v.string(), brn()),
  phone: v.pipe(v.string(), koreanMobile()),
  name:  v.pipe(v.string(), koreanName()),
  zip:   v.pipe(v.string(), postalCode()),
});
v.safeParse(Form, { bizNo: "124-81-00998", phone: "010-1234-5678", name: "홍길동", zip: "06236" });
```

### API

모든 헬퍼는 `v.check<string>(...)` 액션을 돌려줍니다(`v.pipe(v.string(), <헬퍼>())` 형태로 사용).

| Export | 검증 대상 |
| --- | --- |
| `brn()` | 사업자등록번호(형식 + 체크섬) |
| `corporateRegistrationNumber()` | 법인등록번호 |
| `koreanMobile()` | 휴대폰 (010 / 011·016~019) |
| `koreanPhone()` | 휴대폰·지역번호·070·050X·15XX 대표번호 |
| `koreanName(options?)` | 완성형 한글 이름 (`{ minLength, maxLength, allowSpace }`) |
| `postalCode()` | 5자리 우편번호 |
| `rrnFormat()` | 주민번호 형식 + 구 체크섬 |
| `rrnLike()` | 주민번호 형식만(체크섬 무시) |

`v` 도 함께 재출력하므로 `import { v, brn } from "@hangukit/valibot"`도 가능합니다(권장은 `valibot`에서 직접).

### 주의사항

- **RRN 보안**: 검증된 주민번호를 로그·DB 평문으로 저장 금지. 표시는 `@hangukit/core-validate`의 `maskRrn`. 자세한 정책은 [`@hangukit/core-validate`](../core-validate) 참고.
- valibot 은 `peerDependencies` — 소비자가 설치한 valibot 이 사용됩니다.

### 모노레포

[hangukit](../../) 모노레포의 일부. zod 사용자는 [`@hangukit/zod`](../zod).

---

## English

Returns **validation actions** matching valibot's pipe-composition pattern (`v.pipe(v.string(), v.check(...))`). The zod adapter ([`@hangukit/zod`](../zod)) returns finished schemas; here actions are exposed directly because that's idiomatic in valibot.

### Install

```bash
npm i @hangukit/valibot valibot
# valibot@^1.0.0
```

### Quick example

```ts
import * as v from "valibot";
import { brn, koreanMobile, koreanName, postalCode } from "@hangukit/valibot";

const BizNo = v.pipe(v.string(), brn());
v.parse(BizNo, "124-81-00998");                    // "124-81-00998"
v.safeParse(BizNo, "124-81-00997").success;        // false

const Form = v.object({
  bizNo: v.pipe(v.string(), brn()),
  phone: v.pipe(v.string(), koreanMobile()),
  name:  v.pipe(v.string(), koreanName()),
  zip:   v.pipe(v.string(), postalCode()),
});
v.safeParse(Form, { bizNo: "124-81-00998", phone: "010-1234-5678", name: "홍길동", zip: "06236" });
```

### API

Every helper returns a `v.check<string>(...)` action. Use as `v.pipe(v.string(), <helper>())`.

| Export | Validates |
| --- | --- |
| `brn()` | Business Registration Number (format + checksum) |
| `corporateRegistrationNumber()` | Corporate Registration Number |
| `koreanMobile()` | mobile (010 / 011·016~019) |
| `koreanPhone()` | mobile · area code · 070 · 050X · 15XX-type |
| `koreanName(options?)` | Hangul syllable name (`{ minLength, maxLength, allowSpace }`) |
| `postalCode()` | 5-digit postal code |
| `rrnFormat()` | RRN format + legacy checksum |
| `rrnLike()` | RRN format only |

`v` is re-exported as a convenience.

### Notes

- **RRN security**: don't store validated RRNs in plaintext. Use `maskRrn` from `@hangukit/core-validate` for display. Full policy in [`@hangukit/core-validate`](../core-validate).
- `valibot` is a peer dependency — the consumer's installed valibot is used.

### Monorepo

Part of the [hangukit](../../) monorepo. zod users: see [`@hangukit/zod`](../zod).

---

MIT License
