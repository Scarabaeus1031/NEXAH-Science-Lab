# A1 Per-Seed Dominance Adversarial Review

## Verdict

**PER-SEED DOMINANCE CONTRACT: FAIL.**

## Algebra

For carrier `c`, A1 defines `d_s=L0_s-L1_s` and `g_s=(n_s/N)d_s`. Therefore

`sum_s g_s = (1/N) sum_s sum_{i in s} [ell0_i-ell1_i]`,

which is exactly aggregate baseline mean log loss minus aggregate augmented mean log loss when the same held-out rows/probabilities are used. Row weighting and no per-seed refit are mathematically consistent with the frozen evaluation.

## Purpose assessment

Signed contributions make the ratio conservative under cancellation. For example, ten contributions of `+0.05` and ten of `-0.024` give `G≈0.26` and top-three ratio `≈0.577`, so the rule fails even though positive gains occur in ten seeds. This conflates dominance with adverse heterogeneity, but it is a defensible literal measure of how much the three largest seeds account for relative to net aggregate gain. That conservatism alone is not grounds for rejection.

## Blocking boundary inconsistency

A1 simultaneously states:

1. exactly `D3/G = 0.50` passes;
2. calculations use float64;
3. no tolerance is applied;
4. the stored ratio is compared directly with `<=0.50`.

For six equal contributions of decimal `0.1`:

- mathematical `D3=0.3`, `G=0.6`, ratio=0.5;
- float64 `D3=0.30000000000000004`, `G=0.6`;
- stored ratio=`0.5000000000000001`;
- mandated comparison returns failure.

Thus the exact equality rule and the numerical rule disagree. An implementer cannot honor both.

## Other adversarial cases

| Contributions | Result |
|---|---|
| twenty × `+0.01` | distributed gain; ratio≈0.15; PASS |
| `+0.10,+0.10,+0.10` plus seventeen ×`+0.001` | ratio≈0.946; FAIL_DOMINATED |
| ten ×`+0.05`, ten ×`-0.024` | cancellation ratio≈0.577; FAIL_DOMINATED |
| `+0.10,-0.10` | `G=0`; FAIL_AGGREGATE_NONPOSITIVE |
| negative G | FAIL_AGGREGATE_NONPOSITIVE |
| no endpoint variation but rows exist | log loss defined; included |
| zero eligible rows | excluded/reported; upstream support gate remains separate |
| tied contributions | seed-ID ascending tie break; deterministic |

The direct-float boundary is a mathematical contract defect requiring A2. This review does not select a tolerance, exact arithmetic, or alternative comparison.
