# Ledger Graph Model

Ledger entries naturally form a directed multigraph `G_R=(V_R,E_T)`. Nodes are typed representation/artifact endpoints; edges are transformation records. Parallel edges are necessary because different operators, versions, parameters, or evidence states can connect the same representation types.

Edge status should remain data, not color alone: `VERIFIED`, `PARTIALLY_VERIFIED`, `CONDITIONAL`, `CONCEPTUAL`, `FAILED`, `RETIRED`, or `UNKNOWN`. Composite paths cite ordered edge IDs. Missing links appear as absent or conceptual edges rather than being visually inferred.

Concrete benefits:

- the legacy graph exposes no basin-graph→spectrum edge;
- the partition edge exposes extra grid/field context instead of a false single-input chain;
- the failed delay hierarchy remains attached to executed translation records;
- alternate representation paths can be compared without asserting equivalent loss.

The graph is useful for querying and gap exposure. It is standard lineage/knowledge-graph structure and carries no mathematical novelty claim.

