# Positive Controls

## PC1 — Reflection preserves distance

Orthogonality of the reflection matrix preserves vector norms. Passed.

## PC2 — Reflection preserves unsigned angle magnitude

Dot products and norms are preserved, hence normalized dot products are preserved. Passed.

## PC3 — Reflection reverses orientation

The reflection determinant is `-1`. Passed.

## PC4 — Two reflections compose to rotation

Reflections across intersecting axes at angle `theta` compose to rotation by `2theta`; perpendicular coordinate axes give a half-turn. Passed.

## PC5 — Shear destruction

The declared affine shear preserves parallelism but maps a right angle to `45°`. Passed.

## PC6 — Altitude partition

The interior perpendicular ray partitions `y` into `y_L+y_R` while the original triangle-angle sum remains `a+y+b=180°`. Passed.

`POSITIVE_CONTROLS=6_OF_6_PASSED`
