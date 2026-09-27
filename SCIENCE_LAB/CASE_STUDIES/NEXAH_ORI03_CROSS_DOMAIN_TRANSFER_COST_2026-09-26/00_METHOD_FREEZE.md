# NEXAH-ORI-03 — Cross-Domain Transfer Cost

Date: 2026-09-26  
State: frozen before execution  
Test class: deterministic internal software-structure benchmark

## Question

With equal canonical information and equal claim-decision requirements, is one reusable NEXAH orientation contract simpler or more efficient than a strong generic requirements-and-provenance baseline when transferred across domains?

## Domains and cases

Development cases:

1. statistics — aggregate record lacks department context;
2. particle physics — visible positron record lacks unique upstream history;
3. historical map — visual similarity lacks provenance, georeferencing transform and control points.

Transfer control:

4. a clean descriptive count claim for which all requirements are present.

The cases are internal positive/negative controls derived from already closed NEXAH-ORI-01, NEXAH-ORI-02 and TOP-Ecosystem-03. They are not sealed external evidence.

## Equal-information contract

Each arm receives the same canonical fields:

- source identifier;
- available evidence;
- claim requirements;
- introduced operations;
- unresolved items;
- expected decision.

Both arms must return `ALLOW` or `BLOCK`, the missing requirements and a trace to the source. Neither arm may use domain-name-specific branching.

## Implementations

- Strong baseline: generic requirement-set comparison plus provenance trace.
- NEXAH: generic mapping to `Omega, X, Q, sigma, I, L, A, U, epsilon` plus the same requirement-set decision.

## Frozen metrics

- decision correctness and parity across all four cases;
- core changes needed for the transfer-control case;
- nonblank/noncomment logical source lines per evaluator;
- evaluator source bytes;
- median execution time over 10,000 complete four-case passes, repeated seven times;
- serialized result bytes for equal decision/trace output and for the full NEXAH ledger;
- trace completeness: source, decision, missing requirements and unresolved items present.

Runtime is a local microbenchmark and may not support claims below a 20% difference. Source size is an engineering proxy, not development time or cognitive load.

## Gates

- `G1_EQUAL_INFORMATION`: both arms derive from the same canonical cases.
- `G2_CORRECTNESS`: both arms match all expected decisions.
- `G3_PARITY`: both arms return identical decisions and missing requirements.
- `G4_ZERO_CORE_TRANSFER_CHANGE`: neither engine requires modification for case four.
- `G5_TRACE_COMPLETENESS`: both arms return the required trace fields.
- `G6_NEXAH_SMALLER_EXECUTABLE_LOGIC`: NEXAH evaluator has fewer logical lines and source bytes.
- `G7_NEXAH_SMALLER_EQUAL_OUTPUT`: NEXAH equal-output projection serializes to fewer bytes.
- `G8_NEXAH_RUNTIME_ADVANTAGE`: NEXAH median runtime is at least 20% lower.

## Outcome rule

- `SIMPLER_AND_FASTER`: G6, G7 and G8 all pass.
- `BOUNDED_TRADEOFF`: correctness/parity pass and at least one efficiency gate passes while another fails.
- `NO_EFFICIENCY_ADVANTAGE_SHOWN`: correctness/parity pass and G6–G8 all fail.
- `INVALID`: any of G1–G5 fails.

Full-ledger trace richness is reported separately and cannot compensate automatically for failed efficiency gates.
