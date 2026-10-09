# NEXAH ACR-41 — Greek Seven-Variant Glyph Grid Audit

## Scope

This audit tests the supplied 24-row Greek uppercase/lowercase/name chart. It
does not infer operator semantics from letter shapes.

## Source inventory

Exactly seven rows display two lowercase forms:

| Position | Letter | Forms | Typing note |
|---:|---|---|---|
| 5 | Epsilon | ε / ϵ | typographic/math-symbol variant |
| 8 | Theta | θ / ϑ | typographic/math-symbol variant |
| 10 | Kappa | κ / ϰ | typographic/math-symbol variant |
| 16 | Pi | π / ϖ | typographic/math-symbol variant |
| 17 | Rho | ρ / ϱ | typographic/math-symbol variant |
| 18 | Sigma | σ / ς | contextual medial/final form |
| 21 | Phi | ϕ / φ | typographic/math-symbol variant |

All fourteen displayed forms use distinct Unicode code points. They are grouped
under seven letter records in the source chart. Sigma is a special case: final
sigma is position-dependent, not merely a freely interchangeable stylistic form.

## Combinatorial structure

Within the seven-row subset:

```text
Epsilon · Theta · Kappa | Pi | Rho · Sigma · Phi
          3             | 1  |          3
```

Removing Pi and pairing in sequence order gives:

```text
ET | KR | SP
```

Reflection about the Pi pivot gives:

```text
E–Phi | Theta–Sigma | Kappa–Rho
```

`Kappa–Rho` is the only pair shared by both pairings.

## Font control

The fourteen code points were rendered with DejaVu Sans, DejaVu Serif,
STIXGeneral and Latin Modern Math. Every tested pair produced distinct nonempty
paths. This verifies graphical distinction in those fonts, not a font-invariant
topology.

## Decision

```text
SEVEN_VARIANT_ROWS = VERIFIED_FOR_SOURCE_GRID
THREE_ONE_THREE_WITH_PI_CENTER = VERIFIED
ET_KR_SP_PARTITION = VALID_AFTER_REMOVING_PI
KR_PAIR_INVARIANT_BETWEEN_TWO_PAIRINGS = VERIFIED
PAIR_IDENTITY = SAME_LETTER_RECORD_DISTINCT_CODEPOINTS
SIGMA_STATUS = CONTEXTUAL_NOT_FREE_STYLE
FONT_GEOMETRY = DISTINCT_BUT_FONT_DEPENDENT
OPERATOR_MEANING_FROM_GLYPHS = NOT_ESTABLISHED
NEW_SCIENTIFIC_CLAIM = NO
```

## Reproduction

```bash
python run_acr41.py
```
