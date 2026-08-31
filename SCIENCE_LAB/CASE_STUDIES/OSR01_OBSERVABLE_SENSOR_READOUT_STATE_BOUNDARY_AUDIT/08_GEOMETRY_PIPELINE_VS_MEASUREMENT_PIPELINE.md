# Geometry Pipeline versus Measurement Pipeline

## Pipeline A — geometric representation

```text
Graph / Relation -> Embedding -> Metric Geometry -> View
```

This is the frozen AREV-01/GARC-01 branch. It separates abstract relations, coordinate realization, metric properties and observation.

## Pipeline B — measurement representation

```text
System State
  -> Observation Map + Observable Definition
  -> Measurement Event
  -> Measurement Value
  -> Readout
  -> View
```

The branches can converge at `View`, whose source-kind preserves whether it consumes an embedding, measurements or both. They are not identical: an embedding is not a measurement, and a measurement-derived display need not encode a geometric graph.

EMP-02's chain from state through projection and appearance to measurement and reconstruction is compatible with this split. MJTR-01 likewise keeps rule, generated object, observation and reconstruction distinct.

`GEOMETRY_PIPELINE_RECOVERED=YES_UNCHANGED`

`MEASUREMENT_PIPELINE_RECOVERED=YES`

`PIPELINES_CAN_CONVERGE_AT_VIEW=YES_WITH_TYPED_SOURCE`

`VIEW_EQUALS_EMBEDDING=NO`

`VIEW_EQUALS_MEASUREMENT=NO`
