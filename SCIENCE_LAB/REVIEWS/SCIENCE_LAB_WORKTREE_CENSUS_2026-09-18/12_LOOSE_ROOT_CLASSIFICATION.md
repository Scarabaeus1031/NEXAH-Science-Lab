# Loose Root Classification — Pass 2 / Step 4

Status: `READ_ONLY_CLASSIFICATION / NO MOVE OR DELETE EXECUTED`

## Scope

This pass covers the `20` untracked files directly in the Science Lab
repository root. Tracked root files, root directories, ignored `.DS_Store`
metadata and the separately classified `tmp` tree are outside this decision.

## Result

| Disposition family | Files | Reading |
| --- | ---: | --- |
| Mission Control Outreach source material | 10 | bounded strategy, audience, routing and scientific-interface sources already used by the current Outreach area |
| Builder / Engineering source material | 1 | contributor-onramp review already named by the current Outreach area |
| Science Lab historical review/archive | 5 | session closure, repository-maintenance lineage and translation-audit preliminary source |
| Remove after exact verification | 4 | one sealed script working copy and three exact visual duplicates |
| Private custody | 0 | no private-custody object identified in this 20-file set |

## A. Mission Control Outreach source set

Ten files belong together as the dated source layer behind Mission Control's
current Outreach and Relationships area:

- 90-day plan;
- audience map;
- existing-outreach consultation;
- focus-and-goals visual;
- lighthouse map;
- outreach architecture;
- outreach reality check;
- machine-readable outreach strategy;
- scientific interface map;
- one-page outreach strategy source.

Mission Control's `OUTREACH_CURRENT_STATE.md` already links directly back to
most of these Science Lab root paths. Leaving them untracked or moving them
without rebinding would create broken current pointers.

Recommended destination:

`Mission Control / AREAS/OUTREACH_AND_RELATIONSHIPS/SOURCE_MATERIAL/SCIENCE_LAB_2026-08_TO_09/`

The move must be byte-preserving and accompanied by:

1. a move manifest containing the current SHA-256 values;
2. replacement of the cross-repository links in `OUTREACH_CURRENT_STATE.md`;
3. a statement that these are source inputs, not the current control surface;
4. retention of their original dates and evidence-status language.

The focus-and-goals visual is useful but reflects an August strategic frame.
It should be labelled historical/source rather than silently promoted to the
current Mission Control dashboard.

## B. Builder / Engineering source

`NEXAH_BUILDER_ONRAMP_REVIEW.md` is a bounded contributor-entry assessment.
It belongs beside Outreach source material but should carry the role
`BUILDER_ENGINEERING_SOURCE`, because it informs the Builder Atlas and
contributor route rather than scientific result authority.

Recommended destination:

`Mission Control / AREAS/OUTREACH_AND_RELATIONSHIPS/SOURCE_MATERIAL/SCIENCE_LAB_2026-08_TO_09/`

## C. Science Lab historical sources

### Session closure

`LAB_SESSION_CLOSURE_2026-08.md` is a historical stop record. It accurately
distinguishes architecture closure from scientific execution and should be
kept, but it is not a current root entrypoint.

Recommended destination:

`SCIENCE_LAB/REVIEWS/HISTORICAL_SESSION_CLOSURES/`

### Repository-maintenance lineage

The Pass 2, Pass 3 and currentness-freeze reports form one dated lineage with
the already tracked Pass 1 report. They should be grouped rather than left as
scattered root files.

Recommended destination for the complete four-report family in a later
tracked-file move:

`SCIENCE_LAB/REVIEWS/ECOSYSTEM_REPOSITORY_MAINTENANCE_2026-08-13/`

This classification does not authorize moving tracked Pass 1 in the present
untracked-file change.

### Translation-audit preliminary source

`NEXAH_TRANSLATION_AUDIT_REPORT_01_PRELIMINARY_FINDING.md` is source material
for the existing `NEXAH_TRANSLATION_AUDIT_REPORT_01/` package. It should be
retained inside that package under a clearly named source/preliminary role,
not treated as a second root-level finding.

Recommended destination:

`NEXAH_TRANSLATION_AUDIT_REPORT_01/SOURCE_PRELIMINARY/`

## D. Exact working copies and duplicates

Four root files do not require another archive copy:

1. `.codex_currentness_closure_2026_09_10.py` is byte-identical to the sealed
   Mission Control review copy at `scripts/build_closure.py`.
2. `NEXAH - SCIENCE & FRAMEWORK FREEZE.png` is byte-identical to the tracked,
   normalized `NEXAH_SCIENCE_FRAMEWORK_FREEZE_2026-08-30.png`.
3. `NEXAH_ONE_PAGE_OUTREACH_STRATEGY.png` is byte-identical to the copy already
   held by Mission Control's Outreach area.
4. `NEXAH_OUTREACH_FOCUS_ASSESSMENT.png` is byte-identical to the copy already
   held by Mission Control's Outreach area.

Recommended disposition: `REMOVE_LOCAL_DUPLICATE_AFTER_MANIFEST_CHECK`.

Removal remains a separate destructive step and requires an exact path
allowlist. Recovery is available from the named tracked or sealed counterpart.

## What this resolves

- no untracked root file remains semantically unclassified;
- current Outreach pointers are protected from accidental breakage;
- historical Science Lab records gain named homes;
- duplicate binaries and the sealed helper working copy need not create a
  second authority surface;
- the repository root can eventually return to entrypoints and intentionally
  tracked control documents only.

## Next action

Prepare one exact move/remove allowlist with four execution groups:

1. Mission Control source-material move plus link rebinding;
2. Science Lab archive/review moves;
3. translation-audit source move;
4. verified duplicate removal.

The groups should be independently reversible and committed in their owning
repositories rather than as one cross-repository mixed commit.
