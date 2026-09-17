# Prime Work — Repository Placement Decision

Status: `PROPOSED PLACEMENT / NO FILE MOVE EXECUTED`

## Decision

The existing Prime Modular Resonance work in the NEXAH Core repository and
the Prime Genesis packages in the Science Lab are adjacent, but they are not
the same method family and must not be merged wholesale.

- **Prime Modular Resonance** studies prime-residue sequences modulo `m`,
  transition frequencies, graph/flow behaviour, cycle structure and drift.
- **Prime Genesis** studies carrier and generator history, persistent
  addresses, domain-bound CRT reconstruction, typed views/format lenses,
  cut/loss/return and observer-relative representations.

The shared surface is modular arithmetic, residue classes, CRT/product spaces
and representational change. The scientific questions and current evidence
ceilings remain different.

## Repository roles

### NEXAH Core

Keep stable definitions, reusable adopted interfaces and mathematical
cross-links here. The existing `RESEARCH/FINDINGS/PRIME_MODULAR_RESONANCE`
family remains in place. Add a Prime Genesis crosswalk only after the Science
Lab method has an explicit adoption decision.

Do **not** copy the Prime Genesis source corpus, screenshots, local gate runs
or unselected HTML variants into Core.

### Science Lab

Keep source custody, manifests, hashes, audit scripts, fixtures, negative
results, synthetic gates and current controlling evidence here. The current
Prime Genesis authority is:

1. dual-generator return for its bounded synthetic scope;
2. CRT Elevator / QRT Format Lens as the latest controlling gate;
3. no ecosystem-wide adoption and no physical-law claim.

### NEXAHEDRON

Use for curated experience-layer copies of selected HTML/GLB demonstrators.
Every copy must point back to its Science Lab source hash and must display
results without silently recomputing or widening the claim.

### Mission Control

Hold only the locator, currentness statement, owner, review date and links to
the controlling Science Lab package and any adopted Core interface.

## Immediate use decision

The Prime Genesis material should currently be used as:

- a method-development and audit corpus in Science Lab;
- a source of bounded demonstrations of persistent address, generator history,
  CRT reconstruction and typed residual views;
- a candidate crosswalk to Prime Modular Resonance, not an extension of its
  findings;
- a provenance source for future NEXAHEDRON demonstrators.

It should not currently be used as:

- proof of a general prime law;
- a canonical replacement for Prime Modular Resonance;
- a production runtime dependency;
- a current technical-status dashboard merely because an HTML file renders.

## Safe next integration step

Create one small crosswalk document, after owner review, containing only:

| Shared concept | Core term | Science Lab evidence | Adoption state |
| --- | --- | --- | --- |
| residue address | prime residue modulo `m` | persistent address / CRT gate | not adopted |
| transition | residue transition graph | carrier/query/transform/return | analogy only |
| product space | CRT/product-space note | domain-bound CRT reconstruction | bounded support |
| view change | graph/flow projection | typed format lens | bounded support |

No source code or artifact promotion is required for that crosswalk.

## Worktree caution

The NEXAH Core worktree currently contains pre-existing modified and untracked
files. This review therefore made no Core edit and did not stage, overwrite or
reclassify those changes.
