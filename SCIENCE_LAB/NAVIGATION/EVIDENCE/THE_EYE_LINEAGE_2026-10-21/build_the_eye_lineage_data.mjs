import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const binderPath = path.join(here, "THE_EYE_LINEAGE_BINDER_V1_2026-10-21.json");
const outputPath = path.resolve(here, "../../APP/the-eye-lineage.internal.js");
const binder = JSON.parse(fs.readFileSync(binderPath, "utf8"));

if (binder.schema !== "nexah.navigator.the-eye-lineage-binder/1.0.0" || binder.stages?.length !== 7 || binder.publication_authorized !== false) {
  throw new Error("Refusing to build an invalid THE EYE lineage binder");
}

const payload = `/* Generated from THE_EYE_LINEAGE_BINDER_V1_2026-10-21.json. Internal route; public-safe content only. */\nwindow.NEXAH_THE_EYE_LINEAGE = ${JSON.stringify(binder, null, 2)};\n`;
fs.writeFileSync(outputPath, payload);
console.log(`Wrote ${path.relative(process.cwd(), outputPath)}`);
