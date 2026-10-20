# A0-BL-046 — Frozen preregistration

Date: `2026-10-18`  
Status: `DESIGN_FROZEN / ADMITTED / ACTIVE_PENDING_LOCK`

## Frozen source and coordinate convention

The sole plate is archaeology attachment `ATT-008`, SHA-256
`242a2c47ac399438858f4eb66691d1aa139a8ea794bee0d8ff9147f0563e0b0a`,
724×1086 pixels. The image origin is its upper-left pixel; `x` grows right and
`y` grows down. Nominal label anchors are the manually audited centres of the
printed label boxes, recorded as integer pixels in `FROZEN_ANCHORS.json`.

The visible grid is used only to report normalized distances with declared
units `83 px` horizontally and `79 px` vertically. It is not assumed to be a
historical number decoder. Because the plate provides no point glyphs for the
numbers, choosing label centres is itself a measurement convention and limits
the result.

`XX` is decoded as Roman `20` only for the numeric comparisons. Both visible
occurrences of `57` remain separate occurrence records.

## Frozen candidate embeddings

For an integer `n`, compare plate-space pair-distance ranks with:

1. `DECIMAL_CUT = (floor(n/100), n mod 100)`;
2. `QRT20 = (floor(n/20), n mod 20)`;
3. `CRT_7_11 = (n mod 7, n mod 11)`;
4. `DIGIT_TRIPLET = (hundreds, tens, ones)` with zero padding.

No embedding may be changed or added after result exposure. Spearman
correlation over all 21 unordered occurrence pairs is the frozen score. This
tests only distance-order compatibility, not direction, origin, scale,
historical intent or a causal mechanism.

## Frozen controls and gates

- `G1 SOURCE`: exact external image hash and dimensions agree with the ledger.
- `G2 EXTRACTION`: seven occurrence IDs, values and in-bounds anchors are
  present; the two `57` records remain distinct.
- `G3 FUNCTION`: a number-only coordinate grammar must assign every equal
  integer to one coordinate within `8 px`. Distinct placements for equal
  values fail this gate.
- `G4 ARITHMETIC`: `537+57=594`, `537+37=574`, and `XX=20` as the declared
  Roman decoding are checked separately from geometry.
- `G5 SHUFFLE`: exhaust all 2,520 unique assignments of the same seven-value
  multiset to the frozen anchors. A candidate is selective only at an upper
  percentile of at least `0.95`.
- `G6 NEARBY`: apply common offsets `-5..-1,+1..+5` to every value and report
  all candidate scores. A grammar is not called unique when an undeclared
  nearby integer field is equally compatible.
- `G7 JITTER`: repeat the decision under 32 deterministic anchor jitters of at
  most ±4 pixels per axis. Classification must remain unchanged.

`UNIQUE_COORDINATE_GRAMMAR_SUPPORTED` requires every gate, no equal-value
placement conflict, and exactly one selective candidate. Any equal-value
conflict yields `UNDERDETERMINED_MULTIPLE_PLACEMENTS_FOR_SAME_VALUE`. Otherwise
failure to select exactly one candidate yields
`UNDERDETERMINED_CONTROL_NONSELECTIVE`.

## STOP and claim ceiling

Stop after one Primary and one exact Replay. No post-result anchor movement,
model addition, tolerance search, neon-plate extension or Pascal bridge.

The strongest possible result concerns only this plate and these four frozen
embeddings. It cannot establish historical intent, pyramid geometry, Base-40
semantics, a fractal, a Root-Room physical mechanism, Pascal identity, novelty,
utility or publication readiness.

