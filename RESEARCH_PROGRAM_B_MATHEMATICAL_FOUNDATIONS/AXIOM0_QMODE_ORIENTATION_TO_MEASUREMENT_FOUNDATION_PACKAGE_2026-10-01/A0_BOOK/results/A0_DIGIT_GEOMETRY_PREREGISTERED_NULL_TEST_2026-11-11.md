# A0 Digit Geometry — preregistered null audit

**Frozen:** 2026-11-11, before generation or inspection of decimal digits 501–1500
**Class:** bounded reproducibility and falsification audit over an existing finite instrument
**Identity:** reuse `NEXAH_AX0_QMODE_FOUNDATION_PACKAGE`, `ART:A0:MATHEMATICAL_JOINTS`, `NEXAH:A0_ORIENTATION_EVIDENCE_LINEAGE:V1`
**Graph delta:** nodes 0 · relations 0 · aliases 0
**Authority effect:** no Study activation, canonical Finding, claim-ceiling change or publication authorization

## Frozen question

Does the synchronous five-digit block alignment of `π`, `e`, `φ` and `√2`
produce a barycentric inside-count that is unusually high or low relative to
comparison populations that preserve the same finite block geometry but break
cross-constant synchrony?

The first 500 decimal digits are exploration data and are excluded from the
confirmatory decision. Their frozen prefix SHA-256 values are:

- `π`: `8001c8d5d496f3f763d0fd3cca5af6c2992c6f4c033c333f3907e3b86301d9fd`
- `e`: `1f4db92d2326b73906c56652a2a3a54426c63c6b36b7f58eac3598c2749c9e8e`
- `φ`: `39a2a382410a4765e4d5ac53b56f889a537b2808fe7e43577c9aebddf758384b`
- `√2`: `24c27b60bbb174a65e0a836e452a24eae0e45321c86e1fefce641f8cda02e17e`

## Frozen selector

1. Generate at least 1,508 decimal digits of all four constants with a
   deterministic high-precision decimal implementation.
2. Holdout H1 is decimal positions 501–1000; replication H2 is positions
   1001–1500. Each contains 100 consecutive, non-overlapping five-digit
   frames. No frame is selected by its value.
3. Within each frame, digit `d_j` has radius `d_j/9` and fixed angle
   `−π/2 + 2πj/5`, for `j=0…4`. The arithmetic centroid is the frame point.
4. Subtract the `π` centroid from the centroids of `e`, `φ` and `√2`.
5. The sole primary statistic is `S_inside`: the number of frames in which
   the origin lies strictly inside their triangle. Barycentric tolerance is
   fixed at `1e-12`. Boundary and degenerate cases never count as inside.

No digit sum, bridge distance, triangle area, frequency, angle, 444-Hz label,
RGB role or visually selected frame enters the decision statistic.

## Comparison populations

All Monte-Carlo populations use exactly 100,000 replicates and the fixed
32-bit seed `0xA0112026`.

### N1 — independent circular block shifts (primary)

Keep the 100 `π` blocks in order. Independently circularly shift the 100-block
sequences of `e`, `φ` and `√2`; calculate `S_inside`. This preserves every
five-digit block and every within-constant cyclic order while breaking only
the declared synchronous alignment.

### N2 — independent block permutations (adversarial comparison)

Keep the 100 `π` blocks in order. Independently Fisher–Yates-permute the 100
blocks of `e`, `φ` and `√2`; calculate `S_inside`. This preserves every block
geometry and each constant's block multiset while also breaking serial order.

For each population report its mean, median, standard deviation, 0.5%, 1%,
99% and 99.5% quantiles. The empirical two-sided p-value is
`min(1, 2 × min(P_null(S≤S_obs), P_null(S≥S_obs)))`, with the observed sample
included through the standard plus-one correction.

## Offset controls

For H1 repeat the same selector from starts 502, 503, 504 and 505, using the
99 complete five-digit frames available in positions through 1000. These are
robustness controls only; none may replace the offset-0 primary result.

## Frozen falsifier and decision rule

The stronger statement `SYNCHRONOUS_ALIGNMENT_EXCEEDS_NULL` is retained only
if every gate passes:

1. H1 has two-sided `p ≤ 0.01` under both N1 and N2.
2. H2 independently has two-sided `p ≤ 0.01` under both N1 and N2.
3. The signed deviations from the respective null medians have the same sign
   in H1 and H2.
4. `|z| ≥ 2.5` against both null populations in both holdouts.
5. At least three of four H1 offset controls have the same deviation sign as
   offset 0, and no offset control is significant at `p ≤ 0.01` in the
   opposite direction.

If any gate fails, the stronger statement is falsified for this operator and
these declared holdouts. The result may still describe the finite fixture but
must not be presented as evidence of constant identity, digit normality,
randomness, physical coupling or a universal law.

## Output contract

The runner must emit the preregistration SHA-256, constant-prefix checks,
holdout hashes, observed statistics, both null summaries, all offset controls,
gate-by-gate outcomes and the final verdict. No parameter may be changed after
the preregistration hash is computed.
