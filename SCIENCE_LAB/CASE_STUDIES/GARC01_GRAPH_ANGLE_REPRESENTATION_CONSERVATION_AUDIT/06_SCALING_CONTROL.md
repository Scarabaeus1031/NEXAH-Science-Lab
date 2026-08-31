# Scaling Control

For uniform positive scaling `T(x)=s x`, `s>0`:

```text
(su) dot (sw) = s^2(u dot w)
|su||sw| = s^2|u||w|
```

so the cosine and angle are unchanged. Lengths are multiplied by `s`.

For `s<0`, the map combines positive scaling with a half-turn; unsigned angles remain unchanged. For `s=0`, all points collapse and no embedding or local angle remains.

Nonuniform scaling is not a similarity. For example `diag(2,1)` generally changes angles, even while preserving the abstract graph.

`ANGLES_PRESERVED_UNDER_UNIFORM_SCALING=YES_FOR_POSITIVE_SCALE`

`UNIFORM_SCALING_PRESERVES_LENGTH=NO_SCALES_BY_FACTOR`

`NONUNIFORM_SCALING_PRESERVES_ANGLES=NO_IN_GENERAL`
