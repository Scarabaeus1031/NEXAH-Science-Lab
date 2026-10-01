# POLAR-LOD-EAM-01 — independent adversarial review

Date: 2026-10-01
Reviewer role: independent adversarial implementation/method reviewer
Disposition: **CONDITIONAL_PASS**
Bound commit: `70a866619b16fa3148bdd531d5eb1a8cdba54642` (`codex/grid-observatory-mission-control`)
Scope: `POLAR_LOD_EAM_01`, its bound `POLAR_LOD_01` protocol, and `POLAR_LOD_BL_01` baseline only

## Executive decision

The physical conversion, historical target alignment, same-date comparator
pairing, and reported historical metrics are substantively supported. In
particular, the selected sign and units,

`LOD_hat = 86400 * EAM90_x3 + IERS_RG_ZONT2_DLOD`,

are consistent with the official excitation convention and are overwhelmingly
favoured by the package's own `C`-state cross-check. Every scored B3 target is
source-labelled `P`; the four one-day comparators use exactly the same 344
target MJDs; and a clean replay reproduced all committed CSVs byte-for-byte.

This is not an unconditional pass. The current runner does not fail closed on
the committed raw-vintage hashes, the package-local manifest does not bind its
external baseline/code/data dependencies, archive availability is represented
only by a date-level header rather than an independently bound publication
timestamp, and several readiness gates were fixed in the same commit as the
outcome-known historical result. In addition, the future
`OPERATIONAL_RELEVANCE_SUPPORTED` rule is not yet precise enough to execute.
Those defects do not overturn the bounded historical diagnostic, but they must
be repaired before the package can be called a sealed operational-baseline
implementation or used for a prospective operational-relevance annotation.

No prospective data were obtained or inspected. No scientific prospective
test was run.

## What was checked

1. Verified repository HEAD, branch, commit metadata and scoped Git tree.
2. Verified all three scoped `SHA256_MANIFEST.txt` files with
   `shasum -a 256 -c`; every listed entry passed.
3. Re-ran `eam_vintage_qualification.py` using only the supplied private cache
   `/tmp/polar-eam-preflight.AhH0ZK/eam90-2025`, with CPython 3.12.7,
   NumPy 1.26.4 and pandas 2.3.3, writing only to `/private/tmp`.
4. Reconstructed file-label dates, embedded Issue Dates, C/P boundaries,
   deduplication, target MJDs, target states and per-horizon populations
   independently from the cache and committed ledgers.
5. Recomputed the sign/unit sanity alternatives on the 90 integer-day
   `C` rows in the first vintage.
6. Recomputed the paired-population identities for B1, B2, B3 and M2 and
   inspected the past-only lag and training/validation splits.
7. Performed a cache-tampering test in `/private/tmp`: one evaluated x3 cell
   was changed while preserving syntax, dimensions, states and physical-range
   admission. The runner still returned
   `B3_READY_WITH_DECLARED_SOURCE_EXCEPTIONS` with every gate true.
8. Repeated an unmodified replay to distinguish stable local replay from
   cross-environment floating-point serialization.
9. Checked the historical/prospective language, decision gates, STOP rules,
   claim ceiling, upstream IERS notice, GFZ custody statement and manifest
   containment.

The supplied cache contained 365 named files. The SHA-256 of the sorted
`shasum -a 256` listing was
`dd0e4bad2a2bd5670e02d621c1ae2eae75bb7b971209f4d3f66850bc21f00d2d`.
This is an audit convenience digest, not a replacement for the 365-row ledger.

## Positive findings

### P1 — Transformation sign and units are supported

The IERS Earth-orientation explanation defines the axial excitation as
`chi_z = DeltaLOD / LOD`, with nominal LOD 86400 s. Thus multiplying the
dimensionless GFZ x3 component by 86400 produces seconds of LOD with the
positive sign used here. The official IERS `RG_ZONT2` routine returns the
long-period `DLOD` correction in seconds/day; numerically this is the same
time increment used in the daily LOD field. The baseline implementation also
reproduces the official MJD 54465 reference case to floating-point precision.

The independent 90-row comparison gave:

| Alternative | RMSE (ms) |
|---|---:|
| `+86400*x3 + ZONT2` (implemented) | 0.017015 |
| `+86400*x3 - ZONT2` | 0.895557 |
| `-86400*x3 + ZONT2` | 0.719870 |
| `+86400*x3` only | 0.448441 |

This is strong evidence against a sign reversal or a missing factor of 86400.
Primary official anchors are the IERS Conventions Centre Chapter 8 / `RG_ZONT2`
materials and the IERS Earth-orientation excitation description; the local
IERS-derived routine and upstream licence notice are appropriately identified.

### P2 — Scored historical rows are forecast-state rows

The independent reconstruction found 1,339 scored rows across horizons
(`344/342/338/315` at `h=1/3/7/30`), all marked `P`. No scored row was marked
`C`, and no analysis/reanalysis row was substituted for a scored target.
Every selected Issue Date is unique, and every `(target_mjd, horizon)` pair is
unique.

