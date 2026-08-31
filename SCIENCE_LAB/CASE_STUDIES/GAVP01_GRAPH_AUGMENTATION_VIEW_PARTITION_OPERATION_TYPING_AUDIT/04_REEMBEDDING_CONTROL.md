# Re-embedding Control

Let `T` be reflection across a declared Euclidean line and set

```text
E2=T o E1.
```

The operation maps the coordinates of every existing vertex. It adds no vertex or edge.

| Question | Result |
|---|---|
| graph changed | no |
| vertex set changed | no |
| edge set changed | no |
| incidence changed | no |
| coordinates changed | yes unless a point is fixed |
| orientation changed | yes; reflection reverses handedness |
| abstract paths/cycles changed | no |

Thus `(G,E1)` and `(G,E2)` contain the same graph identity with distinct embedding identities.

`REEMBEDDING_EQUALS_AUGMENTATION=NO`

`REFLECTION_ENCODED_AS_GRAPH_AUGMENTATION=NO`

`CASE_A_CHANGED_COMPONENT=EMBEDDING_AND_ORIENTATION_NOT_SOURCE_GRAPH`
