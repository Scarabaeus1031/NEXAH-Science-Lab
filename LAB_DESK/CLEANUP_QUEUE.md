# Science Lab Cleanup Queue

Queue owner: **Science Lab Research Director**

This queue governs repository disposition only. It does not change a scientific
status or authorize research execution.

| Order | Work item | Initial disposition | Decision required |
| --- | --- | --- | --- |
| 1 | `NEXAH_EARLY_WARNING_HYPOTHESIS_VALIDATION` | Logical split complete; deterministic local artifact built and stream-verified | Select durable private object storage and authorize upload; preserve the inconclusive Level-1C result exactly |
| 2 | EXP-00-R package family | Current authority bundle registered in three bounded lineages; 32 historical roots remain excluded and hash-recorded | Preserve historical residuals; recover exact Python 3.12.13 only under a separate operational recheck authorization |
| 3 | Ten terminal ORION execution packages | Core/data split and integrity review complete; exact 151-file core awaits authorization | Approve or reject one bounded historical execution-evidence commit; keep 402 data files external |
| 4 | Terminal NEXAH candidates | Reconciled: six embedded in RC1, T02-v1 historical, non-science records routed; EXP-T01 remains separate | Approve/reject the exact 27-file EXP-T01 core; decide later whether legacy audit accompanies T01/T02 as provenance |
| 5 | Documented but non-terminal packages | Review required | Decide whether each is active input, historical provenance or superseded working material |
| 6 | Packages without endpoint markers | Manual inspection | Identify owner, purpose and explicit disposition; do not infer status from filenames |
| 7 | Outreach images and strategy drafts in the Lab | Route out of scientific working set | Confirm canonical Publishing/Outreach copy before any move or deletion |

## Research Director recommendation

Start with `NEXAH_EARLY_WARNING_HYPOTHESIS_VALIDATION`, but perform a logical
split before any physical move:

1. Preserve a **small reproducibility core in Git**: preregistration and freeze
   records, source code, configuration, manifests, final reports and the
   machine-readable Level-1C outcome.
2. Preserve the approximately **2.6 GiB generated trajectory corpus as one
   immutable data artifact outside normal Git history**. The storage location
   must support private access initially, durable download and checksum
   verification.
3. Connect both layers with a versioned manifest containing every relative
   path, byte size and SHA-256 digest. Record the data-artifact URI only after
   the owner has selected and tested the durable storage location.
4. Keep the scientific disposition exactly
   `LEVEL1C_COMPLETE_INCONCLUSIVE`; the split is repository maintenance, not a
   new analysis or reinterpretation.
5. Verify reconstruction from a clean checkout plus the external data artifact
   before considering any local duplicate removable.

Do **not** use ordinary Git or an unbounded Git-LFS upload for the trajectory
corpus by default. A content-addressed compressed dataset in private object
storage, with its manifest and retrieval instructions tracked in this
repository, is the recommended target architecture.

### Recommended decision sequence

`inventory frozen` → `core allowlist reviewed` → `data artifact built` →
`private upload verified` → `clean-room retrieval verified` →
`local-copy disposition decided`

Completed locally: `inventory frozen` → `core allowlist reviewed` →
`data artifact built`. The archive passed member-by-member verification and an
identical second build. Active gate: `SELECT_PRIVATE_DURABLE_OBJECT_STORAGE_AND_AUTHORIZE_UPLOAD`.

The current authorization stops before `private upload verified`. Selecting a
storage provider, uploading data or deleting a local copy requires a separate
owner decision.

## ORION execution-evidence checkpoint

The ten completed ORION execution packages have also been reduced to an exact
repository decision:

- **151** core files (**466.5 KiB**) preserve reports, locks, manifests, source,
  configuration and tests;
- **402** primary/replay data files (**92.2 MiB**) are excluded from Git;
- the data files are preserved in one deterministic, member-verified local
  artifact with SHA-256
  `3793f5a96407d64f9ef3592f0d3dce625908fb39ec8e94489da7dd459fa68579`;
- **327 / 327** file bindings in seven artifact manifests and three additional
  implementation-freeze manifests match;
- positive, negative, invalid and uninformative outcomes remain exactly
  distinguished in the core review.

Active gate:
`AUTHORIZE_BOUNDED_ORION_EXECUTION_CORE_COMMIT_AND_PUSH_OR_PRESERVE_LOCAL`.
No canonical NEXAH-ORION integration, architecture adoption, upload or deletion
is implied.

## Stop conditions

Stop and request owner direction if a step would:

- delete the only known copy;
- publish raw or sensitive data;
- alter a frozen hash or registered object;
- reinterpret a negative, null or inconclusive result;
- select between conflicting scientific authorities;
- stage more than the explicitly reviewed package endpoint set.
