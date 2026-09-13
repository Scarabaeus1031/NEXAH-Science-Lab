# 4D-Chessboard Role and Dimensionality Audit

## Binding result

Two uniquely identifiable 4D-Chessboard primaries could not be bound to generators, axis dictionaries, data or color legends. No value, node or edge is reconstructed.

`SOURCE_BINDING_INSUFFICIENT`  
`NO_VALUE_RECONSTRUCTION`  
`NO_SEMANTIC_PROMOTION`

## Dimensional rule

A rendered three-axis array with color has a possible display tuple `(x,y,z,c)`. This is “four encoded attributes,” not automatically a four-dimensional state space. The fourth variable may be time, parameter, category, scalar field, residual or address only if explicitly defined.

Nodes and edges are calculated objects only when their construction and data are present. Otherwise they are graphical marks.

`FOURTH_DIMENSION_ASSUMED_TO_BE_TIME = NO`

## Candidate register — not an existing capability

The following is a defensible future schema, not a claim about the missing visuals:

- Level 1: continuous state/field record;
- Level 2: gate/cut/crossing record;
- Level 3: event/residual/return record;
- fourth coordinate: explicitly typed attribute with units/domain.

This register becomes useful only when stable IDs link every cell/node to the underlying trajectory, gate, event and residual provenance.

