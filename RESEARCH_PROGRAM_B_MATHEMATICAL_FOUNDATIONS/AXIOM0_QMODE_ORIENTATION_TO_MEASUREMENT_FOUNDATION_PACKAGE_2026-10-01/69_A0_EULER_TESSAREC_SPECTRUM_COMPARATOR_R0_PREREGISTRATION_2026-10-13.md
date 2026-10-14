# Check 69 — Euler / Tessarec Spectrum Comparator R0

Date: `2026-10-13`  
Status: `PREREGISTERED_DESIGN / R0.1_AMENDED_BEFORE_EXECUTION / NOT_EXECUTED`  
Lab state: `STRUCTURE_FREEZE`  
Reused identities: `MOD:TESSAREC`, `MOD:NUMBER_VIEW_SUITE`, `NEXAH:LADDER_ATLAS:V1`  
New canonical Navigator identity, Family or scientific relation: `NO`

## Question

Does the constrained Euler rank shape

```text
E(n) = n² + n
```

describe the 48-value Tessarec adjacency spectrum better than an affine rank
curve, and is any improvement unusual among matched simple connected
3-regular graphs on 48 vertices?

This is a shape-comparison question. It is not a test of a common generator,
prime mechanism, physical law or identity between a polynomial and a graph
spectrum.

## Pre-analysis reduction

The historical display contains curves

```text
E_c(n) = n² + n + c.
```

After centering, standardization or fitting an intercept, every value of `c`
produces the same curve. The historical constants are therefore provenance
labels and offsets, not thirteen independent spectral hypotheses. Only one
Euler shape enters the primary test. No best-`c` search is permitted.

Historical display lane:

```text
13, 41, 137, 241, 367, 487, 617, 751, 883, 1031, 1171, 1303, 1459
```

Corrected strict prime-index lane:

```text
13, 41, 137, 241, 367, 487, 617, 751, 883, 1031, 1171, 1303, 1471
```

The correction is `1459=P232` versus `1471=P233`. Neither lane is used to
select the primary model.

## Frozen source object

- File: `A0_BOOK/assets/a0-tessarec-spectral-audit-v1.json`
- SHA-256: `a2310b0846fab46733d44c4342f8b04da5ba77cd4ac3eaf56553c872b06ea77e`
- Object: all 48 adjacency eigenvalues with multiplicity
- Rank direction: descending, matching the stored source order `3 … -2.6457`
- Trivial eigenvalue: retained in the primary 48-value analysis
- Transformation: none before model fitting

The existing Check 62 Ramanujan–Ihara result is not recomputed or modified by
this comparator.

## Frozen models

For ranks `n=0,…,47`, all models are fitted by ordinary least squares inside
the declared cross-validation split.

| Model | Formula | Role |
|---|---|---|
| `M0` | `lambda(n)=b` | intercept-only audit |
| `M1` | `lambda(n)=a*n+b` | affine baseline |
| `ME` | `lambda(n)=a*(n²+n)+b` | constrained Euler shape |
| `M2` | `lambda(n)=a*n²+b*n+d` | unrestricted quadratic control |

The free quadratic contains the Euler form as a constrained subfamily. A
lower in-sample error for `M2` is therefore not evidence against arithmetic;
the registered question concerns held-out predictive shape and parsimony.

## Frozen statistic

Use eight contiguous rank folds of six values each. For every fold, fit on the
other 42 ranks and predict the held-out block. Pool the 48 held-out residuals.

```text
CV_NRMSE(M) = sqrt(mean((lambda - lambda_hat_M)^2)) / sd_population(lambda)

A_E = (CV_NRMSE(M1) - CV_NRMSE(ME)) / CV_NRMSE(M1)
G_Q = (CV_NRMSE(ME) - CV_NRMSE(M2)) / CV_NRMSE(M2)
```

`A_E` is the single primary statistic. `G_Q`, the model table, second
differences and the 47-value nontrivial-only track are secondary diagnostics.
They cannot rescue a failed primary test.

## Matched null population

Generate `10,000` simple connected 3-regular graphs with `48` vertices using
the frozen seed `20261013`. Each null graph receives exactly the same sorted
adjacency-spectrum, rank, fold and model pipeline. Record generation failures
and continue until 10,000 accepted graphs are obtained. No graph is filtered
by its spectral result.

The implementation and dependency versions must be hash-locked before an
authorized run. The frozen R1 candidate uses Python `3.12.14`, NumPy `2.3.5`
and a local configuration-model rejection sampler; NetworkX is not required.
This R0.1 record does not yet claim portable execution.

## Pre-run amendment R0.1

The source array was found to be stored in descending order although the R0
text said `ascending`. No comparator had been run. The contract is therefore
corrected before execution to `descending`; the source bytes and SHA-256 stay
unchanged. This amendment changes rank orientation, not the registered models,
statistic, null population or decision thresholds.

The implementation candidate and its lock live at:

- `A0_BOOK/a0_euler_tessarec_spectrum_comparator_r1.py`;
- `A0_BOOK/assets/a0-euler-spectrum-comparator-r1-lock.json`;
- `70_A0_EULER_TESSAREC_SPECTRUM_COMPARATOR_R1_RUN_CONTRACT_CANDIDATE_2026-10-13.md`.

## Decision rule

An `EULER_SHAPE_SIGNAL` requires all of the following:

1. `A_E >= 0.05` on the Tessarec spectrum;
2. `A_E` exceeds the empirical 95th percentile of the 10,000 matched null
   graphs;
3. `G_Q <= 0.05`, so the constrained Euler form is within five percent of the
   held-out error of the unrestricted quadratic;
4. no source-hash, multiplicity, rank, convergence or graph-generation gate
   fails.

Otherwise the maintained disposition is
`NO_EULER_SPECIFIC_SPECTRAL_SUPPORT`. A technically invalid run receives
`INVALID_COMPARATOR_RUN`, never a positive or negative scientific result.

## Required output

An authorized execution must emit:

- exact environment and source revision;
- accepted/rejected null-graph counts;
- the four model errors for the observed graph;
- `A_E`, `G_Q`, the empirical percentile and Monte Carlo p-value;
- the complete null summary and seed receipt;
- a machine-readable result JSON and an immutable figure;
- an audit record confirming that no `c` search occurred.

## STOP and authority boundary

No command in this record is a Lab run. Execution is prohibited while the Lab
remains in `STRUCTURE_FREEZE`. A run requires a separate Human Owner reopen
decision, synchronized Lab status, hash-locked implementation and complete Run
Contract. Navigation placement does not supply that authority.

```text
COMPARATOR_DESIGN_FROZEN        YES
PRIMARY_STATISTIC               A_E
MULTIPLE_EULER_C_SEARCH         PROHIBITED
MATCHED_NULLS                   10,000 CONNECTED SIMPLE 3-REGULAR GRAPHS
SOURCE_SPECTRUM                 HASH_BOUND / 48 VALUES
EXECUTION                       NO
SCIENTIFIC_RESULT               NONE
CLAIM_PROMOTION                 NO
```

## Post-execution return

The separately authorized R1 run is recorded in
`71_A0_EULER_TESSAREC_SPECTRUM_COMPARATOR_R1_RESULT_2026-10-13.md` with the
registered disposition `NO_EULER_SPECIFIC_SPECTRAL_SUPPORT`. This section is a
return pointer only and does not alter the frozen pre-execution rules above.

