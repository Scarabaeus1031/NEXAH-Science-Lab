from __future__ import annotations

import hashlib
import marshal
import types


class IndependentCallableFailure(ValueError):
    pass


def verify(quantile, expected):
    if type(quantile).__module__ != "numpy" or type(quantile).__name__ != "_ArrayFunctionDispatcher":
        raise IndependentCallableFailure("dispatcher type")
    implementation = getattr(quantile, "_implementation", None)
    if not isinstance(implementation, types.FunctionType):
        raise IndependentCallableFailure("implementation type")
    if implementation is not getattr(quantile, "__wrapped__", None):
        raise IndependentCallableFailure("dispatcher relationship")
    if (implementation.__module__, implementation.__name__, implementation.__qualname__) != ("numpy.lib.function_base", "quantile", "quantile"):
        raise IndependentCallableFailure("implementation identity")
    code_sha = hashlib.sha256(marshal.dumps(implementation.__code__)).hexdigest()
    if code_sha != expected["implementation_code_sha256"]:
        raise IndependentCallableFailure("implementation code")
    if implementation.__defaults__ != (None, None, False, "linear", False):
        raise IndependentCallableFailure("implementation defaults")
    if implementation.__kwdefaults__ != {"interpolation": None}:
        raise IndependentCallableFailure("implementation kwdefaults")
    if implementation.__closure__ is not None or implementation.__dict__ != {}:
        raise IndependentCallableFailure("implementation mutable state")
    return {"dispatcher":"PASS","implementation":"PASS","code_sha256":code_sha}
