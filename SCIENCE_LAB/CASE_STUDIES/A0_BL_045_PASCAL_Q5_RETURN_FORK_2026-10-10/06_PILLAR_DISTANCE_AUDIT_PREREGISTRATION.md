# A0-BL-045 — Pascal-pyramid pillar distance audit preregistration

Date: `2026-10-10`

This bounded companion audit tests the Owner's observation that the centered
distances in the Janus ladder resemble the pillars of the Pascal pentagonal
bipyramid. It reuses the active A0-BL-045 Study, the existing
`A0OE:PASCAL_PENTAGON_D5_TEST` identity and the already verified PENT-04/05
fixtures. It creates neither a new Family nor a new PENT layer.

The supplied `CROWN · SEAM · ROOT` visual is treated as a hypothesis sketch,
not as executable authority. Its labels motivate the separation below:

```text
crown / root reflection J       = geometric involution and isometry
signed double-pentagon Q'_eps   = state-return operator, not presumed isometry
```

## Frozen objects

### Scalar Janus shells

For a declared center `c`, let `J_c(x)=2c-x`. The primary center is
`c=12555`, with radii `6, 12, 18, 1198`. The nested control has center
`c'=11947`, radius `590` and pair `11357 <-> 12537`.

### Pascal pillar fixture

The PENT-05 root completion contains ten unit equatorial roots and two axial
unit roots. Its six antipodal pairs are the pillars. The crown/root involution
is the horizontal-plane reflection

```text
J_z(x,y,z) = (x,y,-z).
```

It must fix the equatorial seam pointwise, exchange Zenith and Nadir, map the
five crown faces to the five root faces and preserve Euclidean distance.

### State-return control

With `M=Q^5`, the already declared signed bridge is

```text
Q'_eps(a,b) = (eps M^-1 b, M a),  eps in {+1,-1}.
```

The audit retests `(Q'_eps)^2=eps I` but does **not** assume that `Q'_eps` is
orthogonal. Euclidean isometry is checked independently through `A^T A=I`.

## Frozen checks

- every scalar pair is `c-r, c+r`, is swapped by `J_c`, and has midpoint `c`;
- each declared `J_c` is an involution and preserves scalar distances;
- different Janus centers remain different relations; composing their
  reflections gives a nonzero translation rather than one global mirror;
- the twelve-root fixture has six antipodal unit pillars with midpoint zero
  and length two;
- `J_z` fixes the seam, exchanges crown/root and preserves all pairwise
  distances;
- `Q'_+` squares to `+I` and `Q'_-` squares to `-I`;
- neither signed bridge is labelled a Euclidean isometry unless `A^T A=I`.

## Result vocabulary

- `PILLAR_REFLECTION_PASS_QPRIME_NOT_EUCLIDEAN_ISOMETRY`
- `PILLAR_REFLECTION_FAIL`
- `QPRIME_EUCLIDEAN_ISOMETRY`
- `INVALID_EXPERIMENT`

## STOP boundary

The `+18%` growth marker, `sqrt(2)`, `pi`, `e`, `lambda` and `g` in the source
visual have no declared estimator or executable operator in this audit. They
remain untested labels. A shared outline, crossing or five-stage caption does
not establish shared dynamics, physical growth, resonance or one universal
mechanism.
