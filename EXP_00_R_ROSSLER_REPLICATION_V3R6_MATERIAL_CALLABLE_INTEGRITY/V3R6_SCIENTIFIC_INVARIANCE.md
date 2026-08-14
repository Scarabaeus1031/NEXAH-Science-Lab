# V3R6 Scientific Invariance

V3R6 introduces no scientific choice. It wraps the unchanged V3R3/V3R5 scientific calculation with an integrity check; it does not replace or reimplement quantile.

Unchanged:

- estimand, P1–P5 and classification rules;
- evidence and schema contracts;
- registered seeds, population, nulls, sensitivities and bootstrap;
- Python 3.12.7 / NumPy 1.26.4 / OpenBLAS 0.3.21 runtime;
- authorization state and registered-input contract;
- canonical and alternate reference objects.

| Complete synthetic object | Observed SHA-256 | Frozen SHA-256 | Status |
|---|---|---|---|
| canonical | `aa7777ba26486f5acd594456240c2678c342678750248802bba67f02215ff454` | same | PASS |
| alternate | `c2bdfe097288c21c9c2eee963390ef185fcd11759161efcdf32143d0c93df364` | same | PASS |

No tolerance, regeneration, normalization change or alternate runtime was used.
