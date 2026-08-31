# 07 — Provenance Loss Test

Construct `R(I1)` by retaining I1's unique instance ID and all four observable
fields while deleting its provenance edge and generation metadata.

| Question | Result after removal |
|---|---|
| identity | retained by unique ID `I-001` |
| class membership | reconstructable from fields |
| specification conformance | reconstructable from fields |
| source | not attested and must not be inferred |
| generation | not attested and must not be inferred |

Thus observable reconstruction survives, while provenance attestation does not.
If the unique ID were also removed, even concrete identity would become
underdetermined; that is a separate metadata loss and is not performed here.

This is the same logical boundary established in ATS-01:
`RECONSTRUCTABLE RECORD != ATTESTED HISTORY`.
