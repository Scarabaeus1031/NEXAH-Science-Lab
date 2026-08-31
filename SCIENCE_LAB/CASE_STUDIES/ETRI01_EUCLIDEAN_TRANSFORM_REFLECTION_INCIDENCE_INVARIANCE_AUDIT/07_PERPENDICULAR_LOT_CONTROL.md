# Perpendicular / Lot Control

Let `H=(x_P,0)` be the perpendicular foot from `P` to `L0`. Since `x_A<x_P<x_B`, `H` lies in the interior of segment `AB` and ray `PH` lies inside angle `APB`.

```text
PH perpendicular L0
y_L=angle(APH)
y_R=angle(HPB)
y=y_L+y_R
```

The last equality is the angle-addition theorem for an interior ray. It is an angle partition, not a reflection or new dimension.

## Explicit graph augmentation

Use triangle graph

```text
G: V={A,B,P}, E={AP,PB,AB}.
```

Represent the altitude with subdivision at `H`:

```text
G+: V={A,H,B,P}
E={AP,PB,AH,HB,PH}.
```

| Quantity | `G` | `G+` |
|---|---:|---:|
| vertices | 3 | 4 |
| edges | 3 | 5 |
| degrees | `(2,2,2)` | `(2,3,2,3)` for `A,H,B,P` |
| cycle rank `E-V+1` | 1 | 2 |

The original geometric segment `AB` survives as `AH union HB`, but its graph edge is subdivided. The original triangle is recoverable as a geometric substructure, not literally the unchanged edge set.

`LOT_ADDS_GEOMETRIC_OBJECT=YES`

`LOT_EQUALS_REFLECTION=NO`

`ANGLE_PARTITION_SUPPORTED=YES`

`GRAPH_AUGMENTATION_DISTINGUISHED_FROM_REEMBEDDING=YES`
