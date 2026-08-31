# Rigid Transform Controls

Let `T(x)=Qx+t`, where `Q` is orthogonal and `t` is a translation.

For direction vectors `u,w`:

```text
(Qu) dot (Qw) = u dot w
|Qu| = |u|
```

Therefore Euclidean distances and unsigned angles are preserved.

| Transform | Adjacency | Length | Unsigned angle | Signed orientation |
|---|---:|---:|---:|---:|
| translation | preserved | preserved | preserved | preserved |
| rotation | preserved | preserved | preserved | preserved |
| reflection | preserved | preserved | preserved | reversed |

The graph is unchanged because these transforms move embedded coordinates, not `V` or `E`.

`ANGLES_PRESERVED_UNDER_TRANSLATION=YES`

`ANGLES_PRESERVED_UNDER_ROTATION=YES`

`ANGLES_PRESERVED_UNDER_REFLECTION=YES_UNSIGNED_MAGNITUDE`
