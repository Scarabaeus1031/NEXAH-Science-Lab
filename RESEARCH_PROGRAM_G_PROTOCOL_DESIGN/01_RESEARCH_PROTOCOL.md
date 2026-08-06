# Research Protocol

## Protocol identity

| Field | Frozen value |
|---|---|
| Scientific title | Finite Identifiability Classification Under Four Orthographic Projections |
| Version | `1.0` |
| Field | Inverse Problems |
| Design | deterministic finite classification |
| Primary unit | ordered source pair under one observation map |
| Source identities | `A`, `B`, `C`, `D` |
| Samples per source | `121` |
| Views | `0°`, `90°`, `180°`, `270°` |
| Primary output | view-specific partition of source identities |
| Terminal result | positive, negative, inconclusive, or invalid protocol |

Repository provenance is recorded separately. It does not define the scientific method.

## Research question

For four fixed orthographic observation maps applied to four distinct source identities represented by 121 matched samples in `R³`, which identities are observationally indistinguishable over the complete displayed record, and which views distinguish them?

## Null statement

Every view-specific partition contains four singleton classes. Equivalently, no pair of distinct source identities is observationally equivalent under any authorized view.

## Protocol sequence

1. verify authority and freeze manifest;
2. verify the canonical input table by exact byte hash;
3. validate schema, source IDs, sample coverage, ordering keys, and finite numeric values;
4. apply the four frozen observation matrices to every source sample;
5. compute six pairwise whole-record discrepancies for each view;
6. classify each pair as equivalent or distinguishable using the frozen tolerance;
7. construct one equivalence partition for each view;
8. perform protocol-integrity and equivalence-relation checks;
9. assign exactly one terminal result class;
10. produce a machine-readable result and a bounded interpretation report;
11. stop;
12. release to independent replay or external review only through separate approval.

## Required separation

### Protocol versus implementation

This protocol specifies inputs, transformations, comparisons, outputs, and gates. It specifies no programming language, library, algorithmic optimization, interface, or repository location.

### Mathematics versus software

The scientific map is matrix multiplication on a frozen finite table. Software is conforming only if it implements those matrices, indexing rules, norm, tolerance, and classifications exactly as specified.

### Evidence versus interpretation

Numeric discrepancies, pair labels, partitions, hashes, and validation findings are evidence. The terminal result and bounded contribution statement are interpretation. Evidence files must be written before the interpretation report.

## Primary analysis

For every view `θ` and unordered pair `{s,s'}`, compute the maximum absolute displayed-coordinate difference across all matched samples. Classify the pair using the frozen tolerance. Construct the partition induced by the pairwise relation.

No source coordinate, depth value, mask state, historical expected result, or repository narrative may be used to change the displayed-record classification.

## Terminal outcomes

| Outcome | Condition |
|---|---|
| `positive` | protocol valid and at least one view contains a non-singleton observational-equivalence class |
| `negative` | protocol valid and every view contains only singleton classes |
| `inconclusive` | protocol remains intact but numeric or independent-replay evidence cannot determine at least one required pair classification under the frozen rules |
| `invalid protocol` | any required object, assumption, input, transformation, validation gate, or freeze condition is absent, changed, corrupt, or violated |

## Interpretation boundary

A valid result describes only the supplied four identities, 121 samples, and four matrices. It does not establish a continuous result, general identifiability theorem, physical identity, information-theoretic loss, reconstruction performance, or cross-domain behavior.

## STOP conditions

Stop before computation if any freeze item is absent or mismatched. Stop during computation on schema failure, non-finite value, duplicate/missing sample, matrix drift, unauthorized preprocessing, inconsistent pair classification, or output write failure. Stop after one terminal result. No secondary analysis opens automatically.

## Authority

Protocol execution requires a new written authorization naming the scientific owner, execution owner, source-freeze owner, validation reviewer, repository boundary, and permitted output location.

Program G grants none of these permissions.
