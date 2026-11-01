#!/usr/bin/env python3
import json
import sys
from pathlib import Path


data = json.loads(Path(sys.argv[1]).read_text(encoding="utf-8"))
target = Path(sys.argv[2])
width, height = 1200, 760
left, top, plot_w, plot_h = 100, 140, 720, 500
centers = sorted({row["center"] for row in data["boundary_variants"]})
widths = sorted({row["width"] for row in data["boundary_variants"]})
colors = ["#12b8c4", "#f3a712", "#d94f91", "#6d5bd0"]
def x(v): return left + (v - 22.0) / 6.0 * plot_w
def y(v): return top + plot_h - (v - 18.0) / 14.0 * plot_h
lines = [
    f'<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" viewBox="0 0 {width} {height}">',
    '<rect width="1200" height="760" fill="#08131f"/>',
    '<text x="60" y="58" fill="#f4f7fb" font-family="sans-serif" font-size="34" font-weight="700">A0-BL-058 · Pulse Persistence Without Hard Boundary</text>',
    f'<text x="60" y="98" fill="#a9b8c8" font-family="sans-serif" font-size="20">{data["classification"]} · {", ".join(data["qualifiers"]) or "no qualifier"}</text>',
    f'<rect x="{left}" y="{top}" width="{plot_w}" height="{plot_h}" fill="#0f2233" stroke="#37566f"/>',
    '<text x="340" y="720" fill="#d8e3ed" font-family="sans-serif" font-size="20">smooth boundary center t₀</text>',
    '<text transform="translate(30 470) rotate(-90)" fill="#d8e3ed" font-family="sans-serif" font-size="20">detected event time t*</text>'
]
for value in [23, 25, 27]:
    lines.append(f'<line x1="{x(value):.1f}" y1="{top}" x2="{x(value):.1f}" y2="{top+plot_h}" stroke="#29445a"/>')
    lines.append(f'<text x="{x(value)-10:.1f}" y="{top+plot_h+30}" fill="#a9b8c8" font-family="sans-serif" font-size="16">{value}</text>')
for value in [18, 22, 26, 30, 32]:
    lines.append(f'<line x1="{left}" y1="{y(value):.1f}" x2="{left+plot_w}" y2="{y(value):.1f}" stroke="#29445a"/>')
    lines.append(f'<text x="58" y="{y(value)+5:.1f}" fill="#a9b8c8" font-family="sans-serif" font-size="16">{value}</text>')
for width_value, color in zip(widths, colors):
    rows = sorted((row for row in data["boundary_variants"] if row["width"] == width_value), key=lambda row: row["center"])
    points = " ".join(f'{x(row["center"]):.1f},{y(row["t_star"]):.1f}' for row in rows)
    lines.append(f'<polyline points="{points}" fill="none" stroke="{color}" stroke-width="4"/>')
    for row in rows:
        lines.append(f'<circle cx="{x(row["center"]):.1f}" cy="{y(row["t_star"]):.1f}" r="7" fill="{color}"/>')
    legend_y = 175 + widths.index(width_value) * 34
    lines.append(f'<line x1="865" y1="{legend_y}" x2="905" y2="{legend_y}" stroke="{color}" stroke-width="4"/>')
    lines.append(f'<text x="920" y="{legend_y+6}" fill="#d8e3ed" font-family="sans-serif" font-size="18">σ = {width_value:g}</text>')
metrics = data["metrics"]
summary = [
    f'median tracking slope: {metrics["boundary_median_tracking_slope"]:.4f}',
    f't* span: {metrics["boundary_t_star_span"]:.4f}',
    f'sampling span: {metrics["sampling_t_star_span"]:.4f}',
    f'max Fourier t* error: {metrics["max_high_order_fourier_t_error"]:.4f}',
    f'Alpha/Beta reciprocal error: {metrics["max_alpha_beta_reciprocal_error"]:.3e}'
]
for i, text in enumerate(summary):
    lines.append(f'<text x="860" y="{355+i*34}" fill="#d8e3ed" font-family="monospace" font-size="16">{text}</text>')
lines.append('<text x="860" y="565" fill="#f3a712" font-family="sans-serif" font-size="17">Synthetic analytic model only</text>')
lines.append('<text x="860" y="594" fill="#a9b8c8" font-family="sans-serif" font-size="15">No physical breath or resonance claim</text>')
lines.append('</svg>')
target.parent.mkdir(parents=True, exist_ok=True)
target.write_text("\n".join(lines) + "\n", encoding="utf-8")
print(target)
