# NEXAH Navigator — Entry Target Architecture v1

Date: `2026-10-07`  
Status: `TARGET BLUEPRINT / COPY AND OWNER REVIEW BEFORE IMPLEMENTATION`  
Depends on: `NAVIGATOR_CURRENT_STATE_AND_CROSSWALK_2026-10-07.md`

## 1. Product decision

The Navigator entrance is a threshold into a governed research instrument. It
must not attempt to display the complete instrument on first contact.

The target has three depths:

```text
ORIENTATION THRESHOLD
  → DOMAIN MAP
    → INSTRUMENT / EVIDENCE / CUSTODY DEPTH
```

Existing routes, entity IDs, family namespaces and source records remain
stable. The target architecture changes presentation and grouping, not the
scientific taxonomy.

## 2. First-viewport contract

Without scrolling, a reader should be able to answer:

1. Where am I?
2. What is this useful for?
3. What question does it help me investigate?
4. What can I do next?
5. What must I not infer?

Required components:

- identity: `NEXAH Science Navigator`;
- value statement;
- concise research question;
- three actions: `Understand · Explore · Verify`;
- persistent boundary: `Comparison is not identity`;
- internal/public state.

Inventory counts, namespace diagnostics, full maps and archaeology queues do
not belong in the first viewport.

## 3. Global shell

### Header

- `✦ NEXAH · Science Navigator`
- profile state: `Internal research instrument`
- release state: `Not public`
- persistent utilities: `About` and `Vocabulary`

### Primary navigation

The fourteen existing work routes are grouped into six domains. Grouping does
not change their hashes.

| Domain | Purpose | Existing routes |
|---|---|---|
| Orientation | understand the place and current work | `#home`; Current Focus section on Home |
| Framework | inspect the exploratory roof and structural comparisons | `#utg`, `#dynamics`, `#ladders` |
| Families | follow functional lenses, sequences and provenance | `#families`, `#sequence`, `#lineage` |
| Language | inspect controlled and local research grammar | `#envelope`, proposed `#glossary` |
| Atlas | find modules, instruments and registered objects | `#atlas`, `#catalog` |
| Evidence | inspect relations, results, limits and admission | `#evidence`, `#relations`, `#admission` |

`About` remains a persistent utility route outside the numbered research
workflow.

### Persistent context panel

Retain:

- current selection;
- claim boundary;
- source receipt.

Add only when terminology is present:

- `Meaning`;
- `Established/adjacent vocabulary`;
- `NEXAH usage`;
- `Does not mean`.

## 4. Home architecture

### H1 — Orientation hero

Purpose: identity, value, central question and first action.

Contains:

- short kicker;
- one headline;
- one two-sentence introduction;
- three starting questions;
- three action buttons;
- one boundary statement.

Does not contain:

- counts;
- family namespaces;
- candidate F8 distinctions;
- detailed framework maturity;
- full secondary link rail.

### H2 — Current Focus

Purpose: show the current governed work cluster without changing taxonomy.

Initial cards:

1. Primegrid · Pascal · 101;
2. OIL/RIS Multi-Lens;
3. Readout Reconstruction;
4. GLB Gateway;
5. Archaeology intake.

Every card includes:

```text
plain-language title
one-sentence function
lifecycle/status text
why it is current
primary registered entry
next unresolved step
controlling record
```

Current Focus is a projection of governed currentness. It is not a news feed,
promotion list or fifth authority layer.

### H3 — Six-domain map

Purpose: expose the architecture only after the reader understands the
instrument's value.

Each card answers:

- What question belongs here?
- What will I find?
- Which first route should I open?

No codes lead the labels. Codes may appear in secondary metadata.

### H4 — Handoff

Purpose: send readers to the correct responsibility surface.

- `About this research instrument`
- `Understand the wider NEXAH ecosystem`
- internal source/custody handoff when applicable

## 5. About architecture

About explains identity and authority. It is not a second Home or condensed
catalog.

### A1 — What it is

One concise definition of the Science Navigator as an inspectable research
map.

### A2 — Why it exists

Explain the problem: visual similarity is easy to see; a typed, sourced and
bounded comparison is harder.

### A3 — How it is organized

```text
Framework
  → functional families
    → concrete objects and instruments
      → evidence and maturity
```

### A4 — Does / does not

| The Navigator does | The Navigator does not |
|---|---|
| orient across governed records | certify a universal theory |
| expose typed relations and boundaries | turn visual resemblance into proof |
| launch registered instruments | activate research or runtime profiles |
| retain evidence and negative results | rewrite package-local verdicts |
| show publication gates | authorize publication |

