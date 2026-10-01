# B3 implementation and historical qualification

Status: `SECOND_REPAIR_IMPLEMENTED_PENDING_INDEPENDENT_REVIEW / NO PROSPECTIVE RESULT`

## Comparator

For Issue Date `t` and supported horizon `h`, the frozen comparator is:

`LOD_hat(t+h) = 86400 * EAM90_x3(t,t+h) + IERS_RG_ZONT2_DLOD(t+h)`

`EAM90_x3` is the axial component from the admitted archived combined GFZ
forecast. The known target-date IERS long-period zonal-tide correction is added
using the already reference-validated `POLAR-LOD-BL-01` implementation. Units
are seconds of LOD. No coefficient is fitted to the 2025 outcomes.

## Conversion sanity check

On 90 observed (`C`) integer-day rows in the first vintage, the conversion has
RMSE `0.017015 ms` and MAE `0.013553 ms` against the bound IERS daily series.
The frozen sanity gate is RMSE below `0.05 ms`; it passes.

## Historical 2025 forecast diagnostics

| Horizon | Paired n | RMSE (ms) | MAE (ms) |
|---:|---:|---:|---:|
| 1 | 344 | 0.026479 | 0.020914 |
| 3 | 342 | 0.032427 | 0.025680 |
| 7 | 338 | 0.048830 | 0.039611 |
| 30 | 315 | 0.161685 | 0.122158 |

Paired one-day forensic comparison:

| Comparator | n | RMSE (ms) | MAE (ms) |
|---|---:|---:|---:|
| B1-AR17 | 344 | 0.036560 | 0.028353 |
| M2-AR17 plus six periods | 344 | 0.034278 | 0.026483 |
| B2-IERS-ZONT2 | 344 | 0.027779 | 0.021586 |
| B3-GFZ-EAM90-ZONT2 | 344 | 0.026479 | 0.020914 |

B3 RMSE is 22.75% lower than M2 relative to M2 on these same historical dates;
equivalently, M2 RMSE is 29.45% higher than B3 relative to B3. This supports B3
as a materially strong historical comparator; it is not evidence from a newly
unseen window and does not decide `POLAR-LOD-01`.

## Reproduction

Run the committed script with a private cache directory:

```text
python eam_vintage_qualification.py --cache-dir <private-cache>
```

The runner downloads only absent archive files, validates every file,
deduplicates Issue Dates, writes the ledger and predictions, and fails the
ready status if any frozen gate fails. Raw provider files are not copied into
the package.

## Decision

The repaired runner enforces raw-vintage identity against the canonical ledger,
fails closed on structural predicates and separates retrospective criteria
from preregistered evidence. Historical UTC availability remains explicitly
unproven rather than reconstructed. The independent repair review nevertheless
demonstrated that caller-selected alternative ledger and lock files could
obtain the same verified status and that the four-horizon rule was not
implemented. The second repair removes those overrides, binds a canonical
trust root and reproducible runtime, and implements the full four-horizon M6
evaluator. Another independent review and a separate Human Owner release
remain required before prospective use.
