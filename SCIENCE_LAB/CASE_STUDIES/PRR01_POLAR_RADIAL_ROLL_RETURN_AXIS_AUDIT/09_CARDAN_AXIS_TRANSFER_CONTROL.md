# 09 — Cardan Axis-Transfer Control

A Cardan/universal joint is a standard mechanism connecting rotating members whose input and output axes may be non-collinear. Required roles are input shaft/axis, joint, output shaft/axis, torque transfer, angular velocities, and joint/misalignment angle.

One universal joint at a nonzero fixed angle generally produces a nonuniform output angular velocity even for uniform input; the NASA driveshaft source records this as Cardan error. This is ordinary three-dimensional rigid-body/mechanism geometry.

`CARDAN_REQUIRES_EXTRA_DIMENSION=NO`  
`INPUT_AXIS_EQUALS_OUTPUT_AXIS=NO_IN_GENERAL`  
`INPUT_ANGULAR_VELOCITY_EQUALS_OUTPUT_ANGULAR_VELOCITY=NOT_IN_GENERAL_FOR_SINGLE_MISALIGNED_JOINT`  
`KARDAN_K_SYMBOLIC_MAPPING_SUPPORTED=NO`

No relation is inferred between the letter K in Kardan/Kupplung and any mathematical `K`, quaternion `k`, operator, or NEXAH role.

