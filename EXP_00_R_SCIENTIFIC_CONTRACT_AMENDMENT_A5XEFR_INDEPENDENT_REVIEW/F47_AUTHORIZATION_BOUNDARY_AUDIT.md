# F47 authorization-boundary audit

A5XEFR distinguishes three propositions mechanically:

```text
schema capability
≠ execution authorization
≠ registered scientific result
```

The package contains no authorization token, generator, positive authorization path or registered executor. Both semantic adapters require the conformance authorization object to be exactly `{present:false, reference:null}`.

Setting `authorization.present=true`, adding a forged reference, changing registered/fixture predicates, claiming a registered origin, changing the payload kind, disabling conformance-only status, or claiming a scientific result failed closed. Recomputing the envelope hashes after coordinated mutations did not make contradictory tuples valid.

A structurally valid future `REGISTERED_SCIENTIFIC_EVIDENCE` envelope is accepted by both identity validators, but both authoritative derivation adapters stop with `EXTERNAL_AUTHORIZATION_REQUIRED`, without classification or release. Such external authorization is deliberately outside A5XEFR and was not created during this review.

Authorization separation: **PASS**.
