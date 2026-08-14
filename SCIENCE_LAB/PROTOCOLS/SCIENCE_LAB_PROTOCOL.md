# Science Lab protocol

Core rule:

```text
EXPERIMENTS PRODUCE RESULTS.
AUDITS DETERMINE WHAT RESULTS MEAN.
INTEGRATION UPDATES ARCHITECTURE.
LABREPORTS CLOSE RESEARCH CYCLES.
```

Every branch has one lifecycle status and one evidence classification. Raw
numbers, code execution, visuals, passing tests, or infrastructure reviews do
not enter capability claims without audit, integration, and closure.

Controlled result vocabulary:

- `VALIDATED_POSITIVE_RESULT`
- `VALIDATED_NEGATIVE_RESULT`
- `UNINFORMATIVE_BENCHMARK`
- `REFUTED_AT_REGISTERED_SCOPE`
- `THEORETICALLY_ELIMINATED`
- `INTRINSICALLY_NONIDENTIFIABLE`
- `INFORMATION_LOST`
- `UNDEFINED_CONTRACT`
- `INFRASTRUCTURE_VALIDATED`
- `REPLICATION_CONFIRMED`
- `DESIGN_ONLY_RESULT`
- `INVALID_EXPERIMENT` (retained distinctly; never converted to negative)

Lifecycle status vocabulary:

`OPEN`, `ACTIVE`, `BLOCKED`, `AWAITING_AUDIT`, `AWAITING_INTEGRATION`,
`READY_FOR_LABREPORT`, `CLOSED`, `SUPERSEDED`.

A negative result answers a valid question negatively. An uninformative result
does not distinguish alternatives. An invalid result cannot support the
scientific endpoint. These must never be collapsed.

Closure requires: final classification; explicit claims/nonclaims; hashes and
provenance where applicable; capability/architecture updates; eliminated
branches; reusable infrastructure; downstream interfaces; separated open
questions; explicit next action or `NONE`; and no ambiguous experiment status.
