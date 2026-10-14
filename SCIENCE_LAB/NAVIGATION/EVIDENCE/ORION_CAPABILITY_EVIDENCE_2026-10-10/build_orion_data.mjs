import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const binderPath = path.join(here, "ORION_CAPABILITY_EVIDENCE_BINDER_V1_2026-10-10.json");
const outputPath = path.resolve(here, "../../APP/orion.internal.js");
const binder = JSON.parse(fs.readFileSync(binderPath, "utf8"));

if (binder.schema !== "nexah.navigator.orion-capability-evidence-binder/1.0.0" || binder.evidence_ladder?.length !== 5) {
  throw new Error("Refusing to build an invalid ORION capability and evidence binder");
}

const payload = `/* Generated from ORION_CAPABILITY_EVIDENCE_BINDER_V1_2026-10-10.json. Internal only. */\nwindow.NEXAH_ORION_CAPABILITY_EVIDENCE = ${JSON.stringify(binder, null, 2)};\n`;
fs.writeFileSync(outputPath, payload);
console.log(`Wrote ${path.relative(process.cwd(), outputPath)}`);
