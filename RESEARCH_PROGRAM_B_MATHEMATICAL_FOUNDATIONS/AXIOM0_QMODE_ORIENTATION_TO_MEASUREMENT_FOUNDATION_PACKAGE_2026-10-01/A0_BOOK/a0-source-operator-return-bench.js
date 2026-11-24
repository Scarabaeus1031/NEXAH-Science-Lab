(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.A0SourceOperatorReturnBench = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const OPERATIONS = Object.freeze({
    PRODUCT: Object.freeze({ code: 1, arity: 2 }),
    DIFFERENCE_OF_SQUARES: Object.freeze({ code: 2, arity: 2 }),
    SUM: Object.freeze({ code: 3, arity: 2 }),
    SCALE_SUM: Object.freeze({ code: 4, arity: 3 })
  });

  const IDENTITY_REUSE = Object.freeze([
    "A0:ROOTROOM_CODON_ORIENTATION_RETURN:V1",
    "ART:A0:MATHEMATICAL_JOINTS",
    "MOD:NUMBER_VIEW_SUITE"
  ]);

  function assertInteger(value, label) {
    if (!Number.isInteger(value)) throw new TypeError(`${label} must be an integer`);
    return value;
  }

  function isPrime(value) {
    if (!Number.isInteger(value) || value < 2) return false;
    if (value === 2) return true;
    if (value % 2 === 0) return false;
    for (let divisor = 3; divisor * divisor <= value; divisor += 2) {
      if (value % divisor === 0) return false;
    }
    return true;
  }

  function primeFactors(value) {
    assertInteger(value, "value");
    if (value < 2) return Object.freeze([]);
    const factors = [];
    let rest = value;
    for (let divisor = 2; divisor * divisor <= rest; divisor += divisor === 2 ? 1 : 2) {
      while (rest % divisor === 0) {
        factors.push(divisor);
        rest /= divisor;
      }
    }
    if (rest > 1) factors.push(rest);
    return Object.freeze(factors);
  }

  function evaluate(operation, parameters) {
    const definition = OPERATIONS[operation];
    if (!definition) throw new RangeError(`unknown operation: ${operation}`);
    if (!Array.isArray(parameters) || parameters.length !== definition.arity) {
      throw new RangeError(`${operation} requires ${definition.arity} parameters`);
    }
    const values = parameters.map((value, index) => assertInteger(value, `parameters[${index}]`));
    if (operation === "PRODUCT") return values[0] * values[1];
    if (operation === "DIFFERENCE_OF_SQUARES") return values[0] ** 2 - values[1] ** 2;
    if (operation === "SUM") return values[0] + values[1];
    return values[0] * (values[1] + values[2]);
  }

  function pathRecord(operation, parameters, label) {
    const result = evaluate(operation, parameters);
    const integerResult = Number.isInteger(result) && result >= 0;
    const recordId = `${operation}(${parameters.join(",")})=>${result}`;
    return Object.freeze({
      schema: "nexah.a0.source-operator-return-record/1.0.0",
      record_id: recordId,
      label: label || operation,
      source_number: result,
      source_address: Object.freeze(parameters.slice()),
      operation,
      parameters: Object.freeze(parameters.slice()),
      result,
      prime_status: integerResult ? isPrime(result) : false,
      factorization: integerResult ? primeFactors(result) : Object.freeze([]),
      identity_reuse: IDENTITY_REUSE,
      new_canonical_ids: Object.freeze([]),
      relation_changes: Object.freeze([]),
      claim_boundary: "Exact arithmetic and declared view transport only; no physical Rootroom, resonance, membrane, CODON or Lotus mechanism."
    });
  }

  function comparePaths(left, right) {
    if (!left || !right || left.schema !== right.schema) throw new TypeError("two source-operator records required");
    return Object.freeze({
      arrival: left.result,
      same_result: Object.is(left.result, right.result),
      same_derivation: left.operation === right.operation && JSON.stringify(left.parameters) === JSON.stringify(right.parameters),
      same_source_address: JSON.stringify(left.source_address) === JSON.stringify(right.source_address),
      left_record_id: left.record_id,
      right_record_id: right.record_id
    });
  }

  function rootGap(k) {
    assertInteger(k, "k");
    if (k < 1) throw new RangeError("k must be >= 1");
    const root = Math.sqrt(k);
    const nextRoot = Math.sqrt(k + 1);
    const gap = nextRoot - root;
    const rationalizedGap = 1 / (nextRoot + root);
    return Object.freeze({ k, root, next_root: nextRoot, gap, rationalized_gap: rationalizedGap, residual: gap - rationalizedGap });
  }

  function rootRuler(start, end) {
    assertInteger(start, "start");
    assertInteger(end, "end");
    if (start < 1 || end < start) throw new RangeError("root ruler requires 1 <= start <= end");
    return Object.freeze(Array.from({ length: end - start + 1 }, (_, index) => rootGap(start + index)));
  }

  function powerComparator(value, reference) {
    if (!Number.isFinite(value)) throw new TypeError("value must be finite");
    if (!Number.isFinite(reference) || reference === 0) throw new TypeError("reference must be finite and non-zero");
    return Object.freeze({
      value,
      reference,
      square_over_reference: value ** 2 / reference,
      cube_over_reference: value ** 3 / reference,
      unit: "DIMENSIONLESS_UNLESS_DECLARED"
    });
  }

  function project(record, dimension) {
    if (!record || record.schema !== "nexah.a0.source-operator-return-record/1.0.0") throw new TypeError("source-operator record required");
    const definition = OPERATIONS[record.operation];
    const carrier = Object.freeze([record.result, definition.code, record.parameters.length]);
    if (dimension === "3D") {
      return Object.freeze({
        record_id: record.record_id,
        view_dimension: "3D",
        carrier_coordinate: carrier,
        projected_coordinate: carrier,
        projection_matrix: Object.freeze([[1, 0, 0], [0, 1, 0], [0, 0, 1]]),
        lost_fields: Object.freeze([]),
        inverse_status: "EXACT_BY_ID_AND_COORDINATE",
        return_verified: true
      });
    }
    if (dimension !== "2D") throw new RangeError("dimension must be 2D or 3D");
    return Object.freeze({
      record_id: record.record_id,
      view_dimension: "2D",
      carrier_coordinate: carrier,
      projected_coordinate: Object.freeze([carrier[0], carrier[1]]),
      projection_matrix: Object.freeze([[1, 0, 0], [0, 1, 0]]),
      lost_fields: Object.freeze(["parameter_count"]),
      inverse_status: "NON_UNIQUE_FROM_GEOMETRY_RETURN_BY_RECORD_ID",
      return_verified: true
    });
  }

  function mirror(point) {
    if (!point || !Number.isFinite(point.x) || !Number.isFinite(point.y)) throw new TypeError("finite point required");
    return Object.freeze({ x: point.x, y: -point.y });
  }

  function unitGuard(unit, dimensionalSource) {
    const normalized = String(unit || "").trim();
    const allowed = normalized === "" || Boolean(dimensionalSource && dimensionalSource.quantity && dimensionalSource.unit === normalized);
    return Object.freeze({
      requested_unit: normalized || null,
      allowed,
      status: allowed ? "UNIT_DECLARED" : "UNIT_BLOCKED_MISSING_DIMENSIONAL_SOURCE"
    });
  }

  function fixtureSuite() {
    const product713 = pathRecord("PRODUCT", [23, 31], "23 × 31");
    const product820 = pathRecord("PRODUCT", [41, 20], "41 × 20");
    const squares820 = pathRecord("DIFFERENCE_OF_SQUARES", [206, 204], "206² − 204²");
    const sum140 = pathRecord("SUM", [90, 50], "90 + 50");
    const scaled140 = pathRecord("SCALE_SUM", [10, 7, 7], "10 × (7 + 7)");
    return Object.freeze({
      product713,
      product820,
      squares820,
      sum140,
      scaled140,
      arrival820: comparePaths(product820, squares820),
      arrival140: comparePaths(sum140, scaled140),
      roots: rootRuler(2, 10)
    });
  }

  return Object.freeze({
    OPERATIONS,
    IDENTITY_REUSE,
    isPrime,
    primeFactors,
    evaluate,
    pathRecord,
    comparePaths,
    rootGap,
    rootRuler,
    powerComparator,
    project,
    mirror,
    unitGuard,
    fixtureSuite
  });
});
