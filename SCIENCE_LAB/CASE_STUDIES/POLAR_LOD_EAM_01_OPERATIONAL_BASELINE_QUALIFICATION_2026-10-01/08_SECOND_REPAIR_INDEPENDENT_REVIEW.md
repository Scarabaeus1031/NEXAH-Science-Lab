# POLAR-LOD-EAM-01 — independent second-repair review

Date: 2026-10-01
Bound commit: `7195028`
Disposition: `FAIL / R1 CLOSED / R2 REPRODUCED / R3 MISSINGNESS OPEN`
Prospective data accessed: `NO`

## Positive evidence

- all three bound manifests verified;
- 18/18 tests passed;
- the exact CPython 3.12.14 binary and all seven package versions matched;
- a clean canonical replay was byte-identical;
- cache tamper, the legacy custom-lock flag and a false interpreter hash were
  rejected fail closed;
- the former alternative ledger/lock-root route could no longer produce a
  verified status;
- M6 executed with 20,000 circular 30-day block-bootstrap replicates, seed
  `20261001`, Holm alpha 0.05 and the three frozen annotations.

R1 was accepted as closed. R2 was technically reproduced, with one
documentation correction requested: the package must show only
`run_sealed_replay.py` as the replay entrypoint, and the runner itself should
verify the interpreter binary rather than version strings alone.

## Blocking R3 finding — jointly missing target bypass

The evaluator had no independent frozen expected-target population. Its
missingness logic compared only the B3, M2 and observed maps that were actually
present. In an adversarial synthetic case, the same one of 200 expected target
days was removed from both B3 and M2 while remaining in the observed map.

The evaluator incorrectly returned:

- `OPERATIONAL_RELEVANCE_SUPPORTED`;
- `paired_n = 199`;
- all missingness counts equal to zero.

A target jointly absent from both models was therefore invisible. This
violated the requirement to report every missing target and reason before
scoring and prevented fail-closed population custody.

## Required repair

The evaluator must require an expected-target set frozen independently of both
prediction maps. It must report expected targets absent from B3, M2 or
observations, and jointly missing predictions must force
`OPERATIONAL_RELEVANCE_NOT_ASSESSABLE`. A dedicated adversarial regression test
is required. The direct replay command in
`02_B3_IMPLEMENTATION_AND_RESULT.md` must be replaced by the sealed entrypoint,
and direct runner use must also verify the interpreter binary hash.

## Claim ceiling

The review accepted the historical sealed replay and closure of the former
replaceable trust root. It did not accept complete M6 population custody, an
operational lock, prospective authority or operational relevance.

No files were changed, no prospective data were opened and Mission Control
remained untouched during the review.
