# NEXAH Master Navigator — Visual Language v1

Date: `2026-10-06`

Status: `BRAND AND UI PLANNING CONTRACT / THREE STATIC FRAMES PRESENT / APPROVAL OPEN`

## 1. Relationship to nexah.de

The Navigator should be recognizably NEXAH without copying the public homepage
layout. It inherits:

- editorial typography and generous hierarchy;
- the pairing of a Humanist serif with a restrained sans-serif;
- Navy, warm paper, gold, sage and sky as the core palette;
- concise statements, numbered entrances and explicit boundaries;
- the verbal posture “comparison is not identity”.

The current public site uses these foundational tokens:

```text
paper       #f7f4ed
paper-deep  #eee8dc
ink         #0e2746
gold        #8f6526
gold-soft   #d9be84
sage        #728a75
sky         #9ab5c6
night       #071c33
serif       Georgia, "Times New Roman", serif
sans        Inter, system UI, sans-serif
```

The Navigator translates them into a dark **Instrument Mode** rather than
applying an automatic color inversion.

## 2. Instrument Mode tokens

```text
--nav-bg:            #050b12
--nav-night:         #071c33
--nav-panel:         #0b1824
--nav-panel-raised:  #102333
--nav-paper:         #f7f4ed
--nav-ink-soft:      #b9c4ce
--nav-ink-faint:     #7f909e
--nav-line:          rgba(154, 181, 198, .22)
--nav-gold:          #d9be84
--nav-sage:          #86a08a
--nav-sky:           #9ab5c6
```

Science Lab accents may be retained as semantic signals:

```text
cyan     observation / selected path
amber    boundary / threshold / review
magenta  alternate view / unresolved distinction
green    verified or retained relation
violet   historical or return layer
red      rejected, stopped or invalid — never decorative
```

Accent colors never carry status alone; every status also has text and an
icon or shape.

## 3. Typography

- Display statements and short conceptual introductions: `Georgia`.
- Navigation, controls, metadata and dense cards: `Inter` or system sans.
- IDs, hashes and relation codes: system monospace.
- Public headings lead with meaning; codes appear secondarily.
- Avoid all-caps paragraphs. Uppercase is reserved for compact eyebrows,
  states and instrument labels.
- Use the fluid type and spacing rhythm already present on `nexah.de`, with a
  denser scale only inside the catalog and evidence inspector.

## 4. Layout character

The public homepage is spacious and invitational. The Navigator should move
between two densities:

1. **Orientation space** — large statement, three entrances, generous rhythm;
2. **Instrument space** — precise panels, relation paths, evidence and source
   metadata.

The transition between them should feel deliberate, like entering an
observatory or reading room, not like switching to an unrelated admin panel.

## 5. Brand marks and language

- Use the existing `✦ NEXAH` mark where the public brand context requires it.
- Product name: `NEXAH Navigator`.
- Internal label: `Mission Control · Internal Profile`.
- Public label: `Explore relations between bounded views` or a shorter
  editorial equivalent.
- Prefer sentence case and concrete verbs: Explore, Follow, Compare, Inspect,
  Return.
- Do not use “universal map”, “truth engine”, “knowledge OS” or “theory of
  everything” as product claims.

## 6. Core visual components

- **Entrance card:** one reader intention and one clear next action.
- **Relation path:** source, typed edge, target and short explanation.
- **Claim boundary:** persistent bordered field, never hidden in an accordion.
- **Evidence pair:** package-local verdict beside current interpretation.
- **Surface stack:** master, support, variant, historical and copy as visibly
  different roles.
- **Source receipt:** controlling record, release status and provenance.
- **Residual field:** unresolved, lost, outside scope or provisional material.

## 7. Motion and spatial behavior

- Motion explains selection, direction or return; it is not ambient spectacle.
- Respect `prefers-reduced-motion`.
- Never animate evidence status continuously.
- Connection lines may draw on selection, but their textual explanation must
  already be available to keyboard and screen-reader users.
- Avoid large force-directed graphs as the default mobile or public entrance.

## 8. Internal versus public expression

Both profiles share typography, tokens and components.

| Public | Internal |
|---|---|
| curated paths and explanations | complete registers and diagnostics |
| editorial spacing | higher information density |
| released URLs | repository, hash and local status |
| Human-readable names first | IDs and machine fields readily visible |
| no private state | currentness and admission readiness |

This is one visual system with two densities, not two unrelated websites.

## 9. Accessibility and trust

- WCAG AA contrast minimum for text and controls;
- persistent visible keyboard focus;
- no color-only family or evidence coding;
- semantic headings and landmarks;
- relation paths readable in DOM order;
- minimum 44px interactive targets on touch layouts;
- all diagrams have a text-equivalent relation list;
- source, evidence and claim boundary remain reachable without animation.

## 10. Design acceptance gate

Before full UI implementation, create and review three static frames:

1. public orientation home;
2. module/relation detail;
3. internal evidence and admission inspector.

Each frame must demonstrate typography, dark tokens, one relation path, one
claim boundary, one negative or provisional state and mobile behavior. Visual
approval does not authorize publication or expand the public allowlist.

The three responsive acceptance frames are now available at
[`DESIGN_FRAMES/NEXAH_NAVIGATOR_DESIGN_FRAMES_V1_2026-10-06.html`](DESIGN_FRAMES/NEXAH_NAVIGATOR_DESIGN_FRAMES_V1_2026-10-06.html).
They are sample-content design artifacts, not application implementation.
The dependency-free static frame audit currently passes 15 semantic,
responsive, keyboard, reduced-motion and Public/Internal-boundary checks.
Human visual approval was recorded on `2026-10-06` for internal WP3
implementation. That approval covers the dark Instrument Mode, information
hierarchy and relation/evidence treatment demonstrated by the frames. It does
not authorize a public release, populate the public allowlist or change any
scientific claim ceiling.

The approved language is now implemented in the internal read-only pilot at
[`APP/index.html`](APP/index.html). Its separate structural audit passes 39
checks, including keyboard focus, responsive behavior, reduced motion, deep
links, source receipts, evidence pairing and persistent claim boundaries.
