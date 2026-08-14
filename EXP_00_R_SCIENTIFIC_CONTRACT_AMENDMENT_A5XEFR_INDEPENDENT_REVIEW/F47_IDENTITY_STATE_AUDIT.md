# F47 identity-state audit

| State | Required tuple | Structural status | Derivation/release status |
| --- | --- | --- | --- |
| Fixture | `false,false,true`; `SYNTHETIC_FIXTURE`; synthetic; conformance-only; no claim; no authorization | valid | conformance calculation only; no top-level classification or release |
| Registered-interface conformance | `true,true,false`; `SYNTHETIC_REGISTERED_INTERFACE_CONFORMANCE`; synthetic; conformance-only; no claim; no authorization | valid | conformance calculation only; no top-level classification or release |
| Future registered scientific evidence | `true,true,false`; `REGISTERED_SCIENTIFIC_EVIDENCE`; registered origin; not conformance-only; claim permitted | valid structure | deterministically rejected with `EXTERNAL_AUTHORIZATION_REQUIRED` in A5XEFR |

Both validators independently enforce the complete tuple, the A5XEF and review authority digests, evidence manifest identity, evidence authority binding, and envelope provenance.

Attacks against each Boolean flag, payload kind, payload origin, conformance flag, scientific-result claim, unknown mode, missing authority, contradictory evidence authority, malformed envelope and stale hash were rejected before scientific release.

Identity state machine: **PASS**.
