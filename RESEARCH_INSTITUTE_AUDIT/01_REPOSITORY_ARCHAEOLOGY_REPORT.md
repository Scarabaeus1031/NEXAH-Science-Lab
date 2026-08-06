# Repository Archaeology Report

## Overall finding

NEXAH already functions as a distributed research institute. Its structure is
not absent; it is expressed through overlapping generations:

```text
visual inquiry and working notes
→ exploratory models and scripts
→ bounded experiments
→ validation packages
→ evidence and review records
→ architecture and specification
→ applications and publications
```

The principal defect is uneven traceability between these generations. The
repository is strong at preserving work and weak at giving every bounded
question one stable identity and one terminal report. 【N-RES; N-EVID; M02】

## Archaeological strata

| Stratum | Representative homes | Function | Current reading |
|---|---|---|---|
| Constitutional | `GOVERNANCE/`, adopted architecture | authority and boundary | canonical |
| Semantic | `ORIENTATION_LANGUAGE/` | published OLS semantics | canonical publication |
| Foundational research | `RESEARCH/FOUNDATION/`, `CORE_CONCEPTS/` | variables, candidate objects, semi-formal propositions | mixed working and speculative |
| Experimental research | `RESEARCH/VALIDATION/`, `EXPERIMENTAL/`, application Labs | scripts, datasets, runs, figures | mixed maturity |
| Bounded evidence | `validation/`, Evidence Atlas, frozen study packages | replay, comparison, claims and limits | strongest research stratum |
| Application research | power systems, network orientation, orientation translation | domain-bounded use and method studies | working to validated within local scope |
| Editorial research | Library Works, atlases, whiteboards, reports | observation, synthesis and visual language | provenance and hypothesis source; not scientific authority |
| Historical | archive trees, Builder Lab lineages, superseded visuals and outputs | preserved development | reference only |

## Recurring themes

1. representation versus source;
2. observation, projection and information loss;
3. state, transition, path and boundary;
4. field reconstruction and directional structure;
5. coherence, mismatch, gates and transition diagnostics;
6. graph structure, reachability, compression and navigation;
7. provenance, uncertainty and failure classification;
8. comparison across heterogeneous representations;
9. Human authority and evidence-bound reporting.

These themes recur independently in Research, OLS, Applications, Library
Works, Rödelheim Labs and the Science Lab distillations. Recurrence does not
establish one physical mechanism. 【N-CON; N-RES; N-LIB; M01】

## Maturity assessment

### Most mature

- OLS 1.0 as a semantic publication, not as scientific proof;
- finite inverse-problem objects and protocol design around Lab 0.4;
- IEEE Geometry V1 as a bounded benchmark package, with the clean-replay
  failure preserved;
- Network Orientation as a typed, illustrative graph application;
- finite prime and wheel/product comparisons, especially their negative
  results;
- source-bounded Orientation Translation pilots and their review records.

### Working

- representation-indexed state/transition systems;
- field and trajectory reconstruction;
- graph reduction and transport compression;
- observer/projection geometry;
- reader-orientation methodology;
- Gate Instability as a namespaced research measure.

### Exploratory

- JANUS as a unique directional-coherence diagnostic;
- phase mismatch as a transition mechanism;
- emergent topology and generalized transport anatomy;
- control, early-warning and universality claims;
- prime-modular resonance narratives;
- visual cross-domain correspondences without declared maps.

## Document functions already present

| Function | Existing examples |
|---|---|
| Foundational definitions | OLS release; `RESEARCH/FOUNDATION/core_variable_map.md`; bounded Mathematical Core; Lab 0.4 protocol definitions |
| Observations | Field Notes; pilot observation records; experimental logs; source records; Library visual Works |
| Literature reviews | Program E; research translations; theoretical-positioning documents; application method reviews |
| Experimental reports | Rödelheim Labs 0.2–0.4; Orientation Translation pilot/study reports; validation `RESULTS.md`; IEEE reports |
| Final reports | Program closeouts; Evidence Atlas claim dispositions; external replay reviews; bounded study final dispositions |
| Historical only | Builder Lab archive, archived Kernel/Engine generations, historical root outputs, superseded architecture visuals |

## Fragmentation and duplication

- `RESEARCH/README.md`, `RESEARCH_INDEX.md`, `RESEARCH_VISION.md`,
  `CORE_CONCEPT_MAP.md` and `PAPER_DRAFT.md` repeat the transition-geometry
  narrative with different certainty levels.
- Power-system research contains `88` principal experiment directories and
  `87` output directories under one active campaign; questions, methods and
  conclusions are often split across long logs.
- JANUS contains at least `30` `EXP_*.py` scripts across several sublineages
  without one frozen operator contract.
- Empty or partial historical shadow paths coexist with active application
  paths. Placement alone cannot determine authority.
- Exact Markdown duplication is limited: six hash-identical groups were found.
  The larger problem is semantic repetition and historical layering, not
  byte-identical copies.

## Archaeological conclusion

The repository does not need another comprehensive research narrative. It
needs a thin question-and-Lab orientation layer over the sources that already
exist. No underlying artifact should move merely to make that layer possible.

