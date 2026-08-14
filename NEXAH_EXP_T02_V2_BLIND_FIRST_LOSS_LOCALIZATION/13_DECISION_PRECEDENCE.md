# Draft Total Decision Precedence (Not Frozen)

The draft scorer was intended to apply exactly the first applicable terminal
rule, but this hierarchy is not authorized because the primary comparator design
failed before freeze:

1. `INTEGRITY_FAILURE` → `PROTOCOL_INVALID`
2. F4 ground-truth leakage → `PROTOCOL_INVALID`
3. F7 precondition failure → `PRECONDITION_FAILED`
4. F3/F6/F9 or output/schema violation → `PROTOCOL_INVALID`
5. N4 control failures >1 → `PROTOCOL_INVALID`
6. N4 E1 <0.80 or E2 >0.50 → `FIRST_LOSS_LOCALIZATION_NOT_SUPPORTED`
7. H1-A false → `BASELINES_SUFFICIENT` when F1/F10, otherwise
   `FIRST_LOSS_LOCALIZATION_SUPPORTED_NO_INCREMENTAL_VALUE`
8. H1-B false or F2/F5 true → `NEXAH_REDUNDANT`
9. F8 true → `INCONCLUSIVE`
10. H1-A and H1-B true, no prior gate →
    `INCREMENTAL_DIAGNOSTIC_VALUE_SUPPORTED_BOUNDED`

Any unexpected state maps to `INCONCLUSIVE`. Every path writes the same durable
final schema, including integrity/precondition failures. Falsifiers may coexist;
the final artifact records all triggers even though precedence selects one status.
