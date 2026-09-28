# NEXAH Compare WP5 — Family Office Refinancing Benchmark

Status: `PREREGISTERED_MACHINE_CONDITION_PENDING_EXECUTION`

This package converts the already prepared anonymized strategic-refinancing
case from External Test 01 into the first WP5 technical benchmark. It does not
admit any private source document, identity, real currency amount or customer
record. The benchmark case is a synthetic normalized derivative.

The benchmark asks whether NEXAH Compare v0.1 can deterministically surface
five frozen decision-relevant defects across two Human-confirmed structured
analyses while preserving evidence gaps and abstention boundaries.

The machine condition can be executed locally. A valid PASS or FAIL decision
still requires an independent qualified manual baseline and blinded Human
adjudication. Until those roles are completed, the result must remain HOLD.

## Relationship to prior work

- precursor: `EXTERNAL_TEST_01_STRATEGIC_REFINANCING_COMPETITIVE_BENCHMARK_2026-09-27`;
- product contract: `NEXAH Compare v0.1`, WP2–WP4;
- frozen scope and pass rule: Mission Control Gate 1;
- this directory: WP5 benchmark fixture, preregistration, execution evidence
  and return.

## Separation

- `benchmark_case/` is the executable structured packet shared by both conditions;
- `reviewer_packet/source/` contains the two faithful source projections supplied
  only to the manual reviewer because the deterministic runtime accepts records;
- `BASELINE_INSTRUCTIONS.md` is the fixed manual-review task;
- `evaluator_only/` contains the sealed key and must not be supplied to the
  baseline reviewer or NEXAH runtime;
- generated machine outputs remain inside `benchmark_case/`;
- no UI, customer trial or public capability claim follows from this package.
