# False-Positive Validation Tests

| Legitimate record | Result | Assessment |
|---|---|---|
| analytical transform without concrete data artifact | endpoint `artifacts minItems: 1` rejects | false positive |
| visualization with no downstream task | `task_relevance: UNDEFINED` accepted | correct |
| historical negative result with unknown artifact origin | artifact may be `UNKNOWN`, but provenance still requires repository/commit | likely false positive or placeholder pressure |
| deterministic transformation without probabilistic uncertainty | empty uncertainty array accepted | correct, though applicability not explicit |
| conceptual edge without implementation | can use conceptual status and empty implementation refs | correct |
| mathematically verified edge without repository origin | forced origin fields | false positive |
| edge with no preservation claim | empty preservation list accepted | correct |

Legitimate incompleteness is allowed only partially. Provenance and endpoint artifact requirements must distinguish `UNKNOWN`, `NOT_APPLICABLE`, and known references before a validator is responsible.

