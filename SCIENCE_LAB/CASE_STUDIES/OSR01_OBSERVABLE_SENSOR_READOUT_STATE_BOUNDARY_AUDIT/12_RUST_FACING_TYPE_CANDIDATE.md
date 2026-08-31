# Rust-facing Type Candidate

This is a conceptual schema, not Rust code or implementation authorization.

| Type | Required fields | Identity condition | Dependencies | May vary | Comparable when | Forbidden conflations |
|---|---|---|---|---|---|---|
| `StateRef` | system ID, state/revision ID, time/provenance | registered IDs | source registry | referenced state revision | same system/schema | observable, value, display |
| `ObservationMap` | map ID/version, domain, codomain, configuration | rule/version | frame/calibration where applicable | configuration/version | compatible domains | observable, event, sensor hardware |
| `ObservableDefinition` | observable ID, quantity semantics, domain, dimensional kind | definition/version | state schema | definition revision | same quantity kind | runtime value |
| `MeasurementEvent` | event ID, observable ID, map ID, time, provenance/configuration | event ID | state/source, map, instrument | time/configuration/status | compatible procedures | rule, value |
| `MeasurementValue` | event/provenance, observable ID, value | record ID or provenance tuple | event, unit where applicable, uncertainty/resolution where applicable | value, quality | compatible observable/unit/frame | event, readout |
| `Calibration` | calibration ID/version, rule/parameters, range, reference provenance | calibration/version | instrument/map | parameters/validity | compatible instruments/ranges | measurement |
| `Unit` | unit ID, quantity kind, scale convention | unit ID/version | dimensional registry | representation choice | convertible quantity kinds | quantity |
| `Uncertainty` | method/type, bound/value, semantics | attached record/method | measurement and method | magnitude/model | compatible semantics | truth value |
| `Readout` | readout ID, source measurement IDs, display transformation | source+rule or ID | measurement values | formatting, units, rounding | same source and transformation | value, state |
| `View` | view ID, source-kind tag, source IDs, representation rule | source+rule or ID | embedding, measurement or both | crop/layout/rendering | compatible source-kind/rule | truth, embedding, measurement |

## Invalid-state prevention

- A `MeasurementValue` cannot stand without its observable and event/provenance.
- Unit and uncertainty/resolution are explicit where applicable.
- A `Readout` cannot stand without source measurements and a display transformation.
- A `View` must declare `EmbeddingSource`, `MeasurementSource` or `CompositeSource`.

`RUST_FACING_TYPE_INTERFACE_USEFUL=YES_CONCEPTUALLY`

`RUST_IMPLEMENTATION_CREATED=NO`
