# A0 Scarab Totient / Operator Spine — Source Audit

Date: `2026-10-13`

Status:

```text
EXISTING_PACKAGES_REUSED
SOURCE_VISUALS_HASH_BOUND
SCARAB_V3_LOCAL_ARITHMETIC = PASS_WITH_NUMERIC_CORRECTIONS
PHI_234211 = PASS
EXP45B_EXACT_REPO_SOURCE = NOT_LOCATED
BRIDGE_LOOM_JANUS = SOURCE_FAMILIES_PRESENT / IDENTITY_NOT_ESTABLISHED
LATER_VISUAL_OUTPUT_LINEAGE = LOCATED
LATER_VISUAL_GENERATOR_SOURCE = NOT_LOCATED
LOCALIZED_TOTIENT_CHART_ORIGINAL = NOT_LOCATED
NO_NEW_STUDY
NO_NEW_NAVIGATOR_IDENTITY
NO_CLAIM_PROMOTION
```

## Purpose

This checkpoint audits four Human-Owner-supplied visuals against standard
arithmetic and the existing NEXAH repositories. It is a correction and source
binding for Engineering Check 48, not a new experiment. Text printed inside a
visual is source content and is not treated as an instruction or as an
automatically validated claim.

## Source custody

| Role | Supplied file | SHA-256 | Disposition |
|---|---|---|---|
| Scarab Field Classification Map v3.0 | `4439FDBE-A731-405A-A4C2-20AB2DB37CF7_1_105_c.jpeg` | `d303758a9db906f8c1615c8127ced613c672bee728e4ad0de5f49d696d67426b` | corrected successor rendering; audited below |
| Euler Totient `phi(234211)` | `D017BECA-287A-4130-8D79-EC52EDA0DC02_1_105_c.jpeg` | `56743150c5bb9d0b18bdbd6c7ddb50e878722cad540e6237d049d00affc3311b` | exact arithmetic marker; already named in Root7 custody |
| EXP-45B operator network / spine | `15538146-3DAE-478C-85D9-C1A7181D1905_1_105_c.jpeg` | `ee8c2d6099d228160abcb5236e9b9c21460c0ba4dba15587c6833516b7c41e5e` | documentary candidate; exact generating source not located |
| Bridge / Loom / Janus Basin | `447769C4-3F04-4873-84BA-A4497A8627DC_1_105_c.jpeg` | `030b18b0935486aca327b291af22fa24ade86e5164be5948073a55315027d5f4` | conceptual glossary plate; source-family compatible only |

The JPEG files are not promoted to canonical repository artifacts by this
record.

## Check A — Scarab v3.0 arithmetic

All nine displayed factorizations, totients and divisor counts are correct:

| `n` | factorization | `phi(n)` | `phi(n)/n` | `d(n)` |
|---:|---|---:|---:|---:|
| 1033 | prime | 1032 | 0.999031946 | 2 |
| 7801 | `29 * 269` | 7504 | 0.961927958 | 4 |
| 2501 | `41 * 61` | 2400 | 0.959616154 | 4 |
| 2401 | `7^4` | 2058 | 0.857142857 | 5 |
| 3101 | `7 * 443` | 2652 | 0.855207997 | 4 |
| 3501 | `3^2 * 389` | 2328 | 0.664952871 | 6 |
| 1032 | `2^3 * 3 * 43` | 336 | 0.325581395 | 16 |
| 2301 | `3 * 13 * 59` | 1392 | 0.604954368 | 8 |
| 1087 | prime | 1086 | 0.999080037 | 2 |

This repairs the earlier v0.1 prime-label failure for `7801`. The v3.0 plate
still contains secondary numerical errors:

- the nine-node mean is `0.8030550647`, not the displayed `0.747`;
- `phi(7801)/7801` rounds to `0.96193`, not `0.96195`;
- `phi(3101)/3101` rounds to `0.85521`, not `0.85456`;
- `phi(3501)/3501` rounds to `0.66495`, not `0.66524`;
- `1087`, not `1033`, has the largest displayed prime ratio, although both
  are close to one.

