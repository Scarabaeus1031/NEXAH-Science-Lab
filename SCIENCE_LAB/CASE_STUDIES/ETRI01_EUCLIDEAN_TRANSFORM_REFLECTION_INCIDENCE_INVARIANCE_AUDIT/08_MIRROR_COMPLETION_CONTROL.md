# Mirror-completion Control

The result depends on the declared reflection axis.

## Reflection across base `AB`

Points `A` and `B` are fixed and `P` maps to `P'`. The union of triangles `APB` and `AP'B` is bounded by quadrilateral `A-P-B-P'` when `P` is off `AB`.

- the triangles are congruent;
- the quadrilateral is a kite because `AP=AP'` and `BP=BP'`;
- it is a rhombus only under the additional condition `AP=BP`;
- it is not automatically a circle or another special polygon.

## Other axes

Reflection across a side produces two congruent triangles sharing that side. Reflection across a symmetry axis may map an isosceles triangle onto itself. A general axis may yield overlapping or disjoint copies rather than one simple polygon.

Therefore no completion class follows from the word “mirror” alone.

`MIRRORED_TRIANGLE_EQUALS_ORIGINAL_OBJECT=NO`

`MIRRORED_TRIANGLE_CONGRUENT_TO_ORIGINAL=YES`

`UNION_CLASSIFICATION=REFLECTION_AXIS_AND_CONFIGURATION_DEPENDENT`

`CIRCLE_OR_SPHERE_INFERRED=NO`
