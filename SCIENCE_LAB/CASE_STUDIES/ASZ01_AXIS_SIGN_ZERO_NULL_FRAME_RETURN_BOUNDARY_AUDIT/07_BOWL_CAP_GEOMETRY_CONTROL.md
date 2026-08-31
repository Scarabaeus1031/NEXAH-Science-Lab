# Bowl / Cap Geometry Control

`BOWL`, `CUP`, and `CAP` begin as geometric or visual labels.

For the example graphs:

- `y=x^2` is concave upward;
- `y=-x^2` is concave downward;
- the transformation `y->-y` exchanges the two graph views.

This does not identify concavity with the sign of all values. Translating `y=x^2` vertically can make displayed values positive or negative without changing concavity. Rotating a curve can also change whether it remains the graph of a single-valued function in the selected axes.

Likewise, upper/lower hemisphere labels require a selected axis and view. Curvature sign requires a separately declared orientation/convention and cannot be inferred from the words bowl or cap alone.

Results:

- `BOWL_EQUALS_NEGATIVE=NO`
- `CAP_EQUALS_POSITIVE=NO`
- `BOWL_CAP_STATUS=GEOMETRIC_OR_VISUAL_ROLE_DEPENDENT`

