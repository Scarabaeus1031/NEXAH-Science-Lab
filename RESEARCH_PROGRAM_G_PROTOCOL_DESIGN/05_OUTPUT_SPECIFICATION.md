# Output Specification

## Output separation

Evidence outputs are generated before interpretation. Interpretation may reference evidence by hash and identifier only.

## Required evidence outputs

| File | Required content |
|---|---|
| `run_manifest.json` | protocol and input hashes, implementation ID, environment, start/end time, executor, validation state |
| `projected_samples.csv` | 1,936 rows: view, source, sample index, displayed coordinate 1, displayed coordinate 2 |
| `pair_discrepancies.csv` | 24 rows: view, pair, maximum-norm discrepancy, tolerance, pair classification |
| `view_partitions.json` | four canonical partitions of `S` |
| `validation_results.json` | every gate, observed value, pass/fail, and failure reference |
| `terminal_result.json` | exactly one terminal class and its mechanical decision basis |
| `file_hashes.sha256` | SHA-256 for every input and output file in the run package |

## Required interpretation outputs

| File | Required content |
|---|---|
| `bounded_result.md` | question, result class, four partitions, direct evidence links, limitations, non-claims |
| `deviation_log.md` | `NONE` or every observed deviation; any scientific deviation invalidates the protocol |
| `provenance_appendix.md` | repository history and term mapping, kept separate from scientific title and result |

## Canonical partition encoding

- members inside a class sorted `A,B,C,D`;
- classes sorted by their first member;
- singleton class encoded as a one-element array;
- one view entry for each of `0`, `90`, `180`, `270` in that order;
- every source appears once per view.

Example structure only:

```json
{
  "view": 0,
  "classes": [["A"], ["B"], ["C"], ["D"]]
}
```

The example is a schema illustration, not an expected result.

## Pair classification values

Exactly:

- `EQUIVALENT`;
- `DISTINGUISHABLE`;
- `UNRESOLVED`.

`UNRESOLVED` is permitted only when protocol integrity remains valid but numerical evidence cannot support one side of the frozen threshold. It forces terminal result `inconclusive`.

## Terminal result record

Must include:

- protocol version and hash;
- input hash;
- validation status;
- counts of equivalent, distinguishable, and unresolved pair-view comparisons;
- null statement disposition;
- terminal result class;
- mechanical rule invoked;
- no free-text scientific claim beyond the bounded result.

## Prohibited outputs

- interpolated, smoothed, reconstructed, or visually inferred classifications;
- additional view angles;
- continuous-curve conclusions;
- accuracy, probability, information-loss, causal, physical, or cross-domain scores;
- merged source identities;
- result-dependent revised inputs or thresholds;
- publication graphics presented as evidence.

## Output failure rules

Missing required file, schema mismatch, duplicate/missing comparison, invalid partition, inconsistent hash, altered ordering, or evidence written after interpretation without trace produces `invalid protocol` and STOP.
