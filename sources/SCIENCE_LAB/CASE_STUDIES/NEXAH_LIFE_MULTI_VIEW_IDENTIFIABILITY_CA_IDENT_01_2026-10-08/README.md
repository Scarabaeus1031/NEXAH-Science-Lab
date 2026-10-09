# CA-IDENT-01 · LIFE Multi-View Identifiability

Status: `EXECUTED_INTERNAL_FIXTURE / LIMITED_VIEW_SIGNAL / NOT PUBLIC`

## Question

Can a declared projection of a Conway Life state identify its eight-generation
behavior class on translated holdout runs better than a baseline consisting of
live-cell count, component count and binary entropy?

This is an internal usefulness probe. It is not an E8-specificity test, a
Resonance Cathedral validation or an external application result.

## Fixed fixture

- carrier: finite-dead `40 × 40` binary grid;
- operator: synchronous Conway `B3/S23`;
- seeds: block, blinker, beacon, glider, R-pentomino, acorn and diehard;
- observation generations: `6, 12, 18, 24, 30, 36`;
- training: centered runs, `42` records;
- holdout: two translated copies per seed/time, `84` records;
- target: exact class over the next eight generations: extinct, fixed,
  period-2, constant-count motion, growth, decay or transient;
- classifier: deterministic nearest-neighbour over each declared feature view.

The run was executed before any tuning of view weights. Its mixed result is
retained as produced.

## Views

| View | Contract |
|---|---|
| Baseline | live count, components and entropy |
| Grid | `5 × 5` block-density projection; position-sensitive |
| Fourier | eight low-mode DFT magnitudes; phase discarded |
| Shadow Memory | five retained densities and four cell-change counts |
| Shadow-gons | canonicalized sector/radial records for regular 17-, 19- and 29-gons |
| E8 adapter | explicitly lossy eight-coordinate quantizer followed by the registered E8 graph neighbourhood and involutive local mutation check |
| Combined | scaled concatenation of all records |

The regular polygons are observation frames. They are not new Life carriers.
The Poincaré view in the HTML is a reversible Cayley chart control over cell
addresses and does not enter the classifier.

## Frozen result

| View | Correct | Accuracy | Relative to baseline |
|---|---:|---:|---:|
| Baseline | 82 / 84 | 97.62% | — |
| Grid | 35 / 84 | 41.67% | −55.95 pp |
| Fourier | 83 / 84 | 98.81% | +1.19 pp |
| Shadow Memory | 82 / 84 | 97.62% | 0.00 pp |
| Shadow-gons | 83 / 84 | 98.81% | +1.19 pp |
| E8 adapter | 36 / 84 | 42.86% | −54.76 pp |
| Combined | 82 / 84 | 97.62% | 0.00 pp |

Verdict: `LIMITED_VIEW_SIGNAL`.

The fixture supplies a small reason to continue testing translation-robust
Fourier and polygon shadow views. It does **not** supply evidence that the
current E8 adapter, the combined feature space or a coarse absolute grid is
useful. The current E8 adapter is a valid negative control on this target.

## Interpretation

1. The baseline is already unusually strong on this small curated seed set.
2. Fourier magnitude and canonicalized polygon sectors each correct one of the
   two baseline errors.
3. The absolute block grid fails under translation, as its contract predicts.
4. Shadow Memory as currently defined adds no incremental signal.
5. The eight-coordinate adapter collapses fixed, period-2 and constant-count
   trajectories and must not be promoted as a Life/E8 bridge.
6. Combining all views without learned or preregistered weights does not improve
   the result.

The next honest test is a larger rule/seed holdout with all feature definitions
preregistered before execution. It should compare translation-invariant grids,
phase-preserving Fourier records and trajectory-aware polygon shadows.

## Files

- `index.html` — interactive instrument and executed result;
- `engine.js` — deterministic Life, projections and holdout evaluation;
- `app.js` / `styles.css` — browser view;
- `test.cjs` — engine and frozen-result checks;
- `audit.cjs` — package/UI boundary audit;
- `results/CA_IDENT_01_RESULT.json` — compact frozen result record.

## Claim ceiling

Deterministic in-repository fixture only. A gain on translated Conway seeds
does not establish external utility, E8 specificity, physical resonance,
biological meaning or a universal projection law. Similar graphs, grids,
polygons and charts remain typed representations unless an explicit operator
and return contract establishes more.