The displayed average divisor count is correct:

```text
(2 + 4 + 4 + 5 + 4 + 6 + 16 + 8 + 2) / 9 = 51 / 9 = 5.666...
```

The decimal reversal relations are also exact:

```text
reverse(1032) = 2301
reverse(1087) = 7801
1033 + 1087 = 2120
2301 + 1032 = 3333
2501 + phi(2501) = 4901
```

They are representation-level facts. They do not establish a mirror operator
on an independently defined state space.

## Check B — the `7801`, `29`, `269`, `296`, `297` seam

For two distinct primes `p` and `q`,

```text
phi(pq) = (p - 1)(q - 1)
pq - phi(pq) = p + q - 1.
```

Therefore:

```text
7801 = 29 * 269
phi(7801) = 28 * 268 = 7504
7801 - 7504 = 29 + 269 - 1 = 297
7504 + 297 = 7801
```

The nearby value `296` has a different exact role:

```text
296 = (29 - 1) + (269 - 1) = 28 + 268
7504 + 296 = 7800
```

Both `269` and `296` have decimal digit sum `17`. This is a valid decimal
annotation, but it is not the totient gap. The extra `+1` in `297` is the
inclusion-exclusion correction.

## Check C — `phi(234211)`

Deterministic trial division through `sqrt(234211) < 484` finds no prime
divisor, so `234211` is prime. Hence:

```text
phi(234211) = 234211 - 1 = 234210.
```

This image family is already acknowledged in the Root7 source audit, which
lists `square_234211.png`, `prime_234211.png` and `totient_234211.png` as
arithmetic source plates. That custody record explicitly does not infer a map
from the marker into the four Root7 sign channels.

## Check D — EXP-45B operator network

The plate declares an operator adjacency matrix, an aperture score and the
provisional spine

```text
1033 <-> 3301 -> 7 -> 2401 -> 1729.
```

An exact-text and filename search of the present NEXAH Core and Science Lab
repositories did not locate an `EXP-45B` source, result ledger or generating
script. Adjacent repository families do exist:

- archived navigation spine extractors;
- EXP-44R / EXP-44S atlas-spine analyses;
- Janus transition-spine and aperture-score experiments;
- general operator and structure-quantity definitions.

Those are different carriers and cannot be used as substitute evidence for
the displayed integer network. The plate itself labels its result provisional
and says that the linear chain was replaced by a star-like structure. Until a
source-local rule defines each adjacency entry and score, the strongest status
is:

```text
EXP45B_VISUAL = DOCUMENTARY_CANDIDATE
EXP45B_ADJACENCY_REPLAY = BLOCKED_BY_MISSING_EXACT_SOURCE
EXP45B_SPINE = NOT_VALIDATED
MANDELBROT_TO_JULIA_ARROW = ANALOGY_ONLY
```

## Check E — Bridge / Loom / Janus Basin

The repositories contain genuine neighboring source families: the Navigator
already recognizes `MOD:THREAD_LOOM`, and NEXAH Core contains Janus transition,
basin and aperture scripts. The supplied plate is nevertheless a conceptual
translation layer:

```text
bridge = relation / connection
loom = organization of relations into a fabric
basin = state-space region or present transition context
```

The equation `63/64 + 1/64 = 1` is exact. It does not by itself define energy,
time, resonance or a Janus dynamical operator. No exact repository source for
this four-panel rendering was located, and no identity between Thread Loom and
the Lorenz-based Janus scripts is inferred.

## Supplement — later Möbius / harmonic visual lineage

The Human Owner subsequently supplied one screenshot for information only and
fifteen JPEG derivatives of older visuals and GIF frames. A local source search
located the exact output family. The main custody root is:

