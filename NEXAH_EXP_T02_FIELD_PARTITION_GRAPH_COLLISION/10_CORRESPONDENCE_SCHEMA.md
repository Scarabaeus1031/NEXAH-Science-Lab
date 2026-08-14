# Correspondence Schema

Required trace:

```text
(row,col,x,y)
 -> same derivative cell
 -> optional critical candidate ID
 -> seed ID
 -> all partition cells carrying seed ID
 -> graph node with node_to_seed[ID]
```

Execution outputs:

- `SOURCE_INDEX.json`: row/column to physical coordinates and field hash;
- `CRITICAL_CANDIDATES.json`: full detector records including source indices;
- `PARTITION.json`: full raster of stable seed IDs;
- `GRAPH.json`: nodes, `node_to_seed`, binary edges and boundary counts;
- `CORRESPONDENCE_AUDIT.json`: one-to-one candidate/seed check, orphan IDs,
  coverage and ordering-invariance result.

Candidate→seed matching is permitted only within `1.5h` and must be bijective.
Every partition ID must refer to exactly one matched critical candidate and every
graph node to exactly one partition ID. Failure at any stage stops scientific
scoring and records the exact loss stage.

Graph isomorphism never replaces source correspondence: B5 is an additional
unlabeled baseline, while primary discrete comparisons use frozen seed IDs.
