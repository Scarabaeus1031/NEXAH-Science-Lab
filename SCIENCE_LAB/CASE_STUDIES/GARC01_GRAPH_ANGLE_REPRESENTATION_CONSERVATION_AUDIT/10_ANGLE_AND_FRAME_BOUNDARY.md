# Angle and Frame Boundary

## Required distinctions

```text
edge incidence != embedded direction
embedded direction != absolute compass direction
unsigned angle != signed angle
local angle != global orientation
graph distance != Euclidean distance
source geometry != projected geometry
measured pixel angle != exact model angle
```

A local unsigned angle is invariant under translation, rotation, reflection and uniform scaling, but not under arbitrary affine distortion. A signed angle needs an orientation convention and changes sign under reflection.

Statements such as left/right, clockwise/counterclockwise, positive/negative direction, horizontal/vertical and absolute bearing require a named frame. They are not supplied by the graph.

The ASZ-01 boundary therefore survives: sign, direction, axis, frame and view must remain distinct. The IJQ-01 boundary also survives: multiple views do not establish extra algebraic dimensions.

`DIRECTION_EQUALS_AXIS=NO`

`AXIS_EQUALS_FRAME=NO`

`FRAME_EQUALS_VIEW=NO`
