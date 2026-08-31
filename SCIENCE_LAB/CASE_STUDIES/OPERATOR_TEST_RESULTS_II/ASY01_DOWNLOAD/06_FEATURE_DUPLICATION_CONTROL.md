# 06 — Feature-Duplication Control

S2 contains two identical protrusions at 0° and 180°. It is invariant under a
180° rotation but not under 90° rotation. Its rotational symmetry group is
`C2`.

The static geometry identifies an **unsigned axis**, not a unique directed
heading. Among the registered rotations:

```text
0° ~ 180°
90° ~ 270°
```

Thus duplication restores partial symmetry and reduces orientation information
from four distinguishable classes to two classes modulo 180°.

```text
FEATURE_DUPLICATION_RESTORES_PARTIAL_SYMMETRY=YES
S2_ORIENTATION_IDENTIFIABLE=PARTIAL_MODULO_180
```
