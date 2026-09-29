# Operator collision matrix — test contract

Date: `2026-09-29`

Test ID: `NEXAH_OPERATOR_COLLISION_MATRIX_001`

Status: `PREREGISTERED FINITE ARITHMETIC TEST`

## Question

For the currently used number marks, where do the following independently
typed operations coincide, and where do they separate?

```text
A404(x) = x + 404                 additive arrow
D(x)    = 2x                      one dyadic lift
Rev(x)  = decimal digit reversal  representation operator
J(x)    = 1100 - x                fixed complement mirror
R(x)    = 12320 - x               111-grid half-turn
```

The test also records residues modulo `7`, `11`, `77`, `112` and `1232`, plus
row-major coordinates in the `111 x 111` and `112 x 110` finite grids whenever
the address is in range.

## Domain

Primary arc:

```text
404, 808, 1212, 1616, 2020, 2424, 3232
```

Controls:

```text
204, 292, 402, 403, 696, 1100, 12320, 12321
```

## Preregistered expectations

1. `A404(x)=D(x)` has the unique integer solution `x=404`.
2. `A404(404)=D(404)=808` is therefore an operator collision, not a general
   identity.
3. `A404(808)=1212`, while `D(808)=1616`.
4. `A404^2(808)=D(808)=1616`; the two paths agree only at the endpoint of this
   declared two-step subdivision.
5. `1212=3*404=12*101=(808+1616)/2` and is not in `{101*2^k}`.
6. `Rev(404)=404`, `Rev(204)=402`, `Rev(1212)=2121`.
7. `J(808)=292`, `J(404)=696`, and `J(1212)=-112`; the fixed complement
   window therefore ceases to contain the additive arc after `808`.
8. `R` and `J` have the same modulo-11 action because both constants are zero
   modulo 11, but they are not the same integer map.
9. The Knickfield `gate404(a,b)` truth table remains independently executable.
   It is not evaluated on the integer marks because no source-bound map
   `H(integer, measurement_state)->(a,b)` exists.

## Pass rule

All finite arithmetic, coordinate, residue, source-hash and gate truth-table
checks must pass. A missing cross-system map is recorded as `NOT_EVALUABLE`,
not converted into either a positive or negative gate observation.

## Claim ceiling

The test distinguishes operator collisions from identities. It does not infer
an SCN/NCS switch, physical transition, historical generator, cryptographic
trapdoor or M-Class promotion.
