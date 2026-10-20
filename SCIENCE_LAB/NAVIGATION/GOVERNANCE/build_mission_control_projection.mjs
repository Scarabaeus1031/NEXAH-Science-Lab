#!/usr/bin/env node

import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const ecosystemRoot = path.resolve(here, "../../../../..");
const indexPath = path.join(here, "SOURCE_GRAPH_INDEX_V1_2026-10-10.json");
const indexBytes = fs.readFileSync(indexPath);
const index = JSON.parse(indexBytes.toString("utf8"));
const indexSha256 = crypto.createHash("sha256").update(indexBytes).digest("hex");
const outputDir = path.join(ecosystemRoot, "00 EXECUTIVE/NEXAH-Mission-Control/CURRENT");
const jsonPath = path.join(outputDir, "NAVIGATOR_SOURCE_GRAPH_CONTROL.json");
const mdPath = path.join(outputDir, "NAVIGATOR_CONTROL.md");

const projection = {
  schema: "nexah.mission-control.navigator-source-graph-control/1.0.0",
  date: index.date,
  status: "CURRENT_CONTROL_PROJECTION_READ_ONLY",
  owner: "NEXAH Science Lab",
  owning_home: index.owning_home,
  parent_constitution: index.parent_constitution,
  source_graph_index: "30 SCIENCE LAB/NEXAH-Science-Lab/SCIENCE_LAB/NAVIGATION/GOVERNANCE/SOURCE_GRAPH_INDEX_V1_2026-10-10.json",
  source_graph_index_sha256: indexSha256,
  mission_control_authority: "currentness, priority, activation, lifecycle and release",
  science_lab_authority: "research records, evidence boundaries and Navigator Source Graph custody",
  source_repositories_retain_authority: true,
  publication_authorized: false,
  duplicate_preflight_required: true,
  canonical_counts: index.canonical_counts,
  component_count: index.components.length,
  components: index.components.map(({ component_id, class: componentClass, route, ecosystem_path, sha256, changes_canonical_counts, authority }) => ({
    component_id,
    class: componentClass,
    route,
    ecosystem_path,
    sha256,
    changes_canonical_counts,
    authority
  })),
  required_cycle: ["SEARCH", "MATCH", "BIND", "BUILD", "RETURN", "GOVERN"],
  stop_conditions: [
    "UNRESOLVED_DUPLICATE_IDENTITY",
    "CANONICAL_FAMILY_OR_NORMATIVE_TERM_CHANGE",
    "RESEARCH_ACTIVATION_OR_REOPEN",
    "CLAIM_CEILING_OR_SOURCE_AUTHORITY_CHANGE",
    "PUBLICATION_OR_INTERNAL_SOURCE_EXPOSURE",
    "DESTRUCTIVE_IDENTITY_MERGE_OR_REPLACEMENT"
  ]
};

fs.writeFileSync(jsonPath, JSON.stringify(projection, null, 2) + "\n");

const rows = projection.components.map((item) => `| \`${item.component_id}\` | ${item.class} | \`${item.route}\` | ${item.changes_canonical_counts ? "base authority" : "no"} |`).join("\n");
const markdown = `# Mission Control — Navigator Control\n\n**Generated:** \`${projection.date}\`  \n**Status:** \`${projection.status}\`  \n**Owning home:** NEXAH Science Lab · \`SCIENCE_LAB/NAVIGATION\`\n\n## Control decision\n\nThe Science Navigator is the Science Lab's canonical Source and Relation Graph.\nMission Control governs currentness, priority, activation, lifecycle and release.\nOriginal repositories retain content, implementation and evidence authority.\n\nThis page is generated from the Science Lab Source Graph index. It is a control\nprojection, not a second graph and not a scientific authority.\n\n## Current graph\n\n- canonical base: **${projection.canonical_counts.base_entities} entities / ${projection.canonical_counts.base_relations} relations**;\n- admitted overlay: **+${projection.canonical_counts.admitted_overlay_entities} / +${projection.canonical_counts.admitted_overlay_relations}**;\n- composed internal view: **${projection.canonical_counts.composed_entities} / ${projection.canonical_counts.composed_relations}**;\n- governed components: **${projection.component_count}**;\n- public admission: **0**; publication authorized: **false**.\n\n## Required cycle\n\n\`SEARCH -> MATCH -> BIND -> BUILD -> RETURN -> GOVERN\`\n\nBefore new work, search the Source Graph and Mission Control Source Field. Reuse\nan existing identity where possible; prefer typed relations or a source-bound\nlens over a duplicate node, registry or database.\n\n## Components\n\n| ID | Class | Route | Changes canonical counts |\n|---|---|---|---|\n${rows}\n\n## Controlling sources\n\n- Science Lab Constitution: \`30 SCIENCE LAB/NEXAH-Science-Lab/SCIENCE_LAB/LAB_CONSTITUTION.md\`\n- Navigator Charter: \`30 SCIENCE LAB/NEXAH-Science-Lab/SCIENCE_LAB/NAVIGATION/GOVERNANCE/NAVIGATOR_CONSTITUTION_V1_2026-10-10.md\`\n- Source Graph Policy: \`30 SCIENCE LAB/NEXAH-Science-Lab/SCIENCE_LAB/NAVIGATION/GOVERNANCE/SOURCE_GRAPH_POLICY_V1_2026-10-10.md\`\n- Component index: \`${projection.source_graph_index}\`\n- Index SHA-256: \`${projection.source_graph_index_sha256}\`\n\n## Boundary\n\nNavigation is not admission, identity, scientific validation, activation or\npublication. An unresolved duplicate, missing authority, missing source or\nmissing relation boundary fails closed.\n`;
const cleanMarkdown = markdown.replace(/ {2}\n/g, "\n\n");
fs.writeFileSync(mdPath, cleanMarkdown);

console.log(JSON.stringify({ status: "PASS", json: jsonPath, markdown: mdPath, component_count: projection.component_count, source_graph_index_sha256: indexSha256 }, null, 2));
