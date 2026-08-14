# F47 registered-ready audit

The successor generic schema permits both valid evidence modes and includes `REGISTERED_SCIENTIFIC_EVIDENCE`; it contains no fixture-only `registered:false` constraint. Its common `evidence` object retains the A5XEF scientific inputs.

The future registered state can be represented without changing the schema or any scientific field. Both identity validators recognize it using:

```text
registered=true
registered_data=true
fixture=false
payload_kind=REGISTERED_SCIENTIFIC_EVIDENCE
payload_origin=REGISTERED
conformance_only=false
scientific_result_claimed=true
```

Representability does not make it executable. In A5XEFR the authorization member remains absent/false and derivation fails with `EXTERNAL_AUTHORIZATION_REQUIRED`. A later separately controlled V3 implementation/authorization object may supply the external gate without modifying this evidence schema or the A5XEF scientific contract.

Registered-ready interface: **PASS**.
