# Final Return

## Decision

```text
AUDIT_ID = TOP-ECOSYSTEM-02
COMPARISON_OBJECT = AXIS08_QRR_01_ARTIFACT_LINEAGE
ROLES_TESTED = SCIENCE_LAB + NEXAH_CORE + MISSION_CONTROL
SOURCE_RECEIPT = PASS
CORE_BUNDLE_INTEGRITY = PASS
CORE_REPLAY_DECISION = PASS
CORE_REPLAY_BYTE_IDENTITY = FAIL_TYPED
CORE_REPLAY_NUMERIC_TOLERANCE = PASS
SEMANTIC_RETURN = PASS_BOUNDED
AUTHORITY_RETURN = PASS_BOUNDED
EDGE_PROVENANCE = PARTIAL
HUMAN_PUBLIC_RETURN = NOT_IMPLEMENTED_GOVERNANCE_GATED
OVERALL = BOUNDED_PASS_WITH_TYPED_RESIDUALS
```

## What the test establishes

For this one lineage, NEXAH can preserve a scientific result across an
authority-bounded implementation and a currentness receipt without silently
promoting its claim. The protocol, source inputs, categorical decision,
negative boundaries, Science Lab authority, and Human authority survive the
round trip.

The test also establishes that the current ecosystem needs differentiated
return classes. A bytewise failure can coexist with a tolerance-valid
numerical and semantic return. A Mission Control source receipt can be exact
while the intermediate Core handoff remains only semantically, not
artifact-hash, bound.

## What the test does not establish

- no integrated production machine;
- no automatic event transfer among repositories;
- no ORION, NEXAHEDRON, or public Experience integration;
- no Human usefulness result;
- no independent scientific replication;
- no new mathematics, physics, causality, prediction, or control capability;
- no general claim about every NEXAH artifact lineage.

## Method-center implication

TOP is operationally justified as a comparison instrument because it reveals
the exact shape of a return instead of forcing one global identity judgment:

```text
same claim boundary
same categorical decision
same input and protocol bindings
different numerical bytes within tolerance
one stale local manifest entry
one partially bound cross-repository edge
authorities preserved
```

That is the concrete value of the method: several truths about the same
transition remain visible simultaneously, and none is allowed to impersonate
the whole.

## Closure

`TOP-ECOSYSTEM-02` is closed as `BOUNDED_PASS_WITH_TYPED_RESIDUALS`.
No existing authority file, Mission Control currentness record, scientific
result, Core implementation, or product surface was changed by this execution.
