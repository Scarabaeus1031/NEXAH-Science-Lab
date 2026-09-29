#!/usr/bin/env python3
import argparse
import hashlib
import json
import math
import unicodedata
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFont, __version__ as pillow_version


FONTS = {
    "Menlo": "/System/Library/Fonts/Menlo.ttc",
    "Helvetica": "/System/Library/Fonts/Helvetica.ttc",
    "Avenir": "/System/Library/Fonts/Avenir.ttc",
    "Times New Roman": "/System/Library/Fonts/Supplemental/Times New Roman.ttf",
    "Courier New": "/System/Library/Fonts/Supplemental/Courier New.ttf",
}

GLYPHS = ["0", "o", "°", "º", "◦", "˚", "ö", "ô", "ò", "ó", "õ", "ō", "ø", "œ"]
DIACRITIC_O = ["ö", "ô", "ò", "ó", "õ", "ō"]
ROMAN_PAIRS = (
    (1000, "M"), (900, "CM"), (500, "D"), (400, "CD"),
    (100, "C"), (90, "XC"), (50, "L"), (40, "XL"),
    (10, "X"), (9, "IX"), (5, "V"), (4, "IV"), (1, "I"),
)


def sha256_file(path):
    h = hashlib.sha256()
    with open(path, "rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            h.update(chunk)
    return h.hexdigest()


def digits_base(n, base):
    if n == 0:
        return 1
    count = 0
    while n:
        n //= base
        count += 1
    return count


def roman_encode(number):
    if not 1 <= number <= 3999:
        raise ValueError("Roman encoder supports 1..3999")
    out = []
    for value, token in ROMAN_PAIRS:
        while number >= value:
            out.append(token)
            number -= value
    return "".join(out)


def roman_decode(text):
    lookup = {token: value for value, token in ROMAN_PAIRS}
    index = 0
    value = 0
    while index < len(text):
        pair = text[index:index + 2]
        if pair in lookup:
            value += lookup[pair]
            index += 2
        elif text[index] in lookup:
            value += lookup[text[index]]
            index += 1
        else:
            raise ValueError(f"Invalid Roman token at {index}")
    if roman_encode(value) != text:
        raise ValueError("Noncanonical Roman numeral")
    return value


def render_glyph(glyph, font_path):
    font = ImageFont.truetype(font_path, 300)
    canvas = Image.new("L", (512, 512), 0)
    draw = ImageDraw.Draw(canvas)
    box = draw.textbbox((0, 0), glyph, font=font)
    width = box[2] - box[0]
    height = box[3] - box[1]
    x = (512 - width) / 2 - box[0]
    y = (512 - height) / 2 - box[1]
    draw.text((x, y), glyph, font=font, fill=255)
    bbox = canvas.getbbox()
    if bbox is None:
        raise RuntimeError(f"No glyph rendered for {glyph} in {font_path}")
    crop = canvas.crop(bbox)
    target = 160
    scale = min(target / crop.width, target / crop.height)
    resized = crop.resize(
        (max(1, round(crop.width * scale)), max(1, round(crop.height * scale))),
        Image.Resampling.LANCZOS,
    )
    normalized = Image.new("L", (192, 192), 0)
    normalized.paste(resized, ((192 - resized.width) // 2, (192 - resized.height) // 2))
    return normalized


def mask_iou(a, b):
    aa = np.asarray(a) >= 64
    bb = np.asarray(b) >= 64
    union = np.logical_or(aa, bb).sum()
    intersection = np.logical_and(aa, bb).sum()
    return float(intersection / union) if union else 1.0


def classify_iou(value):
    if value >= 0.90:
        return "STRONG"
    if value >= 0.75:
        return "PARTIAL"
    return "WEAK"


def codepoint_record(text):
    return {
        "glyph": text,
        "codepoints": [f"U+{ord(ch):04X}" for ch in text],
        "names": [unicodedata.name(ch, "UNNAMED") for ch in text],
        "categories": [unicodedata.category(ch) for ch in text],
        "NFC": unicodedata.normalize("NFC", text),
        "NFD": unicodedata.normalize("NFD", text),
        "NFKC": unicodedata.normalize("NFKC", text),
        "NFKD": unicodedata.normalize("NFKD", text),
    }


def rotate_point(point, degrees):
    angle = math.radians(degrees)
    c, s = math.cos(angle), math.sin(angle)
    x, y = point
    return (c * x - s * y, s * x + c * y)


def canonical_coordinate(value):
    rounded = round(value, 12)
    return 0.0 if rounded == 0 else rounded


def cut_class(alpha_degrees, point, epsilon=1e-12):
    angle = math.radians(alpha_degrees)
    dot = math.cos(angle) * point[0] + math.sin(angle) * point[1]
    if dot > epsilon:
        return "I"
    if dot < -epsilon:
        return "O"
    return "M"


def run():
    # T1
    rollover_cases = []
    for base in range(2, 17):
        for width in range(1, 5):
            boundary = base ** width - 1
            successor = boundary + 1
            ok = (
                digits_base(boundary, base) == width
                and digits_base(successor, base) == width + 1
                and successor == base ** width
            )
            rollover_cases.append({"base": base, "width": width, "boundary": boundary, "successor": successor, "pass": ok})
    t1_pass = all(item["pass"] for item in rollover_cases) and len(rollover_cases) == 60

    # T2
    roman_roundtrip_all = all(roman_decode(roman_encode(n)) == n for n in range(1, 4000))
    roman_examples = {"99": roman_encode(99), "100": roman_encode(100)}
    t2_pass = roman_roundtrip_all and roman_examples == {"99": "XCIX", "100": "C"}

    # T3
    unicode_records = [codepoint_record(glyph) for glyph in GLYPHS]
    core_distinct = all(
        len({unicodedata.normalize(form, glyph) for glyph in ["0", "o", "°"]}) == 3
        for form in ["NFC", "NFD", "NFKC", "NFKD"]
    )
    diacritic_decomposition = {}
    for glyph in DIACRITIC_O:
        nfd = unicodedata.normalize("NFD", glyph)
        diacritic_decomposition[glyph] = (
            nfd.startswith("o")
            and len(nfd) >= 2
            and all(unicodedata.category(ch).startswith("M") for ch in nfd[1:])
        )
    zero_equivalents = [
        glyph for glyph in GLYPHS[1:]
        if any(unicodedata.normalize(form, glyph) == "0" for form in ["NFC", "NFD", "NFKC", "NFKD"])
    ]
    t3_pass = core_distinct and all(diacritic_decomposition.values()) and not zero_equivalents

    # T4
    font_results = []
    for name, path in FONTS.items():
        six = render_glyph("6", path)
        nine = render_glyph("9", path)
        rotated = six.rotate(180)
        iou = mask_iou(rotated, nine)
        font_results.append({
            "font": name,
            "font_path": path,
            "font_sha256": sha256_file(path),
            "iou": round(iou, 6),
            "class": classify_iou(iou),
        })
    font_independent = all(item["class"] == "STRONG" for item in font_results)

    # T5
    ring = sorted((canonical_coordinate(math.cos(math.radians(d))), canonical_coordinate(math.sin(math.radians(d)))) for d in range(0, 360, 5))
    ring_orbits = []
    for rotation in [0, 90, 180, 270]:
        moved = sorted((canonical_coordinate(x), canonical_coordinate(y)) for x, y in (rotate_point(p, rotation) for p in ring))
        ring_orbits.append(moved)
    unmarked_unique_states = len({tuple(state) for state in ring_orbits})
    marker_states = []
    for rotation in [0, 90, 180, 270]:
        point = rotate_point((1.0, 0.0), rotation)
        marker_states.append((canonical_coordinate(point[0]), canonical_coordinate(point[1])))
    marked_unique_states = len(set(marker_states))
    t5_pass = unmarked_unique_states == 1 and marked_unique_states == 4

    # T6
    alphas = [0, 45, 90, 135]
    betas = [0, 45, 90, 135]
    sample_points = [
        (math.cos(math.radians(degrees)), math.sin(math.radians(degrees)))
        for degrees in range(0, 360, 22)
    ][:16]
    # Freeze exact 16 directions at 22.5-degree increments rather than integer-rounded degrees.
    sample_points = [
        (math.cos(2 * math.pi * index / 16), math.sin(2 * math.pi * index / 16))
        for index in range(16)
    ]
    equivariance_checks = []
    for alpha in alphas:
        for beta in betas:
            for point in sample_points:
                equivariance_checks.append(cut_class(alpha + beta, rotate_point(point, beta)) == cut_class(alpha, point))
    reversal_checks = []
    swap = {"I": "O", "O": "I", "M": "M"}
    for alpha in alphas:
        for point in sample_points:
            reversal_checks.append(cut_class(alpha + 180, point) == swap[cut_class(alpha, point)])
    class_counts = {}
    for alpha in alphas:
        labels = [cut_class(alpha, point) for point in sample_points]
        class_counts[str(alpha)] = {label: labels.count(label) for label in ["I", "O", "M"]}
    t6_pass = all(equivariance_checks) and all(reversal_checks)

    primary_required = [t1_pass, t2_pass, t3_pass, t5_pass, t6_pass]
    if all(primary_required):
        decision = "SUPPORTED_AS_TYPED_REPRESENTATION_GRAMMAR"
    elif t1_pass and t6_pass:
        decision = "PARTIAL"
    else:
        decision = "FAILED"

    return {
        "experiment": "NEXAH_ZERO_GLYPH_IOTA_BOUNDARY_TEST_2026-09-28",
        "preregistration_sha256": "071e6c2f8a0adef634c346139e1543c6bb06a3ecd588ec45d3700c1bbc702956",
        "tests": {
            "T1_positional_rollover": {"pass": t1_pass, "cases_passed": sum(x["pass"] for x in rollover_cases), "cases_total": len(rollover_cases), "decimal_case": next(x for x in rollover_cases if x["base"] == 10 and x["width"] == 2)},
            "T2_decimal_roman_transport": {"pass": t2_pass, "roundtrip_1_3999": roman_roundtrip_all, "examples": roman_examples, "digit_width_invariant": False},
            "T3_unicode_state_separation": {"pass": t3_pass, "core_distinct_all_normalizations": core_distinct, "diacritic_o_decomposition": diacritic_decomposition, "normalizes_to_numeric_zero": zero_equivalents, "records": unicode_records},
            "T4_six_nine_half_turn": {"descriptive": True, "font_independent": font_independent, "fonts": font_results},
            "T5_ring_angle_information": {"pass": t5_pass, "unmarked_unique_C4_states": unmarked_unique_states, "marked_unique_C4_states": marked_unique_states, "marker_states": marker_states},
            "T6_directed_iota_cut": {"pass": t6_pass, "equivariance_checks_passed": sum(equivariance_checks), "equivariance_checks_total": len(equivariance_checks), "reversal_checks_passed": sum(reversal_checks), "reversal_checks_total": len(reversal_checks), "class_counts": class_counts},
        },
        "decision": decision,
        "claim_ceiling": "TYPED_REPRESENTATION_GRAMMAR_AND_FINITE_DIRECTED_CUT_ONLY_NO_PHYSICAL_OR_UNIVERSAL_GLYPH_CLAIM",
        "runtime": {"pillow": pillow_version, "numpy": np.__version__, "unicode_database": unicodedata.unidata_version},
    }


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--output-dir", required=True)
    args = parser.parse_args()
    output = Path(args.output_dir)
    output.mkdir(parents=True, exist_ok=True)
    result = run()
    canonical = json.dumps(result, ensure_ascii=False, sort_keys=True, separators=(",", ":")).encode("utf-8")
    digest = hashlib.sha256(canonical).hexdigest()
    (output / "scientific_result.json").write_bytes(canonical + b"\n")
    (output / "result_hash.txt").write_text(digest + "\n", encoding="utf-8")
    print(json.dumps({"decision": result["decision"], "result_hash": digest, "tests": {k: v.get("pass", v.get("font_independent")) for k, v in result["tests"].items()}}, ensure_ascii=False, sort_keys=True))


if __name__ == "__main__":
    main()
