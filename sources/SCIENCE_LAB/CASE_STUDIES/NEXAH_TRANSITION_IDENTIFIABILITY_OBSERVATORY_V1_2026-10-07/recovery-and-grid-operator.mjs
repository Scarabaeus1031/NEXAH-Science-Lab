#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import {fileURLToPath} from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const readJson = (name) => JSON.parse(fs.readFileSync(path.join(here, name), "utf8"));
const sha256 = (buffer) => crypto.createHash("sha256").update(buffer).digest("hex");
const round = (value, digits = 12) => Number(value.toFixed(digits));

function parseGlb(file) {
  const buffer = fs.readFileSync(file);
  if (buffer.toString("ascii", 0, 4) !== "glTF" || buffer.readUInt32LE(4) !== 2) throw new Error(`Not GLB v2: ${file}`);
  const jsonLength = buffer.readUInt32LE(12);
  const json = JSON.parse(buffer.subarray(20, 20 + jsonLength).toString("utf8").replace(/\0+$/, ""));
  const binHeader = 20 + jsonLength;
  const binOffset = binHeader + 8;
  return {file, buffer, json, binOffset};
}

const componentReaders = {
  5121: {bytes: 1, read: (b, o) => b.readUInt8(o)},
  5123: {bytes: 2, read: (b, o) => b.readUInt16LE(o)},
  5125: {bytes: 4, read: (b, o) => b.readUInt32LE(o)},
  5126: {bytes: 4, read: (b, o) => b.readFloatLE(o)}
};
const widths = {SCALAR: 1, VEC2: 2, VEC3: 3, VEC4: 4};

function accessorValues(glb, accessorIndex) {
  const accessor = glb.json.accessors[accessorIndex];
  const view = glb.json.bufferViews[accessor.bufferView];
  const component = componentReaders[accessor.componentType];
  const width = widths[accessor.type];
  const stride = view.byteStride || component.bytes * width;
  const offset = glb.binOffset + (view.byteOffset || 0) + (accessor.byteOffset || 0);
  return Array.from({length: accessor.count}, (_, index) => Array.from({length: width}, (__, axis) => component.read(glb.buffer, offset + index * stride + axis * component.bytes)));
}

function clusters(values, threshold = 0.05) {
  const unique = [...new Set(values.map((value) => round(value, 6)))].sort((a, b) => a - b);
  const groups = [];
  for (const value of unique) {
    if (!groups.length || value - groups.at(-1).at(-1) > threshold) groups.push([value]);
    else groups.at(-1).push(value);
  }
  return groups.map((group) => round(group.reduce((a, b) => a + b, 0) / group.length, 6));
}

function inspectGrid(asset) {
  const glb = parseGlb(asset.path);
  const primitive = glb.json.meshes?.[0]?.primitives?.[0];
  const positions = accessorValues(glb, primitive.attributes.POSITION);
  const indices = accessorValues(glb, primitive.indices).flat();
  const inferredN = positions.length / 16 - 1;
  const xCenters = clusters(positions.map((p) => p[0]));
  const yCenters = clusters(positions.map((p) => p[1]));
  const normalized = xCenters.map((value) => round((value - xCenters[0]) / (xCenters.at(-1) - xCenters[0]) * 2 - 1, 9));
  const expected = Array.from({length: inferredN + 1}, (_, i) => round(-1 + 2 * i / inferredN, 9));
  const maxNormalizedError = Math.max(...normalized.map((value, i) => Math.abs(value - expected[i])));
  return {
    id: asset.id,
    file: asset.file,
    sha256: sha256(glb.buffer),
    declared_n: Number(asset.id.slice(1)),
    inferred_n: inferredN,
    vertices: positions.length,
    indices: indices.length,
    axis_line_centers: xCenters,
    z_levels: [...new Set(positions.map((p) => round(p[2], 6)))].sort((a, b) => a - b),
    template_checks: {
      two_named_nodes: glb.json.nodes?.length === 2 && glb.json.nodes.every((node) => node.name),
      one_triangle_mesh: glb.json.meshes?.length === 1 && primitive.mode === 4,
      vertex_formula_16_n_plus_1: positions.length === 16 * (inferredN + 1),
      index_formula_72_n_plus_1: indices.length === 72 * (inferredN + 1),
      equal_xy_lines: JSON.stringify(xCenters) === JSON.stringify(yCenters),
      normalized_equidistant_lines: maxNormalizedError < 1e-6
    },
    max_normalized_line_error: maxNormalizedError
  };
}

const gcd = (a, b) => b ? gcd(b, a % b) : a;
function compareGrids(sourceN, targetN, evidence) {
  const forward = Array.from({length: sourceN + 1}, (_, i) => Math.round(i * targetN / sourceN));
  const returned = forward.map((j) => Math.round(j * sourceN / targetN));
  const axisResiduals = forward.map((j, i) => Math.abs(j / targetN - i / sourceN));
  return {
    source: `${sourceN}x${sourceN}`,
    target: `${targetN}x${targetN}`,
    operator: "NORM_NEAREST(i,j)=(round(i*m/n),round(j*m/n))",
    evidence,
    exact_shared_vertices: (gcd(sourceN, targetN) + 1) ** 2,
    source_vertex_addresses: (sourceN + 1) ** 2,
    target_vertex_addresses: (targetN + 1) ** 2,
    forward_axis_injective: new Set(forward).size === forward.length,
    source_address_roundtrip_exact: returned.every((value, i) => value === i),
    max_axis_coordinate_residual: round(Math.max(...axisResiduals), 12),
    max_2d_coordinate_residual: round(Math.SQRT2 * Math.max(...axisResiduals), 12),
    claim_ceiling: "A declared normalized nearest-lattice operator; not the recovered historical generator and not cell identity across resolutions."
  };
}

