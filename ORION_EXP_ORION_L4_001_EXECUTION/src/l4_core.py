from __future__ import annotations

import hashlib
import io
import json
import zipfile
from dataclasses import dataclass
from pathlib import Path
from typing import Callable

import numpy as np

ACTION_IDS = ("U0", "UXP", "UXM", "UYP", "UYM", "UZP", "UZM")
SCALE_MATRIX = np.diag([2.0, 0.5, 1.5])
PULLBACK_METRIC = np.linalg.inv(SCALE_MATRIX).T @ np.linalg.inv(SCALE_MATRIX)


def save_json(path: Path, obj: object) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(obj, indent=2, sort_keys=True, allow_nan=False) + "\n")


def load_json(path: Path) -> object:
    return json.loads(path.read_text())


def sha256_file(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def sha_seed(label: str, identity: str) -> int:
    digest = hashlib.sha256((label + identity).encode("utf-8")).digest()
    return int.from_bytes(digest[:8], "big", signed=False)


def save_npz_deterministic(path: Path, **arrays: np.ndarray) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with zipfile.ZipFile(path, "w", compression=zipfile.ZIP_DEFLATED, compresslevel=9) as archive:
        for name in sorted(arrays):
            buffer = io.BytesIO()
            np.save(buffer, np.asarray(arrays[name]), allow_pickle=False)
            info = zipfile.ZipInfo(f"{name}.npy", date_time=(1980, 1, 1, 0, 0, 0))
            info.compress_type = zipfile.ZIP_DEFLATED
            info.external_attr = 0o600 << 16
            archive.writestr(info, buffer.getvalue(), compress_type=zipfile.ZIP_DEFLATED, compresslevel=9)


def actions(amplitude: float = 0.5) -> np.ndarray:
    a = float(amplitude)
    return np.array(
        [[0, 0, 0], [a, 0, 0], [-a, 0, 0], [0, a, 0], [0, -a, 0], [0, 0, a], [0, 0, -a]],
        dtype=np.float64,
    )


def true_field(state: np.ndarray) -> np.ndarray:
    q = np.asarray(state, dtype=np.float64)
    x, y, z = np.moveaxis(q, -1, 0)
    return np.stack((10.0 * (y - x), x * (28.0 - z) - y, x * y - (8.0 / 3.0) * z), axis=-1)


def rk4(state: np.ndarray, action: np.ndarray, dt: float = 0.005) -> np.ndarray:
    k1 = true_field(state) + action
    k2 = true_field(state + 0.5 * dt * k1) + action
    k3 = true_field(state + 0.5 * dt * k2) + action
    k4 = true_field(state + dt * k3) + action
    return state + dt * (k1 + 2.0 * k2 + 2.0 * k3 + k4) / 6.0


def rollout(state: np.ndarray, action: np.ndarray, horizon: float, dt: float = 0.005) -> np.ndarray:
    q = np.asarray(state, dtype=np.float64).copy()
    u = np.broadcast_to(np.asarray(action, dtype=np.float64), q.shape)
    for _ in range(int(round(horizon / dt))):
        q = rk4(q, u, dt)
    return q


def sample_trajectory(seed: int, count: int = 50) -> np.ndarray:
    rng = np.random.default_rng(seed)
    low = np.array([-15.0, -20.0, 5.0])
    high = np.array([15.0, 20.0, 35.0])
    state = rng.uniform(low, high, size=(1, 3))
    state = rollout(state, np.zeros_like(state), 5.0)
    rows = []
    stride = int(round(0.1 / 0.005))
    for _ in range(count):
        for _ in range(stride):
            state = rk4(state, np.zeros_like(state), 0.005)
        rows.append(state[0].copy())
    return np.asarray(rows)


def source_dataset(seeds: list[int]) -> tuple[np.ndarray, np.ndarray, np.ndarray]:
    states = []
    seed_ids = []
    sample_ids = []
    for seed in seeds:
        block = sample_trajectory(seed)
        states.append(block)
        seed_ids.extend([seed] * len(block))
        sample_ids.extend(range(len(block)))
    return np.concatenate(states), np.asarray(seed_ids, dtype=np.int64), np.asarray(sample_ids, dtype=np.int64)


def plant_products(states: np.ndarray) -> tuple[np.ndarray, np.ndarray]:
    act = actions()
    tiled_state = np.repeat(np.asarray(states)[:, None, :], len(act), axis=1)
    tiled_action = np.broadcast_to(act[None, :, :], tiled_state.shape)
    flat_state = tiled_state.reshape(-1, 3)
    flat_action = tiled_action.reshape(-1, 3)
    local = rollout(flat_state, flat_action, 0.05).reshape(tiled_state.shape)
    terminal = rollout(flat_state, flat_action, 0.50).reshape(tiled_state.shape)
    return local, terminal


@dataclass(frozen=True)
class Target:
    mean: np.ndarray
    scale: np.ndarray
    center: np.ndarray
    radius: float

    def normalize(self, state: np.ndarray) -> np.ndarray:
        return (np.asarray(state) - self.mean) / self.scale

    def score(self, state: np.ndarray) -> np.ndarray:
        distance = np.linalg.norm(self.normalize(state) - self.center, axis=-1)
        return np.maximum(distance - self.radius, 0.0) ** 2

    def as_dict(self) -> dict:
        return {
            "mean": self.mean.tolist(),
            "scale": self.scale.tolist(),
            "center": self.center.tolist(),
            "radius": float(self.radius),
            "rule": "training_right_lobe_normalized_ball_q25",
        }

    @classmethod
    def from_dict(cls, value: dict) -> "Target":
        return cls(
            np.asarray(value["mean"], dtype=np.float64),
            np.asarray(value["scale"], dtype=np.float64),
            np.asarray(value["center"], dtype=np.float64),
            float(value["radius"]),
        )


def fit_target(states: np.ndarray) -> Target:
    mean = states.mean(axis=0)
    scale = states.std(axis=0)
    normalized = (states - mean) / scale
    right = normalized[states[:, 0] > 0.0]
    center = right.mean(axis=0)
    radius = float(np.quantile(np.linalg.norm(right - center, axis=1), 0.25))
    return Target(mean, scale, center, radius)


def anchored_ranks(scores: np.ndarray, tolerance: float) -> np.ndarray:
    values = np.asarray(scores, dtype=np.float64)
    if values.ndim == 1:
        values = values[None, :]
    out = np.empty(values.shape, dtype=np.float64)
    for row_index, row in enumerate(values):
        if len(row) != 7 or not np.isfinite(row).all():
            raise ValueError("rank input must contain seven finite scores")
        order = np.argsort(row, kind="stable")
        start = 0
        while start < len(row):
            end = start + 1
            anchor = row[order[start]]
            while end < len(row) and abs(row[order[end]] - anchor) <= tolerance:
                end += 1
            out[row_index, order[start:end]] = 0.5 * ((start + 1) + end)
            start = end
    return out[0] if np.asarray(scores).ndim == 1 else out


def rank_pair_signs(ranks: np.ndarray) -> np.ndarray:
    ranks = np.asarray(ranks, dtype=np.float64)
    pairs = [(i, j) for i in range(7) for j in range(i + 1, 7)]
    return np.stack([np.sign(ranks[:, i] - ranks[:, j]) for i, j in pairs], axis=1).astype(np.int8)


def tau_rows_from_signs(left: np.ndarray, right: np.ndarray) -> np.ndarray:
    a = np.asarray(left)
    b = np.asarray(right)
    both = (a != 0) & (b != 0)
    concordant = np.sum(both & (a == b), axis=1)
    discordant = np.sum(both & (a != b), axis=1)
    tie_a = np.sum((a == 0) & (b != 0), axis=1)
    tie_b = np.sum((a != 0) & (b == 0), axis=1)
    denominator = np.sqrt((concordant + discordant + tie_a) * (concordant + discordant + tie_b))
    if np.any(denominator == 0.0):
        raise ValueError("Kendall tau-b undefined because rank vector has zero denominator")
    return (concordant - discordant) / denominator


def pair_kappa(left_ranks: np.ndarray, right_ranks: np.ndarray) -> np.ndarray:
    tau = tau_rows_from_signs(rank_pair_signs(left_ranks), rank_pair_signs(right_ranks))
    return (1.0 + tau) / 2.0


def pair_summary(left_ranks: np.ndarray, right_ranks: np.ndarray) -> dict:
    kappa = pair_kappa(left_ranks, right_ranks)
    tau = 2.0 * kappa - 1.0
    return {
        "count": int(len(kappa)),
        "mean_tau_b": float(tau.mean()),
        "mean_kappa": float(kappa.mean()),
        "min_kappa": float(kappa.min()),
        "max_kappa": float(kappa.max()),
    }


def metric_distances(query: np.ndarray, train: np.ndarray, metric: np.ndarray | None = None) -> np.ndarray:
    diff = query[:, None, :] - train[None, :, :]
    if metric is None:
        return np.sqrt(np.einsum("qti,qti->qt", diff, diff))
    return np.sqrt(np.einsum("qti,ij,qtj->qt", diff, metric, diff))


def nearest_loo_distances(train: np.ndarray, metric: np.ndarray | None = None, chunk: int = 256) -> np.ndarray:
    out = np.empty(len(train), dtype=np.float64)
    for start in range(0, len(train), chunk):
        stop = min(start + chunk, len(train))
        distances = metric_distances(train[start:stop], train, metric)
        distances[np.arange(stop - start), np.arange(start, stop)] = np.inf
        out[start:stop] = distances.min(axis=1)
    return out


def trajectory_extract(
    train_coordinates: np.ndarray,
    query_coordinates: np.ndarray,
    train_scores: np.ndarray,
    k: int,
    metric: np.ndarray | None,
) -> tuple[np.ndarray, np.ndarray, float]:
    threshold = float(np.quantile(nearest_loo_distances(train_coordinates, metric), 0.99))
    scores = np.empty((len(query_coordinates), 7), dtype=np.float64)
    support = np.empty(len(query_coordinates), dtype=bool)
    for start in range(0, len(query_coordinates), 256):
        stop = min(start + 256, len(query_coordinates))
        distances = metric_distances(query_coordinates[start:stop], train_coordinates, metric)
        support[start:stop] = distances.min(axis=1) <= threshold
        indices = np.argpartition(distances, k - 1, axis=1)[:, :k]
        selected = np.take_along_axis(distances, indices, axis=1)
        weights = 1.0 / (selected + 1e-9)
        scores[start:stop] = (train_scores[indices] * weights[:, :, None]).sum(axis=1) / weights.sum(axis=1)[:, None]
    return scores, support, threshold


def deterministic_kmeans(data: np.ndarray, k: int, max_iter: int) -> tuple[np.ndarray, np.ndarray]:
    data = np.asarray(data, dtype=np.float64)
    selected = [int(np.argmin(np.linalg.norm(data, axis=1)))]
    min_distance = np.sum((data - data[selected[0]]) ** 2, axis=1)
    for _ in range(1, k):
        index = int(np.argmax(min_distance))
        selected.append(index)
        min_distance = np.minimum(min_distance, np.sum((data - data[index]) ** 2, axis=1))
    centers = data[selected].copy()
    labels = np.zeros(len(data), dtype=np.int64)
    for _ in range(max_iter):
        new_labels = np.argmin(np.sum((data[:, None, :] - centers[None, :, :]) ** 2, axis=2), axis=1)
        new_centers = centers.copy()
        for node in range(k):
            members = data[new_labels == node]
            if len(members):
                new_centers[node] = members.mean(axis=0)
        if np.array_equal(new_labels, labels) and np.allclose(new_centers, centers):
            labels, centers = new_labels, new_centers
            break
        labels, centers = new_labels, new_centers
    return centers, labels


def graph_extract(
    train_coordinates: np.ndarray,
    query_coordinates: np.ndarray,
    train_terminal: np.ndarray,
    target: Target,
    clusters: int,
    max_iter: int,
    smoothing_neighbors: int,
) -> tuple[np.ndarray, np.ndarray, dict]:
    centers, train_labels = deterministic_kmeans(train_coordinates, clusters, max_iter)
    assigned_distance = np.linalg.norm(train_coordinates - centers[train_labels], axis=1)
    threshold = float(np.quantile(assigned_distance, 0.99))
    node_terminal = []
    for node in range(clusters):
        members = train_terminal[train_labels == node]
        if len(members):
            node_terminal.append(members.mean(axis=0))
        else:
            nearest = int(np.argmin(np.linalg.norm(train_coordinates - centers[node], axis=1)))
            node_terminal.append(train_terminal[nearest])
    node_terminal = np.asarray(node_terminal)
    center_distances = np.linalg.norm(centers[:, None, :] - centers[None, :, :], axis=2)
    neighbors = np.argsort(center_distances, axis=1)[:, :smoothing_neighbors]
    smoothed_terminal = np.asarray([node_terminal[index].mean(axis=0) for index in neighbors])
    node_scores = target.score(smoothed_terminal)
    query_distances = np.linalg.norm(query_coordinates[:, None, :] - centers[None, :, :], axis=2)
    query_labels = np.argmin(query_distances, axis=1)
    support = np.sqrt(np.take_along_axis(query_distances ** 2, query_labels[:, None], axis=1)[:, 0]) <= threshold
    extras = {
        "centers": centers,
        "train_labels": train_labels,
        "query_labels": query_labels,
        "node_scores": node_scores,
        "support_threshold": np.asarray(threshold),
        "neighbors": neighbors,
    }
    return node_scores[query_labels].copy(), support, extras


def stable_action_choice(ranks: np.ndarray) -> np.ndarray:
    return np.argmin(np.asarray(ranks), axis=1)


def normalized_regret(ranks: np.ndarray, true_scores: np.ndarray) -> np.ndarray:
    choice = stable_action_choice(ranks)
    selected = true_scores[np.arange(len(true_scores)), choice]
    low = true_scores.min(axis=1)
    spread = true_scores.max(axis=1) - low
    out = np.full(len(true_scores), np.nan, dtype=np.float64)
    valid = spread > 0.0
    out[valid] = (selected[valid] - low[valid]) / spread[valid]
    return out


def no_fixed_point_permutation(size: int, rng: np.random.Generator) -> np.ndarray:
    if size < 2:
        raise ValueError("derangement needs at least two elements")
    for _ in range(10000):
        candidate = rng.permutation(size)
        if np.all(candidate != np.arange(size)):
            return candidate
    return np.roll(np.arange(size), 1)


def canonical_tree_manifest(root: Path, paths: list[Path]) -> dict[str, str]:
    return {str(path.relative_to(root)): sha256_file(path) for path in sorted(paths, key=lambda p: str(p.relative_to(root)))}
