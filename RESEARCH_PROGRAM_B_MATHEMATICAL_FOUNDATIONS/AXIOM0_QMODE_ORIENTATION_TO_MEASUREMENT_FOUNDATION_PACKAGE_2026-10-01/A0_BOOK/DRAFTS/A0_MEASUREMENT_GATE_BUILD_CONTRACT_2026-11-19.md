# The Measurement Gate · R0 Build Contract

Date: `2026-11-19`  
Status: `R2_EMBEDDED_LOCAL_METHOD_CANDIDATE / VERSION_AMBIGUOUS / NO_RESEARCH_ACTIVATION`  
Working label: `THE MEASUREMENT GATE`  
Owning source package: `AXIOM0_QMODE_ORIENTATION_TO_MEASUREMENT_FOUNDATION_PACKAGE_2026-10-01`  
Public release: `NO`  
Research activation: `NO`  
Navigator delta: `0 entities / 0 relations`

## 1. Decision

The collected Clockwork, Number/View and A0 material should become one compact
orientation instrument, not another universal theory and not another large
stage. The instrument shows how a statement becomes inspectable through a
declared source, quantity type, reference, cut or operator, trace, comparison
and return receipt.

The durable sentence is:

> NEXAH does not decide what the world is. It shows through which source,
> type, frame and cut a claim became available for comparison.

`The Measurement Gate` is a working label for this lens. It is not a stable
Navigator identity, a new Study, a Core module or a publication title.

## 2. Reuse decision

The proposed lens reuses rather than duplicates:

| Existing object | Reused role | Boundary |
|---|---|---|
| `MOD:OPERATOR_DEMONSTRATOR` | carrier, cut, gate and return grammar | no representation-invariance claim |
| `MOD:NUMBER_VIEW_SUITE` | typed number/view and comparison discipline | proximity is not operator identity |
| `ART:HTML:AD37946854D2` · Q Port Conic Gate | established-mechanics application benchmark | astronomical values require solution, epoch and uncertainty |
| `ART:HTML:CAAEAD5F19ED` · Saturn QRT Record | readable cut/trace/return analogy | no measured Saturn–Titan transfer function |
| `CAND:SOLAR_CLOCKWORK` | documented application family | candidate family, no Core promotion |
| A0 Orientation Method | source/frame/map/metadata contract | method precursor; universal necessity claims remain open |

The existing Solar Clockwork bridge already states the correct architecture:
method grammar → typed application → only then domain evidence. The new lens
should make that separation easier to experience; it must not replace it.

## 3. Human outcome

After one pass, a visitor should be able to answer:

1. What is the source object or record?
2. Which quantity is being shown?
3. What are its unit, reference and epoch?
4. Which frame, cut, mask or operator produced the view?
5. What does the resulting trace preserve and suppress?
6. What can be compared?
7. Does the return `PASS`, `HOLD`, `N/A` or `SOURCE UNAVAILABLE`?

Success is comprehension of these distinctions. Success is not agreement with
a cosmology, memorization of glyphs or acceptance of a physical mechanism.

## 4. Canonical chain

```text
SOURCE
  → CARRIER
  → QUANTITY TYPE + UNIT + REFERENCE + EPOCH
  → CUT / FRAME / OPERATOR
  → TRACE / VIEW
  → COMPARE
  → RETURN RECEIPT
```

The shorter interface labels may read:

```text
SOURCE → TYPE → CUT → TRACE → COMPARE → RETURN
```

`TYPE` expands to number, unit, quantity type, reference, epoch and uncertainty.
It may never be reduced to the bare numerical value.

## 5. Experience architecture

The instrument should be one standalone page with three rooms, not one crowded
stage.

### Room A · Declare

- choose a source-bound case;
- expose source, solution or version;
- select the quantity type before showing the value;
- keep diameter, radius, separation, semi-major axis, eccentricity, period,
  speed and energy visibly distinct;
- show `HOLD` when the selected quantity is absent.

Primary visual: `A Number Needs a Type`, rebuilt as native HTML/SVG rather than
used as an unverified raster.

### Room B · Cut

