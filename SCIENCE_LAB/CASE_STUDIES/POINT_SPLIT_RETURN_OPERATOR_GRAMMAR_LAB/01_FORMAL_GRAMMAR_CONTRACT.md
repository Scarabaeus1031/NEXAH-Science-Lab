# Formal Grammar Contract

Frozen before execution on 2026-08-23.

## Object

`G=(P,S,B,C,R)` in a declared two-dimensional data space:

- `P`: explicit anchor coordinate and initial pivot; never chosen from labels.
- `S`: explicit split node connected to P by a stem.
- `B`: directed edges leaving S other than the stem.
- `C`: optional simple graph cycle with a polygonal embedding.
- `R`: explicit endpoint of a return edge from a node on C.

The positive control D uses:

```text
P=(0,0); S=(0,-0.65)
A=(-0.75,0.05); B=(0.75,0.05); T=(0,0.95); R=(0.03,-0.02)
edges={P-S,S-A,S-B,A-T,T-B,T-R}
cycle={S,A,T,B}
branches={S-A,S-B}
```

P lies inside C; R is close to P but is a distinct point. No historical coordinate informed these values.

## Required measurements

- branch count at S, sorted angular gaps, minimum and mean separation;
- non-adjacent segment intersection count;
- graph cycle rank and selected simple-cycle count;
- signed oriented area and area/bounding-box ratio;
- winding/inside indicator around P;
- normalized `distance(R,P)`;
- normalized closure gap/error;
- radial branch symmetry order (only for explicitly radial controls);
- classification under scale, rotation, translation, mirror, affine and projective maps;
- raster classification at 256, 512 and 1024 px;
- sensitivity to P shifts of 0.05, 0.15 and 0.30 bounding-box diagonal.

Angles are calculated in radians; degrees are display-only.

## Coordinate spaces

`U_data` holds floating-point geometry. `U_image` maps y upward to y downward and quantizes to pixels. `U_local` normalizes a bounding box. Incidence metadata is not inferred from pixels. Arm L deliberately compares correct conversion with an incorrect raw-coordinate reuse; those outputs are not merged.

## Transformations

- similarity: uniform scale 1.7, rotation 0.7 rad, translation `(0.4,-0.3)`;
- mirror: `x -> -x`;
- affine: matrix `[[1.3,0.35],[-0.15,0.8]]`;
- projective: `(x,y)->((x+0.15y)/w,(0.10x+y)/w)`, `w=1+0.12x+0.08y`;
- raster: data window padded by 10%, rounded to 256/512/1024 px, then mapped back to data space.

Topology is preserved by declared continuous transforms. Oriented area and winding sign may flip under mirror; grammar existence uses their magnitude/presence.

## P information boundary

P contains exactly the declared coordinate, node identity, stem relation and pivot/initial-state role. P is neither “nothing” nor “everything”; it carries no semantic or physical authority.

