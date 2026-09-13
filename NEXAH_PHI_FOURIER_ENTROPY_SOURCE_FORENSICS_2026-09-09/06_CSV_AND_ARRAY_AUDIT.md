# CSV and Array Audit

## Microwave_Background_Intensity_Map.csv

- File shape: 8 data rows × 8 columns; headers are 0 through 7.
- Numeric type: all 64 cells parse as floating point.
- Missing values: 0.
- Duplicate data rows: 4, caused by exact vertical symmetry.
- Range: 0 to 1.
- Sum: 32.22937567786184.
- Exact left-right and up-down symmetry: yes.
- Ordered numeric-array digest: SHA-256 of little-endian float64 C-order bytes = 8872e0b638df958c38c6b8ff6909dc674ff6cc6b42254d5a5b6bc1926432a9ed.
- Coordinates: headers suggest column indices only; no row-coordinate field.
- Units, instrument, observation time, preprocessing, source citation, coordinate convention, and license: missing.
- Generator consumption: neither Python candidate opens or names this CSV.
- Classification: **UNBOUND_NUMERICAL_TABLE**, not CMB evidence.
- Structure note: values are minimal in the central 2×2 cells and maximal at corners; this is not a conventional center-peaked Gaussian density.

## Resonance_Alignment_Grid.csv

- Shape: 5 rows × 6 columns.
- Columns: Element, Zone, Polyhedral Form, Tone, Frequency (Hz), Alchemical Function.
- Missing values: 0; duplicate rows: 0.
- Numeric field: frequency 261.63 to 493.88 Hz; mean 376.234 Hz.
- Ordered numeric digest: 61e062ba09ba9225144fe823ff7d837b67975410d39d5a32116ffbc3ccf8976b.
- Provenance of element-tone/form/function assignments: absent.
- Generator consumption: none.
- Classification: manually curated association table; frequencies are typed but their physical coupling claims are unbound.

## Expanded_Resonance_Alignment_Grid.csv

- Shape: 8 rows × 6 columns.
- Missing values: 0; duplicate rows: 0.
- Numeric frequency range: 261.63 to 493.88 Hz; mean 352.7075 Hz.
- Ordered numeric digest: 0f7d8e355f71dd323c978588a88d296761c2d9b306d3ef76a76f487de3111ab5.
- The complete five-row smaller grid is an exact ordered prefix.
- Three appended rows: Gold, Mercury, and Bismuth.
- No deterministic rule or generator for the appended semantic assignments was found.
- Classification: deterministic prefix extension at the row level; transformation provenance unresolved.

## Silver_Rain_Catalyst_Mini_Table.csv

- Shape: 8 rows × 2 text columns.
- Missing values: 0; duplicate rows: 0.
- Numeric array: none.
- Contains element names plus narrative “breathing reactor” roles.
- Citation, measurement, units, physical mechanism, and generator: absent.
- Classification: documentary association table only.

## Cross-table result

No CSV contains a source identifier or output hash tying it to a named Fourier, entropy, Zeta, Möbius, animation, or residual artifact.

