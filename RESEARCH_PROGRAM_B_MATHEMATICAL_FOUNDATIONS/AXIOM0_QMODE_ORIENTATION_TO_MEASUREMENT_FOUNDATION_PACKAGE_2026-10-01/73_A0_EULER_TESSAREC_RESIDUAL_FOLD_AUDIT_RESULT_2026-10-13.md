# Check 73 — Euler / Tessarec Residual and Fold Audit Result

Date: `2026-10-13`  
Study: `A0_EULER_TESSAREC_RESIDUAL_FOLD_AUDIT_2026_10_13`  
Run: `A0_EULER_TESSAREC_RESIDUAL_FOLD_AUDIT_RUN_001`  
Status: `VALIDATED_SECONDARY_DIAGNOSTIC / EXECUTION_STOPPED / AWAITING_OWNER_DISPOSITION`

## Result

```text
EXTREME_CONCENTRATED
```

The registered Euler model's excess held-out error over the affine baseline is
concentrated at the two spectral extremes. Folds `F1` and `F8` contribute
`82.39262880796299%` of the positive Euler excess SSE, exceeding the frozen
`60%` localization threshold. This diagnostic does not change or rescue the
Check 71 result `NO_EULER_SPECIFIC_SPECTRAL_SUPPORT`.

## Fold localization

| Fold | Euler excess SSE over affine | Positive share |
|---|---:|---:|
| `F1` | `7.115419911507115` | `31.71395262013054%` |
| `F2` | `0.22886534650605592` | `1.0200697704073313%` |
| `F3` | `0.2962440503630989` | `1.3203816351045006%` |
| `F4` | `0.22509007882763293` | `1.0032431232423212%` |
| `F5` | `0.3766072449098231` | `1.678566334806548%` |
| `F6` | `2.544303176784802` | `11.340147370544984%` |
| `F7` | `0.27932293164650757` | `1.2449629579313191%` |
| `F8` | `11.37039163660831` | `50.67867618783245%` |

The affine model remains much closer to the observed ranked spectrum than the
Euler shape in every fold. The largest Euler failure is the negative spectral
edge (`F8`), followed by the positive edge (`F1`).

## What does not explain the result

### Trivial eigenvalue

Removing the leading cubic-graph eigenvalue `3` does not reverse either
registered diagnostic:

```text
47-value A_E = -1.8722031559312184
47-value G_Q =  1.4258735620278684
```

The primary 48-value result is therefore not an artifact of that single point.

### Repeated eigenvalues

The spectrum contains `42` values in repeated-value groups and `6` singleton
values at tolerance `1e-10`. For the Euler model, the mean absolute held-out
residual is lower on repeated values (`0.49863344055342324`) than on singletons
(`0.9450697281793424`). Repetition does not generate the Euler disadvantage.

### Smooth quadratic curvature

There are `41` sign changes among `46` observed second differences. The five
largest absolute second differences occur around ranks `28`, `29`, `7`, `4`
and `26`. The spectrum therefore contains paired multiplicity plateaus and
local rank irregularity rather than the single smooth curvature profile fixed
by `n²+n`.

## Scientific reading

Check 71's matched-null percentile gate passed because connected random cubic
spectra fit this fixed Euler rank shape even worse. Check 73 localizes why that
relative distinction is still not positive support: the observed graph has a
structured, bounded spectrum whose extremes differ from the Euler curve, while
an affine rank trend captures the interior and edges far better. The null rank
is a comparison among poor Euler fits, not evidence of an Euler generator.

## Integrity and STOP

- parent disposition changed: `NO`;
- new null simulation: `NO`;
- best-`c` search: `NO`;
- new primary test: `NO`;
- graph-native successor: `NOT EXECUTED`;
- result JSON SHA-256:
  `76b427a3d14573fed7bfa3dd669f5b65a4bccb8ff9ff1264d1799bf511b6a650`;
- SVG SHA-256:
  `6f5f0ce655868f0a4565e1a461adc18c396028f9d8e7cad2282083d1eef5bada`;
- independent result-ledger validator: `PASS`;
- execution stopped and Structure Freeze restored.

## Next logical question

A later, separately authorized test should be graph-native rather than another
polynomial rank fit: compare the finite cubic spectrum with the appropriate
Kesten–McKay reference and explicitly test symmetry/multiplicity and edge
deviations. That successor is not designed or authorized by this result.
