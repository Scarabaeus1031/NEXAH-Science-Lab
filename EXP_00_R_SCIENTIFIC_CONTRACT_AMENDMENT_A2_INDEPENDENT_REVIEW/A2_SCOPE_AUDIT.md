# A2 Scope Audit

## Verdict

**A2 SCIENTIFIC SCOPE PRESERVED: FAIL.**

The primary frozen experiment remains unchanged, but A2 changes the frozen N3 phase-merge direction. One unauthorized null-definition change is enough to fail scope preservation.

## Frozen-field audit

| Frozen component | V1 rule | A2 effect | Result |
|---|---|---|---|
| Plant/parameters | Rössler `(a,b,c)=(0.2,0.2,5.7)` | no change | PRESERVED |
| Integrator/dt/decision interval | fixed RK4, `0.005`, `0.05` | no change | PRESERVED |
| Actuator | scalar additive x, `B=e_x` | changed only by coordinate registration inside N5 as already accepted | PRESERVED |
| Physical actions | `{-0.5,-0.25,0,0.25,0.5}` | no change | PRESERVED |
| Target/objective/success | frozen training-only target; closed-ball squared distance; `Delta J<=-0.01` | no change | PRESERVED |
| Horizon | `1.0` | no change | PRESERVED |
| Representations/hyperparameters | T `k=25, epsilon=1e-12`; F `k=100, alpha=1e-6, derivative interval=0.05` | no estimator change | PRESERVED |
| Information parity | shared training information; no analytic Rössler field | no change | PRESERVED |
| Support model/thresholds | frozen 0.99 model and validity gates | original support frozen inside nulls | PRESERVED |
| Primary population | all jointly supported held-out rows including zero actions | no change | PRESERVED |
| Support-validity population | separate nonzero-proposal contributing gate | no change | PRESERVED |
| Carriers | T top action and F top action | N4 typed symmetrically; definitions unchanged | PRESERVED |
| Ranking/ties/coherence | ascending weak preorder, frozen top tie preference, one-pair Kendall coherence | no change | PRESERVED |
| Regression/covariates | standardized L2 logistic, `C=1`, five seed-block folds, frozen covariates | no primary-model change | PRESERVED |
| Endpoints | binary primary; continuous secondary | no change | PRESERVED |
| Bootstrap | 500, seed-clustered | no change | PRESERVED |
| Sensitivities | amplitudes, T/F neighbors, horizons, training halves, support quantiles | no change | PRESERVED |
| Lorenz-v2 interpretation | carrier-dependent limitation | no change | PRESERVED |
| Cross-system ceiling | at most partial until carrier-balanced Lorenz replication | no change | PRESERVED |
| N3 phase merge | V1/V3 registry: training-learned **clockwise** merge map | A2: bins are numbered counterclockwise and empty bins map by increasing index | **CHANGED** |

## Direction contradiction

For `theta=atan2(y,x)`, increasing angle is counterclockwise. A2 explicitly numbers bins counterclockwise `0..7`; therefore “increasing bin index modulo 8” is counterclockwise. Frozen V1 says clockwise. This is not a harmless naming difference: an empty bin with occupied neighbors on both sides receives a different donor pool.

A2 labels population/outcome/support completions as new choices, but it does not label or justify reversal of the N3 merge direction. The change lies outside R-01–R-07 as identified by the A1 review.
