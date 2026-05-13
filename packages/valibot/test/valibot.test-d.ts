import { expectTypeOf } from "expect-type";
import * as v from "valibot";
import { brn, koreanMobile, koreanName, postalCode } from "../src/index";

// v.pipe(v.string(), brn()) 의 출력 타입은 string.
expectTypeOf(v.parse(v.pipe(v.string(), brn()), "124-81-00998")).toEqualTypeOf<string>();
expectTypeOf(v.parse(v.pipe(v.string(), koreanMobile()), "010-1234-5678")).toEqualTypeOf<string>();
expectTypeOf(v.safeParse(v.pipe(v.string(), brn()), "x").success).toEqualTypeOf<boolean>();

// v.object 안에서 조합하면 필드 타입이 string 으로 추론된다.
const Form = v.object({ bizNo: v.pipe(v.string(), brn()), zip: v.pipe(v.string(), postalCode()) });
expectTypeOf(v.parse(Form, { bizNo: "x", zip: "y" })).toEqualTypeOf<{ bizNo: string; zip: string }>();

// koreanName 은 옵션을 받을 수 있다.
expectTypeOf(koreanName).parameter(0).toEqualTypeOf<
  { minLength?: number; maxLength?: number; allowSpace?: boolean } | undefined
>();
