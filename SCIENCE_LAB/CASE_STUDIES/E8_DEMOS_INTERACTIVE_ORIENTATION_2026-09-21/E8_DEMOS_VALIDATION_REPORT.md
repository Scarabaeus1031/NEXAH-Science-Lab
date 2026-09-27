# E8 DEMOS — Validation Report

## Executive Summary

The six-file `E8 DEMOS` source folder is preserved byte-for-byte and integrated
as a bounded interactive-orientation package. Both HTML files have valid
static HTML/JavaScript structure, initialize a 2D canvas, contain no external
runtime dependency, and declare responsive layouts.

The mathematical reference is separable from the NEXAH model layer. The bound
E8-REP-03 data contain 240 unique eight-dimensional roots, comprising 112
integer roots and 128 even-parity half roots; every squared norm is exactly 2.
Both HTMLs embed the same 240 distinct two-dimensional points in eight groups
of 30. Those points match the bound Coxeter-plane CSV after one uniform signed
scale with maximum coordinate error below `5.03e-7`.

Neither original HTML constructs the 8D roots in-browser. Neither computes the
mass-weighted AXIS08 quotient. They draw a declared p7/p8-to-one-target model.
The two drawings are related but not identical implementations. These intake
facts remain unchanged. Repair R1 adds a separate canonical successor that
constructs the roots, computes the declared weighted quotient, defines a
stable tie rule and provides lossless State-record import/export.

Decision:

`B — E8_DEMOS_TECHNICALLY_VALID_MODEL_BOUNDARIES_RECORDED`

Repair evidence: `12/12 PASS`. Independent browser-console capture and
regenerated screenshots remain `NOT_TESTABLE` in the available environment.

## Source inventory

| File | Role | Bytes | SHA-256 status |
|---|---|---:|---|
| `NEXAH_E8_AXIS08_Coupling.html` | focused E8/AXIS08 drawing | 16,129 | verified |
| `NEXAH_E8_AXIS08_Coupling.png` | supplied preview | 232,800 | verified |
| `MIWA_PINEAP_AN_DROMEDA(1).html` | multi-frame star-map demonstrator | 86,397 | verified |
| `MIWA_PINEAP_AN_DROMEDA_RECORD(1).json` | documentary fixture record | 11,932 | verified |
| `MIWA_PINEAP_STAR_MAP_TEMPLATE(1).csv` | 16-row import template | 1,297 | verified |
| `MIWA_Projection_Lab_Extension_Preview.png` | supplied extension preview | 281,123 | verified |

Exact paths, timestamps, MIME types and hashes are in
`E8_DEMOS_MANIFEST.json`.

## Technical reproducibility

### Confirmed

- both documents parse statically and contain one valid inline script;
- both canvases and their controls are bound in source;
- there are no network libraries, fonts, APIs or remote data dependencies;
- the supplied local CSV link is present;
- the source hashes, JSON record and CSV template are reproducible;
- the procedural MIWA carrier generators use fixed seeds;
- the responsive breakpoints are declared.

### Not fully confirmed

Local-file navigation was blocked by the available browser security policy.
Therefore browser-console freedom, interaction behavior, visual breakpoints
and measured runtime performance are `NOT_TESTABLE` in this pass. The two
supplied PNG previews are preserved but are not claimed as independently
regenerated screenshots.

The focused demo throttles its animated redraw. The MIWA demo runs a continuous
animation and the E8 frame may perform up to 48×240 nearest-point distance
checks per frame. This is plausible for a desktop fixture but remains
unprofiled on mobile hardware.

## Mathematically confirmed reference

The bound reference files independently confirm:

- 240 unique E8 vectors in eight dimensions;
- 112 vectors of type `(±1, ±1, 0, …, 0)`;
- 128 vectors of type `(±1/2, …, ±1/2)` with even negative-sign parity;
- squared norm 2 for all vectors;
- eight Coxeter-plane groups of 30;
- the embedded HTML arrays correspond to the bound projection up to one
  uniform signed scale and six-decimal rounding.

This confirms the reference chain, not a new theorem and not a physical
identity.

## Demonstrator A — E8 × AXIS08

### What it does

It draws the fixed 240-point reference, eight outer poles, seven inner points,
two lines from p7/p8 to the seventh inner point, and a split curve. The coupling
slider maps its range linearly to `t = slider/4`; the displayed `10^κ` label
does not cause a physical or mass-weighted computation.

