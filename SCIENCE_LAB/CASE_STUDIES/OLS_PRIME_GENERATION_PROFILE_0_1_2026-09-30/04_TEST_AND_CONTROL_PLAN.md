# Test and Control Plan

Status: `DRAFT FOR PREREGISTRATION / EXECUTION NOT AUTHORIZED`

## Required views

The first preregistration must freeze these views before result inspection:

1. prime value;
2. one-based prime index;
3. internal gap vector and forward gap;
4. canonical mod-6 occupancy relation where applicable;
5. one predeclared wheel/residue view, provisionally mod 30.

CRT/QRT, 111/110/112 grids, digit encodings, Fibonacci, Root7, Scarab geometry
and additional constants are excluded from the primary test. They may enter a
separate exploratory annex or later ablation only after exact mappings are
declared. This prevents post-hoc motif accumulation.

## Primary controls

| ID | Control | Purpose |
|---|---|---|
| `C0` | four index phases `s=0..3` | test dependence on start cut |
| `C1` | relabel the fourth role cyclically while preserving values | expose role-label effects |
| `C2` | permute gap vectors under a frozen seed while preserving their multiset | test order-specific effects |
| `C3` | matched consecutive odd-number windows | separate prime-specific from generic ordering effects |
| `C4` | standard mod-6 and mod-30 baselines | distinguish known wheel structure from candidate structure |
| `C5` | value/index namespace swap as a destructive control | verify type checks reject category errors |
| `C6` | truncate at 101 | verify the system records an open, not closed, cell |
| `C7` | duplicate numeral across two typed records | verify role transfer is not inferred |

## Minimum outcomes

- exact reconstruction of every frozen prime, index and gap;
- identical result under clean replay;
- no false cell closure at 101;
- explicit phase dependence or phase invariance, whichever is observed;
- comparison against mod-6/mod-30 baselines;
- clear separation of grouping identity from incremental information;
- machine record and human explanation agree field by field;
- all destructive type controls fail closed.

## Interpretation classes

| Class | Meaning |
|---|---|
| `EXACT_PARTITION_ONLY` | ledger is correct; no incremental structure beyond the declared cut |
| `USEFUL_ORIENTATION_PROFILE` | profile improves inspection or localization under a matched task without new prime law |
| `REPRESENTATION_DEPENDENT_PATTERN` | apparent structure changes materially with phase or view |
| `BOUNDED_INCREMENTAL_RELATION` | a preregistered relation survives matched controls in the finite horizon |
| `NOT_EVALUABLE` | generator, mapping, baseline or source contract is incomplete |

`BOUNDED_INCREMENTAL_RELATION` would still not establish infinity, prediction,
physical mechanism or novelty.

## Promotion gates

1. Human Owner approves the preregistration.
2. Exact source, phase, metrics, moduli, seeds and software environment freeze.
3. Primary and clean replay agree byte for byte on the scientific result.
4. Existing mod-6 and Vendessimal findings are treated as prior evidence, not
   rediscovered under new names.
5. Any claim of scientific novelty requires targeted literature and prior-art
   review after, not before, a bounded positive result.

## STOP

No execution, new OLS primitive, public novelty claim, mathematical theorem,
format adoption or production implementation is authorized by this project
intake.
