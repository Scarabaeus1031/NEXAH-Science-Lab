#!/usr/bin/env python3
import hashlib
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent
ALLOWED = {
    "PASS_BOUNDED_REPRESENTATION_STRESS",
    "MIXED_NEGATIVE",
    "INFORMATION_LOST",
    "UNINFORMATIVE_NO_ADVANTAGE_OVER_DIRECT_SIGNATURE",
    "INVALID_ADAPTER",
    "INVALID_EXPERIMENT",
}


def canonical_json(value):
    return json.dumps(value, sort_keys=True, separators=(",", ":"), ensure_ascii=False)


def verify(path):
    data = json.loads(path.read_text())
    stored = data.pop("result_sha256")
    assert stored == hashlib.sha256(canonical_json(data).encode("utf-8")).hexdigest()
    assert data["decision"] in ALLOWED
    assert data["protocol_sha256"] == hashlib.sha256((ROOT / "FROZEN_PROTOCOL.json").read_bytes()).hexdigest()
    if data["decision"] != "INVALID_ADAPTER":
        assert len(data["view_stress"]) == 81
        assert len(data["adapter_records"]) == 10
        assert data["information_boundary"]["raw_complex_iterates_emitted"] is False
        assert data["information_boundary"]["first_emitted_iterate"] == 5
        assert data["collision_accounting"]["load_state_count"] == 7
        if data["decision"] == "PASS_BOUNDED_REPRESENTATION_STRESS":
            assert all(data["gates"].values())
        if data["decision"] == "INFORMATION_LOST":
            assert not data["gates"]["COLLISION_ACCOUNTING"]
    return stored


def main():
    primary = ROOT / "artifacts" / "PRIMARY_RESULT.json"
    replay = ROOT / "artifacts" / "REPLAY_RESULT.json"
    p_hash = verify(primary)
    r_hash = verify(replay)
    assert primary.read_bytes() == replay.read_bytes()
    assert p_hash == r_hash
    print(json.dumps({"status": "PASS", "primary_replay_byte_identical": True, "result_sha256": p_hash}, sort_keys=True))


if __name__ == "__main__":
    main()
