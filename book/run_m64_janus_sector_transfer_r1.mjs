import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const protocol = JSON.parse(fs.readFileSync(path.join(here, "assets/a0-m64-janus-sector-transfer-r1-protocol.json"), "utf8"));

const mod = (value, modulus) => ((value % modulus) + modulus) % modulus;
const gcd = (left, right) => right === 0 ? Math.abs(left) : gcd(right, left % right);
const order = (value, modulus) => {
  if (gcd(value, modulus) !== 1) return null;
  let cursor = 1;
  for (let exponent = 1; exponent <= modulus; exponent += 1) {
    cursor = mod(cursor * value, modulus);
    if (cursor === 1) return exponent;
  }
  throw new Error(`order not found for ${value} mod ${modulus}`);
};
const equalizer = (multiplier, modulus) => Array.from(
  {length: modulus},
  (_, value) => value
).filter((value) => mod(multiplier * value, modulus) === mod(-value, modulus));
const axisRecord = (multiplier, modulus, coordinateModulus, embeddingStep) => {
  const elements = Array.from({length: coordinateModulus}, (_, coordinate) => embeddingStep * coordinate);
  const inducedMultiplier = mod(multiplier, coordinateModulus);
  const agreement = elements.filter((value) => mod(multiplier * value, modulus) === mod(-value, modulus));
  return {
    coordinate_modulus: coordinateModulus,
    embedding_step: embeddingStep,
    size: coordinateModulus,
    induced_multiplier: inducedMultiplier,
    induced_order: order(inducedMultiplier, coordinateModulus),
    is_full_mirror_sector: inducedMultiplier === coordinateModulus - 1,
    mirror_agreement_count: agreement.length,
    mirror_agreement_elements: agreement
  };
};

const multiplier = protocol.operator.multiplier;
const systems = {};
for (const {modulus, factors: [p, q]} of protocol.systems) {
  const agreement = equalizer(multiplier, modulus);
  const predictedSize = gcd(multiplier + 1, modulus);
  systems[String(modulus)] = {
    factorization: [p, q],
    multiplier,
    multiplier_channels: [mod(multiplier, p), mod(multiplier, q)],
    local_orders: [order(mod(multiplier, p), p), order(mod(multiplier, q), q)],
    mirror_equalizer: {
      equation: `${multiplier + 1}x = 0 mod ${modulus}`,
      predicted_size: predictedSize,
      enumerated_size: agreement.length,
      generator_step: modulus / predictedSize,
      elements: agreement,
      nonzero_size: agreement.filter(Boolean).length
    },
    factor_axes: [
      axisRecord(multiplier, modulus, p, q),
      axisRecord(multiplier, modulus, q, p)
    ],
    controls: {
      full_mirror: {
        multiplier: modulus - 1,
        agreement_size: equalizer(modulus - 1, modulus).length,
        expected_size: modulus
      },
      identity_on_odd_carrier: {
        multiplier: 1,
        agreement_size: equalizer(1, modulus).length,
        expected_size: 1
      }
    }
  };
}

const result = {
  schema: "nexah.a0.m64-janus-sector-transfer-result",
  version: "1.0.0",
  date: protocol.date,
  record_id: protocol.record_id,
  status: "COMPUTED_PENDING_INDEPENDENT_VALIDATION",
  systems,
  transfer_verdict: {
    code: "CARRIER_BOUND_JANUS_SECTOR_AT_365_NO_NONTRIVIAL_TRANSFER_TO_2501",
    invariant: [
      "CRT channel action",
      "equalizer equation (a+1)x=0 mod m",
      "equalizer cardinality gcd(a+1,m)"
    ],
    carrier_specific: [
      "nontrivial mirror-sector existence",
      "factor-axis mirror action",
      "local orders",
      "global orbit census"
    ],
    interpretation: "M64 agrees with mirror on the five-state 73*Z_5 axis of Z_365, but only at zero on Z_2501. Janus behavior is a carrier-and-sector relation, not an intrinsic meaning of the numeral 64."
  },
  governance: protocol.claim_boundary
};

process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);

