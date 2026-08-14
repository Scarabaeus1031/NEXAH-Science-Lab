# A5XE Attribution and Dominance Contract

Per carrier, A5XE derives within-seed Pearson direction from raw TEST coherence and binary carrier outcome. Fewer than two rows, zero coherence variance or zero outcome variance yields exactly zero. At least 21/30 directions must be nonnegative.

Baseline and augmented per-row log losses are derived from reconstructed probabilities. Each stored finite binary64 value is converted by exact `as_integer_ratio`; `g_s=(1/N)Σ(loss0-loss1)`, signed; `G=Σg_s`; top contributions sort exact `g` descending then seed ID ascending; `D3` is the exact top-three sum.

Well-formed `G<=0` or `2D3>G` is a valid scientific dominance failure and makes P4 false. Exact `G>0,2D3<=G` passes, including equality. Negative contributions are retained; no tolerance/division is used. Malformed evidence or fewer than three eligible seeds invalidates.

The A5 P4 registry is unchanged: T/F primary carriers are critical; the two single-view predictors and fusion carrier are mandatory report-only and cannot rescue/veto.
