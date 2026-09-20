# OLS Language and Grammar Map

## Decision

OLS 1.0 is a **formal, implementation-independent semantic language specification**, not merely a vocabulary and not an executable programming language.

| Layer | Current evidence | Status |
|---|---|---|
| Minimal operational vocabulary | Fourteen universal primitives plus declarations/products | SUPPORTED |
| Formal syntax | Stable identifiers, declaration/invocation structures and registries; no single normative carrier syntax | PARTIAL |
| Type rules | Ownership, inputs, prerequisites, outputs, failures, prohibited implications | SUPPORTED |
| Composition semantics | Profile activation, dependencies, conflicts, legal composition | SUPPORTED |
| Equivalence rules | Bounded compatibility/preservation rules; no universal implementation equivalence | PARTIAL |
| Conformance tests | Six classes, normative tests, evidence/status/reporting rules | SUPPORTED_DOCUMENTARILY |
| Executable semantics | No mandatory evaluator/runtime or operator implementation | NOT PROVIDED |

## Core grammar

The shortest released semantic order is `OBSERVE → REPRESENT → COMPARE → ORIENT → EXPLAIN`. It is semantic order, not scheduling, causality, recommendation, authorization, or execution.

OLS-2 supplies primitive contracts; OLS-3 supplies profile composition; OLS-4 supplies products, accepted/conditional derivations and prohibited transitions; OLS-5 supplies conformance. OLS-6 preserves governance/version boundaries. This is enough to call OLS a formal language specification in its own semantic scope.

## Machine boundary

OLS intentionally defines no single normative serialization, parser, evaluator, storage model, or runtime. RID-01 is therefore a bounded machine-contract realization candidate, not a replacement for OLS and not proof of OLS-wide interoperability.

## ILAU and expression vocabulary

Retained/Lost/Introduced/Unresolved can be used as an explicit application codebook. The letters do not generate their meanings. FIELD, FORM, historical syllables, glyphs, and named visual families remain architectural or expression vocabulary unless a released OLS owner explicitly adopts them.

