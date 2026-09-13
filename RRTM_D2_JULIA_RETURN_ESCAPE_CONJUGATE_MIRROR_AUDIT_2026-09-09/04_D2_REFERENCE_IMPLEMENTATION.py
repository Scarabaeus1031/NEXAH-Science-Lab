#!/usr/bin/env python3
"""Dependency-free audit reference for z_(n+1) = z_n**2 + c.

Writes only into this new audit directory. No network, subprocess, GUI,
randomness, deletion, or legacy-file operations are used.
"""
from __future__ import annotations
import csv, hashlib, json, statistics, struct, zlib
from pathlib import Path

OUT = Path(__file__).resolve().parent
PARAMETERS_PATH = OUT / "05_REPRODUCTION_PARAMETERS.json"

def digest(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()

def sign(v: float) -> str:
    return "+" if v > 0 else "-" if v < 0 else "0"

def iterate_grid(c: complex, size: int, view: list[float], limit: int, radius: float) -> list[int]:
    xmin, xmax, ymin, ymax = view
    xs = [xmin + (xmax-xmin)*j/(size-1) for j in range(size)]
    ys = [ymin + (ymax-ymin)*i/(size-1) for i in range(size)]
    out = [0] * (size*size)  # 0 means not escaped by the finite horizon
    r2 = radius*radius
    for i, y in enumerate(ys):
        for j, x in enumerate(xs):
            zx, zy = x, y
            for n in range(1, limit+1):
                zx, zy = zx*zx-zy*zy+c.real, 2.0*zx*zy+c.imag
                if zx*zx+zy*zy > r2:
                    out[i*size+j] = n
                    break
    return out

def replay_rrtm_v1_contract() -> dict:
    """Independent scalar replay of the source-documented 512x384 contract."""
    width, height, limit, radius = 512, 384, 500, 2.0
    xmin, xmax, ymin, ymax = -1.8, 1.8, -1.35, 1.35
    c = complex(-0.75, 0.10)
    xs = [xmin + (xmax-xmin)*j/(width-1) for j in range(width)]
    ys = [ymin + (ymax-ymin)*i/(height-1) for i in range(height)]
    out = [limit] * (width*height)
    for i,y in enumerate(ys):
        for j,x in enumerate(xs):
            z=complex(x,y)
            for n in range(limit):
                z=z*z+c
                if abs(z)>radius:
                    out[i*width+j]=n+1
                    break
    actual=digest(packed(out))
    expected="504688d397f7773867d7c320c80b977938be8df938fc8ef7b598d5cd72b37200"
    return {"contract_source":"legacy RRTM V1 run_test.py/results.json","width":width,"height":height,"viewport":[xmin,xmax,ymin,ymax],"maximum_iterations":limit,"escape_radius":radius,"expected_source_escape_array_sha256":expected,"independent_escape_array_sha256":actual,"byte_exact_array_match":actual==expected}

def packed(values: list[int]) -> bytes:
    return b"".join(struct.pack("<H", v) for v in values)

def bounded_mask(values: list[int]) -> list[bool]:
    return [v == 0 for v in values]

def metrics(values: list[int], reference: list[bool]) -> dict:
    escaped = [v for v in values if v]
    current = bounded_mask(values)
    return {
        "escaped_fraction": len(escaped)/len(values),
        "bounded_at_horizon_fraction": (len(values)-len(escaped))/len(values),
        "mean_escape_iteration_among_escaped": statistics.fmean(escaped),
        "median_escape_iteration_among_escaped": statistics.median(escaped),
        "changed_pixel_fraction_vs_c_plus_mask": sum(a != b for a,b in zip(current,reference))/len(values),
        "integer_escape_array_sha256_le_uint16": digest(packed(values)),
    }

def write_gray_png(path: Path, width: int, height: int, pixels: bytes) -> None:
    def chunk(kind: bytes, body: bytes) -> bytes:
        return struct.pack(">I",len(body))+kind+body+struct.pack(">I",zlib.crc32(kind+body)&0xffffffff)
    rows = b"".join(b"\0"+pixels[i*width:(i+1)*width] for i in range(height))
    data = b"\x89PNG\r\n\x1a\n"+chunk(b"IHDR",struct.pack(">IIBBBBB",width,height,8,0,0,0,0))+chunk(b"IDAT",zlib.compress(rows,9))+chunk(b"IEND",b"")
    path.write_bytes(data)

def render_escape(values: list[int], size: int, limit: int, path: Path) -> None:
    pixels = bytearray()
    for i in range(size-1,-1,-1):
        for v in values[i*size:(i+1)*size]:
            pixels.append(255 if v == 0 else max(0,min(254,round(254*v/limit))))
    write_gray_png(path,size,size,bytes(pixels))

def critical_orbit(c: complex, limit: int, radius: float):
    orbit, rows, z, escaped = [0j], [], 0j, False
    for n in range(limit+1):
        if abs(z) > radius:
            escaped = True
        rows.append({
            "n":n,"re_z":z.real,"im_z":z.imag,"abs_z":abs(z),"escaped":escaped,
            "return_distance_to_z0":abs(z),
            "return_distance_to_previous_state":0.0 if n == 0 else abs(z-orbit[n-1]),
        })
        if escaped or n == limit:
            break
        z = z*z+c
        orbit.append(z)
    return orbit, rows

def representation_agreement(c: complex, tolerance: float) -> dict:
    coords = [-2.0,-1.0,-0.25,0.0,0.25,1.0,2.0]
    maximum, comparisons = 0.0, 0
    for x0 in coords:
        for y0 in coords:
            z, x, y = complex(x0,y0), x0, y0
            for _ in range(50):
                z = z*z+c
                x,y = x*x-y*y-0.75,2.0*x*y+0.10
                maximum=max(maximum,abs(z-complex(x,y))); comparisons+=1
                if abs(z)>2.0: break
    return {"sample_initial_points":49,"maximum_steps_per_point":50,"state_comparisons":comparisons,"predeclared_absolute_tolerance":tolerance,"maximum_absolute_difference":maximum,"agreement":maximum<=tolerance}

def main() -> None:
    p=json.loads(PARAMETERS_PATH.read_text(encoding="utf-8"))
    size,view=p["grid"]["resolution"],p["grid"]["viewport"]
    limit,radius=p["iteration"]["maximum_iterations"],p["iteration"]["escape_radius"]
    eps=p["parameter_sensitivity"]["epsilon"]
    candidates={"c_0":complex(-.75,0),"c_plus":complex(-.75,.10),"c_minus":complex(-.75,-.10),"c_eps_plus":complex(-.75,.10+eps),"c_eps_minus":complex(-.75,.10-eps)}
    grids={k:iterate_grid(v,size,view,limit,radius) for k,v in candidates.items()}
    ref=bounded_mask(grids["c_plus"]); sensitivity={}; rows=[]
    for name,c in candidates.items():
        m=metrics(grids[name],ref); sensitivity[name]={"c_real":c.real,"c_imag":c.imag,**m}; rows.append({"parameter":name,"c_real":c.real,"c_imag":c.imag,**m})
    with (OUT/"09_PARAMETER_SENSITIVITY.csv").open("w",encoding="utf-8",newline="") as h:
        w=csv.DictWriter(h,fieldnames=list(rows[0])); w.writeheader(); w.writerows(rows)
    minus=grids["c_minus"]; reflected=[]
    for i in range(size-1,-1,-1): reflected.extend(minus[i*size:(i+1)*size])
    plus=grids["c_plus"]; mismatch=sum(a!=b for a,b in zip(plus,reflected))
    raw=bytes(255 if a!=b else 0 for a,b in zip(plus,reflected))
    display=b"".join(raw[i*size:(i+1)*size] for i in range(size-1,-1,-1))
    write_gray_png(OUT/"CONJUGATE_MIRROR_DIFFERENCE.png",size,size,display)
    orbit,orbit_rows=critical_orbit(candidates["c_plus"],p["critical_orbit"]["maximum_iterations"],radius)
    with (OUT/"06_CRITICAL_ORBIT.csv").open("w",encoding="utf-8",newline="") as h:
        w=csv.DictWriter(h,fieldnames=list(orbit_rows[0])); w.writeheader(); w.writerows(orbit_rows)
    closest_n,closest_distance=min(((n,abs(z)) for n,z in enumerate(orbit) if n),key=lambda q:q[1])
    periods={}
    for period in p["return_observables"]["candidate_periods"]:
        n,d=min(((n,abs(orbit[n+period]-orbit[n])) for n in range(len(orbit)-period)),key=lambda q:q[1])
        periods[str(period)]={"minimum_distance":d,"start_iteration":n,"end_iteration":n+period}
    escape_n=next((r["n"] for r in orbit_rows if r["escaped"]),None)
    render_escape(plus,size,limit,OUT/"D2_ESCAPE_TIME_AUDIT_ONLY.png")
    result={
        "audit_id":"RRTM_D2_2026-09-09","classification":"ESTABLISHED_COMPLEX_DYNAMICS",
        "representation_agreement":representation_agreement(candidates["c_plus"],p["representation_agreement"]["absolute_tolerance"]),
        "critical_orbit":{"finite_horizon":p["critical_orbit"]["maximum_iterations"],"terminated_at_escape":escape_n is not None,"first_escape_iteration":escape_n,"classification":"ESCAPED" if escape_n is not None else "FINITE_HORIZON_NOT_ESCAPED","closest_nontrivial_return_iteration_to_z0":closest_n,"minimum_nontrivial_return_distance_to_z0":closest_distance,"minimum_period_candidate_distances":periods,"sign_sequence_re":"".join(sign(z.real) for z in orbit),"sign_sequence_im":"".join(sign(z.imag) for z in orbit),"maximum_magnitude_through_escape_or_horizon":max(abs(z) for z in orbit),"exact_periodic_return":False,"exact_periodic_return_assessment":"NO_RETURN_DEMONSTRATED"},
        "conjugate_mirror":{"identity":"conj(f_c(z)) = f_conj(c)(conj(z))","integer_array_mismatch_count_after_vertical_reflection":mismatch,"total_pixels":len(plus),"mismatch_fraction":mismatch/len(plus),"classification":"CONJUGATE_MIRROR_CONFIRMED" if mismatch==0 else "CONTRADICTED","smooth_array":"NOT_CALCULATED"},
        "parameter_sensitivity":sensitivity,
        "legacy_rrtm_v1_contract_replay":replay_rrtm_v1_contract(),
        "smooth_escape_time":"NOT_CALCULATED_OPTIONAL"}
    (OUT/"07_ESCAPE_AND_RETURN_RESULTS.json").write_text(json.dumps(result,indent=2,sort_keys=True)+"\n",encoding="utf-8")

if __name__=="__main__": main()
