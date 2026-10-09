# CA-IDENT-06 preregistration · Kappa open-set channel

Status: `LOCKED_BEFORE_EXECUTION`

CA-IDENT-06 translates the historical seam/fracture reading into an operational
open-set contract. Kappa does not contribute another forced class feature. It
records distance from known training support and may return `ABSTAIN_UNKNOWN`.

The known metric is the strongest registered CA-IDENT-05 control:

```text
dP² = (1/64) dFourier² + (63/64) dMemory²
kappa(x) = min dP²(x, known training row)
```

The threshold is the nearest-rank 99th percentile of leave-one-seed-out nearest
distances within known training rows. This freezes the aperture using training
data only.

`constant-count motion`, discovered prospectively in CA-IDENT-05 but absent
from its training set, is the registered unknown class. It is removed from
CA-IDENT-06 classifier training and calibration. Fresh seeds `R125-R224` remain
untouched until execution.

Success requires at least 50% unknown recall and at least 95% specificity on
known rows. An abstention means only that the record falls outside the frozen
support aperture; it does not identify a new mechanism.
