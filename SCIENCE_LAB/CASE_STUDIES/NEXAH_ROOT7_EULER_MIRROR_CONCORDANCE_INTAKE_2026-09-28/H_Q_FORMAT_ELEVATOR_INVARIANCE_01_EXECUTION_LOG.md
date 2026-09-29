# H_Q_FORMAT_ELEVATOR_INVARIANCE_01 execution log

Date: `2026-09-29`

Preregistration SHA-256:

```text
8b9f57ffb04f3099e0c3d92765f46696f627699acc94ac6cdc915fb06482809b
```

The first attempted execution stopped before writing a result because two
frozen source locations were referenced under incorrect relative paths. Only
those two file locations were corrected in the runner:

- the Double-Cut model is in the sibling ecosystem directory `00 EXECUTIVE`;
- the Format-Elevator validation report is under `data/validation_report.json`.

No operator, threshold, diagnostic, decision rule or preregistration text was
changed.

The corrected runner was then executed once as the primary run and twice as a
replay. Both replay files were byte-identical to the primary result.

```text
classification = PASS_FORMAT_ELEVATOR_INVARIANCE__137_357_SPLIT_VIEW_DEPENDENT
checks          = 12/12 PASS
formats         = 16/16 FIT views
split 220       = 0/16 target views
replays         = 2/2 byte-identical
```

Machine-result SHA-256:

```text
2deb4e60111abac31341d565eb5a1db53dd9044547e117b74adf1e131bd7d49d
```
