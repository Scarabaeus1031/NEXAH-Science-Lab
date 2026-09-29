# Mirror–Carry and prime-gap residual addendum — test contract

Date: `2026-09-28`

Status: `OWNER_AUTHORIZED_EXISTING_FAMILY_EXTENSION`

## Questions

1. Are the state reflection `Q_B(z)=-z mod B`, half-edge reflection
   `R_B(z)=B-1-z` and raw radix complement `B-z` one typed family once phase
   and carry are retained?
2. Can the `1459=P232` versus `1471=P233` terminal error be identified with
   the existing Root7 `+/-1/12` Draft/Drift or `+/-1/112` microtick?

## Frozen domain

- bases `B=2,...,36` and all states `z=0,...,B-1`;
- exact carriers `101`, `41`, `37`, `1087`, `7801`;
- prime positions 232, 233 and 465;
- gap-frequency control over the first 10,000 primes;
- existing Root7 phase lenses `c12(n)=n mod 12` and
  `c112(n)=n mod 112`.

## Pass and boundary rule

The test passes only if the algebraic identities, fixed-point counts, carry
boundary and representation-width controls all reproduce exactly. Any use of
`1/12` or `1/112` must remain typed: a reciprocal prime-gap slope may not be
identified with an existing modular phase tick unless their residue actions
agree.

