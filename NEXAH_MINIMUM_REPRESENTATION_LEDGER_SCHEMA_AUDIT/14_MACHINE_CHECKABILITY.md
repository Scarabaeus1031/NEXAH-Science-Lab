# Machine Checkability

The normative schema is YAML-serialized JSON Schema Draft 2020-12 in `MINIMUM_REPRESENTATION_LEDGER_SCHEMA.yaml`. YAML is readable; JSON Schema supplies established validation semantics. No custom language or runtime is needed.

Structural checks can detect:

- missing source/target/operator/evidence/provenance;
- invalid controlled values or status;
- preservation/loss assertions without named objects and evidence references;
- task claims without owner/source/criterion/consequence;
- `VERIFIED` records without verified technical evidence;
- computational `VERIFIED` records without implementation references;
- artifacts lacking known provenance or explicit `UNKNOWN`;
- human interpretation presented as verified computation;
- symbolic-only content attempting technical verification.

Referential checks—whether an evidence ID exists, a file hash matches, or chain artifacts connect—require a later ordinary validator and repository access. They are specified, not implemented. Scientific truth, semantic equivalence, and correct uncertainty propagation cannot be guaranteed by schema validation.

