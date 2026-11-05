# A0 Z100 Periodic Carrier — bounded candidate contract

Date: `2026-11-03`
Status: `OWNER_REQUESTED_DIAGNOSTIC_CANDIDATE / R0_DOCUMENTED / NOT_ADMITTED / NOT_ACTIVE`
Owning source: existing A0 package
Human Owner request: implement the six bounded fields `register → views → ledger → control → return → STOP`
Scientific authority: A0 Science Desk / Science Lab
Implementation authority: A0 source package

## Question

Can one bounded carrier of official element identities `Z=1..100` be shown in
three declared representations while preserving exact identity and making
changed adjacency visible?

The candidate tests orientation and representation bookkeeping. It does not
test a new element, alternative chemistry, material mechanism or natural cube
law.

## 1. Official carrier

`Z100` contains exactly the first 100 official element records. The local data
cut is derived from the PubChem PUG REST Periodic Table endpoint and retains
atomic number, symbol, name, atomic mass, CPK colour, electron configuration
and GroupBlock classification.

`Z100` is a new local label for this bounded demonstrator, not a Source Graph
identity or chemistry vocabulary proposal. The existing A0 label `C100` is
already used as a carry/closure label by the `69 → C100` transition corridor
and is therefore deliberately not reused.

## 2. Three declared views

1. `MODERN` — conventional period/group placement, with lanthanide and
   actinide rows displayed separately.
2. `CYCLE` — a Russell-inspired cyclic reading of atomic order. It is a
   declared visual lens, not Russell chemistry and not a natural law.
3. `Z100` — a constructed `10 decks × 10 slots` address carrier. The geometry
   is chosen for inspection; it is not discovered in the element register.

Every view returns to the same `(Z, symbol)` pair.

## 3. Comparison ledger

For one selected element, the modern layout is compared with either the cyclic
or Z100 layout. Orthogonal or declared local neighbours are classified as:

- `RETAINED` — neighbour in both views;
- `LOST` — neighbour in the modern view only;
- `INTRODUCED` — neighbour in the comparison view only;
- `UNRESOLVED` — missing or untyped address. The current complete fixture
  expects the empty set.

This ledger describes view adjacency only. It does not transfer element
properties.

## 4. External control

`Mendelevium · Md · Z=101` remains visible outside Z100 as the official
boundary control. It prevents the instrument's `+1` position from being read
as an unnamed or NEXAH-defined chemical element.

## 5. Return position

`ULLINIRIUM` reuses the existing historical NEXAH view-anchor meaning as a
meta/observer/return position outside the material carrier. It has no atomic
number, symbol, material identity or chemical property in this candidate.

No spelling alias is normalized and no new Navigator relation is inferred.

## 6. STOP

Stop and classify the candidate invalid for its intended scope if any
implementation or interpretation:

- places ULLINIRIUM inside the element register or assigns it `Z=101`;
- relabels Mendelevium or any other official element;
- infers chemical properties from view adjacency or geometry;
- treats the cyclic view as evidence for Russell chemistry;
- presents the 10×10 carrier as a natural periodic structure;
- claims a physical mechanism, new substance or scientific discovery;
- changes a Source Graph identity or typed relation without admission.

## Bounded Lantern calibration — Pa-231 / 5f

The Periodic Carrier reuses the already implemented A0 Sevenfold Comparator as
a finite view-switch calibration. It does not introduce another comparator or
another machine.

- carrier: the documented `Pa-231` record;
- cut A: `91=7×13`, `140=7×20`, `231=7×33`;
- cut B: `l=3`, `2l+1=7`, `m_l=-3..+3`;
- retained: only `cardinality:7`;
- lost: nuclear-partition meaning;
- introduced: angular-slot labels;
- unresolved: causal coupling and any shared physical mechanism;
- result: `CARDINALITY_ONLY_PASS` followed by `STOP`.

The calibration binds to the existing NLK comparator, Science source bridge
and Builder return. Equal counts from different physical descriptions do not
create an identity, a mechanism or a Navigator relation.

## Baseline and controls

- baseline: official `(Z, symbol)` identity and modern period/group placement;
- positive control: every view returns the selected record to the same
  `(Z, symbol)` pair;
- boundary control: `Md · Z101` remains outside the bounded carrier;
- negative control: ULLINIRIUM is absent from all 100 element records;
- completeness control: 100 unique Z addresses, symbols, modern addresses and
  Z100 addresses;
- interpretation control: all ledger outputs are explicitly view-local.

## Result vocabulary

`PASS`, `IDENTITY_MISMATCH`, `DUPLICATE_ADDRESS`, `MISSING_ADDRESS`,
`BOUNDARY_CONTROL_FAILURE`, `META_AS_ELEMENT_FAILURE`,
`UNSUPPORTED_CHEMISTRY_INFERENCE`, `UNINFORMATIVE_VIEW`.

## Files and replay

- data fixture:
  `A0_BOOK/DRAFTS/a0-periodic-elements-z100-pubchem.js`
- model and controller:
  `A0_BOOK/DRAFTS/a0-periodic-carrier-z100.js`
- diagnostic surface:
  `A0_BOOK/DRAFTS/A0_PERIODIC_CARRIER_Z100_2026-11-03.html`
- exact checks:
  `A0_BOOK/DRAFTS/a0-periodic-carrier-z100-tests.cjs`

Replay:

```bash
node A0_BOOK/DRAFTS/a0-periodic-carrier-z100-tests.cjs
```

## Authority and return

This build reuses the existing A0 package, Russell X-Tensions carrier
analysis, Chemistry Foundations glossary, Chemistry Six Plus One bridge and
ULLINIRIUM view-anchor records. It creates no new Study, Family, Source Graph
entity, relation, alias, result or publication authority.

Navigator effect: `0 entities / 0 relations / 0 aliases`; the candidate is a
source-bound diagnostic lens only. Admission, activation, scientific adoption,
canonical naming, integration into the maintained A0 navigation and public
release remain separate Human Owner and Desk gates.
