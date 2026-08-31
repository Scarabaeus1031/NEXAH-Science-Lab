# 13 — Rotation / Relabel Control

Label vertices by `Z/nZ = {0,...,n-1}`. Changing the chosen first vertex by `k` replaces label `i` with `i+k mod n`; reversing orientation replaces `i` by `-i mod n` after a chosen origin.

## Survives rotation/relabeling

- vertex and edge counts;
- parity of `n`;
- angle values;
- adjacency/cyclic incidence;
- dihedral symmetry-group structure;
- existence of an opposite vertex for even `n`.

## Changes predictably or disappears

- the number assigned to a particular geometric vertex is covariant;
- “vertex 0,” “first vertex,” clock position and assigned name are label/frame dependent;
- a numerical pattern tied to specific labels can disappear after `i -> i+k` or orientation reversal.

```text
VERTEX_LABEL_EQUALS_VERTEX_IDENTITY=NO
FIRST_VERTEX_IS_INTRINSIC=NO
RELABEL_DEPENDENT_PATTERNS_FOUND=YES
```

No label-origin pattern is promoted to structural significance unless it survives the specified transformations.

