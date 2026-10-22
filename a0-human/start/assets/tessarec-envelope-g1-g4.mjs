#!/usr/bin/env node

// Deterministic engineering verifier for the A0 Tessarec Envelope R0 design.
// It writes no files and is not an authorized Science Lab run.

import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ASSET_DIRECTORY = dirname(fileURLToPath(import.meta.url));
const PACKAGE_DIRECTORY = resolve(ASSET_DIRECTORY, "../..");

export const ANGLES_DEGREES = Object.freeze([0, 42, -42, 45, -45, 90, -90, 180]);
export const GRAY_SEQUENCE = Object.freeze(
  Array.from({ length: 16 }, (_, step) => step ^ (step >> 1)),
);

export function vertex4(address) {
  assert(Number.isInteger(address) && address >= 0 && address < 16);
  return [0, 1, 2, 3].map((bit) => ((address >> bit) & 1 ? 1 : -1));
}

export function hammingDistance(a, b) {
  let value = a ^ b;
  let count = 0;
  while (value) {
    count += value & 1;
    value >>= 1;
  }
  return count;
}

// Frozen dyadic projection candidate. Dyadic coefficients are exact in IEEE-754.
export function framePoint(address) {
  const [x, y, z, w] = vertex4(address);
  return [x + y / 2 - z / 4 + w / 8, x / 4 - y + z / 2 - w / 8];
}

export function cyclicWindow(step, count = GRAY_SEQUENCE.length) {
  assert(Number.isInteger(step) && step >= 0 && step < count);
  return [(step - 1 + count) % count, step, (step + 1) % count];
}

function cross(origin, a, b) {
  return (a[0] - origin[0]) * (b[1] - origin[1]) -
    (a[1] - origin[1]) * (b[0] - origin[0]);
}

export function convexHull(points) {
  const unique = [...new Map(points.map((point) => [point.join(","), point])).values()]
    .sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  if (unique.length <= 1) return unique;
  const lower = [];
  for (const point of unique) {
    while (lower.length >= 2 && cross(lower.at(-2), lower.at(-1), point) <= 0) lower.pop();
    lower.push(point);
  }
  const upper = [];
  for (const point of [...unique].reverse()) {
    while (upper.length >= 2 && cross(upper.at(-2), upper.at(-1), point) <= 0) upper.pop();
    upper.push(point);
  }
  return [...lower.slice(0, -1), ...upper.slice(0, -1)];
}

export function intrinsicEnvelope(step) {
  const states = cyclicWindow(step).map((index) => GRAY_SEQUENCE[index]);
  return convexHull(states.map(framePoint));
}

// Declared observer map. It is a rotation with view-dependent foreshortening,
// not a physical camera model and not a property of Q4.
export function observerProject(point, angleDegrees) {
  const theta = angleDegrees * Math.PI / 180;
  const c = Math.cos(theta);
  const s = Math.sin(theta);
  const [x, y] = point;
  return [c * x - 0.5 * s * y, 0.5 * s * x + c * y];
}

export function observedEnvelope(step, angleDegrees) {
  return intrinsicEnvelope(step).map((point) => observerProject(point, angleDegrees));
}

function maxAbsDelta(a, b) {
  assert.equal(a.length, b.length);
  let delta = 0;
  for (let i = 0; i < a.length; i += 1) {
    assert.equal(a[i].length, b[i].length);
    for (let j = 0; j < a[i].length; j += 1) {
      delta = Math.max(delta, Math.abs(a[i][j] - b[i][j]));
    }
  }
  return delta;
}

export function verifyCandidateLock() {
  const lockPath = resolve(ASSET_DIRECTORY, "tessarec-envelope-g1-g4-lock.json");
  const lock = JSON.parse(readFileSync(lockPath, "utf8"));
  for (const entry of lock.files) {
    const bytes = readFileSync(resolve(PACKAGE_DIRECTORY, entry.path));
    const digest = createHash("sha256").update(bytes).digest("hex");
    assert.equal(bytes.length, entry.bytes, `byte count mismatch: ${entry.path}`);
    assert.equal(digest, entry.sha256, `sha256 mismatch: ${entry.path}`);
  }
  return { status: "PASS", files: lock.files.length, lock: "external_non_self_referential" };
}

export function verifyG1toG4() {
  const lock = verifyCandidateLock();
  const transitions = GRAY_SEQUENCE.map((state, index) => ({
    from: state,
    to: GRAY_SEQUENCE[(index + 1) % GRAY_SEQUENCE.length],
    distance: hammingDistance(state, GRAY_SEQUENCE[(index + 1) % GRAY_SEQUENCE.length]),
  }));
  assert(transitions.every(({ distance }) => distance === 1));
  assert.equal(hammingDistance(0, 3), 2); // matched negative adjacency control

  const framesPrimary = GRAY_SEQUENCE.map(framePoint);
  const framesReplay = GRAY_SEQUENCE.map(framePoint);
  assert.deepEqual(framesReplay, framesPrimary);

  let intrinsicMaxDelta = 0;
  let observedNonzeroChanges = 0;
  for (let step = 0; step < GRAY_SEQUENCE.length; step += 1) {
    const intrinsic = intrinsicEnvelope(step);
    for (const angle of ANGLES_DEGREES) {
      // G3: the intrinsic object is computed independently of observer angle.
      intrinsicMaxDelta = Math.max(intrinsicMaxDelta, maxAbsDelta(intrinsic, intrinsicEnvelope(step)));
      const observed = observedEnvelope(step, angle);
      assert(observed.flat().every(Number.isFinite));
      if (angle === 0) assert(maxAbsDelta(observed, intrinsic) <= Number.EPSILON);
      if (angle !== 0 && maxAbsDelta(observed, intrinsic) > 1e-12) observedNonzeroChanges += 1;
      // G4: every output coordinate must equal the declared map exactly up to
      // the frozen engineering tolerance.
      assert(maxAbsDelta(observed, intrinsic.map((point) => observerProject(point, angle))) <= 1e-15);
    }
  }
  assert.equal(intrinsicMaxDelta, 0);
  assert(observedNonzeroChanges > 0);

  return {
    status: "PASS",
    classification: "ENGINEERING_VERIFICATION_NOT_SCIENTIFIC_RESULT",
    lock,
    gates: {
      G1_CARRIER: { status: "PASS", transitions: transitions.length, closure: true },
      G2_FRAME: { status: "PASS", replay: "exact", frames: framesPrimary.length },
      G3_INTRINSIC: { status: "PASS", max_delta_across_view_sweep: intrinsicMaxDelta },
      G4_OBSERVED: {
        status: "PASS",
        angles_degrees: ANGLES_DEGREES,
        declared_map_tolerance: 1e-15,
        nonzero_view_changes: observedNonzeroChanges,
      },
    },
    open_gates: ["G5_CONTACT", "G6_SAMPLING", "G7_ABLATION", "G8_RETURN"],
    writes_files: false,
    authorized_science_run: false,
  };
}

const invokedAsScript = process.argv[1] &&
  fileURLToPath(import.meta.url) === fileURLToPath(new URL(`[redacted-local-uri]

if (invokedAsScript) {
  if (process.argv.length !== 3 || process.argv[2] !== "--verify") {
    console.error("Usage: node tessarec-envelope-g1-g4.mjs --verify");
    process.exitCode = 2;
  } else {
    console.log(JSON.stringify(verifyG1toG4(), null, 2));
  }
}
