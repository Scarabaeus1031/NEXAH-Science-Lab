# Coil / Embedding Path Control

Let `G=K_(1,3)` be fixed. Define a one-parameter family of planar embeddings, with central vertex at the origin and leaves

```text
p1(tau)=(1,0)
p2(tau)=(cos(tau),sin(tau))
p3(tau)=(-1,0)
```

for `0<tau<pi`. The abstract graph and degree sequence remain constant. The angle between the first two rays is `tau`, so it changes continuously with the embedding.

More generally, an `EmbeddingPath` is a declared map

```text
tau -> E_tau(G).
```

It is a path in a space of representations, not automatically a physical trajectory.

`RELATION_STRUCTURE_CAN_REMAIN_FIXED_WHILE_EMBEDDING_EVOLVES=YES`

`PARAMETERIZED_EMBEDDING_FAMILY_SUPPORTED=YES_AS_STANDARD_MODEL`

`COIL_EQUALS_NEW_DIMENSION=NO`

`COIL_MAY_REPRESENT_PARAMETERIZED_EMBEDDING_FAMILY=YES_CONDITIONALLY`

`COIL_ROLE_STATUS=CONDITIONAL_ALIAS_FOR_PARAMETERIZED_EMBEDDING_FAMILY`

No torsion, field, force, resonance, memory or material coil is inferred.
