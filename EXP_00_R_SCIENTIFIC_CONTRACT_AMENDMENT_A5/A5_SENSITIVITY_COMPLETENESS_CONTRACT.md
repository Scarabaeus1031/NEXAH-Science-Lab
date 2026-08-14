# A5 Sensitivity Completeness Contract

## Exact ordered registry

The 12 one-factor variants are, in order: action amplitude `0.25,1.0`; TRAJECTORY neighbors `15,50`; LEARNED_FIELD neighbors `60,160`; horizon `0.5,1.5`; training seeds `5000–5014,5015–5029`; support quantile `0.95,0.995`. Each variant changes exactly one frozen configuration leaf from primary. The training halves are inclusive and use no alternate split.

Every variant artifact must contain: `ordinal`, `variant_id`, exact changed path, primary and sensitivity values, a canonical hash of all unchanged leaves, variant config hash, both carriers, finite standardized coherence coefficient and held-out log-loss gain per carrier, T/F out-of-support fractions, joint-support fraction, contributing-seed count and per-seed row counts, train/test seed registries, primary/A5/V1 bindings, population hashes, environment hash, completion status, and no-rescue flag.

`ALL_12_SENSITIVITIES_COMPLETE` is true iff the artifact set equals the exact 12-member registry (no missing/extra/duplicate identity), ordinals are `0..11`, every required field is present and typed, every numeric output is finite, both carriers occur exactly once per variant, each config differs at exactly the declared leaf, unchanged-leaf hashes match primary, all provenance bindings match, and every completion status is `COMPLETE`.

Only the two amplitude variants enter P5: coefficient `>0` and gain `>0` for both carriers at both amplitudes. Bootstrap interval exclusion remains primary-amplitude-only. The other ten variants are mandatory report-only. No sensitivity can rescue P1–P4 or primary validity; any incomplete sensitivity makes the experiment invalid.

