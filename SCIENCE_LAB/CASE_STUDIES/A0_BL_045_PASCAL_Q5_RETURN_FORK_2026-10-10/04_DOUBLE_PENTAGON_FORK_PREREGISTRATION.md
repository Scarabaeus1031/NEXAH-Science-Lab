# A0-BL-045 — Double-Pentagon (Q') fork preregistration

Date: `2026-10-10`

Owner correction: the five-step matrix (Q^5) is a local half-orbit on one
pentagon.  The intended carrier contains two pentagons, hence ten positions.
This extension preserves the completed (Q^5) run as a local control and tests
explicit, non-equivalent lifts to the doubled carrier.  The exact entry
`(Q^5)00=8=2^3` is recorded as an arithmetic feature; it is not promoted to a
level law without a separate map.

## Frozen question

Which additional statement is required for a ten-position double-pentagon
return: ten sequential steps, two parallel five-step copies, a bridge that
swaps equal copies, or a bridge joining reciprocal copies?

## Frozen candidates

Let

```text
Q  = [[1,1],[1,0]]
M  = Q^5
Mi = M^-1
S  = block-swap on V_A + V_B
```

The candidates are:

1. `sequential_10 = Q^10`;
2. `parallel_5_5 = M direct-sum M`;
3. `same_direction_bridge = S (M direct-sum M)`;
4. `reciprocal_bridge_Qprime(+1) = S (M direct-sum Mi)`;
5. `reciprocal_bridge_Qprime(-1)`, with a declared sign on the return leg.

The last operator acts as

```text
Q'_epsilon(a,b) = (epsilon Mi b, M a),  epsilon in {+1,-1}.
```

Consequently the preregistered target identity is

```text
(Q'_epsilon)^2 = epsilon I.
```

`epsilon=+1` means exact oriented-state return after two half-orbits.
`epsilon=-1` means anti-return after two, projective return if global sign is
quotiented, and exact oriented-state return after four.

## Frozen checks

- exact integer matrices, trace and determinant;
- whether the carrier label returns after two bridge applications;
- whether the full state operator is the identity;
- whether closure follows from merely having ten positions or requires the
  reciprocal second leg;
- whether the declared level sign yields `+I` or `-I` after two half-orbits.

## Result vocabulary

- `DOUBLE_RETURN_REQUIRES_RECIPROCAL_BRIDGE`
- `SIGNED_DOUBLE_RETURN_IDENTIFIED`
- `TEN_STEP_RETURN_IDENTIFIED`
- `DOUBLE_RETURN_UNDERDETERMINED`
- `INVALID_EXPERIMENT`

## STOP boundary

An exact reciprocal-bridge closure is an algebraic conditional result.  It
does not establish that archaeology, a picture, a Möbius carrier or Pascal
weights independently derive `Mi`.  No physical mechanism, historical intent
or canonical Pascal-to-state map is inferred.
