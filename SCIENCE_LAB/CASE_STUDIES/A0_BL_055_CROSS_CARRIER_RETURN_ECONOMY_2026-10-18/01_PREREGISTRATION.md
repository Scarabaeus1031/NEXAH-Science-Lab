# A0-BL-055 — preregistration

Date frozen: `2026-10-18`

## Primary question

Across the three declared carriers, do exact Return records reduce mean fixed-
width bit cost relative to the carrier's optimal fixed-width source ID on at
least two carriers?

## Equal-information contract

For each carrier:

```text
raw_bits = ceil(log2(source_count))
record_bits = fixed view/address bits + declared mean conditional residual bits
saving_bits = raw_bits - record_bits
advantage = saving_bits > 0
```

Only schemes returning every declared source count as exact may enter the
economy comparison. Joint views are encoded by an index over their realized
joint image, not by naively concatenating unused Cartesian code space.

## Frozen carrier selections

1. `A0-BL-024`: `P1_BALANCED_INDEX`; matched shuffled map is the equal-cost
   noncanonical control.
2. `A0-BL-025`: `C4` typed seam plus residual; `C0` is raw baseline and `C3`
   is the matched-address invalid-glue control.
3. `A0-BL-049`: ordered joint deletion view; each single deletion plus removed
   digit and the bijective swap are controls.

## Hypotheses

- `H_RETURN_GRAMMAR`: all three selected schemes achieve exact Return.
- `H_ECONOMY_GENERALIZES`: at least two of three carriers have positive mean
  fixed-width saving.
- `H_SPECIFICITY`: matched controls prevent interpreting exact Return or equal
  cost as canonicality or universal economy.

## Classification

- all Return fails → `FAIL_SHARED_RETURN_GRAMMAR`;
- all Return passes and economy passes on at least two carriers →
  `PASS_CROSS_CARRIER_RETURN_ECONOMY`;
- all Return passes but economy passes on fewer than two carriers →
  `MIXED_RETURN_GRAMMAR_PASS_ECONOMY_GENERALIZATION_FAIL`;
- any source/hash/contract failure → `INVALID_SOURCE_OR_CONTRACT`.

## Boundaries

No carrier identity, universal compression theorem, canonical map, physical
information measure, Human utility, historical intent, novelty or publication
claim follows.

