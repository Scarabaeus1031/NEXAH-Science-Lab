# Random and Adversarial Controls

Frozen before execution on 2026-08-23.

## I — matched frozen-role null

Match D on six nodes, six edges, exact P–S stem, two initial non-stem S branches, normalized bounding box, approximate density, and total edge length within ±15%. P, S and R are assigned before geometry scoring. Random geometry may accidentally contain cycles or near-return points, but no role may be reassigned afterward.

## J — adversarial post-hoc null

Generate twelve uniform random points and eighteen uniformly chosen undirected edges. After generation, permit:

- every simple cycle of length 3–6;
- every cycle node as S;
- every adjacent interior node as P when a P–S stem exists;
- every non-cycle node adjacent to the cycle as R;
- the corresponding favorable subgraph;
- rotation, reflection, uniform scale and translation.

The scorer reports the maximum GS. This models flexible marker/subset choice. Similarities cannot change dimensionless geometry but are retained in the declared freedom ledger.

## Multiple search boundary

The maximum over candidate assignments is the trial result. FPR is positive trials divided by 1,000. No p-value is reported. If J FPR exceeds 5%, the grammar is classified non-selective and no historical blind application is run.

## Historical boundary

The controls do not sample historical semantics, numerals or filenames. They test only whether point/branch/cycle/near-return arrangements can be found in random graph fields under the same post-hoc freedoms.

