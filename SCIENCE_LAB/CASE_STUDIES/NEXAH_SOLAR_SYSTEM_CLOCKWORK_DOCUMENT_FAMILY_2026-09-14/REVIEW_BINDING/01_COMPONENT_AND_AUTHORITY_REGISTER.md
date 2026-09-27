# Component and Authority Register

## Physical inventory

| Component class | Physical files | Authority role |
|---|---:|---|
| DOCX report aliases | 2 | One logical 38-page report object; the two files are byte-identical |
| PNG visuals | 26 | Rendered orientation/source artifacts; one byte-identical alias pair |
| HTML demonstrators | 2 | Authored interactive/source payloads for the Q-port and Saturn-Titan records |
| Python generator/test | 1 | Declared generator for the Lorenz-63 gate test bundle only |
| CSV result | 1 | Controlled-resampling result table from the Lorenz bundle |
| JSON result | 1 | Structured Lorenz model, metrics, fits, and bounded decision |
| macOS metadata | 1 | Incidental `.DS_Store`; custody only, no content authority |
| **Total** | **34** | **32 unique byte hashes** |

## Authority order inside this custody package

1. The source files themselves control what was supplied.
2. `Solar_System_Clockwork_and_Time_Gesamtreport.docx` and its exact alias control the family's narrative claims and evidence-class labels.
3. `lorenz_gate_test.py` controls the implemented Lorenz procedure; its CSV, JSON, and PNG are result records, not independent generators.
4. The two HTML files control only their own interactive visualizations. Their same-named PNGs are exact embedded media in the DOCX, but pixel-level regeneration from the HTML was not executed in this intake.
5. UUID-named PNGs and the screenshot are source visuals. They do not acquire mathematical or scientific authority from appearance alone.
6. These review records classify and preserve the intake; they do not rewrite its source content.

## Report evidence classes retained

The report explicitly distinguishes:

- `ESTABLISHED`: standard mechanics or sourced astronomy;
- `CALCULATED`: quantities derived from declared inputs;
- `CANDIDATE`: proposed NEXAH operators or representations;
- `ANNOTATION`: symbolic, lexical, visual, or interpretive material.

That distinction is preserved as a valuable internal boundary. It is not equivalent to independent verification of every displayed value.

## Ecosystem placement

- QRT / cut / record / trace: compatible research vocabulary, no automatic canonical extension.
- OLS / OVS: orientation-language and visual-language source material, not a normative release.
- Lorenz: a new bounded test bundle adjacent to earlier Lorenz work, not a provenance continuation of every prior Lorenz experiment.
- `CLOCKWORK ORANGE`: different prior GLB/object family; no direct source identity demonstrated.
- ORION / NEXAH Core: no runtime or canonicalization effect from custody.
