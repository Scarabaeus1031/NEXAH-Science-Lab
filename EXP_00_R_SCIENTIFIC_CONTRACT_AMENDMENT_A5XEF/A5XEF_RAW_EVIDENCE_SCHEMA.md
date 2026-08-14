# A5XEF Generic Raw-Evidence Schema

The controlling schema is `A5XEF_GENERIC_RAW_SCHEMA.json`. Identity is namespace-neutral: an experiment supplies an ordered 30-seed registry, two frozen splits and relational row/state IDs. No `SYNTH_` prefix is required.

Each raw row supplies state/covariate input, T/F five-action score vectors, T/F support distances and the shared five-action binary outcome table. Ranks, proposals, best scores, margins, support flags, joint populations, coherence, carrier labels and model features are derived; no producer eligibility Boolean exists.

The bundle also contains the canonical model specification, primary configuration, deterministic null descriptors, bootstrap registry, N5 original/transformed objects, twelve variant configurations with row-level representation outputs, and exact raw provenance. Future registered V3 must instantiate this interface after authorization; A5XEF tests it only with generated synthetic namespaces.
