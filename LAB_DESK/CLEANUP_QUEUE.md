# Science Lab Cleanup Queue

Queue owner: **Science Lab Research Director**

This queue governs repository disposition only. It does not change a scientific
status or authorize research execution.

| Order | Work item | Initial disposition | Decision required |
| --- | --- | --- | --- |
| 1 | `NEXAH_EARLY_WARNING_HYPOTHESIS_VALIDATION` | Split small reproducibility/report core from multi-gigabyte generated trajectories | Choose durable external/private data-artifact home; preserve the inconclusive Level-1C result exactly |
| 2 | EXP-00-R package family | Historical provenance with a small set of current endpoints already named in Master Status | Register only bounded endpoint/source packages; never mass-commit the full lineage |
| 3 | Terminally marked NEXAH/ORION studies | Candidate endpoint consolidation | Compare each candidate to current Master Status before any commit |
| 4 | Documented but non-terminal packages | Review required | Decide whether each is active input, historical provenance or superseded working material |
| 5 | Packages without endpoint markers | Manual inspection | Identify owner, purpose and explicit disposition; do not infer status from filenames |
| 6 | Outreach images and strategy drafts in the Lab | Route out of scientific working set | Confirm canonical Publishing/Outreach copy before any move or deletion |

## Stop conditions

Stop and request owner direction if a step would:

- delete the only known copy;
- publish raw or sensitive data;
- alter a frozen hash or registered object;
- reinterpret a negative, null or inconclusive result;
- select between conflicting scientific authorities;
- stage more than the explicitly reviewed package endpoint set.
