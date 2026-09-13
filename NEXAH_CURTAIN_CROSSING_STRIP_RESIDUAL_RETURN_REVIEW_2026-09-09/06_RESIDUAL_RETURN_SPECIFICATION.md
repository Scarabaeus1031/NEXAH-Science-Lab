# Residual-Return Specification

Residuals are typed discrepancies, never free-standing colors.

| residual type | admissible definition example | required reference/alignment |
|---|---|---|
| phase | `r^θ_k=wrap(θ(t_k)-θ_ref(t_k))` | circular convention, phase plane, reference |
| time | `r^t_k=t_k-t^ref_k` or matched-event distance | event correspondence rule |
| state/space | `r^x_k=A x(t_k)-x^ref_k` | coordinate transform `A`, units |
| projection | `r^π_k=π(x(t_k))-z^ref_k` | projection and information-loss record |
| overlap | `1-IoU(A_k,A^ref_k)` or declared set metric | sets, threshold and domain |
| model | `r^m_i=y_i-h(x_i;η)` | model/version, fitted-data boundary |

For circular phase, ordinary subtraction near the seam is invalid without wrapping. A return is successful only relative to a frozen comparator and tolerance; it is not implied by recurrence or visual overlap.

Across Lorenz, Rössler and Halvorsen, the same formula can produce residues, but its meaning depends on separately fitted PCA axes, selected phase planes, scaling and event rules. The existing audit establishes only portability of some procedures.

`SAME_SENSOR_GRAMMAR != SAME_DYNAMICS != SYNCHRONIZATION`

Small or negative “sync” values cannot establish convergence without a defined synchronization error, coupled systems, asymptotic/finite-time criterion, null and uncertainty. Observer-based synchronization itself requires a drive-response/observer contract; a same-colored overlay is not such a contract.

