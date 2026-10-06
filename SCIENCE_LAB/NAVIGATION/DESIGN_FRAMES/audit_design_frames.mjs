#!/usr/bin/env node

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const html = readFileSync(join(here, "NEXAH_NAVIGATOR_DESIGN_FRAMES_V1_2026-10-06.html"), "utf8");

const checks = [
  ["document language", /<html\s+lang="en"/],
  ["responsive viewport", /name="viewport"/],
  ["skip link", /class="skip"\s+href="#frame-public"/],
  ["main landmark", /<main>/],
  ["three named frames", /id="frame-public"[\s\S]*id="frame-relation"[\s\S]*id="frame-internal"/],
  ["visible keyboard focus", /:focus-visible/],
  ["reduced motion", /prefers-reduced-motion:\s*reduce/],
  ["mobile breakpoint", /@media\s*\(max-width:\s*620px\)/],
  ["relation text equivalent", /aria-label="Relation path from Dual Belt to Tessarec Packaging"/],
  ["persistent claim boundary", /id="claim-boundary-title"/],
  ["negative evidence text", />NO_SUPPORT</],
  ["release warning", /Design frame · not a release/i],
  ["internal admission stop", />NOT ADMITTED TO PUBLIC BUILD</]
];

const failures = checks.filter(([, pattern]) => !pattern.test(html)).map(([name]) => name);
if (/href="(?:file:|\/Users\/)/i.test(html)) failures.push("local path exposed in link");

const publicFrame = html.match(/<section class="frame" id="frame-public"[\s\S]*?<\/section>/)?.[0] ?? "";
if (/href="#frame-internal"/.test(publicFrame)) failures.push("public frame links directly to internal inspector");

console.log(JSON.stringify({
  status: failures.length === 0 ? "PASS" : "FAIL",
  checks: checks.length + 2,
  failures
}, null, 2));
process.exitCode = failures.length === 0 ? 0 : 1;
