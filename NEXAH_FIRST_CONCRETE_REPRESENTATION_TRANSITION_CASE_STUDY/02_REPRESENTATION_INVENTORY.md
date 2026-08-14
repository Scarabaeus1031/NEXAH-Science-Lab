# Representation Inventory

The labels below belong to this case study. Parenthetical names such as experiment `R0_baseline` are cross-references to the frozen implementation.

| ID | Representation and type | Shape / units / coordinates | Precision and artifact | Assumptions, uncertainty, contained information |
|---|---|---|---|---|
| R0 | Frozen synthetic model instance | four integer states; selected walk; 2D prototype plane; dimensionless | JSON numbers in protocol | Contains family/variant walk, repeats, dwell, prototypes and jitter rule; model choice, not measurement |
| R1 | Generated observation/source record | `x: N×2`, `labels: N`, `indices: N`; dimensionless prototype coordinates and discrete sample index | transient NumPy binary64/int64; reproducible from protocol/code | Contains current observation, latent oracle state and temporal order; deterministic sinusoidal jitter |
| R2 | Baseline feature package (experiment `R0_baseline`) | `N×2` current observations plus labels/indices | input hash and full downstream witness in results | Same coordinates as R1; packaging/selection only |
| R3 | One-step-delay feature package (experiment `R3_delay`) | `N×4 = [x_t, x_{t-1}]` plus labels/indices | binary64; input hash in every result cell | Product coordinates; first predecessor is `x_0`; current observation remains first two columns |
| R4 | Normalized baseline geometry | centered `N×2`, divided by one global RMS scalar; dimensionless | transient binary64, operator in runner | Pairwise distances scaled uniformly; mean and RMS are not serialized as a representation |
| R5 | Normalized delay geometry | centered `N×4`, divided by one global RMS scalar; dimensionless | transient binary64 | Euclidean geometry now mixes current and previous coordinates; same global-normalization convention |
| R6 | Baseline decoded/aligned state sequence | local cluster IDs, four medoid rows, aligned state IDs, overlap/correspondence; length N | int64/Python numerics; serialized in per-cell record | `k=4` is oracle-supplied; alignment uses latent labels after graph-blind decoding |
| R7 | Delay decoded/aligned state sequence | same contract as R6 | serialized in delay cells | Same decoder but different feature geometry; alignment cannot repair within-cluster state collisions |
| R8 | Baseline transition/certificate projection | two `4×4` count matrices plus C0–C6 certificates and fidelity fields | JSON integers/binary64-derived floats | Mathematical summaries derived from R6 and its latent labels; chronology absent from this projection |
| R9 | Delay transition/certificate projection | same contract as R8 | JSON in delay cells | Derived from R7; contains observed mismatches and collision metrics |
| R10 | Baseline/delay comparative aggregate | rates over 20 systems, mean fidelity values, certificate preservation | JSON binary64 summaries | Finite frozen-matrix aggregate; no population confidence model |
| R11 | Rule-bound scientific disposition | categorical labels and bounded prose | result/report strings | Introduces thresholds and analyst interpretation; synthetic, methodological, `NOT_ADOPTED` |

`REPRESENTATIONS_IDENTIFIED = 12`

No physical units, external coordinate reference system, or visual representation is present. Treating the final report as a visual representation would be artificial and is avoided.
