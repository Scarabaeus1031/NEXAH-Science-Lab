from __future__ import annotations

import hashlib
import json
import marshal
import types


class CallableIntegrityFailure(ValueError):
    pass


def _need(value, message):
    if not value:
        raise CallableIntegrityFailure(message)


def _stable(value):
    if value is None or isinstance(value, (bool, int, float, str)):
        return value
    if isinstance(value, bytes):
        return {"bytes_sha256": hashlib.sha256(value).hexdigest(), "bytes": len(value)}
    if isinstance(value, tuple):
        return {"tuple": [_stable(item) for item in value]}
    if isinstance(value, list):
        return {"list": [_stable(item) for item in value]}
    if isinstance(value, dict):
        return {"dict": [[str(key), _stable(value[key])] for key in sorted(value, key=str)]}
    if isinstance(value, types.CodeType):
        raw = marshal.dumps(value)
        return {
            "code_sha256": hashlib.sha256(raw).hexdigest(),
            "code_bytes": len(raw),
            "argcount": value.co_argcount,
            "kwonlyargcount": value.co_kwonlyargcount,
            "freevars": list(value.co_freevars),
            "cellvars": list(value.co_cellvars),
        }
    raise CallableIntegrityFailure("UNSUPPORTED_CALLABLE_STATE:" + type(value).__module__ + "." + type(value).__qualname__)


def function_record(function):
    _need(isinstance(function, types.FunctionType), "IMPLEMENTATION_NOT_PYTHON_FUNCTION")
    closure = None if function.__closure__ is None else tuple(cell.cell_contents for cell in function.__closure__)
    record = {
        "module": function.__module__,
        "name": function.__name__,
        "qualname": function.__qualname__,
        "code": _stable(function.__code__),
        "defaults": _stable(function.__defaults__),
        "kwdefaults": _stable(function.__kwdefaults__),
        "closure": _stable(closure),
        "annotations": _stable(function.__annotations__),
        "attributes": _stable(function.__dict__),
    }
    encoded = json.dumps(record, sort_keys=True, separators=(",", ":"), ensure_ascii=False).encode()
    return record, hashlib.sha256(encoded).hexdigest()


def graph_record(quantile):
    _need(type(quantile).__module__ == "numpy" and type(quantile).__name__ == "_ArrayFunctionDispatcher", "QUANTILE_DISPATCHER_TYPE")
    implementation = getattr(quantile, "_implementation", None)
    wrapped = getattr(quantile, "__wrapped__", None)
    _need(implementation is wrapped, "QUANTILE_IMPLEMENTATION_RELATION")
    implementation_record, implementation_sha256 = function_record(implementation)
    record = {
        "schema": "EXP_00_R_V3R6_NUMPY_QUANTILE_GRAPH_V1",
        "dispatcher_type": type(quantile).__module__ + "." + type(quantile).__name__,
        "dispatcher_module": getattr(quantile, "__module__", None),
        "dispatcher_name": getattr(quantile, "__name__", None),
        "dispatcher_qualname": getattr(quantile, "__qualname__", None),
        "implementation_is_wrapped": True,
        "implementation": implementation_record,
        "implementation_sha256": implementation_sha256,
    }
    encoded = json.dumps(record, sort_keys=True, separators=(",", ":"), ensure_ascii=False).encode()
    return record, hashlib.sha256(encoded).hexdigest()


def capture(quantile, expected_graph_sha256):
    record, graph_sha256 = graph_record(quantile)
    _need(graph_sha256 == expected_graph_sha256, "QUANTILE_GRAPH_NOT_FROZEN_HISTORICAL")
    return {
        "dispatcher": quantile,
        "implementation": quantile._implementation,
        "code": quantile._implementation.__code__,
        "graph_sha256": graph_sha256,
        "record": record,
    }


def verify(quantile, binding, expected_graph_sha256):
    _need(quantile is binding["dispatcher"], "QUANTILE_DISPATCHER_IDENTITY")
    _need(getattr(quantile, "_implementation", None) is binding["implementation"], "QUANTILE_IMPLEMENTATION_IDENTITY")
    _need(getattr(quantile, "__wrapped__", None) is binding["implementation"], "QUANTILE_WRAPPED_IDENTITY")
    _need(binding["implementation"].__code__ is binding["code"], "QUANTILE_CODE_IDENTITY")
    _, graph_sha256 = graph_record(quantile)
    _need(graph_sha256 == binding["graph_sha256"] == expected_graph_sha256, "QUANTILE_GRAPH_FINGERPRINT")
    return True
