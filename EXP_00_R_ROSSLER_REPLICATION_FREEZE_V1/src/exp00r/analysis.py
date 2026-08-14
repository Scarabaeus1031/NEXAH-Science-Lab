"""Dependency-light frozen prediction analyses."""
from __future__ import annotations

from dataclasses import dataclass
import numpy as np


def seed_block_folds(seed_ids: np.ndarray, folds: int = 5) -> list[tuple[np.ndarray, np.ndarray]]:
    unique = np.array(sorted(set(map(int, seed_ids))))
    blocks = np.array_split(unique, folds)
    result = []
    for block in blocks:
        test = np.isin(seed_ids, block)
        result.append((np.flatnonzero(~test), np.flatnonzero(test)))
    return result


@dataclass
class StandardizedLogistic:
    l2_c: float = 1.0
    mean_: np.ndarray | None = None
    scale_: np.ndarray | None = None
    coefficients_: np.ndarray | None = None

    def fit(self, features: np.ndarray, labels: np.ndarray, max_iter: int = 100) -> "StandardizedLogistic":
        x = np.asarray(features, dtype=float); y = np.asarray(labels, dtype=float)
        self.mean_ = x.mean(axis=0); self.scale_ = x.std(axis=0)
        self.scale_[self.scale_ == 0] = 1.0
        z = (x - self.mean_) / self.scale_
        design = np.column_stack([np.ones(len(z)), z])
        beta = np.zeros(design.shape[1])
        penalty = np.eye(len(beta)) / self.l2_c; penalty[0, 0] = 0.0
        for _ in range(max_iter):
            logits = np.clip(design @ beta, -35, 35)
            probabilities = 1.0 / (1.0 + np.exp(-logits))
            weights = probabilities * (1.0 - probabilities)
            gradient = design.T @ (probabilities - y) + penalty @ beta
            hessian = design.T @ (design * weights[:, None]) + penalty
            step = np.linalg.solve(hessian, gradient)
            beta -= step
            if np.linalg.norm(step) < 1e-9:
                break
        self.coefficients_ = beta
        return self

    def predict_proba(self, features: np.ndarray) -> np.ndarray:
        if self.coefficients_ is None:
            raise RuntimeError("model is not fitted")
        z = (np.asarray(features, dtype=float) - self.mean_) / self.scale_
        logits = np.clip(np.column_stack([np.ones(len(z)), z]) @ self.coefficients_, -35, 35)
        return 1.0 / (1.0 + np.exp(-logits))


def log_loss(labels: np.ndarray, probabilities: np.ndarray) -> float:
    y = np.asarray(labels, dtype=float); p = np.clip(probabilities, 1e-15, 1 - 1e-15)
    return float(-np.mean(y * np.log(p) + (1 - y) * np.log(1 - p)))


def brier(labels: np.ndarray, probabilities: np.ndarray) -> float:
    return float(np.mean((np.asarray(probabilities) - np.asarray(labels)) ** 2))


def auc(labels: np.ndarray, probabilities: np.ndarray) -> float:
    y, p = np.asarray(labels), np.asarray(probabilities)
    positive, negative = p[y == 1], p[y == 0]
    if len(positive) == 0 or len(negative) == 0:
        return float("nan")
    comparisons = (positive[:, None] > negative[None, :]).mean()
    ties = (positive[:, None] == negative[None, :]).mean()
    return float(comparisons + 0.5 * ties)


def expected_calibration_error(labels: np.ndarray, probabilities: np.ndarray, bins: int = 10) -> float:
    edges = np.linspace(0, 1, bins + 1); total = len(labels); result = 0.0
    for i in range(bins):
        selected = (probabilities >= edges[i]) & (probabilities < edges[i + 1] if i < bins - 1 else probabilities <= edges[i + 1])
        if np.any(selected):
            result += selected.mean() * abs(np.mean(labels[selected]) - np.mean(probabilities[selected]))
    return float(result)


def calibration_intercept_slope(labels: np.ndarray, probabilities: np.ndarray) -> tuple[float, float]:
    p = np.clip(np.asarray(probabilities, dtype=float), 1e-8, 1 - 1e-8)
    logits = np.log(p / (1 - p))[:, None]
    model = StandardizedLogistic(l2_c=1e12).fit(logits, np.asarray(labels, dtype=int))
    slope = float(model.coefficients_[1] / model.scale_[0])
    intercept = float(model.coefficients_[0] - slope * model.mean_[0])
    return intercept, slope


def cluster_bootstrap_coefficients(features: np.ndarray, labels: np.ndarray, seed_ids: np.ndarray, coherence_column: int, repetitions: int, rng_seed: int = 20260808) -> np.ndarray:
    rng = np.random.default_rng(rng_seed)
    unique = np.array(sorted(set(map(int, seed_ids))))
    estimates = []
    for _ in range(int(repetitions)):
        sampled = rng.choice(unique, size=len(unique), replace=True)
        rows = np.concatenate([np.flatnonzero(np.asarray(seed_ids) == seed) for seed in sampled])
        if len(np.unique(np.asarray(labels)[rows])) < 2:
            estimates.append(np.nan); continue
        model = StandardizedLogistic(1.0).fit(np.asarray(features)[rows], np.asarray(labels)[rows])
        estimates.append(float(model.coefficients_[coherence_column + 1]))
    return np.asarray(estimates)


def per_seed_directions(coherence: np.ndarray, labels: np.ndarray, seed_ids: np.ndarray) -> dict[int, float]:
    result = {}
    for seed in sorted(set(map(int, seed_ids))):
        selected = np.asarray(seed_ids) == seed
        if selected.sum() < 2 or np.std(np.asarray(coherence)[selected]) == 0 or np.std(np.asarray(labels)[selected]) == 0:
            result[seed] = 0.0
        else:
            result[seed] = float(np.corrcoef(np.asarray(coherence)[selected], np.asarray(labels)[selected])[0, 1])
    return result


def compare_baseline_coherence(train_x: np.ndarray, train_y: np.ndarray, test_x: np.ndarray, test_y: np.ndarray, coherence_column: int, c: float = 1.0) -> dict:
    baseline_columns = [i for i in range(train_x.shape[1]) if i != coherence_column]
    baseline = StandardizedLogistic(c).fit(train_x[:, baseline_columns], train_y)
    augmented = StandardizedLogistic(c).fit(train_x, train_y)
    p0, p1 = baseline.predict_proba(test_x[:, baseline_columns]), augmented.predict_proba(test_x)
    calibration_intercept, calibration_slope = calibration_intercept_slope(test_y, p1)
    return {
        "baseline_log_loss": log_loss(test_y, p0), "augmented_log_loss": log_loss(test_y, p1),
        "log_loss_improvement": log_loss(test_y, p0) - log_loss(test_y, p1),
        "baseline_auc": auc(test_y, p0), "augmented_auc": auc(test_y, p1),
        "baseline_brier": brier(test_y, p0), "augmented_brier": brier(test_y, p1),
        "baseline_ece": expected_calibration_error(test_y, p0), "augmented_ece": expected_calibration_error(test_y, p1),
        "augmented_calibration_intercept": calibration_intercept, "augmented_calibration_slope": calibration_slope,
        "coherence_coefficient": float(augmented.coefficients_[coherence_column + 1]),
    }
