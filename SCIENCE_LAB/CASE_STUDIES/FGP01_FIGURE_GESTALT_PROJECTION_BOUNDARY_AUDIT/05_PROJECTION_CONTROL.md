# Projection Control

Let a registered state be `X=(x,y)` and let projection rule `P:X→V` be separately identified with frame, version, losses and provenance.

- `P1(x,y)=x` and `P2(x,y)=x+y` show that one state can yield different projected results/figures.
- `X1=(0,1)` and `X2=(0,-1)` satisfy `P1(X1)=P1(X2)=0`, showing a many-to-one result for distinct states.

Therefore `P(X) != X`; `P1(X)` may differ from `P2(X)` without source mutation; and equal projection results do not identify equal sources.

The typed path is:

```text
SourceState --[declared projection rule / observation map]--> ProjectionResult
ProjectionResult --[render/representation derivation]--> View/Figure
```

The first arrow is transformation/selection/observation according to its registered rule. The second is representation. Neither is identity. Kernels, cropping, rounding, frame changes and rendering may omit information; losses must be declared.
