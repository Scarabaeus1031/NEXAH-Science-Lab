# A typed D30 phase lift for a five-register Pascal carrier

Subtitle: Relational quotient return, branch-word accounting and
non-factorization through an earlier gear

Date: `2026-10-11`

Status: `INTERNAL_COMPANION_NOTE_DRAFT / FORMAL_DESIGN_RECORD / R0_DOCUMENTED / NOT_ADMITTED / NOT_SUBMITTED`

Identity reused: `SCC-003 / A0OE:PASCAL_PENTAGON_D5_TEST`

Backlog relation: `A0-BL-023 / A0-BL-051`

## Abstract

For each raw incidence `(f,n,k)` of the frozen five-face, depth-six Pascal
carrier, we study two source-bound encodings. The first maps into
`C5 x C5 x C6 x C12`; the second replaces its last coordinate by the exact
phase lift `p=2k-n mod 30`. Pascal left and right branches then advance that
phase by `-1` and `+1`. The encoding is injective on all 140 raw incidences,
but it is not constant on quotient fibres: interior, seam and apex nodes retain
one, two and five addresses respectively. Exact return to the 106-node quotient
is therefore relational rather than a canonical single-address embedding.
Enumerating all branch words of lengths zero through six verifies the endpoint,
multiplicity and phase rules. Only 13 of 30 phases occur at frozen depth six.
No character of the earlier `C5 x C5 x C6 x C12` gear realizes the signed unit
D30 schedule, and no current source selects a canonical H3 identity or one of
480 oriented E8 lane charts. These statements validate a formal design fixture;
they do not constitute an admitted Science Lab experiment or establish a
physical mechanism.

## 1. Scope

This note explains the formal Pascal–Rosetta adapter and its negative
boundaries. It is a companion to, not an extension of the theorem in, the
SCC-003 finite-quotient paper.

The note does not claim:

- a new Pascal quotient, `PENT-08` or generalized family;
- a canonical operator on quotient nodes;
- an identity between the D30 phase cycle, H3 roots or E8 coordinates;
- experimental evidence, physical resonance or utility;
- publication, novelty or priority.

## 2. Frozen carrier and C12 address

Let `f in C5` index the retained Pascal faces and let
`0 <= k <= n <= 6`. The formal design fixture defines

```text
F12(f,n,k) = (a,b,d,q)
            = (f, f+k mod 5, n mod 6, 2k-n mod 12).
```

The two Pascal branches act as

```text
L(a,b,d,q) = (a, b,   d+1, q-1),
R(a,b,d,q) = (a, b+1, d+1, q+1),
```

with component arithmetic modulo `5,5,6,12`. The frozen verifier checks all
210 raw face-edge incidences. Generic locked and counter-rotating schedules
match `0/210`; branch-collapsed left and right controls each match only their
own `105` incidences; the branch-aware schedule matches `210/210`.

## 3. The quotient joint is a relation

The raw encoding has 140 addresses. After the SCC-003 quotient, address
multiplicity records the glued face provenance:

```text
75 interior quotient nodes x 1 address
30 seam quotient nodes     x 2 addresses
 1 common apex             x 5 addresses
                                  = 140 addresses.
```

For quotient node `v`, the honest joint is therefore

```text
J(v) = {F12(x) : pi(x)=v}.
```

Selecting any member returns exactly through `rho(F12(x))=pi(x)`. A
rotation-equivariant single-address selector cannot exist: the quotient apex
is fixed by the C5 rotation, while its five addresses form a free five-cycle.
Forcing one address would erase provenance or break the symmetry.

## 4. Exact D30 phase lift

Define

```text
p30(f,n,k) = 2k-n mod 30,
F30(f,n,k) = (f, f+k mod 5, n mod 6, p30).
```

Then each Pascal branch is a signed unit phase step:

```text
left:  p -> p-1,
right: p -> p+1.
```

The corresponding ordered reflection compositions are rotations by `-12°`
and `+12°`, each of order 30. Reversing operator order reverses direction.

## 5. Five registers, not five new operators

The existing face address receives the one-based view