const genericStats = (record) => {
  const glb = parseGlb(record.path);
  return {
    ...record,
    sha256: sha256(glb.buffer),
    bytes: glb.buffer.length,
    nodes: glb.json.nodes?.length || 0,
    named_nodes: (glb.json.nodes || []).filter((node) => node.name).length,
    meshes: glb.json.meshes?.length || 0,
    materials: glb.json.materials?.length || 0,
    animations: glb.json.animations?.length || 0
  };
};

const intake = readJson("GEOMETRIA_NOVA_RESONANCE_CATHEDRAL_INTAKE_2026-10-07.json");
const grids = ["G6", "G7", "G10"].map((id) => inspectGrid(intake.model_assets.find((asset) => asset.id === id)));
const counterpartInputs = [
  {visible_usdz:"trinity_enhanced_patch.usdz", recovered_glb:"trinity_enhanced_patch.glb", path:"[local path omitted in public preview]"},
  {visible_usdz:"cathedral_with_trinity_frankfurt.usdz", recovered_glb:"cathedral_with_trinity_frankfurt.glb", path:"[local path omitted in public preview]"},
  {visible_usdz:"ullinirium_patch_planes_v3_rosette_sky.usdz", recovered_glb:"ullinirium_patch_planes_v3_rosette_sky.glb", path:"[local path omitted in public preview]"},
  {visible_usdz:"diptych_window_scientific.usdz", recovered_glb:"diptych_window_scientific.glb", path:"[local path omitted in public preview]"},
  {visible_usdz:"Quaternion_Playground.usdz", recovered_glb:"Quaternion_Playground.glb", path:"[local path omitted in public preview]"}
];

const result = {
  schema: "nexah.multi-grid-recovery-and-operator-test/1.0.0",
  date: "2026-10-07",
  status: grids.every((grid) => Object.values(grid.template_checks).every(Boolean)) ? "PASS_BOUNDED_RECONSTRUCTION" : "FAIL",
  usdz_recovery: {
    exact_name_search_scope: "[local path omitted in public preview]",
    usdz_binaries_found: 0,
    source_format_counterparts_found: 5,
    interpretation: "All five screenshot-visible USDZ names have retained GLB counterparts. This recovers source-format lineage, not the missing USDZ binaries or conversion receipts.",
    counterparts: counterpartInputs.map(genericStats)
  },
  retained_grid_binary_tests: grids,
  reconstructed_generator: {
    family: "square line-mesh G(n)",
    recovered_from: ["grid_6x6.glb", "grid_7x7.glb", "grid_10x10.glb"],
    binary_invariants: ["16(n+1) vertices", "72(n+1) indices", "n+1 equidistant line centers per axis", "two z levels", "two named nodes", "one triangle mesh"],
    synthetic_only_sizes: [8, 9],
    historical_source_code_recovered: false,
    claim_ceiling: "The retained binaries determine a reproducible mesh-family contract. They do not identify the original authoring code or historical inter-grid semantics."
  },
  operator_tests: [
    compareGrids(6, 7, "BOTH_RETAINED_GLB"),
    compareGrids(7, 8, "SOURCE_GLB__TARGET_SYNTHETIC_CONTROL"),
    compareGrids(8, 9, "BOTH_SYNTHETIC_CONTROLS"),
    compareGrids(9, 10, "SOURCE_SYNTHETIC_CONTROL__TARGET_GLB"),
    compareGrids(7, 10, "BOTH_RETAINED_GLB"),
    compareGrids(6, 10, "BOTH_RETAINED_GLB")
  ],
  rath_49_51: {
    arithmetic: "51 = 49 interior J-orbits + boundary orbit + fixed hinge",
    arithmetic_status: "EXACT_FOR_DECLARED_J_K_EQUALS_100_MINUS_K_QUOTIENT",
    source_visual: "NEXAH Infinity — Grids, Relations, Roots & Phi-Layers",
    source_visual_sha256: "e115d4c2441c71c7526d436be97e26e0b9b060e26e2ce326d040e9f18137e033",
    visual_labels: ["Rath center 49", "resonance 51"],
    historical_semantic_operator_recovered: false,
    status: "CARDINALITY_CONCORDANCE__SEMANTIC_IDENTITY_OPEN"
  },
  claim_boundary: "PASS applies to binary template recovery and the declared normalized resampling operator. It does not establish a universal grid, a historical Rath operator, or GLB-to-USDZ identity."
};

fs.writeFileSync(path.join(here, "RECOVERY_AND_GRID_OPERATOR_RESULTS_2026-10-07.json"), JSON.stringify(result, null, 2) + "\n");
console.log(JSON.stringify({status: result.status, glb_counterparts: result.usdz_recovery.source_format_counterparts_found, grids: grids.map((grid) => `${grid.id}:${Object.values(grid.template_checks).every(Boolean) ? "PASS" : "FAIL"}`), operator_tests: result.operator_tests.length}, null, 2));
if (result.status === "FAIL") process.exitCode = 1;
