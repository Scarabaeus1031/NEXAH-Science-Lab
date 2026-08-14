# Operator and Transformation Model

| Kind | Contract |
|---|---|
| `DETERMINISTIC` | `R_j = T(R_i; theta)` for fixed inputs/environment |
| `STOCHASTIC` | `R_j ~ T(. | R_i, theta)` with RNG/distribution provenance |
| `ESTIMATED` | fitted operator `T_hat = A(D)`; training data and fit procedure required |
| `HUMAN_INTERPRETATION` | named person/role, rubric, and decision record required; never computational evidence |

Each operator records a name, version, implementation or mathematical definition, parameters, and assumptions. Assumptions have type `OPERATOR_ASSUMPTION` or `SCIENTIFIC_INTERPRETATION`; the latter cannot support computational verification.

Environment-sensitive deterministic code must disclose relevant library/version or mark reproducibility uncertainty. An unseeded random generator is `STOCHASTIC`, even if downstream functions are deterministic for a captured array.

Composite operators are references to ordered component edges, not silently flattened prose. Their preservation/loss claims require independent derivation or evidence.

