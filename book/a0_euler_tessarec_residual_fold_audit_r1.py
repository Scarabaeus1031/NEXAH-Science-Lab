"""Authorized secondary diagnostic for the Check 71 negative result."""

from __future__ import annotations

import argparse
import hashlib
import json
import math
import os
import sys
from pathlib import Path
from typing import Any

import numpy as np

HERE = Path(__file__).resolve().parent
PACKAGE = HERE.parent
LOCK = HERE / "assets" / "a0-euler-tessarec-residual-fold-audit-r1-lock.json"
AUTH = HERE / "assets" / "a0-euler-tessarec-residual-fold-audit-r1-owner-authorization-2026-10-13.json"
SOURCE = HERE / "assets" / "a0-tessarec-spectral-audit-v1.json"
PARENT = HERE / "results" / "a0-euler-spectrum-comparator-r1-result-2026-10-13.json"
RECORD_ID = "A0_EULER_TESSAREC_RESIDUAL_FOLD_AUDIT_RUN_001"


class AuditError(RuntimeError):
    pass


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def read_json(path: Path) -> dict[str, Any]:
    with path.open("r", encoding="utf-8") as handle:
        value = json.load(handle)
    if not isinstance(value, dict):
        raise AuditError(f"expected object: {path}")
    return value


def matrix(model: str, ranks: np.ndarray) -> np.ndarray:
    one = np.ones_like(ranks, dtype=float)
    if model == "M0": return one[:, None]
    if model == "M1": return np.column_stack((ranks, one))
    if model == "ME": return np.column_stack((ranks * ranks + ranks, one))
    if model == "M2": return np.column_stack((ranks * ranks, ranks, one))
    raise AuditError(f"unknown model {model}")


def balanced_folds(count: int, parts: int) -> list[np.ndarray]:
    return [np.asarray(items, dtype=int) for items in np.array_split(np.arange(count), parts)]


def oof(values: np.ndarray, folds: list[np.ndarray]) -> dict[str, Any]:
    ranks = np.arange(values.size, dtype=float)
    scale = float(np.std(values, ddof=0))
    if scale <= 0: raise AuditError("zero spectrum scale")
    output: dict[str, Any] = {}
    for model in ("M0", "M1", "ME", "M2"):
        predictions = np.empty_like(values)
        fold_rows = []
        for index, held in enumerate(folds, start=1):
            train = np.setdiff1d(np.arange(values.size), held, assume_unique=True)
            coefficients, *_ = np.linalg.lstsq(matrix(model, ranks[train]), values[train], rcond=None)
            predicted = matrix(model, ranks[held]) @ coefficients
            predictions[held] = predicted
            residual = values[held] - predicted
            fold_rows.append({
                "fold": index,
                "indices": held.tolist(),
                "rmse": float(np.sqrt(np.mean(residual ** 2))),
                "nrmse_global_sd": float(np.sqrt(np.mean(residual ** 2)) / scale),
                "sse": float(np.sum(residual ** 2)),
            })
        residuals = values - predictions
        output[model] = {
            "predictions": predictions.tolist(),
            "residuals": residuals.tolist(),
            "folds": fold_rows,
            "pooled_nrmse": float(np.sqrt(np.mean(residuals ** 2)) / scale),
        }
    return output


def repeated_mask(values: np.ndarray, tolerance: float = 1e-10) -> tuple[np.ndarray, list[list[int]]]:
    groups: list[list[int]] = []
    used = np.zeros(values.size, dtype=bool)
    for index in range(values.size):
        if used[index]: continue
        group = np.where(np.abs(values - values[index]) <= tolerance)[0].tolist()
        for member in group: used[member] = True
        groups.append(group)
    mask = np.zeros(values.size, dtype=bool)
    for group in groups:
        if len(group) > 1: mask[group] = True
    return mask, groups


