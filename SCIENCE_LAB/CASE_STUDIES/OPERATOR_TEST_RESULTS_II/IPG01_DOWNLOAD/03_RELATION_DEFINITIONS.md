# 03 — Relation Definitions

| Relation | Definition | Consequence excluded |
|---|---|---|
| SAME_INSTANCE | identical unique object/instance ID | class equality is insufficient |
| SAME_SOURCE | same recorded ultimate provenance root | does not imply same instance |
| SAME_SPECIFICATION | both concrete instances conform to S | does not imply same source or identity |
| SAME_CLASS | both satisfy `C(x):=conforms(x,S)` | membership does not collapse members |
| EQUIVALENT_UNDER_S | `x~S y` iff both conform to S | equivalence depends on chosen S |
| SIMILAR | instance records match at least 3 of 4 fields | may include nonconforming I4 |
| SAME_PROVENANCE | same recorded immediate derivation parent | observable equality is insufficient |
| SAME_GENERATION | equal derivation-edge distance from O | time/order alone is insufficient |

`~S` is reflexive, symmetric and transitive on the bounded class of conforming
instances. It is not object identity. Changing the selected specification or
equivalence criterion can change the equivalence classes.
