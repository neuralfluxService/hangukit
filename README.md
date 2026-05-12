# kr-kit

한국 환경 사이드카(side-car) 패키지 모음. 글로벌 표준 라이브러리(`zod`, `dayjs`, `date-fns` …)를 **대체하지 않고 옆에 붙어** 한국 특수 요구를 채웁니다.

## 패키지

| 패키지 | 설명 | 상태 |
| --- | --- | --- |
| [`@kr-kit/core-validate`](packages/core-validate) | 의존성 0. 사업자등록번호·법인등록번호·휴대폰·한글이름·계좌번호·우편번호 검증/포맷, 주민번호 마스킹 | ✅ |
| [`@kr-kit/zod`](packages/zod) | `@kr-kit/core-validate`의 zod(v3·v4) 어댑터 | ✅ |
| [`@kr-kit/holidays-core`](packages/holidays-core) | 의존성 0(음력만). 공휴일·대체공휴일·임시공휴일 규칙 엔진, 영업일 산술, KRX 휴장일 | ✅ |
| [`@kr-kit/dayjs`](packages/dayjs) | `@kr-kit/holidays-core`의 dayjs 플러그인 | ✅ |
| `@kr-kit/valibot`, `@kr-kit/date-fns`, `@kr-kit/temporal` | 추가 어댑터 | 🔜 |

## 설계 원칙

- **0-dep 코어 + 얇은 어댑터** — `core-validate` / `holidays-core`는 의존성이 없거나 최소이고, 프레임워크별 패키지는 그 위에 얇게 얹습니다.
- **런타임 네트워크 호출 없음** — 공휴일 데이터는 빌드 시점에 [공공데이터포털 한국천문연구원 특일정보 API](https://www.data.go.kr/data/15012690/openapi.do)로 받아 오버라이드(임시공휴일·선거일)만 커밋합니다. 나머지는 규칙 엔진이 계산합니다.
- **개인정보 보호** — 주민등록번호는 **형식 검증 + 마스킹만** 제공하며 생년월일/성별 추출 API는 제공하지 않습니다.

## 개발

```bash
pnpm install
pnpm build
pnpm test
```

## 라이선스

MIT
