from __future__ import annotations

import json
import sys
from pathlib import Path

PKG = Path(__file__).resolve().parent.parent
LAB = PKG.parent
sys.path.insert(0, str(LAB / "EXP_00_R_ROSSLER_REPLICATION_V3R5_RECOVERED_HISTORICAL_RUNTIME_BINDING/src"))
import v3r5_runtime as v3r5

context = v3r5.prepare_runtime()
quantile = context["runtime"]["science"].np.quantile
implementation = quantile._implementation
before = float(quantile([1.0, 2.0, 3.0], 0.5, method="linear"))

def substitute(*args, **kwargs):
    return 999.0

original = implementation.__code__
try:
    implementation.__code__ = substitute.__code__
    accepted = v3r5.assert_consumed(context["runtime"], context["authority"]["manifest"])
    after = float(quantile([1.0, 2.0, 3.0], 0.5, method="linear"))
finally:
    implementation.__code__ = original

result = {"v3r5_counterexample":"REPRODUCED","assert_consumed":accepted,"before":before,"after":after,"registered_data_accessed":False}
assert accepted is True and before == 2.0 and after == 999.0
print(json.dumps(result, sort_keys=True))
