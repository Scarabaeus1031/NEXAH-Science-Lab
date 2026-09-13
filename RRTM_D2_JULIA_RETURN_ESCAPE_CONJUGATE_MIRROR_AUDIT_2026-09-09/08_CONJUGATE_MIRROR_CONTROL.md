# Conjugate-Mirror Control

For `f_c(z)=z²+c`:

`conj(f_c(z)) = conj(z²+c) = conj(z)²+conj(c) = f_conj(c)(conj(z))`.

The audit calculated `c_plus=-0.75+0.10i` and `c_minus=-0.75-0.10i` on the same 301×301 symmetric grid. Rows increase from imaginary coordinate -2 to +2. Vertical reversal of the `c_minus` array therefore implements coordinate conjugation.

- compared pixels: 90,601;
- integer escape-array mismatches after reflection: 0;
- mismatch fraction: 0;
- smooth escape comparison: not calculated (optional quantity).

Decision: `CONJUGATE_MIRROR_CONFIRMED`, `ESTABLISHED_COMPLEX_DYNAMICS`, and `NUMERICALLY_REPRODUCED`.

This is not a physical mirror effect.
