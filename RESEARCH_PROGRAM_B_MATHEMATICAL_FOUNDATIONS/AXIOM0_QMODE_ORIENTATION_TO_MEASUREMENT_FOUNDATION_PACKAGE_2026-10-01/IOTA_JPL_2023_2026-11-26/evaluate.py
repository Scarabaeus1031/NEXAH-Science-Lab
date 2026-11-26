"""Reproduce the local IOTA/JPL comparison using the frozen protocol."""
from bisect import bisect_right
from collections import Counter
from datetime import date, datetime, timedelta
from fractions import Fraction
from pathlib import Path
import argparse
import csv
import gzip
import hashlib
import io
import json
import math

ROOT = Path(__file__).resolve().parent
PROTOCOL_HASH = "aadecd5d319f1d29804316d6cc5a51e29600549633152438b390fdf93aa07e94"

def sha256(data):
    return hashlib.sha256(data).hexdigest()

def read_horizons(record, protocol):
    raw = gzip.decompress((ROOT / record["file"]).read_bytes())
    assert sha256(raw) == record["response_sha256"]
    header, rest = raw.decode().split("$$SOE")
    table, _ = rest.split("$$EOE")
    assert f"({record['target']})" in header
    assert "Center body name: Jupiter (599)" in header
    assert header.count("{source: jup365_merged}") >= 2
    assert "IAU_JUPITER body equator and node of date" in header
    columns = [name.strip() for name in next(line for line in header.splitlines() if "JDTDB," in line).split(",")]
    rows = list(csv.reader(io.StringIO(table.strip())))
    assert len(rows) == protocol["hours"] + 1
    start_date = date.fromisoformat(protocol["start_tdb"])
    start_jd = start_date.toordinal() + 1721424.5
    start_time = datetime.combine(start_date, datetime.min.time())
    dates, longitudes = [], []
    for hour, row in enumerate(rows):
        jd = float(row[columns.index("JDTDB")])
        assert abs(jd - (start_jd + hour / 24)) < 1e-8, (record["target"],hour,jd)
        expected = start_time + timedelta(hours=hour)
        label = row[columns.index("Calendar Date (TDB)")].strip()
        assert label == expected.strftime("A.D. %Y-%b-%d %H:%M:%S.0000"), (hour,label)
        angles = [float(row[columns.index(name)]) for name in ("OM","W","MA")]
        assert all(math.isfinite(value) and 0 <= value <= 360 for value in angles)
        dates.append(jd)
        longitudes.append(round(sum(angles) % 360, 7))
    assert expected.date().isoformat() == protocol["stop_tdb_inclusive_endpoint"]
    return dates, longitudes

def prime_hours(hours):
    sieve = [True] * hours
    sieve[0] = sieve[1] = False
    for candidate in range(2, math.isqrt(hours-1) + 1):
        if sieve[candidate]:
            for multiple in range(candidate*candidate, hours, candidate):
                sieve[multiple] = False
    return [i for i,prime in enumerate(sieve) if prime]

def laplace_deviation(longitudes):
    return [(io - 3*europa + 2*ganymede) % 360 - 180
            for io,europa,ganymede in zip(*longitudes)]

def crossing_hours(deviation):
    return [i for i in range(1,len(deviation)) if deviation[i-1]*deviation[i] < 0]

def trace(deviation, crossings, marks, shift):
    hours = len(deviation)-1
    shifted = sorted((mark+shift) % hours for mark in marks)
    detected = []
    for left,right in zip(shifted,shifted[1:]):
        start,end = bisect_right(crossings,left),bisect_right(crossings,right)
        if end-start == 1 and deviation[left]*deviation[right] < 0:
            detected.append(crossings[start])
    # Cross-check by assigning each reference transition to a bracket first.
    brackets = Counter(bisect_right(shifted,i-1) for i in crossings)
    independent = []
    for hour in crossings:
        bracket = bisect_right(shifted,hour-1)
        if 0 < bracket < len(shifted) and brackets[bracket] == 1:
            if deviation[shifted[bracket-1]]*deviation[shifted[bracket]] < 0:
                independent.append(hour)
    assert detected == independent
    return detected

def totals(rows, field):
    return sum(row[field] for row in rows)

def mean(count, pairs):
    return str(Fraction(count,pairs))

