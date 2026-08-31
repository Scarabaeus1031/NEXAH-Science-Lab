# GPT-01 — 6 ↔ 9 Transformation Test

The predeclared transformation is a global 180° rotation of the frozen glyph
mask. No translation, deformation or manual alignment is allowed.

```text
IoU(rot180(G6), G9) = 0.986397
threshold exact      = 0.98
threshold approximate= 0.75
```

Result:

```text
GLYPH_TRANSFORMATION_SUPPORTED = YES
ARITHMETIC_RELATION_DERIVED = NO
```

The result is font-representation evidence only. It does not relate the integer
6 to the integer 9 and makes no use of `6=2×3` or `9=3²`.
