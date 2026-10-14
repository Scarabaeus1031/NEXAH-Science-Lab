#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const binderPath = path.join(here, "ILAU_ORIENTATION_INSTRUMENTS_BINDER_V1_2026-10-09.json");
const target = process.argv[2]
  ? path.resolve(process.argv[2])
  : path.resolve(here, "../../APP/ilau-orientation.internal.js");
const binder = JSON.parse(fs.readFileSync(binderPath, "utf8"));
const serialized = JSON.stringify(binder).replaceAll("</script", "<\\/script");
fs.writeFileSync(target, `/* Generated from the validated ILAU Orientation Instruments binder. */\nwindow.NEXAH_ILAU_ORIENTATION_INSTRUMENTS = ${serialized};\n`);
console.log(JSON.stringify({ status: "PASS", target: path.basename(target), instruments: binder.instruments.length }, null, 2));
