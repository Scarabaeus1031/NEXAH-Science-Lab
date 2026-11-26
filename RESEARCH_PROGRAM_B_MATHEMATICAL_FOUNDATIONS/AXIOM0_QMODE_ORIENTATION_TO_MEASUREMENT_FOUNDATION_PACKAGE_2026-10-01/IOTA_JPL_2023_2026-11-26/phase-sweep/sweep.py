"""Sweep the joint start phase on the fixed 2023 JPL series."""
from bisect import bisect_left
from collections import Counter
from datetime import datetime, timedelta
from fractions import Fraction
from pathlib import Path
import csv
import gzip
import io
import json
import os
import sys

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE.parent))
from evaluate import crossing_hours, laplace_deviation, prime_hours, read_horizons, sha256, trace

PHASE_PROTOCOL_SHA = "3c5eded60fdeaa6e34250c29dfddc9cd376ff00f380c470d755d1959bcdcc7d7"

def load_verified(path, expected):
    data = path.read_bytes()
    assert sha256(data) == expected, path
    return json.loads(data)

def brackets_by_shift(marks, hours, deviation, crossings, verify_shifts):
    """Return one (left mark, right mark, captured) tuple for each crossing."""
    all_shifts = []
    for shift in range(hours):
        shifted = sorted((mark + shift) % hours for mark in marks)
        indices = [bisect_left(shifted, crossing) for crossing in crossings]
        occupancy = Counter(indices)
        brackets = []
        for index in indices:
            left = shifted[index - 1] if index else None
            right = shifted[index] if index < len(shifted) else None
            captured = (
                left is not None and right is not None and occupancy[index] == 1
                and deviation[left] * deviation[right] < 0
            )
            brackets.append((left, right, int(captured)))
        if shift in verify_shifts:
            captured = [hour for hour, bracket in zip(crossings, brackets) if bracket[2]]
            assert captured == trace(deviation, crossings, marks, shift), shift
        all_shifts.append(brackets)
    return all_shifts

def estimate(lag, deltas):
    prime, uniform = deltas["prime"][lag], deltas["uniform"][lag]
    return prime, uniform, prime - uniform

