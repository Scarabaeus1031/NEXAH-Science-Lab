# POLAR-LOD-EAM-01 — second repair execution report

Date: 2026-10-01
Status: `SECOND_REPAIR_IMPLEMENTED_PENDING_INDEPENDENT_REVIEW`
Prospective data accessed: `NO`
Prospective execution authority: `NO`

## Scope

This repair addresses the three blockers in
`06_INDEPENDENT_REPAIR_REVIEW.md` without opening or evaluating a prospective
POLAR-LOD result:

1. replaceable ledger/lock trust root;
2. runtime reproducibility and entrypoint;
3. executable four-horizon M6 decision rule.

## R1 — canonical trust root

The verified replay no longer accepts `--expected-ledger` or
`--execution-lock`. `SEALED_REPLAY_TRUST_ROOT.json` binds the sole canonical
execution lock, raw-vintage ledger, dependency lock and runtime receipt. Its
SHA-256 is compiled into the runner, and the runner rejects any non-canonical
trust-root path. Runner identity remains externally auditable through the
reviewed Git commit and `SHA256_MANIFEST.txt`, avoiding a circular self-hash.

The exact bypass used in the failed review is therefore unavailable: the old
custom-lock flags stop at argument parsing and cannot return a verified status.

Bindings:

- trust root: `1451a19e9d7c65689fed9979eb7ee9df4b57193164ab4849c6a32115b6fa7c96`;
- execution lock: `0f2e414c4b135d143823821fdc10c660e6266c4b113c43c9e6933aa88e45fdbf`;
- expected ledger: `de03baf23c822c4f692725823b49c7edb7eb9b05d468080c7b3b67fc2d9cc101`.

## R2 — reproducible runtime

`RUNTIME_ENVIRONMENT.json` now records the provided CPython 3.12.14 arm64
binary and its SHA-256. `requirements-macos-arm64.lock` pins NumPy, pandas and
all transitive dependencies to downloaded wheel hashes. The sole documented
entrypoint, `run_sealed_replay.py`, verifies the interpreter binary before
invoking the runner.

A fresh temporary virtual environment was created from the bound CPython and
installed with `pip --require-hashes`. All packages installed from the locked
hashes, all tests passed, and a full sealed replay from that environment was
byte-identical to the canonical result.

## R3 — executable M6 evaluator

The runner now fits direct M2 models for horizons 1, 3, 7 and 30. For target
`T` and horizon `h`, all lagged observations are at or before `T-h`. The M6
evaluator:

- constructs the identical-date M2/B3/observed intersection;
- lists every missing target MJD by reason before scoring;
- requires at least 180 pairs at all four horizons;
- computes paired RMSE and MAE;
- computes paired squared-error improvements;
- runs the circular 30-day moving-block bootstrap with 20,000 replicates and
  seed `20261001`;
- applies one-sided 95% lower bounds and Holm familywise correction at 0.05;
- produces exactly one frozen operational-relevance annotation.

Eighteen tests cover parser gates, custom-root rejection, removed custom-lock
flags, direct-horizon lag custody, supported and unsupported M6 fixtures, the
5% RMSE threshold, MAE non-rescue, Holm stopping, missing custody and partial
horizons.

## Historical replay result

The repaired historical replay returns:

- status: `HISTORICAL_METHOD_REPLAY_VERIFIED_WITH_UTC_CUSTODY_LIMIT`;
- M6 annotation: `OPERATIONAL_RELEVANCE_NOT_ASSESSABLE`;
- paired populations H1/H3/H7/H30: `344 / 342 / 338 / 315`;
- prospective authority: `false`;
- operational lock ready: `false`.

The annotation is intentionally not assessable because exact historical UTC
availability remains unproved. This preserves the scientific boundary even
though the new evaluator is executable.

Existing generated data products remain byte-identical:

- predictions: `19ced79bf121227602587e311204170cbd38fbcab6181660e756d8958e0cc51d`;
- horizon metrics: `47472398cce09e28214739d66e13a63df6082833b7b5b4078ebd069e7e352a02`;
- vintage ledger: `f96c1ce1390fb6c625b915da286be2f53aaf78159356c28af7020bf85f00d5ab`.

The expanded machine result is
`7f42d34faa4e96915e706199c986d3fcc450d1d4e5c3807b02174a68097c66d9`.

## Disposition

The second repair is implemented and locally verified. This is not self-
approval. A new independent adversarial review must accept R1–R3 before the B3
operational-baseline lock can close. No prospective run is authorized here.
