# A4 N1–N4 Null-World Contract

## Shared contract

Every family has slots 0..199. Fixed populations are the original jointly supported OOF validation rows and external test rows, including zero-action carriers. Original support membership is frozen; null-specific intersection, row deletion, or imputation is forbidden. Fits use TRAIN_OOF and statistics use TEST. Every slot must produce finite mean coherence, top-action agreement, and both carriers' coefficient/log-loss-gain statistics. Any missing/nonfinite/refit-impossible/no-donor slot is `INVALID_REPLICATE`, with no draw/retry/omit/NaN replacement, and mechanically makes the experiment `INVALID_EXPERIMENT`.

## N1

Per `(replicate,representation,training-seed)`, draw one uniform five-action permutation. The forward map is `π(action[j])=action[p[j]]`. TRAJECTORY stores the original path outcome under label `π(a)`; FIELD stores the path under `π(a)` and subtracts `Bπ(a)` before refitting every OOF fold and full fit. Predict canonical physical actions. Each null carrier is the null representation's top physical action using the frozen tie rule. Its outcome is selected directly by that physical label from the existing all-action terminal table; `π⁻¹` is never used for carrier selection/outcome. State, target, original support flags/models, row IDs, folds, and physical outcome table stay fixed. No physical simulation occurs.

## N2

Within each OOF-validation/test seed, permute complete original FIELD weak-rank vectors without replacement across canonical recipients. Donor assignment is output position `i <- p[i]`. All scores/margins/baseline covariates, trajectory ranks, support, carrier actions, and observed carrier outcomes remain fixed. Recompute coherence, top agreement, and augmented model only; baseline predictions remain primary frozen predictions.

## N3

Use the frozen bins/clockwise map. For every recipient independently, select uniformly with replacement from canonical FIELD-rank donors in the corresponding fixed split population that have a different seed and the same mapped phase bin and target quintile. One indexed draw selects one donor. Fixed/recomputed objects and carrier outcomes match N2. No donor invalidates the slot without draw or retry.

## N4

Use the A4 LOO cutpoints and merge rule. Construct `N4_T` from original T-carrier magnitude and `N4_F` from original F-carrier magnitude; both share repetition IDs but remain required subworlds. Within stored split/carrier/target/magnitude/merged-decile stratum, permute FIELD weak-rank vectors without replacement; recipient `i <- p[i]`. Fixed/recomputed objects and outcomes match N2. P1 requires both subworlds; T-carrier P3 uses N4_T and F-carrier P3 uses N4_F.

## Monte Carlo

For observed-greater statistic `T`, `k=count(T_null >= T_observed)`; ties are adverse; `p=(1+k)/201`; pass iff `p<=.025`, equivalently `k<=4`. The sorted descriptive 97.5% nearest-rank value is sorted by value then replicate ID and is element 195 one-based (index 194); it has no decision authority.

