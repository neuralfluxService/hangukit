import { describe, expect, it } from "vitest";
import {
  formatBrn,
  formatKoreanMobile,
  formatKoreanPhone,
  isBankAccountNumber,
  isBankCode,
  isBrn,
  isCorporateRegistrationNumber,
  isKoreanMobile,
  isKoreanName,
  isKoreanPhone,
  isPostalCode,
  isRepresentativeNumber,
  isValidRrnFormat,
  maskName,
  maskRrn,
  parseBrn,
} from "../src/index";

describe("사업자등록번호", () => {
  it("유효한 번호를 통과시킨다 (124-81-00998 = 한국전력공사)", () => {
    expect(isBrn("124-81-00998")).toBe(true);
    expect(isBrn("1248100998")).toBe(true);
  });

  it("체크섬이 1자리 틀린 번호를 거부한다", () => {
    expect(isBrn("124-81-00997")).toBe(false);
    expect(isBrn("124-81-00999")).toBe(false);
  });

  it("자릿수가 안 맞거나 숫자가 아니면 거부한다", () => {
    expect(isBrn("124-81-0099")).toBe(false);
    expect(isBrn("12481009980")).toBe(false);
    expect(isBrn("abc-81-00998")).toBe(false);
  });

  it("포맷과 파싱", () => {
    expect(formatBrn("1248100998")).toBe("124-81-00998");
    expect(formatBrn("124")).toBe("124");
    expect(parseBrn("124-81-00998")).toEqual({ raw: "1248100998", formatted: "124-81-00998" });
    expect(parseBrn("124-81-00997")).toBeNull();
  });
});

describe("법인등록번호", () => {
  it("유효한 번호를 통과시킨다 (130111-0006246 = 삼성전자)", () => {
    expect(isCorporateRegistrationNumber("130111-0006246")).toBe(true);
    expect(isCorporateRegistrationNumber("1301110006246")).toBe(true);
  });

  it("체크섬이 틀린 번호를 거부한다", () => {
    expect(isCorporateRegistrationNumber("130111-0006245")).toBe(false);
    expect(isCorporateRegistrationNumber("130111-000624")).toBe(false);
  });
});

describe("휴대폰 / 전화번호", () => {
  it("010 번호(11자리)를 통과시킨다", () => {
    expect(isKoreanMobile("010-1234-5678")).toBe(true);
    expect(isKoreanMobile("01012345678")).toBe(true);
  });

  it("레거시 011/016~019(10~11자리)를 통과시킨다", () => {
    expect(isKoreanMobile("011-123-4567")).toBe(true);
    expect(isKoreanMobile("016-1234-5678")).toBe(true);
  });

  it("잘못된 길이/접두어를 거부한다", () => {
    expect(isKoreanMobile("010-123-4567")).toBe(false); // 010인데 10자리
    expect(isKoreanMobile("010-12345-678")).toBe(true); // 숫자만 보면 11자리라 통과
    expect(isKoreanMobile("012-1234-5678")).toBe(false); // 012는 없는 접두어
    expect(isKoreanMobile("02-1234-5678")).toBe(false);
  });

  it("지역번호/대표번호도 isKoreanPhone으로 인식한다", () => {
    expect(isKoreanPhone("02-123-4567")).toBe(true);
    expect(isKoreanPhone("031-123-4567")).toBe(true);
    expect(isKoreanPhone("1588-1234")).toBe(true);
    expect(isRepresentativeNumber("1588-1234")).toBe(true);
    expect(isKoreanPhone("070-1234-5678")).toBe(true);
  });

  it("포맷", () => {
    expect(formatKoreanMobile("01012345678")).toBe("010-1234-5678");
    expect(formatKoreanMobile("0111234567")).toBe("011-123-4567");
    expect(formatKoreanPhone("0212345678")).toBe("02-1234-5678");
    expect(formatKoreanPhone("15881234")).toBe("1588-1234");
  });
});

describe("우편번호", () => {
  it("5자리 우편번호만 유효", () => {
    expect(isPostalCode("06236")).toBe(true);
    expect(isPostalCode("135-080")).toBe(false); // 구 6자리
    expect(isPostalCode("1234")).toBe(false);
  });
});

describe("은행 코드 / 계좌번호", () => {
  it("표준 기관코드를 알아본다", () => {
    expect(isBankCode("004")).toBe(true); // KB국민은행
    expect(isBankCode("090")).toBe(true); // 카카오뱅크
    expect(isBankCode("999")).toBe(false);
  });

  it("계좌번호 형식(8~16자리)만 본다", () => {
    expect(isBankAccountNumber("110-123-456789")).toBe(true);
    expect(isBankAccountNumber("12345")).toBe(false);
    expect(isBankAccountNumber("1".repeat(17))).toBe(false);
  });
});

describe("한글 이름", () => {
  it("완성형 한글만 통과", () => {
    expect(isKoreanName("홍길동")).toBe(true);
    expect(isKoreanName("김철")).toBe(true);
    expect(isKoreanName("ㄱㄴㄷ")).toBe(false);
    expect(isKoreanName("Hong")).toBe(false);
    expect(isKoreanName("홍 길동")).toBe(false);
    expect(isKoreanName("홍 길동", { allowSpace: true })).toBe(true);
  });

  it("마스킹", () => {
    expect(maskName("홍길동")).toBe("홍*동");
    expect(maskName("김철")).toBe("김*");
    expect(maskName("남궁민수")).toBe("남**수");
  });
});

describe("주민등록번호 (형식 검증 + 마스킹만)", () => {
  it("구 체크섬이 맞는 번호를 통과시킨다", () => {
    expect(isValidRrnFormat("900101-1234568")).toBe(true);
    expect(isValidRrnFormat("900101-1234567")).toBe(false);
  });

  it("월/일 범위를 본다", () => {
    expect(isValidRrnFormat("901301-1234568")).toBe(false); // 13월
  });

  it("마스킹 — 기본은 성별 자리까지, 강한 모드는 전부", () => {
    expect(maskRrn("900101-1234568")).toBe("900101-1******");
    expect(maskRrn("9001011234568")).toBe("900101-1******");
    expect(maskRrn("900101-1234568", { revealGenderDigit: false })).toBe("900101-*******");
    expect(maskRrn("not-a-rrn")).toBe("not-a-rrn");
  });
});
