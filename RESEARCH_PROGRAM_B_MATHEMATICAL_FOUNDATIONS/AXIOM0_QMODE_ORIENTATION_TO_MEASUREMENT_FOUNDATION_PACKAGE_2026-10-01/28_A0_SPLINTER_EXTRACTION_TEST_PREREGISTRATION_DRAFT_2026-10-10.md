# A0 Splinter Extraction Test — Preregistration Draft

Date: `2026-10-10`

Status: `DRAFT_ONLY / NOT_ADMITTED / NOT_FROZEN / NOT_EXECUTABLE`

Backlog route: `A0-BL-035 PREPARE`

Predecessor evidence: closed `A0-BL-021`

## Governance notice

This document is a formal-design draft prepared during Structure Freeze. It
does not allocate a new Lab identity, authorize a run, reopen A0-BL-021 or
change the accepted `PATH_DEPENDENT_WITH_WITNESS` result. Admission would
require a separate Human Owner decision, one Study Owner, a frozen protocol,
Run Contract, implementation review and synchronized Lab Register entry.

## Bounded question

Does a local, representation-bounded Splinter signature extracted from each
of the 100 frozen A0-BL-021 histories explain the mapping from a `7x8` address
cell to its exact typed terminal class more efficiently than the address alone,
without reading or encoding the terminal class identifier?

Formally, for histories `h` and `h'`, test whether

```text
address(h) = address(h')
and SPL_LOCAL(h) = SPL_LOCAL(h')
imply class(h) = class(h').
```

## Frozen predecessor objects

```text
H = set of 100 oriented two-step histories
A = {1,...,7} x {1,...,8}, |A| = 56
C = exact typed terminal quotient, |C| = 56
Gamma = (A disjoint-union C, H), |V| = 112, |E| = 100
```

The candidate test must read the frozen A0-BL-021 protocol and primary result
by hash. It must not alter either file.

## Notation

`B` remains reserved for the Pascal face's base side in A0-BL-021. The test
uses `SPL` for the Splinter candidate. `B as Splinter` remains a searchable
Owner alias, not a mathematical definition.

## Candidate extractor

For each history `h=(e1,e2)`, construct a feature record using only declared
construction data available before reading the terminal class:

```text
SPL_LOCAL(h) = (
  edge_profile_1,
  fresh_side_1,
  edge_profile_2,
  fresh_side_2,
  second_edge_relation_to_first_new_vertex,
  cyclic_slot_displacement,
  local_boundary_profile_word_radius_r,
  local_corner_flag_word_radius_r,
  orientation_parity
)
```

The radii are frozen candidates `r in {0,1,2}`. The smallest successful radius
is preferred. Vertex labels must be canonicalized under the same orientation-
preserving cyclic relabelling used by A0-BL-021.

The extractor must not read:

- `class_id`;
- `typed_signature_sha256`;
- class multiplicity;
- any feature computed from a class aggregate;
- any manually selected feature chosen after inspecting failures.

## Comparator models

| Model | Input | Purpose |
|---|---|---|
| `M0_ADDRESS` | `address(h)` | reproduce the known insufficient 7x8 address baseline |
| `M1_PROFILE` | address plus the two edge profiles | test the cheapest seam-profile refinement |
| `M2_ORIENTED_SEAM` | `M1` plus the two fresh-side choices and orientation parity | test whether oriented seam choice is sufficient |
| `M3_SPLINTER_LOCAL_r` | complete `SPL_LOCAL` at frozen radius `r` | primary Splinter candidate |
| `M4_FULL_HISTORY` | canonical full two-event history | positive ceiling; not accepted as compression |
| `M5_TERMINAL_ORACLE` | terminal typed signature | leakage control only; never a candidate explanation |

## Primary metrics

For every model `M`, report:

```text
signature_count(M)
collision_pairs(M)
impure_signature_count(M)
conditional_entropy H(C | M)
maximum classes per signature
compression ratio = signature_count(M) / 100
```

An impure signature is one that occurs with more than one terminal class.

## Primary decision rule

