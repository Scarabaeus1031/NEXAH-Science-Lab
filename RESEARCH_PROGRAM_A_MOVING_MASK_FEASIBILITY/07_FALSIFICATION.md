# Falsification

## Primary falsification

The primary hypothesis fails for the frozen benchmark if the moving-mask condition shows no reproducible difference from the information-matched static-mask condition under the preregistered error and reacquisition decision rule.

This result supports the null within the tested scope. It does not prove mask-motion invariance in general.

## Additional observations that count against the proposed Lab account

- the apparent motion effect disappears when removed-information exposure is correctly matched;
- paired-seed results do not persist across the frozen seed set;
- the effect depends on undocumented or post-result parameter changes;
- the weighted estimator does not improve on or differ meaningfully from a simpler available-observation baseline where improvement is claimed;
- numerical smoothness fails to distinguish accurate from inaccurate output under the declared false-confidence rule;
- common mask states make the estimator undefined without a recorded insufficiency state;
- changing only a legitimate translation or coordinate representation reverses the conclusion without a declared reason;
- masked, reconstructed, underdetermined, and unknown values cannot be kept distinct;
- the exact result cannot be reproduced from the frozen inputs and environment.

## Blocked outcomes

The hypothesis is not testable, rather than false, when:

- no information-matching rule can be defined;
- the static and moving conditions do not have comparable exposure;
- ground truth leaks into estimation;
- reacquisition has no declared release event, tolerance, or persistence rule;
- the estimator or weights change across conditions;
- required outputs are missing or corrupt.

Blocked outcomes must not be reported as support.

## Possible terminal result classes

| Result | Meaning |
|---|---|
| `SUPPORTED` | preregistered difference criterion met within the frozen benchmark |
| `NULL` | no preregistered difference detected |
| `LIMITING` | effect exists but is fully explained by a simpler factor or baseline |
| `FALSIFIED` | a directional or superiority claim retained in the protocol is contradicted |
| `BLOCKED` | protocol integrity or identifiability prevents a valid decision |

Every class remains bounded to the selected model, estimator, masks, and seeds.
