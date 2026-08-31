# Case A — Same Graph / Different Embedding

## Source and branches

Let the abstract graph be the closed GARC-01 star:

```text
V={o,a,b,c}
E={{o,a},{o,b},{o,c}}
degree sequence=(3,1,1,1)
```

Two branches reuse the registered embeddings:

```text
G -> E1 -> Euclidean metric -> angles 90°/90°/180° -> V1
G -> E2 -> Euclidean metric -> angles 45°/90°/135° -> V2
```

## Preserved

- vertex and edge identities;
- adjacency;
- degree sequence `3,1,1,1`;
- paths, connectedness and absence of cycles.

## Changed

- embedding identity and coordinates;
- edge lengths and visible directions;
- local Euclidean angles;
- resulting view.

`GRAPH_EQUALS_EMBEDDING=NO`

`EMBEDDING_EQUALS_ANGLE=NO`

`SAME_GRAPH_MULTIPLE_EMBEDDINGS_SUPPORTED=YES`

`VISIBLE_ANGLES_MAY_CHANGE=YES`

One embedding can also generate several views through different crops, projections, styling or measurement overlays without changing the embedding.

`SAME_EMBEDDING_MULTIPLE_VIEWS_SUPPORTED=YES`
