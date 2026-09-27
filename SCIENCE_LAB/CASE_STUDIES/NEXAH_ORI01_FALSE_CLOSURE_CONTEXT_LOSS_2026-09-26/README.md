# NEXAH-ORI-01 — False Closure under Context Loss

This bounded case tests the NEXAH minimum orientation contract on a known aggregation/context error and compares it with a strong conventional stratified baseline using identical information.

The source fixture is the classic 1973 Berkeley admissions example. The aggregate record and the department-preserving records are both valid records, but they do not authorize the same interpretation. The test asks whether NEXAH types that boundary—and whether it finds an error the strong baseline misses.

## Files

- `00_METHOD_FREEZE.md` — frozen question, claims, gates and outcome rule
- `01_SOURCE_DATA.csv` — twelve source rows
- `run_ori01.py` — dependency-free deterministic execution
- `04_RESULTS.json` — machine result
- `FINAL_RETURN.md` — bounded interpretation and Mission Control return

## Replay

```bash
python3 run_ori01.py
```

## Claim boundary

This is a positive control for context loss and false closure. It is not new statistics, not a causal reanalysis of Berkeley, and not evidence that NEXAH outperforms established stratified analysis. Any claim about improved human judgment requires a separately authorized reader/workflow study.
