# Horizontal / Vertical / Diagonal Reflection

In the registered coordinate frame:

```text
R_x(x,y)=(x,-y)
R_y(x,y)=(-x,y)
R_d(x,y)=(y,x)   [reflection across y=x]
```

For every point `Z`, correspondence is `Z -> R_*(Z)`. Each map is an orthogonal bijection with determinant `-1`.

| Transform | Incidence | Parallelism | Perpendicularity | Length | Unsigned angle | Orientation | Graph |
|---|---:|---:|---:|---:|---:|---:|---:|
| `R_x` | yes | yes | yes | yes | yes | reversed | preserved |
| `R_y` | yes | yes | yes | yes | yes | reversed | preserved |
| `R_d` | yes | yes | yes | yes | yes | reversed | preserved |

They belong to the same invariant class of Euclidean reflections but are different maps with different fixed lines and point correspondences. Their views may also differ by crop, frame or rendering.

`SAME_INVARIANT_CLASS=YES`

`SAME_TRANSFORM=NO`

`SAME_VIEW=NO_NOT_IMPLIED`
