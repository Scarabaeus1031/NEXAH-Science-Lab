# Robustness–Discrimination Pareto Analysis

The two objectives are maximized separately. No scalar score, utility weights
or post hoc preference function is introduced.

## Frozen Study-3 points

| Certificate | R | D | Pareto status |
|---|---:|---:|---|
| C0 components | 0.990 | 0.017 | frontier endpoint; high robustness through severe compression |
| C1 binary support | 0.780 | 0.767 | frontier |
| C2 exact counts | 0.570 | 1.000 | frontier point, tied in R/D with C5/C6 |
| C3 count ranks | 0.760 | 0.950 | frontier; intermediate candidate |
| C4 probability bins | 0.570 | 0.900 | **dominated** by C2/C5/C6 and by C3 |
| C5 probabilities, 2 decimals | 0.570 | 1.000 | frontier point, R/D-equivalent to C2/C6 |
| C6 probabilities, 12 decimals | 0.570 | 1.000 | frontier point, R/D-equivalent to C2/C5 |

A certificate is dominated when another has at least as high R and D and is
strictly higher in one. Equal R/D coordinates do not establish equivalence of
retained content: C2, C5 and C6 differ in definition and collision counts even
though this matrix gives them the same objectives.

## Frontier interpretation

C0 remains mathematically nondominated only because it has the highest R. It
is scientifically unattractive for structural fidelity: D=0.017, two unique
R0 values among 20 systems and 154 collapsed system pairs show saturation.

C1 is a balanced frontier point but misses rare/asymmetric multiplicity-only
changes and falls below both frozen HIGH thresholds. C3 moves from C1's
`(0.780, 0.767)` to `(0.760, 0.950)`: a 0.020 robustness reduction accompanies
a 0.183 discrimination increase. Relative to full probabilities, C3 gains
0.190 robustness while giving up 0.050 discrimination.

Thus count ranks are supported as an **empirical intermediate/Pareto
candidate**. They are not an optimized solution, universal optimum or adopted
certificate. Selecting among frontier points requires an externally justified
application constraint or loss function; this synthesis supplies neither.

No point is HIGH/HIGH. C1 is numerically nearest to the `(0.8,0.8)` threshold
corner but fails both thresholds and has zero delay preservation. C3 clears D
but misses HIGH R by 0.040.
