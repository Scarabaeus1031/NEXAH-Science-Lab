# Partition Control

The altitude ray `PH` lies inside apex angle `y=angle(APB)` and induces

```text
y_L=angle(APH)
y_R=angle(HPB)
y=y_L+y_R.
```

This is an angle-partition relation produced by the augmented geometric construction. Adding `PH` is the structural/geometric operation; `y=y_L+y_R` is a derived relation/result. They are not the same object.

## Separate meanings of partition

| Partition kind | Required definition | Example |
|---|---|---|
| quantity partition | components and composition law | `y=y_L+y_R` |
| geometric-region partition | regions, boundaries and coverage/non-overlap | two subtriangles separated by `PH` |
| set/domain partition | disjoint nonempty subsets whose union is the domain | declared subset family |
| graph partition | vertex/edge assignment under a graph rule | not automatically produced by angle partition |

Graph augmentation can induce several partition relations, but “partition” itself is not a new universal primitive here. Standard relation/result records suffice.

`PARTITION_EQUALS_AUGMENTATION=NO`

`PARTITION_REQUIRES_NEW_PRIMITIVE=NO`

`ADD_PERPENDICULAR_EQUALS_RESULTING_ANGLE_PARTITION=NO`
