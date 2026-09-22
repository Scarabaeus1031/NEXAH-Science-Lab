#!/usr/bin/env python3
"""Reproduce only the terminal two-carrier Development capability gate.

No generator, HMAC bridge, Keychain, Evaluation, Replay or scorer is invoked.
"""

from __future__ import annotations

import hashlib
import json
from pathlib import Path
import sys

import baseline
import nexah_adapter

ROOT = Path(__file__).resolve().parent
CORE_COMMIT = 'ead4223a9bea103ad2266fc3b71b433974de37dd'
CASES = {
    'valid': '1c5dadc1655369c31fea09d852340254',
    'D01_residual_removed': '097b45f24eac4fef41bacaecbccde640',
}


def sha(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def collect() -> dict:
    cases = {}
    for label, opaque_id in CASES.items():
        root = ROOT / 'processor_inputs' / opaque_id
        if not root.is_dir():
            raise FileNotFoundError(root)
        files = {p.name: sha(p.read_bytes()) for p in sorted(root.iterdir()) if p.is_file()}
        transform = json.loads((root / 'transform.json').read_text())
        residual = transform.get('residual')
        actual = 'PRESENT' if isinstance(residual, list) and residual and residual[0] is not None else 'REMOVED'
        if actual != ('PRESENT' if label == 'valid' else 'REMOVED'):
            raise AssertionError(f'{label}: actual residual state differs')
        core = nexah_adapter.run(root)
        independent = baseline.run(root)
        cases[label] = {'opaque_id': opaque_id, 'carrier_sha256': baseline.input_digest(root),
                        'file_sha256': files, 'actual_residual_state': actual,
                        'nexah_raw': core, 'baseline_raw': independent}
    if (cases['valid']['nexah_raw']['status'], cases['valid']['baseline_raw']['status']) != ('PASS', 'PASS'):
        raise AssertionError('valid carrier gate mismatch')
    if (cases['D01_residual_removed']['nexah_raw']['status'],
            cases['D01_residual_removed']['baseline_raw']['status']) != ('PASS', 'DEFECT'):
        raise AssertionError('D01 capability gate mismatch')
    return {'schema': 'nexah.utility01r.terminal-capability-gate/1',
            'evidence_class': 'STOPPED_PREEXECUTION_DEVELOPMENT_CANDIDATE',
            'core_commit': CORE_COMMIT, 'claim': 'CAPABILITY_PREFLIGHT_ONLY_NO_UTILITY_RESULT',
            'cases': cases}


def semantic_view(value: dict) -> dict:
    cleaned = json.loads(json.dumps(value))
    for case in cleaned['cases'].values():
        for name in ('nexah_raw', 'baseline_raw'):
            case[name].pop('cost', None)
    return cleaned


if __name__ == '__main__':
    if len(sys.argv) not in (2, 3) or sys.argv[1] not in ('--write', '--verify'):
        raise SystemExit('usage: capability_gate.py {--write|--verify} [output.json]')
    destination = Path(sys.argv[2]) if len(sys.argv) == 3 else ROOT / 'gate_raw_outputs.json'
    current = collect()
    if sys.argv[1] == '--write':
        if destination.exists():
            raise FileExistsError(destination)
        destination.write_text(json.dumps(current, sort_keys=True, indent=2) + '\n')
    else:
        saved = json.loads(destination.read_text())
        if semantic_view(saved) != semantic_view(current):
            raise AssertionError('capability gate semantic replay mismatch')
    print('TERMINAL_CAPABILITY_GATE_PASS')
