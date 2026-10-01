# POLAR-LOD-EAM-01 — repair and pre-output lock

Date: 2026-10-01
Status: `SECOND_REPAIR IMPLEMENTED / INDEPENDENT RE-REVIEW REQUIRED`
Authority class: `IMPLEMENTATION REPAIR / FUTURE DECISION CONTRACT`
Supersedes: package-local `B3_READY_WITH_DECLARED_SOURCE_EXCEPTIONS`

## Purpose

This lock closes the six major findings in the independent adversarial review
at the contract and implementation level. It does not repair the historical
absence of independent UTC publication evidence, inspect a new outcome, run
the prospective candidate, or create a Research Result.

## M1 — enforced raw-vintage identity

Sealed replay requires the package-canonical
`EXPECTED_RAW_VINTAGE_LEDGER.csv`. It must contain
exactly the 365 expected filenames and bind each provider URL, byte count and
SHA-256. Replay never downloads a missing file and rejects any byte-count or
hash mismatch before parsing. `acquisition` mode may download candidate files,
but its result is always `UNSEALED_ACQUISITION_CANDIDATE_NOT_QUALIFICATION`.

The second repair removes the former `--expected-ledger` and
`--execution-lock` overrides. `SEALED_REPLAY_TRUST_ROOT.json` binds the one
canonical ledger, execution lock and runtime files; its SHA-256 is compiled
into the committed runner. A custom trust-root path is rejected. The runner's
own identity is externally bound by the reviewed Git commit and package
manifest, avoiding a circular self-hash inside the trust root. Custom roots
cannot produce a verified status.

## M2 — execution dependency lock

`EXECUTION_LOCK.json` binds:

- the external baseline runner and its package manifest;
- the historical IERS source CSV;
- the expected raw-vintage ledger;
- this repair contract and the parent prospective protocol;
- the hash-locked runtime dependency file and runtime receipt;
- exact Python, NumPy, pandas, python-dateutil, pytz, six and tzdata versions.

Replay rejects any mismatch. The machine result records the execution-lock and
expected-ledger hashes. Floating outputs remain serialized by the locked
runtime; cross-runtime execution is rejected rather than called deterministic.

`run_sealed_replay.py` is the sole documented replay entrypoint. It resolves
the provided CPython 3.12.14 interpreter, verifies its binary SHA-256 and then
invokes the runner. `requirements-macos-arm64.lock` binds every direct and
transitive wheel with `pip --require-hashes`, while `RUNTIME_ENVIRONMENT.json`
records the platform, interpreter receipt and exact environment.

## M3 — availability boundary and future cutoff

The historical 2025 files remain classified only as
`SOURCE_LABELLED_FORECAST_STATE_RETROSPECTIVE`. Their embedded Issue Dates and
`P` states do not prove provider availability at an exact operational cutoff.
No historical operational-vintage claim is permitted.

For a future prospective run, forecast origin `t` is the embedded GFZ Issue
Date and the acquisition cutoff is `23:59:59 UTC` on that date. An append-only
receipt must bind provider URL, retrieval start/end UTC, response metadata,
byte count and SHA-256. A vintage first seen after the cutoff is inadmissible
for that origin. Archive-label or later server modification times are not
substitutes for first-seen evidence.

## M4 — fail-closed structural admission

The repaired parser rejects:

- malformed numeric rows or non-finite values;
- duplicate or non-monotonic MJDs;
- any step other than exactly `0.125` day or incomplete 1,448-row coverage;
- states outside `C` and `P`;
- missing or non-contiguous `C -> P` transitions;
- excitation magnitudes above `1e-3`;
- a first-P boundary other than Issue Date or Issue Date minus one day.

Every predicate is represented by the absence of a named rejection reason in
the output ledger. The known corrupt day 108 remains rejected without repair.

## M5 — retrospective criteria versus prospective evidence

The historical coverage, population, conversion-RMSE and B3-versus-M2 checks
are labelled retrospective qualification criteria. They cannot demonstrate a
preregistered advantage and do not confer READY status.

For future acquisition, all input-validity rules in M1–M4 are frozen now. Any
change after a prospective outcome becomes available creates a new experiment
identity and cannot be applied to the original run.

## M6 — executable operational-relevance rule

`OPERATIONAL_RELEVANCE_SUPPORTED` is secondary and may be evaluated only after
the primary B1/B2 outcome is fixed. It requires all of the following on the
identical-date intersection of observed target, M2 and valid B3 predictions:

1. horizons `1`, `3`, `7` and `30` are all available and each has at least
   `180` paired targets;
2. at every horizon, M2 RMSE is at least `5%` lower than B3 RMSE, using B3
   RMSE as the denominator;
3. at every horizon, M2 MAE is lower than B3 MAE;
4. at every horizon, the one-sided lower confidence bound for mean paired
   squared-error improvement is above zero under the parent protocol's
   circular 30-day moving-block bootstrap with 20,000 replicates and seed
   `20261001`;
5. the four horizon hypotheses pass Holm correction at familywise alpha
   `0.05`;
6. all excluded or missing dates and reasons are reported before scoring.

There is no imputation, fallback model or partial-horizon pass. If any horizon
or custody requirement is unavailable, the annotation is
`OPERATIONAL_RELEVANCE_NOT_ASSESSABLE`. Failure gives
`OPERATIONAL_RELEVANCE_NOT_SUPPORTED`. Neither class may alter the primary
`PASS_BOUNDED`, `FAIL_BOUNDED` or `INVALID` outcome.

The second repair implements this rule in
`evaluate_operational_relevance`. Four direct M2 models use, for target `T`
and horizon `h`, only lagged LOD values available at or before `T-h`. The
evaluator materializes missingness before scoring, computes paired RMSE, MAE
and squared-error improvements, runs the deterministic circular moving-block
bootstrap, applies Holm correction and emits exactly one of the three frozen
annotations. Historical replay calls it with custody unavailable, so its
diagnostic is necessarily `OPERATIONAL_RELEVANCE_NOT_ASSESSABLE` and cannot
become prospective evidence. Synthetic fixtures test supported, unsupported,
missing-custody and partial-horizon paths.

## Exit condition

The repair implementation may advance only after:

1. clean sealed replay reproduces the bounded historical diagnostics;
2. a plausible raw-cache mutation is rejected before parsing;
3. parser negative tests cover every M4 class;
4. package manifests verify;
5. a new independent review accepts closure of M1–M6.

Until item 5 closes, status remains
`SECOND_REPAIR_IMPLEMENTED_PENDING_INDEPENDENT_REVIEW` and no prospective
execution is authorized.
