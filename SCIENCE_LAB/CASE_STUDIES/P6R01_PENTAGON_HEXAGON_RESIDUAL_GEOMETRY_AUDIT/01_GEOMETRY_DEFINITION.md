# Geometry Definition

## Object P

The pentagon can be defined up to uniform scale. Normalize the common circumradius to `R=1`, let `O=(0,0)`, and define

`v_j(theta)=(cos(theta+2*pi*j/5), sin(theta+2*pi*j/5))`, for `j=0,...,4`.

`P(theta)` is the closed convex hull of those five vertices.

`PENTAGON_DEFINED=YES`

## Candidate object H

A reproducible six-circle construction would require at least parameters `rho` and `r`:

`c_i=(rho*cos(alpha+2*pi*i/6), rho*sin(alpha+2*pi*i/6))`

and disks

`D_i={x in R^2 : ||x-c_i|| <= r}`.

The record does not specify `rho`, `r`, `alpha`, or how the `D_i` form `H`. Plausible but inequivalent choices include:

- `H = union_i D_i`;
- `H = intersection_i D_i`;
- the bounded cells of the circle arrangement;
- the regular hexagon through the centers;
- only the circle boundaries;
- any of the above with a central disk `D_0`.

These choices have different area, topology, boundaries, arc counts, and containment relations.

`SIX_CIRCLE_STRUCTURE_DEFINED=NO`

`CENTRAL_CIRCLE_PRESENT=UNDERDEFINED`

## Mandatory separations

`HEXAGON_POLYGON != SIX_CIRCLE_CONSTRUCTION`

`SIX_CIRCLE_CONSTRUCTION != CENTRAL_CIRCLE`

`6_PLUS_1_CIRCLES != C7_SYMMETRY`

No candidate definition was promoted to fact.

