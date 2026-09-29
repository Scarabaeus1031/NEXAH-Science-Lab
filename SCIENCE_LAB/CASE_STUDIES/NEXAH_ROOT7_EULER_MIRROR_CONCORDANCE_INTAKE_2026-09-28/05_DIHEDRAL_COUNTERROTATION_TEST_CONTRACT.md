# Dihedral counter-rotation test contract

Date: `2026-09-28`

Status: `OWNER_AUTHORIZED_EXISTING_FAMILY_EXTENSION`

## Question

Does the already registered rotation/reflection grammar close as one finite
dihedral operator family, and can one fixed member of that family generate the
Human Owner-corrected `11|537 -> 11|573 -> 11|357` 2+3-wheel sequence
(`11537 -> 11573 -> 11357`)?

## Frozen operators

For state `z` in `Z_B`:

```text
T_k(z) = z+k mod B
Q_B(z) = -z mod B
R_B(z) = B-1-z.
```

For a three-position word, use the six ordinary `D3` position permutations:
three rotations and three reflected rotations. The two-position prefix uses
the `D2` position actions, but its observed word `11` is invariant under both.

## Frozen domain

- every state and every step in bases 2 through 36;
- additional existing phase bases 112 and 144;
- explicit direction checks in bases 7, 12 and 112;
- corrected words `537`, `573`, `357` with prefix `11`;
- all fixed `D2 x D3` position actions;
- all ordered two-operator `D3` explanations as an underdetermination control.

## Pass rule

The algebraic family passes only if rotations compose, both reflections are
involutions and both conjugate every rotation to its inverse. The 2+3-wheel
claim passes as a single operator only if one fixed `D2 x D3` element maps both
successive transitions. Otherwise it is rejected as a single-operator rule;
alternating explanations are retained only as nonunique decompositions.

## Claim ceiling

Standard finite group action and representation audit only. No new theorem,
topological Mobius proof, physical rotation, prime law, navigation mechanism or
NEXAH capability.