| Test | Result | Invariant | Residual/boundary |
|---|---|---|---|
| κ = 0 | inner radius `0.27R`; weaker line styling | 240 points, 8 poles, 7 targets | not an uncoupled physical solve |
| small positive κ | linear display interpolation | counts and memberships | coupling is visual |
| large positive κ | inner radius up to `0.35R`; stronger styling | counts and memberships | no mass or stiffness matrix |
| ε = 0 | straight center curve | reference and pole structure | zero bend is display state |
| ±ε | mirrored bend | absolute parameter magnitude | representation change only |
| p7↔p8 | `NOT_TESTABLE` | fixed drawing is symmetric | no swap control |
| p7=p8 | `NOT_TESTABLE` | — | no pole input model |
| p7=−p8 | `NOT_TESTABLE` | — | fixed poles are adjacent |

## Demonstrator B — MIWA Projection Lab Extension

Nine navigation frames are declared, including `E8 · AXIS08` and
`Tessarec · Qι Pearl`. CSV and JSON star catalogs can be imported when they
contain a carrier plus x/y or RA/Dec coordinates. Empty catalogs fail closed;
identical rows are preserved rather than silently deduplicated.

The nearest-E8 assignment scans all 240 embedded points and retains the first
minimum. It is deterministic for fixed input but an exact tie is resolved by
array order, not by a separately declared scientific rule.

The Q4 fixture has 16 nodes and 32 one-bit edges. Q-layer, iota angle,
direction, cut depth and Pearl aperture affect the observer projection and its
hit count. Cut hits are view selections, not astronomical detections.

The export contains the new projection parameters and claim boundaries. It
does not contain a restorable star catalog or complete canvas state, and there
is no State-record import path. Export→reimport therefore fails.

## AXIS08 comparison

Original-source status: `DIFFERENT`

The same conceptual drawing is duplicated with different formulas:

- focused demo inner radius: `0.27 + 0.08t`;
- MIWA demo inner radius: `0.25 + 0.09t`;
- focused split scale: `0.95R`;
- MIWA split scale: `0.90R`.

This is an implementation and parameter difference, not merely a camera or
color difference. Neither original implementation performs the numerical
weighted quotient from the separate AXIS08 experiment. Repair R1 supersedes
both formulas for current use with one shared `weightedAxis08` implementation;
the originals remain preserved as historical intake evidence.

## Repair R1 verification

Repair R1 is deliberately separated from `SOURCE_SNAPSHOT` and contains:

- `e8_axis08_core.js`: one offline UMD module usable in Node and a browser;
- `E8_AXIS08_REPAIR_LAB.html`: interactive numerical audit harness;
- `test_repair.js`: deterministic fail-closed regression battery.

The test battery passes all 12 checks:

1. construction of 240 unique 8D E8 roots as 112 integer and 128 half roots;
2. squared norm 2 for every constructed root;
3. numerical weighted 8-to-7 AXIS08 quotient;
4. swap invariance when poles and their weights are exchanged together;
5. correct identical-pole result;
6. correct opposite-pole result for equal weights;
7. fail-closed zero-sum weights;
8. input-order-independent nearest-point tie rule;
9. fail-closed empty nearest-point set;
10. lossless State export/import for the declared R1 schema;
11. rejection of foreign State schemas and deterministic repeated state;
12. bounded Node workload benchmark for 48×240 assignments repeated 100 times.

The split parameter remains a visualization coordinate and is not presented as
part of the affine quotient. Coupling changes display emphasis; the weights,
not the styling control, define the numerical quotient.

## Invariants and observer-dependent quantities

| Retained/reference | Observer/model dependent |
|---|---|
| source hashes | animation angle and timestamp |
| 240 embedded points | rotation, scale and canvas position |
| eight groups of 30 | star normalization and nearest anchor |
| Q4 16-node/32-edge combinatorics | Q-layer screen projection |
| imported raw fields in node metadata | cut hits and aperture support |
| explicit physical-nonidentity boundary | styling and inner-radius interpolation |

## Open residuals

Two environment-bound residuals remain:

1. no independent browser execution or console capture in the available local-file browser policy;
2. no independently regenerated screenshots or mobile-browser profile.

The former functional residuals are closed in Repair R1. The original files
are not retroactively relabeled; their differences remain documented and their
hashes remain unchanged.

## Known limits and nonclaims

The package does not establish:

- physical identity between E8 and star positions;
- cosmic resonance or a universal field law;
- a new E8, H4, Coxeter, quaternion or hypercube theorem;
- physical four-dimensional geometry;
- measured astronomy from procedural carrier data;
- a universal 8→7 reduction law;
- an activated NEXAH or ORION capability.

## Final decision

The artifacts are useful, bounded visual instruments with a verified
mathematical reference and explicit nonclaim language. Repair R1 supplies a
deterministically tested canonical operator and record boundary. Decision A is
still inappropriate because no physical theory, browser conformance campaign
or independent scientific validation is claimed. Decision B now accurately
describes the bounded technical result.

`B — E8_DEMOS_TECHNICALLY_VALID_MODEL_BOUNDARIES_RECORDED`
