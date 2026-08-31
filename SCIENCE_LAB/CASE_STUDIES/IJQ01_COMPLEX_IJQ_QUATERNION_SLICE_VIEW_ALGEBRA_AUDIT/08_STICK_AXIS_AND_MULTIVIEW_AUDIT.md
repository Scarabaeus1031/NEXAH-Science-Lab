# 08 — Stick, Axis, and Multi-View Audit

The supplied boards show vertical pillars/sticks, compass axes, poles, mirrored loops, spheres, radial lines, projections, and multiple panels. Their recoverable status is `D`: diagrammatic geometry.

Possible ordinary types include oriented line, diameter, normal, reference/view/projection/rotation/reflection axis, frame element, or connector. The source record does not select one exact type consistently. None of these roles requires an independent quaternion basis direction.

Standard lower-dimensional models suffice:

- `R²` for a drawn card, complex plane, compass, or planar projection;
- `R³` for a sphere, axis, nested polyhedron, torus, or rotation view;
- complex multiplication for planar rotation;
- coordinate transforms/projections for multiple perspectives;
- diagram layout for a pillar connecting labeled regions.

A quaternion can represent an `R³` rotation when a unit quaternion acts by conjugation, but observing a rotation or axis does not attest that representation or quaternion multiplication.

`STICK_EQUALS_J_AXIS=NO`  
`STICK_REQUIRES_QUATERNION_DIMENSION=NO`  
`MULTIVIEW_EQUALS_MULTIDIMENSIONAL_STATE=NO`

