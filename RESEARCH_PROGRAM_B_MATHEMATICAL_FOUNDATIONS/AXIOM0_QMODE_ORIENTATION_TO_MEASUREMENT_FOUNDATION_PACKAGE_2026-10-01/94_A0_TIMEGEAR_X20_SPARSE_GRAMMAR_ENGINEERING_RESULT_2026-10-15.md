# A0 Timegear ×20 — sparse graph grammar engineering result

**Date:** 2026-10-15  
**Status:** `PASS_EXACT_SOURCE_INSPIRED_GRAPH_MATCH_WITH_PROVENANCE_CAVEAT`  
**Authority:** owner-authorized A0 engineering derivation; not a Laboratory run, not a Navigator identity change, not publication authorization

## Result in one sentence

The `400 / 420 / 600` Timegear supplies an exact twenty-address carrier, and one explicitly declared sparse seam grammar on those twenty addresses is exactly isomorphic to the existing frozen Q106 twenty-node target interface as an undirected graph.

This is a useful engineering bridge candidate. It is **not independent evidence** for a historical X20 adjacency because Q106 was already known when the candidate grammars were formalized.

## Exact source-bound arithmetic

For gate index \(g\in\{0,\ldots,19\}\), the wheel readout is

\[
(20g\bmod 400,\;21g\bmod 420,\;30g\bmod 600).
\]

Therefore:

- \(\gcd(400,420,600)=20\);
- the common gate spacing is \(360^\circ/20=18^\circ\);
- each gate advances the three wheels by exactly \((20,21,30)\) ticks;
- \(\operatorname{lcm}(400,420,600)=8400\);
- the full common return contains respectively \((21,20,14)\) wheel revolutions;
- \(g=0\) is the marked origin and \(g=10\) its antipode.

No arithmetic in this block establishes the visual's `0.464°` drift, a map to the Euler–Mascheroni constant, or a `.83` stability band.

## Twenty-address contracts

Two bijections were kept separate:

1. **Primary ordered contract:** \(g=4i+j\), with \(i\in C_5\) and \(j\in P_4=\{0,1,2,3\}\). This is a five-by-four address system; it does not assume that the four roles form a cycle.
2. **CRT control:** \((i,j)=(g\bmod 5,g\bmod 4)\). This is also a bijection, but treating the second coordinate as \(C_4\) adds cyclic structure and is therefore only a control.

Neither contract by itself proves that `g=0` is the historical `D1 / p0` register. That identification still needs a typed address map.

## Graph-grammar comparison

The source image constrains the address carrier and the twenty gates, but it does not uniquely prescribe adjacency. Five sparse, finite grammars were therefore tested rather than silently choosing one.

| Candidate | V | E | Components | Degree profile | Girth | Cycle rank | Q106 result |
|---|---:|---:|---:|---|---:|---:|---|
| `C20_RING` | 20 | 20 | 1 | \(2^{20}\) | 20 | 1 | rejected |
| `FOUR_DISJOINT_C5` | 20 | 20 | 4 | \(2^{20}\) | 5 | 4 | rejected |
| `C5_CARTESIAN_P4` | 20 | 35 | 1 | \(3^{10},4^{10}\) | 4 | 16 | rejected |
| `C5_ROOT_WITH_LENGTH3_TAIL` | 20 | 20 | 1 | \(1^5,2^{10},3^5\) | 5 | 1 | degree match only; rejected by girth |
| `C10_SEAM_STITCH_WITH_LENGTH2_TAIL` | 20 | 20 | 1 | \(1^5,2^{10},3^5\) | 10 | 1 | **exact undirected isomorphism** |

Degree counts alone are insufficient: two candidates share the Q106 degree profile. The girth distinguishes them, after which the explicit edge map confirms the exact match.

## Exact candidate map

For each \(i\in C_5\):

| Timegear address | Q106 target role |
|---|---|
| \((i,0)\) | `I_ii_02_01` |
| \((i,1)\) | `S_01_0i` |
| \((i,2)\) | `S_02_0i` |
| \((i,3)\) | `S_03_0i` |

The seam carrier node \((i,1)\) connects the two adjacent gate nodes \((i,0)\) and \((i+1,0)\), then continues through \((i,2)\) to the terminal \((i,3)\). Across five indices this produces:

- ten gate–carrier seam edges forming a ten-cycle;
- five carrier–inner edges;
- five inner–return edges;
- twenty vertices and twenty edges in total.

Under the tabled map, all twenty candidate edges and all twenty Q106 target edges coincide.

## Scientific interpretation

What is now supported:

- Visual 1 can be translated into an exact \(C_{20}\) phase/address carrier rather than used only as metaphor.
- A sparse `5 × 4` seam grammar exists that reproduces the frozen Q106 target topology exactly.
- The result gives a concrete data structure for `gate → carrier → inner → return` and a testable starting point for the Rohrpost/coupling table.
- Four plausible alternative grammars fail, so the result is not merely a consequence of using twenty nodes.

What is **not** supported:

- that the matching adjacency was independently predicted by the owner visual;
- that the map is a directed operator intertwiner;
- that `D/E`, `LR/RL`, `D1/p0`, Fibonacci, Ihara, Riemann, Euler, primes or physical phase already have typed roles in this graph;
- that `0.464°`, \(\gamma\), `.83`, or a physical mechanism follow from the wheel arithmetic;
- novelty, historical provenance, or a canonical X20 replacement.

The optional forty-state `D/E` construction is only a two-state display lift over the twenty addresses. Its fibres have size two, but this is not the previously tested dodecahedral D/E quotient and must not be conflated with it.

## Open gates, in priority order

1. **P-01 — independent provenance.** Find an owner note, earlier module, or preregistered use task that specifies the seam-stitch adjacency without reading Q106. Passing this gate would convert a source-inspired fit into a genuine prediction/confirmation sequence.
2. **P-02 — typed phase map.** Define `D/E`, `D1…`, `E1…`, `p0`, and `LR/RL` as domains and operators, then test whether the twenty-address quotient commutes with them.
3. **P-03 — drift/stability equations.** Supply equations, units, observations, and falsifiable thresholds for `0.464°`, \(\gamma\), and `.83` before any dynamic or physical language is admitted.

After P-01 or a deliberate engineering freeze, the next useful test is directed: assign orientation and branch words to the twenty edges, compute transition matrices, and test whether the proposed map preserves composition and return—not merely undirected adjacency.

## Geometry correction from Visual 4

For an isosceles triangle with equal sides \(L\) and apex angle \(36^\circ\), the base is

\[
b=2L\sin(18^\circ),
\]

not \(2L\sin(36^\circ)\). The `204 × 204` square diagonal \(204\sqrt2\) is exact, but no tested coupling to the Timegear follows from that fact alone.

## Reproducibility

- Runner: `A0_BOOK/a0-timegear-x20-sparse-grammar-tests.cjs`
- Source extract: `A0_BOOK/assets/a0-timegear-x20-owner-visual-extract-v1.json`
- Machine result: `A0_BOOK/results/a0-timegear-x20-sparse-grammar-result-2026-10-15.json`
- Result: **12 PASS / 0 FAIL**
- Deterministic replay: byte-identical across two consecutive runs
- Result SHA-256: `bdee7340ce17048fafff0f4e1c3fa16bd8174db67fa3968c5cc33313a4e6eb4e`

No source-graph relation, Navigator identity, binder, canonical count, publication surface, or Laboratory study was created or changed by this engineering result.
