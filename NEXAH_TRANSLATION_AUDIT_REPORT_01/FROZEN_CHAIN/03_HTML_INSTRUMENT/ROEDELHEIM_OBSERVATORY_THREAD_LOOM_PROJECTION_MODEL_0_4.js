(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.ROThreadLoom04 = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const TAU = Math.PI * 2;
  const EPSILON = 1e-9;
  const VIEWS = Object.freeze([0, 90, 180, 270]);
  const CLASSES = Object.freeze({
    UNMASKED: "GENERATED_UNMASKED",
    RECOVERABLE: "GENERATED_MASKED_RECOVERABLE",
    UNKNOWN: "UNKNOWN",
    BOUNDARY: "BOUNDARY"
  });

  function round(value, digits = 12) {
    const factor = 10 ** digits;
    return Math.round(value * factor) / factor;
  }

  function sampleThread(id, phase) {
    const t = phase * TAU;
    const commonY = 0.62 * Math.sin(t) + 0.16 * Math.sin(3 * t);
    const commonZ = 0.27 * Math.cos(t) + 0.08 * Math.sin(2 * t);
    const definitions = {
      A: [-0.55 + 0.18 * Math.cos(2 * t), commonY, commonZ],
      B: [0.55 + 0.18 * Math.cos(2 * t), commonY, commonZ],
      C: [
        0.22 * Math.sin(2 * t + 0.45),
        0.44 * Math.sin(t + 1.15) - 0.24,
        0.52 * Math.cos(t + 0.35)
      ],
      D: [
        0.36 * Math.cos(t - 0.6),
        0.38 * Math.sin(2 * t - 0.2) + 0.25,
        -0.48 * Math.sin(t - 0.1)
      ]
    };
    if (!definitions[id]) throw new Error(`Unknown thread ${id}`);
    const [x, y, z] = definitions[id];
    return { id, phase: round(phase), x: round(x), y: round(y), z: round(z) };
  }

  function generateFamily(sampleCount = 241) {
    if (!Number.isInteger(sampleCount) || sampleCount < 3) {
      throw new Error("sampleCount must be an integer >= 3");
    }
    const samples = [];
    for (const id of ["A", "B", "C", "D"]) {
      for (let index = 0; index < sampleCount; index += 1) {
        const phase = index / (sampleCount - 1);
        samples.push({ ...sampleThread(id, phase), index });
      }
    }
    return samples;
  }

  function projectPoint(point, angleDegrees) {
    if (!VIEWS.includes(angleDegrees)) throw new Error("Unsupported fixed view");
    const angle = angleDegrees * Math.PI / 180;
    const cosine = Math.cos(angle);
    const sine = Math.sin(angle);
    return {
      ...point,
      angle: angleDegrees,
      u: round(point.x * cosine + point.z * sine),
      v: round(point.y),
      depth: round(-point.x * sine + point.z * cosine)
    };
  }

  function projectFamily(samples, angleDegrees) {
    return samples.map((sample) => projectPoint(sample, angleDegrees));
  }

  function maskAt(phase, options = {}) {
    const base = Number.isFinite(options.position) ? options.position : 0;
    const moving = Boolean(options.moving);
    const offset = moving ? 0.36 * Math.sin(phase * TAU) : 0;
    return {
      center: Math.max(-0.82, Math.min(0.82, base + offset)),
      width: Math.max(0.02, Math.min(0.8, Number(options.width) || 0.22))
    };
  }

  function classifyPoint(point, options = {}) {
    const mask = maskAt(point.phase, options);
    const distance = Math.abs(point.u - mask.center);
    const halfWidth = mask.width / 2;
    const tolerance = Number.isFinite(options.tolerance)
      ? Math.max(0, options.tolerance)
      : 0.006;
    let classification;
    if (Math.abs(distance - halfWidth) <= tolerance) {
      classification = CLASSES.BOUNDARY;
    } else if (distance < halfWidth) {
      classification = options.fullTrace === false ? CLASSES.UNKNOWN : CLASSES.RECOVERABLE;
    } else {
      classification = CLASSES.UNMASKED;
    }
    return { ...point, maskCenter: mask.center, maskWidth: mask.width, classification };
  }

  function classifyProjection(points, options = {}) {
    return points.map((point) => classifyPoint(point, options));
  }

  function isRenderable(entry) {
    return entry.classification !== CLASSES.UNKNOWN;
  }

  function complementSet(universe, selectedKeys) {
    const selected = selectedKeys instanceof Set ? selectedKeys : new Set(selectedKeys);
    return new Set(
      universe
        .map((entry) => `${entry.id}:${entry.index}`)
        .filter((key) => !selected.has(key))
    );
  }

  function distance3(a, b) {
    return Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z);
  }

  function projectedDistance(a, b) {
    return Math.hypot(a.u - b.u, a.v - b.v);
  }

  function projectionCollapses(points, threshold = 0.012, sourceDistance = 0.25) {
    const byIndex = new Map();
    for (const point of points) {
      if (!byIndex.has(point.index)) byIndex.set(point.index, []);
      byIndex.get(point.index).push(point);
    }
    const collisions = [];
    for (const [index, group] of byIndex) {
      for (let left = 0; left < group.length; left += 1) {
        for (let right = left + 1; right < group.length; right += 1) {
          const a = group[left];
          const b = group[right];
          const projected = projectedDistance(a, b);
          const source = distance3(a, b);
          if (projected <= threshold && source >= sourceDistance) {
            collisions.push({
              index,
              phase: a.phase,
              ids: [a.id, b.id],
              projectedDistance: round(projected),
              sourceDistance: round(source)
            });
          }
        }
      }
    }
    return collisions;
  }

  function diagnostics(classified, options = {}) {
    const counts = Object.fromEntries(Object.values(CLASSES).map((name) => [name, 0]));
    const primary = new Set(Object.values(CLASSES));
    let invalid = 0;
    for (const entry of classified) {
      if (primary.has(entry.classification)) counts[entry.classification] += 1;
      else invalid += 1;
    }
    const projected = classified.map(({ classification, maskCenter, maskWidth, ...point }) => point);
    return {
      total: classified.length,
      counts,
      coverageFailures: invalid + Math.abs(
        classified.length - Object.values(counts).reduce((sum, value) => sum + value, 0)
      ),
      projectionCollapses: projectionCollapses(
        projected,
        options.collapseThreshold,
        options.sourceDistance
      )
    };
  }

  return {
    TAU,
    EPSILON,
    VIEWS,
    CLASSES,
    round,
    sampleThread,
    generateFamily,
    projectPoint,
    projectFamily,
    maskAt,
    classifyPoint,
    classifyProjection,
    isRenderable,
    complementSet,
    distance3,
    projectedDistance,
    projectionCollapses,
    diagnostics
  };
});
