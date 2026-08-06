# Validation Protocol

## Validation authority

Validation must be performed by a reviewer who did not write the execution implementation. The reviewer may inspect evidence and conformance but may not change inputs, thresholds, formulas, outputs, or result rules.

## Gate 0 — Authority

Required:

- signed execution authorization;
- named scientific, execution, freeze, and validation owners;
- permitted repository and output boundary;
- protocol version and adoption date.

Failure: `invalid protocol`; STOP before package access.

## Gate 1 — Freeze integrity

Verify every required file exists and matches `protocol_manifest.json` and the SHA-256 inventory.

Failure: `invalid protocol`; STOP. Do not repair in place.

## Gate 2 — Input conformance

Verify schema, 484 rows, four sources, 121 indices per source, unique keys, ordering, finite decimals, shared index coverage, and no unauthorized fields.

Failure: `invalid protocol`; STOP before projection.

## Gate 3 — Transformation conformance

Verify:

- exactly four matrices;
- matrices equal the frozen integer matrices;
- 1,936 displayed rows;
- source ID and sample index retained;
- no depth, mask, smoothing, normalization, or extra view used.

Failure: `invalid protocol`; STOP before pair comparison.

## Gate 4 — Comparison completeness

Verify exactly 24 pair-view records, fixed pair order, matched indices, maximum-norm calculation, frozen tolerance, and allowed categorical values.

Failure: `invalid protocol`; STOP before partition construction.

## Gate 5 — Partition validity

For each view verify:

- every source appears exactly once;
- classes are nonempty and disjoint;
- union equals `S`;
- pair decisions are reflexive, symmetric, and transitive;
- partition encoding is canonical.

Failure: `invalid protocol`; STOP before result classification.

## Gate 6 — Terminal decision

Apply mechanically:

1. any earlier gate failure → `invalid protocol`;
2. unresolved categorical evidence without protocol violation → `inconclusive`;
3. one or more non-singleton classes → `positive`;
4. all classes singleton → `negative`.

Exactly one branch must apply.

## Gate 7 — Evidence integrity

Verify evidence files preceded interpretation, schemas pass, hashes are complete, deviation log exists, and the terminal record points to exact evidence.

Failure: `invalid protocol`; withdraw interpretation and STOP.

## Gate 8 — Interpretation boundary

Verify the report states only:

- the four view partitions;
- the finite null disposition;
- the terminal result;
- limitations and non-claims.

Any continuous, general, physical, information-theoretic, reconstruction, cross-domain, or repository-authority claim fails review. The evidence may be retained, but the interpretation package is not releasable.

## Gate 9 — Independent replay

When separately authorized, compare:

- input and protocol hashes exactly;
- pair classifications exactly;
- partitions exactly;
- null disposition exactly;
- terminal class exactly;
- numeric discrepancies within replay tolerance.

Categorical disagreement triggers investigation without changing the protocol. Apply the independent-disagreement rule in the tolerance specification.

## Validation output

Every gate records:

- gate ID;
- reviewer;
- timestamp;
- evidence inspected;
- expected condition;
- observed condition;
- `PASS`, `FAIL`, or `NOT RUN`;
- STOP action;
- linked deviation record.

## Global STOP conditions

- any mutable scientific input;
- missing authority or role separation;
- hash, schema, cardinality, or matrix mismatch;
- unauthorized preprocessing or extra analysis;
- threshold or formula change;
- source identity loss;
- non-transitive equivalence decisions;
- evidence/interpretation order violation;
- result class not mechanically determined;
- scope expansion;
- attempt to repair and continue under the same run ID.
