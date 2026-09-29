#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const HERE = __dirname;
const REPO = path.resolve(HERE, '../../..');
const ECOSYSTEM = path.resolve(REPO, '../..');
const ELEVATOR = path.join(REPO, '00_INCOMING', 'THE_PRIME_GENESIS_CRT_ELEVATOR_QRT_FORMAT_LENS_GATE_01_2026-09-08');
const SOURCE_RESULT = path.join(HERE, 'h_q_piq_mask_compatibility_01_results.json');
const PREREG = path.join(HERE, '32_H_Q_FORMAT_ELEVATOR_INVARIANCE_01_PREREGISTRATION.md');
const OUT = path.join(HERE, 'h_q_format_elevator_invariance_01_results.json');

const SOURCES = {
  h_q_result: [SOURCE_RESULT, '226f3aace443b0ffff74dc58b45d7aa9e01ef2bb854fd2fc6168acf6949590bc'],
  double_cut_model: [path.join(ECOSYSTEM, '00 EXECUTIVE', 'NEXAH-Mission-Control', 'ROEDELHEIM_OBSERVATORY_BUNDLE', 'ROEDELHEIM_OBSERVATORY_DOUBLE_CUT_MODEL_0_2.js'), '35c49ac53760c0df79411822568f924e86b6bf697f2041690a04d705ab623849'],
  format_spec: [path.join(ELEVATOR, '07_FORMAT_LENS_SPECIFICATION.md'), '192f372b9184a01558dc37214b707c14f10b0f358b6fe4ffceb8abd24ae26372'],
  format_decision: [path.join(ELEVATOR, 'FINAL_DECISION.md'), '9a45b51b4bf06cb2a6efe7c1f7eb1ee400c9da64d57d62fbd69ba0c79fadac1f'],
  format_lenses: [path.join(ELEVATOR, 'data', 'format_lenses.json'), 'da59993eb45c2b70e6e2439038698c9877fdf284d984e99da9e293b346c826ac'],
  format_runner: [path.join(ELEVATOR, 'scripts', 'run_gate.py'), '8e318df1e68058e34a55f1cb20deaa436253c24b40a8d85867fed2254b378f77'],
  format_validation: [path.join(ELEVATOR, 'data', 'validation_report.json'), '898ac6023f1509f52ea1e05cb5a93b0aa701d3934279364b92ea158953339d40']
};

const sha256 = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const close = (a, b, tol = 1e-9) => Math.abs(a - b) <= tol;
const round = (v, n = 12) => Number(v.toFixed(n));

function split3(value) {
  const fixed = value.toFixed(3);
  const [whole, fraction] = fixed.split('.');
  return { fixed, integer_part: Number(whole), fractional_integer: Number(fraction), difference: Number(fraction) - Number(whole) };
}

function convexHull(points) {
  const sorted = points.map(p => [p.x, p.y]).sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cross = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lower = [];
  for (const p of sorted) { while (lower.length >= 2 && cross(lower.at(-2), lower.at(-1), p) <= 0) lower.pop(); lower.push(p); }
  const upper = [];
  for (const p of [...sorted].reverse()) { while (upper.length >= 2 && cross(upper.at(-2), upper.at(-1), p) <= 0) upper.pop(); upper.push(p); }
  return lower.slice(0, -1).concat(upper.slice(0, -1));
}

function area(poly) {
  let sum = 0;
  for (let i = 0; i < poly.length; i++) {
    const [x1, y1] = poly[i], [x2, y2] = poly[(i + 1) % poly.length];
    sum += x1 * y2 - x2 * y1;
  }
  return Math.abs(sum) / 2;
}

function rankedPairs(points) {
  const pairs = [];
  for (let i = 0; i < points.length; i++) for (let j = i + 1; j < points.length; j++) {
    pairs.push({ pair: `${points[i].gate_hour}-${points[j].gate_hour}`, distance: Math.hypot(points[i].x - points[j].x, points[i].y - points[j].y) });
  }
  pairs.sort((a, b) => a.distance - b.distance || a.pair.localeCompare(b.pair));
  return pairs.map((p, i) => ({ ...p, rank: i + 1 }));
}

