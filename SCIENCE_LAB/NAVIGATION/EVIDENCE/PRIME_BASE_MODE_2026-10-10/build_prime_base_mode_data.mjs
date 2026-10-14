#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const binderPath = path.join(here, "PRIME_BASE_MODE_BINDER_V1_2026-10-10.json");
const outputPath = path.resolve(here, "../../APP/prime-base-mode.internal.js");
const binder = JSON.parse(fs.readFileSync(binderPath, "utf8"));

const output = `window.NEXAH_PRIME_BASE_MODE = ${JSON.stringify(binder)};\n`;
fs.writeFileSync(outputPath, output, "utf8");
console.log(JSON.stringify({ status: "PASS", output: outputPath, bytes: Buffer.byteLength(output) }, null, 2));

