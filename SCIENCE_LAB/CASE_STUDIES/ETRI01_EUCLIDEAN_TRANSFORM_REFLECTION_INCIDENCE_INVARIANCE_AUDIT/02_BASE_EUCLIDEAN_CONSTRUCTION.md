# Base Euclidean Construction

Work in `R²` with the standard Euclidean metric. Choose `h>0` and real numbers `x_A<x_P<x_B`.

```text
L0={(x,0):x in R}
L1={(x,h):x in R}
A=(x_A,0)
B=(x_B,0)
P=(x_P,h)
```

Then `L0 || L1`, `A,B` lie on `L0`, `P` lies on `L1`, and segments `PA`, `PB`, `AB` form a nondegenerate triangle.

Define:

- `a=angle(PAB)`, the interior angle at `A`;
- `b=angle(ABP)`, the interior angle at `B`;
- `y=angle(APB)`, the interior apex angle.

All are unsigned Euclidean angles in `(0,pi)`.

By the Euclidean triangle-angle theorem,

```text
a+y+b=pi=180°.
```

This is symbolic and holds for the entire declared family. No special angle or optimized coordinate choice is used.

`BASE_CONSTRUCTION_VALID=YES`

`PARALLEL_RELATION_REGISTERED=YES`

`TRIANGLE_ANGLE_SUM_SUPPORTED=YES_STANDARD_EUCLIDEAN_GEOMETRY`
