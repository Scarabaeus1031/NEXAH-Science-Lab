from __future__ import annotations

from fractions import Fraction
from typing import Any

from serializer import canonical_bytes


N = 12
ORIENTATIONS = ("FORWARD_23", "REVERSE_32")
REGISTRY_ORDER = ("000", "100", "010", "001", "110", "101", "011", "111")
REGISTRY_NAMES = {
    "000": "identity", "100": "H6", "010": "R5", "001": "E23",
    "110": "H6R5", "101": "H6E23", "011": "R5E23", "111": "H6R5E23",
}


def validate_state(x: dict[str, Any]) -> None:
    if set(x) != {"support", "source", "phase", "orientation", "scale"}:
        raise ValueError("authoritative schema")
    if x["support"] != "Z12":
        raise ValueError("support")
    if len(x["source"]) != N or any(type(v) is not int or not 0 <= v <= 9 for v in x["source"]):
        raise ValueError("source")
    if type(x["phase"]) is not int or x["phase"] not in range(6):
        raise ValueError("phase")
    if x["orientation"] not in ORIENTATIONS:
        raise ValueError("orientation")
    if type(x["scale"]) is not int:
        raise ValueError("scale")


def _push_source(source: list[int], s: int, t: int) -> list[int]:
    out = [0] * N
    for i, value in enumerate(source):
        out[(s * i + t) % N] = value
    return out


def apply_bits(x: dict[str, Any], bits: str) -> dict[str, Any]:
    validate_state(x)
    if bits not in REGISTRY_NAMES:
        raise ValueError("unregistered bits")
    h, r, e = (int(v) for v in bits)
    out = dict(x)
    if h:
        out["source"] = _push_source(out["source"], 1, 6)
    if r:
        out["source"] = _push_source(out["source"], -1, 5)
        out["phase"] = (-out["phase"]) % 6
    if e:
        out["orientation"] = ORIENTATIONS[1 - ORIENTATIONS.index(out["orientation"])]
    validate_state(out)
    return out


def descriptor_for_bits(bits: str) -> dict[str, int]:
    mapping = {
        "000": (1, 0, 0), "100": (1, 6, 0), "010": (-1, 5, 0), "001": (1, 0, 1),
        "110": (-1, 11, 0), "101": (1, 6, 1), "011": (-1, 5, 1), "111": (-1, 11, 1),
    }
    s, t, e = mapping[bits]
    return {"s": s, "t": t, "e": e}


DESCRIPTOR_TO_BITS = {tuple(descriptor_for_bits(b).values()): b for b in REGISTRY_ORDER}


def _crt_phase_after_affine(c: int, s: int, t: int) -> int:
    if s == 1:
        return (c + t) % 6
    r2 = (t - c - 1) % 2
    r3 = (t - c - 2) % 3
    matches = [v for v in range(6) if v % 2 == r2 and v % 3 == r3]
    if len(matches) != 1:
        raise AssertionError("CRT phase")
    return matches[0]


def apply_affine(x: dict[str, Any], descriptor: dict[str, int]) -> dict[str, Any]:
    validate_state(x)
    s, t, e = descriptor["s"], descriptor["t"], descriptor["e"]
    if s not in (-1, 1) or t not in range(12) or e not in (0, 1):
        raise ValueError("generic descriptor")
    out = dict(x)
    out["source"] = _push_source(x["source"], s, t)
    out["phase"] = _crt_phase_after_affine(x["phase"], s, t)
    if e:
        out["orientation"] = ORIENTATIONS[1 - ORIENTATIONS.index(x["orientation"])]
    validate_state(out)
    return out


def inverse_affine(descriptor: dict[str, int]) -> dict[str, int]:
    s, t, e = descriptor["s"], descriptor["t"], descriptor["e"]
    return {"s": s, "t": (-s * t) % 12, "e": e}


def generic_descriptors() -> list[dict[str, int]]:
    return [{"s": s, "t": t, "e": e} for s in (1, -1) for t in range(12) for e in (0, 1)]


def descriptor_bits(descriptor: dict[str, int]) -> str | None:
    return DESCRIPTOR_TO_BITS.get((descriptor["s"], descriptor["t"], descriptor["e"]))


def _fraction_obj(value: Fraction) -> dict[str, int]:
    return {"num": value.numerator, "den": value.denominator}


def materialize(x: dict[str, Any]) -> dict[str, Any]:
    validate_state(x)
    grids: dict[str, list[dict[str, Any]]] = {}
    for m in (2, 3):
        blocks = []
        start = x["phase"] % m
        for j in range(N // m):
            indices = sorted((start + m * j + r) % N for r in range(m))
            mean = Fraction(sum(x["source"][i] for i in indices), m)
            blocks.append({"type": f"G{m}", "indices": indices, "mean": _fraction_obj(mean)})
        grids[f"G{m}"] = blocks
    relations = []
    for b2 in grids["G2"]:
        for b3 in grids["G3"]:
            kappa = sorted(set(b2["indices"]) & set(b3["indices"]))
            if not kappa:
                continue
            mean2 = Fraction(b2["mean"]["num"], b2["mean"]["den"])
            mean3 = Fraction(b3["mean"]["num"], b3["mean"]["den"])
            if x["orientation"] == "FORWARD_23":
                left_type, left, right_type, right, difference = "G2", b2["indices"], "G3", b3["indices"], mean2 - mean3
            else:
                left_type, left, right_type, right, difference = "G3", b3["indices"], "G2", b2["indices"], mean3 - mean2
            relations.append({
                "left_type": left_type, "left": left, "right_type": right_type, "right": right,
                "kappa": kappa, "omega": len(kappa), "weight": _fraction_obj(Fraction(len(kappa), 1)),
                "difference": _fraction_obj(difference),
            })
    return {"authoritative": x, "source_indices": list(range(N)), "G2": grids["G2"], "G3": grids["G3"], "GR_struct": relations}


def state_equal(a: dict[str, Any], b: dict[str, Any]) -> bool:
    return canonical_bytes(a) == canonical_bytes(b)


def full_equal(a: dict[str, Any], b: dict[str, Any]) -> bool:
    return canonical_bytes(materialize(a)) == canonical_bytes(materialize(b))

