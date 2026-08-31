# View Source Schema

`ViewSource` is a closed discriminated union:

```text
GeometrySource    { source_kind=GEOMETRY, embedding_ref }
MeasurementSource { source_kind=MEASUREMENT, readout_refs[1..] }
CompositeSource   { source_kind=COMPOSITE,
                    embedding_refs[1..], readout_refs[1..],
                    composition_rule_ref }
```

Every view also requires a render rule, declared losses and provenance. A composite source preserves both lineages and does not merge their types. Equal view bytes do not establish equal sources; one source may produce many views.

Historical labels are allowed only in optional top-level annotations. They have evidential weight zero and never alter the discriminator.

`VIEW_SOURCE_UNION_DEFINED=YES`

`VIEW_WITHOUT_TYPED_SOURCE=SCHEMA_INVALID`

