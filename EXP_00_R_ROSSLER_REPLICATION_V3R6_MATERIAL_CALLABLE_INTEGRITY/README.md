# EXP-00-R V3R6 — Material Callable Integrity

This additive package repairs exactly the V3R5 post-verification `numpy.quantile._implementation.__code__` substitution defect. It does not modify V3R5 or upstream science, reimplement quantile, alter a reference, access registered evidence, or create authorization.

The repair binds the historical NumPy 1.26.4 quantile dispatcher-to-implementation graph to a finite fingerprint and revalidates object identity, code identity, bytecode/constants, defaults, keyword defaults, closure state, attributes and dispatcher relationship immediately before and after the unchanged scientific derivation.

Validation command:

```text
/opt/anaconda3/bin/python3 -B -m unittest tests.test_v3r6 -v
```

Final result: 11 tests passed in 342.639 seconds. The original V3R5 counterexample was reproduced; V3R6 rejected the same attack before altered behavior executed. Both frozen complete scientific reference hashes reproduced exactly.

Decision: **GO FOR INDEPENDENT V3R6 REVIEW**. This is not registered-execution authorization and does not declare V3 engineering closed.
