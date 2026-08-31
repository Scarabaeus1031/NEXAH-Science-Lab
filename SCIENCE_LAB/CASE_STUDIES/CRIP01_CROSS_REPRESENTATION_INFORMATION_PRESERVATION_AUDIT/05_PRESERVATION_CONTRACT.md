# Preservation Contract

## Contract F: shared scalar object

Registered object:

`S = (PHI, BETA, E_flow)` with `E_flow = PHI × BETA`, sampled on a 401×401 grid.

Tested before viewing:

| relation | expected across F1/F2 | result |
|---|---|---|
| object identity | same source array | `PRESERVED` |
| domain coordinate orientation | axes declared | `PRESERVED` |
| sign / zero partition | encoded by the same values | `PRESERVED`, recoverability depends on legend/axes |
| exact numeric sample value from raster | not guaranteed | `LOST` |
| value encoding | color in F1, height in F2 | `TRANSFORMED_BY_DECLARED_RULE` |
| coherence-mask membership | present only as overlay in F1 | `LOST` in F2 as rendered |
| 3D depth and shading | absent as data in F0/F1 | `INFORMATION_INTRODUCED_BY_VIEW` in F2 |
| physical meaning | not tested | `UNDEFINED` |

## Contract G: grid-to-graph audit reconstruction

Preserve IDs and four-neighbour adjacency. Row/column order and metric position are preserved only if retained as node attributes. An arbitrary graph layout may change all displayed distances and angles without changing the graph.

## Contract T: timeline

T0 establishes 841 ordered samples and a numeric parameter from 0 to 42. It does not establish measured physical time, an equation of motion, or a historical PNG transformation. Exact CSV values are lost in a raster plot.

## Use of “invariant”

Only relations whose carrier and transformation are defined receive a preservation classification. `PRESERVED` means preserved under that representation contract, not true about the world.
