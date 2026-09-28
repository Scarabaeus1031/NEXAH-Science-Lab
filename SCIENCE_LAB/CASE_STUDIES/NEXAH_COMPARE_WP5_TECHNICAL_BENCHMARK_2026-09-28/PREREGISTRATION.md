# WP5 Preregistration — Family Office Refinancing

Frozen: `2026-09-28`  
Status: `FROZEN_BEFORE_MACHINE_EXECUTION`

## Question

Does NEXAH Compare v0.1 detect the five frozen material defects in the two
confirmed analyses of the synthetic normalized refinancing case, preserve the
required unresolved and abstention boundaries, and replay byte-identically?

## Conditions

1. `BASELINE`: one independent qualified reviewer receives an exact clean copy
   of `benchmark_case/inputs/`, `benchmark_case/evidence/`, the two files in
   `reviewer_packet/source/`, and `BASELINE_INSTRUCTIONS.md`. The reviewer may
   use an ordinary calculator or spreadsheet, receives no NEXAH output and no
   evaluator key, and records start/end time.
2. `NEXAH_COMPARE`: the frozen deterministic local CLI receives only the
   declared case package. It has no web, LLM or evaluator-key access.

Both conditions use the same structured inputs and evidence. The baseline may
read the source projections; NEXAH consumes their Human-confirmed structured
records. No condition receives private source material.

## Frozen defect set

Exactly five material defects are seeded. Their identities, severities,
expected matching tolerances and accepted reason-code families are frozen in
`evaluator_only/ANSWER_KEY.json`. The set contains:

- two critical calculation or time/scope defects;
- one material evidence defect;
- one material assumption/calculation-operation defect;
- one material recommendation whose correct treatment is unresolved/abstain.

## Primary scoring and pass rule

Safety floor:

- critical seeded-defect recall = `1.00`;
- at least `4/5` total seeded material defects detected;
- no more than one material false positive;
- zero unsupported truth or recommendation claims;
- byte-identical canonical JSON, Markdown and hashes on two clean runs.

Incremental value requires the safety floor plus either:

- Route A: NEXAH detects at least one seeded material defect missed by the
  baseline, misses no critical defect found by the baseline, and adds at most
  one material false positive relative to the baseline; or
- Route B: NEXAH reaches the same material and critical defect set at least 25
  percent faster while retaining every scored evidence locator, abstention and
  unresolved item.

Secondary observations cannot rescue a failed primary result.

## Validity and STOP

The test is invalid or stopped if input parity fails, the key was not frozen
before execution, evaluator leakage occurs, a post-hoc metric replaces the
frozen metric, the machine runtime reads outside the declared package, or the
adjudicator is not blinded to condition identity.

A machine-only result is `HOLD_AWAITING_INDEPENDENT_BASELINE_AND_BLINDED_ADJUDICATION`,
not PASS. No THE EYE or NEXAHEDRON UI work begins from a HOLD result.

## Claim ceiling

This test may support only a claim about deterministic comparison of the
declared confirmed records. It does not establish truth determination,
financial advice, completeness, decision quality, customer utility,
regulatory compliance, product readiness or product-market fit.
