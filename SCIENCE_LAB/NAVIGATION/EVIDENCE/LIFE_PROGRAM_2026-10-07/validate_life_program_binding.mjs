#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const repo = path.resolve(here, "../../../..");
const source = path.join(repo, "SCIENCE_LAB/CASE_STUDIES/NEXAH_LIFE_PROGRAM_CONSOLIDATION_2026-10-07/LIFE_PROGRAM_REGISTER.json");
const register = JSON.parse(fs.readFileSync(source, "utf8"));
const checks = [];
const check = (name, value) => checks.push({ name, pass: Boolean(value) });
const recordIds = new Set(register.records.map((record) => record.id));
const htmlRecords = register.records.filter((record) => record.html_path);
const dedicated = htmlRecords.filter((record) => record.delivery_kind !== "navigator_host_surface");

check("authoritative schema", register.schema === "nexah.life-program-register/1.0.0");
check("five program lines", register.program_lines.length === 5);
check("twenty-one unique records", register.records.length === 21 && recordIds.size === 21);
check("nineteen dedicated HTML apps", dedicated.length === 19 && register.counts.dedicated_html_apps === 19);
check("twenty HTML surfaces total", htmlRecords.length === 20 && register.counts.html_surfaces_total === 20);
check("one non-HTML kernel", register.records.filter((record) => !record.html_path).length === 1 && register.counts.non_html_engine_packages === 1);
check("all line records resolve", register.program_lines.every((line) => line.sequence.every((id) => recordIds.has(id))));
check("all HTML paths resolve", htmlRecords.every((record) => fs.existsSync(path.join(repo, record.html_path))));
check("all readmes resolve", register.records.every((record) => fs.existsSync(path.join(repo, record.readme))));
check("all validations resolve", register.records.every((record) => fs.existsSync(path.join(repo, record.validation))));
check("all claim ceilings present", register.records.every((record) => record.claim_ceiling?.length > 20));
check("negative stages retained", ["LIFE04_PROJECTION_BENCHMARK", "LIFE04B_ANTIPODAL_RESIDUAL_RETURN", "LIFE06C_PRIME_COMPOSITE_WINDOW_BENCHMARK"].every((id) => /NEGATIVE/.test(register.records.find((record) => record.id === id)?.status || "")));
check("global no-promotion ceiling", /No biological-life/.test(register.global_claim_ceiling) && /public release/.test(register.global_claim_ceiling));

const failed = checks.filter((item) => !item.pass);
const result = { status: failed.length ? "FAIL" : "PASS", checks: checks.length, passed: checks.length - failed.length, failed: failed.map((item) => item.name) };
console.log(JSON.stringify(result, null, 2));
if (failed.length) process.exitCode = 1;
