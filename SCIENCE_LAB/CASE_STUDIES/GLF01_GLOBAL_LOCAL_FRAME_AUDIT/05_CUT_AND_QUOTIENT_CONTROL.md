# 05 — Cut and Quotient Control

Three operations must remain separate.

## A. Remove a point

For `p in S^1`, the punctured circle `S^1 \ {p}` is homeomorphic to an open interval `(0,1)` and to `R`. This changes the object: compactness is lost and the cycle is opened. The removed point is absent.

## B. Choose a coordinate seam

The map `t -> exp(2πit)` restricted to `[0,1)` is a bijection onto `S^1`, but it is not a homeomorphism with the usual topology on `[0,1)`. The inverse has a discontinuity at the chosen seam. No circle point was removed; only the representation selected a discontinuity.

## C. Identify endpoints

M1 states that the quotient `[0,1]/(0~1)` is homeomorphic to `S^1`. Here the interval endpoints become one equivalence class. M2 gives the equivalent quotient representation `R/Z`.

```text
S1_EQUALS_ORDINARY_INTERVAL=NO
S1_MINUS_POINT_HOMEOMORPHIC_TO_OPEN_INTERVAL=YES
HALF_OPEN_PARAMETER_DOMAIN_BIJECTS_TO_S1=YES
HALF_OPEN_PARAMETER_DOMAIN_HOMEOMORPHIC_TO_S1=NO
ENDPOINT_QUOTIENT_HOMEOMORPHIC_TO_S1=YES
```

`CUT_EQUALS_POINT_REMOVAL=DOMAIN_DEPENDENT`: physical/mathematical removal does, a seam does not, and quotient gluing is a third construction.

