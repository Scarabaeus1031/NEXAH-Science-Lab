# Status and Negative Results

## Edge states

| State | Entry condition |
|---|---|
| `VERIFIED` | operator/definition and claimed outputs have verified technical evidence; required provenance known |
| `PARTIALLY_VERIFIED` | some operator/output claims verified but provenance, scope, or reproduction is incomplete |
| `CONDITIONAL` | coherent edge depends on named unmet conditions |
| `CONCEPTUAL` | proposed relation without technical execution evidence |
| `FAILED` | frozen evidence contradicts a required edge claim |
| `RETIRED` | historical edge/interpretation must not be current evidence |
| `UNKNOWN` | evidence insufficient even for a bounded claim |

Documentation alone can move `UNKNOWN` to a more explicit `UNKNOWN`, never to `VERIFIED`. Upgrades require new or newly located technical evidence. Downgrades occur when provenance fails, reproduction fails, or contradictory evidence is verified. `FAILED` and `RETIRED` retain all previous claims and evidence.

Negative results contain stable ID, original claim, disposition (`FALSIFIED`, `NOT_REPLICATED`, `REDUCED_TO_PRIOR_ART`, `PROVENANCE_FAILURE`, `UNSUPPORTED_INTERPRETATION`), evidence IDs, date, and reopening condition. They attach to an edge or a declared set of related edge IDs; history is not deleted.

