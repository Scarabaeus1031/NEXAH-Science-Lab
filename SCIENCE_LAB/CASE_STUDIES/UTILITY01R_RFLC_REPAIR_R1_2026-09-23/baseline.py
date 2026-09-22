#!/usr/bin/env python3
"""Independent integrated numerical/provenance/crate/checklist baseline.

This module imports no NEXAH implementation. All checks use the actual carrier
bytes supplied to the processor, never a fabricated valid comparison object.
"""

from __future__ import annotations

import hashlib
import json
import math
from pathlib import Path
import resource
import sys
import time
from typing import Any

import numpy as np

CLAIM = 'BOUNDED_IEEE_REPRESENTATION_FIDELITY_AUDIT'
HUMAN = ('Inspection, interpretation, adoption, rejection, and continuation remain '
         'Human-owned.')


def canonical(value: Any) -> bytes:
    return json.dumps(value, sort_keys=True, separators=(',', ':'), ensure_ascii=False).encode()


def sha(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def input_digest(root: Path) -> str:
    return sha(canonical({p.name: sha(p.read_bytes()) for p in sorted(root.iterdir()) if p.is_file()}))


def from_file(root: Path, name: str) -> dict[str, Any]:
    value = json.loads((root / name).read_text(encoding='utf-8'))
    if not isinstance(value, dict):
        raise ValueError(f'{name} must be a JSON object')
    return value


def derive_rows(campaign: dict[str, Any]) -> np.ndarray:
    rows = []
    for frame in campaign['frames']:
        if frame['status'] != 'converged':
            break
        bus = next(v for v in frame['entity_views'] if v['entity_scope'] == 'bus')
        line = next(v for v in frame['entity_views'] if v['entity_scope'] == 'line')
        bv = np.asarray(bus['values'], dtype=float)
        lv = np.asarray(line['values'], dtype=float)
        vm = bv[:, bus['variable_names'].index('vm_pu')]
        va = bv[:, bus['variable_names'].index('va_degree')]
        p = bv[:, bus['variable_names'].index('p_mw')]
        q = bv[:, bus['variable_names'].index('q_mvar')]
        loading = lv[:, line['variable_names'].index('loading_percent')]
        derived = np.asarray([np.mean(vm), np.std(vm), np.max(va) - np.min(va),
                              np.max(loading), np.sum(p[p > 0]), np.sum(q[q > 0]),
                              np.min(vm), np.max(vm)], dtype=float)
        declared = dict(zip(frame['system_features']['feature_names'],
                            frame['system_features']['values']))
        names = ('mean_bus_voltage', 'bus_voltage_std', 'bus_angle_range',
                 'maximum_line_loading', 'total_bus_consumption_p',
                 'total_bus_consumption_q', 'minimum_bus_voltage')
        if any(abs(derived[i] - declared[name]) > 1e-12 for i, name in enumerate(names)):
            raise ValueError('source frame summary differs from actual entity views')
        rows.append(derived)
    if len(rows) < 9:
        raise ValueError('source campaign lacks nine converged fit rows')
    return np.asarray(rows, dtype=float)


def loc(role: str, file: str, pointer: str) -> dict[str, str]:
    return {'artifact_role': role, 'relative_path': file,
            'pointer_kind': 'JSON_POINTER', 'pointer': pointer}


def detect(root: Path) -> tuple[str, str, dict[str, str] | None, str]:
    manifest = from_file(root, 'manifest.json')
    declared = manifest.get('files', {})
    if set(declared) != {'analysis.json', 'computation_result.json', 'report.md'}:
        return 'DEFECT', 'D06', loc('RO_CRATE', 'manifest.json', '/files'), 'BUNDLE_FILE_SET'
    for file in ('analysis.json', 'computation_result.json', 'report.md'):
        actual = (root / file).read_bytes()
        if declared[file].get('bytes') != len(actual):
            return 'DEFECT', 'D06', loc('RO_CRATE', 'manifest.json', f'/files/{file}/bytes'), 'BUNDLE_BYTE_COUNT'
        if declared[file].get('sha256') != 'sha256:' + sha(actual):
            return 'DEFECT', 'D06', loc('RO_CRATE', 'manifest.json', f'/files/{file}/sha256'), 'BUNDLE_DIGEST'

    source = from_file(root, 'source.json')
    if source.get('source_identity_candidates'):
        return 'UNKNOWN', 'NONE', None, 'AMBIGUOUS_SOURCE_IDENTITY'
    for name in ('development', 'evaluation'):
        campaign = source[f'{name}_campaign']
        if source.get(f'{name}_sha256') != sha(canonical(campaign)):
            return 'DEFECT', 'D05', loc('SOURCE_FRAME', 'source.json', f'/{name}_sha256'), 'SOURCE_DIGEST'
    actual_failed = [frame['frame_id'] for frame in source['development_campaign']['frames']
                     if frame['status'] == 'failed']
    if actual_failed != source['expected_failed_frame_ids']:
        return 'DEFECT', 'D09', loc('SOURCE_FRAME', 'source.json', '/development_campaign/frames'), 'FAILED_FRAME_LOSS'
    for frame in source['development_campaign']['frames']:
        if frame['status'] == 'failed' and (frame['system_features'] is not None or frame['entity_views']):
            return 'DEFECT', 'D09', loc('SOURCE_FRAME', 'source.json', '/development_campaign/frames'), 'IMPUTED_FAILURE'

    t = from_file(root, 'transform.json')
    if 'samples' not in t:
        return 'ABSTAIN', 'NONE', None, 'MISSING_REQUIRED_SAMPLES'
    if t.get('tolerance') != 1e-12:
        return 'DEFECT', 'D04', loc('TRANSFORM', 'transform.json', '/tolerance'), 'TOLERANCE_CHANGED'
    if t.get('rule') != 'q=(z_min+z_max)/sqrt(2);r=(z_min-z_max)/sqrt(2)':
        return 'DEFECT', 'D04', loc('TRANSFORM', 'transform.json', '/rule'), 'RULE_CHANGED'
    expected = np.eye(8)
    expected[6, 6] = expected[6, 7] = 1 / math.sqrt(2)
    expected[7, 6], expected[7, 7] = 1 / math.sqrt(2), -1 / math.sqrt(2)
    matrix = np.asarray(t['matrix'], dtype=float)
    if matrix.shape != (8, 8):
        return 'DEFECT', 'D02', loc('TRANSFORM', 'transform.json', '/matrix'), 'MATRIX_SHAPE'
    if not np.allclose(matrix, expected, atol=1e-12, rtol=0):
        if np.allclose(matrix[6], expected[7], atol=1e-12, rtol=0):
            pointer = '/matrix/6'
        elif abs(matrix[7, 6] - expected[7, 6]) > 1e-12:
            pointer = '/matrix/7/6'
        else:
            pointer = '/matrix/7/7'
        return 'DEFECT', 'D02', loc('TRANSFORM', 'transform.json', pointer), 'MATRIX_RULE'
    samples = np.asarray(t['samples'], dtype=float)
    stored = np.asarray(t['stored'], dtype=float)
    if samples.ndim != 2 or samples.shape[1] != 8 or stored.shape != samples.shape:
        return 'DEFECT', 'D03', loc('TRANSFORM', 'transform.json', '/stored'), 'SAMPLE_SHAPE'
    singular = np.linalg.svd(matrix, compute_uv=False)
    svd_tol = 1e-12 * max(matrix.shape) * singular[0]
    rank = int(np.sum(singular > svd_tol))
    null_dim = matrix.shape[1] - rank
    basis = np.asarray(t['admissible_basis'], dtype=float)
    restricted = matrix @ basis
    restricted_singular = np.linalg.svd(restricted, compute_uv=False)
    restricted_rank = int(np.sum(restricted_singular > svd_tol))
    reconstructed = stored @ np.linalg.pinv(matrix, rcond=1e-12).T
    error = float(np.max(np.abs(reconstructed - samples)))
    if rank != t.get('claimed_rank') or null_dim != 0 or restricted_rank != basis.shape[1] or error > 1e-12:
        return 'DEFECT', 'D02', loc('TRANSFORM', 'transform.json', '/matrix'), 'RANK_NULLSPACE_OR_RECONSTRUCTION'
    if float(np.max(np.abs(stored - samples @ matrix.T))) > 1e-12:
        return 'DEFECT', 'D03', loc('TRANSFORM', 'transform.json', '/stored'), 'STORED_TRANSFORM'
    if not isinstance(t.get('residual'), list):
        return 'DEFECT', 'D01', loc('TRANSFORM', 'transform.json', '/residual'), 'RESIDUAL_MISSING'
    for i, item in enumerate(t['residual']):
        if item is None or not math.isfinite(float(item)) or abs(item - stored[i, 7]) > 1e-12:
            return 'DEFECT', 'D01', loc('TRANSFORM', 'transform.json', f'/residual/{i}'), 'RESIDUAL_MISMATCH'
    if len(t['residual']) != len(stored):
        return 'DEFECT', 'D01', loc('TRANSFORM', 'transform.json', '/residual'), 'RESIDUAL_LENGTH'
    for i, item in enumerate(t['quotient']):
        if abs(item - stored[i, 6]) > 1e-12:
            return 'DEFECT', 'D03', loc('TRANSFORM', 'transform.json', f'/quotient/{i}'), 'QUOTIENT_MISMATCH'

    fit = from_file(root, 'pca_fit.json')
    if fit.get('training_source_sha256') != source['development_sha256']:
        return 'DEFECT', 'D07', loc('PCA_FIT', 'pca_fit.json', '/training_source_sha256'), 'FIT_SOURCE_BINDING'
    training = derive_rows(source['development_campaign'])
    means = training.mean(axis=0)
    std = training.std(axis=0)
    standardized = (training - means) / std
    _, _, vt = np.linalg.svd(standardized, full_matrices=False)
    expected_basis = vt[:7].T
    actual_means = np.asarray(fit['mean'], dtype=float)
    for i in range(8):
        if abs(actual_means[i] - means[i]) > 1e-10:
            return 'DEFECT', 'D07', loc('PCA_FIT', 'pca_fit.json', f'/mean/{i}'), 'EVALUATION_LEAKED_INTO_FIT'
    if not np.allclose(np.asarray(fit['stddev'], dtype=float), std, atol=1e-10, rtol=0):
        return 'DEFECT', 'D07', loc('PCA_FIT', 'pca_fit.json', '/stddev'), 'FIT_SCALE_MISMATCH'
    if not np.allclose(np.asarray(fit['basis'], dtype=float), expected_basis, atol=1e-9, rtol=0):
        return 'DEFECT', 'D08', loc('PCA_FIT', 'pca_fit.json', '/basis'), 'EVALUATION_REFIT_BASIS'
    if fit.get('fit_role') != 'development' or fit.get('evaluation_included') is not False:
        return 'DEFECT', 'D08', loc('PCA_FIT', 'pca_fit.json', '/fit_role'), 'FIT_ROLE'

    prov = from_file(root, 'prov.json')
    if prov.get('entities', {}).get('source') != 'sha256:' + source['development_sha256']:
        return 'DEFECT', 'D15', loc('PROV_GRAPH', 'prov.json', '/entities/source'), 'PROV_SOURCE_BINDING'
    if prov['entities'].get('analysis') != 'sha256:' + sha((root / 'analysis.json').read_bytes()):
        return 'DEFECT', 'D15', loc('PROV_GRAPH', 'prov.json', '/entities/analysis'), 'PROV_ANALYSIS_BINDING'
    if prov['entities'].get('payload') != 'sha256:' + sha((root / 'payload.dat').read_bytes()):
        return 'DEFECT', 'D15', loc('PROV_GRAPH', 'prov.json', '/entities/payload'), 'PROV_PAYLOAD_BINDING'
    if not prov.get('used'):
        return 'DEFECT', 'D15', loc('PROV_GRAPH', 'prov.json', '/used'), 'PROV_USAGE_MISSING'
    if prov['used'][0] != ['fit', 'source']:
        return 'DEFECT', 'D15', loc('PROV_GRAPH', 'prov.json', '/used/0/1'), 'PROV_USAGE_CORRUPT'
    if (prov.get('activities', {}).get('fit') != 'development_only'
            or 'owner' not in prov.get('agents', {})
            or prov.get('wasGeneratedBy') != [['analysis', 'fit']]
            or prov.get('wasDerivedFrom') != [['analysis', 'source']]
            or prov.get('wasAssociatedWith') != [['fit', 'owner']]):
        return 'DEFECT', 'D15', loc('PROV_GRAPH', 'prov.json', '/wasDerivedFrom'), 'PROV_GRAPH_CONSTRAINT'

    crate = from_file(root, 'ro-crate-metadata.json')
    graph = {node.get('@id'): node for node in crate.get('@graph', [])}
    payload = (root / 'payload.dat').read_bytes()
    if (crate.get('@context') != 'https://w3id.org/ro/crate/1.3/context'
            or crate.get('profile') != 'RO-Crate 1.3'
            or set(graph) != {'ro-crate-metadata.json', './', '#owner', 'payload.dat'}
            or graph['ro-crate-metadata.json'].get('about') != {'@id': './'}
            or graph['ro-crate-metadata.json'].get('conformsTo') != {'@id': 'https://w3id.org/ro/crate/1.3'}
            or graph['./'].get('hasPart') != [{'@id': 'payload.dat'}]
            or graph['./'].get('creator') != {'@id': '#owner'}
            or graph['payload.dat'].get('sha256') != sha(payload)
            or graph['payload.dat'].get('contentSize') != len(payload)
            or graph['payload.dat'].get('wasDerivedFrom') != {'@id': './'}):
        return 'DEFECT', 'D06', loc('RO_CRATE', 'ro-crate-metadata.json', '/@graph'), 'CRATE_IDENTITY_OR_DIGEST'

    checklist = from_file(root, 'checklist.json')
    claim = from_file(root, 'claim.json')
    if (checklist.get('version') != '1.0' or checklist.get('source_digest_required') is not True
            or checklist.get('failed_frames_must_remain_explicit') is not True
            or checklist.get('provenance_edges_required') is not True
            or checklist.get('reconstruction_tolerance') != 1e-12):
        return 'DEFECT', 'D04', loc('CLAIM_RECORD', 'checklist.json', '/version'), 'CHECKLIST_CONTRACT'
    if claim.get('failure_status') != 'preserved':
        return 'DEFECT', 'D10', loc('CLAIM_RECORD', 'claim.json', '/failure_status'), 'FAILURE_STATE_DOWNGRADED'
    if claim.get('qr_storage_scalars') != 8 or claim.get('qr_compression_claim') is not False:
        return 'DEFECT', 'D11', loc('CLAIM_RECORD', 'claim.json', '/qr_storage_scalars'), 'EIGHT_SCALAR_MISCLAIM'
    if claim.get('pca7_reported') is not True:
        return 'DEFECT', 'D12', loc('CLAIM_RECORD', 'claim.json', '/pca7_reported'), 'PCA7_SUPPRESSED'
    if claim.get('q_only_lossless_claim') is not False or claim.get('reconstruction_claim') != 'q_plus_r_only':
        return 'DEFECT', 'D13', loc('CLAIM_RECORD', 'claim.json', '/q_only_lossless_claim'), 'LOSSLESSNESS_MISCLAIM'
    if (claim.get('claim_ceiling') != CLAIM or claim.get('human_authority') != HUMAN
            or checklist.get('claim_ceiling') != CLAIM or checklist.get('human_authority') != HUMAN):
        return 'DEFECT', 'D14', loc('CLAIM_RECORD', 'claim.json', '/claim_ceiling'), 'CLAIM_AUTHORITY_ELEVATED'
    return 'PASS', 'NONE', None, ''


def run(root: Path) -> dict[str, Any]:
    started = time.perf_counter_ns()
    digest_value = input_digest(root)
    try:
        status, defect, location, reason = detect(root)
    except (OSError, ValueError, KeyError, TypeError, IndexError, np.linalg.LinAlgError) as error:
        status, defect, location, reason = 'ERROR', 'NONE', None, type(error).__name__
    record = {'id': root.name, 'input_sha256': digest_value, 'status': status,
              'defect_class': defect, 'location': location,
              'evidence': [{'input_sha256': digest_value, 'artifact': location['relative_path']
                            if location else None}],
              'reconstruction_state': 'UNKNOWN' if status != 'PASS' else 'RETAINED',
              'reason': reason, 'unmet_precondition': reason if status in ('ABSTAIN', 'UNKNOWN') else '',
              'claim_ceiling': CLAIM, 'software_version': 'INDEPENDENT_BASELINE_R1_V1',
              'cost': {'runtime_ns': time.perf_counter_ns() - started,
                       'peak_rss': resource.getrusage(resource.RUSAGE_SELF).ru_maxrss}}
    record['cost']['output_bytes'] = len(canonical(record))
    return record


if __name__ == '__main__':
    if len(sys.argv) != 2:
        raise SystemExit('usage: baseline.py /path/to/opaque/carrier')
    print(canonical(run(Path(sys.argv[1]))).decode())
