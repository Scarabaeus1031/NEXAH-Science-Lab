# A5XE R34–R39 Audit

| Finding | Status | Independent evidence | Class |
|---|---|---|---|
| R34 raw reconstruction | FAIL | Joint-support population is ignored; P4 controls/diagnostics and sensitivity representation outputs are not reconstructed; synthetic-only schema cannot bind future registered evidence. | B |
| R35 dominance semantics | PASS | Exact rational equality at 50% passes; `G<=0` and `2D3>G` remain valid negative outcomes; malformed/fewer seeds remain distinct. | — |
| R36 identity/population | FAIL | Counts validate, but primary/null rows are not joined to joint support and sensitivity metadata can contradict its claimed identity while passing. | B |
| R37 transitive authority | FAIL | Root bytes pass; A1 is absent from the finite upstream ledger. | B |
| R38 typed states | PASS | N5-SYNTH maps to `IMPLEMENTATION_FAILURE`; N5-RUN maps to `INVALID_EXPERIMENT`; neither retains classification. Valid negative dominance does not throw. | — |
| R39 machine completeness | FAIL | Mutations to model C, coherence definition, validity gates, fixed populations and sensitivity outputs all pass `validate_machine_object`. | B |

No Class A ambiguity was found. The accepted rules already specify each required repair.
