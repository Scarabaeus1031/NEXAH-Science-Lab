# 06 — Composite Factorization Check

| n | Factorization | Parity | Ω(n) | ω(n) |
|---:|---|---|---:|---:|
| 98 | `2*7^2` | EVEN | 3 | 2 |
| 99 | `3^2*11` | ODD | 3 | 2 |
| 100 | `2^2*5^2` | EVEN | 4 | 2 |
| 102 | `2*3*17` | EVEN | 3 | 3 |
| 104 | `2^3*13` | EVEN | 4 | 2 |

All five registered numbers are composite by construction. Four are even; 99 is odd. `Omega` is 3 or 4, while `omega` is 2 except for 102, where it is 3. No stronger property is shared across all five beyond compositeness and the locally observed `Omega>=3`. The latter is descriptive for this bounded set, not a stable pattern or extrapolation.

```text
COMPOSITE_FACTORIZATIONS_VERIFIED = YES
COMMON_PREDECLARED_PROPERTY = COMPOSITE_ONLY
LOCAL_OMEGA_AT_LEAST_3 = YES_DESCRIPTIVE_ONLY
```
