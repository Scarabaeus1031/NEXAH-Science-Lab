# Neutral Relabel Control

Replace all suggestive labels with:

```text
points: P0,P1,P2,P3
lines: L0,L1,L2
graph: G0; augmented graph: G1
embeddings: E0,E1
transforms: T0,T1,T2
angles: alpha0,alpha1,alpha2
```

Remove EU, Euclid/Euklid, Eulenspiegel, Pa/Po, P(U)late, colors and every historical or alphabetic association.

The following still hold:

- the two declared lines remain parallel;
- the triangle angle sum is `pi`;
- reflections preserve incidence, distance and unsigned angles while reversing orientation;
- two-reflection composition yields the standard rotation;
- the altitude adds a point and edges and partitions an angle;
- the shear preserves parallelism but changes a right angle;
- graph re-embedding remains distinct from graph augmentation.

`NEUTRAL_RELABEL_SURVIVES=YES`

The result is geometric rather than lexical.
