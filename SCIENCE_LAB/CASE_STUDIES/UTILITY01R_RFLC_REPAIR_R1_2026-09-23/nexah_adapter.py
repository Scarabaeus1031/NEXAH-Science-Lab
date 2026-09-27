#!/usr/bin/env python3
"""Syntax-only neutral wrapper around the pinned, unmodified Core verifier.

It never interprets Core diagnostics into a new defect class or location.
Both paths receive the same carrier directory; the Core verifier's narrower
native coverage is recorded as a capability limitation, not repaired here.
"""

from __future__ import annotations

import hashlib
import importlib
import json
from pathlib import Path
import resource
import subprocess
import sys
import time
import types

CORE = Path('/Users/tho2020/Documents/NEXAH ECOSYSTEM/10 NEXAH CORE/NEXAH')
PIN = 'ead4223a9bea103ad2266fc3b71b433974de37dd'
CLAIM = 'BOUNDED_IEEE_REPRESENTATION_FIDELITY_AUDIT'


def canonical(value: object) -> bytes:
    return json.dumps(value, sort_keys=True, separators=(',', ':'), ensure_ascii=False).encode()


def sha(value: bytes) -> str:
    return hashlib.sha256(value).hexdigest()


def run(root: Path) -> dict:
    started = time.perf_counter_ns()
    input_sha256 = sha(canonical({p.name: sha(p.read_bytes()) for p in sorted(root.iterdir()) if p.is_file()}))
    actual = subprocess.run(['git', 'rev-parse', 'HEAD'], cwd=CORE, check=True,
                            capture_output=True, text=True).stdout.strip()
    if actual != PIN:
        raise RuntimeError('pinned Core HEAD mismatch')
    nexah = types.ModuleType('nexah')
    nexah.__path__ = [str(CORE / 'nexah')]
    sys.modules['nexah'] = nexah
    power = types.ModuleType('nexah.power_systems')
    power.__path__ = [str(CORE / 'nexah/power_systems')]
    sys.modules['nexah.power_systems'] = power
    evidence = importlib.import_module('nexah.power_systems.ieee_projection_fidelity_evidence')
    try:
        evidence.verify_ieee_projection_fidelity_evidence_bundle(root)
        status, reason = 'PASS', ''
    except (ValueError, OSError, TypeError):
        status, reason = 'ERROR', 'CORE_VERIFIER_REJECTED_BUNDLE_UNTYPED'
    record = {'id': root.name, 'input_sha256': input_sha256, 'status': status,
              'defect_class': 'NONE', 'location': None,
              'evidence': [{'input_sha256': input_sha256, 'artifact': None}],
              'reconstruction_state': 'UNKNOWN', 'reason': reason,
              'unmet_precondition': '', 'claim_ceiling': CLAIM,
              'software_version': 'PINNED_CORE_SYNTAX_ONLY_R1_V1',
              'cost': {'runtime_ns': time.perf_counter_ns() - started,
                       'peak_rss': resource.getrusage(resource.RUSAGE_SELF).ru_maxrss}}
    record['cost']['output_bytes'] = len(canonical(record))
    return record


if __name__ == '__main__':
    if len(sys.argv) != 2:
        raise SystemExit('usage: nexah_adapter.py /path/to/opaque/carrier')
    print(canonical(run(Path(sys.argv[1]))).decode())
