# OVR-01 — Return / Inverse / Trace

| Term | Type | What it asserts | What it does not assert |
|---|---|---|---|
| INVERSE | Derived rule/relation, when defined | A rule can undo another rule algebraically on a declared domain. | That it was executed or that history is erased. |
| RETURN | Context-dependent path/event/endpoint relation | A path or execution reaches/tends toward a registered prior state. | Identity of history, provenance, or execution. |
| TRACE | Attested execution record | What operations/states were recorded. | That an inverse exists or a return succeeded. |

Four controls survive:

1. An inverse may exist without execution.
2. An alleged inverse execution may fail to recover the endpoint if conditions/domain differ.
3. The endpoint may be recovered while history differs.
4. A trace may remain after return.

Therefore `INVERSE != RETURN` and `RETURN TO STATE != RETURN TO HISTORY`.
