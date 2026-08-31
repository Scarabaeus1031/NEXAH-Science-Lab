# QRO-01 — Typed Pipeline

| Stage | Input type | Operator or process | Output type | Class | Retained | Lost | Introduced | Reference/domain assumption | Executed? | Trace? |
|---:|---|---|---|---|---|---|---|---|---|---|
| 1 | PHYSICAL_OR_DIGITAL_CARRIER | OBSERVE | CAPTURED_REPRESENTATION | A_EXACT | visible signal | off-frame/uncaptured detail | sample values + metadata | capture geometry/resolution | NO | YES |
| 2 | CAPTURED_REPRESENTATION | OBSERVE (QR detector specialization) | LOCATED_REPRESENTATION | B_SPECIALIZATION | pixels and candidate structures | irrelevant image context | finder locations | finder-pattern model | NO | YES |
| 3 | LOCATED_REPRESENTATION | NORMALIZE + ROTATE (QR geometry specialization) | ORIENTED_NORMALIZED_REPRESENTATION | B_SPECIALIZATION | module geometry and reference points | original presentation pose | normalized reference frame | finder/alignment geometry | NO | YES |
| 4 | ORIENTED_NORMALIZED_REPRESENTATION | PROJECT / OBSERVE (grid sampling specialization) | SAMPLED_MODULE_MATRIX | B_SPECIALIZATION | sampled binary module states | submodule pixel variation | discrete grid | dimension/module-size assumptions | NO | YES |
| 5 | SAMPLED_MODULE_MATRIX | TRANSFORM (QR parsing specialization) | CODEWORD_DATA_REPRESENTATION | B_SPECIALIZATION | format/version/data layout | visual layout as image | structured codewords | QR placement/mask rules | NO | YES |
| 6 | CODEWORD_DATA_REPRESENTATION | CORRECT | CORRECTED_CODEWORDS | A_EXACT | recoverable data and correction syndrome | uncorrectable alternatives | corrected/verified codewords | declared QR error-correction level | NO | YES |
| 7 | CORRECTED_CODEWORDS | TRANSFORM (QR decode specialization) | DECODED_PAYLOAD | B_SPECIALIZATION | decoded characters/bytes | encoding redundancy | payload representation | mode/character-set rules | NO | YES |
| 8 | DECODED_PAYLOAD | INTERPRETATION PROCESS | INTERPRETED_PAYLOAD | C_NON_OPERATOR | payload bytes/text | alternative application meanings | declared media/application type | application policy | NO | YES |
| 9 | INTERPRETED_PAYLOAD + POLICY/ENVIRONMENT | OPTIONAL EXECUTION EVENT | RESULT_OR_NO_EVENT | C_NON_OPERATOR | instruction/content if present | N/A | event/result only if authorized | runtime + explicit dispatch rule | CONDITIONAL | YES_IF_EVENT |
| 10 | EXECUTIONS/STATES | TRACE RECORDING | TRACE | C_NON_OPERATOR | attested events | unrecorded history | record metadata | instrumentation/logging policy | NO | SELF |

## Minimal result

- Capture and bounded error correction are exact matches to existing typed rules (`OBSERVE`, `CORRECT`).
- Location, normalization, sampling, parsing and decoding require QR-specific rule specialization.
- Interpretation, execution and trace are not reclassified as operators.
- No fifteenth operator is introduced.
- `DECODED_PAYLOAD` may exist with `EXECUTION_EVENT = NONE`.
