# A0-BL-021 — Frozen preregistration

Date: `2026-10-10`

Status: `DESIGN_FROZEN_BEFORE_EXECUTION`

## Question

Starting from the verified open five-face depth-six Pascal carrier, do all
admissible two-face extensions reach the same typed seven-face state, or can
different seam choices or face orientations produce non-isomorphic terminal
states?

## Frozen object

Each oriented coarse triangle has corners `(A,L,R)` and carries the standard
depth-six Pascal DAG

```text
(n,k) -> (n+1,k), (n+1,k+1),   0 <= n < 6.
```

Its oriented sides are:

```text
L : A -> L      weight profile 1,1,1,1,1,1,1
B : L -> R      weight profile 1,6,15,20,15,6,1
R : R -> A      weight profile 1,1,1,1,1,1,1
```

An attachment replaces one oriented boundary edge `u -> v` by `u -> w -> v`
and glues the selected side of the fresh face to `v -> u`. Only equal weight
profiles may be identified. A base edge therefore receives a base side; a
radial edge may receive either radial side.

The baseline `K5` is generated from one face by four successive attachments to
the current terminal radial edge using the fresh `L` side. This reproduces the
PENT-06 open fan with `112` Pascal nodes and seven coarse boundary edges.

## Frozen enumeration

1. Enumerate every admissible first attachment from `K5`.
2. From every resulting six-face state enumerate every admissible second
   attachment.
3. Stop at seven faces. Eight faces are out of scope.
4. Do not deduplicate histories before constructing their terminal states.

## Typed equality

The primary equality is exact equality of canonical serializations under
orientation-preserving cyclic relabelling of the boundary. A serialization
contains:

- ordered boundary edge profiles;
- Angle-Node / Corner-Flag words formed from incoming and outgoing edge
  profiles and the declared positive boundary orientation;
- every face as one distinguished apex plus an unordered base-endpoint pair;
- the boundary length and face count.

This coarse decorated form is exact for the declared carrier: the fixed
depth-six Pascal DAG and every allowed seam quotient are functorially
determined by those records. The runner must additionally reconstruct the
expanded Pascal quotient and report node/edge counts, weights, seam-class
sizes, degrees and face-incidence counts.

Reflection is not silently included in primary equality. A separate dihedral
canonical form is used only for the declared reflection control.

## Frozen controls

| Control | Expected behavior |
|---|---|
| Identity | the same history compared with itself must match exactly |
| Reflection | a reflected terminal state must match only under the declared dihedral comparison |
| Equal count | all full-seam seven-face histories have `154` Pascal nodes; this must not force typed equality |
| Adjacent fork | two first attachments on neighboring baseline boundary edges are compared |
| Nonadjacent fork | two first attachments on separated baseline boundary edges are compared |
| Orientation fork | `L` versus `R` attachment on one radial edge is compared |
| Angle-word mutation | changing one Corner Flag while retaining the untyped carrier must fail typed equality |
| Open boundary | `K5` has seven and each one-face extension has eight boundary edges |

## Decision rule

- `PATH_DEPENDENT_WITH_WITNESS`: at least two admissible terminal histories
  have different exact typed canonical forms.
- `CONFLUENT_UNDER_DECLARED_CLASS`: the complete declared enumeration has one
  exact typed terminal class and every control passes.
- `CONDITIONALLY_CONFLUENT`: more than one unrestricted class exists, but one
  preregistered restriction represented in the output yields a single class.
- `UNDEFINED_CONTRACT`: an admissibility or equality rule cannot be applied.
- `UNINFORMATIVE_CONTROL`: the chosen histories are not genuinely distinct.
- `INVALID_EXPERIMENT`: a frozen control, invariant, replay or implementation
  check fails.

Finite enumeration may refute confluence for this declared class. It cannot
prove unrestricted, all-depth or all-face confluence.

## STOP and claim ceiling

- No metric angles are computed.
- Corner Flags do not add Pascal vertices.
- No seven-edge boundary is called a regular heptagon.
- No eight-edge boundary is called a regular octagon.
- `154=154` is never used as an isomorphism test.
- No result modifies SCC-003, PENT-06, a canonical A0 Family or any physical
  stability/flow claim.
