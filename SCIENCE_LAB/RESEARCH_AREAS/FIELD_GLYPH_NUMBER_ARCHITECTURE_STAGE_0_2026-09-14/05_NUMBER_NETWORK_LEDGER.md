# Number Network Ledger

## Purpose

This ledger separates exact arithmetic from position in a sheet, family membership, connector roles and authored names. It records the user's current anchors without promoting their relationships.

| Token | Exact arithmetic | Located role or observation | Current classification |
|---:|---|---|---|
| 13 | prime | reported sheet-1 connector candidate; also standard prime/index material | `EXACT_VALUE_PLUS_OWNER_REPORTED_ROLE` |
| 31 | prime | reported sheet-1 connector candidate; reversal of digit string `13` | `EXACT_VALUE_PLUS_OWNER_REPORTED_ROLE` |
| 97 | prime; 25th prime | Visual Equation Atlas exact register; endpoint of first 25 primes | `EXACT_REGISTERED_RELATION` |
| 101 | prime; next prime after 97 | Visual Equation Atlas exact register; first prime after the 1–97 list boundary | `EXACT_REGISTERED_RELATION` |
| 131 | prime | reported connector role on a later sheet | `EXACT_VALUE_OWNER_REPORTED_CONNECTOR_ROLE_UNBOUND` |
| 1031 | prime | left member of the exact `1031, 1032, 1033` sandwich; CIKADA/author marker history | `EXACT_VALUE_PLUS_AUTHORED_ASSOCIATION` |
| 1032 | `2^3 * 3 * 43` | center of the exact sandwich; owner label `TITAN` | `EXACT_COMPOSITE_PLUS_AUTHORED_ANNOTATION` |
| 1033 | prime | right member of the exact sandwich; author/project identity history | `EXACT_VALUE_PLUS_AUTHORED_ASSOCIATION` |
| 1087 | prime | appears as right-only prime in the `1085,1086,1087` six-k center classification | `CORRECTED_PRIME_NOT_COMPOSITE` |
| 3301 | prime | twin-prime relation to 3299; CIKADA marker and corpus label | `EXACT_ARITHMETIC_PLUS_AUTHORED_MARKER_NO_CICADA_SOLUTION` |
| 8701 | `7 * 11 * 113` | appears in owner-reported network and as composite in six-k classification | `EXACT_COMPOSITE_OWNER_REPORTED_NETWORK_ROLE_UNBOUND` |
| 11357 | `41 * 277` | CRT/NTO source anchor; grid/address and historical graph roles | `EXACT_COMPOSITE_MULTIPLE_REPRESENTATION_ROLES` |

## Corrections and nonclaims

- `1087` is prime. Any note calling it non-prime must be corrected at the truth-list layer while the historical wording remains preserved in source.
- `8701` is composite, not prime.
- `1031` and `1033` being prime around composite `1032` is exact. The name `TITAN` is an annotation, not an arithmetic property.
- `3299` and `3301` are twin primes. This does not solve Cicada 3301 or define a universal transition.
- A connector role for `13`, `31` or `131` requires a sheet identifier, frame, position and edge rule before it becomes a reproducible network statement.

## Candidate network record

```text
NumberNode = (
  numeric_value,
  sheet_id,
  frame_id,
  position,
  node_role,
  edge_rule,
  source_id,
  observed_at,
  evidence_status
)
```

## Family rule

A “prime family” must name the selection rule. Examples that are already mathematically typed include consecutive prime indices, twin-prime pairs, arithmetic progressions, residue classes and neighborhoods around `6k`. Visual proximity, digit reversal and author-selected association are separate possible relations and may not be merged into one family without an explicit operator.
