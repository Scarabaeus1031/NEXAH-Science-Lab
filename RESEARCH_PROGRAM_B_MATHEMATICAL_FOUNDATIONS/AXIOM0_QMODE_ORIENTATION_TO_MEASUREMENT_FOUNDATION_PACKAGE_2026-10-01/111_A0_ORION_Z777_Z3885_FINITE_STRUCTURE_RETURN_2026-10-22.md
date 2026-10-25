# A0 ↔ ORION finite structure return: Z777 / Z3885

Date: 2026-10-22  
Status: `PASS_EXACT_FINITE_RECALCULATION / INTERNAL / NOT PUBLICATION AUTHORITY`

## Question

Which parts of the supplied ORION / NEXAH visuals can be returned to A0 and the
NEXAH Science Navigator as reproducible structure rather than symbolic
association?

## Executed check

The runner
[`A0_BOOK/run_orion_z777_z3885_finite_structure_return.mjs`](A0_BOOK/run_orion_z777_z3885_finite_structure_return.mjs)
enumerates every orbit of four multiplication permutations. No pixel position,
color, visual similarity or diagram label enters the computation.

| Carrier and operator | Exact orbit distribution | Total orbits | State check |
|---|---:|---:|---:|
| `T64` on `Z777` | `21×1 + 126×6` | `147` | `777` |
| `T97` on `Z777` | `3×1 + 9×2 + 63×12` | `75` | `777` |
| `T524` on `Z777` | `1×1 + 10×2 + 189×4` | `200` | `777` |
| `T1301` on `Z3885` | `5×1 + 50×2 + 945×4` | `1000` | `3885` |

The machine-readable result is
[`A0_BOOK/results/a0-orion-z777-z3885-finite-structure-return-2026-10-22.json`](A0_BOOK/results/a0-orion-z777-z3885-finite-structure-return-2026-10-22.json).

## Exact bridge

Because `3885 = 777·5` and `gcd(777,5)=1`, CRT gives the typed carrier
decomposition

`Z3885 ≅ Z777 × Z5`.

The operator reduces as

- `1301 ≡ 524 (mod 777)`;
- `1301 ≡ 1 (mod 5)`.

Therefore `T1301` is conjugate under the CRT coordinate map to
`T524 × identity`. Every `T524` orbit on `Z777` appears in five separate
`Z5` fibres. This explains — rather than merely resembles — the exact scaling

`(1,10,189) → (5,50,945)` and `200 → 1000`.

## What is bound

- the four finite orbit ledgers above;
- the CRT factor map and the five-fold lift;
- `LOOK ≠ STRUCTURE` as the methodological guard: the drawing can change while
  the registered finite relation remains testable;
- Rainbow/color as a representation channel, not an invariant or a new law;
- reuse of `ART:A0:MATHEMATICAL_JOINTS` and
  `NEXAH:ORION:CAPABILITY_EVIDENCE:V1` without a new canonical identity.

## What remains provenance or open hypothesis

- EXP-JANUS-18D and related boards remain historical research material where
  raw rows/code are absent; they are not promoted by this return.
- GU-REX and GURT remain NEXAH-CODEX source-presence / hypothesis lineage. A
  visual resemblance to these models is not scientific support.
- The second Codex axis is preserved separately as **THOTH / Thoth's Pen** in
  the `MÖBIUS HARMONIC CROWN` release. That source calls the spiral writing
  movement a basis for its time-frequency model and then names
  Scarab–Falcon–Thunderbird movement axes. GURT independently names Möbius,
  spiral and frequency operators. No direct GURT→THOTH module reference was
  found, so NSN records a contextual source-lineage candidate, not an
  extension identity or a mathematical bridge.
- The displayed “45 steps earlier” early-warning statement is not imported;
  current Science Lab authority does not establish that claim.
- No cosmology, physical resonance, universal field, navigation/control,
  novelty or publication claim follows from the finite enumeration.

## Governance return

This is a bounded engineering return, not a new Study or Finding. The A0 Science
Desk and the existing ORION Capability & Evidence lens expose the same receipt.
Canonical graph counts, family counts, activation state and publication state
remain unchanged.

### Codex provenance records

- `NCX-0710` — GURT source presence;
- `NCX-0334` — MÖBIUS HARMONIC CROWN release / Thoth's Pen source presence.

Both records are classified `SOURCE_PRESENCE_ONLY_NOT_SCIENTIFIC_VALIDATION`
in the current NEXAH-CODEX legacy source register.
