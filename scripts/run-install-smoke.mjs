// 발행 형태(tarball)를 임시 디렉터리에 설치해 ESM/CJS 소비자 시점에서 동작을 확인하고,
// @kr-kit/zod 가 zod v4 와도 동작하는지 본다. (단위 테스트는 zod v3 로 돌린다.)
//
// 워크스페이스 심볼릭 링크가 아니라 실제 tarball 을 설치하므로:
//  - package.json 의 exports/files/main 누락을 잡고
//  - @kr-kit/zod 가 "소비자가 설치한 zod"를 쓰는지(피어 의존성 해석) 정확히 검증한다.

import { spawnSync } from "node:child_process";
import { cpSync, mkdirSync, mkdtempSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const PACKAGES = ["core-validate", "zod", "holidays-core", "dayjs"]; // @kr-kit/*

function sh(label, cmd, opts = {}) {
  if (label) console.log(`\n── ${label} ──`);
  const r = spawnSync(cmd, { stdio: "inherit", shell: true, cwd: root, ...opts });
  if (r.status !== 0) throw new Error(`명령 실패 (exit ${r.status}): ${cmd}`);
}

const work = mkdtempSync(join(tmpdir(), "kr-kit-smoke-"));
const packDir = join(work, "tarballs");
mkdirSync(packDir, { recursive: true });
let failed = false;

try {
  sh("패키지 빌드", "pnpm build");

  console.log(`\n── tarball 패킹 → ${packDir} ──`);
  for (const p of PACKAGES) {
    // pnpm pack 는 workspace:* 의존성을 실제 버전으로 치환해 준다 (npm pack 은 못 함).
    sh(null, `pnpm pack --pack-destination "${packDir}"`, { cwd: join(root, "packages", p) });
  }
  const tarballs = {};
  for (const f of readdirSync(packDir)) {
    if (!f.endsWith(".tgz")) continue;
    const m = f.match(/^kr-kit-(.+)-\d+\.\d+\.\d+.*\.tgz$/);
    if (m) tarballs[m[1]] = join(packDir, f);
  }
  for (const p of PACKAGES) {
    if (!tarballs[p]) throw new Error(`tarball 누락: @kr-kit/${p} (${packDir} 확인)`);
  }
  const tgz = (p) => `"${tarballs[p]}"`;

  // ── 소비자 A: ESM + CJS, zod v3 ─────────────────────────────────────────────
  const dirA = join(work, "consumer-esm-cjs");
  mkdirSync(dirA, { recursive: true });
  writeFileSync(
    join(dirA, "package.json"),
    `${JSON.stringify({ name: "consumer-a", private: true, type: "module" }, null, 2)}\n`,
  );
  cpSync(join(root, "examples/smoke-test/esm.mjs"), join(dirA, "esm.mjs"));
  cpSync(join(root, "examples/smoke-test/cjs.cjs"), join(dirA, "cjs.cjs"));
  sh(
    "소비자 A 설치 (tarball + zod@3 + dayjs)",
    `npm install --no-audit --no-fund --loglevel=error ${tgz("core-validate")} ${tgz("holidays-core")} ${tgz("zod")} ${tgz("dayjs")} "zod@^3.24.1" "dayjs@^1.11.13"`,
    { cwd: dirA },
  );
  sh("소비자 A: ESM", "node esm.mjs", { cwd: dirA });
  sh("소비자 A: CJS", "node cjs.cjs", { cwd: dirA });

  // ── 소비자 B: zod v4 ────────────────────────────────────────────────────────
  const dirB = join(work, "consumer-zod-v4");
  mkdirSync(dirB, { recursive: true });
  writeFileSync(
    join(dirB, "package.json"),
    `${JSON.stringify({ name: "consumer-b", private: true, type: "module" }, null, 2)}\n`,
  );
  cpSync(join(root, "examples/zod-v4-smoke/index.mjs"), join(dirB, "index.mjs"));
  sh(
    "소비자 B 설치 (tarball + zod@4)",
    `npm install --no-audit --no-fund --loglevel=error ${tgz("core-validate")} ${tgz("zod")} "zod@^4.0.0"`,
    { cwd: dirB },
  );
  sh("소비자 B: zod v4", "node index.mjs", { cwd: dirB });
} catch (err) {
  console.error(`\n✗ ${err instanceof Error ? err.message : err}`);
  failed = true;
} finally {
  rmSync(work, { recursive: true, force: true });
}

console.log(failed ? "\n✗ 설치 스모크 실패" : "\n✔ 설치 스모크 통과 (ESM · CJS · zod v4)");
process.exit(failed ? 1 : 0);
