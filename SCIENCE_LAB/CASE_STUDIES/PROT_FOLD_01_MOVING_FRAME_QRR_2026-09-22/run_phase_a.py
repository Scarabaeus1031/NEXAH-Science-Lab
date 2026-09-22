#!/usr/bin/env python3
"""Execute the frozen PROT-FOLD-01 Phase-A representation-fidelity protocol."""

from __future__ import annotations

import csv
import hashlib
import json
import math
from pathlib import Path

import numpy as np


ROOT = Path(__file__).resolve().parent
SOURCE = ROOT / "SOURCE_DATA" / "1XQQ.pdb"
PROTOCOL = ROOT / "phase_a_protocol.json"


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def parse_ca_models(path: Path, chain: str) -> tuple[list[int], list[int], np.ndarray]:
    models: dict[int, dict[int, np.ndarray]] = {}
    current: int | None = None
    with path.open("rt", encoding="ascii", errors="strict") as handle:
        for line in handle:
            record = line[:6].strip()
            if record == "MODEL":
                current = int(line[10:14])
                if current in models:
                    raise ValueError(f"duplicate model {current}")
                models[current] = {}
            elif record == "ENDMDL":
                current = None
            elif record == "ATOM" and current is not None:
                if line[21].strip() != chain or line[12:16].strip() != "CA":
                    continue
                altloc = line[16].strip()
                if altloc not in {"", "A"}:
                    continue
                if line[26].strip():
                    raise ValueError("insertion-coded selected residue is outside protocol")
                resid = int(line[22:26])
                if resid in models[current]:
                    raise ValueError(f"duplicate CA address model={current} residue={resid}")
                models[current][resid] = np.array(
                    [float(line[30:38]), float(line[38:46]), float(line[46:54])],
                    dtype=float,
                )
    model_ids = sorted(models)
    if not model_ids:
        raise ValueError("no MODEL records found")
    addresses = sorted(models[model_ids[0]])
    for model_id in model_ids:
        if sorted(models[model_id]) != addresses:
            raise ValueError(f"CA address mismatch in model {model_id}")
    coordinates = np.stack(
        [np.stack([models[m][r] for r in addresses]) for m in model_ids]
    )
    return model_ids, addresses, coordinates


def pair_distances(x: np.ndarray) -> np.ndarray:
    delta = x[:, None, :] - x[None, :, :]
    return np.sqrt(np.sum(delta * delta, axis=2))


def kabsch_to_reference(mobile: np.ndarray, reference: np.ndarray) -> np.ndarray:
    covariance = mobile.T @ reference
    u, _, vt = np.linalg.svd(covariance)
    rotation = u @ vt
    if np.linalg.det(rotation) < 0:
        u[:, -1] *= -1
        rotation = u @ vt
    return rotation


def align_and_reconstruct(x: np.ndarray, reference_centered: np.ndarray):
    centroid = x.mean(axis=0)
    centered = x - centroid
    rotation = kabsch_to_reference(centered, reference_centered)
    body = centered @ rotation
    reconstructed = body @ rotation.T + centroid
    rmsd = float(np.sqrt(np.mean(np.sum((body - reference_centered) ** 2, axis=1))))
    return centroid, rotation, body, reconstructed, rmsd


def contact_matrix(x: np.ndarray, threshold: float, min_sep: int) -> np.ndarray:
    distances = pair_distances(x)
    indices = np.arange(len(x))
    allowed = np.abs(indices[:, None] - indices[None, :]) >= min_sep
    return (distances <= threshold) & allowed


def agreement(a: np.ndarray, b: np.ndarray) -> float:
    upper = np.triu_indices(len(a), 1)
    return float(np.mean(a[upper] == b[upper]))


def chirality(x: np.ndarray, addresses: list[int], selected: list[int]) -> float:
    position = {resid: idx for idx, resid in enumerate(addresses)}
    a, b, c, d = (x[position[r]] for r in selected)
    return float(np.dot(b - a, np.cross(c - a, d - a)))


def axis_angle(axis: np.ndarray, angle: float) -> np.ndarray:
    axis = axis / np.linalg.norm(axis)
    x, y, z = axis
    c, s, one = math.cos(angle), math.sin(angle), 1.0 - math.cos(angle)
    return np.array(
        [
            [c + x*x*one, x*y*one - z*s, x*z*one + y*s],
            [y*x*one + z*s, c + y*y*one, y*z*one - x*s],
            [z*x*one - y*s, z*y*one + x*s, c + z*z*one],
        ]
    )


def summary(values: np.ndarray) -> dict[str, float]:
    return {
        "min": float(np.min(values)),
        "median": float(np.median(values)),
        "mean": float(np.mean(values)),
        "p95": float(np.percentile(values, 95)),
        "max": float(np.max(values)),
    }


