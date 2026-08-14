# Independent Adversarial Review — A5

## Decision

**REJECT A5.** A5 resolves the sole Class-A P4 choice correctly and outcome-blindly, and it preserves the accepted scientific contract. It is not the claimed contract fixpoint because A4-R22–R24 are not mechanically closed.

## Independent authority

The frozen V1 composite was recomputed from the authoritative config, runner, `src/**/*.py`, and test file: 24 members, digest `971d4d947366f54692f72bbf20ac89ac4fcf7d11d4654f65bd4bfc6e1658bc05`. The complete authority stack through A5 was read and package snapshots were taken before review. No registered artifact was opened.

## Blocking findings

| ID | Class | Finding | Consequence |
|---|---|---|---|
| A5-R26 | B | Validity “predicates” are predominantly uppercase condition strings. The validator checks presence/nonemptiness, not derivation from raw artifacts. Mutated parity, leakage, isolation, provenance, and gate conditions can remain accepted. | Two implementations can assign different gate truth values; A4-R22 remains open. |
| A5-R27 | B | Sensitivity completeness lacks executable raw-artifact evaluation and canonical unchanged-leaf/config-hash construction. Registry entries use `path/primary/value`, while required outputs use `changed_factor_path/primary_value/sensitivity_value` without a mapping. Identity/value mutations survive semantic validation. | `ALL_12_SENSITIVITIES_COMPLETE` is not zero-discretion; A4-R23 remains open. |
| A5-R28 | B | `A5_PACKAGE_MANIFEST.json` is not externally or internally anchored, and its own package, count, roles, and algorithm are ignored. Coordinated prose/validator plus manifest rewrites validate. | A5 cannot establish immutable authority; A4-R24 remains open. |
| A5-R29 | B | Semantic validation omits classification-relevant A5 fields. N2 unit, N3 donor/binding, RNG payload/order, P5 coefficient rule, and the second classifier branch can be altered and still pass after updating the unanchored manifest. | Independent mutation detection and prose-machine enforcement fail. |

No Class-A defect was found. The next object is therefore an **A5.x encoding repair**, not A6. The repair must not reopen the accepted P4 choice.

