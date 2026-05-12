import { expectTypeOf } from "expect-type";
import {
  formatBrn,
  isBrn,
  maskRrn,
  parseBrn,
  type ParsedBusinessRegistrationNumber,
} from "../src/index";

expectTypeOf(isBrn).parameters.toEqualTypeOf<[string]>();
expectTypeOf(isBrn("124-81-00998")).toEqualTypeOf<boolean>();
expectTypeOf(formatBrn("1248100998")).toEqualTypeOf<string>();
expectTypeOf(parseBrn("x")).toEqualTypeOf<ParsedBusinessRegistrationNumber | null>();
expectTypeOf<ParsedBusinessRegistrationNumber["raw"]>().toEqualTypeOf<string>();
expectTypeOf(maskRrn("900101-1234568")).toEqualTypeOf<string>();
expectTypeOf(maskRrn).parameter(1).toEqualTypeOf<{ revealGenderDigit?: boolean } | undefined>();
