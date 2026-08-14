from __future__ import annotations

import hashlib
import json
import re
import sys
import types
from pathlib import Path

PKG = Path(__file__).resolve().parent.parent
LAB = PKG.parent
ROOT_PATH = PKG / "V3R6_TRUST_ROOT.json"
EXPECTED_TRUST_ROOT = "f9abe3d301245482e40f4207b0b207677cb94e155f7333521faad87deb92833e"
_PREPARED = None


class V3R6Failure(ValueError):
    pass


def need(value, message):
    if not value:
        raise V3R6Failure(message)


def sha(value):
    return hashlib.sha256(value).hexdigest()


def parse(value, label):
    try:
        return json.loads(value)
    except (UnicodeDecodeError, json.JSONDecodeError) as error:
        raise V3R6Failure(label + "_JSON:" + str(error)) from error


def tree_snapshot(root):
    root = Path(root)
    need(root.is_dir() and not root.is_symlink(), "TREE_ROOT")
    members = {}
    for item in sorted(root.rglob("*")):
        if item.is_file() and "__pycache__" not in item.parts:
            need(not item.is_symlink(), "TREE_SYMLINK")
            members[item.relative_to(root).as_posix()] = item.read_bytes()
    payload = "".join(f"{sha(members[name])}  {name}\n" for name in sorted(members)).encode()
    return {"count":len(members), "tree_sha256":sha(payload), "members":members}


def _pin(pin, label):
    path = Path(pin["absolute_path"])
    need(path.is_file() and not path.is_symlink(), label + "_PATH")
    data = path.read_bytes()
    need(len(data) == pin["bytes"], label + "_BYTES")
    checked = data
    if pin.get("mode") == "NORMALIZED_V3R6_TRUST_ROOT":
        checked = re.sub(rb'(EXPECTED_TRUST_ROOT\s*=\s*)"[^"]+"', rb'\1"<NORMALIZED_V3R6_TRUST_ROOT>"', data, count=1)
    need(sha(checked) == pin["sha256"], label + "_HASH")
    return data


def verify_authority(root_path=ROOT_PATH, expected=EXPECTED_TRUST_ROOT):
    root_bytes = Path(root_path).read_bytes()
    need(sha(root_bytes) == expected, "V3R6_TRUST_ROOT_HASH")
    root = parse(root_bytes, "V3R6_TRUST_ROOT")
    need(root["schema"] == "EXP_00_R_V3R6_TRUST_ROOT_V1", "V3R6_TRUST_ROOT_SCHEMA")
    need(Path(root["package_base"]).resolve() == LAB.resolve(), "PACKAGE_BASE")
    need(set(root["pins"]) == set(root["required_pin_labels"]), "PIN_REGISTRY")
    pins = {label:_pin(root["pins"][label], "PIN_" + label) for label in root["required_pin_labels"]}
    lock = parse(pins["AUTHORITY_LOCK"], "AUTHORITY_LOCK")
    need(lock["schema"] == "EXP_00_R_V3R6_AUTHORITY_LOCK_V1" and lock["tree_semantics"] == "SHA256_MEMBER_LINES_V1", "AUTHORITY_LOCK_SCHEMA")
    need(len(lock["packages"]) == 24 and len({x["path"] for x in lock["packages"]}) == 24, "AUTHORITY_PACKAGE_COUNT")
    snapshots = {}
    base = Path(root["package_base"]).resolve()
    for frozen in lock["packages"]:
        need(set(frozen) == {"path","count","tree_sha256"}, "AUTHORITY_PACKAGE_SCHEMA")
        rel = Path(frozen["path"])
        need(not rel.is_absolute() and ".." not in rel.parts, "AUTHORITY_PACKAGE_PATH")
        unresolved = base / rel
        need(not unresolved.is_symlink() and unresolved.resolve().parent == base, "AUTHORITY_PACKAGE_SUBSTITUTION")
        actual = tree_snapshot(unresolved.resolve())
        need((actual["count"],actual["tree_sha256"]) == (frozen["count"],frozen["tree_sha256"]), "TRANSITIVE_AUTHORITY_FAILURE:" + frozen["path"])
        snapshots[frozen["path"]] = actual["members"]
    callable_authority = parse(pins["CALLABLE_AUTHORITY"], "CALLABLE_AUTHORITY")
    need(callable_authority["schema"] == "EXP_00_R_V3R6_CALLABLE_AUTHORITY_V1", "CALLABLE_AUTHORITY_SCHEMA")
    return {"root":root,"pins":pins,"lock":lock,"snapshots":snapshots,"callable_authority":callable_authority}


