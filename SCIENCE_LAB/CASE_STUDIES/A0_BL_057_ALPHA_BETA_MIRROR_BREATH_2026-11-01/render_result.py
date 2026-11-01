#!/usr/bin/env python3
import html
import json
import sys
from pathlib import Path


data = json.loads(Path(sys.argv[1]).read_text(encoding="utf-8"))
out = Path(sys.argv[2])
m = data["metrics"]
gates = data["gates"]
rows = "".join(
    f'<text x="90" y="{430 + i * 30}" class="row">{html.escape(k)}: {"PASS" if v else "FAIL"}</text>'
    for i, (k, v) in enumerate(gates.items())
)
svg = f'''<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="760" viewBox="0 0 1200 760">
<rect width="1200" height="760" fill="#08131f"/>
<style>.title{{font:700 36px sans-serif;fill:#f5f7fb}}.sub{{font:20px sans-serif;fill:#9fd8e5}}.metric{{font:24px monospace;fill:#ffd166}}.row{{font:18px monospace;fill:#d8e7ee}}.line{{stroke:#2dd4bf;stroke-width:5;fill:none}}.mirror{{stroke:#f472b6;stroke-width:5;fill:none}}</style>
<text x="60" y="70" class="title">A0-BL-057 · Alpha/Beta Mirror Breath</text>
<text x="60" y="108" class="sub">63/64 + 1/64 = 1 · centered: +31/32 / -31/32</text>
<path class="line" d="M100 260 C260 100 420 100 580 260 C740 420 900 420 1060 260"/>
<path class="mirror" d="M100 260 C260 420 420 420 580 260 C740 100 900 100 1060 260"/>
<text x="90" y="340" class="metric">max reciprocal error = {m['max_reciprocal_product_error']:.3e}</text>
<text x="90" y="375" class="metric">cycle Return error = {m['pure_cycle_state_return_error']:.3e}</text>
<text x="620" y="340" class="metric">hard/smooth acceleration = {m['hard_to_smooth_acceleration_ratio']:.3f}×</text>
<text x="620" y="375" class="metric">hard/smooth rotation = {m['hard_to_smooth_rotation_ratio']:.3f}×</text>
{rows}
<text x="60" y="725" class="sub">{html.escape(data['classification'])} · analytic/synthetic view test · no physical claim</text>
</svg>'''
out.parent.mkdir(parents=True, exist_ok=True)
out.write_text(svg + "\n", encoding="utf-8")
print(f"WROTE {out}")
