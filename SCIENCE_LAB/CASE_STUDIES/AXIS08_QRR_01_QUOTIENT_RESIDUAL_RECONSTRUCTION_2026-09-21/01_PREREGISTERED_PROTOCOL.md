# AXIS08-QRR-01 Preregistered Protocol

## Frozen question

For eight-component records, compare a declared weighted quotient with and
without its kernel-coordinate residual. Determine reconstruction, kernel-event
discrimination and perturbation stability relative to simple baselines.

## Representations

- `FULL8`: identity oracle; eight stored scalars.
- `Q_ONLY7`: first six coordinates plus weighted quotient `q78`.
- `Q_PLUS_DELTA8`: `Q_ONLY7` plus `delta = x7 - x8`.
- `DROP8_TO7`: first seven coordinates; reconstruct `x8` by training mean.
- `PCA7`: centered seven-component SVD basis, fitted on training data only.
- `RANDOM7`: seeded Gaussian seven-dimensional linear map with pseudoinverse.

`Q_PLUS_DELTA8` is a reconstruction control, not a compression win: it stores
eight scalars. Any claim that it compresses eight dimensions into seven is
prohibited.

## Frozen data

- synthetic families: independent, correlated pair, near-identical pair,
  near-opposite pair and rare kernel events;
- 4,096 records per synthetic family;
- seeds `8107, 8108, 8109, 8110, 8111`;
- fixed 70/30 train/test split;
- bound 240-root E8 reference as an exact calibration set;
- weights `[1,1]` primary and `[3,1]` sensitivity.

## Primary metrics and gates

1. `Q_PLUS_DELTA8` reconstruction maximum absolute error `< 1e-12` on every
   synthetic and E8 record.
2. `Q_ONLY7` must fail to distinguish constructed kernel counterfactuals:
   maximum representation distance `< 1e-12`.
3. `Q_PLUS_DELTA8` must distinguish all nonzero constructed kernel
   counterfactuals: detection rate `1.0` at tolerance `1e-12`.
4. Zero-sum quotient weights must fail closed.
5. Baselines are descriptive comparisons; no superiority claim is registered.

Secondary metrics are held-out normalized reconstruction MSE, maximum error,
representation dimension and noise amplification.

## Stop rules

- Stop if any primary algebraic gate fails.
- Preserve failures; no threshold or seed changes after execution.
- Do not run IEEE/PEGASE data in Phase A.
- Do not add an eighth IEEE feature or choose a paired coordinate after seeing
  comparative results.

## Claim ceiling

Allowed: bounded exact reconstruction theorem/fixture and empirical comparison
under the frozen data contract.

Prohibited: novel linear algebra, universal optimality, physical coupling,
power-system prediction, early warning, risk, control or IEEE validity.

