# A0-BL-045 — Frozen preregistration

Date: `2026-10-10`

Status: `DESIGN_FROZEN_BEFORE_EXECUTION`

## Primary question

Test whether

```text
Pascal orbit 20 -> Q^5 -> trace 11, determinant -1
```

selects one of two seam returns:

```text
U: (5,v) ~ (0,v)       untwisted
T: (5,v) ~ (0,1-v)     twisted
```

The numerical state and strip-fiber coordinate remain separate unless an
explicit coupling is declared.

## Frozen objects

```text
P = five cyclic positions, each with weight C(6,3)=20
Q = [[1,1],[1,0]]
M = Q^5
U_state = I
T_state = diag(1,-1)
C_state = Q^-5          compensating control only
```

For the finite strip use five longitudinal segments and two transverse
boundary rows. Count boundary components after the two declared endpoint
identifications.

## Tests

1. verify five weights of `20` and total displayed orbit weight `100`;
2. verify `M=[[8,5],[5,3]]`, `trace(M)=11`, `det(M)=-1`;
3. verify the untwisted and twisted strip quotients have respectively two and
   one boundary components;
4. verify the same `M`, trace and determinant are attached to both quotients;
5. compute `det(U_state*M-I)` and `det(T_state*M-I)`; nonzero values prove
   that neither declared map has a nonzero rational fixed state;
6. verify `C_state*M=I`, while marking this as a tailored inverse control and
   not a topology-derived seam;
7. run one byte-identical replay and an independent result verifier.

## Decision rule

- `TWISTED_RETURN_IDENTIFIED`: only the preregistered twisted model yields the
  declared nonzero state return and all controls pass.
- `UNTWISTED_RETURN_IDENTIFIED`: only the untwisted model does so.
- `RETURN_TYPE_UNDERDETERMINED`: the Q-matrix invariants are identical across
  both topologies, or neither standard seam closes the nonzero state.
- `UNDEFINED_CONTRACT`: the frozen objects cannot be constructed uniquely.
- `INVALID_EXPERIMENT`: any exact arithmetic, topology, replay or verifier
  control fails.

## Claim ceiling

The audit separates linear-state monodromy from strip topology. It does not
construct a canonical Pascal-to-Fibonacci map, prove a Möbius embedding from
`det=-1`, identify a physical return or establish a universal five-step law.
