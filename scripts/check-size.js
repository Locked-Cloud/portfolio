// Entry-chunk size budget: the JS referenced by index.html must stay under
// BUDGET_KB gzipped. Lazy chunks (three.js scene) are allowed — they load on
// demand. Runs against dist/ after `npm run build`.
import fs from "node:fs";
import zlib from "node:zlib";

const BUDGET_KB = 120;
const INDEX = "dist/index.html";

const html = fs.readFileSync(INDEX, "utf8");
const referenced = [...html.matchAll(/assets\/[\w.-]+\.js/g)].map((m) => m[0]);

if (referenced.length === 0) {
  console.error("check-size: no entry scripts found in " + INDEX);
  process.exit(1);
}

let total = 0;
for (const rel of referenced) {
  const buf = fs.readFileSync("dist/" + rel);
  const gz = zlib.gzipSync(buf).length;
  total += gz;
  console.log(`  ${(gz / 1024).toFixed(1).padStart(7)} KB gz  ${rel}`);
}

const totalKB = total / 1024;
console.log(
  `  ${"─".repeat(24)}\n  ${totalKB.toFixed(1).padStart(7)} KB gz  entry total (budget ${BUDGET_KB} KB)`
);

if (totalKB > BUDGET_KB) {
  console.error(
    `check-size: FAIL — entry bundle ${totalKB.toFixed(1)} KB exceeds ${BUDGET_KB} KB budget`
  );
  process.exit(1);
}
console.log("check-size: OK");
