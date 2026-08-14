# External-reader and NEXAH-removal tests

## Thought experiment

A competent researcher receives only the proposed technical report, frozen
protocols, runners, result JSON, manifests and replay records. All NEXAH names,
symbolic vocabulary, visual analogies, ORION, T02 and EXP-00-R are removed.

They can understand:

- the finite state-sequence/transition-graph problem;
- the representation transformations and decoder configurations;
- robustness, discrimination and collision measurements;
- the failed exact hierarchy and implementation dependence;
- the bounded conclusion and prohibited claims.

They cannot yet efficiently reconstruct:

- which dispersed directories form the authoritative release;
- authorship, affiliations, funding/conflicts and reuse rights for each object;
- one exact environment installation;
- one top-level replay command and expected hashes;
- a neutral mapping from Study 1/2/3 internal names to the report;
- the complete release-level data/code availability statement.

## Decisions

`NEXAH_REMOVAL_TEST = PASS`

The scientific content survives renaming as a collision-aware evaluation of
translated transition summaries.

`EXTERNAL_READER_TEST = PARTIAL`

The problem, evidence and limitations survive, but current packaging forces the
reader to reconstruct internal history. The failure is documentation and
artifact assembly, not missing interpretation of symbolic language.

The standalone Study-3 case also passes NEXAH removal but remains too narrow.
The architecture and research-methodology candidates pass only partially
because their contribution/effectiveness depends on internal history rather
than comparative evidence.

