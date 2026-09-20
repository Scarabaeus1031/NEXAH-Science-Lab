# Machine Interface and Runtime Map

## Layer separation

| Layer | Current artifact | Status |
|---|---|---|
| Semantic specification | OLS 1.0 | SOLID_DOCUMENTED |
| Typed interface blueprint | SWM-01 | DESIGNED_NOT_IMPLEMENTED |
| Machine-readable contract | RID-01 schema | SOLID_VALIDATED at schema level |
| Conformance examples | 20 RID fixtures | SOLID_VALIDATED at schema level |
| Validator/canonicalizer realization | None accepted for RID | MISSING |
| Adapter | No RID-to-ORION adapter | MISSING |
| Runtime binding | No RID execution path | MISSING |
| Certified structural runtime | ORION V1 chain | INTEGRATED in separate narrow scope |
| Candidate broader runtime | ORION Runtime 1.1 | IMPLEMENTED_NOT_INTEGRATED |

## RID-01 contribution

RID-01 defines versioned identity, provenance, history, geometry and measurement branches, typed view sources, operation/rule/event/result separation, comparison criteria, ambiguity/abstention, reconstruction/decision separation, return-family distinctions, and zero/null/absent/unknown separation. Twenty fixtures exercise the schema-level boundary.

It does **not** define an adopted OLS-wide serialization, production object store, Rust source, ORION adapter, operator execution semantics, deployment, or end-to-end replay.

## ORION V1 membrane

The membrane is an approved-but-unimplemented interface boundary. It cannot be counted as an adapter. The certified ORION core must not be modified or silently reinterpreted to consume RID records.

