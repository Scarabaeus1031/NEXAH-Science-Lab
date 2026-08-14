# A5X Sensitivity Identity and Completeness

The machine registry contains exactly the accepted 12 identities and one vocabulary: `sensitivity_id`, `changed_factor_path`, `primary_value`, `sensitivity_value`. The primary configuration is the frozen V1 JSON.

Canonical JSON is UTF-8 with sorted keys, compact comma/colon separators, no NaN. For variant `s`, deep-copy primary config and replace exactly `changed_factor_path` with `sensitivity_value`. `variant_config_digest=SHA256(canonical variant)`. Delete exactly that path from primary and compute `unchanged_config_digest=SHA256(canonical remainder)`. The supplied full variant must equal the constructed object; therefore every other leaf is identical.

PASS requires exactly 12 records, exact ID set without duplicates/extras, exact path/values, exact digests/full config, carriers `[T,F]`, finite coefficient/gain for each, typed support fields, and exact provenance bindings. Any deviation is false/invalid. Only the two amplitude IDs enter P5; all others report only and none can rescue.

