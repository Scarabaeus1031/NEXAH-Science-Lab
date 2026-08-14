# NEXAH Distinct-Contribution Test

## Minimum candidate method

The only surviving NEXAH-specific candidate is an operational synthesis:

1. estimate multiple preregistered stage certificates from the common sample;
2. carry explicit cross-stage uncertainty and `UNKNOWN` states;
3. record observed collision witnesses without treating them as truth;
4. enforce no-loss/nonmonotone alternatives rather than force a loss stage;
5. route the final action through the same external cost function.

It must be implemented without baseline outputs. Required ablations are:

- certificates without collision bookkeeping;
- collision bookkeeping without cross-stage pooling;
- cross-stage pooling without explicit `UNKNOWN`;
- complete method.

## Six tests

| Test | Answer |
|---|---|
| mathematically different from B8? | yes as a finite-sample structured estimator, not in target/information |
| same observable information? | yes, mandatory |
| changes a prospective decision? | possibly; that is the empirical question |
| can it be wrong? | yes: biased certificates, false collision, excess abstention |
| can baseline outperform it? | yes: B8 may be better calibrated or more efficient |
| measurable without terminology? | yes: external loss, calibration, first-loss error, resource usage |

The contribution is rejected as incremental if its decisions are deterministically
reconstructible from B8 outputs, or if ablations perform identically. File format,
ledger readability and conservative vocabulary alone are not scientific value.

