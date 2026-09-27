# E8 DEMOS — Interactive Orientation Demonstrators

Date: `2026-09-21`

Package ID: `E8_DEMOS_INTERACTIVE_ORIENTATION_2026-09-21`

Classification:

```text
E8 DEMOS
→ INTERACTIVE_ORIENTATION_DEMONSTRATORS
→ MATHEMATICAL_REFERENCE_PLUS_NEXAH_PROJECTION_OPERATORS
→ PHYSICAL_IDENTITY_NOT_CLAIMED
```

Decision after Repair R1: `E8_DEMOS_TECHNICALLY_VALID_MODEL_BOUNDARIES_RECORDED`

This package preserves the six supplied files byte-for-byte, binds the E8
reference data used for verification, records the static and mathematical
tests, and places both HTML files in the Science Lab as demonstrators. It does
not activate a research cycle, capability, physical claim or astronomical
result.

## Read order

1. [`E8_DEMOS_INTEGRATION_RECEIPT.md`](E8_DEMOS_INTEGRATION_RECEIPT.md)
2. [`E8_DEMOS_VALIDATION_REPORT.md`](E8_DEMOS_VALIDATION_REPORT.md)
3. [`E8_DEMOS_TEST_RESULTS.csv`](E8_DEMOS_TEST_RESULTS.csv)
4. [`E8_DEMOS_SOURCE_BINDINGS.md`](E8_DEMOS_SOURCE_BINDINGS.md)
5. [`E8_DEMOS_MANIFEST.json`](E8_DEMOS_MANIFEST.json)

The immutable source copies are under `SOURCE_SNAPSHOT/E8 DEMOS/`. Repair R1
is a separate canonical successor under `REPAIR_R1/`; it does not overwrite or
silently reinterpret either source HTML.

## Re-run

```text
node scripts/validate_e8_demos.js
node REPAIR_R1/test_repair.js
```

The intake validator retains the three historical source limits. The Repair R1
test must pass independently and supplies the canonical numerical operator,
declared tie rule and lossless State-record roundtrip. The original divergence
therefore remains visible as provenance while no longer governing the current
demonstrator implementation.
