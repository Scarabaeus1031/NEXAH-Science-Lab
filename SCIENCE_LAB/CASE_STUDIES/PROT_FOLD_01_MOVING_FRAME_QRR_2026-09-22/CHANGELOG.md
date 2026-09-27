# Changelog

## 2026-09-22 — Repair R1

- retyped 1XQQ as an experimentally constrained native-state conformer
  ensemble rather than a time trajectory;
- replaced world-frame terminology with source-file frame terminology;
- added gauge/Kabsch and frame-residual boundaries;
- added quaternion double-cover and Hopf-fiber loss requirements;
- blocked AXIS08 behind a Natural Pair Gate;
- separated eight-dimensional FEATURE8 from E8;
- moved Mod-7/11 to a held optional sidecar;
- separated Phases A–D and left only Phase A eligible for later preparation;
- retained source binding and numerical execution as not authorized/not run.

No source bytes, results or capability status were added.

## 2026-09-22 — Phase A execution

- bound the public RCSB 1XQQ PDB-format source by SHA-256;
- froze chain A, C-alpha residues 1–76 and model 1 as the reference before
  numerical execution;
- implemented centering, proper Kabsch alignment and exact frame-residual
  reconstruction;
- executed translation, proper-rotation, reflection and identity-permutation
  controls;
- passed all eleven primary Phase-A gates;
- recorded descriptive conformer RMSD, per-residue displacement and contact
  occupancy without treating model order as time;
- retained Phases B–D on hold and created no new capability.
