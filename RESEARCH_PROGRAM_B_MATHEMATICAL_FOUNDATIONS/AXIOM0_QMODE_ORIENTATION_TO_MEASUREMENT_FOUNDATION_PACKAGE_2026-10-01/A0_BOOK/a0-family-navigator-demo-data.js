/* Generated from the owning Atlas; rebuild explicitly, never infer graph relations. */
window.A0FamilyNavigatorDemoData={
  "meta": {
    "source": "A0_FAMILY_CONNECTION_ATLAS.html",
    "sha256": "9e420e12ff6187cbece3988b095040d7015c2ebb5d15e42a475b19b1746e2311",
    "scope": "Standalone presentation snapshot; not a new registry or admission",
    "date": "2026-10-21"
  },
  "families": {
    "F1": {
      "x": 120,
      "y": 165,
      "name": "Observation / Record",
      "aperture": "Observation aperture",
      "selects": "sichtbare oder lesbare Records, Außenformen und Signale",
      "short": "Aperture · Signal · Record",
      "question": "Was wird durch diese Apertur wann und unter welchen Bedingungen sichtbar oder lesbar?"
    },
    "F2": {
      "x": 155,
      "y": 410,
      "name": "Address / Boundary",
      "aperture": "Address aperture",
      "selects": "Positionen, Ausschnitte, Adressen und zulässige Grenzen",
      "short": "Position · Time · Conditions",
      "question": "Wo, wann und unter welchen Randbedingungen gilt dieser Ausschnitt?"
    },
    "F3": {
      "x": 390,
      "y": 255,
      "name": "Transition / Operator",
      "aperture": "Transition aperture",
      "selects": "deklarierte Operatoren, Übersetzungen und Zustandswechsel",
      "short": "Word · Flow · Current",
      "question": "Welche deklarierte Aktion oder Übersetzung wird durch diese Apertur lesbar?"
    },
    "F4": {
      "x": 520,
      "y": 465,
      "name": "Phase / Drift",
      "aperture": "Phase aperture",
      "selects": "Zeit-, Phasen-, Drift- und Holonomieabhängigkeit",
      "short": "Phase · Winding · Holonomy",
      "question": "Was wird als Phase, Drift oder akkumulierte Spur sichtbar?"
    },
    "F5": {
      "x": 735,
      "y": 255,
      "name": "Connectivity / Topology",
      "aperture": "Connectivity aperture",
      "selects": "Nachbarschaften, Pfade, Orbits, Fasern und Trägerstruktur",
      "short": "Graph · Orbit · Fiber",
      "question": "Welche Verbindung oder Struktur öffnet diese Apertur?"
    },
    "F6": {
      "x": 840,
      "y": 465,
      "name": "Synchronization / Control",
      "aperture": "Control aperture",
      "selects": "Kopplung, Takt, Gate, Eingriff und Steuerbedingung",
      "short": "Gate · Cross · Sequence",
      "question": "Was wird als Ausrichtung, Kopplung oder Intervention lesbar?"
    },
    "F7": {
      "x": 500,
      "y": 70,
      "name": "Validation / Governance",
      "aperture": "Validation aperture",
      "selects": "Replay, Nulltest, Evidenzstatus, Claim Ceiling und STOP",
      "short": "Replay · Null · Ceiling",
      "question": "Welche Aussage hält die Prüf-Apertur aus – und wo muss sie stoppen?"
    }
  },
  "edges": {
    "e12": {
      "a": "F1",
      "b": "F2",
      "status": "exact",
      "label": "Record → Adresse"
    },
    "e13": {
      "a": "F1",
      "b": "F3",
      "status": "exact",
      "label": "Record → Operator"
    },
    "e23": {
      "a": "F2",
      "b": "F3",
      "status": "empirical",
      "label": "Adresse → Übergang"
    },
    "e34": {
      "a": "F3",
      "b": "F4",
      "status": "empirical",
      "label": "Übergang → Phase"
    },
    "e35": {
      "a": "F3",
      "b": "F5",
      "status": "exact",
      "label": "Operator → Verbindung"
    },
    "e45": {
      "a": "F4",
      "b": "F5",
      "status": "open",
      "label": "Phase ⇢ Topologie"
    },
    "e46": {
      "a": "F4",
      "b": "F6",
      "status": "open",
      "label": "Phase ⇢ Kontrolle"
    },
    "e56": {
      "a": "F5",
      "b": "F6",
      "status": "open",
      "label": "Struktur ⇢ Kontrolle"
    },
    "e17": {
      "a": "F1",
      "b": "F7",
      "status": "method",
      "label": "Record → Prüfung"
    },
    "e27": {
      "a": "F2",
      "b": "F7",
      "status": "method",
      "label": "Adresse → Prüfung"
    },
    "e37": {
      "a": "F3",
      "b": "F7",
      "status": "method",
      "label": "Operator → Prüfung"
    },
    "e47": {
      "a": "F4",
      "b": "F7",
      "status": "method",
      "label": "Phase → Prüfung"
    },
    "e57": {
      "a": "F5",
      "b": "F7",
      "status": "method",
      "label": "Struktur → Prüfung"
    },
    "e67": {
      "a": "F6",
      "b": "F7",
      "status": "method",
      "label": "Kontrolle → Prüfung"
    },
    "e54": {
      "a": "F5",
      "b": "F4",
      "status": "negative",
      "label": "Topologie ≠ Phase"
    }
  },
  "routes": {
    "all": {
      "kind": "overview",
      "label": "Gesamtkarte",
      "title": "Sieben Aperturen — verbunden, nicht gleichgesetzt",
      "summary": "Alle sieben funktionalen Aperturen und ihre deklarierten Verbindungstypen.",
      "chain": "F1 ↔ F2 → F3 → F4 ↔ F5 ⇢ F6 → F7",
      "nodes": [
        "F1",
        "F2",
        "F3",
        "F4",
        "F5",
        "F6",
        "F7"
      ],
      "edges": [
        "e12",
        "e13",
        "e23",
        "e34",
        "e35",
        "e45",
        "e46",
        "e56",
        "e17",
        "e27",
        "e37",
        "e47",
        "e57",
        "e67",
        "e54"
      ],
      "steps": [
        [
          "F",
          "Family = funktionale Apertur"
        ],
        [
          "R",
          "Linie = typisierte Relation zwischen Aperturen"
        ],
        [
          "E",
          "Status = exakt, empirisch, methodisch, offen oder negativ"
        ]
      ],
      "boundary": "Die Karte komprimiert Aperturen und Beziehungen, nicht den vollständigen Träger oder einen universellen Mechanismus."
    },
    "observe": {
      "kind": "route",
      "label": "Beobachten · T1–T4 / T8",
      "title": "Durch die Apertur zum bedingten Record",
      "summary": "Position, Zeitpunkt, Dauer, Medium, Skala, Kanal und Schwelle bestimmen mit, welche Außenform oder welches Signal als Record lesbar wird.",
      "chain": "TRÄGER → F1 APERTURE ↔ F2 CONDITIONS → RECORD → T8 LEDGER",
      "nodes": [
        "F1",
        "F2",
        "F7"
      ],
      "edges": [
        "e12",
        "e17",
        "e27"
      ],
      "stages": [
        "T1",
        "T2",
        "T3",
        "T4",
        "T8"
      ],
      "steps": [
        [
          "T1 · TRÄGER",
          "Geschehen oder Quelle deklarieren"
        ],
        [
          "T2 · APERTURE",
          "Position, Ausschnitt und Zugangsweg setzen"
        ],
        [
          "CONDITIONS",
          "Wann · Dauer · Medium · Skala · Kanal · Schwelle"
        ],
        [
          "T3 · RECORD",
          "Außenform, Projektion oder Signal festhalten"
        ],
        [
          "T4 · DIFFERENZ",
          "Records nur unter deklarierten Bedingungen vergleichen"
        ],
        [
          "T8 · LEDGER",
          "Retained / Lost / Introduced / Unresolved + Residuum"
        ]
      ],
      "boundary": "Eine gezeichnete Sphere oder ein erkanntes Objekt ist hier zunächst ein Aperture‑Record. Das vollständige Innere wird nicht gesehen; es wird – sofern zulässig – aus deklarierten Signalen und Modellen erschlossen."
    },
    "compare": {
      "kind": "route",
      "label": "Vergleichen · T3–T5",
      "title": "Die Relation wird selbst zum Objekt",
      "summary": "Mehrere Perspektiven bilden einen Binder, ein Raster oder eine prüfbare Differenz.",
      "chain": "F1 → F3 → F5 → F7",
      "nodes": [
        "F1",
        "F3",
        "F5",
        "F7"
      ],
      "edges": [
        "e13",
        "e35",
        "e17",
        "e37",
        "e57"
      ],
      "stages": [
        "T3",
        "T4",
        "T5"
      ],
      "steps": [
        [
          "T3",
          "Darstellungen lesen"
        ],
        [
          "T4",
          "Differenz sichtbar machen"
        ],
        [
          "T5",
          "Relation typisieren"
        ]
      ],
      "boundary": "Vergleich erzeugt keine perspektivlose Identität."
    },
    "intervene": {
      "kind": "route",
      "label": "Eingreifen · T5–T7",
      "title": "Beobachtung wird Teil des Verlaufs",
      "summary": "Ein deklarierter Operator greift ein; der nächste Zustand trägt die Spur.",
      "chain": "F3 → F4 ⇢ F6 → F7",
      "nodes": [
        "F3",
        "F4",
        "F6",
        "F7"
      ],
      "edges": [
        "e34",
        "e46",
        "e37",
        "e47",
        "e67"
      ],
      "stages": [
        "T5",
        "T6",
        "T7"
      ],
      "steps": [
        [
          "T5",
          "Relation deklarieren"
        ],
        [
          "T6",
          "Operation ausführen"
        ],
        [
          "T7",
          "zum Folgezustand zurückführen"
        ]
      ],
      "boundary": "Intervention ist Geschichte; ein Loop setzt den Weltzustand nicht zurück."
    },
    "return": {
      "kind": "route",
      "label": "Return · T7–T8",
      "title": "Rückbindung ohne identischen Anfang",
      "summary": "Provenienz, Residuum und Claim Ceiling schließen die Funktion, nicht die Geschichte.",
      "chain": "F1 · F3 · F5 · F7 ↺",
      "nodes": [
        "F1",
        "F3",
        "F5",
        "F7"
      ],
      "edges": [
        "e13",
        "e35",
        "e17",
        "e37",
        "e57"
      ],
      "stages": [
        "T7",
        "T8"
      ],
      "steps": [
        [
          "T7",
          "Folgezustand rückbinden"
        ],
        [
          "T8",
          "R/L/I/U + Residuum bilanzieren"
        ],
        [
          "STOP",
          "Grenze sichtbar halten"
        ]
      ],
      "boundary": "Return bedeutet nachvollziehbare Rückführung, nicht Wiederherstellung eines früheren Zustands."
    },
    "joints": {
      "kind": "focus",
      "label": "Fugen untersuchen",
      "title": "Grenzen und Verbindungen gemeinsam lesen",
      "summary": "Nicht die Felder oder Grenzen allein, sondern die typisierten Verbindungen zwischen begrenzten Feldern, Views und Records sind der Untersuchungsgegenstand.",
      "chain": "FIELD A → P⁻ · CHANNEL · P⁺ → HINGE / JOINT → FIELD B",
      "nodes": [
        "F1",
        "F2",
        "F3",
        "F4",
        "F5",
        "F6",
        "F7"
      ],
      "edges": [
        "e12",
        "e13",
        "e23",
        "e34",
        "e35",
        "e45",
        "e46",
        "e56",
        "e17",
        "e27",
        "e37",
        "e47",
        "e57",
        "e67",
        "e54"
      ],
      "stages": [
        "T2",
        "T3",
        "T4",
        "T5",
        "T8"
      ],
      "witnesses": [
        "A0 Boundary Graph · Pascal Joint",
        "Point Relation Binder",
        "Ghost Grid · Mode 2"
      ],
      "steps": [
        [
          "BOUNDARY",
          "trennt, schneidet oder setzt den Geltungsbereich"
        ],
        [
          "COUPLING",
          "koppelt unterscheidbare Prozesse unter Kontrolle"
        ],
        [
          "BINDING",
          "deklariert Regel, Binder, Richtung und Träger"
        ],
        [
          "STATUS",
          "klassifiziert die konkrete Relation: exakt, empirisch, methodisch, offen oder Nicht-Identität"
        ]
      ],
      "boundary": "Boundary, Coupling, Bonding und Binding sind hier Arbeitsbegriffe für verschiedene Fugenlesarten. Sie sind noch keine neue kanonische Taxonomie."
    },
    "ghost": {
      "kind": "instrument",
      "label": "Ghost Grid",
      "title": "Relationen bilden das Raster",
      "summary": "Zwei Schnitte werden über Punkte, Abstände, Winkel, Spuren und Returns vergleichbar.",
      "chain": "F1 → F2 → F5 ⇢ F6 → F7",
      "nodes": [
        "F1",
        "F2",
        "F5",
        "F6",
        "F7"
      ],
      "edges": [
        "e12",
        "e27",
        "e57",
        "e56",
        "e67",
        "e17"
      ],
      "stages": [
        "T2",
        "T3",
        "T4",
        "T5",
        "T7",
        "T8"
      ],
      "steps": [
        [
          "CUTS",
          "zwei deklarierte Perspektiven"
        ],
        [
          "GRID",
          "rekonstruierte Vergleichsfläche"
        ],
        [
          "TRACE",
          "Rest und Rückweg sichtbar"
        ]
      ],
      "boundary": "Das Raster ist nicht das Geschehen. Die F5→F6-Brücke bleibt offen."
    }
  },
  "stops": {
    "zeta": {
      "symbol": "ζ",
      "kicker": "SOURCE / FIELD READOUT",
      "title": "Woher kommt diese Rolle?",
      "text": "Lies Träger, Herkunft und den noch nicht geschnittenen Möglichkeitsraum der gewählten Family.",
      "suffix": "source / carrier / provenance",
      "retained": "Family‑Identität und Source‑Adresse",
      "lost": "Noch keine konkrete View",
      "introduced": "ζ als deklarierte Leseposition",
      "unresolved": "Welche Auswahl folgt?"
    },
    "theta": {
      "symbol": "θ",
      "kicker": "ORIENTATION / VIEW READOUT",
      "title": "Wie wird diese Rolle sichtbar?",
      "text": "Lies Schnitt, Phase, Projektion und Darstellungsoperator. Die View zeigt den Record unter einer deklarierten Orientierung.",
      "suffix": "cut / view / orientation",
      "retained": "Family‑Identität und gebundener Record",
      "lost": "Nicht dargestellte Eigenschaften des Source Field",
      "introduced": "Schnitt, Koordinaten und View‑Konvention",
      "unresolved": "Ist der View‑Operator invertierbar?"
    },
    "beta": {
      "symbol": "β",
      "kicker": "BOUNDARY / BINDING READOUT",
      "title": "Wie weit trägt diese Rolle?",
      "text": "Lies Fuge, Relationsstatus, Claim‑Grenze und Return‑Key. Erst hier wird festgelegt, was verbunden werden darf.",
      "suffix": "boundary / binding / return",
      "retained": "Family‑Identität, Herkunft und deklarierte Relation",
      "lost": "Alles außerhalb der Claim‑Grenze",
      "introduced": "Binder, Status und Return‑Bedingung",
      "unresolved": "Was bleibt offen oder nicht identisch?"
    }
  }
};
