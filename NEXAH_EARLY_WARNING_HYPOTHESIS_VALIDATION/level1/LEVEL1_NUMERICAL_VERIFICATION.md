# Level-1 Numerical Verification

This is software/numerical verification, not hypothesis validation.

| Check | Result |
|---|---|
| A deterministic replay | PASS; byte-identical |
| B stochastic same-seed replay | PASS; byte-identical |
| C seed separation | PASS; seeds 1000 and 1001 have distinct trajectory hashes |
| D equilibrium residual | PASS; max absolute `5.551115123125783e-17` vs `1e-12` tolerance |
| E zero-sum gauge | PASS; residual `-2.7755575615628914e-17` vs `1e-12` tolerance |
| F balanced stress | PASS; `sum(q)=0`; maximum absolute total-power roundoff `2.220446049250313e-16` |
| G `dt` halving | Discrepancy reported without retuning: delta `9.135581180430563e-11`, omega `2.0204145593973738e-10` |
| H finite values | PASS; no NaN/Inf |
| I manifest identity | PASS; every artifact records exact frozen-manifest hash |
| J immutability | PASS; identical bytes recognized, non-identical collision blocked |
| K direct serialization | PASS; serialized raw arrays equal integrator-produced arrays |

The `dt=0.005` trace is quantitatively consistent with `dt=0.01` at the
reported discrepancies. A formal convergence PASS threshold was not invented:
the reviewed preregistration froze the repeat check but no raw-state numerical
acceptance tolerance. The later scientific numerical-sensitivity gate concerns
classification rates and lead, which this pass is forbidden to calculate.

The machine result is `verification/verification_result.json`. It explicitly
records `hypothesis_tested=false`, `scientific_outcome=NOT_COMPUTED`, and the
Python/NumPy runtime versions. No evaluation run was generated.