def main() -> int:
    protocol = json.loads(PROTOCOL.read_text())
    source_hash = sha256(SOURCE)
    if source_hash != protocol["source_sha256"]:
        raise ValueError("source SHA-256 does not match frozen protocol")

    model_ids, addresses, coordinates = parse_ca_models(SOURCE, protocol["selection"]["chain"])
    expected_addresses = list(range(protocol["selection"]["residue_ids"][0], protocol["selection"]["residue_ids"][1] + 1))
    if model_ids != list(range(1, protocol["selection"]["expected_model_count"] + 1)):
        raise ValueError("model address set differs from protocol")
    if coordinates.shape[1] != protocol["selection"]["expected_selected_atom_count"]:
        raise ValueError("selected atom count differs from protocol")
    if addresses != expected_addresses:
        raise ValueError("selected residue addresses differ from protocol")

    reference = coordinates[0]
    reference_centered = reference - reference.mean(axis=0)
    threshold = protocol["contacts"]["threshold_angstrom"]
    min_sep = protocol["contacts"]["minimum_sequence_separation"]

    bodies, rotations, rmsds, reconstruction_errors = [], [], [], []
    pair_errors, contact_agreements, chirality_values = [], [], []
    for x in coordinates:
        _, rotation, body, reconstructed, rmsd = align_and_reconstruct(x, reference_centered)
        bodies.append(body)
        rotations.append(rotation)
        rmsds.append(rmsd)
        reconstruction_errors.append(float(np.max(np.abs(reconstructed - x))))
        pair_errors.append(float(np.max(np.abs(pair_distances(body) - pair_distances(x)))))
        contact_agreements.append(agreement(contact_matrix(x, threshold, min_sep), contact_matrix(body, threshold, min_sep)))
        chirality_values.append(chirality(x, addresses, protocol["chirality_residue_ids"]))
    bodies_array = np.stack(bodies)
    rotations_array = np.stack(rotations)
    rmsds_array = np.array(rmsds)

    displacement = np.linalg.norm(bodies_array - reference_centered[None, :, :], axis=2)
    with (ROOT / "phase_a_per_residue.csv").open("w", newline="") as handle:
        writer = csv.writer(handle)
        writer.writerow(["residue_id", "mean_displacement_A", "sd_displacement_A", "p95_displacement_A", "max_displacement_A"])
        for idx, resid in enumerate(addresses):
            values = displacement[:, idx]
            writer.writerow([resid, np.mean(values), np.std(values), np.percentile(values, 95), np.max(values)])

    contact_stack = np.stack([contact_matrix(x, threshold, min_sep) for x in bodies_array])
    occupancy = np.mean(contact_stack, axis=0)
    with (ROOT / "phase_a_contact_occupancy.csv").open("w", newline="") as handle:
        writer = csv.writer(handle)
        writer.writerow(["residue_i", "residue_j", "occupancy"])
        for i in range(len(addresses)):
            for j in range(i + 1, len(addresses)):
                if j - i >= min_sep:
                    writer.writerow([addresses[i], addresses[j], occupancy[i, j]])

    pairwise_rmsd = []
    for i in range(len(bodies_array)):
        for j in range(i + 1, len(bodies_array)):
            pairwise_rmsd.append(float(np.sqrt(np.mean(np.sum((bodies_array[i] - bodies_array[j]) ** 2, axis=1)))))

    control_translation = np.array(protocol["controls"]["translation_angstrom"])
    control_rotation = axis_angle(
        np.array(protocol["controls"]["rotation_axis"]),
        protocol["controls"]["rotation_angle_radians"],
    )
    translated = reference + control_translation
    rotated = reference_centered @ control_rotation.T + reference.mean(axis=0)
    reflected = reference @ np.diag(protocol["controls"]["reflection_matrix_diagonal"])
    permuted = reference[::-1].copy()

    controls = {}
    for name, x in (("translation", translated), ("proper_rotation", rotated), ("reflection", reflected), ("reversed_identity", permuted)):
        _, rotation, body, reconstructed, rmsd = align_and_reconstruct(x, reference_centered)
        controls[name] = {
            "alignment_rmsd_A": rmsd,
            "reconstruction_max_abs_error_A": float(np.max(np.abs(reconstructed - x))),
            "rotation_determinant": float(np.linalg.det(rotation)),
            "pair_distance_max_abs_error_A": float(np.max(np.abs(pair_distances(body) - pair_distances(x)))),
            "contact_agreement_with_reference": agreement(contact_matrix(body, threshold, min_sep), contact_matrix(reference_centered, threshold, min_sep)),
            "chirality": chirality(x, addresses, protocol["chirality_residue_ids"]),
        }

    ref_chirality = chirality(reference, addresses, protocol["chirality_residue_ids"])
    gates = protocol["gates"]
    primary = {
        "source_hash_match": source_hash == protocol["source_sha256"],
        "model_count_exact": len(model_ids) == protocol["selection"]["expected_model_count"],
        "selected_atom_count_exact": coordinates.shape[1] == protocol["selection"]["expected_selected_atom_count"],
        "pair_distance_invariance": max(pair_errors) <= gates["pair_distance_max_abs_error"],
        "source_reconstruction": max(reconstruction_errors) <= gates["source_reconstruction_max_abs_error"],
        "proper_rotations_only": float(np.max(np.abs(np.linalg.det(rotations_array) - 1.0))) <= gates["rotation_determinant_abs_error"],
        "contact_matrix_invariance": min(contact_agreements) == gates["contact_agreement"],
        "translation_control": controls["translation"]["alignment_rmsd_A"] <= gates["rigid_control_alignment_rmsd"],
        "proper_rotation_control": controls["proper_rotation"]["alignment_rmsd_A"] <= gates["rigid_control_alignment_rmsd"],
        "reflection_detected": (
            np.sign(controls["reflection"]["chirality"]) == -np.sign(ref_chirality)
            and controls["reflection"]["rotation_determinant"] > 0
            and controls["reflection"]["alignment_rmsd_A"] >= gates["reflection_min_alignment_rmsd"]
        ),
        "identity_corruption_detected": (
            controls["reversed_identity"]["alignment_rmsd_A"] >= gates["permutation_min_alignment_rmsd"]
            and controls["reversed_identity"]["contact_agreement_with_reference"] < gates["permutation_max_contact_agreement"]
        ),
    }

    residue_mean = np.mean(displacement, axis=0)
    top_indices = np.argsort(residue_mean)[::-1][:10]
    variable_contacts = []
    for i in range(len(addresses)):
        for j in range(i + min_sep, len(addresses)):
            value = float(occupancy[i, j])
            if 0.05 <= value <= 0.95:
                variable_contacts.append({"residue_i": addresses[i], "residue_j": addresses[j], "occupancy": value})
    variable_contacts.sort(key=lambda row: abs(row["occupancy"] - 0.5))

    result = {
        "protocol_id": protocol["protocol_id"],
        "protocol_sha256": sha256(PROTOCOL),
        "source_sha256": source_hash,
        "status": "PASS" if all(primary.values()) else "FAIL",
        "decision": "PHASE_A_FRAME_FIDELITY_CONFIRMED" if all(primary.values()) else "STOP_PHASE_A_PRIMARY_GATE_FAILED",
        "carrier": {
            "model_count": len(model_ids),
            "selected_atom": "CA",
            "chain": protocol["selection"]["chain"],
            "residue_count": coordinates.shape[1],
            "residue_range": [addresses[0], addresses[-1]],
            "reference_model": protocol["selection"]["reference_model"],
            "model_index_is_time": False,
        },
        "primary_gates": primary,
        "fidelity_metrics": {
            "pair_distance_max_abs_error_A": max(pair_errors),
            "source_reconstruction_max_abs_error_A": max(reconstruction_errors),
            "rotation_determinant_max_abs_error": float(np.max(np.abs(np.linalg.det(rotations_array) - 1.0))),
            "contact_agreement_min": min(contact_agreements),
            "actual_model_chirality_sign_agreement_fraction": float(np.mean(np.sign(chirality_values) == np.sign(ref_chirality))),
        },
        "controls": controls,
        "descriptive_ensemble": {
            "rmsd_to_reference_A": summary(rmsds_array),
            "pairwise_body_frame_rmsd_A": summary(np.array(pairwise_rmsd)),
            "top_mean_displacement_residues": [
                {"residue_id": addresses[i], "mean_displacement_A": float(residue_mean[i])}
                for i in top_indices
            ],
            "variable_contact_count_occupancy_0_05_to_0_95": len(variable_contacts),
            "ten_contacts_closest_to_half_occupancy": variable_contacts[:10],
        },
        "holds": {
            "phase_b": "HOLD",
            "phase_c_axis08": "HOLD_NATURAL_PAIR_UNRESOLVED",
            "phase_d_mod7_11": "HOLD_PENDING_TYPED_UTILITY_QUESTION",
        },
        "nonclaims": [
            "no temporal trajectory",
            "no folding kinetics or causal mechanism",
            "no E8 Hopf or Mod-7/11 biological identity",
            "no protein prediction",
            "no new capability",
        ],
    }
    (ROOT / "phase_a_results.json").write_text(json.dumps(result, indent=2) + "\n")
    print(json.dumps({"status": result["status"], "decision": result["decision"], "primary_gates": primary}, indent=2))
    return 0 if result["status"] == "PASS" else 1


if __name__ == "__main__":
    raise SystemExit(main())
