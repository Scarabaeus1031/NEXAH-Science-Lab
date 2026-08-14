# A3 N5 Machine Completion Contract

N5 retains its accepted purpose: deterministic coordinate-equivariance implementation integrity/validity, not a stochastic hypothesis or P1–P3 null.

The machine contract explicitly lists the **first 12** matrices after sorting every 3×3 determinant-`+1` signed-permutation matrix by its row-major nine-integer tuple ascending with integer order `-1<0<1`. The explicit list is authoritative and each matrix executes once per tier.

## N5-SYNTH

Before authorization/seed release, construct the accepted A1 linear field, training/query grids, target, actions, RK4 paths, and support. Generate an action-conditioned training path from every synthetic training state for every canonical action. Both representations are fit with unchanged V1 hyperparameters and support quantile 0.99. Each representation scores all five actions at every original jointly supported query. At least 20 comparison queries are required. Failure is `IMPLEMENTATION_FAILURE`.

## N5-RUN

After authorization, registered training table/target/original fits/held-out predictions/original support accounting, but before outcomes, regression, N1–N4, sensitivities, bootstrap, or classification, freeze the original jointly supported held-out population including zero carrier actions. A transformed abstention, refit/transform error, or population change is `INVALID_EXPERIMENT`.

## Per-transform rules

Apply `x'=Qx` to every training decision state, every state of every training action path, and every query; `B'=QB`; scalar actions unchanged; `mu'=Qmu`; scales permuted by the unsigned source coordinate selected by each Q row; `c'=Qc`; target radius unchanged; no high-x reselection. Refit support and both representations. Inverse-register every state-valued terminal output with `Q^T` before the original target score. No ground-truth outcome is used.

Compare original and transformed five-action weak ranks with Kendall tau-b for every required `(tier,Q,representation,query)`. Both constant and identical gives 1; every other undefined case gives 0; missing rank fails. Tier statistic is the **minimum** over every required comparison. Pass iff that minimum is `>=0.99`.

All exact matrices, fixture values, parameters, populations, stages, aggregation, and failures are duplicated structurally in `A3_MACHINE_READABLE_RULES.yaml`.
