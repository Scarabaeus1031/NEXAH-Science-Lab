# Research Roadmap

Status: `DOCUMENTATION ONLY`

## Sequence

```text
Architecture
↓
Protocol
↓
Replayable experiment
↓
Mathematical question
↓
Formal definitions
↓
General result
↓
Independent review
↓
Publication
```

The sequence is a research gate. It does not imply that every protocol will
produce a theorem or publication.

## Phase A — Consolidate evidence

Purpose: establish the exact finite source object already present.

Actions:

1. Locate the existing finite projection experiments and protocol sources.
2. Identify the frozen source set, observation maps, tolerances and outputs.
3. Verify that required inputs and result records can be replayed.
4. Preserve source identity and provenance without treating them as observed
   identifiability.
5. Record missing inputs, hashes, software independence and review roles.

STOP when the source table, maps, tolerance or provenance cannot be frozen.

## Phase B — Formalize the finite problem

Let `S ⊂ ℝ³` be a finite labeled source set and let

```math
H_i : \mathbb{R}^3 \to \mathbb{R}^2
```

be a finite family of declared linear observation maps.

For tolerance `ε`, define:

```math
x \sim_i x'
\iff
\lVert H_i x-H_i x'\rVert \leq \varepsilon.
```

Study only:

- indistinguishable pairs under each view;
- unresolved equivalence classes;
- minimal view families that separate all admitted source pairs;
- stability under bounded perturbation.

The finite problem shall retain the existing distinction between source labels
and observational equivalence.

STOP when the norm, tolerance, matching rule, source domain or observation
family is not fixed before analysis.

## Phase C — Seek one nontrivial result

Candidate result types:

- lower or upper bounds on minimal separating view families;
- characterization of separation failure;
- a perturbation-stability theorem;
- a complexity or approximation result for view selection.

Do not select or advertise a theorem before the literature review identifies
the established formulation, prior results and mandatory baselines.

One general result is sufficient. Additional terminology or a general geometry
is not required.

STOP when the proposed result is already standard, depends on post-result
definitions or exceeds the evidence boundary.

## Phase D — External review

Compare the frozen question and any result with:

- inverse problems;
- observability;
- sensor selection;
- invariant theory;
- multi-view geometry;
- combinatorial test cover;
- projective methods;
- equivariant methods.

Only after independent disciplinary review may novelty be discussed. Absence of
known duplication after an internal search is not a novelty result.

Publication requires a bounded claim, complete definitions, reproducible
evidence or proof, explicit limitations and preserved provenance.

## Cross-references

| Role | Existing source |
|---|---|
| Mathematical Foundations | [`../README.md`](../README.md) and [`../01_FOUNDATIONAL_QUESTIONS.md`](../01_FOUNDATIONAL_QUESTIONS.md) |
| Visual Intuitions boundary | [`../04_VISUAL_INTUITIONS.md`](../04_VISUAL_INTUITIONS.md) |
| Scientific Position Statement | [`../../RESEARCH_PROGRAM_E_SCIENTIFIC_POSITIONING/09_POSITION_STATEMENT.md`](../../RESEARCH_PROGRAM_E_SCIENTIFIC_POSITIONING/09_POSITION_STATEMENT.md) |
| Primary finite chain | [`../../RESEARCH_PROGRAM_F_CROSS_PROGRAM_SYNTHESIS/05_PRIMARY_CHAIN_SCIENTIFIC_SPECIFICATION.md`](../../RESEARCH_PROGRAM_F_CROSS_PROGRAM_SYNTHESIS/05_PRIMARY_CHAIN_SCIENTIFIC_SPECIFICATION.md) |
| Finite projection protocol | [`../../RESEARCH_PROGRAM_G_PROTOCOL_DESIGN/01_RESEARCH_PROTOCOL.md`](../../RESEARCH_PROGRAM_G_PROTOCOL_DESIGN/01_RESEARCH_PROTOCOL.md) |
| Frozen Scientific Definitions | [`../../RESEARCH_PROGRAM_G_PROTOCOL_DESIGN/02_FROZEN_SCIENTIFIC_DEFINITIONS.md`](../../RESEARCH_PROGRAM_G_PROTOCOL_DESIGN/02_FROZEN_SCIENTIFIC_DEFINITIONS.md) |
| Critical assessment | Accepted ORION review in the mission record; no separate repository file |
| Constitutional context only | [`../../NEXAH_CONSTITUTION/PART_I_PRINCIPLES.md`](../../NEXAH_CONSTITUTION/PART_I_PRINCIPLES.md) |
| Human-purpose context only | [`../../NEXAH_CONSTITUTION/LUCY/WHY.md`](../../NEXAH_CONSTITUTION/LUCY/WHY.md) |

The Constitution and `WHY.md` are contextual boundaries. They are not
mathematical evidence.

## Next gate

```text
NEXT PERMITTED ACTION: OWNER REVIEW
```

No protocol execution, experiment, theorem claim, external submission or
implementation is authorized by this roadmap.
