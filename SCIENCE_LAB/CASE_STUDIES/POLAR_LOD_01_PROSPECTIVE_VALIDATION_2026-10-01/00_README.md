# POLAR-LOD-01 — prospective LOD validation

Date: 2026-10-01
Owner: Human Owner
Native status: `EXTENDED_PROTOCOL_FROZEN / B3_SECOND_REPAIR_DATA_CUSTODY_AND_RELEASE_GATES_OPEN`
Lab status: `FILED / NO_RESULT / NO_ACTIVATION`

## Question

Does the fixed six-period lunar feature set retained from Polar-Janus Test 08
add out-of-sample information for daily IERS length-of-day (`LOD`) values after
comparison with strong statistical, tidal and operational-geophysical
baselines on genuinely post-freeze data?

This is a prediction-method question. It is not a test of whether the Moon
affects Earth rotation; lunisolar and ocean-tidal effects in `UT1` and `LOD`
are established parts of the IERS conventions.

## Current disposition

The Human Owner selected the opportunity for one bounded readiness audit. The
audit closes `NOT_READY_FOR_CONFIRMATORY_EXECUTION`:

1. the historical Test 08/08C package is not Git-tracked and has no
   independently verifiable pre-output seal;
2. the reported 2025 holdout was already historical when executed on
   2026-08-18;
3. Test 08 is a one-step-ahead conditional prediction using observed LOD lags
   inside the holdout, not a fixed one-year forecast;
4. the original M1 baseline omits established lunisolar/tidal structure;
5. the official source snapshot checked on 2026-10-01 ended at 2026-09-01,
   leaving only fourteen new daily values after the historical execution.

`POLAR-LOD-BL-01` subsequently closed the strong-baseline gate. It froze a
17-lag ridge comparator and an IERS-Conventions-2010 long-period zonal-tide
comparator, validated the IERS implementation against the official reference
case, and found retrospectively that the old six-period candidate did not beat
the geophysical comparator on the already-known 2025 holdout. This is method
qualification, not a prospective result.

`POLAR-LOD-EAM-01` first received an independent adversarial review with a
`CONDITIONAL_PASS`. The subsequent repair enforced all 365 expected hashes,
strengthened parsing and preserved the historical outputs byte-for-byte. Its
independent repair review nevertheless returned `FAIL`: caller-selected
alternative ledger and lock files can still obtain a verified status, the
exact runtime is not portably provisioned, and the four-horizon M6 decision
rule is not executable. M3–M5 are closed; M1/M2 and M6 require a second repair
and another independent review. That historical diagnostic is not a
prospective result.

The prospective contract is expanded without changing M2. Horizon `1`
remains primary; horizons `3`, `7`, and `30`, an archived-forecast EAM
benchmark, frequency-matched negative controls and fixed ablations test
robustness, specificity and possible operational relevance. These secondary
routes cannot rescue a failed primary result.

No model was executed, no threshold was inspected against a new outcome and
no scientific result was created.

## Package

- [Provenance and readiness audit](01_PROVENANCE_AND_READINESS_AUDIT.md)
- [Strong-baseline and prospective protocol](02_STRONG_BASELINE_AND_PROSPECTIVE_PROTOCOL.md)
- [Completed baseline qualification](../POLAR_LOD_BL_01_BASELINE_QUALIFICATION_2026-10-01/00_README.md)
- [Conditional EAM/B3 historical qualification](../POLAR_LOD_EAM_01_OPERATIONAL_BASELINE_QUALIFICATION_2026-10-01/00_README.md)
- [Independent EAM/B3 adversarial review](../POLAR_LOD_EAM_01_OPERATIONAL_BASELINE_QUALIFICATION_2026-10-01/03_INDEPENDENT_ADVERSARIAL_REVIEW.md)
- [Independent EAM/B3 repair review](../POLAR_LOD_EAM_01_OPERATIONAL_BASELINE_QUALIFICATION_2026-10-01/06_INDEPENDENT_REPAIR_REVIEW.md)

## Claim ceiling

At most, a future valid execution may support incremental one-step-ahead
predictive utility of one frozen feature set in one named IERS series.
Secondary horizons may support temporal robustness, and a valid archived EAM
comparison may support bounded operational relevance. It may not establish a
new astronomical mechanism, causal lunar effect, universal clock, privileged
`4+2` structure, general NEXAH capability or an operational EOP forecasting
system.
