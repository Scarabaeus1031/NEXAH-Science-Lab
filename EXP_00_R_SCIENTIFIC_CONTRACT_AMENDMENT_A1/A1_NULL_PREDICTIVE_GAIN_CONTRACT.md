# A1 Null / Predictive-Gain Contract

## Scope

This contract maps N1–N5 outputs to the already frozen P1–P3 propositions. It introduces no endpoint and does not merge the propositions.

## Stochastic null families

N1 action-label permutation, N2 within-seed learned-field rank permutation, N3 state/representation mismatch, and N4 support-matched permutation each execute exactly 200 repetitions using their frozen transformations and RNG namespaces.

Every repetition must produce:

- `mean_coherence` on the applicable fixed primary agreement population;
- `top_action_agreement` on that population;
- `coherence_coefficient[trajectory]` and `[learned_field]` from the frozen primary model pipeline;
- `log_loss_improvement[trajectory]` and `[learned_field]` from frozen held-out baseline versus augmented predictions.

Missing/nonfinite statistics make the null family incomplete and therefore the experiment invalid; no repetition may be dropped or replaced.

## One-sided comparison

For any statistic where larger is the preregistered direction, with observed value `T_obs` and 200 null values `T_1,...,T_200`, define

`k = sum_{b=1}^{200} 1[T_b >= T_obs]`

and

`p_MC = (1+k)/201`.

Ties count against the observed result. The observed statistic exceeds the null family iff `p_MC <= 0.025`, equivalently `k <= 4`.

Also report the sorted null values and empirical 97.5th percentile using the nearest-rank definition `T_(ceil(0.975*200)) = T_(195)` with one-based ascending order. This percentile is descriptive; the exact decision is the Monte Carlo p-value above.

## Proposition mapping

### P1 — above-null agreement

P1 passes iff both observed `mean_coherence` and observed `top_action_agreement` exceed each of N1, N2, N3, and N4 by the exact Monte Carlo rule.

Failure of either statistic for any family makes P1 false. It is not invalidity if the null family is complete.

### P2 — positive reliability relation

P2 remains unchanged: for both carriers the observed standardized coherence coefficient is positive and its seed-clustered 95% interval excludes zero in the positive direction.

Carrier-specific coefficient null distributions are mandatory diagnostics. Their p-values are reported but do not add a null gate to P2 and cannot rescue or veto P2.

### P3 — incremental held-out value

For each carrier, P3 requires all of:

1. observed held-out log-loss improvement is strictly positive;
2. augmented Brier score is no worse than baseline Brier score;
3. observed log-loss improvement exceeds each of N1, N2, N3, and N4 by the exact Monte Carlo rule.

Both carriers must satisfy all three. A complete null comparison failure makes P3 false, not invalid.

## N5 mapping

N5-SYNTH is a pre-execution implementation gate. N5-RUN is an experiment-validity gate. N5 produces no stochastic null distribution and affects none of P1, P2, or P3 directly.

## Controlling phrase

After A1, “primary predictive gain exceeds all required nulls” means only:

> For both frozen carrier analyses, observed held-out baseline-minus-augmented log-loss improvement has one-sided Monte Carlo p-value at most 0.025 against each complete N1–N4 null distribution.
