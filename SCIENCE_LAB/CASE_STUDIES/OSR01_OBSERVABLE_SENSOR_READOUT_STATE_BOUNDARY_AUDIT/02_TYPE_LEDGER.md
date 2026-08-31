# Type Ledger

| Type | Minimum meaning | Required dependencies | Not equal to |
|---|---|---|---|
| `SystemState` | registered underlying state/state reference at a time or revision | system identity, state identity/provenance | observable, measurement, display |
| `ObservationMap` | declared rule or sensor response mapping accessible state to an output space | domain, codomain, configuration, frame where needed | observable, event, view |
| `ObservableDefinition` | identity and semantics of the quantity intended to be observed | quantity ID, domain/codomain, dimensional kind | measured value |
| `MeasurementEvent` | one occurrence applying an observation procedure | event/time ID, map, observable, instrument/configuration, provenance | rule or value |
| `MeasurementValue` | result record of an event | event, observable, value, unit where applicable, uncertainty/resolution where applicable | event, readout |
| `Calibration` | rule/parameters connecting raw response to a registered quantity scale | instrument/map identity, validity range/version, reference provenance | measurement |
| `Unit` | representation scale and dimensional metadata | unit identity and quantity kind | quantity itself |
| `Uncertainty` | explicit dispersion, interval, resolution or bounded error description | method, value/bound and confidence semantics where applicable | error-free truth |
| `Readout` | display transformation and rendered representation of measurement values | source values and display rule | state, value, view in general |
| `View` | broader representation sourced from an embedding, measurement or both | source-kind tag and source references | truth or source object |
| `Frame` | declared reference needed for frame-dependent quantities | basis/reference identity | sensor or view |

The arrows in the pipeline express typed dependency and production. `ObservableDefinition` is a quantity definition, not a runtime event or numeric result.
