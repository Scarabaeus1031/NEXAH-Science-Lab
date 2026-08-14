# A5 Seed-Dominance Identity Contract

A5 preserves A2's estimand. For each carrier, use frozen primary rows and already-fitted primary baseline/augmented probabilities; do not refit per seed. Clip probabilities by the frozen rule, compute each row's two finite IEEE-754 binary64 log-loss values, and convert each stored value with the exact operation `float.as_integer_ratio()`.

For carrier `c`, eligible seed `s`, total carrier rows `N_c`, and canonical rows `I_cs`, compute with arbitrary-precision reduced rational arithmetic:

`g_cs = (1/N_c) * sum_i(q(loss0_i) - q(loss1_i))`.

Store each rational as `{numerator: integer, denominator: positive integer}` in lowest terms. Set `G_c = sum_s g_cs` by exact rational addition. This identity is construction, not a comparison against a separately rounded primary metric. Rank all signed `g_cs` descending, breaking exact ties by ascending seed ID, and let `D3_c` be the exact sum of the first three.

Fewer than three eligible seeds is `INVALID_EXPERIMENT`. Nonfinite inputs are invalid. If exact `G_c <= 0`, dominance fails. If `G_c > 0`, pass iff exact `2*D3_c <= G_c`; exact equality passes. There is no tolerance, epsilon, division, float aggregate, or approximate comparison. Both carriers must pass P4.

