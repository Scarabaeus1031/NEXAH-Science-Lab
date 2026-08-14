# A2 Prose / Machine Equivalence Contract

## Isomorphism rule

`A2_MACHINE_READABLE_RULES.yaml` is controlling machine-readable scientific metadata, not a summary. Every operative A2 prose rule must be represented by:

1. an exact value/formula/enum in YAML; or
2. an immutable V1 reference containing config ID, V1 composite, JSON path, and expected value.

Prose may explain rationale but may not add an unencoded scientific branch. YAML may not introduce a default absent from prose.

## Required anchor mapping

The static validator requires these prose anchors and matching YAML fields:

| Anchor | Machine field |
|---|---|
| `[A2-R01-COMPARE]` | `seed_dominance.decision.exact_comparison` |
| `N1 — action-label permutation/refit null` | `null_worlds.N1` |
| `N2 — within-seed field-rank permutation` | `null_worlds.N2` |
| `N3 — state/representation mismatch` | `null_worlds.N3` |
| `N4 — support-matched rank permutation` | `null_worlds.N4` |
| `p=(1+count(T_null>=T_observed))/201` | `monte_carlo.formula` |

## Static validator boundary

`contract_validation/validate_a2_contract.py` may read only A2 text/YAML supplied to it. It imports only Python standard-library modules. It cannot import V1/V2/V3 scientific packages, enumerate registered seeds, generate states, fit models, or write scientific artifacts.

It checks schema/value completeness and prose anchors. Its negative self-tests mutate only in-memory or temporary contract fixtures for:

- missing N1 population;
- missing N5 support quantile;
- repetition count 199;
- missing dominance comparison;
- prose/YAML N4 enum disagreement.

Passing static validation is necessary but not independent scientific acceptance.