function run() {
  const hashChecks = Object.fromEntries(Object.entries(SOURCES).map(([key, [p, expected]]) => {
    const actual = sha256(p);
    return [key, { expected, actual, pass: actual === expected }];
  }));
  const input = JSON.parse(fs.readFileSync(SOURCE_RESULT, 'utf8'));
  const formats = JSON.parse(fs.readFileSync(SOURCES.format_lenses[0], 'utf8')).formats;
  const points = input.projection_records;
  const sourceWidth = 664, sourceHeight = 226;
  const sourceHullArea = area(convexHull(points));
  const sourceRanks = rankedPairs(points);
  const sourceRankMap = Object.fromEntries(sourceRanks.map(p => [p.pair, p.rank]));
  const source42 = points.find(p => p.gate_hour === 42);
  const sourceSplit = split3(source42.y);
  const sourceYOrder = [...points].sort((a, b) => a.y - b.y).map(p => p.gate_hour);

  const views = formats.map(f => {
    const width = f.long_mm, height = f.short_mm;
    const scale = Math.min(width / sourceWidth, height / sourceHeight);
    const offsetX = (width - sourceWidth * scale) / 2;
    const offsetY = (height - sourceHeight * scale) / 2;
    const maskLeft = offsetX + scale * points[0].mask_left;
    const maskRight = offsetX + scale * points[0].mask_right;
    const boundaryTol = 0.75 * scale;
    const transformed = points.map(p => {
      const x = offsetX + scale * p.x, y = offsetY + scale * p.y;
      const zone = x > maskLeft + boundaryTol && x < maskRight - boundaryTol ? 'inside' :
        (Math.abs(x - maskLeft) <= boundaryTol || Math.abs(x - maskRight) <= boundaryTol ? 'boundary' : 'outside');
      return {
        gate_hour: p.gate_hour, x_mm: round(x), y_mm: round(y), zone,
        class_full_trace: p.class_full_trace, class_no_trace: p.class_no_trace,
        source_clock_ids: p.source_clock_ids, source_cell_keys: p.source_cell_keys,
        inverse_error_x_px: Math.abs((x - offsetX) / scale - p.x),
        inverse_error_y_px: Math.abs((y - offsetY) / scale - p.y)
      };
    });
    const transformedForGeometry = transformed.map(p => ({ gate_hour: p.gate_hour, x: p.x_mm, y: p.y_mm }));
    const ranks = rankedPairs(transformedForGeometry);
    const rankMap = Object.fromEntries(ranks.map(p => [p.pair, p.rank]));
    const point42 = transformed.find(p => p.gate_hour === 42);
    const split = split3(point42.y_mm);
    const hullArea = area(convexHull(transformedForGeometry));
    const maxInverseError = Math.max(...transformed.flatMap(p => [p.inverse_error_x_px, p.inverse_error_y_px]));
    const normalizedErrors = transformed.flatMap((p, i) => [
      Math.abs(((p.x_mm - offsetX) / (scale * sourceWidth)) - points[i].x / sourceWidth),
      Math.abs(((p.y_mm - offsetY) / (scale * sourceHeight)) - points[i].y / sourceHeight)
    ]);
    return {
      format: f.format, family: f.family, target_landscape_mm: [width, height], format_area_mm2: f.normalized_area,
      scale_mm_per_px: scale, offset_mm: [offsetX, offsetY], fit_content_mm: [sourceWidth * scale, sourceHeight * scale],
      all_points_inside_frame: transformed.every(p => p.x_mm >= -1e-9 && p.x_mm <= width + 1e-9 && p.y_mm >= -1e-9 && p.y_mm <= height + 1e-9),
      zone_counts: { inside: transformed.filter(p => p.zone === 'inside').length, outside: transformed.filter(p => p.zone === 'outside').length, boundary: transformed.filter(p => p.zone === 'boundary').length },
      y_order: [...transformed].sort((a, b) => a.y_mm - b.y_mm).map(p => p.gate_hour),
      chord_9_42_rank: rankMap['9-42'], all_pair_ranks_preserved: Object.keys(sourceRankMap).every(k => sourceRankMap[k] === rankMap[k]),
      hull_area_mm2: hullArea, hull_area_fraction_of_sheet: hullArea / (width * height), hull_scaling_error: Math.abs(hullArea - sourceHullArea * scale * scale),
      max_inverse_error_px: maxInverseError, max_normalized_error: Math.max(...normalizedErrors),
      gate_42_y_mm: point42.y_mm, gate_42_split3: split,
      transformed_records: transformed
    };
  });

  const checks = {
    frozen_hashes_match: Object.values(hashChecks).every(v => v.pass),
    sixteen_fit_lenses: formats.length === 16 && formats.every(f => f.operators.includes('FIT')),
    provenance_retained: views.every(v => v.transformed_records.every(p => p.source_clock_ids.length === 5 && p.source_cell_keys.length === 5)),
    inverse_fit_reconstructs: views.every(v => v.max_inverse_error_px <= 1e-9),
    mask_split_preserved: views.every(v => v.zone_counts.inside === 2 && v.zone_counts.outside === 6 && v.zone_counts.boundary === 0),
    classes_preserved: views.every(v => v.transformed_records.every(p => {
      const src = points.find(q => q.gate_hour === p.gate_hour);
      return p.class_full_trace === src.class_full_trace && p.class_no_trace === src.class_no_trace;
    })),
    no_crop: views.every(v => v.all_points_inside_frame),
    y_order_and_minimum_preserved: views.every(v => JSON.stringify(v.y_order) === JSON.stringify(sourceYOrder) && v.y_order[0] === 42),
    pair_ranks_preserved: views.every(v => v.all_pair_ranks_preserved && v.chord_9_42_rank === sourceRankMap['9-42']),
    hull_scaling_preserved: views.every(v => v.hull_scaling_error <= 1e-8),
    normalized_positions_preserved: views.every(v => v.max_normalized_error <= 1e-9),
    digit_split_evaluated: views.length === 16 && views.every(v => Number.isFinite(v.gate_42_split3.difference))
  };
  const technicalPass = Object.entries(checks).filter(([k]) => k !== 'digit_split_evaluated').every(([, v]) => v) && checks.digit_split_evaluated;
  const split220Formats = views.filter(v => v.gate_42_split3.difference === 220).map(v => v.format);
  const allPersist = split220Formats.length === views.length;
  const classification = !technicalPass ? 'FAIL_FORMAT_ELEVATOR_INVARIANCE' : allPersist ?
    'PASS_FORMAT_ELEVATOR_INVARIANCE__137_357_SPLIT_PERSISTS_ALL_FORMATS' :
    'PASS_FORMAT_ELEVATOR_INVARIANCE__137_357_SPLIT_VIEW_DEPENDENT';

  const result = {
    classification,
    preregistration_sha256: sha256(PREREG),
    frozen_source_hashes: hashChecks,
    source_frame: { width_px: sourceWidth, height_px: sourceHeight, source_hull_area_px2: sourceHullArea },
    source_diagnostics: { gate_42_y_px: source42.y, gate_42_split3: sourceSplit, y_order: sourceYOrder, chord_9_42_rank: sourceRankMap['9-42'], pair_count: sourceRanks.length },
    checks, checks_passed: Object.values(checks).filter(Boolean).length, checks_total: Object.keys(checks).length,
    split_220_formats: split220Formats, split_220_format_count: split220Formats.length,
    view_summary: views.map(v => ({
      format: v.format, family: v.family, target_landscape_mm: v.target_landscape_mm, scale_mm_per_px: v.scale_mm_per_px,
      offset_mm: v.offset_mm, gate_42_y_mm: v.gate_42_y_mm, gate_42_split3: v.gate_42_split3,
      hull_area_fraction_of_sheet: v.hull_area_fraction_of_sheet, y_min_gate: v.y_order[0], chord_9_42_rank: v.chord_9_42_rank,
      zone_counts: v.zone_counts, max_inverse_error_px: v.max_inverse_error_px
    })),
    views,
    interpretation: {
      invariant: ['gate identity', 'source provenance', 'normalized position', 'mask zone', 'trace class', 'y-order', 'pair-distance rank', 'convex-hull geometry up to uniform scale'],
      view_dependent: ['raw x/y coordinate', 'physical surface area', 'margin', 'absolute pair distance', 'three-decimal digit split'],
      note: 'Every FIT surface displays all eight H gates. FIT changes the view, not the frozen carrier record.'
    },
    claim_boundary: 'Representation invariance only; no CRT-carrier arithmetic, generator, SCN/NCS292/404, E8/H4, astronomy, physics or re-feed claim.'
  };
  fs.writeFileSync(OUT, JSON.stringify(result, null, 2) + '\n');
  process.stdout.write(JSON.stringify({ classification, checks: `${result.checks_passed}/${result.checks_total}`, split_220_formats: split220Formats, output: OUT }, null, 2) + '\n');
}

run();