- choose one declared view or operator;
- show what the operation preserves, transforms and suppresses;
- never imply that two visualizations are the same physical mechanism;
- allow only source-bound presets in the first build.

Initial presets:

1. `CONIC_GATE` — elliptic return, parabolic threshold, hyperbolic passage;
2. `QRT_RECORD` — one carrier, selectable record cuts, comparable traces;
3. `RESONANCE_SORTER` — Jupiter resonance locations with outcome qualifiers.

### Room C · Return

- compare source declaration and trace side by side;
- output a human-readable and machine-readable receipt;
- list preserved fields, lost fields, assumptions and source warnings;
- provide links back to the owning sources;
- do not convert `HOLD` into a guessed value.

## 6. Initial cases

| Case | Role | Required source binding | First-build state |
|---|---|---|---|
| Earth–Sun | bound conic control | pinned orbital elements and solar parameter | `READY_FOR_DRAFT` |
| 3I/ATLAS | hyperbolic passage | pinned JPL solution ID, solution date, epoch and values | `READY_AFTER_SNAPSHOT` |
| Jupiter resonances | derived comparison | declared `a_J`, formula and resonance convention | `READY_FOR_DRAFT` |
| Saturn–Titan QRT | orientation analogy | preserved HTML and explicit analogy label | `READY_FOR_DRAFT` |
| Pluto–Charon / Eris–Dysnomia / Arrokoth | relation types | current sources and corrected Eris rotation | `HOLD_UNTIL_CORRECTED_DATA_CARD` |
| Time is Relation | nested-cycle orientation | explicit definitions for candidate coupling and reset | `HOLD_DEFINE` |

The first executable build should ship with at most four cases. More cases do
not improve the method unless each has a complete typed source card.

## 7. Data contract

The page should render from a small pinned local data object, not from live
network calls:

```json
{
  "case_id": "3i-atlas-jpl-55",
  "source": {
    "authority": "NASA/JPL SBDB",
    "solution_id": "55",
    "solution_date": "2026-10-21",
    "epoch": "2026-10-27.0 TDB",
    "retrieved": "2026-11-19"
  },
  "carrier": {
    "object": "C/2025 N1 (ATLAS)",
    "frame": "heliocentric J2000 ecliptic"
  },
  "quantities": [
    {"type": "eccentricity", "symbol": "e", "value": 6.123467394525528, "unit": null},
    {"type": "semi-major axis", "symbol": "a", "value": -0.2638835217034532, "unit": "au"}
  ],
  "operator": "CONIC_CLASSIFICATION",
  "return": {
    "status": "PASS_TYPED_CLASSIFICATION",
    "class": "HYPERBOLIC",
    "does_not_imply": ["future values remain unchanged", "NEXAH caused the orbit", "a physical portal exists"]
  }
}
```

Every quantity requires `type`, `value`, `unit` or explicit `dimensionless`,
reference frame where relevant, source, and source date. Estimated or rounded
values require a qualifier. Time-sensitive data require a retrieval date.

## 8. Return vocabulary

The first build uses only:

- `PASS_TYPED_CLASSIFICATION`
- `PASS_DERIVATION_REPRODUCED`
- `HOLD_MISSING_TYPE`
- `HOLD_MISSING_REFERENCE`
- `HOLD_TIME_SENSITIVE_SOURCE`
- `HOLD_CONFLICTING_VALUE`
- `N_A_ANALOGY_ONLY`
- `SOURCE_UNAVAILABLE`

The receipt must distinguish a correct classification from a scientific
validation. QRT should normally return `N_A_ANALOGY_ONLY` for planetary
mechanism claims while still permitting a valid interface demonstration.

## 9. Visual language

- dark observatory field;
- cyan = source / outward view;
- pink = selected aperture or cut;
- gold = typed value / reference / return;
- grey = suppressed or unavailable information;
- green = source-bound receipt, never generic “truth”;
- red = correction or unresolved contradiction;
- one central diagram per room;
- no photorealistic planet montage is required for the MVP;
- all scientific diagrams should be native SVG/canvas generated from the
  pinned record.

