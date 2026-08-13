# Master Visual versioning rule

## Classification

```text
MASTER_ECOSYSTEM_VISUAL = DERIVED_ARCHITECTURE_ARTIFACT
VISUAL_AUTHORITY = NONE
```

The visual summarizes controlling Markdown/decision sources. It cannot adopt,
revise, reconcile or override them. When image and Markdown disagree, the
controlling Markdown/decision record wins and the visual enters review.

## Required embedded metadata

Every Master Visual release must carry, in the image footer, sidecar or both:

```text
ARCHITECTURE_BASELINE = <ledger baseline ID/version>
SOURCE_DOCUMENTS = <controlling source IDs or manifest URI>
SOURCE_HASHES = <full hashes or immutable manifest reference>
GENERATED_DATE = <ISO-8601 timestamp>
VISUAL_VERSION = <MAJOR.MINOR.PATCH>
STATUS = <CURRENT | REVIEW_REQUIRED | HISTORICAL | SUPERSEDED>
DERIVATION_CLASS = DERIVED_ARCHITECTURE_ARTIFACT
```

The sidecar/manifest is mandatory when all full hashes do not fit visibly.

## Version semantics

- **MAJOR:** adopted authority partition, component status or boundary meaning
  changes.
- **MINOR:** adopted component/relation/status is added or removed without
  changing the authority grammar.
- **PATCH:** typo, layout, accessibility or rendering correction with identical
  architecture meaning and source baseline.

## Refresh and staleness rule

Compare the visual's source manifest with every `CURRENT` or adopted ledger row
that it represents.

```text
if represented_source_hash_changed
or new_adopted_architecture_row_affects_visual
or visual_contains_status_contradiction:
    VISUAL_STATUS = REVIEW_REQUIRED
```

Do not silently edit or replace an old visual. Preserve the prior artifact as
`HISTORICAL` or `SUPERSEDED`, issue a new version, and record its hash and
baseline in the ledger.

Research closures with `NO_ARCHITECTURE_IMPACT` and unadopted candidates do not
force a visual refresh.

## Current visual baseline to use when authorized

- ORION Master Architecture / ADR-0009;
- Certified Core STOP `at_slice_iv_certified`;
- Extension Profiles `NONE`;
- Science Lab as external Research authority;
- Interface V1 `MEMBRANE_V1_APPROVED_NOT_IMPLEMENTED`;
- LYRA inactive/outside certified V1;
- LUCY Phase 4B freeze: architecture-level Human Reflection Boundary,
  `PRE_REFLECTION` and `POST_REFLECTION`, current implementation `NONE`;
- Experience/NEXAHEDRON presentation/encounter/bounded-session authority;
- Human meaning/reflection/decision/consent/STOP authority;
- NEXAH/OLS/Kernel, Library and Living Atlas boundaries from their controlling
  sources.

Generation remains outside this task. On generation, EASL-009/UQ-002 must be
updated with artifact path, visual version, hash, baseline and verification.

