# NEXAH-UTILITY-01 — U1 Validation Report

Date: `2026-09-22`

Decision: `A_U1_MINIMUM_MACHINE_EXISTS`

## Scope

The development-only machine ran one clean control, one critical manifest to
payload mismatch and one missing-precondition control through both processors,
twice. This is a machine-existence gate only. It is not an evaluation of the
primary endpoint and contains no incremental-utility result.

## Gate disposition

| Gate | Result | Evidence |
|---|---|---|
| identical inputs | PASS | declared input digest validates and is identical in both outputs |
| labels withheld | PASS | input JSONL contains no gold family, severity, expected status or accepted location |
| syntax-only NEXAH adapter | PASS | adapter invokes frozen Core verifier and only normalizes its result |
| independent baseline | PASS | baseline source imports no NEXAH code |
| neutral schema | PASS | both outputs validate required neutral fields |
| development smoke end-to-end | PASS | clean, critical and abstention records emitted |
| deterministic replay | PASS | semantic result hashes repeat; timing/memory are intentionally excluded |
| stable hashes | PASS | fixtures, results and package evidence recorded in `SHA256_MANIFEST.txt` |
| typed missing input | PASS | both paths emit `ABSTAIN` with missing-input precondition |
| evaluation/replay sealed | PASS | neither split is materialized or executed |
| costs capturable | PASS | runtime, memory, result bytes and authoring log contract exist |
| prescribed smoke behavior | PASS | clean=`PASS`, critical=`DEFECT`, missing=`ABSTAIN` for both paths |

## Machine result

```yaml
U1_DECISION: A_U1_MINIMUM_MACHINE_EXISTS
PLANNED_FIXTURES: 432
MATERIALIZED_DEVELOPMENT: 140
SMOKE_EXECUTED: 3
EVALUATION: SEALED_NOT_MATERIALIZED_U1
REPLAY: SEALED_NOT_MATERIALIZED_U1
UTILITY_CALCULATED: false
PRIMARY_ENDPOINT_CALCULATED: false
ACTIVE_RESEARCH_CYCLE: false
```

## Limitations retained

The smoke does not establish family-localization performance, comparative
accuracy, cost parity or utility. The Core verifier exposes a general
contract/integrity failure rather than the sealed mutation-family label. The
later scorer must therefore treat family/location correctness under the frozen
U2 rules; U1 does not relax those rules. Independent replay is also absent.

Next permitted action: `U2_EQUAL_INFORMATION_COMPARISON`, with a new explicit
Human Owner authorization.
