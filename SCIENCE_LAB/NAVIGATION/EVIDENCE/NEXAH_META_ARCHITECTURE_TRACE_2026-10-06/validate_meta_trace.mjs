import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const htmlPath = path.join(here, "NEXAH_META_ARCHITECTURE_41_TRACE.html");
const html = fs.readFileSync(htmlPath, "utf8");

const checks = [
  ["doctype", /<!doctype html>/i],
  ["german language", /<html lang="de">/],
  ["responsive viewport", /name="viewport"/],
  ["persistent claim ceiling", /Persistent claim ceiling/],
  ["prime index correction", /41 = P13 · 43 = P14/],
  ["exact plus-one hinge", /41 \+ 1 = 42/],
  ["six-by-seven", /42 = 6 × 7/],
  ["N+1 binder lane", /N\+1 binder/],
  ["sixteen-state carrier", /2⁴ = 16/],
  ["F40 route", /F40 \/ Hopf/],
  ["negative C4 finding", /C4 global ≠ Hopf return/],
  ["family route", /CF:F1–F7/],
  ["no family promotion", /NO FAMILY PROMOTION/],
  ["reduced motion", /prefers-reduced-motion/],
  ["keyboard-visible focus", /:focus-visible/],
  ["no remote dependency", !/https?:\/\//.test(html)]
];

const failures = checks.filter(([, test]) => test instanceof RegExp ? !test.test(html) : !test);
const hrefs = [...html.matchAll(/href="([^"]+)"/g)]
  .map((match) => match[1])
  .filter((href) => !href.startsWith("#"));

for (const href of hrefs) {
  const target = path.resolve(here, href.split("#")[0]);
  if (!fs.existsSync(target)) failures.push(["missing link target: " + href, false]);
}

if (failures.length) {
  console.error("META-TRACE-01 FAIL (" + failures.length + "/" + (checks.length + hrefs.length) + ")");
  failures.forEach(([label]) => console.error("- " + label));
  process.exit(1);
}

console.log("META-TRACE-01 PASS (" + (checks.length + hrefs.length) + "/" + (checks.length + hrefs.length) + ")");
console.log("HTML: " + path.relative(process.cwd(), htmlPath));
console.log("local links: " + hrefs.length);
