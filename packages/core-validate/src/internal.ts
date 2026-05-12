/** 문자열에서 숫자만 남긴다. */
export function onlyDigits(value: string): string {
  return value.replace(/\D/g, "");
}

/** 숫자 문자열을 자릿수 배열로 변환. 숫자가 아닌 글자가 있으면 null. */
export function toDigitArray(value: string): number[] | null {
  const out: number[] = [];
  for (const ch of value) {
    if (ch < "0" || ch > "9") return null;
    out.push(ch.charCodeAt(0) - 48);
  }
  return out;
}
