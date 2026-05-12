import { describe, expect, it } from "vitest";
import {
  formatKoreanMobile,
  formatKoreanPhone,
  getBankName,
  isKoreanPhone,
  isLegacyPostalCode,
  isRrnLike,
  maskBankAccount,
  maskKoreanMobile,
} from "../src/index";

// 다른 테스트에서 직접 다루지 않는 경로들의 추가 커버리지.

describe("전화 — 마스킹/포맷 추가 경로", () => {
  it("maskKoreanMobile", () => {
    expect(maskKoreanMobile("010-1234-5678")).toBe("010-****-5678");
    expect(maskKoreanMobile("0111234567")).toBe("011-***-4567");
    expect(maskKoreanMobile("02-1234-5678")).toBe("02-1234-5678"); // 휴대폰 아님 → 그대로
  });

  it("formatKoreanMobile — 형식 안 맞으면 입력 그대로", () => {
    expect(formatKoreanMobile("123")).toBe("123");
  });

  it("formatKoreanPhone — 02/3자리 지역번호/대표번호/070, 형식 외", () => {
    expect(formatKoreanPhone("021234567")).toBe("02-123-4567"); // 02 + 9자리
    expect(formatKoreanPhone("0212345678")).toBe("02-1234-5678"); // 02 + 10자리
    expect(formatKoreanPhone("0311234567")).toBe("031-123-4567"); // 3자리 지역번호 10자리
    expect(formatKoreanPhone("07012345678")).toBe("070-1234-5678"); // 070 11자리
    expect(formatKoreanPhone("15881234")).toBe("1588-1234"); // 대표번호
    expect(formatKoreanPhone("999")).toBe("999"); // 형식 외 → 그대로
  });

  it("isKoreanPhone — 050X 평생번호", () => {
    expect(isKoreanPhone("050412345678")).toBe(true); // 0504-XXXX-XXXX (12자리)
    expect(isKoreanPhone("05041234567")).toBe(true); // 11자리
    expect(isKoreanPhone("099-1234-5678")).toBe(false);
  });
});

describe("우편번호 — 구 6자리 형식", () => {
  it("isLegacyPostalCode", () => {
    expect(isLegacyPostalCode("135-080")).toBe(true);
    expect(isLegacyPostalCode("135080")).toBe(true);
    expect(isLegacyPostalCode("06236")).toBe(false); // 5자리는 구형식 아님
    expect(isLegacyPostalCode("abc-def")).toBe(false);
  });
});

describe("은행 — 이름/계좌 마스킹", () => {
  it("getBankName", () => {
    expect(getBankName("004")).toBe("KB국민은행");
    expect(getBankName("088")).toBe("신한은행");
    expect(getBankName("999")).toBeUndefined();
  });

  it("maskBankAccount — 앞 4자리 + 가운데 마스킹 + 뒤 2자리", () => {
    expect(maskBankAccount("110-123-456789")).toBe("1101******89"); // 12자리
    expect(maskBankAccount("12345678")).toBe("1234**78"); // 8자리
    expect(maskBankAccount("1234567")).toBe("1234567"); // 8자리 미만 → 그대로
  });
});

describe("주민등록번호 — isRrnLike (체크섬 무시)", () => {
  it("형식만 본다", () => {
    expect(isRrnLike("900101-1234567")).toBe(true); // 체크섬 틀려도 형식 OK
    expect(isRrnLike("9001011234567")).toBe(true); // 하이픈 없어도 OK
    expect(isRrnLike("900101-9234567")).toBe(false); // 성별자리 9는 불가
    expect(isRrnLike("901301-1234567")).toBe(false); // 13월
    expect(isRrnLike("형식아님")).toBe(false);
  });
});