### P3 — B1/B2/M2/B3 one-day comparison is exactly paired

The one-day population is the 344 B3 target MJDs. B1, B2 and M2 predictions
are indexed onto precisely those MJDs before errors are computed. Each model
therefore has `n=344`; there is no model-specific missingness advantage.
B1/B2/M2 are fitted on 2010–2023, alpha-selected on 2024, and evaluated on
2025. Their lag construction uses positive shifts only, so the target day's
LOD cannot enter its own feature vector.

### P4 — Historical/prospective boundary is mostly explicit

The documents repeatedly classify the 2025 results as outcome-known,
retrospective method qualification and deny prospective authority. The parent
protocol requires genuinely post-freeze rows, custody, independent review and
Human Owner release; secondary horizons and B3 cannot rescue a failed primary
B1/B2 result. The stated scientific claim ceiling is appropriately narrow.

### P5 — Present outputs are locally reproducible

The clean replay reproduced the committed vintage ledger, prediction CSV and
horizon-metric CSV byte-for-byte. A second clean replay was identical to the
first. The committed JSON differed from the new replay only in B1/B2/M2
floating-point values at approximately `1e-16` relative scale, with no gate,
rounded metric or conclusion change.

## Findings requiring repair

### MAJOR M1 — The raw-vintage ledger is recorded, but not enforced

`fetch_one` trusts any existing cache file. The runner computes and writes its
hash, but never compares it with the committed `gfz_2025_vintage_ledger.csv`
or another expected-input manifest. A syntactically valid altered cache is
therefore treated as a new truth rather than rejected.

Adversarial result: changing one evaluated x3 value in the first vintage from
`0.495860840702794E-08` to `0.500000000000000E-08` changed one-day RMSE from
`2.647930401625292e-05` to `2.6485378577738126e-05` seconds, yet the runner
returned `B3_READY_WITH_DECLARED_SOURCE_EXCEPTIONS` and all gates remained
true. This directly contradicts a fail-closed interpretation of “the ledger
binds” the raw inputs.

**Required repair:** add a replay mode that requires an expected 365-entry
filename/URL/byte-count/SHA-256 ledger and rejects every mismatch before
parsing or scoring. A separate acquisition mode may create a candidate ledger,
but it must not confer READY status until independently sealed. Bind the exact
ledger digest into the result.

### MAJOR M2 — Package integrity does not bind external executable dependencies

The EAM manifest covers its local files, but the runner dynamically imports
`POLAR_LOD_BL_01/.../baseline_qualification.py` and reads the historical IERS
CSV outside the package. Neither external file's hash, the baseline manifest
hash, nor the runtime stack appears in the EAM manifest/result as an enforced
dependency. Changing the external baseline can change B1/B2/M2 and the READY
gate while the EAM manifest still verifies.

**Required repair:** create a top-level execution manifest binding the EAM
runner, baseline runner, source CSV, all three package manifests, interpreter
and numerical-library versions. Verify it before execution. Serialize metrics
at a declared precision or define numeric tolerances so replay is portable and
the word “deterministic” has an operational meaning.

### MAJOR M3 — Issue Date is not a complete proof of availability at forecast origin

The date relations are nontrivial: among selected vintages, 329 archive labels
are one day after the embedded Issue Date and 15 equal it. Six unselected April
labels precede a shared embedded Issue Date by one to six days. The selected
files' first `P` boundary is the Issue Date for 329 vintages and one day before
it for 15. The code uses the embedded calendar Issue Date as the origin and
does not bind a publication timestamp, retrieval timestamp, timezone or
provider-side availability record.

All scored rows are `P`, so no direct target-value leakage was found. But a
date-only header plus an archive filename cannot by itself prove that a file
was actually available before a particular operational forecast cutoff. This
matters because the normal h=1 target date equals the archive label date.

**Required repair:** freeze an exact UTC decision cutoff; retain provider
publication/first-seen timestamps or an append-only acquisition receipt; state
whether origin means header Issue Date, first-P boundary, archive label date,
or actual acquisition time; and reject/label any inconsistency by a prespecified
rule. For historical data lacking such evidence, call the comparison
“source-labelled forecast-state retrospective” rather than fully
vintage-availability-proven.

### MAJOR M4 — Structural admission is not fully fail closed

`parse_vintage` stores rows in a dictionary keyed by MJD, so duplicates are
overwritten before the row count is checked. It does not require finite values,
the exact 0.125-day grid, monotonic coverage, an allowed state alphabet, one
contiguous C→P transition, or agreement between Issue Date and C/P boundary.
The current cache independently passed the duplicate and state-alphabet checks,
but the parser does not enforce those facts for replay or future custody.

**Required repair:** validate raw row count and unique row count separately;
reject non-finite values, duplicate MJDs, grid/coverage gaps, unknown states,
non-monotonic or multiple state transitions, and origin/boundary conflicts.
Record each predicate in the machine-readable result.

