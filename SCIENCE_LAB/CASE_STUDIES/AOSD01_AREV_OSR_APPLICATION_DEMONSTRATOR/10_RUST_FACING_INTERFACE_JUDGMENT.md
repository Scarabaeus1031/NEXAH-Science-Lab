# Rust-facing Interface Judgment

## Scope

No Rust code is written. This is a conceptual interface judgment only.

The closed grammar supports a tagged source union equivalent in intent to:

```text
ViewSource =
  Geometry(embedding provenance)
  | Measurement(measurement provenance)
  | Composite(geometry provenance, measurement provenance)
```

The exact language syntax and data layout remain undecided.

## Useful constraints

- A geometry view cannot omit its graph and embedding references.
- An angle cannot omit its embedding, metric and measurement provenance where measured.
- A measurement value cannot omit its observable and event/provenance.
- A readout cannot omit source values and display transformation.
- A composite view cannot erase either source branch.
- A ratio record retains numerator, denominator and selection-rule provenance rather than only a reduced glyph.
- A mnemonic view retains its calendar record and mapping rule.

These requirements can make invalid conflations harder to represent without adding a new scientific type.

`RUST_FACING_INTERFACE_USEFUL=YES_CONCEPTUALLY`

`RUST_IMPLEMENTATION_CREATED=NO`

`IMPLEMENTATION_ACTIVATION=NO`
