# Graph / Embedding / Augmentation Control

## Re-embedding

For triangle graph `G`, a Euclidean reflection gives

```text
G -> E1
G -> E2=T(E1).
```

Preserved:

- adjacency;
- all node degrees;
- path structure;
- one three-edge cycle;
- abstract graph identity.

Changed:

- coordinates and visible placement;
- orientation/handedness;
- sign of directed angles;
- view identity unless a rendering equivalence is separately declared.

Unsigned lengths and angles are preserved by reflection.

## Augmentation

Adding the altitude and subdividing `AB` gives `G+`, with a new vertex and new edges. Counts, degree sequence, path structure and cycle rank change as recorded in file `07`.

`REEMBEDDING_OF_G_EQUALS_AUGMENTATION_TO_G_PLUS=NO`

`REFLECTION_PRESERVES_ABSTRACT_GRAPH=YES`

`LOT_AUGMENTATION_PRESERVES_WHOLE_GRAPH_IDENTITY=NO`

Claims about “the same graph” after augmentation are valid only when explicitly restricted to a mapped original substructure.
