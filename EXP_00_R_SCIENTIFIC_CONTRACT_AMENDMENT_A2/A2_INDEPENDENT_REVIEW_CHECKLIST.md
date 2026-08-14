# A2 Independent Review Checklist

This package does not approve itself.

## Scope

- [ ] Only R-01–R-07 are changed.
- [ ] Accepted A1 content is preserved.
- [ ] No frozen component outside the ambiguity boundary changed.

## R-01

- [ ] Binary64 values are converted to exact rational pairs.
- [ ] Exact addition/ranking/cross multiplication is deterministic.
- [ ] Six equal 0.1 contributions pass.
- [ ] Slightly above 0.50 fails.
- [ ] G≤0, fewer than three, zero rows, ties, negatives, NaN/Inf are typed.

## N1–N4

- [ ] Every family has a complete dependency→transform→support→population→carrier→outcome→statistic arrow.
- [ ] Original `P_train/P_test` rows are fixed for every null.
- [ ] N1 uses no new simulation and cannot select rows by null support.
- [ ] N2–N4 retain observed carrier actions/outcomes.
- [ ] N3 training map and donor rule are exact.
- [ ] N4 carrier-indexed strata/merging are deterministic and do not add repetitions.
- [ ] Undefined repetitions invalidate without retry.

## Prose/machine

- [ ] JSON-compatible YAML parses with standard library.
- [ ] N5 parameters/support and all accepted content are encoded.
- [ ] Seed/null edge rules are encoded.
- [ ] Validator passes canonical package and rejects every mutation fixture.
- [ ] No prose-only scientific branch remains.

## Nonexecution

- [ ] Validator has no scientific imports/capability.
- [ ] No V3 implementation, authorization, or registered result exists.

## Independent decision

- [ ] GO — A2 may become the prospective contract completion for later V3 implementation.
- [ ] NO-GO — identify the exact remaining scientific choice or mismatch.

GO is not implementation/freeze/execution approval.
