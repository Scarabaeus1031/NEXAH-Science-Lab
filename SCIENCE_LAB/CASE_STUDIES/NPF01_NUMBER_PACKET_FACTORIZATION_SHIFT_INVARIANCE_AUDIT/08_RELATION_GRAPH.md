# Relation Graph

The graph uses only frozen seed integers as nodes. It includes two declared edge families:

1. `CONSECUTIVE`: both endpoints are seed nodes and `target-source=1`.
2. `EXPLICIT_SUPPLIED_RELATION`: an exact supplied relation whose participating seed integers can be represented without adding a candidate node.

A sum uses transparent compound-source notation such as `11+13`; it records a bounded hyperedge and does not add a number-search candidate. Coefficients such as 8 and 17 remain equation terms, not graph nodes.

## Required supplied relation classifications

| Exact relation | Classification |
|---|---|
| `11+13=24` | `ADDITION` |
| `33=3*11` | `MULTIPLICATION; FACTORIZATION; SHARED_PRIME_FACTOR` |
| `99=3*33=3^2*11` | `MULTIPLICATION; FACTORIZATION; MULTIPLE; TRIPLE; SHARED_PRIME_FACTOR` |
| `46=2*23` | `MULTIPLICATION; FACTORIZATION; MULTIPLE; DOUBLE` |
| `34=2*17` | `MULTIPLICATION; FACTORIZATION` |
| `425=25*17=5^2*17` | `MULTIPLICATION; FACTORIZATION; MULTIPLE; SHARED_PRIME_FACTOR` |
| `232=8*29=2^3*29` | `MULTIPLICATION; FACTORIZATION; MULTIPLE` |

The classifications are ordinary arithmetic only. Reconnection to another seed object adds no semantics.

Every stored edge has an exact equation. Removing human labels leaves that equation sufficient to reconstruct the arithmetic relation. No edge arises from appearance, color, packet title, or graph position.

The graph is complete only for the declared rules represented in `09_RELATION_EDGES.csv`; it is not a graph of every possible arithmetic relation among the numbers.

`RELATION_GRAPH_COMPLETE=YES_FOR_DECLARED_EDGE_RULES`

