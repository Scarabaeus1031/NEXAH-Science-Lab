# Transform Composition

For perpendicular coordinate axes:

```text
R_y o R_x(x,y)=(-x,-y)
R_x o R_y(x,y)=(-x,-y).
```

Both compositions are the rotation by `pi` about the origin. Each composition preserves orientation because the determinant product is `(-1)(-1)=+1`.

More generally, two reflections across lines intersecting at angle `theta` compose to a rotation by `2theta`; reversing the reflection order reverses the rotation direction. Parallel reflection axes instead compose to a translation.

One reflection is orientation reversing. Two-reflection composition and rotation are orientation preserving. A final rotation map can therefore have a reflection-composition history even when the final point mapping is identical.

The transform record stores ordered operation IDs and parameters separately from the resulting composite map.

`TWO_REFLECTION_COMPOSITION_TESTED=YES`

`TRANSFORM_HISTORY_PRESERVED=YES_IN_PROVENANCE_RECORD`

`SAME_FINAL_VIEW_IMPLIES_SAME_TRANSFORM_HISTORY=NO`
