# View Source Classification

## Required source tag

Every view must declare one of:

| Source kind | Required references | Examples in this package |
|---|---|---|
| `EmbeddingSource` | embedding ID and representation rule | Case A graph drawing |
| `MeasurementSource` | measurement value IDs and readout rule | Case B speed/rpm display; Case C ratio display |
| `CompositeSource` | embedding IDs, measurement IDs and composition rule | dashboard overlay; calendar mnemonic with registered values |

`SAME_VIEW_IMPLIES_SAME_SOURCE=NO`

`SAME_VIEW_DOES_NOT_IMPLY_SAME_SOURCE_TYPE=YES`

Two renderings may be pixel-identical while referring to different sources. Conversely, one source may generate many views through unit conversion, rounding, projection, crop, styling or mnemonic layout.

## Non-authoritative historical mapping note

This is classification guidance, not a fifth case:

- radial plot: `View`, with source type still required;
- polar wheel: `EmbeddingSource` or `CompositeSource` view depending on data overlays;
- angle label: `AngleMeasurement` only with embedding, metric and provenance;
- color band: `Readout` or view styling;
- highlighted nodes: selection readout/view;
- spiral: parameterized embedding family only if a generator rule exists.

Q°, Iota, Yugo, Nautilus, Leviathan, Archy, prime rhythm, pinkies, `77`, `2/7` and `4/8` acquire no meaning from appearance or naming.
