# Object and Relation Type Ledger

## Objects

| Type | Instance | Identity condition |
|---|---|---|
| point/anchor | `A,B,P` | declared point ID and embedding coordinate |
| line | `L0,L1` | point-set/line equation |
| segment/edge | `AP,PB,AB` | declared endpoints |
| graph | triangle `G` | vertices and adjacency |
| embedding | `E1` | coordinate map for graph vertices |
| metric | standard Euclidean inner product | registered metric ID |
| transform | translation/rotation/reflection/scaling/shear | map and parameters |
| view | rendered representation | source and rendering provenance |

## Angle-relation types

| Relation | Formal condition |
|---|---|
| `SAME_ANGLE_OBJECT` | identical vertex and ordered/unordered ray provenance under the declared convention |
| `EQUAL_ANGLE_MAGNITUDE` | two angle objects have equal unsigned metric value |
| `CORRESPONDING_ANGLES` | two lines cut by a transversal occupy corresponding positions |
| `ALTERNATE_INTERIOR_ANGLES` | angles lie between parallel lines on opposite transversal sides |
| `VERTICAL_ANGLES` | opposite angles formed by two intersecting full lines |
| `SUPPLEMENTARY_ANGLES` | magnitudes sum to `pi` |
| `TRIANGLE_INTERIOR_ANGLE` | angle between two incident triangle edges at one vertex |
| `RIGHT_ANGLE` | magnitude `pi/2` under Euclidean metric |
| `ANGLE_PARTITION` | an interior ray splits one angle into adjacent subangles whose magnitudes add |

`SAME_ANGLE_OBJECT_EQUALS_EQUAL_ANGLE_MAGNITUDE=NO`

`VISUALLY_OPPOSITE_EQUALS_VERTICAL_ANGLES=NO`

Vertical angles require two actual intersecting support lines and the appropriate opposite ray pairs.
