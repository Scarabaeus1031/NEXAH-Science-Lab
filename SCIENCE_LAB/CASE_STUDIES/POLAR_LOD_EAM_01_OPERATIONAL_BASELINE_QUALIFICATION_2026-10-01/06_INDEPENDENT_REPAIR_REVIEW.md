# POLAR-LOD-EAM-01 — independent repair review

Date: 2026-10-01
Reviewer: independent adversarial reviewer
Bound commit: `72b0927e1b1e475fb9b2d0d11fd0c46cb16b22d1`
Disposition: `FAIL / REPAIR AGAIN`
Prospective data accessed: `NO`

## Executive decision

The repair materially improves the package, but it does not yet create a
fail-closed operational lock. M3–M5 are closed. M1 and M2 remain open because
the runner accepts caller-selected ledger and execution-lock paths without an
external immutable trust root. M6 is precise as a written contract but is not
implemented as an executable four-horizon decision rule.

No operational seal or prospective execution is authorized.

## Checks completed

- all entries in the three bound SHA-256 manifests were verified;
- all 365 cached raw files matched the canonical filename, byte count and
  SHA-256 ledger;
- all eight parser unit tests passed;
- a cache mutation was rejected against the canonical ledger;
- an adversarial alternative-root replay was attempted;
- the runner, repair contract, execution lock and result status logic were
  inspected;
- no prospective data were obtained or inspected.

Canonical package bindings inspected in this review:

| Artifact | SHA-256 |
|---|---|
| package manifest | `6732c55f488d3510f82590eee3f2c15f48f6365fcaf4e88928b9f622d208846c` |
| `EXECUTION_LOCK.json` | `5b3efc73131ed2c171d700ba7f2acc2996099030f1ea21e44d4b13b6779c5101` |
| `EXPECTED_RAW_VINTAGE_LEDGER.csv` | `de03baf23c822c4f692725823b49c7edb7eb9b05d468080c7b3b67fc2d9cc101` |
| runner | `483f3291fe8b26d69687688740f589cbdb34619c1e3de413d9a9ac6541940b41` |
| unit tests | `a64bc8f0cd976c6720990232cc38c267fd3fb615c35e40c367fc7b85d2d95fd8` |
| result JSON | `c2f893ca71fb20c1c39ddd0f811a81e75f4532e05961a54e9c52dfd82c994a40` |

## What passed

The canonical cache path is protected: changing one raw x3 value caused a
SHA-256 mismatch before parsing. The strengthened parser rejects duplicate
MJD, non-finite values, grid drift, unknown states, a second C/P transition,
Issue-Date boundary conflicts and physical-range violations. Historical UTC
availability remains explicitly unproven, prospective authority remains
false, and retrospective qualification thresholds no longer confer a ready
status. The two percentage denominators are also reported unambiguously.

These observations close the substance of M3, M4 and M5.

## Blocking finding R1 — replaceable trust root

The runner accepts `--expected-ledger` and `--execution-lock` as caller-chosen
paths. Its verification proves only the internal consistency of the supplied
pair; it does not bind either file to an immutable expectation outside that
pair.

The review changed one evaluated raw x3 value, generated a matching alternative
ledger, generated a matching alternative execution lock and invoked the
unchanged runner with those two paths. The runner returned
`HISTORICAL_METHOD_REPLAY_VERIFIED_WITH_UTC_CUSTODY_LIMIT` with all integrity
gates true, although the H1 RMSE changed from
`2.647930401625292e-05 s` to `2.6485378577738126e-05 s`.

Adversarial hashes:

- raw file: `569da1972b6e94fe4dcde008961d8edbd776b0e6b742c1e1f13da47efbfd0379`;
- alternative ledger: `2e092f8557931aeabbf45b86d12cadbb3b9d3b0209b653f9025f77629b25f09c`;
- alternative lock: `7359f484b83bb1bc9938fdb135fe02dc74b2497c7225045d3f37af45da9ba752`.

Required repair: sealed mode must accept only package-canonical paths and an
externally bound canonical lock hash, or custom locks must receive an explicitly
untrusted status. The expected runtime must not derive solely from the same
replaceable lock. A negative test must prove that an alternative root cannot
produce a verified status.

## Blocking finding R2 — runtime not independently provisioned

The execution lock binds Python `3.12.14`, NumPy `2.3.5` and pandas `2.2.3`,
and the runner correctly rejects a mismatched runtime. The review environment's
default stack did not provide those exact versions, while the package supplied
no portable environment receipt or uniquely bound replay entrypoint.

Required repair: bind a reproducible environment specification and package or
container artefact hashes, document one exact entrypoint, and demonstrate an
independent clean installation and byte-identical replay.

## Blocking finding R3 — M6 is not executable

The contract now defines horizons 1/3/7/30, paired samples, RMSE and MAE gates,
a 20,000-replicate 30-day circular moving-block bootstrap, seed `20261001`,
Holm correction and fail-closed missing-data handling. The runner, however,
computes M2 only for H1. It has no four-horizon M2/B3 pairing, bootstrap, Holm
correction or operational-relevance outcome class.

Required repair: add a manifest-bound evaluator that implements the complete
rule and returns exactly one of:

- `OPERATIONAL_RELEVANCE_SUPPORTED`;
- `OPERATIONAL_RELEVANCE_NOT_SUPPORTED`;
- `OPERATIONAL_RELEVANCE_NOT_ASSESSABLE`.

Positive, negative and incomplete-data fixtures must test every gate without
using prospective outcomes.

## Claim ceiling

The package may claim only that the already known historical diagnostics are
reproducible under the canonical ledger and declared lock, that the supplied
cache matches that ledger, and that historical UTC availability remains
unproven. It may not claim a fail-closed trust root, portable independent
runtime reproduction, implemented operational relevance, an operational B3
seal or any prospective evidence.

## Lock recommendation

`FAIL — REPAIR AGAIN`.

Perform R1–R3, rerun the historical negative controls, and request another
independent review before any operational lock or prospective execution.
