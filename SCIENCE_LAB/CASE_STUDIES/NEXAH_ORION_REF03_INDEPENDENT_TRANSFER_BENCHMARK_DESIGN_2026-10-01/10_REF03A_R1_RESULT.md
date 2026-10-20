# REF03-A-R1 result — self-preregistered internal validation

Date: `2026-10-01`

Decision: `INTERNAL_VALIDATION_PASS`

External human confirmation: `NO`

## Integrity and admission

- Human Owner accepted the REF03-A solo-research protocol: `YES`
- analytic oracle generated before ORION output: `YES`
- oracle/predeclared-label agreement: `7 / 7`
- frozen runner hash match: `YES`
- runner-v1 lock hash match: `YES`
- protocol hash match: `YES`
- baseline hash match: `YES`
- primary/replay byte identity: `YES`
- mandatory STOP during R1: `NO`

Attempt 00 stopped before ORION execution because of an oracle serialization
error and is not scored. R1 used a new experiment ID and new pre-output lock.

## Dataset accounting

- assertions: `7`
- underlying states: `7`
- represented classes: `6 / 6`
- unit of evidence: assertion, not state

## Complete assertion table

| ID | Analytic reference | ORION actual | Match | B0 | B1 |
|---|---|---|---|---|---|
| R03-A01 | INVARIANT | INVARIANT | yes | DIFFERENT | PASS |
| R03-A02 | EQUIVARIANT | EQUIVARIANT | yes | DIFFERENT | PASS |
| R03-A03 | INVARIANT | INVARIANT | yes | DIFFERENT | PASS |
| R03-A04 | ROBUST | ROBUST | yes | DIFFERENT | PASS |
| R03-A05 | UNDEFINED | UNDEFINED | yes | DIFFERENT | NO_SCORE |
| R03-A06 | REPRESENTATION_DEPENDENT | REPRESENTATION_DEPENDENT | yes | DIFFERENT | NO_SCORE |
| R03-A07 | FAILED | FAILED | yes | DIFFERENT | FAIL |

No assertion was omitted.

## Preregistered summaries

- exact agreement: `7 / 7`
- mismatches: `0 / 7`
- macro recall across six represented classes: `1.0`
- UNDEFINED recall: `1.0`
- FAILED recall: `1.0`
- Primary/Replay SHA-256:
  `d6a8645830ee15f14c4b179ec033b9db488b7f079ea51ccace4eecba7e614e0f`

## Baseline interpretation

### B0 — raw representation equality

B0 had technical coverage on `7 / 7` assertions and returned `DIFFERENT` on
all seven. This is correct for its narrow serialization question, but it cannot
distinguish lawful transformation from structural failure. Under the naive
interpretation `DIFFERENT = failure`, it would raise four false failure alarms
for R03-A01 through R03-A04.

Observed B0 semantic partition:

```text
DIFFERENT -> {INVARIANT, EQUIVARIANT, ROBUST,
              UNDEFINED, REPRESENTATION_DEPENDENT, FAILED}
```

### B1 — scalar tolerance pass/fail

B1 scored `5 / 7` assertions (`71.4%` coverage), with `2 / 7 NO_SCORE`. On its
five supported scalar questions it produced `4 PASS`, `1 FAIL`, no false pass
and no false fail. It correctly handles bounded scalar questions, but collapses
three distinct accepted classes and cannot classify the two structural cases.

Observed B1 semantic partition:

```text
PASS     -> {INVARIANT, EQUIVARIANT, ROBUST}
NO_SCORE -> {UNDEFINED, REPRESENTATION_DEPENDENT}
FAIL     -> {FAILED}
```

ORION preserved six observed semantic classes; B1 exposed three output groups;
B0 exposed one observed group on this fixture. This is diagnostic resolution,
not a claim of general superiority.

## Bounded conclusion

The unchanged ORION Scientific Runner v1 matched the separately implemented,
sealed analytic reference for all seven assertions on this finite planar
fixture and replayed byte-identically. Unlike B0 and B1, its registered output
vocabulary retained all six preregistered distinctions on the fixture.

This establishes a functioning, reproducible internal method on REF03-A-R1.
It does not establish independent human confirmation, external replication,
automatic discovery, causal inference, cross-domain utility, navigation value,
scientific superiority or production readiness. REF03-B remains open.
