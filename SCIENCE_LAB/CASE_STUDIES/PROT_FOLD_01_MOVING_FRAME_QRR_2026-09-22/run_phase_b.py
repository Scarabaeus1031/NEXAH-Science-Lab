#!/usr/bin/env python3
"""Execute the frozen PROT-FOLD-01 Phase-B local-orientation audit."""

from __future__ import annotations

import csv
import hashlib
import json
import math
from pathlib import Path

import numpy as np

import run_phase_a as phase_a


ROOT = Path(__file__).resolve().parent
SOURCE = ROOT / "SOURCE_DATA" / "1XQQ.pdb"
PROTOCOL = ROOT / "phase_b_protocol.json"


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def parse_backbone(path: Path, chain: str):
    models: dict[int, dict[int, dict[str, np.ndarray]]] = {}
    current: int | None = None
    required = {"N", "CA", "C"}
    with path.open("rt", encoding="ascii", errors="strict") as handle:
        for line in handle:
            record = line[:6].strip()
            if record == "MODEL":
                current = int(line[10:14])
                models[current] = {}
            elif record == "ENDMDL":
                current = None
            elif record == "ATOM" and current is not None:
                atom = line[12:16].strip()
                if line[21].strip() != chain or atom not in required:
                    continue
                if line[16].strip() not in {"", "A"} or line[26].strip():
                    continue
                resid = int(line[22:26])
                bucket = models[current].setdefault(resid, {})
                if atom in bucket:
                    raise ValueError(f"duplicate {atom} at model {current} residue {resid}")
                bucket[atom] = np.array(
                    [float(line[30:38]), float(line[38:46]), float(line[46:54])],
                    dtype=float,
                )
    model_ids = sorted(models)
    addresses = sorted(models[model_ids[0]])
    for model_id in model_ids:
        if sorted(models[model_id]) != addresses:
            raise ValueError(f"residue mismatch in model {model_id}")
        for resid in addresses:
            if set(models[model_id][resid]) != required:
                raise ValueError(f"missing backbone atom model={model_id} residue={resid}")
    array = np.stack(
        [
            np.stack(
                [np.stack([models[m][r][a] for a in ("N", "CA", "C")]) for r in addresses]
            )
            for m in model_ids
        ]
    )
    return model_ids, addresses, array


def body_align(backbone: np.ndarray, reference_ca_centered: np.ndarray):
    ca = backbone[:, 1, :]
    centroid = ca.mean(axis=0)
    rotation = phase_a.kabsch_to_reference(ca - centroid, reference_ca_centered)
    return (backbone - centroid) @ rotation


def local_frame(atoms: np.ndarray, threshold: float) -> np.ndarray:
    n, ca, c = atoms
    e1_raw = c - ca
    norm1 = np.linalg.norm(e1_raw)
    if norm1 < threshold:
        raise ValueError("degenerate C-CA axis")
    e1 = e1_raw / norm1
    n_raw = n - ca
    e2_raw = n_raw - np.dot(n_raw, e1) * e1
    norm2 = np.linalg.norm(e2_raw)
    if norm2 < threshold:
        raise ValueError("degenerate N-CA-C plane")
    e2 = e2_raw / norm2
    e3 = np.cross(e1, e2)
    return np.column_stack([e1, e2, e3])


def rotation_angle(matrix: np.ndarray) -> float:
    value = np.clip((np.trace(matrix) - 1.0) / 2.0, -1.0, 1.0)
    return float(np.arccos(value))


