#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const binderPath = path.join(here, "A0_ORIENTATION_EVIDENCE_LINEAGE_BINDER_V1_2026-10-10.json");
const outputPath = path.resolve(here, "../../APP/a0-orientation-evidence.internal.js");
const binder = JSON.parse(fs.readFileSync(binderPath, "utf8"));
const output = `window.NEXAH_A0_ORIENTATION_EVIDENCE = ${JSON.stringify(binder)};\n`;
fs.writeFileSync(outputPath, output, "utf8");
console.log(JSON.stringify({ status: "PASS", output: outputPath, bytes: Buffer.byteLength(output) }, null, 2));
