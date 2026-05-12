import { describe, expect, it } from "vitest";
import { isBrn, isCorporateRegistrationNumber, isValidRrnFormat } from "../src/index";

// 시드 고정 PRNG (mulberry32) — 결정적 무작위 샘플.
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function randomDigits(rng: () => number, n: number): string {
  let s = "";
  for (let i = 0; i < n; i += 1) s += Math.floor(rng() * 10);
  return s;
}

// ── 사업자등록번호: 독립 재구현(가중치를 다른 방식으로 풀어 씀) ─────────────────
function refBrnValid(d10: string): boolean {
  if (!/^\d{10}$/.test(d10)) return false;
  if (/^0{10}$/.test(d10)) return false;
  const n = [...d10].map(Number);
  const w = [1, 3, 7, 1, 3, 7, 1, 3, 5];
  let sum = 0;
  for (let i = 0; i < 9; i += 1) sum += n[i]! * w[i]!;
  sum += Math.trunc((n[8]! * 5) / 10);
  return n[9] === (10 - (sum % 10)) % 10;
}

// ── 법인등록번호: 독립 재구현 ─────────────────────────────────────────────────
function refCrnValid(d13: string): boolean {
  if (!/^\d{13}$/.test(d13)) return false;
  if (/^0{13}$/.test(d13)) return false;
  const n = [...d13].map(Number);
  let sum = 0;
  for (let i = 0; i < 12; i += 1) sum += n[i]! * (i % 2 === 0 ? 1 : 2);
  return n[12] === (10 - (sum % 10)) % 10;
}

// ── 주민등록번호 구 체크섬: 독립 재구현 ──────────────────────────────────────
function refRrnValid(d13: string): boolean {
  if (!/^\d{6}[1-8]\d{6}$/.test(d13)) return false;
  const n = [...d13].map(Number);
  const month = n[2]! * 10 + n[3]!;
  const day = n[4]! * 10 + n[5]!;
  if (month < 1 || month > 12 || day < 1 || day > 31) return false;
  const w = [2, 3, 4, 5, 6, 7, 8, 9, 2, 3, 4, 5];
  let sum = 0;
  for (let i = 0; i < 12; i += 1) sum += n[i]! * w[i]!;
  return n[12] === (11 - (sum % 11)) % 10;
}

const N = 100_000;

describe("[gate] 체크섬 차등 검증 (구현 vs 독립 재구현, 시드 고정 무작위 표본)", () => {
  it(`사업자등록번호 ${N.toLocaleString()}건`, () => {
    const rng = mulberry32(0xa1b2c3d4);
    for (let i = 0; i < N; i += 1) {
      const d = randomDigits(rng, 10);
      expect(isBrn(d)).toBe(refBrnValid(d));
    }
  });

  it(`법인등록번호 ${N.toLocaleString()}건`, () => {
    const rng = mulberry32(0x11223344);
    for (let i = 0; i < N; i += 1) {
      const d = randomDigits(rng, 13);
      expect(isCorporateRegistrationNumber(d)).toBe(refCrnValid(d));
    }
  });

  it(`주민등록번호 형식+구체크섬 ${N.toLocaleString()}건`, () => {
    const rng = mulberry32(0x55667788);
    for (let i = 0; i < N; i += 1) {
      // 앞 6 + 성별자리(0~9, 일부는 무효) + 6
      const d = randomDigits(rng, 13);
      expect(isValidRrnFormat(d)).toBe(refRrnValid(d));
    }
  });

  it("하이픈/공백이 섞여도 동일 판정", () => {
    expect(isBrn(" 124-81-00998 ")).toBe(isBrn("1248100998"));
    expect(isCorporateRegistrationNumber("130111 0006246")).toBe(
      isCorporateRegistrationNumber("1301110006246"),
    );
    expect(isValidRrnFormat("900101-1234568")).toBe(isValidRrnFormat("9001011234568"));
  });
});
