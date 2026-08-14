# Release and DOI readiness

## Current state

`DOI_RELEASE_PREPARATION_JUSTIFIED = YES`

Preparation is justified because a bounded, integrity-checked object can be
defined. Deposit is not yet justified.

| Release element | Present | Required action before release |
| --- | --- | --- |
| repository snapshot | no stable tracked candidate bundle | create owner-approved immutable subset |
| version/tag | no | create only after final artifact audit |
| DOI | no | reserve/mint only after metadata and files are final |
| `CITATION.cff` | no | add title, authors, version, date, repository and license |
| license | root Apache-2.0 | confirm applicability to code, reports and data; state it explicitly |
| authors/contributors | no | resolve authorship and CRediT-style contributions |
| release manifest | per-study only | add one bundle manifest and source dependency map |
| environment | versions in replay notes | add installable lock/specification |
| data/code availability | no unified statement | identify every included artifact and exclusion |
| reproducibility instructions | dispersed | one clean-room replay/read guide |
| claims/limitations | present but dispersed | freeze one authoritative table |

Zenodo is the best-fit archival mechanism after preparation: its records bind
metadata, files and a DOI, and published files are immutable while new content
uses a new version record ([Zenodo record lifecycle](https://help.zenodo.org/docs/deposit/about-records/)).
OSF Preprints is suitable only after a coherent technical-note file exists; it
supports DOI-bearing versions and linked supplements ([OSF guidance](https://help.osf.io/article/376-preprints-home-page)).

No release, tag, DOI reservation or upload was performed.

