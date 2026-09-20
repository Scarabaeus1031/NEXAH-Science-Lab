# CARC-01 — Common Carrier–Aperture–Return Core Synthesis

Date: 2026-09-14  
Status: `COMPLETE_DOCUMENTARY_INTERFACE_SYNTHESIS_NO_ACTIVATION`

## Result

The previously separate prime/CRT, QRT, layer, aperture, Neon/NBV, ILAU and return materials do share a coherent operational spine:

```text
DECLARE CARRIER + FRAME
  → SELECT VIEW / APERTURE
  → MAP PERSISTENT ADDRESSES
  → APPLY Q / T / R OPERATOR
  → OBSERVE
  → RECONSTRUCT / RETURN
  → COMPUTE TYPED RESIDUAL
  → CLASSIFY I / L / A / U
  → ISSUE RECEIPT FOR HUMAN REVIEW
```

This spine is already represented most concretely by the adopted, profile-bound CRIC-01 `0.1.1` contract family. OLS 1.0 supplies semantic operator governance. NRRC P4A supplies a richer optional `Trace → ILAUAudit → Residual → ReturnTest` envelope when a source genuinely defines the local descriptor `K_gamma = (P,D,C,Phi,S)`. THE EYE is a bounded display/projection consumer, not the owner of the scientific record.

Prime/CRT and NBV/Neon are not merged into one mechanism. They are two different domain profiles that can be compared against the same spine:

- Prime/CRT is strongest as an exact discrete carrier/address/cut/return profile.
- NBV/Neon is strongest as a tested raster visibility/representation/residual profile.

The binding is documentary. No OLS profile, NRRC extension, CRIC runtime, ORION capability, THE EYE route, Canon entry or research cycle is activated by this package.

## Files

- `01_AUTHORITY_CURRENTNESS_AND_SOURCE_LOCK.md` — controlling records and source verification.
- `02_COMMON_CORE_STACK.md` — the architectural synthesis and ownership boundaries.
- `03_OLS_OPERATOR_INTERFACE_MATRIX.csv` — mapping of the operational spine to OLS contracts.
- `04_PROFILE_BINDING_MATRIX.csv` — Prime/CRT and NBV/Neon field coverage and gaps.
- `05_BOUND_EVIDENCE_RECORD.json` — machine-readable documentary evidence pointer record.
- `06_LOOSE_ENDS_AND_NEXT_GATE.md` — exact remaining gaps and the smallest coherent continuation.
- `FINAL_DECISION.md` — bounded conclusion.

