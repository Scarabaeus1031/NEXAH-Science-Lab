# Frozen Structural Certificates

All certificates are label-free and frozen before execution.

## Coarse / unweighted

| ID | Certificate | Equality rule |
|---|---|---|
| U1 | Unlabeled directed support graph including self-loops | lexicographically minimal binary adjacency over every node permutation |
| U2 | SCC size multiset | exact sorted integer multiset |
| U3 | WCC size multiset | exact sorted integer multiset |
| U4 | Weak articulation count | exact integer equality; location is not compared |
| U5 | Directed finite-distance multiset | exact sorted integer multiset over ordered reachable node pairs |
| U6 | Edge count | exact, including self-loops |
| U7 | Self-loop count | exact |

## Fine / weighted

| ID | Certificate | Equality rule |
|---|---|---|
| W1 | Transition-probability multiset | exact equality after rounding each probability to 12 decimal places |
| W2 | Unlabeled weighted graph | minimal probability adjacency over node permutations, values rounded to 12 decimals |
| W3 | Regime-shift count | exact integer equality; descriptive v0.7 output, not graph topology |

Raw probabilities remain binary64 in machine output. No tolerance-based
"near match" is promoted to preservation.

## Outcome rules

For each family/configuration/certificate across the five nonbaseline faithful
representations:

- `PRESERVED`: all five equal baseline;
- `PARTIALLY_PRESERVED`: one to four equal;
- `BROKEN`: none equal;
- `NOT_TESTABLE`: operator failure or certificate undefined.

For each matched base/counterfactual representation/configuration:

- `DETECTED`: certificate differs;
- `MISSED`: certificate is equal;
- `NOT_TESTABLE`: failure/undefined.

Family-level `PARTIALLY_DETECTED` is used only when a certificate detects some
but not all faithful representations/configurations.

Two-axis rates exclude only `NOT_TESTABLE`:

- HIGH: rate `>=0.80`;
- MEDIUM: `0.50 <= rate < 0.80`;
- LOW: rate `<0.50`.

These are descriptive classifications, not a combined score.
