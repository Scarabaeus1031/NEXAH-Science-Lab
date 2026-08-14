# Source Evidence

## Primary artifacts

| Artifact | Role | Verified SHA-256 / state |
|---|---|---|
| `experiment_protocol.json` | frozen parameters, families, transformations, certificate and decision rules | `5df8e69c655d8362bddcd54878f87d3ebcc9adbed9e599fb49b0660b5ce812f7` |
| protocol bundle | four-file preregistration bundle | `f9a71253c75fbbe22bf911f8774d4680b9cf206049d2a61f6deea40ad9090ad2` |
| `run_fidelity_experiment.py` | operators and serialization | `1576d97bcd25a9481b486ae42c0632ca3fa2f9bd7436af38356c1446f9814ee9` |
| `fidelity_results.json` | complete frozen records and aggregates | `36657449bd48eb498a65e30bdda27a2d42735e357455b42aa9126f3b32f1d0d9` |
| replay | deterministic software replay | byte-identical result hash `36657449…d0d9` |
| `HASH_MANIFEST.json` and `REPLAY_VERIFICATION.md` | integrity/replay records | located and inspected |

The protocol describes ten synthetic families, matched counterfactuals, four dimensionless prototype states, dwell 12, deterministic sinusoidal observation jitter 0.025, deterministic k-medoids, a supplied state-count oracle, and seven graph certificates.

## Existing numerical evidence used

All 20 baseline and 20 delay cells are `OK`. Existing aggregate fields report:

| Metric | baseline view | delay view |
|---|---:|---:|
| Mean aligned-state accuracy | 1.000000 | 0.7895645327 |
| Dominant collision pairs | 0 | 20 |
| Mean edge precision | 1.000000 | 0.7321428571 |
| Mean edge recall | 1.000000 | 0.6080952381 |
| Mean probability MAE | 0.000000 | 0.1356209074 |

Delay-to-baseline exact certificate preservation is 19/20 for component summaries and 0/20 for each of support, exact counts, count ranks, probability bins, and probabilities at 2 or 12 decimals.

## Evidence authority and limits

The code and frozen output establish deterministic synthetic software behavior. They do not establish external-domain truth, a universal information law, causal relevance, prediction, physical interpretation, novelty, or NEXAH superiority. Byte-identical replay is reproducibility evidence, not independent scientific replication.

All coordinates and observations are synthetic and dimensionless. No measurement calibration or physical uncertainty applies. Numerical values are binary64 computations serialized to canonical JSON; no statistical confidence interval was preregistered for this fixed matrix.
