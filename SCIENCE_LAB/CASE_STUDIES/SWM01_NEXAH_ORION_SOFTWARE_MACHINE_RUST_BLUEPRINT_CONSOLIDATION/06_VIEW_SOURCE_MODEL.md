# View Source Model

The existing closed union is sufficient:

```text
ViewSource =
    GeometrySource {
      embedding_ref,
      representation_rule_ref
    }
  | MeasurementSource {
      measurement_value_refs,
      readout_rule_ref
    }
  | CompositeSource {
      embedding_refs,
      measurement_value_refs,
      composition_rule_ref
    }
```

Every `View` also carries a view ID, rule/version, provenance, declared losses and output identity. Pixel equality does not establish source equality. A composite view keeps both source lineages; it does not merge geometry and measurement types.

`VIEW_SOURCE_SUM_TYPE_SUFFICIENT=YES`

`SAME_VIEW_EQUALS_SAME_SOURCE=NO`

`E3_GDEGREE_D_IOTA_YUGO_QDEGREE_RNJ_NRJ_NRG_CANONICALIZED=NO`

