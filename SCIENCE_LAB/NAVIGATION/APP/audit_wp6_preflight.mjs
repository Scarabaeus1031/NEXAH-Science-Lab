#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const manifest = JSON.parse(fs.readFileSync(path.resolve(here, "../BUILD/registry-dist/navigator.internal.json"), "utf8"));
const admission = JSON.parse(fs.readFileSync(path.resolve(here, "../BUILD/registry-dist/rejected-public-items.json"), "utf8"));
const publicManifest = JSON.parse(fs.readFileSync(path.resolve(here, "../BUILD/registry-dist/navigator.public.json"), "utf8"));
const entities = new Map(manifest.entities.map((entity) => [entity.entity_id, entity]));
const relations = new Map(manifest.relations.map((relation) => [relation.relation_id, relation]));

const task1 = entities.get("ART:TESSAREC:Q_IOTA_PEARL");
const task2 = relations.get("REL:EVIDENCE:Q7_TO_Q11");
const task3Source = entities.get("EVID:PJ:TEST08");
const task3Target = entities.get("EVID:POLAR_LOD:CURRENT");
const task3Relation = relations.get("REL:EVIDENCE:PJ08_TO_POLAR_LOD");
const task4 = entities.get("MOD:TESSAREC");
const task4Surfaces = manifest.entities.filter((entity) => entity.attributes?.module_id === "MOD:TESSAREC");

const tasks = [
  {
    task: 1,
    label: "artifact source, module, role and claim ceiling",
    pass: Boolean(task1?.internal?.local_path && task1?.attributes?.module_id && task1?.attributes?.assessment?.representation_role && task1?.claim_ceiling),
    answer: task1 ? { entity: task1.entity_id, source: task1.internal.local_path, module: task1.attributes.module_id, role: task1.attributes.assessment.representation_role, claim_ceiling: task1.claim_ceiling } : null
  },
  {
    task: 2,
    label: "Q7 to Q11/Tessarec relation and non-transfer boundary",
    pass: Boolean(task2?.source_id === "EVID:PJ:TEST05_Q7" && task2?.target_id === "EVID:PJ:Q11_TESSAREC" && task2?.does_not_imply?.length),
    answer: task2 ? { relation: task2.relation_type, explanation: task2.explanation, does_not_imply: task2.does_not_imply } : null
  },
  {
    task: 3,
    label: "historical PASS versus current interpretation",
    pass: Boolean(task3Source?.attributes?.local_verdict?.includes("PASS") && task3Source?.attributes?.current_interpretation && task3Target?.attributes?.local_verdict?.includes("NO_RESULT") && task3Relation?.relation_type === "historical-predecessor"),
    answer: task3Source && task3Target ? { historical_verdict: task3Source.attributes.local_verdict, current_interpretation: task3Source.attributes.current_interpretation, current_study: task3Target.attributes.local_verdict } : null
  },
  {
    task: 4,
    label: "alternate module views and current master",
    pass: Boolean(task4?.attributes?.current_master_surface && task4Surfaces.length >= 2 && task4Surfaces.some((surface) => surface.entity_id === task4.attributes.current_master_surface)),
    answer: task4 ? { module: task4.entity_id, master: task4.attributes.current_master_surface, surface_count: task4Surfaces.length } : null
  },
  {
    task: 5,
    label: "public admission decision and missing gate",
    pass: Boolean(publicManifest.publication_authorized === false && publicManifest.entities.length === 0 && admission.rejected?.length === manifest.entities.length && admission.reason_summary?.NO_PUBLIC_ALLOWLIST === manifest.entities.length),
    answer: { safe_now: publicManifest.entities.length, rejected: admission.rejected.length, missing_gate: "NO_PUBLIC_ALLOWLIST", publication_authorized: publicManifest.publication_authorized }
  }
];

const passed = tasks.filter((task) => task.pass).length;
const result = {
  status: passed === tasks.length ? "PASS_AS_PREFLIGHT" : "FAIL",
  scope: "machine-readable answerability check; not a human utility result",
  tasks_passed: passed,
  tasks_total: tasks.length,
  answerability_score: `${passed * 2}/${tasks.length * 2}`,
  tasks
};
console.log(JSON.stringify(result, null, 2));
if (passed !== tasks.length) process.exitCode = 1;