def main():
    phases = load_verified(HERE / "protocol.json", PHASE_PROTOCOL_SHA)
    base = load_verified(HERE.parent / "protocol.json", phases["base_protocol_sha256"])
    prior = load_verified(HERE.parent / "result.json", phases["base_result_sha256"])
    records = json.loads((HERE.parent / "sources.json").read_text())
    assert [record["target"] for record in records] == [501, 502, 503]
    series = [read_horizons(record, base) for record in records]
    assert series[0][0] == series[1][0] == series[2][0]
    deviation = laplace_deviation([longitudes for _, longitudes in series])
    assert all(value != 0 for value in deviation)
    crossings = crossing_hours(deviation)
    assert crossings == prior["reference_crossing_hours"]
    hours = base["hours"]
    bases = base["bases_hours"]
    period = hours // len(bases)
    assert period == 730 and bases == list(range(bases[0],hours,period))
    assert len({frozenset((b + phase) % hours for b in bases) for phase in range(hours)}) == period
    primary = base["E_lag_hours_from_D"]
    controls = base["alternative_lag_hours_from_D"]
    lags = sorted([primary, *controls])
    arms = [0, *lags]
    assert (primary, controls) == (24, [12,36])

    marks = base["baseline_marks"]
    prime = prime_hours(hours)
    uniform = [(2 * i * hours + marks) // (2 * marks) for i in range(marks)]
    assert len(prime) == len(uniform) == len(set(uniform)) == marks
    verify_shifts = set(range(0,hours,137)) | {
        (b + base["D_hours_from_base"] + lag) % hours for b in bases for lag in arms
    }
    data = {
        grid: brackets_by_shift(grid_marks, hours, deviation, crossings, verify_shifts)
        for grid, grid_marks in (("prime", prime), ("uniform", uniform))
    }
    calendar = datetime.fromisoformat(base["start_tdb"])
    event_labels = [
        (hour, "up" if deviation[hour] > 0 else "down",
         (calendar + timedelta(hours=hour)).isoformat(timespec="minutes"),
         deviation[hour-1], deviation[hour])
        for hour in crossings
    ]

    slog_fields = ["phase_h","base_h","grid","first_hour_after","direction","time_tdb",
                   "angle_before_deg","angle_after_deg"]
    for arm in ("D","plus12","plus24","plus36"):
        slog_fields.extend(f"{arm}_{field}" for field in ("start_h","left_h","right_h","captured"))
    phase_fields = ["phase_h"]
    for lag in lags:
        phase_fields.extend(f"{name}_{lag}" for name in ("prime_gain","uniform_gain","adjusted_gain"))
    phase_fields += ["strict_adjusted_win","strict_and_base_rule","strict_prime_raw_win"]
    temporary_slog = HERE / "slog.csv.gz.tmp"
    outcomes = []
    with gzip.GzipFile(filename="", fileobj=open(temporary_slog,"wb"), mode="wb", mtime=0) as stream:
        with io.TextIOWrapper(stream, encoding="utf-8", newline="") as wrapped:
            writer = csv.writer(wrapped)
            writer.writerow(slog_fields)
            for phase in range(period):
                deltas = {grid: Counter() for grid in data}
                for b in bases:
                    d_start = (b + base["D_hours_from_base"] + phase) % hours
                    starts = [(d_start + arm) % hours for arm in arms]
                    for grid, grid_rows in data.items():
                        arm_rows = [grid_rows[start] for start in starts]
                        counts = [sum(bracket[2] for bracket in rows) for rows in arm_rows]
                        for lag, count in zip(lags, counts[1:]):
                            deltas[grid][lag] += count - counts[0]
                        for event, *brackets in zip(event_labels, *arm_rows):
                            hour,direction,time,before,after = event
                            row = [phase,b,grid,hour,direction,time,before+180,after+180]
                            for start,bracket in zip(starts, brackets):
                                row.extend((start,*bracket))
                            writer.writerow(row)
                estimates = {lag: estimate(lag, deltas) for lag in lags}
                p, _, adjusted = estimates[primary]
                beats_controls = adjusted > max(estimates[control][2] for control in controls)
                raw = p > max(estimates[control][0] for control in controls)
                outcomes.append([phase,*[v for lag in lags for v in estimates[lag]],
                                 int(beats_controls),int(beats_controls and p>0 and adjusted>0),int(raw)])
    os.replace(temporary_slog, HERE / "slog.csv.gz")

    at_zero = outcomes[0]
    for i, reference in enumerate(prior["summary"]):
        prime_delta = Fraction(reference["prime_mean_delta"]) * len(bases)
        uniform_delta = Fraction(reference["uniform_mean_delta"]) * len(bases)
        assert at_zero[1+3*i : 4+3*i] == [prime_delta, uniform_delta, prime_delta-uniform_delta]
    with (HERE / "phases.csv").open("w", encoding="utf-8", newline="") as handle:
        writer = csv.writer(handle)
        writer.writerow(phase_fields)
        writer.writerows(outcomes)

    def frequency(column):
        count = sum(row[phase_fields.index(column)] for row in outcomes)
        return {"unique_phases": count, "full_year_hours": count * len(bases),
                "fraction": str(Fraction(count,period)), "percent": 100*count/period}

    summary = {
        "phase_protocol_sha256": PHASE_PROTOCOL_SHA,
        "distinct_phases": period, "full_year_hours": hours,
        "reference_crossings": len(crossings),
        "directions": dict(Counter(event[1] for event in event_labels)),
        "slog_rows": period*len(bases)*len(data)*len(crossings),
        "score_units": "Sum across 12 pairs, divide by 12 for mean gain.",
        "strict_adjusted_win": frequency("strict_adjusted_win"),
        "strict_and_base_rule": frequency("strict_and_base_rule"),
        "strict_prime_raw_win": frequency("strict_prime_raw_win"),
        "phase_zero": dict(zip(phase_fields,at_zero)),
        "strict_adjusted_win_phases_h": [r[0] for r in outcomes if r[-3]],
        "strict_and_base_rule_phases_h": [r[0] for r in outcomes if r[-2]],
    }
    (HERE/"summary.json").write_text(json.dumps(summary, indent=2)+"\n")
    print(json.dumps({key:value for key,value in summary.items() if not key.endswith("phases_h")}, indent=2))

if __name__ == "__main__":
    main()
