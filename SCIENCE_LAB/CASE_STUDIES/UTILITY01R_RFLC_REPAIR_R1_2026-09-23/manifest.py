#!/usr/bin/env python3
"""Write or verify the explicit terminal-stop evidence-slice SHA-256 manifest."""

from __future__ import annotations

import hashlib
import json
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parent
CASES = ('1c5dadc1655369c31fea09d852340254',
         '097b45f24eac4fef41bacaecbccde640')
SOURCES = ('.gitattributes', 'README.md', 'R1_STOP.md', 'capability_gate.py', 'gate_raw_outputs.json',
           'baseline.py', 'nexah_adapter.py', 'manifest.py')
MANIFEST = ROOT / 'evidence_manifest.json'


def inventory() -> dict:
    paths = [ROOT / name for name in SOURCES]
    for opaque_id in CASES:
        paths.extend(sorted((ROOT / 'processor_inputs' / opaque_id).iterdir()))
    if any(not path.is_file() for path in paths):
        raise FileNotFoundError('required evidence file missing')
    files = {str(path.relative_to(ROOT)): {'sha256': hashlib.sha256(path.read_bytes()).hexdigest(),
                                           'bytes': path.stat().st_size}
             for path in sorted(paths)}
    return {'schema': 'nexah.utility01r.terminal-stop-manifest/1',
            'evidence_class': 'STOPPED_PREEXECUTION_DEVELOPMENT_CANDIDATE',
            'lock': 'UNLOCKED', 'authority': 'NONAUTHORITATIVE',
            'utility_result': 'NONE',
            'core_commit': 'ead4223a9bea103ad2266fc3b71b433974de37dd',
            'bound_key_sha256': '86ddbff4ba34451807e5cce0f0f69b9596a125f63d6e3437118ee6a860975d2e',
            'evaluation_fixtures': 0, 'replay_fixtures': 0,
            'files': files}


if __name__ == '__main__':
    if len(sys.argv) != 2 or sys.argv[1] not in ('--write', '--verify'):
        raise SystemExit('usage: manifest.py {--write|--verify}')
    actual = inventory()
    if sys.argv[1] == '--write':
        if MANIFEST.exists():
            raise FileExistsError(MANIFEST)
        MANIFEST.write_text(json.dumps(actual, sort_keys=True, indent=2) + '\n')
    elif json.loads(MANIFEST.read_text()) != actual:
        raise AssertionError('evidence manifest mismatch')
    print('TERMINAL_STOP_MANIFEST_VALID')
