# A1 Per-Seed Dominance Contract

## Purpose

Test whether a positive aggregate held-out log-loss improvement is carried by at most three test seeds. The statistic must decompose the exact frozen aggregate log loss.

## Population and predictions

Use the frozen primary jointly supported held-out population, including zero-action carrier selections, separately for each carrier. Use the same baseline and baseline-plus-coherence fitted models and held-out probabilities used for the primary log-loss comparison. Do not refit per seed.

For carrier `c`, seed `s`, and its eligible row set `I_{c,s}` of size `n_{c,s}>0`, with binary labels `y_i`, baseline probabilities `p0_i`, and augmented probabilities `p1_i`, define binary log loss

`ell(y,p) = -[y log(p) + (1-y) log(1-p)]`,

using the same frozen probability clipping as the primary analysis (`p` clipped to `[1e-15,1-1e-15]`).

Per-seed losses are

`L0_{c,s} = (1/n_{c,s}) sum_{i in I_{c,s}} ell(y_i,p0_i)`

and

`L1_{c,s} = (1/n_{c,s}) sum_{i in I_{c,s}} ell(y_i,p1_i)`.

The signed per-seed gain is

`d_{c,s} = L0_{c,s} - L1_{c,s}`.

No clipping is permitted. Negative values remain negative.

## Exact aggregate decomposition

Let `N_c = sum_s n_{c,s}`. Define the row-weighted contribution

`g_{c,s} = (n_{c,s}/N_c) d_{c,s}`.

Then

`G_c = sum_s g_{c,s}`

must equal the primary carrier's held-out baseline-minus-augmented log-loss improvement to numerical tolerance `1e-12` absolute. Failure of this identity is an implementation/provenance failure and blocks classification.

## Top-three dominance

Sort contributing seeds by descending `g_{c,s}`. Ties are broken by ascending integer seed ID. Let `S3_c` be the first three seeds and

`D3_c = sum_{s in S3_c} g_{c,s}`.

The carrier dominance result is:

- `FAIL_AGGREGATE_NONPOSITIVE` if `G_c <= 0`; no ratio is computed;
- otherwise `R_c = D3_c/G_c`;
- `PASS` iff `R_c <= 0.50`;
- `FAIL_DOMINATED` iff `R_c > 0.50`.

Exactly 0.50 passes. No tolerance is applied to the scientific boundary; calculations use float64 and the stored ratio is compared directly.

Both carriers must pass for the frozen replication seed-stability criterion to pass.

## Edge cases

- Seeds with eligible rows but no endpoint variation remain included; log loss is defined. Their separate within-seed association direction is recorded as zero under the existing convention and is not substituted into dominance.
- Seeds with zero eligible rows are excluded from `N_c`, have no `g_{c,s}`, and are reported as noncontributing. Support validity remains a separate prerequisite.
- Fewer than three contributing seeds is invalid under the frozen support gate; if encountered, classification is unreachable.
- If aggregate gain is zero or negative, dominance fails; positive seed contributions cannot rescue P3.
- Negative seed gains remain in `G_c` and may make `R_c>1`; this correctly records that the top seeds overcome harm elsewhere.
