# WNI-01 closed marker

## Status and scope

Mode: `BOUNDED_DOCUMENTARY_VISUALIZATION_ONLY`

This marker visualizes the already closed WNI-01 result:

`B_STANDARD_WINDING_RULES_RECOVERED_GRID_PRESERVATION_CONDITIONAL`

It does not reopen, extend, or reinterpret WNI-01.

## Source audit

| Frozen source | SHA-256 before marker creation | Use |
|---|---|---|
| `20_FINAL_WNI01_DECISION.md` | `fe950f289bcf00d6c963cb4e480776024b6866944df37bcfa95d69cc22b7c231` | Authoritative closed decision |
| `WNI01_RESULTS.json` | `362090e06a816b2a909e094ce112379c1aaa64a21a3d1b9e9dedb22878ffbcc2` | Authoritative facts and numeric ranges |
| WFR-01 results | `749059c510264305751b8806485290d2ea69fd10797519d6cac65983745e8ad6` | WIND/WINDING and 7×11 boundary |
| FGP-01 results | `607b264e032de5c95516e1a77074d56cbe6e306615769a9520cbabe703a579df` | Documentary reference-relative analogy only |

No source was modified.

## Exact WNI-01 facts represented

- Standard winding definition used: YES.
- Reference point, orientation, and closed curve required: YES.
- Translation, rotation, and positive scale preserve winding.
- Reflection follows (W'=-W).
- Q-Mirror follows the reference-dependent finite-reference rule:
  (W(QC,Qp)=W(C,p)-W(C,0)).
- About 0, when C avoids 0: (W(QC,0)=-W(C,0)).
- Q-Mirror is not presented as a generic planar reflection.
- Tested grids: Q7, Q11, Q13, Q17.
- Grid size and prime status are distinct from winding.
- All four grids preserved W for the tested valid controls under the declared representation contract.
- Roundtrip distance does not imply winding preservation.
- Coarse quantization, order loss, and closure loss can destroy recoverability.
- Reference on curve and Q singularity cases are undefined.
- WIND is not WINDING.
- `+11 WIND` is not equated with winding.
- 7×11 supplies no topological structure.

## Visual mapping

The plate maps:

`SOURCE STRUCTURE → REPRESENTATION → REPRESENTATION CAPACITY → RECOVERABILITY → WINDING RESULT`

The center-left curve supplies a declared closed oriented source and reference point. Q7/Q11/Q13/Q17 are deliberately different representation figures with the same recovered test value. They do not imply exact curve reconstruction.

The reconstruction-quality ladder uses the frozen normalized RMS ranges:

| Grid | Normalized RMS range |
|---|---:|
| Q7 | 0.258–0.304 |
| Q11 | 0.153–0.168 |
| Q13 | 0.118–0.142 |
| Q17 | 0.084–0.108 |

This ladder describes geometric reconstruction quality only. Lower geometric error is not a stronger topological invariant.

The capacity panel separately records the lowest recovered sample resolutions:

`C0→4, C1→4, C2→6, C3→4, C4→6, C5→4`

Four and six receive no special meaning. The only permitted conclusion is that required representation capacity depends on the tested structure.

The fail-closed panel preserves four output states:

- PRESERVED;
- TRANSFORMED BY DECLARED RULE;
- UNRESOLVED;
- UNDEFINED.

Neither UNRESOLVED nor UNDEFINED is converted to zero.

## Boundary strip and nonclaims

The marker preserves:

- CURVE ≠ REPRESENTATION
- REPRESENTATION ≠ INVARIANT
- GRID SIZE ≠ WINDING
- PRIME STATUS ≠ WINDING
- GEOMETRIC ERROR ≠ TOPOLOGICAL ERROR
- WIND ≠ WINDING
- VISUAL LOOP ≠ WINDING
- FIGURE ≠ WINDING
- GESTALT ≠ WINDING
- RETURN OF W ≠ RETURN OF EXACT COORDINATES

The plate does not introduce musical modes, harmonic theory, 444, Doppler, primes as evidence, planetary mappings, numerology, a 7×11 product, a new operator, topology, number theory, physical theory, implementation, ORION capability, or research activation.

The optional FGP-01 connection is limited to the method-level statement `REFERENCE MATTERS`. It does not identify Q° with p, projection with winding, FGP with topology, reference semantics, or operators.

## Generated-file provenance

| File | Role | SHA-256 |
|---|---|---|
| `WNI01_CLOSED_MARKER.png` | Static closure plate, 2400×1650 RGB PNG | `7b607bbd6b187a7f4827b140999f8d56333ab33537314bf612b3e30a3f7f0923` |

The PNG was rendered locally from a temporary vector layout using an existing system renderer. No source SVG, script, package, implementation dependency, or successor audit was added to the repository.

WNI01_MARKER_CREATED=YES
WNI01_RESULT_CHANGED=NO
WFR01_CHANGED=NO
FGP01_CHANGED=NO
PG01_CHANGED=NO
OLS_CHANGED=NO
RID_CHANGED=NO
ORION_V1_CHANGED=NO

GRID_SIZE_EQUATED_WITH_WINDING=NO
PRIME_STATUS_EQUATED_WITH_WINDING=NO
GEOMETRIC_ERROR_EQUATED_WITH_WINDING=NO
PLUS11_WIND_EQUATED_WITH_WINDING=NO

NEW_OPERATOR_CREATED=NO
NEW_THEORY_CREATED=NO
IMPLEMENTATION_ACTIVATION=NO
NEW_RESEARCH_ACTIVATION=NO

NEXT_ACTION=STOP
