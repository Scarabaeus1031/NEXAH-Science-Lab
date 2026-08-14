#!/usr/bin/env python3
import argparse
import json
import platform
import sys


parser = argparse.ArgumentParser()
parser.add_argument("--out", required=True)
args = parser.parse_args()
record = {
    "implementation": platform.python_implementation(),
    "python_version": platform.python_version(),
    "platform": platform.platform(),
    "byteorder": sys.byteorder,
    "float_mantissa_bits": sys.float_info.mant_dig,
    "float_radix": sys.float_info.radix,
    "arithmetic": "IEEE-754 binary64",
}
with open(args.out, "w", encoding="utf-8") as handle:
    json.dump(record, handle, indent=2, sort_keys=True)
    handle.write("\n")

