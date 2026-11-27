# NEXAH ACR-42 — Diacritic / Casefold / Glyph-Composition Audit

## Scope

The audit separates Unicode representation, normalization, case operations and
font geometry. It does not infer linguistic history or operator semantics from
visual resemblance.

## Umlaut composition

For Ä, Ö and Ü, the precomposed representation and the base-plus-combining-
diaeresis representation have different codepoint sequences and different
UTF-8 bytes. NFC and NFD normalize each pair to the same canonical form.

Removing the combining mark yields A, O or U and changes the character record.
The diaeresis is therefore an identity modifier, not a discarded residual.

## Eszett

In the tested Unicode runtime:

```text
upper(ß) = SS
lower(ẞ) = ß
casefold(ß) = casefold(ẞ) = ss
```

Case transformation may therefore be one-to-one or one-to-two depending on the
operation. Casefold deliberately collapses distinctions for comparison.

## Greek contour control

Lambda, kappa, theta, omega, alpha and chi are each single Unicode codepoints;
their apparent stroke decomposition belongs to the rendered font contour.

Theta and all other uppercase Greek glyphs were normalized and raster-compared
in DejaVu Sans, DejaVu Serif, STIXGeneral and Latin Modern Math. Omega's
similarity rank among the 23 non-Theta alternatives is reported per font. This
blind comparison is only a coarse shape control. It cannot establish a
Theta-to-Omega cut without a specified cut and deformation operator.

## Decision

```text
UMLAUT_ENCODING = CANONICALLY_EQUIVALENT_DISTINCT_BYTE_REPRESENTATIONS
DIACRITIC_ROLE = COMBINING_MODIFIER_NOT_RESIDUAL
MARK_REMOVAL = IDENTITY_CHANGING
ESZETT_CASE_MAP = ONE_TO_ONE_OR_ONE_TO_TWO_DEPENDING_OPERATION
CASEFOLD = ß_AND_ẞ_CONVERGE_TO_ss
LAMBDA_KAPPA_STROKE_SPLIT = FONT_GEOMETRY_NOT_CODEPOINT_SPLIT
THETA_TO_OMEGA_CUT = NOT_ESTABLISHED_BY_UNICODE_OR_BLIND_SHAPE_RANK
GLYPH_SEMANTICS = REPRESENTATION_LAYER_ONLY
NEW_SCIENTIFIC_CLAIM = NO
```

## Reproduction

```bash
python run_acr42.py
```