```text
Desktop TASKS/DESKTOP_archy/THOOTH DASHBOARD/
AAA NEXAH Modules todo/A - Nexa Knowledge NEXAH first modules ARCHIVE/
THOOTH Möbius Smaragd Table/Universall Resonance and Harmony./
```

It contains a duplicate child folder named `Github - Universal Resonance and
Harmony`. Two additional exact-title sources occur in adjacent historical
archive trees: `***Hermetic Prime Harmonic Resonance` and `THE ARTS`.

| Supplied image | Located local source | Binding |
|---:|---|---|
| 1 | no original located for `Localized Euler Totient Values and Corresponding Riemann Zeta Function Values...` | screenshot information only |
| 2 | `Mobius_Euler_Totient_Overlay.gif` | direct JPEG export of GIF frame 0 |
| 3 | `Fine Grid Structure - Harmonic Tree Resonance Mapping.png` | same rendered plate; resized/cropped JPEG derivative |
| 4–5 | `Mobius_Modular_Residue_Overlay.gif` | both are the same frame-0 export; the two supplied JPEGs are byte-identical |
| 6 | `Mobius_Klein_Interaction_3_Track.gif` | same three-track Möbius/Klein animation family; frame export |
| 7 | `Harmonic Prime Resonance with Fine & SSFine Structure.png` | direct JPEG derivative; dimensions agree |
| 8 | `Three-Thread Quantum Harmonic Weave with Q-Closure.png` | direct JPEG derivative; source says `Weave`, supplied title says `Wave` |
| 9 | `Harmonic Resonance of Alchemical Metals.png` | direct JPEG derivative |
| 10 | `3D Harmonic Resonance Structure of Alchemical Metals.png` | direct JPEG derivative |
| 11 | `Final 3D Harmonic Resonance Structure of the 12-Metal Cycle.png` | direct JPEG derivative |
| 12 | `Final Ullinium Unified State.png` | direct JPEG derivative |
| 13 | `Screenshot 2025-03-07 at 1.32.16 AM.png` | direct JPEG derivative of the interstellar/neutrino plate |
| 14 | `Tesla-Cikada Slingshot Arc in Prime Resonance.png` | direct JPEG derivative |
| 15 | `Screenshot 2025-03-07 at 2.09.40 AM.png`, adjacent to `19-99 Mirror: Tesla-Hexagonal Arc & Gamma Slingshot.png` | direct screenshot derivative |
| 16 | `Refined 19-99 Mirror: Tesla-Hexagonal Arc & Gamma Slingshot.png` | direct JPEG derivative |

Pixel-normalized comparisons give near-zero error for the direct derivatives;
the GIF bindings match their first displayed frames. Source-output SHA-256
bindings for the principal files are:

```text
059554405af33505c1fb7399b7fb2852a5534f0a6e9c0293dcd96ad9bf985dac  Mobius_Euler_Totient_Overlay.gif
ab94df5675c4a6248c2efc8e6bac5d22a458ea4d168a0727e135a524ea6a3942  Fine Grid Structure - Harmonic Tree Resonance Mapping.png
7e7082194879a9f6bbe7ebaf2d873042d5b64971e7cd2c5f95538c65413e80de  Mobius_Modular_Residue_Overlay.gif
01702ba911eb1fbc6d859cd75ef31f4cfb0e1da5784ba505e39d512f452e4cae  Mobius_Klein_Interaction_3_Track.gif
2b5150692b4a681f9f8a02acfc14acd14c1ef546eb50cb24f4083391756dd25c  Harmonic Prime Resonance with Fine & SSFine Structure.png
5615a91dd4a7eb2833691220a2c086608a0b1609dd5390c5af180693b220befd  Three-Thread Quantum Harmonic Weave with Q-Closure.png
cc0776ad39a0c98d1c55b86c4ac57bc765c5d23deedf0e2f3d2239bf10efb61a  Harmonic Resonance of Alchemical Metals.png
7c3f092430954d6e8bdbba974ad3f6945dc1acc932736e317573808f410c5829  3D Harmonic Resonance Structure of Alchemical Metals.png
62f97697c68b3d9ef33a8b10191ee0ffa392ef3244c75a41ec687ce83c6257cd  Final 3D Harmonic Resonance Structure of the 12-Metal Cycle.png
18e7f9ccdbe0eb5f34576a5517d7370df7da36bd04df341079cd9db39b5ff2a4  Final Ullinium Unified State.png
f47b7ca60f43b986693fe65bbcbed61db1fc6ba9f6f120ad4d769628245fa1aa  Screenshot 2025-03-07 at 1.32.16 AM.png
a69dc54aa5e9e3ba5655be4d1194a2eab3e69b5d07d470797b993f950c1f40e0  Tesla-Cikada Slingshot Arc in Prime Resonance.png
bc44607f5f288787030b685d36844149714c433af3ad5e95e91ef0bbed7c0c4e  Screenshot 2025-03-07 at 2.09.40 AM.png
e7067beec4161acb8c16710f196e4838e5e09cf0dd1e0ce3a002c83487134f1f  Refined 19-99 Mirror: Tesla-Hexagonal Arc & Gamma Slingshot.png
```

