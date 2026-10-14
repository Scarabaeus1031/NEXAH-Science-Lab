# A0 Tessarec Phase Grid 48 — Engineering Check

Date: `2026-10-13`  
Status: `DETERMINISTIC ENGINEERING / FORMAL CHECK`  
Lab state: `STRUCTURE_FREEZE`  
Scientific-run status: `NOT A SCIENCE RUN`  
Publication status: `NOT AUTHORIZED`  
Identity effect: `REUSES MOD:TESSAREC / NO NEW STUDY / NO NEW RELATION`

## 1. Bounded question

Does the post-hoc numeric pattern `7 / 17 / 19 / 29` define an exact
quarter-turn structure on a declared `Z/48Z` carrier, and does that structure
already coincide with the `P3 x Q4` display sequence used by Paper F?

The check separates two propositions:

1. **formal phase proposition:** `Q(n) = n + 12 mod 48` has order four and
   induces a 90-degree phase step;
2. **carrier-binding proposition:** the same `+12` operation is a single fixed
   product operator on the existing Paper-F `P3 x Q4` display addresses.

Passing the first proposition does not imply the second.

## 2. Information boundary

- repository-local JavaScript only;
- no network and no external data;
- no physical, biological or universal-resonance interpretation;
- the four numbers were noticed before this check, so prime enrichment is
  explicitly post-hoc and cannot support confirmatory inference;
- the existing Paper-F display sequence is read as implemented: three blocks
  of a 16-state binary-reflected Gray cycle.

## 3. Frozen checks

| Check | Assertion | Positive / negative condition |
|---|---|---|
| `T1_ARITHMETIC_LATTICE` | the four values form `7 + 10a + 12b` | exact identities only |
| `T2_Z48_QUARTER_TURN` | `Q(n)=n+12 mod 48` has order four | all 48 addresses return after four applications |
| `T3_POST_HOC_PRIME_SELECTION_CONTROL` | selected and complementary unit orbits are both reported | descriptive only; no confirmatory p-value claim |
| `T4_FOURIER_SHIFT` | circular shift by 12 multiplies DFT mode `k` by `exp(-ik pi/2)` | maximum complex error below `1e-10` |
| `T5_CURRENT_PAPER_F_BINDING` | `+12` is tested against implemented layer and Gray addresses | report a negative result if no fixed layer and Q4 operator exists |
| `T6_LITERAL_SEQUENCE_QUADRATURE` | consecutive values `7,17,19,29` are tested as phase positions | reject quadrature unless all cyclic gaps are 12 |

## 4. Execution contract

```yaml
RECORD_ID: A0_TESSAREC_PHASE_GRID_48_ENGINEERING_CHECK_001
PURPOSE: VERIFY_FORMAL_CANDIDATE
SOURCE_REPOSITORY: NEXAH-Science-Lab
ENTRYPOINT: A0_BOOK/assets/tessarec-phase-grid-48.mjs
WORKING_DIRECTORY: AXIOM0_QMODE_ORIENTATION_TO_MEASUREMENT_FOUNDATION_PACKAGE_2026-10-01
ENVIRONMENT: local Node.js; standard library only
COMMAND: node A0_BOOK/assets/tessarec-phase-grid-48.mjs --verify
EXPECTED_OUTPUT: stdout-only JSON receipt
RESOURCE_BOUND: under 5 seconds; under 128 MiB RAM
NETWORK_REQUIRED: false
FILESYSTEM_SIDE_EFFECTS: none
FAILURE_SEMANTICS: assertion failure or nonzero exit stops interpretation
CLAIM_BOUNDARY: finite arithmetic and implemented address mapping only
AUTHORIZED_SCIENCE_RUN: false
```

## 5. Result vocabulary

- `SUPPORTED`: exact formal proposition passes;
- `REFUTED`: frozen proposition fails;
- `NOT_ESTABLISHED`: formal relation exists but is not bound to the current
  carrier implementation;
- `POST_HOC_UNINFORMATIVE_FOR_INFERENCE`: descriptive pattern survives but
  cannot be interpreted as confirmatory evidence;
- `INVALID_ENGINEERING_CHECK`: implementation or assertion failure.

## 6. Interpretation ceiling

This check may establish a finite `Z/48Z` phase identity and may reject a
direct implementation binding. It cannot establish that polygon orders cause
Tessarec dynamics, that the current 48 display indices are a natural phase
circle, or that prime representatives imply resonance.

## 7. Return route

If the formal proposition passes while the current carrier binding fails, the
next permitted design action is to specify a separate candidate bijection
between `Z/48Z` and `P3 x Q4`, together with matched alternative bijections and
an observable chosen before exposure to their outcomes. No visual extension
is warranted by the arithmetic check alone.

## 8. Engineering receipt

Execution date: `2026-10-13`  
Runtime: `Node.js v24.19.0`  
Verifier SHA-256: `fb9fa12ee00fc55d109613c2139378f845190bd248e9840089bdb4d4f616c369`  
Repeated stdout SHA-256: `c183601d07281be8e01ac863e399e047b469fe5b6210f4b01467510090fd5c78`  
Repeat agreement: `2 / 2 byte-identical receipts`  
Overall status: `PASS_WITH_NEGATIVE_BINDING_RESULT`

| Check | Receipt | Bounded reading |
|---|---|---|
| `T1_ARITHMETIC_LATTICE` | `PASS` | exact `2 x 2` additive grid; rows `24/48`, diagonals `36/36`, center `18` |
| `T2_Z48_QUARTER_TURN` | `PASS` | `+12 mod 48` has order four and represents a declared 90-degree step |
| `T3_POST_HOC_PRIME_SELECTION_CONTROL` | `DESCRIPTIVE_ONLY` | selected orbits contain `8/8` prime representatives; controls `5/8`; one-sided Fisher value `0.1`; no inference authorized |
| `T4_FOURIER_SHIFT` | `PASS` | measured maximum complex delta `2.452878922211009e-13`, below `1e-10` |
| `T5_CURRENT_PAPER_F_BINDING` | `NEGATIVE_BINDING_RESULT` | `+12` is not one fixed `P3` layer operator and not one fixed Q4 bit operator in the current display sequence |
| `T6_LITERAL_SEQUENCE_QUADRATURE` | `NEGATIVE_RESULT` | cyclic gaps are `75, 15, 75, 195` degrees, not four quarter-turns |

### Disposition

```text
FORMAL Z48 QUARTER TURN: SUPPORTED
DIRECT BINDING TO CURRENT PAPER-F CARRIER: NOT ESTABLISHED
LITERAL 7/17/19/29 QUADRATURE SEQUENCE: REFUTED
PRIME ENRICHMENT: POST-HOC / UNINFORMATIVE FOR INFERENCE
NEW FINDING: NO
VISUAL BUILD AUTHORIZED BY THIS CHECK: NO
```

The negative binding result is retained. The current Paper-F frame index must
not be relabeled as a phase circle. A later candidate bijection requires its
own frozen alternatives, observable and owner-authorized evaluation path.
