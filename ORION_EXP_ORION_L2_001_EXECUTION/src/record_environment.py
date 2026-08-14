#!/usr/bin/env python3
import argparse,json,platform,sys
ap=argparse.ArgumentParser();ap.add_argument("--out",required=True);a=ap.parse_args()
o={"python_implementation":platform.python_implementation(),"python_version":platform.python_version(),"platform":platform.platform(),"byteorder":sys.byteorder,"float_mantissa_bits":sys.float_info.mant_dig,"float_radix":sys.float_info.radix,"arithmetic":"IEEE-754 binary64"}
with open(a.out,"w",encoding="utf-8") as f:json.dump(o,f,indent=2,sort_keys=True);f.write("\n")

