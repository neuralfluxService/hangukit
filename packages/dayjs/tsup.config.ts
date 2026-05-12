import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: true,
  clean: true,
  treeshake: true,
  sourcemap: true,
  // 이 패키지는 default export 하나뿐이므로, CJS 빌드를 `module.exports = plugin` 형태로 내보낸다
  // (dayjs 플러그인 관례 + node16 CJS 해석에서 `.default` 없이 require 가능).
  cjsInterop: true,
});
