# NEXAH LIFE//ORBIT — P1 deterministic Life kernel

Status: `P1 IMPLEMENTED / LOCAL DETERMINISTIC CORE / NO UI / NO GLB / NO E8`

This package implements the first authorized LIFE01 gate from Mission Control:

- Conway `B3/S23` only;
- synchronous update only;
- finite grid with dead exterior only;
- canonical ordered live-cell states;
- SHA-256 state and run receipts;
- fixed, exact-periodic, translated, extinction and open-transient returns;
- block, blinker and glider reference fixtures;
- byte-identical replay.

## Run

```bash
npm test
npm run build:receipts
```

No package installation is required. P1 uses only Node.js built-ins.

## Reference results

| Fixture | Expected | P1 classification |
|---|---|---|
| block | unchanged after one step | `FIXED_POINT`, period 1 |
| blinker | exact return after two steps | `EXACT_PERIODIC_RETURN`, period 2 |
| glider | same normalized shape shifted `(1,1)` after four steps | `TRANSLATED_RETURN`, period 4 |

## Boundary

This kernel does not provide a browser UI, 3D view, GLB export, E8/ADE
adapter, Navigator integration or public artifact. Those remain separate
Mission Control gates. The package does not claim that Conway Life models
biological life or that Life and E8 are the same system.

Controlling mission:

```text
[private Mission Control root omitted]/
[private Mission Control mission record omitted from public preview]
```
