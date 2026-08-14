# Final report

```text
REVIEWED HASH VERIFIED: YES
LOCKED BEFORE IMPLEMENTATION/RESULT EXPOSURE: YES
EXECUTED: YES
DOMAIN VALIDATION: PASS
H6 F1-F4: PASS / PASS / PASS / FAIL
R5 F1-F4: PASS / PASS / PASS / FAIL
E23 F1-F4: PASS / PASS / PASS / FAIL
H6/R5 COMMUTE: YES
H6/E23 COMMUTE: YES
R5/E23 COMMUTE: YES
F6 INDEPENDENCE: PASS
DISTINCT GLOBAL TRANSFORMATIONS: 8
F7 EIGHT-STATE FAITHFULNESS: PASS
F8 CLOSURE: PASS
F9 TRANSPORT CONSISTENCY: FAIL
PRODUCT-SPACE REDUNDANCY AUDIT: PASS
CENTER/REFERENCE AUDIT: PASS
NEGATIVE FIXTURES: 10/10
OPERATIONAL_O8_REALIZED: NO
PRIMARY HASH: c29257c6e23cbceab52822f472a8d349ea4cf67395514488c54f1e2b35836abc
REPLAY HASH: c29257c6e23cbceab52822f472a8d349ea4cf67395514488c54f1e2b35836abc
REPLAY IDENTICAL: YES
OVERALL EXPERIMENT STATUS: INVALID_EXPERIMENT
```

No algebraic kernel or faithfulness obstruction was observed: the signatures
were independent, pairwise commuting and eightfold distinct. The blocking
failure is an inconsistent canonical list order in the frozen implementation,
which makes F4/F9 byte comparisons nonconforming. Therefore this experiment
does not decide whether the registered transformations operationally realize
`F_2^3` under a correctly implemented canonical transport.

It establishes reproducibly that the frozen implementation produces eight
distinct commuting involutive global signatures and correctly rejects all ten
negative controls, while also reproducibly failing its mandatory F4/F9 byte
checks. It establishes no octagonal/heptagonal geometry, frequency, prime,
Critical-Line, LEE, physical-symmetry, or universal NEXAH claim.