This confirms a NEXAH historical visual-work lineage, but with an important
repository boundary. Exact-title and exact-filename searches did not locate
these outputs or a generating Python/notebook source inside the current
`Documents/GitHub/NEXAH-CODEX` checkout. That repository contains later and
adjacent Möbius, harmonic, alchemical and Ullinium families; thematic
continuity is present, exact canonical membership is not yet demonstrated.
The folder name `Github - Universal Resonance and Harmony` is provenance
metadata, not proof of a Git commit.

The existing `CIKADA_3301_LATER_MARKER_PROVENANCE_INTAKE` therefore supplies
the governing disposition: retain the visuals as historical/source-family
evidence while keeping claims, operators and physical interpretations outside
the validated layer. In particular, plotted use of `137`, `237`, atomic
numbers, celestial names, Möbius/Klein geometry or `mod 360` does not validate
a physical resonance law without the missing generator, parameter definitions
and independent test contract.

## Source bindings and decision

Reused repository records:

- Root7 `NEXAH_ROOT7_AXIS_RULE_AUDIT_2026-09-28.md` for the retained
  `234211` image family and its mapping boundary;
- Root7 `NEXAH_SCN_1087_GEGENPROBE_PRUEFPUNKT_10_2026-09-28.md` for
  `7801 = 29 * 269`, the `1087 <-> 7801` decimal reversal and SCN limits;
- `03_TOTIENT_GAP_REPORT.md` for the exact `2401 = 7^4` totient ratio;
- existing Navigator `MOD:THREAD_LOOM` and existing Janus source families,
  without merging their identities.

```text
REUSE = ROOT7_CUSTODY + TOTIENT_GAP_REPORT + THREAD_LOOM + JANUS_SOURCE_FAMILY
REUSE_PROVENANCE = CIKADA_3301_LATER_MARKER_PROVENANCE_INTAKE
RELATE = A0_ENGINEERING_CHECK_49
CREATE_CANONICAL_ENTITY = NONE
SCARAB_V3 = CORRECTED_DOCUMENTARY_VIEW
234211_TOTIENT = EXACT_STANDARD_ARITHMETIC
OPERATOR_SPINE = SOURCE_REQUIRED_BEFORE_REPLAY
BRIDGE_LOOM_JANUS = CONCEPTUAL_CROSSWALK_ONLY
LATER_VISUALS = HISTORICAL_OUTPUT_LINEAGE_BOUND
LATER_VISUAL_GENERATORS = SOURCE_REQUIRED_BEFORE_REPLAY
NEXT_SCIENTIFIC_RUN = NONE
```

Claim ceiling: factorization, Euler totient, divisor count, decimal reversal,
digit sum and source-family routing. No physical resonance, universal aperture,
Mandelbrot/Julia mechanism, historical identity or canonical Scarab operator
follows.
