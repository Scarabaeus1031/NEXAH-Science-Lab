# A1 N5 Coordinate-Registration Contract

## Status and purpose

N5 is a deterministic coordinate-equivariance integrity/validity diagnostic. It is not a stochastic null, endpoint, effect estimate, or new hypothesis.

## Shared transformation registry

Let `Q_1,...,Q_12` be the first 12 matrices after lexicographically sorting flattened 3×3 signed-permutation matrices whose determinant is +1. Each matrix is orthogonal. Each tier executes each matrix exactly once.

For scalar action `u` and original actuator `B=e_x`:

- state/path coordinate: `x' = Qx`;
- actuator: `B' = QB`;
- controlled derivative: `F'(x') + B'u = Q(F(x)+Bu)`;
- scalar action labels and their order are unchanged;
- standardizer: `mu'=Qmu` and `scale'_j=scale_{p(j)}`, where `p(j)` is the unsigned source coordinate selected by row `j` of Q;
- standardized target center: `c'=Qc`;
- target radius unchanged;
- the original high-x training subset is not reselected in transformed coordinates.

Every state in the training decision table and every state in every stored training rollout path is transformed. Query states are transformed. Analytic Rössler derivatives remain unavailable to learned representations.

Support is refitted from transformed training decision states with the unchanged frozen rule. Euclidean distances and the support threshold must be equivariant under Q.

Both representations are freshly refitted for every Q. No original fitted coefficient, neighbor index, score, ranking, or support flag may be reused except as the comparison reference.

## Inverse registration and scoring

- TRAJECTORY: transformed action-conditioned terminal samples are inverse-registered as `Q^T x'_H` before applying the original frozen target score and neighbor aggregation.
- LEARNED_FIELD: every transformed predicted path state is assessed for support in transformed coordinates; its terminal state is inverse-registered as `Q^T x'_H` before applying the original frozen target score.
- No ground-truth outcome row is transformed or recomputed for comparison. N5 does not inspect intervention success.

The resulting five scores use the unchanged ascending weak preorder and tie rule. For representation `r`, query `i`, and transform `q`, compare the original five-action weak rank vector `rank_original[r,i]` with `rank_registered[r,i,q]` using Kendall tau-b.

Undefined tau convention is fixed:

- both rank vectors constant and exactly equal: tau-b = 1;
- exactly one constant, or both constant but unequal: tau-b = 0.

## Tier 1 — N5-SYNTH

### Population and deterministic fixture

Use the actual future EXP-00-R representation classes and support/ranking code with:

- synthetic uncontrolled field `F(x)=Ax`, where
  `A=[[-0.2,-1.0,-0.1],[1.0,-0.3,0.0],[0.2,0.0,-0.4]]`;
- `B=e_x`, the frozen five primary actions, RK4 `dt=0.005`, horizon `1.0`, observations every `0.05`;
- 125 training decision states: Cartesian product `{-1,-0.5,0,0.5,1}^3`, lexicographic x/y/z order;
- 48 query states: Cartesian product `{-0.75,-0.25,0.25,0.75} × {-0.6,-0.2,0.2,0.6} × {-0.5,0,0.5}`, lexicographic order;
- action-conditioned training paths generated deterministically from every training state;
- target built once from the original training decision states using the frozen target construction;
- unchanged primary representation hyperparameters and 0.99 support rule.

The comparison population is the original jointly supported query set. It must contain at least 20 queries; otherwise the fixture construction is an implementation failure and must be corrected prospectively before freeze, without registered access.

### Pass rule

For every Q, both representations must return a complete ranking for every comparison query, and the minimum query-level tau-b across representations, queries, and transforms must be at least 0.99.

Failure state: `IMPLEMENTATION_FAILURE`. It prevents freeze/authorization/registered seed release. It is not `INVALID EXPERIMENT` because no experiment has begun.

## Tier 2 — N5-RUN

### Population and stage

After separate authorization, N5-RUN occurs after:

1. frozen training table and target construction;
2. original representation fits;
3. held-out query prediction and original support accounting;

and before intervention outcomes, primary regression, N1–N4, sensitivities, bootstrap, or classification.

The comparison population is the original untransformed jointly supported held-out query population, including queries whose proposed carrier action is zero. It is fixed before any transformed fit is inspected. No row may be dropped because a transformed pipeline abstains.

### Pass rule

For every Q, both transformed/refitted representations must return a complete ranking for every fixed comparison query. The minimum query-level tau-b across representations, queries, and transforms must be at least 0.99.

Any missing transformed ranking, transform/refit error, population change, or tau-b below 0.99 is `INVALID EXPERIMENT`. Classification becomes unreachable. It is not P1/P2/P3 failure and cannot be repaired after registered access.

## Counts

- transformations per tier: exactly 12;
- executions per transformation per tier: exactly 1;
- Monte Carlo repetitions: 0;
- N1–N4 stochastic repetitions remain exactly 200 each.
