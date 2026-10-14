import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const binderPath = path.join(here, "LADDER_ATLAS_BINDER_V1_2026-10-06.json");
const outputPath = path.resolve(here, "../../APP/ladders.internal.js");
const binder = JSON.parse(fs.readFileSync(binderPath, "utf8"));

if (binder.schema !== "nexah.navigator.ladder-atlas-binder" || binder.core_ladders?.length !== 8) {
  throw new Error("Refusing to build an invalid Ladder Atlas binder");
}

const payload = `/* Generated from LADDER_ATLAS_BINDER_V1_2026-10-06.json. Internal only. */\nwindow.NEXAH_LADDER_ATLAS_BINDER = ${JSON.stringify(binder, null, 2)};\n`;
fs.writeFileSync(outputPath, payload);
console.log(`Wrote ${path.relative(process.cwd(), outputPath)}`);
