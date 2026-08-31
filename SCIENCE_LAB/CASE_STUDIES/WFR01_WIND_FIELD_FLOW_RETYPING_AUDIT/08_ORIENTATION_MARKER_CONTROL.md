# Orientation marker control

NADIR, ORIENT, Q°, axes, and direction markers can be metadata of a view, projection, observation, or transition when frame and convention are declared.

FGP-01 remains frozen: Q° is projection-relative; it is not source, center, or universal origin. Changing Q° can change a view without changing source structure. NADIR and ORIENT likewise require frame, reference, convention, and provenance.

Existing frame/view metadata is sufficient; no OLS primitive or RID field is required.

`Q_DEGREE_BOUNDARY_PRESERVED=YES`  
`NADIR_ORIENT_FRAME_MARKERS_SUPPORTED=YES_AS_VIEW_OR_TRANSITION_METADATA`