def main(baseline_path):
    protocol_data = (ROOT/"protocol.json").read_bytes()
    assert sha256(protocol_data) == PROTOCOL_HASH
    protocol = json.loads(protocol_data)
    raw_path = baseline_path.read_text()
    baseline = json.loads(raw_path.split("=",1)[1].strip().removesuffix(";"))
    assert [m["id"] for m in baseline["satellites"]] == [501,502,503]
    baseline_dev = laplace_deviation([m["longitudes"] for m in baseline["satellites"]])
    baseline_crossings = crossing_hours(baseline_dev)
    assert len(baseline_crossings) == 21
    hours = protocol["hours"]
    primes = prime_hours(hours)
    marks = protocol["baseline_marks"]
    assert len(primes) == marks
    uniform = [(2*i*hours+marks)//(2*marks) for i in range(marks)]
    assert len(set(uniform)) == marks
    bases = protocol["bases_hours"]
    historical = {
        "prime":[len(trace(baseline_dev,baseline_crossings,primes,b)) for b in bases],
        "uniform":[len(trace(baseline_dev,baseline_crossings,uniform,b)) for b in bases],
    }
    assert historical == {"prime":[19,19,19,21,19,21,19,19,19,19,19,21],"uniform":[19]*12}
    assert len(trace(baseline_dev,baseline_crossings,primes,168))==17

    records = json.loads((ROOT/"sources.json").read_text())
    assert [r["target"] for r in records] == [501,502,503]
    series = [read_horizons(record,protocol) for record in records]
    assert series[0][0] == series[1][0] == series[2][0]
    deviation = laplace_deviation([longitudes for _,longitudes in series])
    assert all(value != 0 for value in deviation)
    crossings = crossing_hours(deviation)
    assert crossings, "No evaluable reference transitions"
    grids = {"prime":primes,"uniform":uniform}
    all_rows, summary = [], []
    for lag in sorted([protocol["E_lag_hours_from_D"],*protocol["alternative_lag_hours_from_D"]]):
        rows = []
        for base in bases:
            d = (base+protocol["D_hours_from_base"])%hours
            comparison = (d+lag)%hours
            row = {"base":base,"lag_hours":lag,"D":d,"comparison":comparison}
            for name,grid in grids.items():
                for role,offset in (("D",d),("comparison",comparison)):
                    captured = trace(deviation,crossings,grid,offset)
                    row[f"{name}_{role}"] = len(captured)
                    row[f"{name}_{role}_missed"] = sorted(set(crossings)-set(captured))
                row[f"{name}_delta"] = row[f"{name}_comparison"]-row[f"{name}_D"]
            rows.append(row)
        pairs = len(rows)
        prime_delta = totals(rows,"prime_delta")
        uniform_delta = totals(rows,"uniform_delta")
        summary.append({
            "lag_hours":lag,
            "prime_totals":[totals(rows,"prime_D"),totals(rows,"prime_comparison")],
            "uniform_totals":[totals(rows,"uniform_D"),totals(rows,"uniform_comparison")],
            "prime_mean_delta":mean(prime_delta,pairs),
            "uniform_mean_delta":mean(uniform_delta,pairs),
            "difference_of_mean_deltas":mean(prime_delta-uniform_delta,pairs),
            "prime_pairs_better_tied_worse":[sum((r["prime_delta"]>0)-(r["prime_delta"]<0)==sign for r in rows) for sign in (1,0,-1)],
            "uniform_pairs_better_tied_worse":[sum((r["uniform_delta"]>0)-(r["uniform_delta"]<0)==sign for r in rows) for sign in (1,0,-1)],
        })
        all_rows.extend(rows)
    primary = next(item for item in summary if item["lag_hours"]==24)
    positive = Fraction(primary["prime_mean_delta"])>0
    specific = Fraction(primary["difference_of_mean_deltas"])>0
    wins_controls = all(Fraction(primary["difference_of_mean_deltas"])>Fraction(item["difference_of_mean_deltas"])
                        for item in summary if item["lag_hours"]!=24)
    result = {
        "window_tdb":[protocol["start_tdb"],protocol["stop_tdb_inclusive_endpoint"]],
        "samples_per_moon":len(deviation), "ephemeris":"jup365_merged",
        "reference_crossing_hours":crossings,
        "baseline_2025_replayed":historical,
        "baseline_asset_sha256":sha256(baseline_path.read_bytes()),
        "protocol_sha256":PROTOCOL_HASH,
        "summary":summary, "primary_direction_pass":positive,
        "primary_prime_specific_pass":positive and specific,
        "primary_unique_vs_controls_pass":positive and specific and wins_controls,
        "pairs":all_rows,
    }
    (ROOT/"result.json").write_text(json.dumps(result,indent=2)+"\n")
    print(json.dumps({key:value for key,value in result.items() if key!="pairs"},indent=2))

if __name__=="__main__":
    parser=argparse.ArgumentParser()
    parser.add_argument("baseline_2025",type=Path)
    main(parser.parse_args().baseline_2025)
