# Two-Axis Frame Control

Use an oriented Cartesian frame with origin `O`, basis axes `x,y`, and coordinate directions `-x,+x,-y,+y`.

| Transformation | Coordinate action | What changes | What survives |
|---|---|---|---|
| x-axis orientation reversal | `(x,y)->(-x,y)` | left/right sign labels | origin, distances, incidence |
| y-axis orientation reversal | `(x,y)->(x,-y)` | up/down sign labels | origin, distances, incidence |
| 90° rotation | `(x,y)->(-y,x)` | axis assignment and directional labels | distances, angles, orientation for active proper rotation |
| 180° rotation | `(x,y)->(-x,-y)` | both signed coordinate labels | origin, distances, angles |
| origin translation by `(a,b)` | `(x,y)->(x-a,y-b)` | coordinates, signs, zero-coordinate point | differences between points, geometry under consistent transformation |

Results:

- `LEFT_EQUALS_NEGATIVE=CONVENTION_DEPENDENT`
- `RIGHT_EQUALS_POSITIVE=CONVENTION_DEPENDENT`
- `UP_EQUALS_POSITIVE=AXIS_CONVENTION_DEPENDENT`
- `DOWN_EQUALS_NEGATIVE=AXIS_CONVENTION_DEPENDENT`

The conventional diagram is valid as a selected view. It is not an intrinsic labeling of the underlying plane.

