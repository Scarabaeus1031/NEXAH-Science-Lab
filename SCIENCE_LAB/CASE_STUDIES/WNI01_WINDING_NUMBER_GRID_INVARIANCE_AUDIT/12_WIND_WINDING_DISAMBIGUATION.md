# WIND / WINDING disambiguation

| Term | Classification | Boundary |
|---|---|---|
| WIND | NO_MATCH | WFR roles are meteorological, forcing, visual, expression, or underdefined |
| WINDING | PARTIAL_MATCH | Needs curve/reference/orientation |
| WINDING NUMBER | EXACT_FORMAL_MATCH | Standard topological observable under contract |
| W(C,p) | EXACT_FORMAL_MATCH | Curve and reference explicit |
| PHASE WINDING | PARTIAL_MATCH | Exact only for a closed ordered phase path |
| ROTATION | NO_MATCH | Transform/rate is not winding |
| VORTEX | NO_MATCH | Figure/flow label lacks curve contract |
| FLOW | NO_MATCH | Evolution/transport is not W |
| CYCLE | PARTIAL_MATCH | Periodicity lacks enclosure/reference |
| LOOP | PARTIAL_MATCH | May lack oriented complex curve |
| RETURN | NO_MATCH | Return does not establish winding |

The repository materially uses a winding_preserved metric in Round-Square-Round. That prior metric checks signed-area sign, not full W(C,p), and is not silently upgraded.

No inspected source maps historical +11 WIND to winding. WFR-01 remains unchanged.

PLUS11_WIND_EQUALS_WINDING=NO_NOT_HISTORICALLY_ATTESTED
