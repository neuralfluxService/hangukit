# kr-kit — 작업 지침

한국 환경 사이드카 npm 패키지 모노레포. **선점 패키지를 대체하지 않고 어댑터로 얹혀가는** 것이 핵심 전략.

## 구조
- pnpm workspaces + Turborepo. 빌드 `tsup`(ESM+CJS+d.ts), 테스트 `vitest`, 릴리스 `changesets`.
- `packages/core-validate` — 의존성 0. 한국 식별자 검증/포맷/마스킹.
- `packages/zod` — `core-validate`의 zod 어댑터. `zod`는 peerDependency.
- `packages/holidays-core` — 공휴일 규칙 엔진. `korean-lunar-calendar`만 의존.
- `packages/dayjs` — `holidays-core`의 dayjs 플러그인. `dayjs`는 peerDependency.

## 규칙
- **주민등록번호(RRN)**: 형식 검증 + 마스킹만. 생년월일/성별 추출 함수 추가 금지(개인정보보호법). README/JSDoc에 경고 유지.
- **공휴일 데이터**: 런타임 네트워크 호출 금지. `scripts/fetch-holidays.ts`로 빌드 시점에 천문연 API에서 받고, 임시공휴일·선거일만 `packages/holidays-core/src/data/overrides.json`에 수기 추가.
- **린트/타입체크 대체 금지**: eslint·tsc는 추가 레이어. 외부 정적분석 도구로 끄지 말 것.
- **산출물 커밋 금지**: `dist/`, `.turbo/`, `coverage/`, `*.tsbuildinfo`는 .gitignore.
- 새 native 의존성(better-sqlite3, tree-sitter 류) 추가 시 격리 임시 디렉터리에서 먼저 검증.

## 알려진 패턴 (CI 하드게이트 — 절대 깨면 안 됨)
사업자등록번호 체크섬 / 법인등록번호 체크섬 / 010·지역번호 / `maskRrn` / 설날 대체공휴일 2024-02-12 / 부처님오신날 대체공휴일 2023-05-29 / 한글날 일요일 해 대체공휴일 / 임시공휴일 오버라이드 / `addBusinessDays`가 설날 연휴 건너뜀 / KRX 2024-12-31 휴장.
