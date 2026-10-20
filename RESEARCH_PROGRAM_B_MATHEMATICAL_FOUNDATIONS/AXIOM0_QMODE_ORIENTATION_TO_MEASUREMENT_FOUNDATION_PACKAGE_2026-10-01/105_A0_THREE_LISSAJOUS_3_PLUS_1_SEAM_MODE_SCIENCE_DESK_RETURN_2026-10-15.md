# A0 Three Lissajous 3+1 Seam Mode — Science Desk Return

Date: 2026-10-15  
Status: `DOCUMENTARY FORMAL-DESIGN RETURN / NOT ADMITTED / NO SCIENCE RUN`  
Identity: reuse `NEXAH_AX0_QMODE_FOUNDATION_PACKAGE`  
Navigator effect: `NO NEW IDENTITY / NO NEW RELATION / NO STATUS CHANGE`

## Question returned

The supplied visual material places three Lissajous views into one shared
overlay and asks whether their meeting can be read as `3 + 1`, specifically as
a seam mode. The bounded answer is **yes as a projection grammar**:

- `3` denotes the three cyclic coordinate projections `AM`, `VM`, and `PM`;
- `+1` denotes their shared coincidence or seam event;
- the `+1` is not a fourth body;
- this construction is not a solution of the Newtonian three-body problem.

This usage is consistent with the existing NEXAH foundational `3+1` grammar:
three distinguished views or roles plus an explicitly named binding,
observer, residual, or Return relation.

## Declared carrier and projections

Let one shared time parameter `t` drive three declared signals:

```text
s1(t) = sin(a t)
s2(t) = sin(b t + delta)
s3(t) = sin(t + delta/2)
```

The live instrument displays the cyclic projections

```text
P_AM(t) = (s1, s2)
P_VM(t) = (s2, s3)
P_PM(t) = (s3, s1).
```

These are three 2D records of one synthetic three-signal carrier. They are not
three gravitational bodies.

## Exact overlay algebra

The centroid of the overlay triangle is

```text
G(t) = ((s1+s2+s3)/3, (s1+s2+s3)/3).
```

It therefore always lies on the diagonal `x=y`. For the fixed cyclic vertex
order `P_AM -> P_VM -> P_PM`, the signed area is

```text
A_signed(t)
  = -1/4 [(s1-s2)^2 + (s2-s3)^2 + (s3-s1)^2].
```

Define the nonnegative dispersion

```text
D(t) = (s1-s2)^2 + (s2-s3)^2 + (s3-s1)^2 = 4 |A(t)|.
```

Hence

```text
D(t)=0  iff  s1(t)=s2(t)=s3(t).
```

At that instant all three projected points coincide at `(u,u)` and the
overlay triangle collapses. This is the exact **seam condition**.

The sign of the cyclic area is fixed away from degeneration; the overlay does
not pass through an orientation reversal without first collapsing at the
seam.

## 3+1 typing

```text
3 = {P_AM, P_VM, P_PM}
+1 = {D=0 shared coincidence event}
4 = the completed record: three views plus their binding/Return relation
```

The seam is an event or relation in the shared carrier, not an additional
object. A Return requires more than coincidence: an ordered time record, or
equivalent derivative information, must show approach, meeting or near
meeting, and re-separation while the three channels remain typed.

## State vocabulary

For an explicitly declared tolerance `epsilon > 0`:

| State | Condition | Meaning |
|---|---:|---|
| `SEPARATED` | `D > epsilon` | three overlay points are distinct at the chosen resolution |
| `NEAR_SEAM` | `0 < D <= epsilon` | bounded near-coincidence, not exact equality |
| `EXACT_SEAM` | `D = 0` | all three signal values and projected points coincide |

`epsilon` belongs to the measurement or display contract. It is not supplied
by the mathematics automatically.

## Default preset diagnostic

For the instrument default `a:b = 3:2` and `delta = pi/2`, a dense numerical
scan followed by local refinement over one loop found

```text
t approximately 0.3122526798108317
D(t) approximately 0.013394457185717435
|A(t)| approximately 0.0033486142964293587
(s1,s2,s3) approximately
(0.8056417904, 0.8112524330, 0.8901393336).
```

This supports the label `NEAR_SEAM_NOT_EXACT` for that preset. It is a
numerical diagnostic, not a formal global proof. No exact zero was established
within the tested tolerance.

## Novelty and physics boundary

Lissajous curves, higher-dimensional Lissajous trajectories, and coordinate
projections are established mathematical constructions. This record does not
establish external novelty for the cyclic overlay, the area identity as a
research result, or the NEXAH seam interpretation. A prior-art review would be
required before any novelty statement.

No masses, forces, initial-value equations, conserved quantities, or
Newtonian trajectories are defined here. Therefore the construction is not a
three-body solution, a tessarec theorem, or evidence for a physical light,
lunar, solar, energy, or information mechanism.

## Existing bindings reused

- package identity: `NEXAH_AX0_QMODE_FOUNDATION_PACKAGE`
- source binding: `SRC:A0OE:PASCAL_LISSAJOUS_MOBIUS_RETURN`
- Navigator binding: `SRC:NN:LISSAJOUS_MOBIUS_RETURN`
- live instrument: `A0_BOOK/A0_BLUE_PINK_DODECA_CELL_RETURN.html#threeLissajousPlanes`
- machine record: `A0_BOOK/assets/a0-blue-pink-dodeca-cell-return-v1.json`
- validator: `A0_BOOK/a0-blue-pink-dodeca-cell-return-tests.cjs`

## Disposition

This is a documentary Science Desk return under the existing A0 identity. It
creates no `F-A0` finding, Study, active research cycle, Navigator node,
relation, paper claim, or publication state.

A later formal successor may separately:

1. solve `s1=s2=s3` for a frozen ratio and phase;
2. define the observation tolerance and sampling contract;
3. test entry, transversality, and re-separation at a seam;
4. perform an external prior-art audit.

Those steps require a new bounded question and the applicable Owner gate if
they are promoted beyond documentary design work.
