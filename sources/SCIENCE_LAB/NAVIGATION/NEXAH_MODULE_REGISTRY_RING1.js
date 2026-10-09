/*
 * NEXAH Navigation Ring 1 — canonical browser registry
 * Scope: active instruments only. Archives, source snapshots and custody copies
 * are deliberately excluded.
 * Maintained: 2026-10-05
 */
globalThis.NEXAH_MODULE_REGISTRY_RING1 = Object.freeze({
  version: '1.0.0',
  date: '2026-10-05',
  atlas: 'atlas',
  missionControl: 'mission-control',
  modules: Object.freeze({
    'atlas': {
      title: 'Family Connection Map v2',
      short: 'Family Map',
      path: 'NEXAH_FAMILY_CONNECTION_MAP_V2.html',
      record: 'FAMILY_CONNECTION_MAP_V2_2026-10-05.md',
      route: 'all',
      chain: 'F1 ↔ F2 ↔ F3 ↔ F4 ↔ F5 · F6 offen · F7 transversal',
      explanation: 'Der Atlas hält die Teilnetze zusammen, ohne gleiche Geometrie oder gleiches Vokabular mit Mechanismusidentität zu verwechseln.',
      related: ['mission-control', 'e8-graph', 'dual-belt', 'tessarec', 'two-cut'],
      mode: 'flow'
    },
    'mission-control': {
      title: 'HZ/FZ Compass Mission Control',
      short: 'Mission Control',
      path: 'EXPORTS/NEXAH_HZ_FZ_COMPASS_MISSION_CONTROL.html',
      record: 'NEXAH_CURRENT_TOTAL_OVERVIEW_2026-09-18.md',
      route: 'all',
      chain: 'F7 transversal · Register → Replay → Claim Ceiling',
      explanation: 'Mission Control ist die Governance- und Rückkehrschicht: Es verknüpft Instrument, Record, Replay und Evidenzgrenze.',
      related: ['atlas', 'e8-graph', 'word-orbit', 'two-cut'],
      mode: 'flow'
    },
    'e8-graph': {
      title: 'E8 Mutation Family Graph',
      short: 'E8 Graph',
      path: 'CASE_STUDIES/E8_DEMOS_INTERACTIVE_ORIENTATION_2026-09-21/NEXAH_E8_MUTATION_FAMILY_GRAPH.html',
      record: 'CASE_STUDIES/E8_DEMOS_INTERACTIVE_ORIENTATION_2026-09-21/COXETER_ORBIT_TOPOLOGY_LAB_2026-10-05/README.md',
      route: 'e8',
      chain: 'F1 → F3 → F5 → F7',
      explanation: 'Der deklarierte Träger wird durch Generatoren bewegt, als Orbit oder Graph gelesen und durch exakte Return-Tests begrenzt.',
      related: ['word-orbit', 'family-synthesis', 'typed-coupling', 'atlas'],
      mode: 'flow'
    },
    'family-synthesis': {
      title: 'Family Synthesis Demonstrator',
      short: 'Family Synthesis',
      path: 'CASE_STUDIES/E8_DEMOS_INTERACTIVE_ORIENTATION_2026-09-21/COXETER_ORBIT_TOPOLOGY_LAB_2026-10-05/NEXAH_FAMILY_SYNTHESIS_DEMONSTRATOR.html',
      record: 'CASE_STUDIES/E8_DEMOS_INTERACTIVE_ORIENTATION_2026-09-21/COXETER_ORBIT_TOPOLOGY_LAB_2026-10-05/README.md',
      route: 'e8',
      chain: 'F1 → F3 → F5 → F7',
      explanation: 'Die Synthese legt mehrere Darstellungen derselben deklarierten Operatorfamilie nebeneinander und hält ihren Rückweg explizit.',
      related: ['e8-graph', 'typed-coupling', 'word-orbit', 'atlas'],
      mode: 'flow'
    },
    'typed-coupling': {
      title: 'Typed Coupling Workbench',
      short: 'Typed Coupling',
      path: 'CASE_STUDIES/E8_DEMOS_INTERACTIVE_ORIENTATION_2026-09-21/COXETER_ORBIT_TOPOLOGY_LAB_2026-10-05/NEXAH_TYPED_COUPLING_WORKBENCH.html',
      record: 'CASE_STUDIES/E8_DEMOS_INTERACTIVE_ORIENTATION_2026-09-21/COXETER_ORBIT_TOPOLOGY_LAB_2026-10-05/README.md',
      route: 'e8',
      chain: 'F1 → F3 → F5 · typisierte Kopplung → F7',
      explanation: 'Die Workbench prüft, welche Übergänge wirklich typisiert sind und welche nur eine visuelle oder sprachliche Nähe besitzen.',
      related: ['family-synthesis', 'word-orbit', 'e8-graph', 'atlas'],
      mode: 'flow'
    },
    'word-orbit': {
      title: 'Word & Orbit Sequencer',
      short: 'Word & Orbit',
      path: 'CASE_STUDIES/E8_DEMOS_INTERACTIVE_ORIENTATION_2026-09-21/COXETER_ORBIT_TOPOLOGY_LAB_2026-10-05/NEXAH_WORD_ORBIT_SEQUENCER.html',
      record: 'CASE_STUDIES/E8_DEMOS_INTERACTIVE_ORIENTATION_2026-09-21/COXETER_ORBIT_TOPOLOGY_LAB_2026-10-05/MISSION_CONTROL_RETURN_WORD_ORBIT_SEQUENCER_2026-10-05.md',
      route: 'e8',
      chain: 'F1 → F3 → F5 → F7',
      explanation: 'Ein Generatorwort wird als überprüfbare Zustandsfolge ausgeführt; Orbit, Return und Fehlerzustand bleiben im selben Record.',
      related: ['typed-coupling', 'family-synthesis', 'e8-graph', 'two-cut'],
      mode: 'flow'
    },
    'two-cut': {
      title: 'Euler · Antipode · Two-Cut Return',
      short: 'Two-Cut Return',
      path: 'RESEARCH_AREAS/FIELD_GLYPH_NUMBER_ARCHITECTURE_STAGE_0_2026-09-14/NEXAH_EULER_ANTIPODE_TWO_CUT_INSTRUMENT.html',
      record: 'RESEARCH_AREAS/FIELD_GLYPH_NUMBER_ARCHITECTURE_STAGE_0_2026-09-14/26_TRANSVERSUM_TWO_CUT_ANTIPODE_SYNTHESIS.md',
      route: 'transversum',
      chain: 'F1 → F2 → F7',
      explanation: 'Zwei gerichtete Schnitte werden über eine persistente Adresse gebunden und in einen prüfbaren Return-Record zurückgeführt.',
      related: ['dual-belt', 'tessarec', 'word-orbit', 'atlas'],
      mode: 'flow'
    },
    'dual-belt': {
      title: 'NEXAH ⇄ ERITH · 3+1 Dual Belt',
      short: 'ERITH · Dual Belt',
      path: 'EXPORTS/NEXAH_3_PLUS_1_DUAL_BELT.html',
      record: 'REPORTS/NEXAH_GRID_OBSERVATORY_PUBLIC_RELEASE_2026-09-17/05_3_PLUS_1_DUAL_BELT_IMPLEMENTATION_RECORD.md',
      route: 'erith',
      chain: 'F1 → F2 → F3 → F1 → F7',
      explanation: 'Ein gemeinsamer Seed wird adressiert entfaltet, über eine Seam gebunden und durch getrennte Auswärts- und Rückkehrgürtel beobachtet.',
      related: ['two-cut', 'tessarec', 'atlas', 'mission-control'],
      mode: 'immersive'
    },
    'tessarec': {
      title: 'Tessarec Q° × ι · Pearl',
      short: 'Tessarec',
      path: 'EXPORTS/NEXAH_TESSAREC_Q_IOTA_PEARL.html',
      record: 'REPORTS/NEXAH_GRID_OBSERVATORY_PUBLIC_RELEASE_2026-09-17/07_TESSAREC_ROOT_IOTA_FRAME_IMPLEMENTATION_RECORD.md',
      route: 'tessarec',
      chain: 'F2 → F5 → F1 → F2 → F7',
      explanation: 'Der Sign-State-Träger wird als Graph gebunden, durch einen gerichteten Iota-Schnitt beobachtet und mit Adresse und Residuum zurückgeschrieben.',
      related: ['two-cut', 'dual-belt', 'atlas', 'mission-control'],
      mode: 'immersive'
    }
  })
});
