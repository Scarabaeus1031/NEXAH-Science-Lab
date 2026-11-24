"use strict";

function integer(value, label) {
  if (!Number.isSafeInteger(value)) throw new TypeError(`${label} must be a safe integer`);
  return value;
}

function normalize(value, modulus) {
  return ((value % modulus) + modulus) % modulus;
}

function gcd(left, right) {
  let a = Math.abs(left);
  let b = Math.abs(right);
  while (b) [a, b] = [b, a % b];
  return a;
}

function extendedGcd(left, right) {
  if (right === 0) return { gcd: Math.abs(left), x: Math.sign(left) || 1, y: 0 };
  const next = extendedGcd(right, left % right);
  return { gcd: next.gcd, x: next.y, y: next.x - Math.trunc(left / right) * next.y };
}

function modularInverse(multiplier, modulus) {
  integer(multiplier, "multiplier");
  integer(modulus, "modulus");
  if (modulus < 2) throw new RangeError("modulus must be at least 2");
  const result = extendedGcd(normalize(multiplier, modulus), modulus);
  return result.gcd === 1 ? normalize(result.x, modulus) : null;
}

function step(current, { multiplier, increment = 0, modulus }) {
  integer(current, "current");
  integer(multiplier, "multiplier");
  integer(increment, "increment");
  integer(modulus, "modulus");
  if (modulus < 2) throw new RangeError("modulus must be at least 2");
  const normalizedCurrent = normalize(current, modulus);
  const raw = multiplier * normalizedCurrent + increment;
  if (!Number.isSafeInteger(raw)) throw new RangeError("raw transition exceeds safe integer range");
  const next = normalize(raw, modulus);
  const quotient = (raw - next) / modulus;
  return Object.freeze({ current: normalizedCurrent, multiplier, increment, modulus, raw, quotient, remainder: next, next });
}

function runOrbit(config, maxSteps = null) {
  const seed = normalize(integer(config.seed, "seed"), integer(config.modulus, "modulus"));
  const limit = maxSteps ?? config.modulus * 2 + 2;
  integer(limit, "maxSteps");
  if (limit < 1) throw new RangeError("maxSteps must be positive");

  const states = [seed];
  const records = [];
  const firstSeen = new Map([[seed, 0]]);
  let current = seed;
  let repeat = null;

  for (let index = 0; index < limit; index += 1) {
    const transition = step(current, config);
    const record = Object.freeze({ index, ...transition });
    records.push(record);
    states.push(transition.next);
    if (firstSeen.has(transition.next)) {
      repeat = Object.freeze({ state: transition.next, first_index: firstSeen.get(transition.next), return_index: index + 1, period: index + 1 - firstSeen.get(transition.next) });
      break;
    }
    firstSeen.set(transition.next, index + 1);
    current = transition.next;
  }

  const inverseMultiplier = config.increment === 0 ? modularInverse(config.multiplier, config.modulus) : null;
  return Object.freeze({
    kind: "MODULAR_ORBIT_SLOG_RECEIPT",
    version: "0.1",
    config: Object.freeze({ seed, multiplier: config.multiplier, increment: config.increment ?? 0, modulus: config.modulus }),
    states: Object.freeze(states),
    records: Object.freeze(records),
    repeat,
    inverse_multiplier: inverseMultiplier,
    invertible_multiplicative_operator: inverseMultiplier !== null,
    gcd: gcd(config.multiplier, config.modulus),
    classification: repeat ? (repeat.period === 1 ? "FIXED_POINT_OR_COLLAPSE" : "CYCLE_CLOSED") : "LIMIT_REACHED",
    boundary: "FINITE DETERMINISTIC STEP LOG; NOT A RANDOMNESS, PHYSICAL-MECHANISM, LOTUS-TOPOLOGY OR SOURCE-GRAPH CLAIM"
  });
}

function verifyReturn(forwardReceipt, returnReceipt) {
  if (forwardReceipt.config.increment !== 0 || returnReceipt.config.increment !== 0) return false;
  if (forwardReceipt.config.modulus !== returnReceipt.config.modulus) return false;
  const expectedInverse = modularInverse(forwardReceipt.config.multiplier, forwardReceipt.config.modulus);
  if (expectedInverse === null || returnReceipt.config.multiplier !== expectedInverse) return false;
  const forwardCore = forwardReceipt.states.slice(0, -1);
  const returnCore = returnReceipt.states.slice(0, -1);
  return forwardCore.length === returnCore.length && forwardCore.every((state, index) => state === returnCore[(returnCore.length - index) % returnCore.length]);
}

module.exports = Object.freeze({ normalize, gcd, modularInverse, step, runOrbit, verifyReturn });
