# PRIMEGRID BLOCK 2B — Trinary Pascal / Antipode Preregistration

Date: `2026-10-07`

Status at lock: `PREREGISTERED / NOT YET EXECUTED`

## Question

Does the three-symbol path carrier project onto the trinomial Pascal pyramid
with exact multiplicity `n!/(i!j!k!)`, and can one global orientation bit add
a fixed-point-free antipodal view without changing that carrier?

## Frozen state and counts

```text
i+j+k=n
Omega(n;i,j,k)=n!/(i!j!k!)
sum Omega = 3^n
A(i,j,k,sigma)=(k,j,i,-sigma)
oriented path count = 2*3^n
```

The local alphabet is the existing mutation-address product
`trit x direction = 3 x 2 = 6`. This is a representation layer. The test does
not use `6^n`, which would mean an independent direction choice at every step.

## Frozen typed handles

1. `41–42–43`, where `42=2*3*7`.
2. `1031–1032–1033`, where `1032=2^3*3*43=24*43`.
3. Both gates have residue projection `(5,6,7) mod 9`; this is not a selector.
4. `1078 <-> 8701` is decimal reversal and `gcd(1078,8701)=77`.
5. `73,79,83,89,97,101` have prime indices `21..26`; page turn is `P25 -> P26`.
6. `3299/3301` is a twin-prime anchor with no frozen selection operator.
7. `100/2=50` is a neutral residual boundary, not a prime selector.

## Gates

The execution requires trinomial recurrence, node counts, path sums, global
antipode count, involution, six-state alphabet, the five typed-handle controls,
and byte-identical replay. All must pass for
`SUPPORTED_AS_TRINARY_PASCAL_ANTIPODE_WITH_TYPED_NUMBER_HANDLES`.

## Prohibited conclusions

- a numerical handle proves Coxeter, E8 or physical identity;
- equal residues derive one gate from the other;
- `3301` is selected by this construction;
- decimal reversal is base-independent;
- the global antipode count `2*3^n` may be replaced by `6^n` without changing the model.
