# Landing 02B — Closed-Trace Canonicalization Robustness Review

Status: `REVIEW COMPLETE — EXISTING RULE RESTRICTED; REPLACEMENT UNRESOLVED`

Baseline: `b11678585485bf6d58dd7cd7ffaac61c0d61592c`

Scope: P05, P06 and closed-trace canonicalization only.

## Question

Does the existing sampled-vertex lexicographic rule provide a deterministic and
stable direction/start-point invariant representative under exact reversal,
sampling-origin changes, shared perturbation, symmetry and synthetic noise?

No new tolerance is introduced. Comparative numeric checks use only the
Landing-02A implementation tolerance `1e-9 mm`; raw discrepancies are retained.

## Predeclared candidate set

### C0 — V1 lexicographic sampled vertex

Resample by arc length; select the lexicographically smallest sampled vertex;
select orientation by comparing the next distinct vertex with the previous
distinct vertex.

Assumptions: a sufficiently stable unique lexicographic extremum and stable
neighbor ordering. Failure modes: symmetry, near-ties, perturbation-dependent
sample selection and origin-dependent resampling. Identifiability limit: a
perfect circle has no intrinsic unique start point.

### C1 — radial-signature anchor

After arc-length resampling, compute the centroid and select the vertex with
maximum squared radius; resolve an exact tie lexicographically; use the same
neighbor orientation rule as C0.

Assumptions: unique and stable maximum radius. Failure modes: circles and other
radially symmetric curves, near-ties and centroid sensitivity. No claim is made
that this rule is preferable.

### C2 — P06 crossing anchor

For P06 only, use a uniquely identifiable self-intersection as start anchor;
choose orientation lexicographically from the outgoing sampled branches.

Assumptions: one stable, geometrically identifiable crossing that is represented
by the sampled polyline. Failure modes: crossing displacement, missed exact
sample, multiple crossings and unresolved branch symmetry. P05 outcome is
`INVALID_NOT_APPLICABLE`.

### C3 — cyclic/reversal quotient comparison

Do not select a canonical start point. Compare two equal-length uniformly
sampled rings by the minimum pointwise discrepancy over all cyclic shifts and
both traversal directions.

Assumptions: equal point count, comparable uniform arc-length sampling and a
comparison task rather than a serialized canonical representative. Failure
modes: unequal sampling, computational cost and inability to supply one stable
canonical file ordering. This is not a replacement canonicalization rule.

## Predeclared cases

- exact reversal;
- circular sampling-origin shifts;
- shared deterministic noise plus exact reversal;
- localized perturbation plus exact reversal;
- independent-noise realizations;
- P05 rotational symmetry;
- P06 crossing identity and branch ambiguity;
- non-closed, non-finite and degenerate inputs.

## Status rules

- `PASS`: declared invariance holds at the existing `1e-9 mm` implementation
  tolerance;
- `FAIL`: declared invariance does not hold;
- `UNKNOWN`: the case does not define a valid equality expectation;
- `INVALID`: input or rule applicability contract fails;
- `BLOCKED`: the requested canonical origin is not identifiable from the
  declared geometry.

No count of passes selects a rule. Comparative results must be interpreted
against each rule's assumptions and required output type.

## Evaluation result

The deterministic synthetic review observed every required status:
`PASS`, `FAIL`, `UNKNOWN`, `INVALID` and `BLOCKED`.

### C0 result

The V1 rule passed exact reversal, closure-preserving shared noise and localized
perturbation followed by exact reversal for P05 and P06. It failed declared
sampling-origin changes:

| Path | Case | Maximum error |
|---|---|---:|
| P05 | origin shift 500 | `120.0 mm` |
| P06 | origin shift 1 | `89.99753613514409 mm` |
| P06 | origin shift 137 | `0.10844950628613738 mm` |

P05 additionally blocks intrinsic-origin identification because the ideal
circle is rotationally symmetric.

### Landing 02A failure diagnosis

The prior `0.043607016269466746 mm` noise failure is reproducible, but the
fixture independently perturbs the nominally coincident first and last
samples. Its closure gap is the same `0.043607016269466746 mm`, exceeding the
existing `1e-9 mm` check. The input is therefore `INVALID` as a closed trace;
the raw V1 routine did not reject it before canonicalization. This finding does
not turn the original failed check into a pass.

### Candidate comparison

- C1 fails under radial symmetry, exact ties and several origin shifts; it does
  not justify replacement.
- C2 is inapplicable to P05 and remains blocked for P06 because an exact sampled
  crossing and unique outgoing branch are not guaranteed.
- C3 avoids choosing a canonical start and passes several quotient comparisons,
  but it is not a serialized representative and fails P06 origin shifts when
  resampling phases do not coincide.

No pass count selects a candidate.

## Disposition

`RESTRICT` C0 to exact deterministic serialization where the sampling origin is
already controlled and no intrinsic-origin claim is made. Do not use it as a
sampling-origin-invariant canonical representative for P05/P06.

Replacement remains `UNRESOLVED`. No candidate rule is adopted.

Machine-readable evidence:
`dry_run/CLOSED_TRACE_REVIEW_REPORT.json`.

Human data, Track B, Track C, mask schedules, Owner decisions and acquisition
authority are outside this review.
