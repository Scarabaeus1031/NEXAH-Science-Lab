# Historical Dependency Provenance

- Source repository: local canonical source checkout at
  `/Users/tho2020/Documents/GitHub/NEXAH`
- Git revision: `923362e141170f06f2f0f26992136b5979047c42`
- Extraction: `git archive` of only the transitively imported source paths and
  their licensing/dependency metadata
- Scientific role: execution dependency for frozen Study-1/2 runners
- Bundle role: non-modified compatibility snapshot

Identity anchors required by both frozen runners:

| File | SHA-256 |
|---|---|
| `nexah/core.py` | `af8b831a8cb3242b12a66d1cd694dcdb65ca87aed531ea9038ea7453f145dbc0` |
| `nexah/backends/v07.py` | `c8f9f6be401992a1d9d50a0b2959fefaa10966a9d84f4874cf2ef93c067ff589` |

The historical `LICENSES.md` classifies original software and implementation
code as Apache License 2.0. Its `LICENSE` and `LICENSES.md` are retained beside
the snapshot. This mechanical finding does not resolve licensing of the RC's
research prose or all upstream Python packages.

