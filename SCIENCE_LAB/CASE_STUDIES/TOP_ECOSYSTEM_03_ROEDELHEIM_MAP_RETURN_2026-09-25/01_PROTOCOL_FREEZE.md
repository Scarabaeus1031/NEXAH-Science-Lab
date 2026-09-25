# 01 - Protocol Freeze

## Frozen comparison object

`RHD-9077H-FIVE-STEP` binds one primary local map reproduction, one existing
derived comparison visual and one source-critical interpretation layer.

## Frozen roles

| Role | Record | Authority |
|---|---|---|
| source | `hhstaw_3011--1_nr_9077_h_0001.jpg` | visible content of the local reproduction only |
| provenance support | Arcinsys viewer screenshot naming `3011:1, 9077 H` | local custody link; not a full archive catalogue export |
| representation | `Roedelheim_Fuenfschritt_Kartenpruefung.png` | comparison layout and declared visual statuses |
| interpretation | `Roedelheim_Frankfurt_Gesamtreport_2026-09-23.docx` plus two bounded Markdown tests | working historical synthesis with explicit claim limits |
| currentness receipt | Mission Control | hash-bound pointer and bounded status only |
| Human | outside automated return | adoption, historical judgment and continuation |

## Frozen tests

1. Hash every selected source and representation.
2. Verify that the representation visibly separates its three map scales and
   does not present its five stations as measured coordinates.
3. Compare the representation's station statuses with the Gesamtreport.
4. Apply I-L-A-U to source -> representation -> interpretation.
5. Return every surviving statement to a visible or cited source field.
6. Reject any statement that requires undeclared georeferencing, chronology,
   symbol identity or causal inference.
7. Register one Mission Control receipt without transferring evidence authority.

## Decision rules

- Missing or changed source bytes: `SOURCE_RECEIPT_FAIL`.
- A derived mark presented as original source content: `SEMANTIC_RETURN_FAIL`.
- A location-identity claim without at least four distributed control points,
  two held-out checks and reported error: `GEOREFERENCE_FAIL_TYPED`.
- Visible water morphology may return as `PASS_BOUNDED` only at the stated map
  and scale.
- Abzweig, Rückfluss or modern location correspondence without a traceable
  line/registration remain `UNRESOLVED`.
- Mission Control may bind the result but may not become historical authority.