def immutable_write(path: Path, data: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary = path.with_name(f".{path.name}.{os.getpid()}.tmp")
    try:
        with temporary.open("x", encoding="utf-8") as handle:
            handle.write(data)
            handle.flush()
            os.fsync(handle.fileno())
        os.link(temporary, path)
    finally:
        temporary.unlink(missing_ok=True)


def svg(values: np.ndarray, models: dict[str, Any], localization: str) -> str:
    width, height = 1280, 820
    left, right, top = 80, 40, 70
    plot_w = width - left - right
    upper_y0, upper_h = 90, 320
    lower_y0, lower_h = 500, 230
    colors = {"M1": "#62d6ea", "ME": "#f05ba8", "M2": "#f0bd55"}
    all_upper = np.concatenate([values] + [np.asarray(models[m]["predictions"]) for m in colors])
    ymin, ymax = float(all_upper.min()), float(all_upper.max())
    all_res = np.concatenate([np.asarray(models[m]["residuals"]) for m in colors])
    rmax = max(float(np.max(np.abs(all_res))), 1e-9)
    sx = lambda index: left + index / 47 * plot_w
    sy = lambda value: upper_y0 + (ymax - value) / (ymax - ymin) * upper_h
    ry = lambda value: lower_y0 + lower_h / 2 - value / rmax * (lower_h / 2)
    def poly(items, fn): return " ".join(f"{sx(i):.2f},{fn(float(v)):.2f}" for i, v in enumerate(items))
    bands = []
    for fold in range(8):
        x0 = sx(fold * 6)
        x1 = sx(min(fold * 6 + 5, 47))
        bands.append(f'<rect x="{x0:.2f}" y="{upper_y0}" width="{max(x1-x0,1):.2f}" height="{upper_h+lower_h+90}" fill="#{"143142" if fold%2==0 else "102737"}" opacity="0.34"/><text x="{(x0+x1)/2:.2f}" y="{upper_y0-10}" fill="#7893a3" text-anchor="middle" font-family="ui-monospace" font-size="14">F{fold+1}</text>')
    lines = [f'<polyline points="{poly(values, sy)}" fill="none" stroke="#f4f1e8" stroke-width="4"/>']
    residual_lines = []
    for model, color in colors.items():
        lines.append(f'<polyline points="{poly(models[model]["predictions"], sy)}" fill="none" stroke="{color}" stroke-width="2.5" opacity="0.92"/>')
        residual_lines.append(f'<polyline points="{poly(models[model]["residuals"], ry)}" fill="none" stroke="{color}" stroke-width="2.5"/>')
    return f'''<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" viewBox="0 0 {width} {height}"><rect width="100%" height="100%" fill="#071722"/><text x="{left}" y="42" fill="#f4f1e8" font-family="system-ui" font-size="27" font-weight="700">Tessarec spectrum · held-out fold and residual audit</text>{''.join(bands)}<line x1="{left}" y1="{upper_y0+upper_h}" x2="{width-right}" y2="{upper_y0+upper_h}" stroke="#496272"/>{''.join(lines)}<text x="{left}" y="465" fill="#f4f1e8" font-family="system-ui" font-size="19">Observed white · affine cyan · Euler pink · free quadratic gold</text><line x1="{left}" y1="{lower_y0+lower_h/2}" x2="{width-right}" y2="{lower_y0+lower_h/2}" stroke="#8aa0ad"/>{''.join(residual_lines)}<text x="{left}" y="{height-35}" fill="#b8c7d0" font-family="ui-monospace" font-size="18">Localization: {localization}</text></svg>'''


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--validate-contract", action="store_true")
    parser.add_argument("--execute", action="store_true")
    parser.add_argument("--output-json")
    parser.add_argument("--output-svg")
    args = parser.parse_args()
    try:
        lock = read_json(LOCK)
        hashes = lock["sha256"]
        actual = {"implementation": sha256(Path(__file__).resolve()), "source": sha256(SOURCE), "parent_result": sha256(PARENT)}
        if actual != hashes: raise AuditError(f"hash mismatch: {actual}")
        if args.validate_contract:
            print(json.dumps({"status":"PASS","mode":"CONTRACT_ONLY","hashes":actual,"execution":False}))
            return 0
        if not args.execute or not args.output_json or not args.output_svg: raise AuditError("execution requires --execute and two output paths")
        auth = read_json(AUTH)
        required = {"record_id":RECORD_ID,"status":"OWNER_AUTHORIZED","lab_state":"ACTIVE","execution_authorized":True,**{f"{key}_sha256":value for key,value in hashes.items()}}
        bad = {key:(value,auth.get(key)) for key,value in required.items() if auth.get(key)!=value}
        if bad: raise AuditError(f"authorization mismatch: {bad}")
        source = read_json(SOURCE)
        parent = read_json(PARENT)
        if parent.get("disposition") != "NO_EULER_SPECIFIC_SPECTRAL_SUPPORT": raise AuditError("parent negative result missing")
        values = np.asarray(source["spectrum"]["eigenvalues"],dtype=float)
        if values.shape!=(48,) or not np.all(values[:-1]>=values[1:]): raise AuditError("source rank contract failed")
        folds48 = [np.arange(i*6,(i+1)*6) for i in range(8)]
        models = oof(values,folds48)
        excess = np.asarray([models["ME"]["folds"][i]["sse"]-models["M1"]["folds"][i]["sse"] for i in range(8)])
        positive = np.maximum(excess,0)
        shares = positive/positive.sum() if positive.sum()>0 else np.zeros(8)
        extreme_share = float(shares[0]+shares[-1])
        localization = "EXTREME_CONCENTRATED" if extreme_share>=0.60 else "DISTRIBUTED_OR_MIDDLE_CONCENTRATED"
        mask, groups = repeated_mask(values)
        multiplicity = {}
        for model in ("M1","ME","M2"):
            absolute = np.abs(np.asarray(models[model]["residuals"]))
            multiplicity[model]={"repeated_mean_abs_residual":float(absolute[mask].mean()),"singleton_mean_abs_residual":float(absolute[~mask].mean())}
        second = np.diff(values,n=2)
        sign_changes = int(np.count_nonzero(np.sign(second[1:])*np.sign(second[:-1])<0))
        largest = sorted(({"center_rank":i+1,"value":float(value),"absolute":float(abs(value))} for i,value in enumerate(second)),key=lambda row:row["absolute"],reverse=True)[:5]
        values47=values[1:]
        models47=oof(values47,balanced_folds(47,8))
        ae47=(models47["M1"]["pooled_nrmse"]-models47["ME"]["pooled_nrmse"])/models47["M1"]["pooled_nrmse"]
        gq47=(models47["ME"]["pooled_nrmse"]-models47["M2"]["pooled_nrmse"])/models47["M2"]["pooled_nrmse"]
        result={"schema":"nexah.a0.euler-tessarec-residual-fold-audit-result","version":"1.0.0","record_id":RECORD_ID,"parent_disposition":parent["disposition"],"parent_disposition_changed":False,"rank_direction":"descending","models48":models,"fold_euler_excess_sse":excess.tolist(),"fold_positive_excess_share":shares.tolist(),"extreme_share":extreme_share,"localization":localization,"multiplicity":{"tolerance":1e-10,"repeated_value_count":int(mask.sum()),"singleton_value_count":int((~mask).sum()),"groups":[group for group in groups if len(group)>1],"residuals":multiplicity},"second_differences":{"values":second.tolist(),"sign_changes":sign_changes,"largest_absolute":largest},"nontrivial_47":{"fold_sizes":[len(fold) for fold in balanced_folds(47,8)],"pooled_nrmse":{m:models47[m]["pooled_nrmse"] for m in models47},"A_E":float(ae47),"G_Q":float(gq47),"role":"SECONDARY_ONLY_NO_RESCUE"},"audit":{"best_c_search_performed":False,"new_null_simulation":False,"new_primary_test":False},"hashes":hashes,"owner_acceptance_parent":"ACCEPTED_BOUNDED_NEGATIVE","successor_graph_native_test":"NOT_EXECUTED"}
        out_json,out_svg=Path(args.output_json).resolve(),Path(args.output_svg).resolve()
        if out_json==out_svg: raise AuditError("output paths must differ")
        immutable_write(out_json,json.dumps(result,indent=2,sort_keys=True)+"\n")
        immutable_write(out_svg,svg(values,models,localization))
        print(json.dumps({"status":"PASS","localization":localization,"extreme_share":extreme_share,"json":str(out_json),"svg":str(out_svg)}))
        return 0
    except (AuditError,KeyError,ValueError,OSError,np.linalg.LinAlgError) as error:
        print(json.dumps({"status":"INVALID_DIAGNOSTIC_RUN","error":str(error)}),file=sys.stderr)
        return 2


if __name__=="__main__": raise SystemExit(main())
