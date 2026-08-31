# Combined Type Grammar

## Shared source

`StateRef` identifies the registered source state or source record. It is not a view of that state.

## Geometry branch

```text
StateRef
  -> structural relation / Graph
  -> Embedding
  -> Frame + Metric
  -> GeometricValue / AngleMeasurement
  -> View(source=EmbeddingSource)
```

## Measurement branch

```text
StateRef
  -> ObservationMap + ObservableDefinition
  -> MeasurementEvent
  -> MeasurementValue + Unit + Uncertainty/Resolution
  -> Readout
  -> View(source=MeasurementSource)
```

## Convergence

A `CompositeSource` view may reference both an embedding-derived representation and measurement values. Convergence at `View` does not merge the upstream types.

## Core rules

```text
same view != same source type
same displayed number != same state
same displayed number != same observable
same displayed number != same measurement
same displayed number != same geometric role
```

No new primitive is needed. `CarrierSet`, `PartitionRule`, `SelectedSubset`, `CalendarRecord` and `MnemonicEmbedding` are domain records composed through the existing structural, measurement and view interfaces.
