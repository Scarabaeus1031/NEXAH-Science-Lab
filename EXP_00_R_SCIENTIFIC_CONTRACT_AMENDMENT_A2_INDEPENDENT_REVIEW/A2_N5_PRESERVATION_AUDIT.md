# A2 N5 Preservation Audit

## Verdict

**N5 CONTRACT PRESERVED: FAIL.**

The accepted A1 prose remains available through the stated authority order and A2 retains the intended two-tier scientific role. The controlling A2 machine contract does not encode all accepted N5 rules, so N5 does not survive intact as a prose/machine contract.

## Preserved elements

| Element | Result |
|---|---|
| N5-SYNTH before authorization/seed release; implementation-failure mapping | PRESERVED |
| N5-RUN after authorized original fits/support and before outcomes/regression/nulls/classification; invalid-experiment mapping | PRESERVED |
| determinant `+1`, lexicographic order, 12 transforms, once per tier, zero Monte Carlo repetitions | PARTLY PRESERVED |
| exact synthetic field/grid/action/integrator/dt/horizon fixture | PRESERVED |
| V1 T/F hyperparameters and support quantile 0.99 | PRESERVED by immutable references |
| state, path, query, B, standardizer, target, refit, transformed support, inverse registration | PRESERVED |
| no target reselection and no ground-truth outcome use | PRESERVED |
| weak ranking, Kendall tau-b `>=0.99`, constant/undefined conventions | PRESERVED |
| fixed N5-RUN population and transformed-abstention failure | PRESERVED |

## Machine omissions

1. Accepted A1 says **the first 12** determinant-`+1` matrices after lexicographic sorting. A2 machine gives type, determinant, ordering, and count but no selection operator. “Take any 12 and order them” remains machine-conforming.
2. Accepted A1 requires deterministic action-conditioned training paths from every synthetic training state. The synthetic machine fixture supplies field/grid/actions but does not encode this generation requirement.
3. Accepted A1 evaluates the minimum query-level tau-b over all representations, queries, and transforms. The machine block gives a minimum threshold but no aggregation universe/operator.
4. The machine artifact does not explicitly encode the accepted rule that any transform/refit error is a tier failure, although missing ranking and tier failure labels are present.

Under A2's own isomorphism rule, these are material one-way omissions. The scientific concept remains defensible; the authoritative package is not complete.