```text
D1 <-> f=0, D2 <-> f=1, ..., D5 <-> f=4.
```

The finite cover is `C5_D x C30_P` with 150 register-phase positions. Each
register contains 28 frozen incidences and all 127 branch words. At depth at
most six, only 13 phases occur per register, so 65 of 150 positions are
occupied.

`D1..D5` are address registers. They are not the dihedral group `D5`, five
operators, five Studies or five scientific identities. The projection
`(f,n,k)->(Dj,p)` is lossy; adding depth gives the exact frozen reconstruction
key `(Dj,n,p)`.

## 6. Complete branch-word accounting

There are 127 words of lengths zero through six and 635 face-word instances.
At fixed depth `n`, a word with `k` right steps reaches endpoint `(n,k)` with
multiplicity `binomial(n,k)` and phase `2k-n`.

This separates two legitimate compressions:

1. many histories collapse intentionally to the same Pascal endpoint;
2. register, depth and phase still reconstruct every frozen raw incidence.

The result is an exact partial D30 lift, not a complete 30-state orbit.

## 7. Non-factorization through the old gear

The earlier gear carrier is

```text
G = C5 x C5 x C6 x C12.
```

All 900 characters `G -> C30` were enumerated. None maps left and right
transitions to `-1` and `+1`: contributions from the C6 and C12 factors to
C30 are multiples of five. The signed unit schedule therefore requires the
explicit D30 phase coordinate; it is not a relabeling of the old gear.

## 8. H3 and E8 boundary

The standard H3 root orbit is a separate 30-point carrier with 60
nearest-neighbour edges and degree four; its Coxeter element decomposes the
roots into three ten-cycles. The E8 Coxeter coordinate model has `8 x 30`
positions. Choosing an oriented Pascal-to-E8 lane chart requires lane, origin
and orientation, giving `8 x 30 x 2 = 480` candidates.

No present rule selects one candidate. Matching cardinality or a shared
30-phase readout does not identify the carriers.

## 9. Evidence and limitations

The source fixture validates:

- 210/210 branch-aware C12 incidences;
- exact quotient return as a relation;
- the single-selector non-existence control;
- all 127 depth-six branch words and 635 face-word instances;
- the 13-of-30 frozen phase support;
- non-factorization through all 900 old-gear characters;
- explicit H3/E8 non-identity and selection boundaries.

It does not resolve the admitted-status question in `A0-BL-023`, execute the
five-gate design in `A0-BL-051`, or establish a result beyond the frozen formal
fixture. Those steps require a separate Human Owner decision, Admission and—if
execution is selected—a Run Contract.

## 10. Source hierarchy

Controlling sources:

- [formal Pascal–Rosetta design fixture](<../../../../10 NEXAH CORE/NEXAH/RESEARCH/NOTES/PASCAL_PENTAGON_D5_TEST_2026-10-10/PASCAL_ROSETTA_JOINT_DESIGN_2026-10-11/README.md>);
- [D30 branch-word audit](<../../../../10 NEXAH CORE/NEXAH/RESEARCH/NOTES/PASCAL_PENTAGON_D5_TEST_2026-10-10/PASCAL_ROSETTA_JOINT_DESIGN_2026-10-11/D30_BRANCH_WORD_AUDIT_2026-10-11/README.md>);
- [machine-readable design result](<../../../../10 NEXAH CORE/NEXAH/RESEARCH/NOTES/PASCAL_PENTAGON_D5_TEST_2026-10-10/PASCAL_ROSETTA_JOINT_DESIGN_2026-10-11/RESULT.json>);
- [machine-readable D30 result](<../../../../10 NEXAH CORE/NEXAH/RESEARCH/NOTES/PASCAL_PENTAGON_D5_TEST_2026-10-10/PASCAL_ROSETTA_JOINT_DESIGN_2026-10-11/D30_BRANCH_WORD_AUDIT_2026-10-11/RESULT.json>).

Editorial placement and paper-lane decisions are recorded in the
[A0 Findings and Paper Workspace](32_A0_FINDINGS_AND_PAPER_WORKSPACE_2026-10-11.md).