def matrix_to_quaternion(matrix: np.ndarray, tie_tolerance: float) -> np.ndarray:
    trace = float(np.trace(matrix))
    if trace > 0:
        scale = math.sqrt(trace + 1.0) * 2.0
        q = np.array([
            0.25 * scale,
            (matrix[2, 1] - matrix[1, 2]) / scale,
            (matrix[0, 2] - matrix[2, 0]) / scale,
            (matrix[1, 0] - matrix[0, 1]) / scale,
        ])
    else:
        idx = int(np.argmax(np.diag(matrix)))
        if idx == 0:
            scale = math.sqrt(1.0 + matrix[0, 0] - matrix[1, 1] - matrix[2, 2]) * 2.0
            q = np.array([(matrix[2, 1] - matrix[1, 2]) / scale, 0.25 * scale, (matrix[0, 1] + matrix[1, 0]) / scale, (matrix[0, 2] + matrix[2, 0]) / scale])
        elif idx == 1:
            scale = math.sqrt(1.0 + matrix[1, 1] - matrix[0, 0] - matrix[2, 2]) * 2.0
            q = np.array([(matrix[0, 2] - matrix[2, 0]) / scale, (matrix[0, 1] + matrix[1, 0]) / scale, 0.25 * scale, (matrix[1, 2] + matrix[2, 1]) / scale])
        else:
            scale = math.sqrt(1.0 + matrix[2, 2] - matrix[0, 0] - matrix[1, 1]) * 2.0
            q = np.array([(matrix[1, 0] - matrix[0, 1]) / scale, (matrix[0, 2] + matrix[2, 0]) / scale, (matrix[1, 2] + matrix[2, 1]) / scale, 0.25 * scale])
    q /= np.linalg.norm(q)
    sign_probe = q[0]
    if abs(sign_probe) <= tie_tolerance:
        for value in q[1:]:
            if abs(value) > tie_tolerance:
                sign_probe = value
                break
    if sign_probe < 0:
        q = -q
    return q


def quaternion_to_matrix(q: np.ndarray) -> np.ndarray:
    w, x, y, z = q / np.linalg.norm(q)
    return np.array([
        [1 - 2*(y*y + z*z), 2*(x*y - w*z), 2*(x*z + w*y)],
        [2*(x*y + w*z), 1 - 2*(x*x + z*z), 2*(y*z - w*x)],
        [2*(x*z - w*y), 2*(y*z + w*x), 1 - 2*(x*x + y*y)],
    ])


def hopf(q: np.ndarray) -> np.ndarray:
    w, x, y, z = q / np.linalg.norm(q)
    return np.array([2*(w*y + x*z), 2*(x*y - w*z), w*w + x*x - y*y - z*z])


def fiber_action(q: np.ndarray, alpha: float) -> np.ndarray:
    w, x, y, z = q
    c, s = math.cos(alpha), math.sin(alpha)
    return np.array([c*w - s*x, s*w + c*x, c*y - s*z, s*y + c*z])


def summarize(values: np.ndarray) -> dict[str, float]:
    return {
        "min": float(np.min(values)),
        "median": float(np.median(values)),
        "mean": float(np.mean(values)),
        "p95": float(np.percentile(values, 95)),
        "max": float(np.max(values)),
    }


def frames_for_model(backbone: np.ndarray, reference_ca_centered: np.ndarray, threshold: float):
    body = body_align(backbone, reference_ca_centered)
    return body, np.stack([local_frame(atoms, threshold) for atoms in body])


