#!/usr/bin/env python3
"""Bounded 404-gate/return comparison in the chosen Z^4 model A."""

import json
from dataclasses import asdict, dataclass
from pathlib import Path


@dataclass(frozen=True)
class GateInput:
    phase_deg: int
    tilt_deg: int
    error: float
    open_gap: bool
    slow: bool


def gate_404(g: GateInput) -> bool:
    # Synthetic exact-alignment pilot: screenshot provides no numeric gap/speed threshold.
    return (g.phase_deg == 0 and g.tilt_deg == 0 and g.error == 0.0
            and g.open_gap and g.slow)


Q0 = (0, 0, 0, 0)
Q1 = (1, 1, 1, 0)
Q2 = (1, 1, 1, 1)
Q3 = (1, 1, 2, 1)
Q6 = (1, 1, 2, 0)
Q_START = (1, 1, 0, 0)
Q_ONE = (1, 0, 0, 0)


def norm2(q):
    return sum(x * x for x in q)


def role(q):
    return '47' if q[3] == 0 else '74'


ROUTES = {
    'direct_first': [Q3, Q6, Q_START, Q_ONE, Q0],
    'inner_hinge': [Q3, Q2, Q1, Q0],
}
CORNER_STATES = {
    (x, y, z, w)
    for x in (0, 1) for y in (0, 1) for z in (0, 2) for w in (0, 1)
}
FULL_LATTICE = {
    (x, y, z, w)
    for x in (0, 1) for y in (0, 1) for z in (0, 1, 2) for w in (0, 1)
}


def run_route(name, gate_by_position):
    points = ROUTES[name]
    completed = [points[0]]
    record = []
    for before, after in zip(points[:-1], points[1:], strict=True):
        change = tuple(b - a for a, b in zip(before, after, strict=True))
        is_w_flip = change[3] != 0
        where = 'tip' if before == Q3 else 'inner_hinge' if before == Q2 else 'other'
        gate_input = gate_by_position.get(where)
        permitted = not is_w_flip or (gate_input is not None and gate_404(gate_input))
        record.append({
            'from': before, 'to': after, 'delta_radius_squared': norm2(after) - norm2(before),
            'segment_length_squared': norm2(change), 'w_flip': is_w_flip,
            'role_from_to': [role(before), role(after)],
            'gate_site': where if is_w_flip else None,
            'gate_input': asdict(gate_input) if is_w_flip and gate_input else None,
            'permitted': permitted,
        })
        if not permitted:
            break
        completed.append(after)
    return {'route': name, 'completed': completed[-1] == Q0,
            'state_trace': completed, 'record': record}


ALIGN = GateInput(0, 0, 0.0, True, True)
MISALIGN = GateInput(7, -3, .20, True, True)
CLOSED = GateInput(0, 0, 0.0, False, True)
FAST = GateInput(0, 0, 0.0, True, False)
assert gate_404(ALIGN)
assert not any(gate_404(g) for g in (MISALIGN, CLOSED, FAST))

for name, route in ROUTES.items():
    assert route[0] == Q3 and route[-1] == Q0
    assert all(q in FULL_LATTICE for q in route)
    if name == 'direct_first':
        assert all(q in CORNER_STATES for q in route)
        assert [norm2(q) for q in route] == [7, 6, 2, 1, 0]
    else:
        assert any(q not in CORNER_STATES for q in route)
        assert [norm2(q) for q in route] == [7, 4, 3, 0]

scenarios = {
    'both_sites_aligned': {'tip': ALIGN, 'inner_hinge': ALIGN},
    'only_tip_aligned': {'tip': ALIGN, 'inner_hinge': MISALIGN},
    'only_inner_hinge_aligned': {'tip': MISALIGN, 'inner_hinge': ALIGN},
    'gap_closed_at_both': {'tip': CLOSED, 'inner_hinge': CLOSED},
    'too_fast_at_both': {'tip': FAST, 'inner_hinge': FAST},
}
rows = {}
for label, schedule in scenarios.items():
    rows[label] = {name: run_route(name, schedule) for name in ROUTES}
assert [rows['both_sites_aligned'][r]['completed'] for r in ROUTES] == [True, True]
assert [rows['only_tip_aligned'][r]['completed'] for r in ROUTES] == [True, False]
assert [rows['only_inner_hinge_aligned'][r]['completed'] for r in ROUTES] == [False, True]
for label in ('gap_closed_at_both', 'too_fast_at_both'):
    assert not any(rows[label][r]['completed'] for r in ROUTES)

forward = [Q0, Q1, Q2, Q3]
reverse_inner = ROUTES['inner_hinge']
assert forward == list(reversed(reverse_inner))
assert rows['both_sites_aligned']['direct_first']['state_trace'][-1] == Q0
assert rows['both_sites_aligned']['inner_hinge']['state_trace'][-1] == Q0
assert (rows['both_sites_aligned']['direct_first']['state_trace'] !=
        rows['both_sites_aligned']['inner_hinge']['state_trace'])

result = {
    'status': 'PASS_BOUNDED', 'carrier': 'model A, a 24-point integer lattice',
    '404_gate_status': 'synthetic conjunction of screenshot roles; not an observed map to q',
    'gate_definition': 'exact phase=0, tilt=0, error=0, open_gap, slow; no measured tolerances',
    'corner_state_count': len(CORNER_STATES), 'full_lattice_point_count': len(FULL_LATTICE),
    'forward_313_trace': forward,
    'route_templates': {name: {'states': route,
                              'r_squared': [norm2(q) for q in route],
                              'codes': [role(q) for q in route],
                              'all_states_in_16_corners': all(q in CORNER_STATES for q in route)}
                        for name, route in ROUTES.items()},
    'scenarios': rows,
    'outcome': ('Equal carrier endpoint Q0 and final code 47 do not recover which return route '
                'was taken. A typed history records gate site and route. Both routes require an '
                'independently assigned gate schedule; neither 404 nor the images fixes it.'),
}
Path(__file__).with_name('ROOT7_404_RETURN_RESULTS.json').write_text(
    json.dumps(result, indent=2, ensure_ascii=False) + '\n', encoding='utf-8')
print(json.dumps({label: {name: x['completed'] for name, x in cases.items()}
                  for label, cases in rows.items()}, ensure_ascii=False))
