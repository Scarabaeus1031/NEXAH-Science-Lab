# OLS Application Profile

Status: `LOCAL PROFILE DRAFT / OLS UNCHANGED`

## Semantic order

The released minimal OLS semantic order is applied as follows:

| OLS primitive responsibility | Project 0.1 application |
|---|---|
| `OBSERVE` | declare ordered prime source, one-based index convention, finite horizon and phase |
| `REPRESENT` | render each source window as typed value, index, gap and frozen residue records |
| `COMPARE` | compare cells, phases and views while retaining differences and unresolved mappings |
| `ORIENT` | locate a record within phase, cell, role and transition without creating a truth or authority claim |
| `EXPLAIN` | emit a human-readable receipt containing cut, formulas, provenance, controls, result status and open residuals |

This order is semantic. It is not an execution scheduler or a causal mechanism.

## Local vocabulary mapping

| Local term | Proposed OLS responsibility | Restriction |
|---|---|---|
| `SELECT` | `OBSERVE` | declares a source subset; does not make it privileged |
| `CUT` | `OBSERVE` + `REPRESENT` | creates a boundary in the record, not in the prime sequence |
| `A,B,C,+1` | `REPRESENT` | profile roles, not OLS primitives |
| `DIFF / GAP` | `COMPARE` | exact arithmetic only |
| `BINDER` | `COMPARE` + `ORIENT` | local relation role; not a universal number class |
| `RETURN` | `ORIENT` + `EXPLAIN` | closes a declared local receipt, not the mathematical sequence |
| `NEXT` | `OBSERVE` | opens the next source window while retaining the prior transition |

The mapping is provisional until an OLS conformance review. Parseability or a
working visualization does not establish conformance.

## Function closes; history remains open

```text
ordered source
    -> declared phase and cut
    -> A / B / C / +1 record
    -> comparisons and residuals
    -> local explanation receipt
    -> next window
```

The receipt can be complete for one cell while the prime sequence continues.
The forward gap is retained as the transition record. `RETURN` therefore means
local documentary closure, not reset, global identity or end of history.

## Typed 101 example

| Namespace | Typed statement | Permitted implication |
|---|---|---|
| prime sequence | `p_26 = 101` | 101 is the 26th prime |
| base-phase cell | `G6.B = 101` | local role under phase 0 |
| `F_50` factor record | `101 divides F_50` | exact factor relation in that separate record |
| SNCE or selector record | only as explicitly declared there | no transfer of role from prime index or cell |

No row licenses semantic transfer to another row merely because the numeral is
the same.

## Serialization boundary

OLS specifies semantics, not one mandatory file format. A later Builder
fixture may use a format-neutral JSON sidecar or an explicitly governed
namespace. `.xva` / `.scrb` remains a candidate design context only. Project
0.1 neither adopts those formats nor assigns them OLS authority.
