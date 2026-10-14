# ILAU Orientation Instruments — Navigator Evidence Binder

Status: `INTERNAL_READ_ONLY_SOURCE_BOUND_LENS / NOT PUBLIC`

This package binds one curated Navigator lens to the existing
`ILAU_FIELD_LAB_NEON_NBAND_INTAKE_2026-09-04` documentary intake. The Human
Owner extended the original three-entry lens on 2026-10-10 to the nineteen
source HTMLs represented in the supplied visual series.

## Included HTML instruments

- `Hook · Mirror · Rope` — primary carrier/aperture/continued-trace view;
- `Orientation Machine`, `ILAU × Cartography`, `OEIS Relation Machine`;
- `Seam Reconstruction Gate`, `KHIPPU`, `Return / Residual`;
- the four music/register views and the `40 · 41 · 42` coordinate;
- `Crown · Seam · Root`, `Knot + Rope Around Body`, state space and return seam;
- residual code, neon/cartography, BPS–MS cover and `From Gap to Return`.

The nineteen selected files in `INSTRUMENTS/` are byte-preserved copies of the
corresponding inventoried source HTMLs. Their byte counts and SHA-256 hashes
are checked against the binder so the Navigator route does not depend on an
external Desktop path. This does not admit the remaining nine HTML instruments
from the 28-HTML source family.

The owner-provided reading of the first visual as two cavities and a central
cyan-violet flame is retained as an interpretive alias. It does not rename the
source geometry or promote a physical mechanism claim.

## Controls

- [`ILAU_ORIENTATION_INSTRUMENTS_BINDER_V1_2026-10-09.json`](ILAU_ORIENTATION_INSTRUMENTS_BINDER_V1_2026-10-09.json)
- [`NAVIGATOR_INTERNAL_LENS_DECISION_2026-10-09.md`](NAVIGATOR_INTERNAL_LENS_DECISION_2026-10-09.md)
- [`validate_ilau_orientation_binder.mjs`](validate_ilau_orientation_binder.mjs)
- [`build_ilau_orientation_data.mjs`](build_ilau_orientation_data.mjs)

Run from this directory:

```text
node validate_ilau_orientation_binder.mjs
node build_ilau_orientation_data.mjs
```

## Claim ceiling

The package provides internal documentary orientation only. It does not create
a new Functional Family, promote the wider source corpus, establish a shared
mechanism or authorize publication.
