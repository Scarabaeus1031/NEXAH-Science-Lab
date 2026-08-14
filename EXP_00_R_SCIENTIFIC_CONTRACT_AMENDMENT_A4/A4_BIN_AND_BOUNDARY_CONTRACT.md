# A4 Bin and Boundary Contract

## Phase and N3

Finite binary64 `(x,y)` enters NumPy 2.3.5 `atan2(y,x)`. Binary64 π is `0x1.921fb54442d18p+1`; exact `+π` is replaced by `-π`, giving `[-π,π)`. The nine exact hexadecimal edges in the machine contract define left-closed/right-open bins. Right insertion among seven internal edges assigns equality to the higher index and both signed-zero negative-axis cases to bin 0.

Increasing phase-bin index is counterclockwise. Geometric **CLOCKWISE** means decreasing polar angle. For empty bin `b` within target quintile `q`, search `(b-d) mod 8` for `d=1..7` and use the first nonempty training bin. Nonempty bins map to themselves; all-empty invalidates before repetition.

## Quantiles

All cutpoints use finite binary64 values in canonical complete-training-row order and NumPy 2.3.5 `quantile(method="linear")`. Target probabilities are `.2,.4,.6,.8`; support probabilities are `.1` through `.9`. Cutpoints are stored as exact binary64 hex. Assignment uses right insertion: equality is right of every equal cutpoint; repeated cutpoints create retained empty intermediate bins. Minimum is bin 0; maximum is the final bin. Nonfinite input/cutpoint invalidates.

## N4 distance and merge

**NEW PROSPECTIVE SCIENTIFIC CHOICE:** each complete-training row contributes the minimum Euclidean distance in training-standardized coordinates to another training row, excluding its identical diagonal entry. This is the full-training leave-one-out vector used by the support-threshold construction—not self-inclusive zeros and not OOF-fold distances. N4 support decile cutpoints come only from this vector.

Each fixed TRAIN_OOF or TEST recipient is binned by its original, pre-null `nearest_training_distance` covariate from the frozen primary record: OOF recipients retain distance to that fold's training library; TEST recipients retain distance to the full training library. Cutpoints stay the full-training LOO cutpoints above. The mismatch is intentional: cutpoints define a training-only reference scale while records retain their leakage-free frozen covariate.

Within split/carrier/target-bin/magnitude subgroup, start with deciles 0..9. Scan original deciles ascending. A nonempty group of size `<10` merges with the smallest strictly higher current group; if none, with the greatest strictly lower current group. Restart the ascending scan after every merge until all nonempty groups have size at least 10. Empty groups remain absent. Total subgroup `<10`, no legal recipient, or no solution invalidates the experiment before repetitions. Labels list original member deciles ascending. There is no phase wrap in N4.

Boundary fixtures are specified in `A4_DETERMINISTIC_CONTRACT_FIXTURES.md`.

