# kr-kit — 작업 지침

한국 환경 사이드카 npm 패키지 모노레포. **선점 패키지를 대체하지 않고 어댑터로 얹혀가는** 것이 핵심 전략.

## 구조
- pnpm workspaces + Turborepo. 빌드 `tsup`(ESM+CJS+d.ts), 테스트 `vitest`, 릴리스 `changesets`.
- `packages/core-validate` — 의존성 0. 한국 식별자 검증/포맷/마스킹.
- `packages/zod` — `core-validate`의 zod 어댑터. `zod`는 peerDependency. 단위 테스트는 zod v3, v4는 `scripts/run-install-smoke.mjs`가 검증.
- `packages/holidays-core` — 의존성 0. 공휴일 데이터(`src/holidays-data.ts`, 2021~2026) + 영업일 산술 + KRX 휴장일.
- `packages/dayjs` — `holidays-core`의 dayjs 플러그인. `dayjs`는 peerDependency.
- `examples/smoke-test`, `examples/zod-v4-smoke` — 스모크용 소스만 (실행은 `pnpm smoke` = tarball 설치 후).

## 규칙
- **주민등록번호(RRN)**: 형식 검증 + 마스킹만. 생년월일/성별 추출 함수 추가 금지(개인정보보호법). `test/rrn-security.test.ts`가 export 목록을 게이트함.
- **공휴일 데이터**: 런타임 네트워크 호출 금지. `pnpm fetch:holidays`(`DATA_GO_KR_SERVICE_KEY` 필요)로 천문연 API에서 받아 `packages/holidays-core/src/holidays-data.ts`에 커밋. 임시공휴일·선거일이 API에 없으면 `scripts/fetch-holidays.ts`의 `MANUAL_OVERRIDES`에 추가. `pnpm verify:holidays`로 API와 일치 검증, `holidays-cross-check.test.ts`가 `@hyunbinseo/holidays-kr`와 교차 대조.
  - 데이터 수정 시 `docs/verification-checklist.md` 따라 수동 확인.
  - 알아둘 점: 근로자의날(5/1)은 관공서 공휴일 아님(→ `isKrxHoliday`만). 2026년부터 제헌절(7/17) 부활.
- **린트/타입체크 대체 금지**: tsc는 추가 레이어. 외부 정적분석 도구로 끄지 말 것.
- **산출물 커밋 금지**: `dist/`, `.turbo/`, `coverage/`, `*.tsbuildinfo`는 .gitignore.
- 새 native 의존성(better-sqlite3, tree-sitter 류) 추가 시 격리 임시 디렉터리에서 먼저 검증.

## 검증 명령
`pnpm build` → `pnpm typecheck`(`.test-d.ts` 포함) → `pnpm coverage`(게이트: stmts/lines/funcs ≥ 95%, branches ≥ 88%) → `pnpm test:tz`(4개 TZ) → `pnpm smoke`(tarball 설치, ESM/CJS/zod v4) → `pnpm -r exec publint`/`attw --profile node16`.

## 알려진 패턴 (CI 하드게이트 — describe 이름에 `[gate]` 표시, 절대 깨면 안 됨)
사업자등록번호 체크섬(124-81-00998 통과 / ±1·전부0 거부) / 법인등록번호 체크섬(130111-0006246) / 010·지역번호·길이오류 / `maskRrn` 뒷자리 마스킹 + RRN 추출 API 부재 / 체크섬 차등 검증(독립 재구현 vs 구현, 30만 표본) / 설날 대체공휴일 2024-02-12 / 부처님오신날 대체공휴일 2023-05-29 / 한글날 일요일 해(2022) 대체 발생·평일 해(2024) 미발생 / 임시공휴일 오버라이드(2023-10-02/2024-10-01/2025-01-27) / `addBusinessDays(2025-01-27, 3)` = 2025-02-04(설날 연휴 건너뜀) / KRX 2024-12-31 휴장 / `@hyunbinseo/holidays-kr` 교차 대조 일치.
