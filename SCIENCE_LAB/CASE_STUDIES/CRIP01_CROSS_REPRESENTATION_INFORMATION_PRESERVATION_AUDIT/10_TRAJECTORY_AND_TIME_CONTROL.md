# Trajectory and Time Control

## Recovered data object

`triad_bands_timeline.csv` contains 841 ordered rows with columns `t, comp1, comp2, comp3, blend`, from `t=0.0` through `t=42.0` in nominal increments of 0.05.

This supports a parameterized sequence of sampled points. It does not by itself establish:

- measured physical time;
- a governing differential equation;
- physical phase;
- a continuous trajectory between samples;
- the semantics of “breathing”, “band”, or “blend”.

## Representation relation

The same-stem PNG and co-located CSV make `SAME_OBJECT_CONDITIONAL` reasonable, but no generator was recovered in the bounded package. Exact CSV-to-pixel transformation, axis scaling, and styling remain `UNDERDEFINED`.

## Preservation assessment

- row order and numeric samples: source-attested in CSV;
- broad temporal ordering: plausibly represented in PNG, but not independently replayed;
- exact values: lost in PNG raster;
- interpolation: introduced by line drawing if present;
- continuous dynamics: undefined;
- history: the complete ordered record, not one point or one frame.

`POINT_DISTINCT_FROM_TRAJECTORY=YES`

`TRAJECTORY_DISTINCT_FROM_HISTORY=YES`
