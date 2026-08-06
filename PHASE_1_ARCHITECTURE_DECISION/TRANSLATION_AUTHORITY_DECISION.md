# Translation Authority Decision

Status: DRAFT — DECISION NOT ADOPTED

Operational effect: NONE

Next permitted action: owner review

## Current evidence

- OLS 1.0 owns normative orientation semantics, declarations, mappings, operator contracts and conformance language.
- ORION V1 owns certified Expression in its frozen structural scope.
- ORION contains historical or separately governed LYRA translation and explanation components outside certified V1.
- NEXAH Orientation Translation is applied research, not semantic authority.
- NEXAHEDRON and NEXAH Experience own faithful presentation within their interfaces.
- The target pipeline contains a Translate stage after ORION Orient.
- The target architecture lists translation support under ORION but does not assign semantic or presentation authority to it.

## Option TRANS-A — Split translation authority

| Responsibility | Owner |
|---|---|
| normative meaning and permitted semantic mapping | OLS |
| certified structural Expression | ORION within its frozen scope |
| faithful Human-language explanation | named language boundary; LYRA if separately retained and adopted |
| interface rendering and presentation | SIRIUS/application owner |
| domain validity | domain Research/Validation owner |

Duplication risk: low when every output cites its source contract and no layer silently repairs another.

## Option TRANS-B — ORION owns all translation

ORION would own semantic mapping, representation conversion, explanation and application-facing translation.

Duplication risk: high. ORION would acquire OLS semantic authority, LYRA language responsibility and application presentation responsibility.

## Option TRANS-C — Application-local translation

Each SIRIUS consumer or application translates upstream outputs for its users.

Duplication risk: high. Applications can produce divergent semantics, hide loss and turn presentation into authority.

## Recommendation

Recommend TRANS-A.

Translation is a chain of separately governed operations, not one undifferentiated authority. The target's Translate stage should be a routed responsibility with explicit source, mapping, loss, output and owner.

## Proposed translation invariant

```text
OLS meaning
≠ ORION structural Expression
≠ Human-language explanation
≠ application presentation
```

Every transition preserves:

- source identity and version;
- mapping or contract identity;
- declared loss and exclusions;
- provenance;
- uncertainty;
- authority owner;
- prohibited implications.

## Required decisions

### TRANS-01 — Translation stage owner

Current evidence: responsibility is distributed.

Options: split authority; ORION-only; application-local.

Duplication risk: a single broad owner can absorb semantics or presentation.

Recommendation: split authority under TRANS-A.

Owner decision required: Thomas with OLS, ORION and application owners.

### TRANS-02 — LYRA disposition

Current evidence: LYRA is documented and partly implemented but excluded from certified ORION V1.

Options: retain LYRA as the named faithful language boundary; use a generic unnamed boundary; retire LYRA after compatibility review.

Duplication risk: retaining LYRA without scope repeats ORION translation; removing the name can obscure existing provenance.

Recommendation: retain LYRA as historical/current candidate name, but do not adopt execution until a separate compatibility decision.

Owner decision required: Thomas and ORION owner.

### TRANS-03 — Representation transformation

Current evidence: OLS defines semantics, ORION has transition contracts and expression, and applications render outputs.

Options: ORION owns validated structural transformations; IRIS owns representation conversion; applications convert locally.

Duplication risk: IRIS or applications can recreate ORION transition behavior.

Recommendation: ORION owns only transformations admitted by its declared contracts; unsupported transformations remain blocked.

Owner decision required: ORION owner; OLS owner confirms semantic references.

### TRANS-04 — Domain translation validity

Current evidence: semantic and structural conformance do not establish scientific or domain validity.

Options: domain owner validates; ORION validates; SIRIUS validates.

Duplication risk: ORION or SIRIUS would acquire research authority.

Recommendation: domain Research/Validation owner.

Owner decision required: affected domain owner for each application.

