# A5 Prose ↔ Machine Isomorphism Audit

A5's P4 choice, dominance arithmetic, sensitivity values, P1–P5 thresholds, and classification ceiling agree between prose and machine. Exact A4 bindings avoid vague “unchanged” references for N1–N5/RNG.

Blocking mismatches remain:

1. Prose calls validity predicates exact Boolean derivations; machine encodes many as unparsed strings and the validator treats nonempty strings as sufficient.
2. Prose requires raw sensitivity artifact identity and one-factor comparison; machine registry field names do not map to required output names, and no canonical leaf/hash algorithm exists.
3. Prose calls the A5 manifest a seal; machine explicitly excludes manifest self-hash, while no detached immutable anchor exists and validator ignores manifest metadata/roles.
4. The prose ledger claims tests for rules that the validator does not assert: N2 unit, N3 donor/binding, RNG payload/order, P5 coefficient/gain, and all classifier branches.

These are operative prose-machine-enforcement gaps capable of changing validity or classification. **Isomorphism: FAIL (Class B).**

