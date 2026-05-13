// 날짜→YYYY-MM-DD 변환 로직은 @hangukit/holidays-core에 집중돼 있고, dayjs 어댑터는
// format('YYYY-MM-DD') 문자열로 위임한다. 따라서 holidays-core 테스트를 여러 시간대에서
// 돌려 "시간대 때문에 날짜가 하루 밀리는" 고전적 함정을 잡는다.
import { spawnSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const TIMEZONES = ["Asia/Seoul", "UTC", "America/Los_Angeles", "Pacific/Kiritimati"];

let failed = false;
for (const tz of TIMEZONES) {
  console.log(`\n========================= TZ=${tz} =========================`);
  const r = spawnSync("pnpm --filter @hangukit/holidays-core run test", {
    cwd: root,
    stdio: "inherit",
    env: { ...process.env, TZ: tz },
    shell: true,
  });
  if (r.status !== 0) failed = true;
}

console.log(
  failed
    ? "\n✗ TZ 매트릭스 실패 — 위 출력을 확인하세요."
    : `\n✔ 모든 시간대(${TIMEZONES.join(", ")})에서 통과`,
);
process.exit(failed ? 1 : 0);
