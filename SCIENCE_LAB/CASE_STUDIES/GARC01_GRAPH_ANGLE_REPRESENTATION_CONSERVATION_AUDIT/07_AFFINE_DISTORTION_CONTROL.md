# Affine Distortion Control

An invertible affine map has form `T(x)=Ax+t`, with nonsingular `A`.

It preserves:

- point incidence and the carried graph adjacency;
- collinearity;
- ratios along one line;
- parallelism;
- path and cycle structure of the fixed abstract graph.

It does not generally preserve Euclidean lengths or angles.

## Explicit shear

Start with perpendicular rays

```text
u=(1,0), w=(0,1), angle(u,w)=90°.
```

Apply

```text
A=[[1,1],[0,1]].
```

Then

```text
Au=(1,0), Aw=(1,1), angle(Au,Aw)=45°.
```

The incident edges and their graph relation are unchanged. The local Euclidean angle changes.

`ANGLES_PRESERVED_UNDER_GENERAL_AFFINE_MAP=NO_IN_GENERAL`

`COLLINEARITY_PRESERVED_UNDER_AFFINE_MAP=YES`

`PARALLELISM_PRESERVED_UNDER_AFFINE_MAP=YES`
