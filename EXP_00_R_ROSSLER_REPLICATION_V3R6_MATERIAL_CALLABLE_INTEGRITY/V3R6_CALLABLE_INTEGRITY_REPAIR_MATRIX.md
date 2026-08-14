# V3R6 Callable-Integrity Repair Matrix

This matrix precedes all V3R6 implementation code.

| Required item | Frozen finding / repair boundary |
|---|---|
| 1. Exact V3R5 defect | After `prepare_runtime()`, replace `numpy.quantile._implementation.__code__` in place. The captured dispatcher identity remains unchanged; V3R5 `assert_consumed(...)` returns `True`; `quantile([1,2,3], .5, method="linear")` changes from `2.0` to `999.0`. |
| 2. Material callable | NumPy 1.26.4 `numpy.quantile`, specifically the `_ArrayFunctionDispatcher` and the Python function currently reached through its `_implementation`/`__wrapped__` path. The frozen scientific derivation calls this operation for P2, negative-carrier tests and bootstrap intervals. |
| 3. Why identity is insufficient | Dispatcher object identity does not bind mutable state behind the dispatcher. The same dispatcher and implementation-function objects can execute replacement bytecode after an in-place `function.__code__` mutation. |
| 4. Smallest required property | Immediately before and after every frozen scientific derivation, the consumed quantile dispatcher, implementation relationship, implementation function identity, code-object identity and a deterministic finite implementation fingerprint must equal the values captured after V3R5 runtime verification and before scientific snapshot construction/consumption. |
| 5. Implementation boundary | Additive V3R6 wrapper around the authority-bound V3R5 runtime. Capture a finite `quantile` callable graph after V3R5 preparation. Revalidate it immediately before and after the unchanged V3R3 snapshot derivation. Do not reimplement quantile. |
| 6. Prohibited changes | No V3R5/upstream edits; no scientific, P1–P5, classification, schema, evidence, runtime, reference or authorization change; no generalized binding of every NumPy/Python callable. |
| 7. Fail-closed behavior | Any dispatcher replacement, implementation replacement, in-place code/default/closure mutation, alias change or NumPy quantile monkey patch raises a V3R6 integrity failure before altered behavior is invoked by scientific derivation and before classification can be returned. A post-derivation check also prevents a concurrently changed callable from yielding a valid returned classification. |
| 8. Closure tests | Reproduce V3R5 counterexample; reject same V3R6 attack; dispatcher-preserving code replacement; implementation replacement; alias substitution; `numpy.quantile` replacement; mutation after verification; clean historical path; unchanged legitimate path; two independent fingerprints; exact canonical/alternate complete-object hashes; inherited V3R3/schema/firewall regression gates. |

Non-blocking hardening outside this repair: speculative mutation of unrelated Python or NumPy callables without a reproduced path through the frozen `quantile` boundary. Such surfaces are not added to the V3R6 trust model.
