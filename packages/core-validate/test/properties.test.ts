import * as fc from "fast-check";
import { describe, expect, it } from "vitest";
import {
  formatBrn,
  formatCorporateRegistrationNumber,
  formatKoreanMobile,
  isBrn,
  isKoreanMobile,
  maskName,
  maskRrn,
  onlyDigits,
  parseBrn,
} from "../src/index";

const digitsOfLength = (n: number): fc.Arbitrary<string> =>
  fc.array(fc.integer({ min: 0, max: 9 }), { minLength: n, maxLength: n }).map((a) => a.join(""));

const hangulSyllable = fc.integer({ min: 0xac00, max: 0xd7a3 }).map((c) => String.fromCharCode(c));
const hangulString = (min: number, max: number): fc.Arbitrary<string> =>
  fc.array(hangulSyllable, { minLength: min, maxLength: max }).map((a) => a.join(""));

const RUNS = 500;

describe("속성 기반 — 포맷/숫자 보존 roundtrip", () => {
  it("formatBrn은 숫자를 보존하고 XXX-XX-XXXXX 형태다", () => {
    fc.assert(
      fc.property(digitsOfLength(10), (d) => {
        const f = formatBrn(d);
        return onlyDigits(f) === d && /^\d{3}-\d{2}-\d{5}$/.test(f);
      }),
      { numRuns: RUNS },
    );
  });

  it("formatCorporateRegistrationNumber은 숫자를 보존하고 XXXXXX-XXXXXXX 형태다", () => {
    fc.assert(
      fc.property(digitsOfLength(13), (d) => {
        const f = formatCorporateRegistrationNumber(d);
        return onlyDigits(f) === d && /^\d{6}-\d{7}$/.test(f);
      }),
      { numRuns: RUNS },
    );
  });

  it("isBrn(x) ⟺ parseBrn(x) !== null, 그리고 parse 결과의 raw는 숫자만 10자리", () => {
    fc.assert(
      fc.property(digitsOfLength(10), (d) => {
        const valid = isBrn(d);
        const parsed = parseBrn(d);
        if (valid) return parsed !== null && parsed.raw === d && onlyDigits(parsed.formatted) === d;
        return parsed === null;
      }),
      { numRuns: RUNS },
    );
  });
});

describe("속성 기반 — 휴대폰", () => {
  const validMobile = fc
    .tuple(fc.constantFrom("010", "011", "016", "017", "018", "019"), fc.boolean())
    .chain(([prefix, eleven]) => {
      const restLen = prefix === "010" ? 8 : eleven ? 8 : 7;
      return digitsOfLength(restLen).map((rest) => prefix + rest);
    });

  it("정상 휴대폰은 isKoreanMobile=true, format은 숫자 보존 + 하이픈 패턴", () => {
    fc.assert(
      fc.property(validMobile, (m) => {
        if (!isKoreanMobile(m)) return false;
        const f = formatKoreanMobile(m);
        return onlyDigits(f) === m && /^\d{3}-\d{3,4}-\d{4}$/.test(f);
      }),
      { numRuns: RUNS },
    );
  });
});

describe("속성 기반 — 마스킹", () => {
  it("maskName: 길이 보존, 양 끝 글자 보존(길이≥3), 가운데는 전부 *", () => {
    fc.assert(
      fc.property(hangulString(2, 12), (name) => {
        const masked = maskName(name);
        if (masked.length !== name.length) return false;
        if (name.length === 2) return masked === `${name[0]}*`;
        if (masked[0] !== name[0]) return false;
        if (masked[masked.length - 1] !== name[name.length - 1]) return false;
        return [...masked.slice(1, -1)].every((c) => c === "*");
      }),
      { numRuns: RUNS },
    );
  });

  it("maskRrn: 앞 6자리(생년월일)는 보존, 하이픈 뒤는 *만(기본은 성별 1자리만 노출)", () => {
    const rrnLike = fc.tuple(digitsOfLength(6), fc.integer({ min: 1, max: 8 }), digitsOfLength(6));
    fc.assert(
      fc.property(rrnLike, fc.boolean(), ([front, gender, tail], withHyphen) => {
        const back = `${gender}${tail}`;
        const input = withHyphen ? `${front}-${back}` : `${front}${back}`;
        const masked = maskRrn(input);
        if (!masked.startsWith(`${front}-`)) return false;
        const after = masked.slice(7); // 'front-' 다음
        return after === `${gender}******` && maskRrn(input, { revealGenderDigit: false }).slice(7) === "*******";
      }),
      { numRuns: RUNS },
    );
  });
});
