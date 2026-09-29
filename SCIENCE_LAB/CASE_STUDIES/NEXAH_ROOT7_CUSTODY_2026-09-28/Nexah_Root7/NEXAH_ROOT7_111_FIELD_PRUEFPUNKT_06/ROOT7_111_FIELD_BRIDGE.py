#!/usr/bin/env python3
"""Bounded row-major 11/111 elevator audit for four dyadic channel labels."""

import json
from math import gcd
from pathlib import Path


SIDE = 111
SIZE = SIDE * SIDE
CHANNEL = [101 * (2 ** level) for level in range(4)]
PATH_A = [(0, 0, 0, 0), (1, 1, 1, 0),
          (1, 1, 1, 1), (1, 1, 2, 1)]


def xy(n):
    if not 0 <= n < SIZE:
        raise ValueError('row-major embedding only defined without wrap on [0,111²)')
    return n % SIDE, n // SIDE


def norm2(q):
    return sum(a*a for a in q)


def order_of_two(modulus):
    assert gcd(2, modulus) == 1
    v, order = 2 % modulus, 1
    while v != 1:
        v = (v * 2) % modulus
        order += 1
    return order


assert len(CHANNEL) == len(PATH_A) == 4
assert SIDE * SIDE == 12321
assert [norm2(q) for q in PATH_A] == [0, 3, 4, 7]
assert [(x, y) for x, y in map(xy, CHANNEL)] == [(101,0),(91,1),(71,3),(31,7)]

# Full 111x111 finite-window check: n=x+111*y and 111≡1 mod11.
for n in range(SIZE):
    x, y = xy(n)
    assert n == x + SIDE*y
    assert n % SIDE == x
    assert n % 11 == (x+y) % 11

rows = []
for level, (number, q) in enumerate(zip(CHANNEL, PATH_A, strict=True)):
    x, y = xy(number)
    rows.append({
        'level_index': level,
        'channel_mark': number,
        'binary': format(number, 'b'),
        'bit_count': number.bit_count(),
        'field_column_x': x, 'field_row_y': y,
        'mod_111': number % 111,
        'mod_11': number % 11,
        'recovered_mod_11_from_xy': (x+y) % 11,
        'naive_x_only_mod_11': x % 11,
        'naive_level_index_as_row_mod_11': (x+level) % 11,
        'stipulated_4D_coordinate': q,
        'stipulated_4D_radius_squared': norm2(q),
        'orientation_code': '47' if q[3] == 0 else '74',
    })

assert [r['mod_11'] for r in rows] == [2,4,8,5]
assert [r['mod_111'] for r in rows] == [101,91,71,31]
assert all(r['bit_count'] == 4 for r in rows)
assert any(r['naive_x_only_mod_11'] != r['mod_11'] for r in rows)
assert any(r['naive_level_index_as_row_mod_11'] != r['mod_11'] for r in rows)
assert order_of_two(11) == 10
assert order_of_two(111) == 36
assert CHANNEL[-1] * 2**4 == 12928  # next stages after 808: 1616, 3232, 6464, 12928
first_exiting_level = next(k for k in range(20) if 101 * 2**k >= SIZE)
assert first_exiting_level == 7
first_exiting_mark = 101 * 2**first_exiting_level
tile, local_n = divmod(first_exiting_mark, SIZE)
local_x, local_y = xy(local_n)
assert (tile, local_x, local_y) == (1, 52, 5)
assert first_exiting_mark % 11 == (local_x + local_y + tile) % 11 == 3
assert (local_x + local_y) % 11 == 2  # loses one unit without the tile/epoch index
assert int('0001111010000001', 2) == 7809
assert format(7801, '016b') == '0001111001111001'

result = {
    'status': 'PASS_BOUNDED',
    'scope': '0 ≤ n < 111², row-major 111×111 grid; not a measured NEXAH placement rule',
    'embedding': 'F(n)=(n mod 111, floor(n/111))',
    'commuting_projection': 'n mod 11 = (x+y) mod 11, because n=x+111*y and 111≡1 mod11',
    'field_points': SIZE,
    'dyadic_channel': rows,
    'radius_squared_increments': [b-a for a,b in zip([norm2(q) for q in PATH_A[:-1]],
                                                      [norm2(q) for q in PATH_A[1:]],strict=True)],
    'cycle_periods': {'mod_11': order_of_two(11), 'mod_111': order_of_two(111)},
    'first_dyadic_exit': {'level_index': first_exiting_level, 'mark': first_exiting_mark,
                          'tile_index': tile, 'local_xy': [local_x,local_y],
                          'true_mod_11': first_exiting_mark % 11,
                          'local_xy_only_mod_11': (local_x+local_y)%11,
                          'with_tile_mod_11': (local_x+local_y+tile)%11},
    'extended_projection': 'For n=111²*t+111*y+x: n mod11 = (x+y+t) mod11',
    'what_remains_under_doubling': 'Binary 1100101 followed by level_index zero bits; popcount 4; gcd with 111 remains 1',
    'null_controls': {
        'x_only_does_not_always_recover_mod_11': True,
        'using_dyadic_level_as_row_does_not_always_recover_mod_11': True,
        'first_number_outside_bounded_field': SIZE,
        'wrap_to_zero_would_misrepresent_mod_11': SIZE % 11 != 0,
        'wrap_mod_11_value_vs_coordinate_zero': [SIZE % 11, 0],
        'binary_caption_decimal_7801_is_inconsistent': True,
        'binary_shown_decimal_value': 7809,
        'correct_16bit_binary_for_7801': format(7801, '016b'),
    },
    'inference_limit': ('The labels 101/202/404/808 and 4D path agree by a stipulated attachment. '
                        'The row-major map is an exact chosen encoding only inside the field; '
                        'no independent image binds the geometry, gate, and 2D coordinates.'),
}
Path(__file__).with_name('ROOT7_111_FIELD_RESULTS.json').write_text(
    json.dumps(result, indent=2, ensure_ascii=False)+'\n',encoding='utf-8')
print(json.dumps({'status': result['status'], 'field_rows': [(r['channel_mark'], r['field_column_x'],
    r['field_row_y'],r['mod_11']) for r in rows], 'cycles': result['cycle_periods'],
    'first_wrap_mod_11': SIZE % 11}, ensure_ascii=False))
