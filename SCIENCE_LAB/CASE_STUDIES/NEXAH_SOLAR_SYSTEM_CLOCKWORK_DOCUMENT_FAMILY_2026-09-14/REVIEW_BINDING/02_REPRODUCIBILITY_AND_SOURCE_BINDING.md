# Reproducibility and Source Binding

## DOCX integrity and render review

- Both DOCX files pass ZIP-container integrity checks and are byte-identical.
- SHA-256 of the logical report object: `6ce99b12a5eda7634d334724bfc74e0b98fe3924068cab9327f75f786b85aa85`.
- The report rendered through all 38 pages.
- Page 7 is nearly empty except for the atlas heading.
- Several atlas headings are clipped at the left edge, and some source-caption lines approach or collide with the footer.
- These are source-layout observations. Custody does not silently repair the source report.

## DOCX media binding

The DOCX contains 40 embedded media objects. Exact digest comparison binds only two external PNGs directly to embedded media:

- `q-port-conic-gate.png`
- `saturn-titan-qrt-record.png`

The other 24 external PNGs are not byte-identical to DOCX media. Some are visibly related variants or recompressed versions, but visual similarity is not an exact provenance binding. Conversely, 38 embedded media objects have no exact external-file counterpart in this intake. Historical source filenames printed in report captions are not recovered as files under those names.

Classification: `PARTIAL_MEDIA_SOURCE_BINDING`.

## Exact duplicate groups

1. `Solar_System_Clockwork_and_Time_Gesamtreport.docx` = `Solar_System_Clockwork_and_Time_Gesamtreport copy.docx`.
2. `lorenz_gate_validation.png` = `lorenz_gate_validation copy.png`.

The three `IOTA WHEEL — THE HALF-TURN RETURN` PNGs are variants, not byte-identical duplicates. Their state-number assignments differ and must remain separately addressable.

## Lorenz-63 implementation check

The Python source declares:

- canonical Lorenz-63 equations with `sigma=10`, `rho=28`, `beta=8/3`;
- initial state `[1, 1, 1]`;
- fixed-step RK4;
- integration to `T=500` with burn-in `T=50`;
- tested steps `0.02`, `0.01`, `0.005`, and `0.0025`;
- reference step `0.001`;
- strict sign changes of `x` and linear interpolation to the `x=0` section.

Read-only checks confirmed:

- the four CSV rows numerically match the JSON `controlled_resampling_metrics`;
- the controlled slope recomputed from the CSV is `0.9788465079865669`, matching the JSON value `0.9788465079865675` to floating-point precision;
- each controlled run reports 247 crossings;
- interpolated `|x|` is at floating-point zero while raw post-crossing width decreases with step size.

The supplied bounded decision is therefore internally supported by the supplied records: `SECTION_TRACE_SUPPORTED; CONE_OBJECT_NOT_SUPPORTED`.

## Lorenz execution residual

The script was not rerun during intake:

- it writes to a hard-coded `/workspace` path;
- no environment or dependency lock file is supplied;
- the available review runtime lacks the declared `scipy` dependency.

Classification: `SOURCE_AND_RESULTS_INTERNALLY_CONSISTENT`, `FRESH_REPLAY_PENDING_ENVIRONMENT_BINDING`.

## HTML source check

Both HTML files contain authored standalone visualization payloads and host/bootstrap code. No active external `<script src>`, stylesheet link, `fetch`, XHR, or WebSocket dependency was found in the bounded static inspection. The host code contains origin allowlists and a local-storage capability probe. Interactive browser execution and PNG regeneration were not performed.

Classification: `GENERATOR_SOURCE_PRESENT`, `PIXEL_REPLAY_NOT_YET_BOUND`.
