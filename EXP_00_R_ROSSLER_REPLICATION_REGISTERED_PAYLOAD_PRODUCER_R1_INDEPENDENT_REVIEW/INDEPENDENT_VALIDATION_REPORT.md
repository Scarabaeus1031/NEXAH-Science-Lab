# Independent Validation Report

## Independent builds

`review_tests/independent_producer_review.py` constructs its own target, 3,000 physical-seed rows, source costs, support paths, action outcomes, five null-family descriptor sets, N5 sources and twelve sensitivity universes. Its values differ from the producer package's fixtures.

```text
INDEPENDENT TESTS: 6/6 PASS
COMPLETE SYNTHETIC BUILDS: 2
PAYLOAD COMPLETENESS: PASS
GENERATOR R2 ACCEPTANCE: PASS
EXACT BYTE EQUALITY: PASS
EXACT SHA-256 EQUALITY: PASS
```

The independent checks verified physical TRAIN `5000–5029` and TEST `6000–6029` identities, metadata-only pair IDs, `state_signal`, source-bound scores, support maximum, exact `delta_j`, binary success, namespace pass-through bytes, bootstrap, both N5 tiers, sensitivity halves, G9 and provenance.

## Claimed regressions

```text
PRODUCER: 7/7 PASS
GENERATOR R2: 35/35 PASS
GENERATOR R1: 25/25 PASS
ORIGINAL GENERATOR: 20/20 PASS
PREVIOUS COUNTEREXAMPLES: 5/5 CLOSED
FROZEN-V1 SYNTHETIC: 24/24 PASS
```

No registered seed, evidence, input, authorization, P1–P5 result or scientific classification was accessed or produced.
