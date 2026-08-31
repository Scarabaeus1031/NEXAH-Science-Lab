# Trace / “Brush Stroke” Control

`Pinselstrich / brush stroke` is quarantined as expression. The neutral record is
`Trace`.

For OTC-01, a trace is a provenance-bearing representation produced by an
observation event and channel. A modelling placeholder is:

```text
trace = f(source, path, medium, boundaries,
          instrument, sensor, sampling, processing)
```

This is dependency notation, not a universal physical equation. It says only
that a detected trace may contain effects of both the source and the traversed
channel.

## Inference rule

```text
trace -> compatible source/channel explanations
trace -/-> unique source state
trace -/-> complete path reconstruction
```

The trace “remembers the path” only in the bounded sense that path-dependent
transformations may survive in it. Loss, nonlinearity, integration and many-to-one
mapping can prevent unique inversion. Source and channel claims therefore require
additional constraints, calibration or independent observations.
