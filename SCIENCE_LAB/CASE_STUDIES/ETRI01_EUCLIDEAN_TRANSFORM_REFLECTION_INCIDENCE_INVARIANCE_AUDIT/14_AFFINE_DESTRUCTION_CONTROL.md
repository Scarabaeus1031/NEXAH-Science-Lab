# Affine Destruction Control

Apply the shear

```text
S(x,y)=(x+y,y),
A=[[1,1],[0,1]].
```

Because `A` is invertible, it preserves point incidence, collinearity and parallelism. It carries the abstract graph without changing adjacency.

But perpendicular directions

```text
u=(1,0), v=(0,1), u dot v=0
```

map to

```text
Au=(1,0), Av=(1,1),
angle(Au,Av)=45°.
```

Thus the original right angle becomes `45°`, lengths generally change and perpendicularity is not preserved. The transformed triangle still has Euclidean interior-angle sum `180°`, but its individual angle magnitudes need not match the original.

`AFFINE_SHEAR_CONTROL_COMPLETE=YES`

`ANGLE_IS_AFFINE_INVARIANT=NO`

`AFFINE_SHEAR_PRESERVES_INCIDENCE=YES`

`AFFINE_SHEAR_PRESERVES_PARALLELISM=YES`

`AFFINE_SHEAR_PRESERVES_PERPENDICULARITY=NO_IN_GENERAL`
