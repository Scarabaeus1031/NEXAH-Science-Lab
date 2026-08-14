# A2 Prose ↔ Machine Isomorphism Audit

## Verdict

**PROSE ↔ MACHINE ISOMORPHISM: FAIL.**

The JSON-compatible YAML parses, but it is not a lossless machine representation of accepted A1 plus A2.

## Field audit

| Operative rule | Prose authority | A2 machine | Result |
|---|---|---|---|
| exact rational seed arithmetic and `2D3<=G` | A2 R-01 | explicit | MATCH |
| fixed train/test populations and original support | A2 null contract | explicit | MATCH |
| N1 action/outcome/no-simulation | A2 null contract | explicit | MATCH, but permutation direction absent in both |
| N2–N4 observed carrier outcomes | A2 null contract | explicit | MATCH |
| invalid repetition, no retry/replacement | A2 null contract | explicit shared rule | MATCH |
| N3 phase/quintile/merge semantics | A2 null contract | explicit enum | MATCH internally, but conflicts with V1 and remains boundary-incomplete |
| N4 merge/subworld/P mapping | A2 null contract | explicit | MATCH |
| Monte Carlo formula, ties, alpha, `k<=4` | accepted A1/A2 | explicit | MATCH |
| P1, P2 diagnostic-only, P3 matching carriers | accepted A1/A2 | explicit | MATCH |
| accepted A1 nearest-rank 97.5th-percentile descriptive output | A1 null contract | absent; no immutable reference | **OMITTED** |
| N5 first 12 lexicographically sorted transforms | accepted A1 | count/order only; no first-12 selection | **OMITTED** |
| N5 synthetic action-conditioned paths from every training grid point | accepted A1 | absent | **OMITTED** |
| N5 minimum over representations × queries × transforms | accepted A1 | threshold only; aggregation universe absent | **OMITTED** |
| RNG algorithm for extended namespaces | required for A2 null realizations | absent in prose and machine | **INCOMPLETE IN BOTH** |
| quantile/phase cutpoint membership | required for exact strata | absent in prose and machine | **INCOMPLETE IN BOTH** |
| canonical permutation/donor ordering | required for deterministic draws | absent in prose and machine | **INCOMPLETE IN BOTH** |

## Reverse audit

No machine-only scientific threshold or endpoint was found that contradicts A2 prose. The failure is one-way omission plus shared under-specification, not an extra machine default.

## Static validator boundary

The supplied validator checks selected literal values and anchor substrings. It does not establish field-by-field isomorphism. It accepted material mutations to carrier outcome, N1 support, N3 donor/merge rules, N4 merge/minimum/carrier mapping, retry policy, N5 stage order, and P2 diagnostic status.
