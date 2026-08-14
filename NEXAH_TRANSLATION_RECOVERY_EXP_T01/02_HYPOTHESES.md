# Hypotheses

## H0

The Translation Architecture provides no nontrivial information beyond the
declared transformations and their ordinary inverse/reconstruction properties.

## H1

Under this frozen protocol, the evaluator reproducibly distinguishes
`PRESERVED`, `CHANGED`, `LOST/COLLAPSED`, and `UNIDENTIFIABLE` relations without
claiming recovery after information destruction.

## Falsifiers

H1 is falsified if any registered lossy map is reported as recovered, an exact
bijective control fails without a declared numerical reason, replay is not
byte-identical, undefined values are coerced to zero, or classification changes
without a protocol change. Partial support applies if some but not all required
classes are distinguished. H1 is not a novelty or invariant hypothesis.

The Stillpoint subtest has a separate expectation: the stable damped system
returns under every registered perturbation; the unstable controls do not; the
neutral controls remain `NEUTRAL_NONIDENTIFIABLE`.

