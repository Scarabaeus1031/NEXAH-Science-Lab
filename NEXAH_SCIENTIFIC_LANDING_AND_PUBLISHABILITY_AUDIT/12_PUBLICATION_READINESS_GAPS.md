# Publication-readiness gaps

| Gap class | Exact gap | New science? | Minimum resolution |
| --- | --- | --- | --- |
| editorial | no single neutral report; internal names dominate | no | write one concise NEXAH-removable technical report from frozen results |
| documentation | no authorship, contribution, funding/COI, availability or limitation front matter | no | add explicit scholarly metadata and statements |
| reproducibility | source folders untracked; no release-level manifest or one-command replay guide | no | assemble immutable tracked bundle; unify hashes and expected outputs |
| reproducibility | environment versions recorded but no lock | no | add tested environment/lock without changing algorithms |
| literature | broad prior art covered; exact protocol search was focused, not systematic | no for archive; possibly for journal claim | update and document protocol-level search, avoid novelty assertion |
| analysis | required figures/tables are not assembled | no | derive them mechanically from frozen JSON without retuning |
| experiment | incremental diagnostic utility lacks external evaluation | **yes** for a methods/novelty paper | do not claim utility; defer peer-reviewed methods claim |
| external validation | all replays are internal | **yes** for external-validation claim | prohibit that claim in the minimum object |
| claim | current synthesis sometimes says “ready for external replication,” not “validated method” | no | use exact allowed/prohibited claim table |
| release | no stable tag/DOI/citation identity | no | owner-authorized versioned archive after all gates pass |

## Smallest bounded preparation

1. Select only the frozen Study 1–3 artifact subset and literature audit.
2. Place it under an immutable repository-addressable version.
3. Add authorship, license scope, citation, environment, availability and
   release-level manifest metadata.
4. Produce the three figures and five tables from frozen results.
5. Conduct one independent document/replay-instruction dry read without
   generating new scientific evidence.
6. Freeze the report and artifact bundle, then perform an owner publication
   gate.

This is sufficient for a technical/archival report. A peer-reviewed methods
paper asserting incremental value still requires new external science.

