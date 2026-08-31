# Projection Control

Angle behavior depends on transformation class:

- in-plane Euclidean rotation: preserves angle;
- reflection: preserves undirected angle magnitude;
- uniform scale/similarity transform: preserves angle;
- general affine/nonuniform scale: does not generally preserve angle;
- perspective projection: does not generally preserve arbitrary object-space angle;
- unknown view change: no preservation claim permitted.

The historical files provide no camera model or transformation matrix. Their changed aspect/layout is sufficient to warn against treating measured image-plane angles as object-space invariants.

`ANGLE_COMPARISON_STATUS=PROJECTION_OR_VIEW_UNDERDETERMINED`

`PROJECTION_DEPENDENCE_FOUND=YES`
