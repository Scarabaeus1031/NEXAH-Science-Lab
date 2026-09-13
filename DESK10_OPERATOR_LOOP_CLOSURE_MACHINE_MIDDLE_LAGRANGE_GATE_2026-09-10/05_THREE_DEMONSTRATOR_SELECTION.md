# Three-demonstrator selection

## 1. Julia complex/R2 and conjugate mirror

INPUT: c=-0.75+0.10i and declared grid. OPERATOR: z -> z^2+c plus conjugation. OUTPUT: escape array and mirrored comparison. INVARIANT: escape counts under conjugate reflection. RECONSTRUCTION: deterministic replay. USER INTERACTION: change c or select a conjugate pair and compare. CLAIM CEILING: discrete complex dynamics, not physical return.

## 2. CRT multi-register reconstruction

INPUT: x modulo 31000. OPERATOR: project into coprime registers. OUTPUT: residue tuple and reconstructed x. INVARIANT: residue class. RECONSTRUCTION: explicit CRT inverse. USER INTERACTION: enter x and inspect both register systems. CLAIM CEILING: established arithmetic, no physical addressing claim.

## 3. Fixed-width reversal and maximal complement

INPUT: four-digit word and register N. OPERATOR: R4, S_N, or T_N selected with visible typing. OUTPUT: equality/failure and reconstructed word. INVARIANT: for T_9999, maximal digit complement commutes universally. RECONSTRUCTION: apply the involution again. USER INTERACTION: edit digits/register and observe carries. CLAIM CEILING: positional-base theorem and finite tests, no privileged number meaning.

All three are reproducible, exact, locally executable, visually explainable in under two minutes, and aligned with orientation/representation/reconstruction. Product decision: THREE_DEMONSTRATOR_PROTOTYPE_READY at specification/component level; integrated public UI is not yet built.
