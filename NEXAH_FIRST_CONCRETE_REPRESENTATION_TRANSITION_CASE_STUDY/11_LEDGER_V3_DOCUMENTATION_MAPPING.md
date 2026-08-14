# Ledger V3 Documentation Mapping

V3 is used here only as a closed documentation vocabulary. No YAML record, schema revision, or validator claim is created.

| Case-study content | V3 documentation concept |
|---|---|
| R1/R2/R3/R4/R5 | typed source/target representations with array contracts, dimensions, value kind and temporal qualifiers |
| T03 | atomic operator boundary: one-step delay embedding; parameters include first-row convention |
| T06/T07 | composite operator boundary: normalization context, deterministic k-medoids, then oracle alignment |
| T08/T09 | composite transition-count and certificate projection |
| exact current-coordinate recovery at T03 | preservation claim scoped to T03 with exact-equality criterion |
| changed delay decoding | preservation failure/collision claims scoped to T07/T09 with empirical-comparison criteria |
| chronology loss | loss claim scoped to the count/certificate projection, not the full results file |
| first-row repeat, `k=4`, thresholds | assumptions/parameters and introduced analyst choices |
| float64 and fixed-matrix limitations | numerical/model uncertainty |
| T03 projection inverse | exactly invertible on the declared source package |
| clustering/counting/aggregation | many-to-one invertibility classifications on their respective edges |
| protocol/runner/result/replay | evidence and provenance links with hashes |
| reproduced execution vs bounded interpretation | separate execution, reproducibility, provenance and claim-support statuses |

The mapping records what happened. It cannot decide whether the delay result generalizes, whether Euclidean k-medoids is scientifically appropriate, or whether the interpretation is true.

Because the final V3 review reduced the ledger to structured provenance, this mapping claims neither validator compatibility nor append-preserving claim-history enforcement.

`LEDGER_V3_USED_AS_PROVENANCE_ONLY = YES`