- `SPLINTER_SUFFICIENT_COMPRESSED`: some frozen `M3_SPLINTER_LOCAL_r` has zero
  impure signatures, zero collision pairs across different classes, fewer than
  100 signatures and passes every symmetry and leakage control.
- `SPLINTER_PARTIAL`: every `M3` remains impure, but at least one strictly
  reduces both conditional entropy and impure-signature count relative to
  `M0_ADDRESS` and survives controls.
- `SPLINTER_NOT_IDENTIFIED`: no `M3` improves the address baseline, or only the
  full history / terminal oracle is sufficient.
- `UNDEFINED_CONTRACT`: the local neighborhood or orientation parity cannot be
  reconstructed uniquely from the frozen object.
- `INVALID_EXPERIMENT`: a hash, replay, symmetry, leakage, permutation or
  implementation control fails.

## Symmetry and Inside-Out controls

1. `C5` rotation: canonical Splinter signatures and impurity metrics must be
   invariant under the declared rotation action.
2. `D5` reflection control: reflection is tested separately and is not silently
   inserted into primary equality.
3. Provisional Inside-Out map `J`: reverse boundary order, exchange
   `left-radial <-> right-radial`, keep `base -> base`, and retain the seam as
   an unoriented endpoint set.
4. Verify `J^2 = identity` on every extracted candidate.
5. Report whether `J` induces a function on terminal classes. Failure is a
   valid negative result and blocks an Inside-Out class claim.

`J` is a finite combinatorial orientation control. It is not evidence of a
physical interior/exterior inversion.

## Negative and destruction controls

- permute Splinter signatures across histories within address cells;
- remove fresh-side orientation;
- remove cyclic displacement;
- remove Corner Flags;
- replace local words with their unordered multisets;
- switch from one-based `7x8` addresses to zero-based addresses;
- compare with an equal-cardinality random partition fixed before execution;
- confirm that `M5_TERMINAL_ORACLE` is detected as forbidden leakage.

The zero-/one-based address change must not alter any scientific result.

## Secondary candidate: corridor incidence object

The exact crosswalk also supports a non-primary representation in which each
history is made into a middle node:

```text
A -- incidence --> H -- incidence --> C
56                 100                56
```

This `56+100+56=212` incidence subdivision is a useful visualization of `H`
as a Splinter corridor. It is not the primary sufficiency test because using a
unique history node would explain its own endpoint tautologically.

## Explicit exclusions

This draft does not test or establish:

- a physical transition barrier, flow or energy;
- a universal Splinter operator;
- a metric inside/outside membrane;
- identity between the 112-meta-vertex graph and the 112-node Pascal carrier;
- a structural map behind `1008 = 9 x 112 = 7 x 144`;
- an eighth-face extension, generalized `m,d` family, PENT-08 or canonical
  A0 Family;
- publication novelty or external prior art.

## Resource and STOP plan for a future admitted run

- one primary deterministic extraction;
- one byte-stable replay;
- one independent verifier using the frozen JSON only where possible;
- no parameter tuning after the primary result;
- stop after the declared radii and controls;
- retain negative, partial, undefined and invalid outcomes.

## Draft readiness gaps

Before admission:

1. freeze the exact address extraction already used in the 7x8 crosswalk;
2. specify `cyclic_slot_displacement` and `orientation_parity` without prose;
3. prove the local-word canonicalizer is independent of vertex names;
4. decide whether reconstruction from `run_confluence.py` is permitted or a
   richer frozen predecessor artifact is required;
5. prepare the implementation, independent verifier and Run Contract;
6. obtain explicit Human Owner admission and activation after Structure Freeze.

## Current disposition

```text
ARCHAEOLOGY_COMPLETE = YES_BOUNDED
TEST_DESIGN_COMPLETE = DRAFT
STUDY_ID_ALLOCATED = NO
LAB_REGISTER_CHANGED = NO
RUN_AUTHORIZED = NO
RUN_EXECUTED = NO
NEXT_ACTION = OWNER_REVIEW_OF_DRAFT_OR_RETAIN_PARKED
```