### MAJOR M5 — “Frozen” readiness thresholds are outcome-known, not preregistered

The 90% coverage threshold, `n>=340`, conversion RMSE `<0.05 ms`, and the gate
requiring B3 to beat M2 were introduced in the same commit that contains the
2025 outputs. There is no independent pre-output seal for these values. The
last gate is explicitly outcome-dependent. It can describe historical method
development, but it cannot be treated as prospective validation or independent
evidence that this particular readiness definition was not selected after
inspection.

**Required repair:** label these gates “retrospective qualification criteria,”
not frozen evidentiary thresholds. Pre-register and hash-seal the future
acquisition, validity and fallback gates before any new outcomes are available.
READY may mean “candidate implementation for future sealing,” not “validated
operational advantage.”

### MAJOR M6 — The future B3 operational-relevance rule is underspecified

The parent protocol says M2 must “beat B3 on the supported horizons,” but does
not fix the exact improvement metric/denominator, minimum effect, confidence
rule, multiplicity treatment, required horizons, missing-date pairing, or what
happens when B3 custody is available for only part of the evaluation window.
By contrast, the B1/B2 primary rule is much more explicit. The operational
annotation therefore remains open to post-hoc interpretation.

**Required repair:** before prospective release, specify an identical-date
population and exact B3 endpoint for each horizon; declare whether all or a
subset must pass; fix effect thresholds, uncertainty/multiplicity handling and
fallback/missingness rules; and state that this secondary annotation cannot
alter `PASS_BOUNDED`/`FAIL_BOUNDED`.

### MINOR N1 — The 29.45% prose uses a nonstandard denominator

The reported value is `(RMSE_M2 - RMSE_B3) / RMSE_B3 = 29.45%`, i.e. M2's
excess relative to B3. The conventional statement “B3 is X% lower than M2”
uses M2 as denominator and equals **22.75%**. The documents say “B3 is 29.45%
lower ... relative to B3,” which is internally awkward and easy to misread.

**Repair:** either say “M2 RMSE is 29.45% higher than B3, relative to B3,” or
say “B3 RMSE is 22.75% lower than M2, relative to M2.” Rename the JSON field to
encode its denominator.

### MINOR N2 — Archive-index identity is asserted but not replay-verifiable

`INDEX_SHA256_AT_AUDIT` is a scalar constant, while the fetched index bytes are
not retained and the runner does not fetch/verify that hash. The 365 URL/hash
ledger is valuable, but the index-hash claim cannot be reproduced from the
package alone.

**Repair:** retain authorized index bytes or an acquisition receipt and verify
the hash, or remove the unused index hash from the executable claim surface.

### MINOR N3 — Licence and custody treatment is careful but incomplete for release

The IERS derived-code notice is present and the routine is renamed and
described. GFZ raw data are not redistributed, and the absence of inferred
redistribution permission is explicitly disclosed. That is appropriate for
this internal historical audit. Public release or a future operational run
still needs a dated GFZ terms/licence record and authorized raw-vintage custody,
as the protocol already anticipates.

## Gate and error-path assessment

| Area | Audit conclusion |
|---|---|
| Missing archive file | acquisition attempted; network/error aborts execution |
| Malformed header | fails closed with exception |
| Wrong structural row count | file rejected |
| Large excitation magnitude | file rejected |
| Missing all C or all P rows | file rejected |
| Unknown individual state / non-finite / grid disorder | not fully rejected; repair M4 |
| Altered but plausible cached bytes | accepted and re-ledgered; repair M1 |
| Target state | every current scored row is `P`; gate fails otherwise |
| Insufficient current H1 population | `n<340` fails historical READY |
| Historical outcome boundary | clearly disclosed, but thresholds are post-output |
| Prospective authorization | explicitly absent |
| Manifest replay | local entries verify; external dependency closure absent |

## Claim ceiling after this review

The current package may claim only:

> On the retained, outcome-known 2025 files, using embedded Issue Dates and
> source `P` labels, the specified positive x3 plus ZONT2 conversion produced
> the reported retrospective B3 errors and a same-date comparison against the
> frozen historical B1/B2/M2 implementations. This supports continued
> prospective-method preparation, subject to custody and execution repairs.

It may **not** claim that:

- B3 or M2 has prospective predictive superiority;
- the 2025 archive availability was independently proven to the required UTC
  forecast cutoff;
- the runner is sealed against altered caches or external-dependency drift;
- the post-output readiness thresholds are preregistered evidence;
- operational relevance is supported;
- any causal lunar mechanism, novel physics, universal `4+2` structure,
  operational EOP service, or general NEXAH superiority has been established.

## Lock recommendation

**CONDITIONAL_PASS for historical method qualification only.** Preserve the
current outputs as a transparent development record. Do not promote the
package to an unconditional implementation lock and do not authorize an
`OPERATIONAL_RELEVANCE_SUPPORTED` result until M1–M6 are closed and the repaired
contract/implementation is independently reviewed before prospective outcome
access.