def _module(name, source, filename):
    module = types.ModuleType(name)
    module.__file__ = str(filename)
    module.__package__ = ""
    exec(compile(source, str(filename), "exec"), module.__dict__)
    return module


def prepare_runtime():
    global _PREPARED
    if _PREPARED is not None:
        verify_authority()
        _PREPARED["v3r5"].assert_consumed(_PREPARED["v3r5_context"]["runtime"], _PREPARED["v3r5_context"]["authority"]["manifest"])
        assert_callable(_PREPARED)
        return _PREPARED
    authority = verify_authority()
    integrity = _module("_v3r6_callable_integrity", authority["pins"]["CALLABLE_INTEGRITY"], PKG / "src/callable_integrity.py")
    v3r5_source = authority["snapshots"]["EXP_00_R_ROSSLER_REPLICATION_V3R5_RECOVERED_HISTORICAL_RUNTIME_BINDING"]["src/v3r5_runtime.py"]
    v3r5 = _module("_v3r6_verified_v3r5", v3r5_source, LAB / "EXP_00_R_ROSSLER_REPLICATION_V3R5_RECOVERED_HISTORICAL_RUNTIME_BINDING/src/v3r5_runtime.py")
    context = v3r5.prepare_runtime()
    expected = authority["callable_authority"]["graph_sha256"]
    quantile = context["runtime"]["science"].np.quantile
    binding = integrity.capture(quantile, expected)
    integrity.verify(quantile, binding, expected)
    _PREPARED = {"authority":authority,"integrity":integrity,"v3r5":v3r5,"v3r5_context":context,"binding":binding}
    return _PREPARED


def assert_callable(context):
    runtime = context["v3r5_context"]["runtime"]
    numpy_module = context["v3r5"]._BOUND_NUMPY
    need(runtime["science"].np is numpy_module and runtime["a5xef_schema"].np is numpy_module, "NUMPY_ALIAS_IDENTITY")
    need(runtime["science"].np.quantile is numpy_module.quantile, "QUANTILE_ALIAS_IDENTITY")
    expected = context["authority"]["callable_authority"]["graph_sha256"]
    try:
        return context["integrity"].verify(numpy_module.quantile, context["binding"], expected)
    except Exception as error:
        raise V3R6Failure("MATERIAL_CALLABLE_INTEGRITY:" + str(error)) from error


def _derive(context, namespace, hook=None):
    runtime = context["v3r5_context"]["runtime"]
    v3r3 = context["v3r5_context"]["v3r3"]
    envelope = runtime["a5xefr_schema"].build("FIXTURE", namespace)
    v3r3.validate_raw_snapshot(envelope, runtime)
    need(runtime["identity"].validate(envelope)["payload_origin"] == "SYNTHETIC", "SYNTHETIC_IDENTITY")
    canonical = runtime["a5xefr_schema"].canonical_scientific_evidence(envelope)
    assert_callable(context)
    if hook is not None:
        hook(context)
    assert_callable(context)
    scientific = runtime["science"].derive(canonical)
    assert_callable(context)
    return scientific


def derive_synthetic(namespace):
    return _derive(prepare_runtime(), namespace)


def derive_synthetic_with_test_hook(namespace, hook):
    return _derive(prepare_runtime(), namespace, hook)


def digest_science(value):
    return sha(json.dumps(value, sort_keys=True, separators=(",", ":"), ensure_ascii=False).encode())


def run_registered_file(input_path, boundary=None):
    context = prepare_runtime()
    authorization = context["v3r5_context"]["authorization"]
    need(authorization["granted"], "EXECUTION_NOT_AUTHORIZED")
    assert_callable(context)
    if boundary is not None:
        boundary["resolve"] += 1
    target = Path(input_path).resolve()
    manifest = authorization["manifest"]
    need(str(target) == manifest["registered_input"]["absolute_path"], "INPUT_PATH")
    if boundary is not None:
        boundary["read"] += 1
    raw = target.read_bytes()
    need(sha(raw) == manifest["registered_input"]["sha256"], "INPUT_HASH")
    raise V3R6Failure("REGISTERED_EXECUTION_NOT_PART_OF_V3R6_VALIDATION")
