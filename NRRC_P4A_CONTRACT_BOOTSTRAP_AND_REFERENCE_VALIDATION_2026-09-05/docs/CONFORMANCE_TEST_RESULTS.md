# Conformance test results

Execution environment: bundled Python 3, standard library only.  
Scientific/production effect: none.

## Results

| Requirement | Evidence | Result |
|---|---|---|
| schema parses | strict JSON load and candidate-schema structural audit | PASS |
| positive fixture validates | `complete_trace_audit_residual_return.json` | PASS |
| every required type reachable | exactly 14 `$defs`; graph traversal from envelope | PASS |
| `K_gamma` exactly five | exact keys `P,D,C,Phi,S` | PASS |
| side status separate | `side_status` outside descriptor | PASS |
| ILAU exactly four | exact buckets `I,L,A,U`; partition audit | PASS |
| missing mandatory objects reject | negative 01 | PASS |
| extra undeclared fields reject | negatives 02, 12, 13 | PASS |
| broken references reject | negative 03 | PASS |
| duplicate identifiers reject | negative 04 | PASS |
| invalid enums reject | negative 05 | PASS |
| nonfinite tolerances reject | negative 06 at strict parse | PASS |
| inconsistent ReturnTest rejects | negative 07 | PASS |
| incomplete provenance rejects | negative 08 | PASS |
| raised claim ceiling rejects | negative 09 | PASS |
| altered content hash rejects | negative 10 | PASS |
| Human machine-claim boundary rejects | negative 14 | PASS |
| unregistered extension rejects | negative 15 | PASS |
| two clean runs deterministic | two independent temporary output roots | PASS |
| CLI output deterministic | two identical invocations | PASS |
| package manifest verifies | every listed file | PASS |

Unit test result: `10 tests · 10 passed · 0 failed`. Negative fixture result: `15 rejected · 0 unexpectedly valid`.

These results establish bounded candidate-format behavior only. They do not establish semantic adoption, scientific truth, cross-language canonicalization, interoperability, security sufficiency or production readiness.
