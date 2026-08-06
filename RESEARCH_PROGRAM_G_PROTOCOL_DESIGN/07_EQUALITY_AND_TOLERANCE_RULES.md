# Equality and Tolerance Rules

## Equality layers

| Layer | Rule |
|---|---|
| protocol and input identity | exact SHA-256 hash equality |
| identifiers and indices | exact string and integer equality |
| view matrices | exact integer-entry equality |
| canonical input numbers | finite decimal strings interpreted as exact decimal values |
| scientific observational equivalence | maximum-norm discrepancy `≤ 1×10^-9` |
| pair and partition replay | exact categorical equality |
| numeric diagnostic replay | absolute difference `≤ 1×10^-12` for reported discrepancies |
| prose interpretation | manual scope review; no tolerance |

## Scientific tolerance

`tau_scientific = 0.000000001`

It is fixed before input inspection by the execution group. It applies only to displayed-coordinate pair discrepancies. It must not be reused for hashes, schemas, source identity, row matching, matrix conformance, or authority checks.

## Replay tolerance

`tau_replay_numeric = 0.000000000001`

This compares reported numeric discrepancy values between conforming independent implementations. Scientific agreement requires exact equality of pair classifications, partitions, null disposition, and terminal result.

Numeric replay agreement cannot override a categorical disagreement.

## Boundary rule

The scientific decision operator is `≤`:

- `D = τ_sci` is `EQUIVALENT`;
- `D > τ_sci` is `DISTINGUISHABLE`.

No gray zone, rounding band, or adaptive threshold is permitted.

## Arithmetic rule

The mathematical reference treats canonical decimal inputs as exact finite decimals and uses the four integer matrices. Implementations may use another numeric representation only if all categorical outputs conform and diagnostic discrepancies satisfy the replay tolerance.

Runtime trigonometric evaluation is prohibited because the four matrices are already frozen.

## Rounding rule

- no input coordinate may be rounded by the executor;
- no intermediate value may be rounded before pair classification;
- display formatting may occur only after evidence values are stored;
- stored discrepancies must preserve at least twelve digits after the decimal point or an equivalent exact representation;
- negative zero must normalize to zero in categorical and partition outputs.

## Missing and non-finite values

No imputation is permitted. Any missing, unparsable, `NaN`, or infinite scientific value yields `invalid protocol` and STOP.

## Independent disagreement

If two independently reviewed, apparently conforming replays disagree categorically and no frozen-object or implementation violation can be established without changing the protocol, the synthesis result is `inconclusive`. Preserve both evidence packages. Do not average results or change tolerances.

If a protocol or conformance violation is identified, the affected run is `invalid protocol`, not inconclusive.

## Assumptions that must never change during replay

- exact input bytes and protocol hashes;
- decimal interpretation;
- view matrices and coordinate order;
- matched sample indices;
- maximum norm across both displayed coordinates and all 121 samples;
- scientific and replay tolerances;
- boundary operator `≤`;
- no preprocessing;
- categorical and partition encodings;
- result decision table.
