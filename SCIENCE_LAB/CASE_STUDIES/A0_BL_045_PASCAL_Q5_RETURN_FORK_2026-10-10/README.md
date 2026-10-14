# A0-BL-045 — Pascal Q5 / Double-Pentagon Q' Return Fork

Study ID: `A0_BL_045_PASCAL_Q5_RETURN_FORK_2026_10_10`

Status: `CLOSED / SIGNED_DOUBLE_RETURN_AND_PILLAR_SEPARATION_IDENTIFIED / OWNER_ACCEPTED_2026-10-10`

This bounded audit tests the exact proposed chain

```text
Pascal orbit 20 -> Q^5 -> trace 11, determinant -1
                -> untwisted / twisted return.
```

The arithmetic and both finite strip quotients pass. Primary and replay are
byte-identical, and the independent local verifier passes. The result is
`RETURN_TYPE_UNDERDETERMINED`:

- `Q^5=[[8,5],[5,3]]`, `trace=11`, `det=-1` for both seam topologies;
- the untwisted quotient has two boundary components;
- the twisted quotient has one boundary component;
- neither standard seam has a nonzero rational fixed state;
- `Q^-5` closes exactly only as a tailored inverse control.

Therefore determinant `-1` does not select a Möbius return. A canonical
Pascal-to-Fibonacci state map remains undefined.

The Owner then corrected the carrier: `Q^5` is one pentagon's local half-orbit;
the intended object has two pentagons and ten positions. The frozen companion
fork distinguishes `Q^10`, `Q^5 direct-sum Q^5`, an equal-direction bridge and
the signed reciprocal bridge

```text
Q'_epsilon(a,b) = (epsilon Q^-5 b, Q^5 a).
```

The replayed exact result is `(Q'_epsilon)^2=epsilon I`. Thus `epsilon=+1`
returns exactly after two half-orbits; `epsilon=-1` yields anti-return (`-I`),
or projective return only under an explicit sign quotient, and returns exactly
after four. The matrix entry `8=2^3` is exact but does not derive the level
sign. Two pentagons and ten positions alone do not determine `Q'`.

The Owner-authorized pillar-distance companion audit then tests the apparent
link between the Janus distance shells and the PENT-04/05 Pascal-pyramid
pillars. It passes with a necessary operator separation:

- scalar pairs `c-r <-> c+r` and the six Pascal root pillars share an exact
  centered-reflection grammar;
- `J_z(x,y,z)=(x,y,-z)` fixes the equatorial seam, exchanges Crown and Root,
  and preserves every Euclidean distance;
- the two scalar centers `12555` and `11947` are nested relations, not one
  ladder; their reflections compose to a translation by `-1216`;
- `Q'_+` and `Q'_-` retain their `+I/-I` return laws but are not Euclidean
  isometries (`||Q'e_1||^2=89`).

Thus the pillar connection is exact at the reflection/invariant layer, while
the return dynamics remain operator-specific. The visual's `+18%` growth
marker and named constants remain untested because no estimator or operator
was supplied.

Read: [admission](00_ADMISSION_RECORD.md) ·
[preregistration](01_PREREGISTRATION.md) ·
[Run Contract](RUN_CONTRACT.md) ·
[result assessment](02_RESULT_ASSESSMENT.md) ·
[evidence map](03_EVIDENCE_MAP.md) ·
[double-pentagon preregistration](04_DOUBLE_PENTAGON_FORK_PREREGISTRATION.md) ·
[double-pentagon result](05_DOUBLE_PENTAGON_RESULT_ASSESSMENT.md) ·
[pillar-distance preregistration](06_PILLAR_DISTANCE_AUDIT_PREREGISTRATION.md) ·
[pillar-distance result](07_PILLAR_DISTANCE_AUDIT_RESULT_ASSESSMENT.md) ·
[capability and eliminated-questions update](08_CAPABILITY_AND_ELIMINATED_QUESTIONS_UPDATE.md) ·
[canonical Labreport](../../LABREPORTS/MATHEMATICS/LABREPORT_A0_BL_045_PASCAL_Q5_RETURN_FORK_001.md).

The Human Owner accepted the bounded disposition on `2026-10-10`. The Study is
closed. No successor, PENT-08, new Family or publication is authorized by this
package.
