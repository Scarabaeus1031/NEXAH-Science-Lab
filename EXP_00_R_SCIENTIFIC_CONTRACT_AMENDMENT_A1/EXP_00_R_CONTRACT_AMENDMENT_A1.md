# EXP-00-R Authoritative Scientific Contract Amendment A1

## Authority and scope

A1 prospectively completes three V1 decision rules before registered outcomes exist. It does not retroactively claim that V1 uniquely implied the selected rules. The V1 hypothesis is preserved; ambiguous decision rules are completed.

The controlling order after independent acceptance is:

1. frozen V1 scientific contract for all unchanged rules;
2. A1 for questions A–C only;
3. future implementation, which has no authority to reinterpret either.

## A — N5 resolution

### Ambiguity

V1 describes deterministic validation fixtures and also says coordinate registration remains to be orchestrated on frozen registered representation outputs.

### Candidates considered

- synthetic pre-execution only: tests code integrity but not the actual registered fit/prediction path;
- registered in-run only: tests the actual path but discovers basic implementation defects only after registered access;
- both, separately typed: detects code defects before access and verifies the actual authorized pipeline during the run.

### Selected rule

**Both are mandatory and have different purposes.**

- **N5-SYNTH:** a nonregistered, deterministic pre-execution pipeline-integrity gate. It uses the actual TRAJECTORY and LEARNED_FIELD implementation on the exact synthetic fixture defined in the N5 contract. Failure is `IMPLEMENTATION_FAILURE`; registered seed release is prohibited.
- **N5-RUN:** an authorized in-run validity diagnostic on the actual frozen registered training table and the original jointly supported held-out query population. It transforms/refits the actual representation pipeline. Failure makes the experiment `INVALID EXPERIMENT` and is not a P1 null failure.

Each tier applies the first 12 lexicographically ordered signed-permutation matrices with determinant +1 exactly once. N5 is deterministic, so the frozen 200 Monte Carlo repetitions apply to stochastic N1–N4, not to duplicate executions of N5.

Full coordinate, B, target, support, inverse-registration, ranking, population, and tie/undefined-tau rules are controlling in `A1_N5_COORDINATE_REGISTRATION_CONTRACT.md`.

### Justification

This is the smallest rule satisfying both V1 statements. It tests coordinate equivariance of the actual representation machinery without treating coordinate registration as a new empirical hypothesis or a stochastic null.

## B — per-seed dominance resolution

### Ambiguity

V1 gives a 50% top-three-seed limit without specifying contribution signs, weights, or denominator.

### Candidates considered

- clip negative gains to zero: easy to interpret but changes the aggregate and can hide offsetting harm;
- equal seed weights: measures an average seed rather than the frozen row-level held-out log loss;
- signed row-weighted contributions: decomposes the exact frozen aggregate log-loss improvement.

### Selected rule

Use **signed, row-weighted contributions** on the frozen primary eligible population.

For seed `s`, compute baseline and augmented mean log loss on its eligible held-out rows using the already-fitted frozen primary models. Let `d_s = L0_s - L1_s`. With `n_s` rows and `N = sum_s n_s`, define `g_s = (n_s/N)d_s`. Then `G = sum_s g_s` equals the global held-out log-loss improvement. Rank `g_s` descending without clipping. Let `D3` be the sum of the three largest signed contributions.

The dominance condition passes iff `G > 0` and `D3/G <= 0.50`. Equality at 0.50 passes; strictly greater fails. If `G <= 0`, the condition fails without division. Seeds with eligible rows remain included even without endpoint variation because log loss is defined; seeds with zero eligible rows are absent and separately reported. Details are controlling in `A1_PER_SEED_DOMINANCE_CONTRACT.md`.

### Justification

The formula exactly decomposes the frozen aggregate prediction gain and preserves negative evidence. It tests whether a small set of seeds carries the net improvement without optimizing for passage.

## C — predictive gain versus nulls resolution

### Ambiguity

V1 reports agreement, coefficient, and log-loss null statistics while using “primary predictive gain” without uniquely mapping those statistics to P1–P3.

### Candidates considered

- one omnibus conjunction: collapses distinct propositions and strengthens P1;
- coefficient and log loss both as null gates: duplicates P2/P3 and adds an unstated conjunction;
- map agreement to P1 and held-out log-loss improvement to P3, leaving P2's coefficient/clustered interval unchanged.

### Selected rule

For each of N1–N4, generate 200 null replicates of:

- mean coherence and top-action agreement;
- carrier-specific standardized coherence coefficient;
- carrier-specific held-out log-loss improvement.

Use the one-sided Monte Carlo p-value

`p = (1 + count(T_null >= T_observed)) / 201`.

The above-null condition is `p <= 0.025`, equivalently at most four of 200 null values are at least the observed value. Ties count against the observed result.

- **P1:** observed mean coherence and top-action agreement must each pass against every N1–N4 family.
- **P2:** remains the frozen positive standardized coefficient with seed-clustered 95% interval above zero for both carriers. Coefficient null distributions are mandatory reported diagnostics but do not add a second P2 gate.
- **P3:** in addition to positive observed log-loss improvement and nonworse Brier score, each carrier's observed log-loss improvement must pass against every N1–N4 family.
- **N5:** affects validity only. It generates no Monte Carlo distribution and does not enter P1–P3.

Thus “primary predictive gain exceeds all required nulls” means precisely: **for both frozen carriers, observed held-out log-loss improvement has one-sided Monte Carlo p ≤0.025 against each of N1–N4.**

### Justification

Held-out log-loss improvement is the frozen measure of incremental predictive value, so it belongs to P3. Coefficient sign/interval remains P2. Agreement remains P1. This preserves the existing hypotheses without an omnibus criterion.

## Locality determination

All three choices can be made locally. They do not alter the plant, actuator, action set, target, horizon, objective, representations, information parity, primary population, support thresholds, support-validity population, carriers, coherence, regression, bootstrap count, N1–N4 repetition count, sensitivity registry, Lorenz interpretation, or cross-system ceiling.

## Effect

A1 is a scientific-contract artifact only. It becomes authoritative only after independent scientific-contract review. It does not make V3 executable and does not authorize registered access.