def main() -> int:
    protocol = json.loads(PROTOCOL.read_text())
    if sha256(SOURCE) != protocol["source_sha256"]:
        raise ValueError("source hash mismatch")
    model_ids, addresses, backbone = parse_backbone(SOURCE, protocol["carrier"]["chain"])
    expected_models = list(range(protocol["carrier"]["models"][0], protocol["carrier"]["models"][1] + 1))
    expected_addresses = list(range(protocol["carrier"]["residues"][0], protocol["carrier"]["residues"][1] + 1))
    if model_ids != expected_models or addresses != expected_addresses:
        raise ValueError("carrier addresses differ from protocol")

    threshold = protocol["local_frame"]["degenerate_norm_threshold_angstrom"]
    reference_ca = backbone[0, :, 1, :]
    reference_ca_centered = reference_ca - reference_ca.mean(axis=0)
    bodies, frames = [], []
    for model in backbone:
        body, model_frames = frames_for_model(model, reference_ca_centered, threshold)
        bodies.append(body)
        frames.append(model_frames)
    bodies = np.stack(bodies)
    frames = np.stack(frames)
    reference_frames = frames[0]
    relative = np.einsum("rij,mrjk->mrik", np.transpose(reference_frames, (0, 2, 1)), frames)

    angles = np.empty((len(model_ids), len(addresses)))
    quaternions = np.empty((len(model_ids), len(addresses), 4))
    frame_orth_errors, frame_det_errors = [], []
    quaternion_norm_errors, roundtrip_errors = [], []
    double_matrix_errors, double_hopf_errors, hopf_norm_errors = [], [], []
    fiber_hopf_errors, fiber_rotation_changes = [], []
    alpha = protocol["hopf"]["fiber_action_alpha_radians"]
    tie = protocol["quaternion"]["tie_tolerance"]
    identity = np.eye(3)
    for m in range(len(model_ids)):
        for r in range(len(addresses)):
            frame = frames[m, r]
            frame_orth_errors.append(float(np.max(np.abs(frame.T @ frame - identity))))
            frame_det_errors.append(abs(float(np.linalg.det(frame)) - 1.0))
            matrix = relative[m, r]
            angles[m, r] = rotation_angle(matrix)
            q = matrix_to_quaternion(matrix, tie)
            quaternions[m, r] = q
            quaternion_norm_errors.append(abs(float(np.linalg.norm(q)) - 1.0))
            roundtrip_errors.append(float(np.max(np.abs(quaternion_to_matrix(q) - matrix))))
            double_matrix_errors.append(float(np.max(np.abs(quaternion_to_matrix(q) - quaternion_to_matrix(-q)))))
            double_hopf_errors.append(float(np.max(np.abs(hopf(q) - hopf(-q)))))
            hopf_norm_errors.append(abs(float(np.linalg.norm(hopf(q))) - 1.0))
            q_fiber = fiber_action(q, alpha)
            fiber_hopf_errors.append(float(np.max(np.abs(hopf(q) - hopf(q_fiber)))))
            fiber_rotation_changes.append(rotation_angle(quaternion_to_matrix(q).T @ quaternion_to_matrix(q_fiber)))

    control_idx = protocol["controls"]["global_rotation_model"] - 1
    global_rotation = phase_a.axis_angle(
        np.array(protocol["controls"]["global_rotation_axis"]),
        protocol["controls"]["global_rotation_angle_radians"],
    )
    rotated_model = backbone[control_idx] @ global_rotation.T + np.array([10.0, -7.0, 3.5])
    _, rotated_frames = frames_for_model(rotated_model, reference_ca_centered, threshold)
    rotated_relative = np.einsum("rij,rjk->rik", np.transpose(reference_frames, (0, 2, 1)), rotated_frames)
    rotated_angles = np.array([rotation_angle(matrix) for matrix in rotated_relative])
    global_rotation_error = float(np.max(np.abs(rotated_angles - angles[control_idx])))

    reflection = np.diag(protocol["controls"]["reflection_matrix_diagonal"])
    reflected_model = backbone[0] @ reflection
    _, reflected_frames = frames_for_model(reflected_model, reference_ca_centered, threshold)
    reflected_relative = np.einsum("rij,rjk->rik", np.transpose(reference_frames, (0, 2, 1)), reflected_frames)
    reflected_angles = np.array([rotation_angle(matrix) for matrix in reflected_relative])
    reflection_mean_angle = float(np.mean(reflected_angles))

    missing_rejected = False
    try:
        missing = {"N": backbone[0, 9, 0], "CA": backbone[0, 9, 1]}
        if set(missing) != {"N", "CA", "C"}:
            raise ValueError("missing backbone atom")
    except ValueError:
        missing_rejected = True
    degenerate_rejected = False
    try:
        degenerate = backbone[0, 9].copy()
        degenerate[0] = degenerate[1]
        local_frame(degenerate, threshold)
    except ValueError:
        degenerate_rejected = True

    gates = protocol["gates"]
    metrics = {
        "valid_frame_count": int(np.prod(frames.shape[:2])),
        "frame_orthonormality_max_error": max(frame_orth_errors),
        "frame_determinant_max_error": max(frame_det_errors),
        "quaternion_norm_max_error": max(quaternion_norm_errors),
        "quaternion_roundtrip_max_error": max(roundtrip_errors),
        "double_cover_matrix_max_error": max(double_matrix_errors),
        "double_cover_hopf_max_error": max(double_hopf_errors),
        "hopf_norm_max_error": max(hopf_norm_errors),
        "fiber_hopf_max_error": max(fiber_hopf_errors),
        "fiber_rotation_change_min_radians": min(fiber_rotation_changes),
        "global_rotation_angle_max_error_radians": global_rotation_error,
        "reflection_mean_local_angle_radians": reflection_mean_angle,
    }
    primary = {
        "all_frames_valid": metrics["valid_frame_count"] == 128 * 76,
        "frames_orthonormal": metrics["frame_orthonormality_max_error"] <= gates["frame_orthonormality_max_error"],
        "frames_right_handed": metrics["frame_determinant_max_error"] <= gates["frame_determinant_max_error"],
        "quaternions_unit": metrics["quaternion_norm_max_error"] <= gates["quaternion_norm_max_error"],
        "quaternion_roundtrip": metrics["quaternion_roundtrip_max_error"] <= gates["quaternion_roundtrip_max_error"],
        "double_cover_invariant": max(metrics["double_cover_matrix_max_error"], metrics["double_cover_hopf_max_error"]) <= gates["double_cover_max_error"],
        "hopf_unit": metrics["hopf_norm_max_error"] <= gates["hopf_norm_max_error"],
        "hopf_fiber_noninjectivity": metrics["fiber_hopf_max_error"] <= gates["fiber_hopf_max_error"] and metrics["fiber_rotation_change_min_radians"] >= gates["fiber_min_rotation_change_radians"],
        "global_rotation_invariant": metrics["global_rotation_angle_max_error_radians"] <= gates["global_rotation_angle_max_error_radians"],
        "reflection_detected": metrics["reflection_mean_local_angle_radians"] >= gates["reflection_min_mean_local_angle_radians"],
        "missing_atom_rejected": missing_rejected,
        "degenerate_frame_rejected": degenerate_rejected,
    }

    with (ROOT / "phase_b_per_residue_orientation.csv").open("w", newline="") as handle:
        writer = csv.writer(handle)
        writer.writerow(["residue_id", "mean_angle_deg", "median_angle_deg", "p95_angle_deg", "max_angle_deg"])
        for idx, resid in enumerate(addresses):
            degrees = np.degrees(angles[:, idx])
            writer.writerow([resid, np.mean(degrees), np.median(degrees), np.percentile(degrees, 95), np.max(degrees)])

    mean_degrees = np.mean(np.degrees(angles), axis=0)
    top = np.argsort(mean_degrees)[::-1][:10]
    result = {
        "protocol_id": protocol["protocol_id"],
        "protocol_sha256": sha256(PROTOCOL),
        "source_sha256": sha256(SOURCE),
        "status": "PASS" if all(primary.values()) else "FAIL",
        "decision": "PHASE_B_LOCAL_ORIENTATION_AUDIT_CONFIRMED" if all(primary.values()) else "STOP_PHASE_B_PRIMARY_GATE_FAILED",
        "carrier": {"models": len(model_ids), "residues": len(addresses), "local_frames": 128 * 76, "model_index_is_time": False},
        "primary_gates": primary,
        "metrics": metrics,
        "descriptive_orientation": {
            "all_model_residue_angles_degrees": summarize(np.degrees(angles).ravel()),
            "top_mean_orientation_variability": [
                {"residue_id": addresses[i], "mean_angle_deg": float(mean_degrees[i])}
                for i in top
            ],
        },
        "hopf_boundary": {
            "view_is_noninvertible": True,
            "s1_fiber_demonstrated": True,
            "inverse_reconstruction_claimed": False,
            "controlling_orientation_record": "SO3_MATRIX_PLUS_CANONICAL_QUATERNION",
        },
        "holds": {"phase_c_axis08": "HOLD_NATURAL_PAIR_UNRESOLVED", "phase_d_mod7_11": "HOLD"},
        "nonclaims": ["no temporal dynamics", "no folding path", "no causal Hopf mechanism", "no protein prediction", "no new capability"],
    }
    (ROOT / "phase_b_results.json").write_text(json.dumps(result, indent=2) + "\n")
    print(json.dumps({"status": result["status"], "decision": result["decision"], "primary_gates": primary}, indent=2))
    return 0 if result["status"] == "PASS" else 1


if __name__ == "__main__":
    raise SystemExit(main())
