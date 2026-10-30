# A0 UDF Orientation Return — PROV / RO-Crate baseline preflight

**Date:** `2026-10-30`
**State:** `ENGINEERING_PREFLIGHT / NULL_RESULT RETAINED / NOT ACTIVE`
**Mission Control lane:** retained `T6 Provenance Increment`; execution does not activate the lane
**Identity effect:** reuse only; no new canonical ID or Source Graph relation

## Question

With equal source information and equal permission to use domain-specific
fields, does the experimental A0 UDF Orientation Return profile preserve or
recover consequential orientation, provenance, loss and Return information
that a strong RO-Crate / W3C PROV-style record cannot preserve or recover?

## Comparator

The comparator is intentionally strong. It uses an RO-Crate-shaped JSON-LD
graph, W3C PROV `Entity` / `Activity` relations, Schema.org terms and an A0
domain extension. It receives exactly the same source, target, frame, axis,
comparator, Return and claim-boundary information as the UDF candidate. The
baseline is not forbidden from using custom fields because RO-Crate profiles
and PROV specialization permit domain-specific modeling.

References:

- W3C PROV-O: <https://www.w3.org/TR/prov-o/>
- RO-Crate specification: <https://www.researchobject.org/ro-crate/specification.html>

## Reproduction

From `A0_BOOK/`:

```sh
node a0-udf-orientation-return-proof-tests.cjs
node a0-udf-orientation-return-baseline-benchmark.cjs
```

Machine receipt:
`results/a0-udf-orientation-return-baseline-benchmark-2026-10-30.json`.

## Result

| Gate | UDF | PROV / RO-Crate baseline | Result |
|---|---:|---:|---|
| equal-information semantic projection | pass | pass | tie |
| deterministic serialization and digest | pass | pass | tie |
| source, target and provenance recovery | pass | pass | tie |
| AB/BC/CA roles and numeric roundtrip | pass | pass | tie |
| comparator, Return and non-identity recovery | pass | pass | tie |
| matched missing-axis localization | pass | pass | tie |

Disposition:
`TIE 6/6 / NO INCREMENTAL INFORMATION ADVANTAGE ESTABLISHED`.

The UDF record is smaller and more direct for this one A0 domain contract. The
baseline is more verbose but preserves and reconstructs the same tested
information when given an equally explicit profile. Compactness and local
ergonomics are engineering properties, not scientific novelty.

## Interpretation

This is a useful negative/null preflight. It rejects the easy novelty claim
that source binding, typed axes, deterministic serialization, provenance or an
explicit Return are unavailable to established provenance containers. They
are available when the baseline receives equal representational permission.

The remaining potentially distinctive question is narrower: whether the A0
method improves human reconstruction, loss localization, calibrated STOP or
cross-instrument replay under equal information and without hidden metadata.
This single-profile software comparison cannot answer that question.

## Next permitted evidence gate

Choose exactly one later gate:

1. a second genuinely different source instrument using the same profile
   vocabulary, or
2. an independent, blinded reconstruction task comparing UDF with the strong
   baseline on error, time, false release and unnecessary STOP.

Neither gate is activated here. The experimental profile remains unfrozen,
has no assigned capability and creates no F-A0 Finding, Study, publication or
product claim.
