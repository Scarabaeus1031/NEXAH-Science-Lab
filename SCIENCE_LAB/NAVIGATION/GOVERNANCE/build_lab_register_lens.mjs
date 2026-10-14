#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const scienceLab = path.resolve(here, "../..");
const sourcePath = path.join(scienceLab, "LAB_REGISTER.md");
const outputPath = path.resolve(here, "../APP/lab-register.internal.js");
const source = fs.readFileSync(sourcePath, "utf8");

function cells(line) {
  return line.slice(1, -1).split("|").map((cell) => cell.trim());
}

function plain(value) {
  return value
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function firstLink(value) {
  const match = value.match(/\[([^\]]+)\]\(([^)]+)\)/);
  return match ? { label: match[1], path: match[2] } : null;
}

const rows = source.split(/\r?\n/)
  .filter((line) => /^\|\s*`[^`]+`\s*\|/.test(line))
  .map(cells)
  .filter((row) => row.length === 8)
  .map((row) => ({
    study_id: plain(row[0]),
    question: plain(row[1]),
    owner: plain(row[2]),
    native_state: plain(row[3]),
    common_status: plain(row[4]),
    evidence_summary: plain(row[5]),
    primary_record: firstLink(row[6]),
    primary_records_text: plain(row[6]),
    next_action: plain(row[7])
  }));

if (rows.length < 10) {
  throw new Error(`LAB_REGISTER parse returned only ${rows.length} rows`);
}

const payload = {
  schema: "nexah.science-lab.lab-register-lens/1.0.0",
  status: "INTERNAL_READ_ONLY_SOURCE_BOUND_LENS",
  generated: new Date().toISOString(),
  source: "SCIENCE_LAB/LAB_REGISTER.md",
  source_sha256: crypto.createHash("sha256").update(source).digest("hex"),
  authority: "LAB_REGISTER retains identity, lifecycle and disposition authority; this lens is read-only.",
  study_count: rows.length,
  studies: rows
};

const content = `window.NEXAH_LAB_REGISTER = ${JSON.stringify(payload, null, 2)};\n`;
fs.writeFileSync(outputPath, content);
console.log(`LAB REGISTER LENS PASS · ${rows.length} studies · ${outputPath}`);
