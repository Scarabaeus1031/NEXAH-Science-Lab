# POLAR-LOD-01 provenance and readiness audit

Date: 2026-10-01
Disposition: `CUSTODY_IMPLEMENTED / COLLECTION_NOT_AUTHORIZED / NOT_READY_FOR_CONFIRMATORY_EXECUTION`

## Historical claim reconstructed

Polar-Janus Test 08 compared daily IERS `LOD` values using:

- `M0`: previous-day persistence;
- `M1`: intercept, trend, annual and semiannual harmonics, plus LOD lags
  `1, 2, 7, 14, 30` days;
- `M2`: M1 plus four lunar-month periods and two half-month periods.

The retained result reports for the 2025 holdout:

- M1 RMSE `0.042350 ms`;
- M2 RMSE `0.037705 ms`;
- relative improvement `10.969336200869513%`;
- positive block-bootstrap fraction `1.0`;
- six of six positive rolling years for 2020–2025.

Test 08C subsequently reported local frequency specificity around the same
six periods. Its own preregistration correctly labels it a post-hoc robustness
test and not independent confirmation.

## Custody and chronology

The two historical directories are present in the Science Lab worktree but
are not tracked by Git. Their local filesystem ordering is internally
consistent but not an independent pre-output seal:

| Artifact | Local timestamp | SHA-256 |
|---|---|---|
| Test 08 preregistration | 2026-08-18 18:12:30 +0200 | `579b5f671b3585e4f2e733487dbd1b33283dd1ab193ab6de74655dd5f9f1b581` |
| Test 08 runner | 2026-08-18 18:12:30 +0200 | `ecb36d24ead963a026cf91cb1dccb8400f159b88404bc414033cb6e4d62fbd2f` |
| Test 08 result | 2026-08-18 18:12:54 +0200 | unsealed historical output |
| Test 08C preregistration | 2026-08-18 19:22:22 +0200 | `b8d14ae6f8d717f908ffd8dca6f40c759a9e5152c40f4324b297d8aa96ecb3bb` |
| Test 08C result | 2026-08-18 19:29:18 +0200 | embeds the matching preregistration hash |

This supports reconstruction of the package but cannot prove that the Test 08
hypotheses were inaccessible before its output was known.

## Source audit

Historical Test 08 records:

- source product: `IERS EOP 20u24 C04, IAU 2000A, 0 h UTC`;
- historical source hash in the result:
  `60718d1cace4dd75be168aad34a1832ced8b986bd76aabd8a49649a1a7200ddf`;
- retained extracted 2010–2025 CSV hash:
  `5a4df1e393b3feaceb695c636c1a8b363c08a5464f448ba890b678c9cc396996`.

The official source was fetched to a temporary file and inspected on
2026-10-01. The temporary file was then removed.

| Field | Observed value |
|---|---|
| official URL | `https://datacenter.iers.org/data/csv/eopc04_20u24.dPsi_dEps.1962-now.csv` |
| fetched SHA-256 | `689a1313bb4044097f51fe8cafe1940531476038faee44fe9b6f4ada0b3ed4ff` |
| bytes | `4,188,397` |
| last available daily row | `2026-09-01` / MJD `61284.00` |
| LOD on last row | `0.0007574 s` |

Because C04 is a maintained combined series, future retrievals may also revise
older rows. A future execution must retain both the freeze snapshot hash and
the evaluation snapshot hash and must evaluate only newly admitted dated rows.

## Prediction-semantics audit

The historical runner constructs lag columns over the complete time series
before splitting. Within each holdout day, M1 and M2 therefore receive the
actually observed LOD values from the preceding 1, 2, 7, 14 and 30 days. This
is legitimate for a daily rolling one-step-ahead comparison when declared,
but it is not a 365-day forecast issued at the start of the year.

The phrase `blindes Holdout 2025` means the year was withheld from fitting and
alpha selection. It does not mean the observations were prospectively unknown
when the script ran in August 2026.

## Baseline audit

The M1 comparison is useful as a simple statistical baseline but not strong
enough for a confirmatory scientific claim. Established Earth-rotation
practice explicitly models tidal terms in `UT1` and `LOD`; published LOD
prediction work commonly removes predictable solid-Earth, ocean-tide and
seasonal effects before modeling residuals. Adding lunar periods to a baseline
that omits such terms can recover known geophysical structure without showing
a new NEXAH contribution.

## Readiness gates

| Gate | Requirement | State |
|---|---|---|
| R1 custody | source, code, environment and preregistration hash-bound before outcomes | `IMPLEMENTATION FROZEN / NO RECEIPTS YET`; opaque-byte collector, contract, runtime and release gate added 2026-10-02 |
| R2 chronology | evaluation rows must postdate the new freeze | `NOT STARTED`; collection release is not granted |
| R3 minimum window | at least 180 newly admitted daily rows and at least six complete synodic cycles | `NOT STARTED`; no post-release receipt population exists |
| R4 strong baseline | validated established tidal/geophysical comparator plus strong statistical baseline | `PASS / BASELINE_READY`; see `POLAR-LOD-BL-01` |
| R5 semantics | primary and secondary horizons, allowed information, inference, specificity and claim ceilings frozen | `PASS / EXTENDED CONTRACT FROZEN` |
| R6 execution release | separate Human Owner release after R1–R5 close | `NOT_GRANTED` |

The extended contract additionally requires an EAM source-vintage preflight
before any operational-relevance comparison. Failure of EAM custody does not
change the frozen B1/B2 core question, but it caps any eventual run as
non-operational.

## Decision

`NOT_READY_FOR_CONFIRMATORY_EXECUTION`. The historical 10.969% figure remains
a screened reproduction candidate, not a confirmed application result.
`POLAR-LOD-BL-01` closes R4 and the independently accepted EAM repair closes
the historical B3 method gate. The 2026-10-02 custody package makes R1/R2
executable but deliberately refuses collection under the unchanged
`NOT_GRANTED` owner record. Custody receipts, prospective chronology,
minimum-window and execution-release gates therefore remain open. No source
content or prospective runner is executed under this audit and no Research
Result row is created.
