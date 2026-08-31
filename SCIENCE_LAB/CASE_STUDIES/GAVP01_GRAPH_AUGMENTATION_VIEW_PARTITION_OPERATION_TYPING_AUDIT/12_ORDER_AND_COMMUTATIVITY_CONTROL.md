# Order and Commutativity Control

## Abstract augmentation and embedding

Let `A_abs` add new vertex `X` adjacent to `A` and `B`. One may first form `A_abs(G)` and then choose an embedding extension. Alternatively, one may embed `G` first and then place `X` and its edges.

The diagram commutes only when the second route uses exactly the same vertex/edge identities and an embedding extension equal to the first route's declared coordinates. The abstract rule alone does not select those coordinates.

## Geometry-dependent augmentation

“Drop the perpendicular from `P` to embedded line `AB`” requires an embedding and Euclidean metric before `H` is located. It cannot be applied to bare `G` as a coordinate-free adjacency rule. A corresponding abstract augmentation can be recorded only after or together with geometric construction constraints.

## Transform and view

Compare:

```text
View o Transform
Transform_on_view o View.
```

They commute only if the view rule is equivariant with the transform and preserves all required content. Crop, occlusion, label placement, resampling or measurement overlays generally break equality.

Therefore:

`OPERATION_ORDER_ALWAYS_COMMUTES=NO`

`ABSTRACT_AUGMENT_THEN_EMBED_COMMUTES=CONDITIONAL_ON_COMPATIBLE_EMBEDDING_EXTENSION`

`GEOMETRY_DEPENDENT_AUGMENT_REQUIRES_EMBEDDING_FIRST=YES`

`TRANSFORM_VIEW_COMMUTES=CONDITIONAL_ON_EQUIVARIANT_VIEW_RULE`
