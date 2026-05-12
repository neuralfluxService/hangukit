import { expectTypeOf } from "expect-type";
import { z } from "zod";
import { brn, koreanMobile, koreanName } from "../src/index";

// 스키마 출력 타입은 string 이어야 한다.
expectTypeOf(brn().parse("124-81-00998")).toEqualTypeOf<string>();
expectTypeOf(koreanMobile().parse("010-1234-5678")).toEqualTypeOf<string>();
expectTypeOf(brn().safeParse("x").success).toEqualTypeOf<boolean>();

// z.object 안에서 조합하면 필드 타입이 string 으로 추론된다.
const Form = z.object({ bizNo: brn(), phone: koreanMobile() });
expectTypeOf(Form.parse({ bizNo: "x", phone: "y" })).toEqualTypeOf<{ bizNo: string; phone: string }>();

// koreanName 은 옵션을 받을 수 있다.
expectTypeOf(koreanName).parameter(0).toEqualTypeOf<
  { minLength?: number; maxLength?: number; allowSpace?: boolean } | undefined
>();
