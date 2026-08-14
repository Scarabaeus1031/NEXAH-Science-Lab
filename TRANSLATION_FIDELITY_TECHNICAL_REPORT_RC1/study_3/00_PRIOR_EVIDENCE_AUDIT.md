# Prior Evidence Audit

Disposition: `RESEARCH / NOT_ADOPTED`.

The prior Translation Study and Translation Invariant Replication were read as
prior evidence only. Their implementations, fixtures and outputs are not
imported by this experiment.

## Integrity checks

- Translation Study protocol bundle: `f8080f2e96f1d7f17a230bf26ce0a24ceacfb0c3a9c03431a693d74cc7993973`.
- Translation Study runner: `f436a19aa3122ba448b2c0df04a8b676924ed70de64b50f0d753b07eebfe2e44`.
- Translation Study result/replay: `69aa9f65cd90589722274093758a899da2d0a182093ae5dad1a9cababd092055`.
- Replication protocol bundle: `98c7856cb99d428492168a1bc0a4ab31f075b5b3504a92c8f4dfafa9635f4eb8`.
- Replication runner: `407513c6d00bc7f47e4b18d4481a5819240f884c577254c2d163d11a52412784`.
- Replication result/replay: `589c2195bc2388059c8ba449a02be51a63851c713021caa19dbf5017d9ee3af1`.
- All files named by both manifests matched. All 576 replication raw cells
  were parsed, were `OK`, and independently reconstructed aggregate counts
  matched `certificate_summary`.
- Canonical NEXAH sources still matched the recorded hashes, but this
  experiment does not import or execute them.

## Defect quarantine

`replication_results.json::family_outcomes.*.structural` is defective because
the frozen runner populated it from a global per-configuration accumulator.
No inference here uses that field. Prior family-specific statements were
checked from raw `records`; the aggregate `certificate_summary` is unaffected.

## Evidence classes

- Mathematical/definitional: graph relabeling preserves label-free topology;
  exact global centering and scalar rescaling are removed by the new decoder's
  declared preprocessing; certificate equality with itself is tautological.
- Software checks: manifest verification, frozen hash verification and
  byte-identical replay establish local deterministic execution only.
- Prior empirical result: v0.7 support was HIGH robust/LOW discriminative;
  weighted graphs were LOW robust/HIGH discriminative.
- Information loss: SCC/WCC/self-loop summaries were saturated; support erased
  counts, timing and multiplicity; clustering erased within-state geometry.
- v0.7-specific: per-feature normalization, overlapping windows, KMeans,
  local anonymous labels and the reported rates.

Nothing in the prior work establishes a universal, physical, predictive or
NEXAH-specific law.
