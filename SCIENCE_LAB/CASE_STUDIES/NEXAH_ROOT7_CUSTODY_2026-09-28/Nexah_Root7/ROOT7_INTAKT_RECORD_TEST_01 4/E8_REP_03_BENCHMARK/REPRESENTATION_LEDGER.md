# E8-REP-03 — Representation Ledger

| Stage | Object | Dimension | Operator | Preserved invariants | Residual / loss | Status |
| --- | --- | ---: | --- | --- | --- | --- |
| Source | E8 root set | 8D | generator | 240 roots; norm² 2; 6,720 edges; degree 56 | none | PASS |
| Relation | Coxeter action | 8D | product of 8 root reflections | exact order 30; exponents; eight 30-cycles | orientation sign depends on product convention | PASS |
| Projection A | H4 ∪ φH4 | 4D | invariant eigenspace m = 1, 11 plus conjugates | 120 + 120 roots; Gram data; reflection closure; φ scale | four dimensions removed | PASS |
| Projection B | Coxeter plane | 2D | eigenspace m = 1 plus conjugate | eight rings × 30; four φ radius pairs | 4D incidence information is not fully visible | PASS |
| Observation | radial rosette | 2D image | rendering | orbit and radius signature when coordinates are retained | appearance alone is insufficient | BOUNDED |
| Reconstruction | assertion suite | mixed | invariant comparison | source identity recovered only when all gates pass | tolerance recorded | PASS |
| Negative A | generic projection | 2D | seeded orthogonal projection | antipodal pairing only | no Coxeter ring signature | REJECT AS E8 IDENTITY |
| Negative B | 37i mod N graph family | discrete | modular multiplication | its own node/cycle structure | no 240-root metric or H4 closure | REJECT AS E8 IDENTITY |

## Boundary

The benchmark demonstrates a known E8/H4 representation chain. It does not identify unrelated modular or radial graphics with E8, and it does not establish a new mathematical theorem.
