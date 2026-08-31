# Time / Trajectory Control

A trajectory requires ordered state/point references, compatible frame/coordinates, explicit timestamps or parameter order, interpolation status, and provenance.

```text
State(t0), State(t1), State(t2)
  -- declared temporal/parameter ordering + representation -->
TrajectoryRecord
```

The arrow is a **documentary derivation**, not identity. One state is not a trajectory. Two points are not complete history. Same endpoint does not imply same path; same geometric path does not imply same timing; same timed coordinates do not imply same cause or event history.

Spatial ordering alone supplies no time. A list becomes trajectory evidence only through an explicit time/parameter basis. History remains an ordered event/state lineage broader than the trajectory representation.
