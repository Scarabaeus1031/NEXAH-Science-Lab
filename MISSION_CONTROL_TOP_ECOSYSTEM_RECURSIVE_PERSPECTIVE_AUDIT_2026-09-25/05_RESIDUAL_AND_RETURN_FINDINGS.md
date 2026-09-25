# 05 — Residual and Return Findings

## Typed residual register

| ID | Type | Observation | Consequence | Pure-audit disposition |
|---|---|---|---|---|
| R-01 | currentness | two expected Science Lab hashes are stale in Mission Control | validator returns `INVALID` | preserve as evidence; do not sync in this audit |
| R-02 | handoff | repository-to-repository event return is predominantly manual | drift can persist until a human audit | propose edge test; no implementation |
| R-03 | semantic | no shared I-L-A-U account for cross-repository transformations | loss and additions can remain implicit | name recursive application gap |
| R-04 | test coverage | no single end-to-end return test from evidence through processing and representation back to claim/source | local success cannot establish ecosystem closure | define bounded next experiment |
| R-05 | status semantics | `mission_control_truth_surface_active: false` lacks an audited definition consistent with nearby active-surface language | machine and prose interpretations may diverge | leave `U`; requires owner definition |
| R-06 | provenance | NEXAH Experience is locally reached by a symbolic link to another directory | local reconstruction needs an extra location fact | record fact; no authority inference |
| R-07 | deployment evidence | exact public deployment commit is not fully receipted in the audited sources | public/source identity cannot be presumed | retain claim ceiling |

## Return test

### 1. Structural return

**PASS, bounded.** The documentation supplies a return path:

```text
source authority → bounded handoff → consumer representation → Mission Control pointer/state → source authority
```

The authority map survives this cycle in principle.

### 2. Byte-level currentness return

**FAIL, two mismatches.** The two changed Science Lab overview files no longer match Mission Control's expected hashes.

This is the cleanest current example of the method:

- the source representation changed;
- Mission Control retained the prior expectation;
- the difference is detectable;
- the return has not yet been closed.

Classification:

```text
A: TOP alignment text introduced in Science Lab
U: Mission Control acceptance/currentness update not performed
Residual: two deterministic hash mismatches
```

### 3. Semantic return

**PARTIAL.** Repository roles and claim ceilings are preserved, but edge effects are not consistently typed. The system can say where an artifact belongs more reliably than it can say what changed during every transfer.

### 4. Authority return

**PASS, bounded.** No inspected overview authorizes Mission Control, TOP, or a public surface to replace domain authority. This audit creates no such authority.

## Proposed next experiment — not activated

```text
TOP-ECOSYSTEM-02 — ONE EDGE, FULL RETURN
```

Select one already-existing artifact that legitimately crosses at least three roles, for example:

```text
Science Lab evidence
  → ORION deterministic transformation
  → NEXAHEDRON or NEXAH Experience representation
  → Mission Control receipt
  → comparison with source claim
```

For that one artifact only:

1. declare the source authority and observer position;
2. bind every artifact and transformation by stable reference/hash;
3. record I, L, A, and U at each edge;
4. type the residuals;
5. perform byte, semantic, and authority return tests;
6. close or abstain without generalizing beyond the tested chain.

Activation requires a separate decision. It is not part of this audit.
