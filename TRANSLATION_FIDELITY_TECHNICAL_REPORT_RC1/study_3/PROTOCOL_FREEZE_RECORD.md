# Protocol Freeze Record

Frozen before any experiment result was generated.

```text
PROTOCOL_BUNDLE_SHA256 = f9a71253c75fbbe22bf911f8774d4680b9cf206049d2a61f6deea40ad9090ad2
00_PRIOR_EVIDENCE_AUDIT.md = 814dad944921f821d08b6827563403d00a016849d492554cfd02189975ecdc2d
01_INDEPENDENT_PROTOCOL.md = 9b03d6e06d47cf434cdbbc6802b2865b8cf7914c15849f021ec0b5c0828c9536
02_CERTIFICATE_AND_INFORMATION_LADDER.md = cdf48a76c0e42fbdba802b3f6c334bb6217b1b29525695ec93e67d7b13645e28
experiment_protocol.json = 5df8e69c655d8362bddcd54878f87d3ebcc9adbed9e599fb49b0660b5ce812f7
run_fidelity_experiment.py = 1576d97bcd25a9481b486ae42c0632ca3fa2f9bd7436af38356c1446f9814ee9
```

Static compilation completed before freeze. No experiment output existed and
no experimental cell had been evaluated. The frozen design contains 10
families, 10 matched counterfactuals, six faithful representations including
baseline, three lossy controls, seven certificates and explicit sample/state/
cluster/node correspondence.

No post-result tuning is permitted.
