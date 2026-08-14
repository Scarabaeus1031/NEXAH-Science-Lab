# A4 P1–P5 Contract

All propositions are computed only after validity. Equality at a strict-positive boundary fails.

## P1 — above-null agreement

Both observed `mean_coherence` and `top_action_agreement` must independently have `k<=4` against each of N1, N2, N3, N4_T, and N4_F. P1 is the conjunction of all ten tests.

## P2 — positive reliability relation

For both T- and F-carrier primary models, the standardized coherence coefficient is `>0` and the seed-clustered 95% bootstrap interval lower endpoint is strictly `>0`. The interval is the NumPy 2.3.5 linear quantile at `.025,.975` of exactly 500 finite bootstrap coefficients. Coefficient-null p-values are mandatory diagnostics only.

## P3 — incremental held-out value

For both primary carriers: baseline-minus-augmented held-out log-loss gain is `>0`; augmented Brier is `<=` baseline Brier; gain has `k<=4` against N1, N2, N3 and its matching N4 subworld (T→N4_T, F→N4_F). P3 is their conjunction.

## P4 — attribution and seed stability

The exact classification-critical attribution registry for Rössler contains the two preregistered symmetric primary carrier analyses, T and F. Each must retain coefficient `>0` and log-loss gain `>0` in the frozen baseline-plus-coherence model containing both representations' best-score and top-two-margin controls.

There is no Rössler leave-one-representation coherence model: with only two representations, removal leaves no pairwise coherence. The preregistered TRAJECTORY-only and LEARNED_FIELD-only outcome predictors and equal-score-fusion carrier remain mandatory reported attribution diagnostics, but the preregistration explicitly makes fusion secondary and none supplies a coherence coefficient. They cannot pass, fail, rescue, or veto P4. This enumeration is a contract completion, not an added analysis.

For each primary carrier, per-seed direction is the frozen Pearson correlation of coherence and binary success within each test seed on eligible primary rows; fewer than two rows, zero coherence variance, or zero endpoint variance gives exactly `0.0`. At least 21 of the 30 registered test seeds must be `>=0` for each carrier. Separately, A2 exact signed row-weighted seed dominance must pass for both carriers: no three seeds exceed 50% of positive aggregate gain; exact half passes. Aggregate identity and all finite inputs are validity requirements.

P4 passes iff both carrier direction/gain checks, both 21/30 checks, both dominance checks, and score/margin-control inclusion checks pass. Continuous quality is report-only.

## P5 — sensitivity

Classification-critical sensitivity is exactly action amplitude `0.25` then `1.0`, one factor at a time. At each value and for both carriers, coefficient and log-loss gain must be strictly positive; bootstrap interval exclusion is required only at primary amplitude `.5`. P5 is their conjunction.

The remaining mandatory reported diagnostics are trajectory neighbors `15,50`; learned-field neighbors `60,160`; horizon `.5,1.5`; training halves `5000–5014,5015–5029`; support quantiles `.95,.995`, in that order. They must execute and report coefficient, gain, support, and provenance, but do not alter P5 or the Rössler label. No sensitivity may rescue a failed primary, and no result-dependent selection is permitted.

