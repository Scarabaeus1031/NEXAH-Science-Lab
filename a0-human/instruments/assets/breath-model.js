window.NEXAH_BREATH_MODEL = {
  schema: "nexah.janus-breath-sequence",
  version: "1.0.0",
  model_id: "NEXAH:CON_DAO_BREATH:V1",
  maintained: "2026-10-06",
  status: "BOUNDED_EXECUTABLE_REPRESENTATION",
  states: [
    { id: "CON-6", side: "CON", depth: 6 },
    { id: "CON-5", side: "CON", depth: 5 },
    { id: "CON-4", side: "CON", depth: 4 },
    { id: "CON-3", side: "CON", depth: 3 },
    { id: "CON-2", side: "CON", depth: 2 },
    { id: "CON-1", side: "CON", depth: 1 },
    { id: "STILL", side: "STILLPOINT", depth: 0, source_label: 0, operational_label: "1 / UNITY", dwell: 2 },
    { id: "DAO-1", side: "DAO", depth: 1 },
    { id: "DAO-2", side: "DAO", depth: 2 },
    { id: "DAO-3", side: "DAO", depth: 3 },
    { id: "DAO-4", side: "DAO", depth: 4 },
    { id: "DAO-5", side: "DAO", depth: 5 },
    { id: "DAO-6", side: "DAO", depth: 6 }
  ],
  partitions: {
    "6|1|6": { label: "Janus Breath", outer_groups: [6, 6], center: 1 },
    "7+5": { label: "Relations + Pentagon Envelope", outer_groups: [7, 5], center: 1 },
    "8+4": { label: "Octave + Four Axes", outer_groups: [8, 4], center: 1 }
  },
  historical_trace: [5, 4, 4, 3, 3, 3, 2, 1, 0, 0, 9, 8, 8, 7, 7, 6, 5, 5, 4, 4, 3],
  historical_trace_status: "OWNER_SUPPLIED_VISUAL_PROVENANCE_ONLY",
  source_provenance: "SCIENCE_LAB/CASE_STUDIES/THREE_LIFE_SYSTEMS_PLUS_ONE_BINDER_VISUAL_SERIES_2026-08-24/FINAL_VISUAL_SERIES_DECISION.md",
  claim_boundary: "The executable 13-state carrier is a new bounded representation. The 21-entry Root Breath trace is retained as historical provenance and is not asserted to be identical to the 13-state carrier or to describe a physical mechanism."
};
