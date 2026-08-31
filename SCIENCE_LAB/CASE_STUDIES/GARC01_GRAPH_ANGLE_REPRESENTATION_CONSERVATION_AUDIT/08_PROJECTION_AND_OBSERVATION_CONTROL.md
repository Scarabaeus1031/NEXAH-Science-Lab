# Projection and Observation Control

Observation is a separate map `O` from an embedded object to an image or measurement. It may include projection, perspective, crop, resampling, line thickness, occlusion, lens distortion or drawing choices.

Consequences:

- a 3D angle need not equal its 2D projected angle;
- two distinct vertices may overlap in a projection;
- an edge may be hidden, clipped or visually merged;
- crossings in a drawing need not be graph vertices;
- pixel angle estimates include rendering and measurement uncertainty;
- reconstructing the source graph from one image is not guaranteed.

Orthographic or perspective projection may preserve special relations in special configurations, but no general Euclidean-angle guarantee follows merely from visibility.

The only valid route is:

```text
source graph -> declared embedding -> declared observation -> measured image feature
```

and every reverse inference requires explicit assumptions.

`VIEW_EQUALS_DIMENSION=NO`

`VISIBLE_CROSSING_EQUALS_VERTEX=NO`

`PROJECTED_ANGLE_EQUALS_SOURCE_ANGLE=NO_IN_GENERAL`
