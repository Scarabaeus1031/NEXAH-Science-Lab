# Graph / Embedding / View Chain

## Typed chain

```text
G=(V,E) --embedding Epsilon--> Epsilon(G) --view Omega--> Omega(Epsilon(G))
```

- `G` states abstract identities and relations.
- `Epsilon(G)` assigns coordinates in a declared space.
- a frame interprets coordinate directions;
- a metric defines lengths and angles;
- `Omega(Epsilon(G))` is an observation, projection or rendering.

## Three separate equality questions

1. Same graph: are vertex/edge identities and incidence preserved?
2. Same embedding: are corresponding coordinates identical under the declared identity convention?
3. Same view: are the observation rule and its output identical?

Any one can differ while another remains the same. The same graph admits different embeddings. One embedding admits different views. Similar-looking views need not reconstruct the same graph.

## GARC-01 anti-collapse control

For the star `K_(1,3)`, both embeddings retain degree sequence `3,1,1,1`. In the registered examples one local angle is `90°` in `E1` and the corresponding angle is `45°` in `E2`.

`GRAPH_STRUCTURE_SAME=YES`

`VISIBLE_ANGLE_SAME=NO`

`G != Epsilon(G)`

`Epsilon(G) != Omega(Epsilon(G))`

`G != Omega(Epsilon(G))`

`EMBEDDING_EQUALS_GRAPH=NO`

`EMBEDDING_EQUALS_VIEW=NO`

`FRAME_EQUALS_VIEW=NO`
