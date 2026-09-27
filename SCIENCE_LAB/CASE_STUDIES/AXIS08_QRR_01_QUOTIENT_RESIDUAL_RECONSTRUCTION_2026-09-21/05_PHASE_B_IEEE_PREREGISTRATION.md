# AXIS08-QRR-01 Phase B — IEEE semantic transfer preregistration

Status: `PREREGISTERED_NOT_EXECUTED`

## Transfer decision

The semantic gate passes for one bounded transfer. The canonical IEEE Geometry
frames contain a raw bus-voltage profile in `pu`, from which both the minimum
and maximum bus voltage are obtained without adding a new measurement. The
existing seven-feature view already contains the minimum. Phase B adds the
maximum to form an eight-component audit state and places the voltage-envelope
endpoints in positions 7 and 8.

This is an audit projection, not a replacement for the maintained IEEE Geometry
representation.

## Frozen state

For each converged load-scale frame:

```text
x = [mean(vm), std(vm), range(va), max(line loading), sum(P+), sum(Q+), min(vm), max(vm)]
```

Units and provenance remain explicit. Standardization is fitted on converged
IEEE-9 development frames only and applied unchanged to IEEE-14.

## Frozen operator

After feature-wise IEEE-9 standardization, let `a=z_min` and `b=z_max`:

```text
q = (a + b) / sqrt(2)
r = (a - b) / sqrt(2)
```

`Q_ONLY7` stores the first six standardized coordinates and `q`.
`Q_PLUS_R8` additionally stores `r`. The transform `(a,b) <-> (q,r)` is
orthogonal and exactly invertible up to floating-point error.

The equal weighting is fixed before execution because both paired variables
are endpoint summaries of the same bus-voltage profile in the same unit. It is
not claimed to be an electrical law.

## Frozen comparison views

- `FULL8`: the standardized eight-component audit state.
- `Q_ONLY7`: AXIS08 quotient without residual.
- `Q_PLUS_R8`: quotient plus explicit residual; eight stored scalars.
- `PCA7`: seven-component PCA fitted on IEEE-9 only.
- `RANDOM7`: seeded orthonormal seven-dimensional projection (`seed=8208`).
- `DROP_MIN7` and `DROP_MAX7`: simple coordinate-removal controls.
- `MAINTAINED7`: the existing canonical seven-feature IEEE Geometry view,
  standardized on IEEE-9 only.

## Frozen metrics

Against `FULL8`, report for IEEE-9 and untouched IEEE-14:

1. normalized all-pairs distance RMSE and distance correlation;
2. median and maximum relative adjacent-displacement error;
3. relative cumulative path-length error;
4. mean absolute consecutive-turn-angle error;
5. exact reconstruction maximum error for `Q_PLUS_R8` in standardized and raw
   coordinates;
6. quotient blindness and quotient-plus-residual detection on constructed
   kernel counterfactuals.

Failed IEEE-9 frames remain explicit and are not imputed or bridged. Geometry
uses the contiguous converged campaign segment, matching the source protocol.

## Primary gates

1. Source-derived minimum and all seven maintained features must reproduce the
   committed system summaries to tolerance `1e-12`.
2. `Q_PLUS_R8` reconstruction error must be `< 1e-12` on IEEE-9 and IEEE-14.
3. `Q_PLUS_R8` pairwise distances must agree with `FULL8` to `< 1e-12`.
4. `Q_ONLY7` must be blind to nonzero kernel counterfactuals to `< 1e-12`.
5. `Q_PLUS_R8` must detect every counterfactual at tolerance `1e-12`.
6. IEEE-14 receives the frozen IEEE-9 standardization and fitted baselines;
   no evaluation refit is permitted.

The comparison baselines are descriptive. No method-superiority gate is
registered.

## Claim ceiling

Allowed: bounded representation-fidelity and reconstruction findings for the
committed IEEE-9/14 load-scale campaigns.

Prohibited: stability prediction, early warning, risk estimation, causal or
control claims, physical identity, universal optimality, or the claim that
`Q_PLUS_R8` compresses eight dimensions into seven.

