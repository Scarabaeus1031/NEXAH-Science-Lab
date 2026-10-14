# A0-BL-045 — Pascal-pyramid pillar distance audit result

Date: `2026-10-10`

Classification: `PILLAR_REFLECTION_PASS_QPRIME_NOT_EUCLIDEAN_ISOMETRY`

Reproducibility: `R2_LOCAL_REPLAY / PRIMARY_REPLAY_BYTE_IDENTICAL / VERIFIER_PASS`

## Exact result

The scalar Janus shells are exact centered pairs under
`J_c(x)=2c-x`:

| Center | Radius | Pair |
|---:|---:|---|
| `12555` | `6` | `12549 <-> 12561` |
| `12555` | `12` | `12543 <-> 12567` |
| `12555` | `18` | `12537 <-> 12573` |
| `12555` | `1198` | `11357 <-> 13753` |
| `11947` | `590` | `11357 <-> 12537` |

The last row uses a second center. It is therefore a nested relation, not a
fifth shell of the first ladder. In the declared order,

```text
J_11947 after J_12555 = translation by -1216.
```

In the verified PENT-05 fixture, the ten equatorial unit roots plus Zenith and
Nadir form six antipodal pillar pairs. Every pillar has midpoint zero and
length two. The reflection

```text
J_z(x,y,z) = (x,y,-z)
```

fixes all ten equatorial seam roots, exchanges Zenith and Nadir, maps the five
crown faces to the five root faces and preserves all pairwise Euclidean
distances.

The state-return operator remains a different type of object:

```text
(Q'_+)^2 = +I
(Q'_-)^2 = -I
```

but neither signed bridge is orthogonal. For both signs, a unit basis vector
is sent to a vector with squared norm `89`; equivalently, `Q'^T Q' != I`.
Thus algebraic return does not imply preservation of the geometric pillar
metric.

Primary and replay results are byte-identical with SHA-256
`0838b9806e554342568e40c0a7c7c22d38a627ba0dab5f2579e44ef554746589`.

## Interpretation

The proposed connection is valid at one sharply bounded layer:

```text
center + paired offsets + involution + fixed seam
```

This grammar appears both in the scalar Janus shells and in the Pascal
root/pillar fixture. It does **not** identify their dynamics. The geometric
reflection is an isometry; the signed reciprocal bridge is a return operator
whose intermediate metric behavior is different. This is the exact content
of `same outline != same dynamics` for the tested objects.

## Claim boundary

The source visual's `+18%` growth asymmetry and the symbols `sqrt(2)`, `pi`,
`e`, `lambda` and `g` remain unexecuted because no estimator, sample or
operator was defined. The result establishes no physical field, growth law,
resonance, historical derivation, new Family or PENT-08.
