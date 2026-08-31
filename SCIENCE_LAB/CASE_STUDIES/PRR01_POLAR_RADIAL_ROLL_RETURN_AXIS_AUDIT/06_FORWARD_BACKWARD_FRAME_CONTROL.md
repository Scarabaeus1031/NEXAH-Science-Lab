# 06 — Forward / Backward Frame Control

Forward and backward require an oriented frame, path tangent, body heading, input/output convention, or transmission label. They have no intrinsic global direction.

- outward/inward refer to increasing/decreasing radial coordinate;
- clockwise/counterclockwise refer to angular orientation as viewed along a declared axis;
- forward/backward refer to a declared travel or mechanism convention.

These can coincide in one configuration but are not definitions of one another.

`FORWARD_EQUALS_OUTWARD=NO`  
`BACKWARD_EQUALS_INWARD=NO`  
`CLOCKWISE_EQUALS_FORWARD=NO`  
`COUNTERCLOCKWISE_EQUALS_BACKWARD=NO`

Changing observer side reverses the visible clockwise label without changing the physical angular-velocity vector. Changing vehicle heading changes forward direction without changing radial direction about an unrelated origin.