### A5 — Authority map

Show the distinct responsibilities of:

- Mission Control;
- Science Lab;
- OLS 1.0;
- ORION;
- NEXAHEDRON / OVS;
- Science Navigator;
- `nexah.de`.

### A6 — How to read the language

Explain the display order:

```text
meaning → established vocabulary → NEXAH usage → code
```

Link to Vocabulary.

### A7 — Invitation

One closing action, not a second set of competing entrances.

## 6. Vocabulary architecture

### Route

Add a persistent utility route `#glossary`, displayed as `Vocabulary`.

### Record contract

Every governed term shown in the interface should support:

```text
term_id
display_name
plain_language_definition
expansion
established_or_adjacent_vocabulary
nexah_specific_usage
does_not_mean
status
controlling_source
related_entity_ids
first_use_copy
```

### Status classes

- `ESTABLISHED` — standard external vocabulary used conventionally;
- `ESTABLISHED_ADJACENT` — standard term with a declared local specialization;
- `LOCALLY_DEFINED` — NEXAH term with a controlling definition;
- `FIXTURE_BOUND` — meaning established only inside a named test or carrier;
- `CANDIDATE` — proposed mapping or term awaiting a sufficient contract;
- `HISTORICAL` — retained for provenance, not current authority;
- `UNRESOLVED` — expansion or meaning not recovered; never silently completed.

### First-use rule

On Home, About and Current Focus:

1. write the plain-language meaning first;
2. expand an abbreviation on first use when controlled;
3. identify a NEXAH-specific usage explicitly;
4. show a boundary for nonstandard glyphs or terms;
5. place IDs and acronyms in secondary metadata.

Examples:

- `Multiple bounded views (OIL/RIS Multi-Lens)`;
- `Modular Redundancy Binder series (MRB)`;
- `typed split/cut record (ø)`;
- `registered seam/transition (œ)`;
- `ACR-44 · Two-Axis Signal Reconstruction Audit` rather than an invented
  series-wide ACR expansion.

## 7. Current Focus governance

### Source of truth

Currentness remains governed by Mission Control and controlling research
records. The Navigator stores only a small projection that references existing
entity IDs and records.

### Required fields

```text
focus_id
display_title
plain_summary
entity_ids
domain_ids
lifecycle
why_current
next_step
controlling_record
reviewed_on
```

### Allowed lifecycle language

- `current · bounded`;
- `verified component`;
- `candidate`;
- `deferred`;
- `historical`;
- `blocked`.

Dates and visual prominence never promote scientific status.

## 8. Progressive disclosure rules

| Depth | Lead with | Keep secondary |
|---|---|---|
| Home | meaning, question, action, boundary | codes, counts, provenance detail |
| Domain page | functional role and available routes | namespace diagnostics |
| Module/instrument | function, status, primary action | surface variants and hashes |
| Evidence | verdict, interpretation and claim ceiling | technical receipt details |
| Catalog/admission | complete metadata and diagnostics | editorial explanation |

## 9. Responsive behavior

- Desktop: six grouped domains in the sidebar; utilities visually separate.
- Narrow screen: domains become horizontal groups or a domain selector, not a
  fourteen-item undifferentiated strip.
- Current Focus cards stack in reading order.
- Claim boundaries remain visible and textual.
- Vocabulary definitions do not rely on hover; tooltips are supplementary.
- Every action remains keyboard reachable with a 44px minimum target.

## 10. Implementation sequence after copy approval

1. Freeze Home, About, domain and first-use terminology copy.
2. Create the terminology data record and Current Focus projection.
3. Add grouped navigation without changing existing hashes.
4. Replace Home with H1–H4.
5. Replace About with A1–A7.
6. Add Vocabulary and contextual term links.
7. Update structural audits for grouping, copy, lifecycle and terminology.
8. Run app, keyboard, reduced-motion and narrow-screen audits.
9. Conduct a Human Owner walkthrough using the five first-viewport questions.

## 11. Acceptance criteria

- all existing deep links still resolve;
- first viewport answers the five orientation questions;
- no unexplained acronym leads a Home or About heading;
- every nonstandard glyph has a visible fixture/scope boundary;
- Current Focus items resolve to controlling records;
- public admission remains zero and fail-closed;
- no scientific or OLS status changes;
- app audit passes after intentionally updated assertions;
- Human Owner can distinguish Home, Family Map, Atlas and Evidence without
  repository knowledge.

## 12. Nonclaims

This target architecture does not authorize implementation, publication,
Ring-1 promotion, new OLS language, a canonical F8/F9, or a scientific status
change. It is a presentation blueprint for already governed material.