The visual system may feel like Rödelheim Observatory, but it must read more
quietly than the Cruiser: fewer controls, larger labels, visible provenance.

## 10. Corrections required before build

1. Replace Eris `25.9 h` with the current source-bound approximately `15.77 d`
   value and label the near-synchronous relation to Dysnomia.
2. Either freeze the historical 3I/ATLAS solution shown in the old Conic Gate
   or replace it with JPL solution `55`; do not silently mix values.
3. Mark the Jupiter resonance radii as derived from a declared Jupiter
   semi-major axis and Kepler relation.
4. Keep `clear / trap / scatter` as outcomes requiring conditions, not as
   deterministic functions of every resonance.
5. Keep `2.5 y + 2.5 y` and Venus/Moon coupling out of the first build until
   the quantity and comparison rule are defined.

## 11. Source and media policy

The visual attachments in Intake 01 remain reference-only. Their Photos
derivative filenames are not repository provenance and their generated labels
must not be copied as facts. The first build should reconstruct the admitted
logic from typed data and verified text.

The two preserved HTMLs may be linked or studied, but should not be silently
edited in place. The new lens, if authorized, receives its own draft file under
the existing A0 package and records those artifacts as reused sources.

## 12. Accessibility and failure semantics

- full keyboard path through case, type, cut and return;
- visible focus and semantic buttons;
- text alternative for every diagram;
- `prefers-reduced-motion` respected;
- no information encoded by color alone;
- source and claim boundary available without interaction;
- missing data produce `HOLD`, never an empty-looking success state;
- local operation without network access;
- no autoplay audio in the MVP.

## 13. Verification contract for a later draft build

A draft build is acceptable only if automated checks confirm:

1. every displayed number has a quantity type and source pointer;
2. every time-sensitive case has solution/epoch/retrieval metadata;
3. no source preset can return a value absent from its pinned record;
4. conic classification matches the declared `e` and energy sign;
5. all `HOLD` states remain fail-closed;
6. QRT is labeled analogy in UI and receipt;
7. Eris `25.9 h` does not appear;
8. the page works without network access;
9. reduced-motion and keyboard navigation pass;
10. no Navigator registry, binder or Study status changes.

## 14. Stop conditions

Stop the build if:

- a new universal mechanism claim is required to make the experience work;
- source values cannot be pinned to solution, reference or epoch;
- the page begins merging astronomy, chemistry and NEXAH glyph reading into
  one physical identity;
- a duplicate module or Navigator identity appears necessary;
- publication or Research activation is requested without a separate Owner
  decision;
- the interface requires live external services for its basic operation.

## 15. Owner authorization and next permitted action

On `2026-11-19`, the Human Owner authorized the bounded action:

`OWNER_DECISION: AUTHORIZE_NONPUBLIC_DRAFT_HTML_BUILD`

The resulting local files are:

- `A0_MEASUREMENT_GATE_DRAFT_2026-11-19.html`;
- `a0-measurement-gate-draft-tests.cjs`.

This authorization does not include publication, deployment, Study activation,
new Navigator identity, new graph relation or scientific claim. The next
permitted action is local visual QA and bounded correction of the draft.

The Human Owner then authorized the bounded integration decision:

`OWNER_DECISION: AUTHORIZE_WHITE_PAPER_04A_INTEGRATION`

The Measurement Gate is therefore embedded as section `04A` in
`A0_NEXAH_FAMILY_METHOD_WHITE_PAPER.html`, between the `T1–T8` method sequence
and the three-lens cycle. The standalone draft remains an internal fixture for
data comparison and regression testing; it is not a second public destination.
The integration adds `a0-family-method-measurement-gate-tests.cjs` and keeps the
Navigator delta at `0 entities / 0 relations`.

Mission Control currentness validation was already invalid before this bounded
integration because of unrelated hash mismatches. Consequently this result is
an explicitly dirty local candidate (`VERSION_AMBIGUOUS`), not an accepted
version. Publication, deployment, Study activation, registry changes and graph
changes remain unauthorized. The next permitted action is local automated and
visual QA only.

