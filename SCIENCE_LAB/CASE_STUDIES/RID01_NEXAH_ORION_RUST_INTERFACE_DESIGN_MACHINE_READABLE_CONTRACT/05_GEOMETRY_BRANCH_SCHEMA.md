# Geometry Branch Schema

```text
Graph
  vertices[] edges[] relations[] constraints[]
  anchors[] rays[] junctions[]
  origin = REGISTERED_BASE | AUGMENTED(source_graph_ref, event_ref)

Embedding
  graph_ref + frame_ref + metric_ref + coordinates
```

`Frame` declares dimension, basis, origin and optional handedness. `Metric` declares kind and dimension; a custom metric requires a registered rule reference. `Ray` requires an anchor, nonempty direction and frame. `AngleMeasurement` requires two rays, embedding, metric, measurement event and value.

An augmented graph must identify its source graph and augmentation event. A re-embedding does not create a graph augmentation. Multiple embeddings may reference one graph revision.

`GRAPH_EQUALS_EMBEDDING=NO`

`ANGLE_WITHOUT_EMBEDDING_METRIC=SCHEMA_INVALID`

`AUGMENTED_GRAPH_WITHOUT_SOURCE=SCHEMA_INVALID`

