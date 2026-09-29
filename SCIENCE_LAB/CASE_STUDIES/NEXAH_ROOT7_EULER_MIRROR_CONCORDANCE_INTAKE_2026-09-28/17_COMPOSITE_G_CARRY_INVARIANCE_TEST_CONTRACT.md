# Composite G / carry-invariance test contract

Date: `2026-09-29`

Test ID: `NEXAH_COMPOSITE_G_CARRY_INVARIANCE_001`

Status: `RETROSPECTIVE_CONFIRMATORY / COMPONENTS PREVIOUSLY KNOWN`

## Question

Does the typed composition

```text
G_k = D^k o C4 o F
```

preserve the declared carrier, mirror, gap and normalized-position invariants
before, at and beyond the decimal carry boundary `808 -> 1616`?

## Frozen operator meanings

The symbols are not inferred from the attached visuals.  They are bound to the
already tested records:

1. `F(3,1;9)=97`, where the recurrence is seeded by `(3,1)` and every next
   term is the sum of the preceding two;
2. `C4(n)=n+4`, the typed gap-four cut, hence `C4(F)=101`;
3. `D^k(n)=2^k*n`, for integer `k=0..20`;
4. paired carrier state
   `(A_k,B_k)=(D^k(F),D^k(C4(F)))=(97*2^k,101*2^k)`.

## Frozen invariant types

- **provenance carrier:** `A_k/2^k=97`, `B_k/2^k=101`, equivalently odd
  cores 97 and 101;
- **scale-covariant mirror:** midpoint `m_k=99*2^k` and
  `M_k(x)=2*m_k-x`;
- **raw gap:** `B_k-A_k=4*2^k` (covariant, not constant);
- **normalized gap:** `(B_k-A_k)/(A_k+B_k)=2/99`;
- **normalized positions:** relative to midpoint and half-gap, A is `-1`, the
  midpoint `0`, and B `+1`; equivalently interval coordinates are `0,1/2,1`;
- **typed trace:** recurrence, cut and lift remain distinct operator phases.

## Representation controls

The following are explicitly *not* assumed to be structural invariants:

- decimal palindrome status;
- three-digit `P(a,10,z)` carrier membership;
- primality;
- raw residues modulo 11;
- the fixed complement `J_1100(n)=1100-n`;
- constant absolute gap four.

The expected carry boundary is the first `k` for which `B_k` ceases to be a
three-digit palindrome: `k=4`, `B_4=1616`.

## Operator-order control

Compare

```text
D^k(C4(F)) = 101*2^k
C4(D^k(F)) = 97*2^k + 4.
```

They must agree only at `k=0`; their difference must be `4*(2^k-1)`.

## Decision rule

- `FULL_TYPED_SCALE_INVARIANCE`: every typed invariant passes for `k=0..20`;
- `REPRESENTATION_BOUNDARY_ONLY`: the typed invariants pass while one or more
  declared representation controls break at carry;
- `STRUCTURAL_FAILURE`: any typed invariant fails.

No physical, temporal, SCN, 404-gate, E8 or historical-generator identity may
be inferred from this test.

## Visual provenance

The eleven attached images are historical/visual context only. SHA-256 values,
in attachment order:

```text
c90f4ae68906a291cf7f73b9c169d139514ac32b1377c46a575e3db8fcebbadd
6e7fe1b925170535d52764604be56350d49666e892422c7e4c08a037f405514c
b67b479b54b4903edf82308007a108b3058e2355fa7e33f7a901608574aec4e3
7eebae6c0884648da324cc71d6978769ea4a605dec6fbae3857603dbafdc6d09
c53f229c7ce08a525e78e43bd9820cbb01e24f9fc8f23c91911b6e268b721291
97f8629eddc5a438e4560c05b7157f41425dbaeefff016dfaf47bac5c978faef
8896844974fb2a4ca7f2b731ad5c8d17181df8e1523c72427694cc6792be2cc4
de27357c543f7fedecf5258fef9c0c502067ee510d78ce850fa03d71aacb30a6
2be7286ebadfb0b0f265c0ea11f0976dc2d3067f5755ee5c441d89258eb98965
45abf1ff88d3e541766ed9f2b0ca49d34abf3c88eb9b6e74aafe2461777e083c
a1a15438d23a5aca5dd76cd5d2c6dba7c2eeb63a902f32b263366885ef2b2eb4
```

