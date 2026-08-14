# Representation Ledger Hypothesis

## Minimum record

| Field | Required content |
|---|---|
| Source | typed artifact, version/hash, units, coordinate frame, population |
| Operator | executable/formal transformation, parameters, version, determinism |
| Target | typed artifact and addressable output |
| Preserved structure | exact or tolerance-qualified relation and test |
| Lost structure | known collisions, non-identifiability, destroyed distinctions |
| Introduced assumptions | model, decoder, alignment, sampling, threshold choices |
| Uncertainty | input, propagated, introduced, calibration and abstention status |
| Task consequence | decisions still identifiable; decisions made impossible |
| Evidence | code, data, proof, replay, external reference, status owner |

## Audit decision

`REPRESENTATION_LEDGER_SCIENTIFICALLY_USEFUL = YES`

The ledger is genuine scientific infrastructure if records are machine-checkable, hash/version bound, linked to executable tests, and allowed to report `UNKNOWN`, `LOSS`, or `NOT_VALIDATED`. It enables provenance, exposes missing arrows, and prevents a stable coarse certificate from masquerading as truth.

It is merely documentation if fields are prose-only, optional, retrofitted after results, or detached from code/data and task consequences. It is not itself a scientific discovery, and it cannot validate a transformation. Its immediate value lies in formalizing already supported transformations, not inventing new ones.

