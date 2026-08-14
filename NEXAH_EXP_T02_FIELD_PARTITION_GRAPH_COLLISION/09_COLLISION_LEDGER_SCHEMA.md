# Collision Ledger Schema

Execution must write `results/COLLISION_LEDGER.json` as an array of records with
these required fields:

```json
{
  "source_pair_id": "CF_B_GEOMETRY_GRAPH_COLLISION",
  "counterfactual_class": "GEOMETRY_CHANGE_COARSE_GRAPH_PRESERVED",
  "certificate_id": "C5_BINARY_ADJACENCY",
  "expected_distinction": "metric geometry and partition differ",
  "expected_certificate_relation": "PRESERVE/COLLISION",
  "observed_certificate_relation": "EQUAL",
  "collision": true,
  "source_correspondence": "COMPLETE",
  "first_loss_stage": "R4_BINARY_GRAPH",
  "baseline_detections": {},
  "notes": ""
}
```

Permitted observed relations: `EQUAL`, `DIFFERENT`, `NOT_APPLICABLE`,
`PRECONDITION_FAILED`. Collision is true only under the prospective definition,
never from visual similarity. Records are sorted by pair ID then certificate ID.

The ledger also writes, separately, every noncollision certificate comparison;
there is no positive-only filtering.

