#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const read = (name) => fs.readFileSync(path.join(here, name), "utf8");
const html = read("index.html");
const css = read("styles.css");
const js = read("app.js");
const data = read("data.internal.js");
const lineageData = read("lineage.internal.js");
const utgData = read("utg.internal.js");
const context = { window: {} };
vm.runInNewContext(data, context);
const manifest = context.window.NEXAH_NAVIGATOR_MANIFEST;
const admission = context.window.NEXAH_NAVIGATOR_ADMISSION;
const release = context.window.NEXAH_NAVIGATOR_RELEASE;

const checks = [
  ["internal profile", manifest?.profile === "internal"],
  ["140 entities", manifest?.entities?.length === 140],
  ["14 typed relations", manifest?.relations?.length === 14],
  ["no public authorization", release?.publication_authorized === false && release?.public_entity_count === 0],
  ["140 fail-closed admission records", admission?.rejected?.length === 140 && admission?.reason_summary?.NO_PUBLIC_ALLOWLIST === 140],
  ["semantic main", /<main\b/.test(html)],
  ["semantic navigation", /<nav\b/.test(html)],
  ["skip link", /skip-link/.test(html)],
  ["internal status label", /Internal \/ not public/i.test(html)],
  ["persistent claim boundary", /Persistent boundary/.test(html)],
  ["search control", /type="search"/.test(js)],
  ["role filters", /name=\"role\"/.test(js)],
  ["typed relations view", /renderRelations/.test(js)],
  ["evidence pair", /Package-local verdict/.test(js) && /Current interpretation/.test(js)],
  ["source receipt", /Source receipt/.test(js)],
  ["local path safety guard", /safeLocalHref/.test(js) && /\.includes\("\.\."\)/.test(js)],
  ["deep-link routes", /hashchange/.test(js) && /#entity=/.test(js)],
  ["relation deep links", /#relation=/.test(js) && /renderRelation/.test(js)],
  ["public admission inspector", /renderAdmission/.test(js) && /NO_PUBLIC_ALLOWLIST/.test(js)],
  ["primary instrument action", /Open primary instrument/.test(js)],
  ["surface direct HTML action", /Open HTML/.test(js) && /renderSurfaceLink/.test(js)],
  ["instrument and record labels distinct", /Open HTML instrument/.test(js) && /Open controlling record/.test(js)],
  ["clickable system atlas", /renderAtlas/.test(js) && /system-map/.test(css)],
  ["full family map launch", /Open full Family Connection Map/.test(js)],
  ["atlas module and master links", /atlas-node-title/.test(js) && /Open master/.test(js)],
  ["directed sequence view", /renderSequence/.test(js) && /sequence-flow/.test(css)],
  ["prime bridge lineage data", /NEXAH_LINEAGE_BINDER/.test(html + js + data) && /lineage\.internal\.js/.test(html)],
  ["lineage route and visual register", /renderLineage/.test(js) && /lineage-gallery/.test(css) && /Owner-supplied visual register/.test(js)],
  ["UTG binder wired", /NEXAH_UTG_BINDER/.test(html + js + utgData) && /utg\.internal\.js/.test(html)],
  ["UTG route and mission", /renderUTG/.test(js) && /Mission statement/.test(js) && /Unified Transition Geometry/.test(utgData)],
  ["UTG maturity boundary", /Framework is not validation/.test(js) && /NOT ESTABLISHED FOR UTG AS A WHOLE/.test(utgData)],
  ["UTG media constellations", /Media constellation model/.test(js) && /CONST:UTG:FORMAL_CANDIDATES/.test(utgData)],
  ["interactive entry family map", /renderEntryFamilyMap/.test(js) && /Interactive orientation map/.test(js) && /entry-map-grid/.test(css)],
  ["canonical and candidate family separation", /No canonical F8 or F9 is currently registered/.test(js) && /CAND:F8/.test(js) && /HL:F8/.test(js)],
  ["first UTG formal candidate", /Aperture is not automatically a transition gate/.test(js) && /UTG:FORMAL:APERTURE_TRANSITION:V0\.1/.test(utgData)],
  ["UTG mathematical glossary link", /Open mathematical glossary/.test(js) && /11_MATHEMATICAL_FOUNDATIONS_GLOSSARY\.md/.test(utgData)],
  ["typed 2-3 and 8.8 distinction", /8×8 is not 8\|8/.test(js) && /v8\.8 or PG88/.test(js)],
  ["3187 and PG88 boundaries", /3187/.test(lineageData) && /Census only · path missing/.test(js)],
  ["functional-first naming", /FUNCTIONAL_NAMES/.test(js) && /Naming rule/.test(js)],
  ["retained native aliases", /native-alias/.test(js) && /ERITH · Tessarec/.test(js)],
  ["canonical CF family names", /Observation \/ Record/.test(js) && /Synchronization \/ Control/.test(js) && /Validation \/ Governance/.test(js)],
  ["CF and HL namespace guard", /HTML_SHELF_NAMES/.test(js) && /namespace-guard/.test(css)],
  ["candidate F8 distinct from HL F8", /CAND:F8_AXIS_EXTENSION ≠ HL:F8/.test(js) && /Human Instruments \/ Games \/ Cultural Orientation/.test(js)],
  ["sender receiver remains owner model", /CF:F4 sender · CF:F5 axis carrier · CF:F6 receiver/.test(js) && /OWNER MODEL \+ OPEN_BRIDGE/.test(js)],
  ["carrier non-identity boundary", /Q4 has 16 sign states/.test(js) && /E8 has a registered 240-root carrier/.test(js) && /P6R01/.test(js)],
  ["open F6 boundary", /F4→F6 and F5→F6 remain OPEN_BRIDGE/.test(js)],
  ["responsive layout", /@media \(max-width:/.test(css)],
  ["reduced motion", /prefers-reduced-motion/.test(css)],
  ["visible keyboard focus", /:focus-visible/.test(css)],
  ["no remote runtime dependency", !/(https?:\/\/|cdn\.|unpkg|jsdelivr)/i.test(html)],
  ["no public manifest wired", !/navigator\.public\.json|data\.public\.js/.test(html + js)]
];

const failed = checks.filter(([, ok]) => !ok).map(([name]) => name);
const result = { status: failed.length ? "FAIL" : "PASS", checks: checks.length, passed: checks.length - failed.length, failed };
console.log(JSON.stringify(result, null, 2));
if (failed.length) process.exitCode = 1;
