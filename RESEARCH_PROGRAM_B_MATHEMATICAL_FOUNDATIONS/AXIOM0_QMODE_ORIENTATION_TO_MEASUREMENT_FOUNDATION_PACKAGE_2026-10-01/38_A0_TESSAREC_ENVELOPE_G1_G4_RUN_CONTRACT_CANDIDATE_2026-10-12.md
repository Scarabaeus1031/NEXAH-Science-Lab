# A0 Tessarec Envelope G1–G4 — Run Contract Candidate

Date: `2026-10-12`  
Status: `HASH_BOUND CANDIDATE / ENGINEERING VERIFIED / NOT AUTHORIZED`  
Lab state: `STRUCTURE_FREEZE`  
Identity effect: `REUSES MOD:TESSAREC / NO NEW STUDY / NO NEW RELATION`

```yaml
RECORD_ID: A0_TESSAREC_ENVELOPE_VALIDATION_RUN_001_CANDIDATE
PURPOSE: VERIFY_EXISTING
SOURCE_REPOSITORY: NEXAH-Science-Lab
SOURCE_REVISION: bd3277e34c908edf96fe97f542103a2ddb2c9dc4 plus the two hash-bound working-tree files in A0_BOOK/assets/tessarec-envelope-g1-g4-lock.json
ENTRYPOINT: A0_BOOK/assets/tessarec-envelope-g1-g4.mjs
WORKING_DIRECTORY: RESEARCH_PROGRAM_B_MATHEMATICAL_FOUNDATIONS/AXIOM0_QMODE_ORIENTATION_TO_MEASUREMENT_FOUNDATION_PACKAGE_2026-10-01
ENVIRONMENT_SPEC: Darwin arm64 local shell; Node.js standard library only
RUNTIME_VERSION: Node.js v24.19.0
DEPENDENCIES: Node.js standard library; no third-party packages
INPUTS: embedded Q4 addresses; binary-reflected Gray cycle; frozen dyadic frame map; cyclic W3; convex hull; declared observer map; eight frozen angles
DATA_ACCESS: repository-local source only; no private or external data
LICENSE_AND_PRIVACY: repository license boundary retained; no personal, private or human-subject data
COMMAND: node A0_BOOK/assets/tessarec-envelope-g1-g4.mjs --verify
EXPECTED_OUTPUTS: stdout-only JSON engineering receipt for G1_CARRIER through G4_OBSERVED; no result file
EXPECTED_HASHES_OR_TOLERANCES: source/spec hashes in A0_BOOK/assets/tessarec-envelope-g1-g4-lock.json; G3 exact delta 0; G4 coordinate tolerance 1e-15
RESOURCE_BOUNDS: under 5 seconds; under 128 MiB RAM
NETWORK_REQUIRED: false
FILESYSTEM_SIDE_EFFECTS: none
FAILURE_SEMANTICS: nonzero process exit or failed assertion means INVALID_ENGINEERING_VERIFICATION and stops all interpretation
SCIENTIFIC_CLAIM_BOUNDARY: verifies only the frozen finite implementation contract; no scientific result theorem physical mechanism Fibonacci privilege Euler resonance contact law external validity or publication claim
RESULT_REPORT: NOT_APPLICABLE_UNTIL_SEPARATE_OWNER_AUTHORIZED_SCIENCE_RUN
ISSUE_ROUTE: Human Owner through Science Lab Research Director; preserve negative invalid and undefined outcomes
OWNER: Human Owner
LAST_VERIFIED: 2026-10-12 engineering verification PASS; not a Science Lab run
```

## Frozen G1–G4 contract

### G1 — Carrier

- carrier: `Q4`;
- states: addresses `0..15` interpreted as `{-1,+1}^4` vertices;
- traversal: binary-reflected Gray cycle;
- every consecutive transition and the closing transition must have Hamming
  distance one;
- negative control `0 -> 3` must have distance two.

### G2 — Frame replay

For vertex `[x,y,z,w]`, the frame point is:

```text
[x + y/2 - z/4 + w/8,
 x/4 - y + z/2 - w/8].
```

The sixteen replayed points must be exactly equal to the primary points.

### G3 — Intrinsic envelope

For each sequence position, take cyclic `W3` and compute the convex hull of
its three frame points. Recomputing this object while sweeping observer angles
must produce exact maximum delta `0`.

### G4 — Observed envelope

For angle `theta`, apply:

```text
pi_theta([x,y]) =
  [cos(theta)x - 0.5 sin(theta)y,
   0.5 sin(theta)x + cos(theta)y].
```

Frozen angles are `0, ±42, ±45, ±90, 180` degrees. Each projected coordinate
must match the declared map within `1e-15`. At least one nonzero angle must
produce a nonzero change. The map is a representation contract, not a
physical camera model.

## Engineering verification receipt

The candidate was executed once only as a software/contract check. It wrote no
files and returned:

```text
G1_CARRIER   PASS · 16 transitions · closure true
G2_FRAME     PASS · 16 frames · exact replay
G3_INTRINSIC PASS · maximum view-sweep delta 0
G4_OBSERVED  PASS · 8 angles · 112 nonzero view changes
```

This receipt is not a scientific result and does not authorize another run.

## Open gates

`G5_CONTACT`, `G6_SAMPLING`, `G7_ABLATION` and `G8_RETURN` remain undefined or
unimplemented. Fibonacci, random and uniform schedules remain unscored.

## Owner gate

The next decision is whether to hold, revise or later admit this candidate.
Execution as a Science Lab run requires a separate Lab-reopen decision and
explicit Human Owner authorization.
