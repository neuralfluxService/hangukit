# kr-kit

한국 환경 사이드카(side-car) 패키지 모음. 글로벌 표준 라이브러리(`zod`, `dayjs`, `date-fns` …)를 **대체하지 않고 옆에 붙어** 한국 특수 요구를 채웁니다.

## 패키지

**검증 (`@kr-kit/core-validate` 위)**

| 패키지 | 설명 | 번들(ESM, 압축 전) | 상태 |
| --- | --- | --- | --- |
| [`@kr-kit/core-validate`](packages/core-validate) | 의존성 0. 사업자등록번호·법인등록번호·휴대폰·한글이름·계좌번호·우편번호 검증/포맷, 주민번호 마스킹 | ~8 KB | ✅ |
| [`@kr-kit/zod`](packages/zod) | `@kr-kit/core-validate`의 zod(v3·v4) 어댑터 — `z.string().pipe(brn())` | ~2 KB | ✅ |
| [`@kr-kit/valibot`](packages/valibot) | `@kr-kit/core-validate`의 valibot(v1) 어댑터 — `v.pipe(v.string(), brn())` | ~2 KB | ✅ |

**공휴일·영업일 (`@kr-kit/holidays-core` 위)**

| 패키지 | 설명 | 번들(ESM, 압축 전) | 상태 |
| --- | --- | --- | --- |
| [`@kr-kit/holidays-core`](packages/holidays-core) | 의존성 0·런타임 네트워크 호출 없음. 공휴일·대체공휴일·임시공휴일 데이터(2021~2026) + 영업일 산술 + KRX 휴장일 — `YYYY-MM-DD` 문자열/`Date` 인 | ~13 KB(데이터 포함) | ✅ |
| [`@kr-kit/dayjs`](packages/dayjs) | `@kr-kit/holidays-core`의 dayjs 플러그인 — `dayjs().isKoreanHoliday()`, `.addBusinessDays(3)` | ~2 KB | ✅ |
| [`@kr-kit/date-fns`](packages/date-fns) | `@kr-kit/holidays-core`를 `Date` 인/아웃으로 — date-fns 와 함께 쓰는 사이드카 (`date-fns` peerDep) | ~2 KB | ✅ |
| [`@kr-kit/temporal`](packages/temporal) | `@kr-kit/holidays-core`를 `Temporal.PlainDate` 인/아웃으로 (`@js-temporal/polyfill` peerDep) | ~2 KB | ✅ |

> `@kr-kit/dayjs`는 ESM/CJS 둘 다 제공합니다. CJS 빌드는 `module.exports = plugin`(즉 `require("@kr-kit/dayjs")`가 곧 플러그인 함수)이며, 타입 선언은 `export default`라 [`@arethetypeswrong`](https://arethetypeswrong.github.io/)이 `FalseExportDefault`로 표시하지만 `esModuleInterop` 환경에서는 정상 동작합니다.
> `@kr-kit/temporal`은 네이티브 `Temporal`이 표준이 되기 전까지는 `@js-temporal/polyfill`이 런타임·타입 출처입니다(peerDependency).

## 설계 원칙

- **0-dep 코어 + 얇은 어댑터** — `core-validate` / `holidays-core`는 의존성이 없고, 프레임워크별 패키지는 그 위에 얇게 얹습니다(`zod`/`dayjs`는 peerDependency).
- **런타임 네트워크 호출 없음** — 공휴일 데이터는 빌드 시점에 [공공데이터포털 한국천문연구원 특일정보 API](https://www.data.go.kr/data/15012690/openapi.do)로 받아 커밋합니다(`pnpm fetch:holidays`). `pnpm verify:holidays`로 API와 일치하는지 검증합니다.
- **개인정보 보호** — 주민등록번호는 **형식 검증 + 마스킹만** 제공하며 생년월일/성별 추출 API는 제공하지 않습니다(개인정보 보호법).

## 개발

```bash
pnpm install
pnpm build        # tsup (ESM + CJS + d.ts)
pnpm test         # vitest (단위 + fixture + 차등 + 속성 + 타입 테스트)
pnpm typecheck    # tsc --noEmit (전 패키지, .test-d.ts 포함)
pnpm coverage     # 커버리지 게이트 (statements/lines/functions ≥ 95%, branches ≥ 88%)
pnpm test:tz      # holidays-core 를 4개 시간대에서 재실행
pnpm smoke        # 패킹된 tarball 을 임시 디렉터리에 설치해 ESM/CJS/zod v4 소비 확인
```

공휴일 데이터 검증은 [`docs/verification-checklist.md`](docs/verification-checklist.md) 참고. `pnpm fetch:holidays` / `pnpm verify:holidays`는 data.go.kr 「한국천문연구원_특일 정보」 인증키가 필요합니다 — `.env.example`을 `.env`로 복사해 `DATA_GO_KR_SERVICE_KEY`(일반 인증키 = **Decoding 키**)를 채우거나, 실행 시 환경변수로 넘기거나, CI는 GitHub Actions secret으로 등록하세요(`.env`는 .gitignore 됨).

## 라이선스

MIT
