# hangukit

> 한국 환경 사이드카(side-car) 패키지 모음 · A collection of side-car npm packages for the Korean environment

[![npm: core-validate](https://img.shields.io/npm/v/@hangukit/core-validate?label=%40hangukit%2Fcore-validate)](https://www.npmjs.com/package/@hangukit/core-validate)
[![npm: holidays-core](https://img.shields.io/npm/v/@hangukit/holidays-core?label=%40hangukit%2Fholidays-core)](https://www.npmjs.com/package/@hangukit/holidays-core)
[![CI](https://github.com/neuralfluxService/hangukit/actions/workflows/ci.yml/badge.svg)](https://github.com/neuralfluxService/hangukit/actions/workflows/ci.yml)
[![license](https://img.shields.io/npm/l/@hangukit/core-validate)](LICENSE)

[한국어](#한국어) · [English](#english)

> npm 스코프는 `@hangukit/*`. 저장소 디렉터리는 `kr-kit` 으로 시작했으나 npm `@kr-kit` org 가 이미 점유돼 있어 스코프를 `@hangukit` 으로 정했습니다.
> npm scope is `@hangukit/*`. The repo directory began as `kr-kit`, but the `@kr-kit` npm org was already taken, so the scope is `@hangukit`.

## 패키지 / Packages

**검증 / Validation — built on [`@hangukit/core-validate`](packages/core-validate)**

| Package | What | Bundle (ESM, raw) |
| --- | --- | --- |
| [`@hangukit/core-validate`](packages/core-validate) | 사업자등록번호·법인등록번호·휴대폰·한글이름·계좌·우편번호 검증/포맷, 주민번호 마스킹. 의존성 0 / Korean identifier validation & masking, zero deps | ~8 KB |
| [`@hangukit/zod`](packages/zod) | zod (v3·v4) 어댑터 / zod adapter — `z.string().pipe(brn())` | ~2 KB |
| [`@hangukit/valibot`](packages/valibot) | valibot (v1) 어댑터 / valibot adapter — `v.pipe(v.string(), brn())` | ~2 KB |

**공휴일·영업일 / Holidays & business days — built on [`@hangukit/holidays-core`](packages/holidays-core)**

| Package | What | Bundle (ESM, raw) |
| --- | --- | --- |
| [`@hangukit/holidays-core`](packages/holidays-core) | 공휴일·대체공휴일·임시공휴일 데이터(2021~2026) + 영업일 산술 + KRX 휴장일. 의존성 0·런타임 네트워크 호출 없음 / Holiday data + business-day arithmetic + KRX closures, zero deps, no runtime network calls | ~13 KB (incl. data) |
| [`@hangukit/dayjs`](packages/dayjs) | dayjs 플러그인 / dayjs plugin — `dayjs().isKoreanHoliday()`, `.addBusinessDays(3)` | ~2 KB |
| [`@hangukit/date-fns`](packages/date-fns) | `Date` 인/아웃, date-fns 와 함께 쓰는 사이드카 / `Date`-in/out, sidecar to date-fns (peerDep) | ~2 KB |
| [`@hangukit/temporal`](packages/temporal) | `Temporal.PlainDate` 인/아웃 / `Temporal.PlainDate`-in/out (`@js-temporal/polyfill` peerDep) | ~2 KB |

> `@hangukit/dayjs` ESM/CJS 둘 다 제공. CJS 는 `module.exports = plugin` (즉 `require("@hangukit/dayjs")` 가 곧 플러그인 함수). 타입은 `export default` 라 attw 가 `FalseExportDefault` 표시하지만 `esModuleInterop` 환경에서 정상 동작.
> `@hangukit/dayjs` ships ESM+CJS. CJS uses `module.exports = plugin` (so `require("@hangukit/dayjs")` is the plugin function directly); the type declarations use `export default`, which attw flags as `FalseExportDefault`, but works fine under `esModuleInterop`.

---

## 한국어

### 설계 원칙

- **0-dep 코어 + 얇은 어댑터** — `core-validate` / `holidays-core` 는 의존성이 없고, 프레임워크별 패키지는 그 위에 얇게 얹습니다(`zod`/`valibot`/`dayjs`/`date-fns`/`@js-temporal/polyfill` 은 peerDependency).
- **런타임 네트워크 호출 없음** — 공휴일 데이터는 빌드 시점에 [공공데이터포털 한국천문연구원 특일정보 API](https://www.data.go.kr/data/15012690/openapi.do) 로 받아 정적으로 포함. `pnpm verify:holidays` 가 API 와 자동 대조 검증.
- **개인정보 보호** — 주민등록번호는 **형식 검증 + 마스킹만** 제공하며 생년월일/성별 추출 API 는 제공하지 않습니다(개인정보 보호법).

### 개발

```bash
pnpm install
pnpm build        # tsup (ESM + CJS + d.ts)
pnpm test         # vitest (단위 + fixture + 차등 + 속성 + 타입 테스트)
pnpm typecheck    # tsc --noEmit (전 패키지, .test-d.ts 포함)
pnpm coverage     # 커버리지 게이트 (statements/lines/functions ≥ 95%, branches ≥ 88%)
pnpm test:tz      # holidays-core 를 4개 시간대에서 재실행
pnpm smoke        # 패킹된 tarball 을 임시 디렉터리에 설치해 ESM/CJS/zod v4 소비 확인
```

공휴일 데이터 검증은 [`docs/verification-checklist.md`](docs/verification-checklist.md) 참고. `pnpm fetch:holidays` / `pnpm verify:holidays` 는 data.go.kr 「한국천문연구원_특일 정보」 인증키가 필요합니다 — `.env.example` 을 `.env` 로 복사해 `DATA_GO_KR_SERVICE_KEY`(일반 인증키 = **Decoding 키**)를 채우거나, 실행 시 환경변수로 넘기거나, CI 는 GitHub Actions secret 으로 등록하세요(`.env` 는 .gitignore 됨).

### 출시

[changesets](https://github.com/changesets/changesets) + pnpm 흐름. 변경 시 `pnpm changeset` 으로 changeset 추가, 머지 후 `pnpm version-packages` 로 버전 bump + CHANGELOG 생성, `pnpm release` 로 빌드 후 publish.

---

## English

### Design principles

- **Zero-dep cores + thin adapters** — `core-validate` / `holidays-core` have no runtime deps. Framework-specific packages are thin wrappers (`zod`/`valibot`/`dayjs`/`date-fns`/`@js-temporal/polyfill` are peerDependencies).
- **No runtime network calls** — Holiday data is fetched at build time from the [Korea Astronomy and Space Science Institute "Special Days" API](https://www.data.go.kr/data/15012690/openapi.do) and statically bundled. `pnpm verify:holidays` auto-diffs against the upstream API.
- **Privacy** — Resident Registration Numbers (RRN) are exposed for **format validation and masking only**. We deliberately don't ship APIs to extract birthdate or gender (Korea's Personal Information Protection Act restricts RRN processing to legally mandated cases).

### Development

```bash
pnpm install
pnpm build        # tsup (ESM + CJS + d.ts)
pnpm test         # vitest (unit + fixtures + differential + property + type tests)
pnpm typecheck    # tsc --noEmit across packages, .test-d.ts included
pnpm coverage     # coverage gate (statements/lines/functions ≥ 95%, branches ≥ 88%)
pnpm test:tz      # re-run holidays-core tests across 4 timezones
pnpm smoke        # pack tarballs and consume them from a temp dir (ESM/CJS/zod v4)
```

For holiday data verification see [`docs/verification-checklist.md`](docs/verification-checklist.md). `pnpm fetch:holidays` / `pnpm verify:holidays` need a data.go.kr "특일 정보" API key — copy `.env.example` to `.env` and fill in `DATA_GO_KR_SERVICE_KEY` (use the **Decoding** key), or pass it as an env var, or register it as a GitHub Actions secret for CI. `.env` is gitignored.

### Publishing

[changesets](https://github.com/changesets/changesets) + pnpm. Add a changeset with `pnpm changeset`, version with `pnpm version-packages`, publish with `pnpm release`.

---

## License

MIT
