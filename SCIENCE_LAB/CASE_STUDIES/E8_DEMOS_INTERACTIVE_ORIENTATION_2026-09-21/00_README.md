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

Decision: `E8_DEMOS_PARTIALLY_REPRODUCIBLE_REPAIR_REQUIRED`

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

The immutable source copies are under `SOURCE_SNAPSHOT/E8 DEMOS/`. The
validation script is `scripts/validate_e8_demos.js`.

## Re-run

```text
node scripts/validate_e8_demos.js
```

Three expected `FAIL` rows are preserved by design: no State-record reimport,
non-identical AXIS08 drawing implementations, and no numerical weighted
quotient inside either HTML. The script exits successfully only when these
known limits and every positive fixture remain unchanged.

