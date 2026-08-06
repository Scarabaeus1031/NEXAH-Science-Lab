# Protocol Design

Status: `PROTOCOL DESIGN COMPLETE`

Mode: documentation only

Authority: Thomas

Operational effect: `NONE`

## Scientific protocol

Title: `Finite Identifiability Classification Under Four Orthographic Projections`

Protocol version: `1.0`

Scientific field: Inverse Problems

The protocol classifies which of four declared source identities are indistinguishable from four fixed orthographic observation records. It is finite, deterministic, software-independent, and restricted to 121 matched samples per source.

## Scope decision

Program G freezes the finite sampled case selected by Program F.

Included:

- four source identities;
- one canonical table of 484 source samples;
- four cardinal orthographic projection matrices;
- six source pairs per view;
- maximum-norm whole-record discrepancy;
- one fixed scientific tolerance;
- one partition per view;
- positive, negative, inconclusive, or invalid-protocol result.

Excluded:

- continuous-curve claims;
- masks and availability classes;
- depth-assisted identification;
- reconstruction or inverse estimation;
- noise, probability, information measures, and uncertainty models;
- generalization beyond the frozen finite object;
- repository-specific scientific terminology.

## Deliverables

1. [Research Protocol](01_RESEARCH_PROTOCOL.md)
2. [Frozen Scientific Definitions](02_FROZEN_SCIENTIFIC_DEFINITIONS.md)
3. [Scientific Object Specification](03_SCIENTIFIC_OBJECT_SPECIFICATION.md)
4. [Input Specification](04_INPUT_SPECIFICATION.md)
5. [Output Specification](05_OUTPUT_SPECIFICATION.md)
6. [Equivalence Criterion](06_EQUIVALENCE_CRITERION.md)
7. [Equality and Tolerance Rules](07_EQUALITY_AND_TOLERANCE_RULES.md)
8. [Validation Protocol](08_VALIDATION_PROTOCOL.md)
9. [Independent Replay Package Specification](09_INDEPENDENT_REPLAY_PACKAGE_SPECIFICATION.md)
10. [External Review Package](10_EXTERNAL_REVIEW_PACKAGE.md)
11. [Final Recommendation](11_FINAL_RECOMMENDATION.md)

## Current boundary

The protocol is complete as documentation. Execution remains unauthorized and blocked until every required input, authority record, hash, implementation, and review role is frozen.

No scientific object, source file, code, evidence record, or canonical repository was modified.
