# Source / Structure / Geometry Branch

```text
RegisteredSource(ObjectId, RevisionRef, ProvenanceRecord)
  -> Graph(Relation*) + Constraint*
  -> Embedding(graph_ref, Frame, Metric, coordinate_map)
  -> TransformRule
  -> TransformEvent
  -> ResultEmbedding
```

An anchor, ray, edge or junction is a typed role within a graph/embedding contract. It is not inferred from a drawing. An angle is valid only with two rays, an embedding, a frame/metric and provenance. Re-embedding preserves graph identity only under an explicit correspondence. Augmentation creates a new graph revision; it is neither a transform nor a partition.

Required boundaries:

- `GRAPH_EQUALS_EMBEDDING=NO`
- `EMBEDDING_EQUALS_VIEW=NO`
- `TRANSFORM_EQUALS_TRANSFORMED_EMBEDDING=NO`
- `AUGMENT_EQUALS_AUGMENTED_GRAPH=NO`
- `PARTITION_RULE_EQUALS_PARTITION_RESULT=NO`

