# Region Definitions

The requested set expressions are well formed only after `H` is fixed:

- intersection: `I(theta)=P(theta) intersection H`;
- pentagon residual: `R_P(theta)=P(theta) setminus H`;
- inner-construction residual: `R_H(theta)=H setminus P(theta)`;
- union: `U(theta)=P(theta) union H`.

Their boundaries would be `boundary I(theta)`, `boundary R_P(theta)`, and `boundary R_H(theta)`.

These are templates, not computed objects. Because the region denoted by `H` is undefined, none of `I`, `R_P`, `R_H`, or `U` currently identifies a unique planar set.

No use of the word residual in this package implies a measured region.

