# 01 — Source and Overview Register

## Mission Control overview surface read

| Source | Function in this audit | Observed constraint |
|---|---|---|
| `00_OVERVIEW/README.md` | topology of overview views | Human, Science, Builder, Outreach, and Owner remain distinct; `CURRENT` is their shared control view |
| `00_OVERVIEW/HUMAN_VIEW.md` | human-facing method view | bounded records; Field → Select → Frame → Cut → Trace → Artifact → Record → Interpretation → Return |
| `00_OVERVIEW/SCIENCE_VIEW.md` | research/evidence view | asks what is retained, lost, added, and unresolved; domain authority remains local |
| `00_OVERVIEW/BUILDER_VIEW.md` | implementation view | seven shelves; common automatic event transfer and common end-to-end test are missing |
| `00_OVERVIEW/OUTREACH_VIEW.md` | communication view | object, channel, track, resonance, and gate are distinct |
| `00_OVERVIEW/OWNER_VIEW.md` | priority and bottleneck view | no active priority, research, outreach, build, or publication cycle at audit time |
| `CURRENT/README.md` | controlling operational truth surface | summary and routing surface; does not replace source authority |
| `CURRENT/ECOSYSTEM_REGISTER.md` | ecosystem role register | assigns distinct repository roles and authority locations |
| `CURRENT/REPOSITORY_ROLES.csv` | machine-readable role map | seven rows, including the certified ORION checkout as reference rather than peer system |
| `CURRENT/PORTFOLIO_TRUTH.json` | current portfolio state | Stage 0 consolidation; no integrated production machine; no registered active capabilities |

## Science Lab alignment sources read

| Source | Function in this audit |
|---|---|
| `SCIENCE_LAB/NEXAH_CURRENT_TOTAL_OVERVIEW_2026-09-18.md` | current total overview and ecosystem interpretation |
| `SCIENCE_LAB/SUBJECT_OVERVIEW.md` | Science Lab subject routing |
| NEXAH Constitution | authority and governance ceiling |
| Scientific Constitution | adopted methodological direction |
| Sealed Comparison Method | bounded comparison, I-L-A-U, residual, return, and claim ceilings |
| repository architecture reviews | prior repository-role and implementation observations |

## Local topology checked

The audit compared the registered roles with the local ecosystem layout:

- `00 EXECUTIVE/NEXAH-Mission-Control`
- `10 NEXAH CORE/NEXAH`
- `20 ORION/NEXAH-ORION`
- `20 ORION/NEXAH-ORION-V1-CERTIFIED-d34fbb2f`
- `30 SCIENCE LAB/NEXAH-Science-Lab`
- `40 EXPERIENCE PRODUCTION/NEXAHEDRON`
- `40 EXPERIENCE PRODUCTION/NEXAH-Experience` → external local checkout by symbolic link

The symbolic-link detail is a local storage fact, not a change of repository authority. It is nevertheless relevant provenance for reproducible local audits.

## Currentness test executed

The existing Mission Control validator was run without changing files:

```text
python3 -B CURRENT/validate_currentness.py
```

Observed result:

```text
status: INVALID
controlling_sources_verified: 70
failures: 2
```

Both failures are hash mismatches for Science Lab overview files changed during the preceding TOP method-center alignment:

- `NEXAH_CURRENT_TOTAL_OVERVIEW`
- `SCIENCE_LAB_SUBJECT_OVERVIEW`

This is evidence of an incomplete return to Mission Control currentness, not evidence that the scientific content is false.

## Evidence limits

- This is a local, dated audit of the accessible ecosystem state.
- It does not establish the exact deployed commit of every public surface.
- It does not infer scientific novelty from internal coherence.
- Repository status snapshots and role descriptions are evidence records, not perpetual live truth.
