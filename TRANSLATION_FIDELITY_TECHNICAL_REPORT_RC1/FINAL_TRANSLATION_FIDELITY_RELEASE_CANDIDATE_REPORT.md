# Final Translation Fidelity Release Candidate Report

> Historical RC1 assembly report. The later bounded release-engineering outcome
> and controlling gate decision are recorded in `FINAL_OWNER_PUBLICATION_GATE.md`.

## Outcome

The bounded, neutral RC1 bundle has been assembled without changing any frozen
scientific file and without running an experiment or new scientific analysis.
Its technical narrative, exact source copies, three descriptive figures, five
tables, prior-art boundary, negative results, allowlist, provenance, and hashes
are coherent.

The candidate is not yet ready for the separate owner publication gate because
three bounded release defects remain: authorship/citation identity is not
confirmed, license scope for the untracked research artifacts is not confirmed,
and Studies 1/2 are not clean-room portable because frozen runners contain a
hard-coded local path to a non-bundled historical dependency checkout. Study 3
also lacks a complete recorded environment lock. None of these defects may be
silently repaired by altering frozen runners or results.

## Repository disposition

- Pre-assembly Git SHA: `c0fb1774e0c4a9e398fa33420f74e6e27dcd9981`
- Post-assembly Git SHA: `c0fb1774e0c4a9e398fa33420f74e6e27dcd9981`
- Branch: `codex/z3885-verification`
- Commit created: NO
- Push performed: NO
- Release/tag/DOI/deposit/publication/outreach: NO
- Existing tracked and unrelated untracked files modified: NO

## Verification

- The release allowlist is explicit and contains only the six authorized source
  roots plus the repository-root license copy.
- Every copied source artifact is byte-identical to its allowlisted source.
- Primary frozen result identities are Study 1 `69aa9f65…2055`, Study 2
  `589c2195…3af1`, and Study 3 `36657449…d0d9`.
- Existing replay records report byte-identical primary/replay results for all
  three studies. No replay was rerun during this preparation.
- The neutral scientific report does not require project-specific terminology;
  historical names remain only in provenance copies and dependency paths.
- The SHA-256 bundle manifest excludes only itself, as a file cannot contain its
  own stable cryptographic digest. This conventional self-exclusion is declared
  in the manifest header.

## Owner resolutions required

1. Confirm authors, affiliations, ORCIDs, contribution roles, corresponding
   author, and final citation identity.
2. Confirm that Apache-2.0 applies to every bundle artifact and add any required
   third-party notices.
3. Authorize a separate non-scientific portability pass that supplies or
   documents the historical dependency checkout without changing frozen files,
   plus a complete environment lock and clean-room replay check.

## Machine-readable conclusion

```text
FROZEN_ARTIFACT_ALLOWLIST_DEFINED = YES
AUTHORIZED_SOURCE_ONLY = YES

STUDY_1_INCLUDED = YES
STUDY_2_INCLUDED = YES
STUDY_3_INCLUDED = YES

SCIENTIFIC_FILES_MODIFIED = NO
NEW_EXPERIMENT_RUN = NO
NEW_SCIENTIFIC_ANALYSIS_RUN = NO
NEW_METHOD_IMPLEMENTED = NO

NEUTRAL_REPORT = YES
FIGURES = YES
TABLES = YES

AUTHORS_METADATA = PARTIAL
CITATION_METADATA = PARTIAL
LICENSE_STATUS = OWNER_CONFIRMATION_REQUIRED
AVAILABILITY_METADATA = COMPLETE
ENVIRONMENT_LOCK = PARTIAL
REPLAY_INSTRUCTIONS = PARTIAL

SOURCE_HASHES_VERIFIED = YES
BUNDLE_MANIFEST = YES
SOURCE_PROVENANCE = COMPLETE
NEGATIVE_RESULTS_INCLUDED = YES
PRIOR_ART_BOUNDARY_INCLUDED = YES
PROHIBITED_CLAIMS_EXPLICIT = YES

NEXAH_REMOVAL_TEST = PASS
DRY_READER_TEST = PASS

RELEASE_CREATED = NO
DOI_CREATED = NO
ZENODO_DEPOSIT_CREATED = NO
GITHUB_RELEASE_CREATED = NO
PUBLICATION_SUBMITTED = NO
OUTREACH_STARTED = NO
COMMIT_CREATED = NO
PUSH_PERFORMED = NO

OWNER_PUBLICATION_GATE_AUTHORIZED = NO
FINAL_DECISION = RELEASE_CANDIDATE_NEEDS_BOUNDED_FIXES
NEXT_ACTION = OWNER_CONFIRM_AUTHORSHIP_LICENSE_AND_AUTHORIZE_A_NON_SCIENTIFIC_PORTABLE_REPLAY_ENVIRONMENT_PASS
```
