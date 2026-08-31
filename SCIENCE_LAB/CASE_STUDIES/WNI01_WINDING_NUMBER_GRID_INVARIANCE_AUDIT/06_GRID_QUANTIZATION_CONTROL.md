# Grid / quantization control

## Declared representation

For each ordered sample relative to p, retain radius and map phase to the center of one of N equal angular sectors. Preserve order, closure metadata, reference, and provenance; reconstruct sector-center coordinates before evaluating winding.

This favorable control tests recoverability, not every possible grid encoding.

| Grid | C0 | C1 | C2 | C3 | C4 | C5 | C6 |
|---|---:|---:|---:|---:|---:|---:|---|
| Q7 | +1 | -1 | +2 | 0 | -1 | +1 | undefined |
| Q11 | +1 | -1 | +2 | 0 | -1 | +1 | undefined |
| Q13 | +1 | -1 | +2 | 0 | -1 | +1 | undefined |
| Q17 | +1 | -1 | +2 | 0 | -1 | +1 | undefined |

All valid controls retain winding at 4096 ordered samples. C6 is correctly rejected because quantization cannot repair an invalid reference.

N labels resolution only:

    7, 11, 13, 17 ≠ W
    GRID SIZE ≠ TOPOLOGICAL WINDING

The result is conditional on retaining order, closure, reference, and enough angular information.
