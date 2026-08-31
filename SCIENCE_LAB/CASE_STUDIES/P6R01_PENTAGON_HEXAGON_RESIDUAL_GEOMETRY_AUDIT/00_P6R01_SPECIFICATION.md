# P6R-01 Specification

Mode: `BOUNDED_FORMAL_GEOMETRY_AUDIT`  
Status: `CLOSED_FAIL_CLOSED`

## Question

Does an explicitly defined centered fivefold/sixfold overlap possess a geometric property that survives relative phase change?

## Admission gate

The audit may proceed to overlap metrics only if both objects are reproducible as sets in the plane. In particular, the sixfold construction must specify:

- the six circle radii;
- the orbit radius of their centers;
- the initial angular phase;
- whether the region is a union, intersection, complement, arrangement, or polygon;
- whether a central circle exists and participates in the region.

## Source check

No source visual was attached or identified by path in the P6R-01 instruction. The relevant local historical demos found in NEXAH Core define five and six attractor points plus a central attractor. They do not define six congruent disks, a lens/intersection region, or a central circle:

- `EXPERIMENTAL/BUILDER_LAB/ARCHIVE_ENGINE/archived/kernel/demos/pentagon/pentagon_hexagon_interference_field_demo.py`
- `EXPERIMENTAL/BUILDER_LAB/ARCHIVE_ENGINE/archived/kernel/demos/pentagon/pentagon_hexagon_12_mode_resonance_demo.py`

The previously supplied `v56 Hexa Aperture Topology` visual depicts a six-node hexagonal graph with a central reference node and line segments. It does not uniquely define six circle regions or their radii.

## Gate result

`GEOMETRY_DEFINITION_STATUS=UNDERDEFINED`

Per the task stop rule, no overlap geometry was guessed and no phase-by-phase metric computation was executed.

