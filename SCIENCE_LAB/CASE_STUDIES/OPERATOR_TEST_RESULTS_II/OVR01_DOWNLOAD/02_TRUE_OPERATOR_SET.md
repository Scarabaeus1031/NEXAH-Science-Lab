# OVR-01 — True Operator Set

## A. RETAINED_TYPED_OPERATORS

- `REFLECT` — A declared reflection maps a typed geometric/state carrier to the same carrier.
- `ROTATE` — A declared rotation has a typed carrier, angle/action, and same-carrier codomain.
- `BRANCH` — Maps one input to separately addressable descendants; derivation requires attestation.
- `TRANSLATE` — Fixed displacement on a declared coordinate/state space.
- `REPEAT` — Applies a declared operator/execution again; not itself a reset or return.
- `SCALE` — A declared multiplicative/resolution map with context-specific carrier.
- `CONVERGE` — Maps multiple declared inputs/paths toward a shared target while preserving source distinction only if recorded.
- `BIND` — Frozen SRA meaning supports relation-to-addressable-relation mapping; no extra semantics added.
- `TRANSFORM` — Generic typed map; concrete domain/action must be supplied by each use.
- `COPY` — Copy rule is an operator; new ID/provenance/generation occur only under declared derivational execution.
- `PROJECT` — Verb/rule maps carrier to representation; result is PROJECTION, not the same type.
- `NORMALIZE` — Maps a residual/value into a declared standard/bounded frame.
- `CORRECT` — Declared feedback update on state/estimate; requires registered error/control rule.
- `OBSERVE` — Measurement/projection map from state to observation; distinct from OBS record.

## B. FORMAL_BUT_NOT_OPERATORS

- `TRACE` — IOTB explicitly separates TRACE from OPERATOR and PROVENANCE.
- `PROJECTION` — Noun denotes result/map relation in historical use, not a uniform executable operator.
- `CONSTRAINT` — Primarily a predicate/subset condition; applying it may filter, but the condition is not the operator.

## C. CONTEXT_DEPENDENT

- `RETURN` — Used for a rule/path, an executed event, and an endpoint relation; cannot be one operator type.
- `GATE` — Historically intersection, filter, transition, and identifiability boundary; type must be declared per use.
- `FILTER` — May be predicate, selection operator, or observation restriction; frozen corpus does not justify one universal type.
- `INVERSE` — May denote derived inverse rule or relation; existence and execution remain distinct.

## D. INSUFFICIENTLY_DEFINED

None among the frozen 21 at token level; several remain context-dependent and require typed use-sites.
