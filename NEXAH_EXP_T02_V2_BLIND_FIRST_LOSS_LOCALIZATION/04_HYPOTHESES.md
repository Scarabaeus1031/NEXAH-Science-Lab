# Hypotheses

## Localization

`H0-A`: N4 exact held-out accuracy does not exceed the strongest registered
comparator by both frozen margins.  
`H1-A`: N4 exceeds the strongest comparator by at least `0.10` exact accuracy
(at least 9/84 cases) **and** lowers mean stage-distance error by at least `0.50`.

## Incremental baseline-output value

`H0-B`: N4 has fewer than 9 uniquely correct held-out cases, or fewer than 3
baseline-decision-vector collision groups proving that registered comparator
decisions cannot reproduce the correct N4 mapping.  
`H1-B`: N4 has at least 9 uniquely correct cases where every B-method and N0–N3
is wrong/unresolved, and at least 3 groups with identical complete comparator
decision vectors, differing `k*`, and correct N4 predictions for the differing
truths.

`INCREMENTAL_DIAGNOSTIC_VALUE_SUPPORTED_BOUNDED` requires both H1-A and H1-B,
zero fatal falsifiers, and held-out—not control—evidence. This is an aggregate
criterion; one lucky cell can never support H1.

Because all methods ultimately share public representations, a positive result
means incremental diagnostic **performance/operator value**, never independent
raw information or a new principle.

