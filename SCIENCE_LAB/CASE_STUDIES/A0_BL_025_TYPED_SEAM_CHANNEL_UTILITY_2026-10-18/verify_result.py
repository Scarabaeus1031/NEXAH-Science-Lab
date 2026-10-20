#!/usr/bin/env python3
import hashlib
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent


def canonical_json(value):
    return json.dumps(value, sort_keys=True, separators=(",", ":"), ensure_ascii=False)


def verify(path):
    data = json.loads(path.read_text())
    stored = data.pop("result_sha256")
    assert stored == hashlib.sha256(canonical_json(data).encode("utf-8")).hexdigest()
    assert data["decision"] == "PASS_BOUNDED_TYPED_SEAM_ADVANTAGE"
    assert data["raw_incidences"] == 140
    assert data["conditions"]["C0"]["addresses"] == 140
    assert data["conditions"]["C1"]["addresses"] == 136
    assert data["conditions"]["C2"]["addresses"] == 106
    assert data["conditions"]["C2"]["reconstruction_correct"] == 106
    assert data["conditions"]["C3"]["addresses"] == 106
    assert data["conditions"]["C3"]["mixed_level_classes"] == 30
    assert data["conditions"]["C4"]["addresses"] == 106
    assert data["conditions"]["C4"]["reconstruction_correct"] == 140
    assert data["conditions"]["C4"]["mean_total_address_bits"] < 8
    assert all(data["gates"].values())
    assert all(data["controls"].values())
    assert all(data["d5"].values())
    assert data["zipper"] == {"directed_transitions": 60, "inverse_exact": True}
    return stored


def main():
    primary = ROOT / "artifacts" / "PRIMARY_RESULT.json"
    replay = ROOT / "artifacts" / "REPLAY_RESULT.json"
    p_hash = verify(primary)
    r_hash = verify(replay)
    assert primary.read_bytes() == replay.read_bytes()
    assert p_hash == r_hash
    print(json.dumps({"status": "PASS", "checks": 20, "primary_replay_byte_identical": True, "result_sha256": p_hash}, sort_keys=True))


if __name__ == "__main__":
    main()
