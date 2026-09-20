# KAPPA-01 — Current Status

## Classification

`SOFTWARE_GATE_PASS_PHYSICAL_INPUTS_PENDING`

The scientifically stronger campaign architecture is ready, but no real data
collection is authorized yet.

## Software validation

All registered controls passed:

- uninterrupted active and sham sessions admitted;
- known 2° active endpoint recovered as `1.9999999999994884°`;
- sham endpoint recovered as approximately zero;
- clock reset rejected;
- duplicate sample index rejected;
- missing event marker rejected;
- missing recovery phase rejected;
- complete synthetic configuration accepted by the final campaign schema.

The readiness run is deterministic and byte-identical on repetition.

## Why acquisition remains blocked

Thirty source-bound values remain pending across:

- apparatus and calibrations;
- shared clock and channel skew;
- active/sham definitions and event marker;
- safety and washout;
- fixed frequency, amplitude, preload and sample rate;
- MCID, independent paired-session variance and attrition;
- block limits, randomization receipt and blinding custody.

The schema deliberately rejects the current pending configuration. This is a
successful fail-closed result, not a software failure.

## Evidence boundary

Synthetic recovery validates only the estimator and admission logic. It does
not demonstrate a physical Kappa path or authorize a claim about the apparatus.
