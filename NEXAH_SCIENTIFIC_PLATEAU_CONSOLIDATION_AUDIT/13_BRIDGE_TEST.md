# Bridge Test

A bridge passes only when its transformation is explicit, reproducible, and provenance-bound.

| Candidate bridge | Verdict | Reason |
|---|---|---|
| mathematics↔simulation | `PARTIAL` | equations and solvers exist in bounded lines, but no unified registry covers them |
| simulation↔geometry | `PARTIAL` | some benchmark/trajectory geometry is reproducible; legacy field lacks a traced source state |
| geometry↔graph | `PARTIAL_PASS` | audited partition→adjacency operator executes, but semantics and information loss are severe |
| graph↔decision | `NOT_ESTABLISHED` | T02 lacks external task/cost anchor; structural navigation is not decision validation |
| measurement↔model | `CONDITIONAL` | ORION metrology contract is coherent, but external thresholds and a NEXAH method are absent |
| visualization↔analysis | `PARTIAL_PASS` | scientific plots can be reproducible targets; diagrams/plates do not validate analysis |
| representation↔representation | `PASS_BOUNDED` | Translation Fidelity/T01 show explicit registered transforms and collision/recovery checks on synthetic fixtures |

The bridge test identifies the actual strength and the central weakness. NEXAH can document selected transformations well; it cannot infer missing interfaces from shared vocabulary, diagram proximity, or a common visual style.

