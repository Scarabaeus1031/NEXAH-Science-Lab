# Prime Cube / Origami Splinter Transport Adapter

Date: 2026-11-23  
Class: bounded formal-design note  
Identity effect: reuse only; `0` new IDs, `0` relations, `0` aliases

## Question

What is preserved when the same column-wise label displacement is applied to both rows of the retained Splinter 2×3 chassis?

## Source chassis

```text
top       1   8  11
bottom   33  27  22
gap      32  19  11
```

The retained fold axis is `8↔27`; its outer pairs are `1↔11` and `33↔22`.

## Wandering transform

Apply `δ=[-1,+1,-1]` to both rows:

```text
top       0   9  10     sum 19
bottom   32  28  21     sum 81
gap      32  19  11     total 100
```

Exact observations:

- all vertical gaps are invariant because `(bᵢ+δᵢ)−(tᵢ+δᵢ)=bᵢ−tᵢ`;
- equal outer deltas preserve the declared reflection pairing;
- the fixed axis migrates from `8↔27` to `9↔28`;
- all six output labels are distinct;
- the transform is not sum-preserving: each row changes by `−1`.

## Conservation control

The zero-sum vector `δ₀=[-1,+2,-1]` gives:

```text
top       0  10  10     sum 20
bottom   32  29  21     sum 82
gap      32  19  11     total 102
```

This preserves the two row sums, the total and the vertical gaps, but it maps two top positions to label `10`. It fails injectivity and therefore cannot serve as a six-address relabeling.

## What the test teaches

There are at least three independent properties:

1. column-gap preservation depends on applying the same delta above and below;
2. fold-pair preservation depends on equal outer deltas;
3. address validity depends on injectivity.

Conservation is a fourth property and does not imply injectivity. The two tested vectors separate these properties cleanly.

## Source and authority boundary

The existing Experience demonstrator remains the separate Origami/Splinter source:

`40 EXPERIENCE PRODUCTION/NEXAH-Experience/public/review-assets/scc-003-r1/demonstrators/origami-splinter-fold.html`

Prime Cube adds only a typed, source-linked integer-label transport lens. The output labels are not promoted to prime anchors, a physical folding law, a common carrier, a new scientific identity or a publication claim.
