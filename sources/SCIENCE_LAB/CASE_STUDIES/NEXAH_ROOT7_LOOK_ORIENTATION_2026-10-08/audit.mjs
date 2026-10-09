#!/usr/bin/env node

import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const labRoot = path.resolve(here, "../../..");
const binding = JSON.parse(fs.readFileSync(path.join(here, "SOURCE_BINDING.json"), "utf8"));
const html = fs.readFileSync(path.join(here, "index.html"), "utf8");
const digest = (file) => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");

const checks = binding.sources.map((source) => {
  const absolute = path.resolve(labRoot, source.path);
  return {
    check: `source:${source.role}`,
    pass: fs.existsSync(absolute) && digest(absolute) === source.sha256,
    path: source.path
  };
});

checks.push(
  { check: "status:no-reopen", pass: binding.reopens_root7_closeout === false && /NO_REOPEN/.test(html) },
  { check: "exact:q3-q4", pass: /2<sup>3<\/sup> = 8/.test(html) && /2<sup>4<\/sup> = 16/.test(html) },
  { check: "exact:root7", pass: /2² \+ 1² \+ 1² \+ 1² = 7/.test(html) && /√7/.test(html) },
  { check: "decision:negative-gates", pass: Object.values(binding.decisions).every((value) => html.includes(value)) },
  { check: "two-source-html-links", pass: /NEXAH_TESSERACT_ROOT_SPACE_8_TO_16\.html/.test(html) && /NEXAH_Root7_Tesseract_Bridge%20copy%202\.html/.test(html) },
  { check: "no-remote-runtime", pass: !/(src|href)=["']https?:\/\//i.test(html) }
);

const failed = checks.filter((item) => !item.pass);
const result = { status: failed.length ? "FAIL" : "PASS", record_id: binding.record_id, checks: checks.length, failed };
console.log(JSON.stringify(result, null, 2));
if (failed.length) process.exitCode = 1;
