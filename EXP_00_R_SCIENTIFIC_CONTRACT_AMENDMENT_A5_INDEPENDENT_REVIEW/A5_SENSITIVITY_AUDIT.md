# A5 Sensitivity Audit

The independently recovered registry has exactly 12 ordered variants: amplitudes `.25,1.0`; trajectory neighbors `15,50`; field neighbors `60,160`; horizons `.5,1.5`; training halves `5000–5014,5015–5029`; support quantiles `.95,.995`. A5 reproduces these values and correctly limits P5 to both amplitudes, both carriers, coefficient `>0` and gain `>0`; interval exclusion remains primary-amplitude-only. Other sensitivities are mandatory report-only and cannot rescue primary science.

The completeness encoding is nevertheless nonexecutable:

- registry entries use `path`, `primary`, `value`, while output artifacts require `changed_factor_path`, `primary_value`, `sensitivity_value`; no binding maps them;
- canonical config-leaf enumeration and serialization for `unchanged_leaf_hash` are absent;
- `variant_config_hash`, population hashes, and expected environment/source-manifest hashes lack canonical constructors;
- `ALL_12_SENSITIVITIES_COMPLETE` is a conjunction of condition strings, not evaluated raw records;
- the validator accepts a changed trajectory-neighbor path/value while identity, count, ordinals, and IDs remain unchanged.

Missing/duplicate records are prohibited in prose, but the supplied validator never consumes sensitivity artifacts. Two implementers can produce different completeness truth values. **A4-R23: FAIL (Class B).**

