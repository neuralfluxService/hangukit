import { describe, expect, it } from "vitest";
import * as coreValidate from "../src/index";
import { maskRrn } from "../src/index";

describe("[gate] 주민등록번호 보안 규약", () => {
  it("생년월일·성별 등 구성정보를 추출하는 API를 공개하지 않는다", () => {
    // 개인정보 보호법상 RRN 처리는 법령 근거가 있는 경우로 제한된다.
    // 라이브러리가 저장·가공을 부추기지 않도록, 형식 검증과 마스킹만 노출한다.
    const forbidden = /birth|gender|sex|age|decode|extract|parse.*rrn|rrn.*(info|parts|fields|decode|extract)/i;
    const names = Object.keys(coreValidate);
    expect(names.filter((n) => forbidden.test(n))).toEqual([]);
    // RRN 관련 공개 API는 이 셋뿐이어야 한다.
    const rrnApis = names.filter((n) => /rrn/i.test(n)).sort();
    expect(rrnApis).toEqual(["isRrnLike", "isValidRrnFormat", "maskRrn"]);
  });

  it("maskRrn 기본 모드는 생년월일+성별 1자리만, 강한 모드는 하이픈 뒤 전부 가린다", () => {
    expect(maskRrn("900101-1234568")).toBe("900101-1******");
    expect(maskRrn("9001011234568")).toBe("900101-1******");
    expect(maskRrn("900101-1234568", { revealGenderDigit: false })).toBe("900101-*******");
    expect(maskRrn("형식아님")).toBe("형식아님"); // 형식 안 맞으면 입력 그대로
  });
});
