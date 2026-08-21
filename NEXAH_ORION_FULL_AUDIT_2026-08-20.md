# NEXAH / ORION — Portfolio-, Architektur- und Anwendungs-Audit

**Auditstichtag:** 2026-08-20
**Modus:** read-only Bestandsrekonstruktion; diese neue Datei ist ein nicht-kanonischer Auditbericht.
**Primärer Portfolio-Owner:** 01 The EYE · Portfolio Owner / 00 Executive
**Verpflichtende Prüfinstanz:** 03 Framework & Library Steward / 10 NEXAH Core
**Human Authority:** Thomas

## Zuständigkeit und Auditgrenze

The EYE entscheidet über Portfolio, Reihenfolge, GO/HOLD/PARK/ARCHIVE und Outreach. Der Framework & Library Steward hat Framework, OLS, Kernel, Library/Living Atlas, Provenienz, Contracts und die Grenze zur ORION Product Authority geprüft. ORION Product Authority bleibt für ORION-Core, Certification und Produktinterfaces zuständig; Science Lab für Forschungsprotokoll und Evidenz; NEXAHEDRON/Experience für Darstellung und Human Gates. Meaning, Consent, Adoption, Entscheidung und endgültiger STOP verbleiben bei Thomas. Keine dieser Autoritäten wird durch diesen Bericht übertragen.

Untersucht wurden die aktiven Repositories Mission Control, NEXAH Core, ORION, Science Lab und NEXAHEDRON sowie lokale verschachtelte Checkouts und historische Repositories unter `Documents`, insbesondere `GitHub/NEXAH-CODEX`, `GitHub/Scarabaeus1033-System-v1.0`, `ARE.NA LIBRARY CLEANUP`, alte Experience-/Framework-Checkouts und Archiv-/Prototype-Bereiche. Abgeleitete Architekturvisuals dienten nur als Suchindex. Aussagen wurden gegen Markdown-Autoritäten, ADRs, Register, Manifeste, Tags, Code, Tests und Proofs geprüft.

Wichtige Snapshot-Grenze: NEXAH Core und NEXAHEDRON waren sauber; ORION war sauber, aber auf einem Review-Commit nach dem zertifizierten Commit; Mission Control und Science Lab enthielten bereits zahlreiche lokale, nicht diesem Audit zuzurechnende Änderungen bzw. untracked Artefakte. Vorhandensein im Arbeitsbaum ist daher nicht automatisch Release oder Adoption.

## Ergebnis 1 — Executive Reality Check

### Urteil

Im Ökosystem existiert eine reale, modellunabhängige Grundlage für **begrenzte strukturelle Orientierung**. Sie besteht aus einem kanonisch eingefrorenen Framework/OLS, einem ausführbaren experimentellen NEXAH-Kernel, einem tatsächlich implementierten und eng zertifizierten ORION-Strukturkern, einem governance- und evidenzstarken Science Lab sowie einer benutzbaren, aber begrenzten NEXAHEDRON-Experience.

Es existiert **noch kein vollständiges Forschungs- und Orientierungsprodukt** für beliebige Fragen und Dokumentkorpora. Insbesondere fehlen ein adoptierter Application Contract, allgemeiner Corpus-Ingest, semantische Claim/Evidence-Trennung, Unsicherheitsbewertung, ein implementiertes ORION Interface V1, freigegebene Runtime/API/MCP, Modelladapter und der integrierte Human-inspectable End-to-End-Pfad. Die Architektur darf deshalb weder als fertiges Produkt noch als reine Idee klassifiziert werden: sie ist eine Kombination aus `CANONICAL + IMPLEMENTED + TESTED` in engen Kernbereichen und `SPECIFIED/PROPOSED/PARTIAL` auf Produktebene.

### Tatsächlich vorhanden

- Framework 1.0 ist als Tag `framework-v1.0.0` auf Commit `87f438d…` kanonisch und released. „Frozen“ bindet diesen Quellstand, nicht den heutigen Branch, das ganze Ökosystem oder Production Readiness.
- OLS 1.0.0 ist eine veröffentlichte normative Markdown-Suite mit sieben normativen Dokumenten, einer informativen Anlage, Requirements/Test-IDs und Checksummen. Es ist keine nachgewiesene maschinenkonsumierte Conformance-Schicht.
- Kernel 0.7.0 besitzt CLI, State-Space-/Trajectory-Pipeline, typed Orientation Contracts, Evidence/Provenance/Uncertainty-Strukturen, Memory und Outcome Firewall. Er ist ein begrenzter experimenteller Kern, nicht der generische Dokumentforschungskern.
- ORION V1 Slices II–IV implementiert für bestätigtes Markdown: immutable structural representation, UNDERSTAND-Inventar, Summary/Statistics, deklarierte und strukturelle Relations, Navigation, Orientation Map, Expression, Conformance, Certification, Provenienz, byte-identischen Replay und terminalen Slice-STOP.
- NEXAHEDRON implementiert eine begrenzte Session, Human-Confirm-Gates, immutable Confirmed Material und Representation Handoff; die UI besitzt keine Bedeutungs- oder wissenschaftliche Autorität.
- Science Lab besitzt Protokolle, Register, Labreport-Schemata, positive/negative/limitierende Ergebnisformen und einen Research-to-Architecture-Adoption-Gate. Forschung wird nicht automatisch Produktfähigkeit.

### Übersehen oder unterschätzt

- ORION ist nicht nur Blueprint: sein eng begrenzter Core ist reale Software mit umfangreichen Proofs.
- Die Orientation-Translation-Piloten zu Photosynthese, Zellatmung und Mitose enthalten bereits explizite Source-/Support-/Unsupported-Klassifikation und sind näher am Forschungsorientierungs-Use-Case als die sichtbaren Chaos-Atlanten.
- NEXAHEDRON besitzt reale fail-closed Human Gates und Cross-Repository-Fingerprint-Prüfung.
- Science Lab und Outcome Firewall enthalten starke Mechanismen gegen negative-result loss und Research-to-Product-Drift.
- Supply Chain, Library/Living Atlas, Personal Orientation und Repository-Orientation-Piloten wurden in der sichtbaren Portfolioerzählung zu schwach gewichtet.

### Überschätzt

- „OLS Conformance“ ist derzeit überwiegend normativ spezifiziert, nicht als kanonische maschinenlesbare Suite durch Kernel/ORION konsumiert.
- „deterministic Kernel 0.7“ gilt nur für begrenzte Pfade; Monte-Carlo-Navigation ist call-order-/RNG-abhängig.
- „ORION Runtime“ und „Interface V1“ sind nicht adoptierte bzw. nicht implementierte Produktfähigkeiten.
- „Application 01“ bezeichnet in der aktuellen Roadmap einen **geplanten Fixed-Source Evidence-Bounded Reader Test**, nicht eine fertige ORION Research Session.
- Lunar-Force-/Cosmic-Time-Artefakte enthalten symbolische und spekulative Physiksprache, aber keinen reproduzierbaren Vergleich gegen ein anerkanntes Ephemeridenmodell.

### Portfolio-Spitzen

- **Stärkstes Produktpotenzial:** eine eng begrenzte ORION Research Session, weil echte Core-Komponenten wiederverwendbar sind. Status: `PARTIAL + REQUIRES EVIDENCE + REQUIRES OWNER DECISION`, nicht bestehendes Produkt.
- **Stärkste evidenzierte Forschungslinie:** IEEE Power Systems; sie besitzt Code, Testfälle und auch begrenzende/negative Validierung. EXP-00-R ist der stärkste aktuelle Replikationspfad, aber noch nicht ausgeführt.
- **Stärkstes kulturelles Partnerobjekt:** Rödelheim Observatory; ein begrenztes, transparent als schematisch gekennzeichnetes Orientierungs-/Ausstellungsobjekt, keine Ephemeride.
- **Nicht belegt:** externer Nutzwert, Produktionsbetrieb, allgemeine semantische Claim-Extraktion, wissenschaftliche Zertifizierung, LLM-Halluzinationsverhinderung, öffentliche Modelladapter und externe Neuheit.

## Ergebnis 2 — Evidence-backed Component Inventory

| Komponente | Owner | Repository/Pfad | Behauptung | Beobachteter Status / Evidenz | Hauptlücke | Reifegrad | Behandlung |
|---|---|---|---|---|---|---|---|
| Framework 1.0 | Framework Steward | `NEXAH/FRAMEWORK_RELEASE_CANDIDATE.md` | released/frozen | Tag, Commit und Scope exakt dokumentiert; Release schließt Production Readiness aus | heutiger Branch ist nicht der Freeze | `CANONICAL + RELEASED` | PRESERVE |
| OLS 1.0.0 | Framework Steward | `NEXAH/ORIENTATION_LANGUAGE/SPECIFICATION/RELEASES/OLS-RELEASE-1.0.0` | canonical/conformant | 7 normative + 1 informative Markdown-Datei, Manifest/Checksummen; OLS-5 definiert sechs Klassen | kein normatives JSON/YAML-Schema; kein belegter Softwarekonsum | `CANONICAL + RELEASED + SPECIFIED` | PRESERVE; CONFORMANCE EVIDENCE REQUIRED |
| Human Authority / STOP / Consent | Thomas; Framework Steward für Semantik | `NEXAH/GOVERNANCE/ECOSYSTEM_CONSTITUTION.md` | verbindliche Grenze | Meaning, Intention, Consent, Entscheidung, Fortsetzung/Abbruch menschlich reserviert | kein generischer technischer Consent-/STOP-Controller | `CANONICAL + PARTIAL` | DO NOT TRANSFER |
| Kernel 0.7.0 | Framework Steward | `NEXAH/nexah`, `pyproject.toml` | deterministic kernel | Paket/CLI/Adapter/Contracts real; Steward-Prüflauf 47 Tests bestanden | stochastic navigation; keine Full-OLS-Conformance/Corpus-Session | `IMPLEMENTED + TESTED + EXPERIMENTAL + PARTIAL` | MAINTAIN; use-case-bounded changes only |
| historischer Abstract-Interpretation-Kernel | Framework Steward | Core tag `v1.0.0` | stable/frozen | finite algebra/worklist vorhanden; Tag-, README- und Paketversion widersprechen sich | nicht aktueller Kernel 0.7 | `RELEASED + HISTORICAL + CONTRADICTED` | ARCHIVE AS LINEAGE |
| Evidence/Provenance/Uncertainty Contracts | Framework Steward | `nexah/orientation/evidence.py` | implemented | typed Objekte und Report-Pfade real | keine semantische Corpus-Extraktion | `IMPLEMENTED + TESTED + PARTIAL` | REUSE AS CONTRACT PATTERN |
| Outcome Firewall | Framework Steward | `nexah/orientation/outcome_firewall.py` | prevents false adoption | beobachtete Outcomes werden von Szenario/Computation getrennt; Memory-Update fail-closed | kein Research-Session-Gesamtgate | `IMPLEMENTED + TESTED` | REUSE, do not broaden silently |
| Library Registry | Framework/Library Steward | `NEXAH/LIBRARY/registry/registry.yaml`, `nexah/library/registry.py` | canonical library | Pilotregister, Validator, 10 Works/17 Concepts | Cleanup/offene noncanonical Teile | `CANONICAL + IMPLEMENTED + PARTIAL` | MAINTAIN |
| Living Atlas | Framework/Library Steward | `NEXAH/LIBRARY`, editorial dossiers | relations/atlas | explizite kuratierte Relationen mit Provenienzgrenzen | kein automatisches Relationssystem | `CANONICAL + IMPLEMENTED + PARTIAL` | CURATED ONLY |
| ORION Certified Core V1 | ORION Product Authority | `NEXAH-ORION/src/orion`, release baseline, tag `v1.0.0` | certified core | Slice-II–IV Proof 2026-08-20 erfolgreich; byte-identischer Replay, Provenienz, STOP | nur bestätigte strukturelle Quelle; keine Semantik/Runtime/App | `CANONICAL + IMPLEMENTED + TESTED + RELEASED` | REUSE WITHIN FROZEN SCOPE |
| ORION Certification Authority | ORION Product Authority | `docs/releases/ORION_V1_CERTIFIED_BASELINE.md` | certified | repository-interne artefaktgebundene Conformance-/Certification-Kette | keine externe oder wissenschaftliche Zertifizierung; nicht OLS Full Suite | `CANONICAL + BOUNDED` | LABEL PRECISELY |
| ORION Runtime 1.1 Candidate | ORION Product Authority | `src/orion_runtime`, `docs/reviews` | runtime/release candidate | Code real; aktueller Gesamtlauf: 554 Tests, 3 failures, 5 errors, 11 skipped; Reviews setzen `ADOPTED=NO` | Release identity, readiness, Security/Deploy, Adoption | `IMPLEMENTED + PARTIAL + CONTRADICTED + UNVERIFIED` | HOLD |
| ORION Interface V1 | ORION Product Authority | ADR 0009 / Architecture Ledger | approved | approved, ausdrücklich nicht implemented | Schema, Adapter, Entry Point, Conformance | `SPECIFIED` | REQUIRES OWNER DECISION |
| LLM-Adapter | ORION Product Authority | experimental `ollama_backend.py` | model-independent | Core ist ohne Modellabhängigkeit; Ollama experimentell/ausgeschlossen | keine ChatGPT/Gemini/Claude-Adapter | `EXPERIMENTAL + MISSING(public)` | PARK until application contract |
| NEXAHEDRON v1 source | Experience | `NEXAHEDRON`, tag/release `v1.0.0` | usable workspace | UI, bounded session, Confirm/Submit-Gates, adapter mapping und Alpha-Proofs vorhanden | kein persistenter Research Record/Result Viewer/Evidence binding | `IMPLEMENTED + TESTED + RELEASED + PARTIAL` | REUSE AS PRESENTATION |
| NEXAHEDRON↔ORION | Experience + ORION | adapter/tests | integrated | lokaler Test 3/4 bestanden; realer Pfad stoppt wegen erwartetem zertifiziertem Commit `d34fbb2…` vs Checkout `c62a8c…` | adoptierte Dependency-/Interface-Version | `PARTIAL + TESTED + FAIL-CLOSED` | RESOLVE BY OWNER, not by bypass |
| Science Lab | Science Lab | `SCIENCE_LAB`, Registries, lab packages | protocol/evidence/review | Governance, Schemas, executable experiments und negative-result handling real | kein generischer Research-Session-Runner | `CANONICAL + IMPLEMENTED + EXPERIMENTAL + PARTIAL` | USE AS VALIDATION PATH |
| Application Roadmap | The EYE + Science Lab | `NEXAH_APPLICATION_AND_USEFULNESS_ROADMAP_V1` | Application Program | explizit Planning-only; App01 Reader-Test selected but owner decisions/blockers offen | keine Adoption, kein Pilot, kein Product Contract | `SPECIFIED + PROPOSED` | OWNER DECISION |
| Mission Control Portfolio | The EYE | `NEXAH-Mission-Control/MISSION_CONTROL.md` | current priorities | Outreach/readiness priorisiert; breite Launch-/Product-Versprechen ausgeschlossen | Research-Session-Produkt nicht aktuell aktiviert | `CANONICAL + CONTRADICTED(with proposed sequence)` | RE-DECIDE, do not assume |
| Lunar Force / Cosmic Time | Human/Science Lab only after protocol | `GitHub/NEXAH-CODEX/SYSTEM_8_LUNAR_FORCE`, System 9 | alternative physics/time | überwiegend symbolische Hypothesen, Markdown/Visuals; keine reproduzierbare Ephemeridenrechnung | Referenzmodell, Code, Daten, Fehleranalyse | `HISTORICAL + PROPOSED + UNVERIFIED` | ARCHIVE CULTURALLY; PARK scientifically |

### Kernel-0.7-Capability-Matrix

| Capability | Status | Beobachtung |
|---|---|---|
| CLI / Python Entry Point | `IMPLEMENTED + TESTED` | `nexah = nexah.cli:main`; trajectory- und fixture-basierte Läufe |
| Trajectory preprocessing / windows / clustering | `IMPLEMENTED + TESTED + EXPERIMENTAL` | `nexah/core.py`; KMeans-/Transitionspipeline |
| Determinismus | `PARTIAL + CONTRADICTED` | fixe Inputs/Seeds reproduzierbar; Monte Carlo nutzt process-global RNG/Call Order |
| Typed application adapter | `IMPLEMENTED + TESTED` | v0.7 backend adapter und Domain Adapter Contract |
| Evidence / Provenance / Uncertainty | `IMPLEMENTED + TESTED + PARTIAL` | technisch erhalten in typed Orientation Reports; nicht semantisch aus Dokumenten extrahiert |
| Replay | `PARTIAL` | einzelne Workflows/Fixtures nachvollziehbar; kein allgemeiner Session-Replay-Contract |
| Conformance | `PARTIAL` | interne Contract-Tests; keine nachgewiesene OLS-Suite-Conformance |
| STOP | `PARTIAL` | Outcome Firewall und Boundary-STOP; kein universeller Human-STOP-Runtime-Mechanismus |
| Static typing | `PARTIAL` | mypy-Konfiguration vorhanden, Kern/CLI teilweise aus strikter Prüfung ausgenommen |
| General research corpus | `MISSING` | keine Problem-/Corpus-/Claim-Extraction-Pipeline |
| Application 01 support | `INTERFACE ONLY / PARTIAL` | Contracts als Muster; Hauptarbeit liegt in Application/ORION/Experience, nicht zwangsläufig Kernel |
| „Kernel 0.8“ | `PROPOSED + UNVERIFIED` | keine adoptierte Versionsgrundlage; Bezeichnung erst nach Contract-/Owner-Entscheid |

### ORION-Operationsmatrix

| Operation | Spec/Schema | Code | Test/Proof | Entry/Output | Urteil |
|---|---:|---:|---:|---:|---|
| Confirmed Source | ja | ja, begrenzt | ja | Fixture/Alpha-Proof | `IMPLEMENTED + TESTED` |
| Immutable Structural Representation | ja | ja | ja | canonical JSON/immutable artifact | `CANONICAL + IMPLEMENTED + TESTED` |
| UNDERSTAND Inventory | ja | ja | ja | Proof output | `IMPLEMENTED + TESTED` |
| Structural Summary / Statistics | ja | ja | ja | Proof output | `IMPLEMENTED + TESTED` |
| Certified Relations | ja | ja | ja | deklarierte/sequentielle/strukturelle Relations | `IMPLEMENTED + TESTED`, nicht semantische Claims |
| Structural Navigation | ja | ja | ja | Navigation artifact | `IMPLEMENTED + TESTED` |
| Orientation Map | ja | ja | ja | immutable map artifact | `IMPLEMENTED + TESTED` |
| Expression | ja | ja | ja | certified Slice-IV artifact | `IMPLEMENTED + TESTED` |
| Provenance / Replay / Core Conformance | ja | ja | ja | byte-identischer WP30-Proof | `CANONICAL + IMPLEMENTED + TESTED` innerhalb Scope |
| STOP | ja | ja | ja | `at_slice_iv_certified` | terminaler Pipeline-STOP, nicht Human-Consent-Controller |
| Corpus Ingest / semantic Claims / uncertainty | nein bzw. außerhalb | nein | nein | nein | `MISSING` |
| Runtime/API/CLI/MCP | Runtime-Code separat | teilweise | widersprüchlich | nicht adoptiert | `PARTIAL + HOLD` |
| ChatGPT/Gemini/Claude adapter | nein | nein | nein | nein | `MISSING` |

ORION kann einen vollständigen Durchlauf **nur innerhalb des zertifizierten Struktur-Slices** ausführen. Der am Auditstichtag erneut ausgeführte `slice_iv_certification_proof.py` endete erfolgreich mit `at_slice_iv_certified`, verifizierten Frozen-Hashes, unverändertem Input, Provenienz und byte-identischem Replay. Er führte ausdrücklich keine Runtime, App, Präsentation, Semantik oder Entscheidung aus.

## Ergebnis 3 — Application Inventory

| Name | Problem / Nutzer | Input → Operation → überprüfbarer Output | Implementierung / Evidenz | Reife / Abhängigkeit | Nutzenhypothese / Hauptlücke / Owner |
|---|---|---|---|---|---|
| Knowledge & Research Orientation / vorgeschlagene ORION Research Session | Forschende verlieren Quellen-, Claim-, Inferenz- und Grenzsicht | Frage+Korpus → strukturieren/orientieren → Report/Map/Replay | Core-Bausteine und manuelle Piloten, aber kein E2E | `PARTIAL + PROPOSED`; ORION, Interface, Experience, Lab | bessere Rückverfolgbarkeit; fehlt Corpus/Claim-Semantik+Integration; The EYE/ORION/Lab/Experience |
| bestehende NEXAH-APP-01 Fixed-Source Reader Orientation | Wirkung eines fixierten Evidenzpakets auf Leserorientierung | Photosynthese-Paket → kontrollierte Darstellung → Mess-/Reader-Record | vollständig geplant, nicht adoptiert/ausgeführt | `SPECIFIED + PROPOSED`; kein ORION nötig | messbarer Reader Effect; Owner/Privacy/Prereg/Surface fehlen; The EYE+Lab |
| Orientation Translation — Photosynthese/Respiration/Mitose | Quellenstruktur, Vergleiche, Grenzen sichtbar machen | fixierte Artikel → manuelle Relations-/Support-Klassifikation → Packet/Neighborhood/Gap report | umfangreiche Markdown-Piloten, Reflexionen, negative Grenzen | `IMPLEMENTED + EXPERIMENTAL`; keine unabhängige Replikation | Orientierung statt Faktenmenge; Nutzerwirkung ungemessen; Lab/Framework editorial |
| Supply Chain Orientation | Abhängigkeiten/Single points of failure orientieren | synthetisches JSON → Network Orientation → Report/Graph | Adapter, Fixture, Showcase Output | `IMPLEMENTED + TESTED + PROTOTYPE`; Kernel | schnellere Risikoübersicht; keine realen Daten/Validierung; Application Owner unbenannt + The EYE |
| IEEE Power Systems | Stabilitäts-/Regimeorientierung in Netzen | IEEE-Fälle/Simulation → state-space/field navigation → Reports/Plots | umfangreicher Code, Testfälle, Validation Layer, auch held-out miss | `IMPLEMENTED + TESTED + EXPERIMENTAL`; Kernel/domain validation | Struktur früher erkennen; keine operationale/kausale Validierung; Science Lab/domain owner |
| JANUS Operator | Apertur-, Übergangs- und Lead/Lag-Strukturen in Dynamik | Lorenz/Rössler-Simulationen → zahlreiche Operator-Skripte → Plots/Logs | großer Forschungsbestand, aber teils verschachtelter historischer Checkout | `EXPERIMENTAL + HISTORICAL + CONTRADICTED`; Lab adoption | Musterhypothesen; fehlt konsolidiertes Replikations-/Adoptionsurteil; Science Lab |
| Lorenz | Characterization und Navigation chaotischer Regime | simulierte Trajektorie → Kernel/Plots → states/transitions | mehrere aktive und archivierte Demos/Tests | `IMPLEMENTED + TESTED + EXPERIMENTAL/HISTORICAL`; Kernel | Kerncharakterisierung; keine Domain-Nutzerhypothese; Science Lab |
| Rössler / EXP-00-R | Replikation und Grenzprüfung | preregistrierte Parameter → Runner → Labreport | ausführbares Freeze-Paket/Register; Master Status: nicht ausgeführt, außer Human reopens | `SPECIFIED + IMPLEMENTED(infrastructure) + EXPERIMENTAL` | reproduzierbare Grenzaussage; Ergebnis fehlt; Science Lab + Thomas gate |
| Halvorsen | Cross-system-Generalisation | simulierte Trajektorie → Vergleich → Plots/Report | Scripts/README und Archaeology Audit | `IMPLEMENTED + EXPERIMENTAL`; Kernel | Transfergrenzen; unabhängige Validierung fehlt; Science Lab |
| Ecosystem / Resilience | Netzwerk-/Resilienzorientierung | synthetischer Food-Web-/Network-Datensatz → network orientation → Graph/Report | Fixtures/Demos, keine Feldvalidierung | `PROTOTYPE + EXPERIMENTAL`; Kernel | kritische Relationen; reale Daten/Nutzer fehlen; Application Owner required |
| Personal Orientation | menschlich kontrollierte Reorientierung | persönliche Frage/Material → bounded session → inspectable record | Mission-Control-Record/Concept; NEXAHEDRON-Mechanik anschlussfähig | `PROPOSED + PARTIAL`; Experience/Human authority | reflektierte Pfade; Consent/Privacy/validierte Wirkung fehlen; Thomas+Experience |
| Rödelheim Observatory | kulturelle/astronomische Perspektivorientierung | deklarierte Perioden/Phasen → Projektion/Mask/Visual → interaktives Objekt | HTML/Visuals, Formal Note, 1461 deterministische synthetische Samples | `IMPLEMENTED + EXPERIMENTAL + CULTURAL`; nicht Ephemeris | geteilte Perspektive; keine astronomische Genauigkeitsvalidierung; Cultural Owner+Lab |
| The Art of Orientation / Film-/Ausstellungsroute | NEXAH als kulturelle Praxis vermittelbar machen | kuratierte Works/Visuals → Ausstellung/Filmroute → Partnerobjekt | Konzept-, Outreach- und Asset-Dokumente | `PROPOSED + PARTIAL`; Library/Experience | Partnerdialog; Format/Owner/Publikumsnachweis fehlt; The EYE+Experience |
| Library / Living Atlas Experience | kuratierte Werkidentität und Relationen navigieren | Registry/Works → curated lookup/navigation → Reader paths | Registry, Validator, dossiers, public surfaces | `CANONICAL + IMPLEMENTED + PARTIAL`; Library | kohärente Orientierung; Cleanup und Nutzerevidenz fehlen; Library Steward |
| Repository Orientation Pilot A1/A2 | Repository-Drift/Navigation prüfen | Repo-Artefakte → Protokoll/Orientierung → Labreport | Science-Lab-Pilotpaket vorhanden | `EXPERIMENTAL + PARTIAL`; Lab | Auditierbarkeit; keine allgemeine Toolkette; Science Lab |
| Lunar Perspective / Lunar Force / Cosmic Time | alternative Bezugsrahmen/Zeitnarrative | Perioden, Symbolik, Tabellen/Visuals → spekulative Modelle → Markdown/Images | historischer Codex; kaum/kein ausführbarer Berechnungscode | `HISTORICAL + PROPOSED + UNVERIFIED`; separates Lab | mögliche Perspektivfrage; Referenzmodell/Reproduktion fehlen; Science Lab only after Human approval |

Portfolio-Drift ist belegt: frühe Anwendungen, Adapter, Supply-Chain-Fixtures und Research-Prototypen liegen weiterhin vor, während Mission Control aktuell vor allem bounded public readiness und Outreach priorisiert. Sie sind weder automatisch aktiv noch wertlos; sie benötigen eine explizite Portfolio-Disposition.

## Auditbereich H — Lunar Perspective und Zeitdifferenzen

Die historischen Lunar-Force-/Cosmic-Time-Dokumente formulieren unter anderem Moon-as-Valve-, Neutrino-, Resonanz-, „memory field“- und alternative 360-vs-365.25-Konstruktionen. Eine korrekte arithmetische Identität oder bekannte synodische/siderische Periode wird dabei häufig mit symbolischen Deutungen verbunden. Gefunden wurden Markdown, Bilder, einzelne Tabellen bekannter Orbitalwerte und Formeln, aber keine vollständige ausführbare Pipeline, keine Unsicherheitsrechnung und kein Vergleich mit JPL/SPICE/Skyfield/Astropy oder einem gleichwertigen Referenzmodell.

Damit sind keine belastbaren numerischen Abweichungen nachgewiesen. Es lässt sich derzeit nicht entscheiden, ob behauptete Differenzen aus Bezugsrahmen, Konvention, Korrektur oder Implementierungsfehler stammen; eine neue physikalische Hypothese ist nicht evidenziert. Originell ist primär die kulturell-editoriale Kombination von Beobachterperspektive, zyklischer Darstellung und Orientierungsmetapher. Synodische/siderische Perioden, Beobachtertransformationen, Phasen und Kalenderdifferenzen sind bekannte Gegenstände; Lunar-Force-/Neutrino-Aussagen bleiben spekulativ.

Die stärkste begrenzte Forschungsfrage wäre: **Kann eine vollständig deklarierte Beobachter-/Phasenprojektion für Berlin/Rödelheim über ein festes Zeitfenster Mondphase und Alt/Az gegen eine festgelegte Ephemeride innerhalb vorregistrierter Fehlergrenzen reproduzieren, und welche Abweichungen entstehen ausschließlich durch Referenzrahmen oder Konvention?** Das wäre eher eine reproduzierbare Transformations-/Provenienzstudie als eine neue Physikbehauptung.

Ein Lunar Time Lab Report benötigt mindestens: eingefrorene Frage; Zeitskala, Koordinatensystem und Standort; etablierte Referenzephemeride samt Version; ausführbaren Code; fixierte Inputdaten; Einheiten/Fehlerbudget; Tests an bekannten Ereignissen; Resultate einschließlich Null-/Negativresultat; unabhängige Review; und `NOT_ADOPTED` bis zur getrennten Human-/Owner-Entscheidung.

## Auditbereich I — Relevanz für KI-gestützte Forschung

| Problem | formal adressiert | technisch adressiert | Grenze |
|---|---|---|---|
| Quellen-/Claim-Vermischung | OLS, Provenienz, Orientation Translation | strukturelle Source refs; manuelle Support-Klassen | keine automatische semantische Claim-Trennung |
| nicht markierte Inferenz / Halluzination | no-invention/STOP-Grenzen | zertifizierter Core erzeugt nur erlaubte strukturelle Relationen | kontrolliert kein beliebiges LLM-Output |
| Annahmen-/Ziel-/Fragendrift | Manifeste, Decisions, Session bounds | Fingerprints, immutable artifacts, fail-closed adapters | kein integriertes Goal-drift-Modul |
| falsche Vollständigkeit / Sprachgeschlossenheit | Scope-/Exclusion-/Unsupported-Regeln | Outputs tragen Bounds; Piloten listen Lücken | kein semantischer Completeness-Checker |
| Verlust negativer Ergebnisse | Science-Lab-Constitution/Schema | Register/Labreport/Outcome Firewall | nicht in Research Session integriert |
| Autoritätsübergänge | Constitution/ADR/Adoption Gate | Confirm/Submit/STOP und Outcome Firewall teilweise | kein universeller Consent Controller |
| Reproduzierbarkeit / Provenienz | OLS/ORION contracts | Core Replay, hashes, immutable lineage | nicht für komplette externe Recherche |
| Research→Product-Drift | Adoption-Gate-Regeln | Statusledgers und Firewall | Durchsetzung repository-/prozessabhängig |

Gegenüber normalem Prompting, Quellenverwaltung, RAG, Notebooks, Agent Logs und Knowledge Graphs liegt die interne Eigenart in der **expliziten Trennung von Autoritäten, typisierten Zwischenartefakten, unveränderlicher Lineage, konformen Strukturtransformationen und terminalen STOPs**. Gegenüber diesen Kategorien ist jedoch noch kein vergleichender externer Neuheitsnachweis erbracht. Ohne Retrieval, Claim Extraction, Modelladapter und Nutzerbenchmark ist die Produktdifferenz nur architektonisch, nicht praktisch demonstriert.

Kleinste heute demonstrierbare Eigenleistung: bestätigtes bounded Markdown → immutable structural representation → nachweisbare Struktur/Relations/Navigation/Map/Expression → byte-identischer Proof → STOP. Die NEXAHEDRON-Integration erreicht gegenwärtig sicher den Confirmed-Material-/Representation-Handoff, nicht den vollständigen Result-Pfad.

Vertretbare Neuheitsbehauptung: „NEXAH/ORION kombiniert menschliche Autoritätsgrenzen mit provenance-expliciten, deterministischen strukturellen Transformationen in einem begrenzten, replaybaren Orientierungsprotokoll.“ Überzogen wären: „erstes modellunabhängiges Research OS“, „löst Halluzination“, „zertifiziert wissenschaftliche Wahrheit“, „production-ready Research Assistant“ oder „vollständige OLS-konforme Runtime“. Es wurde keine externe Markt-/Patent-/Prior-Art-Prüfung durchgeführt; dies ist eine interne Architekturprüfung.

## Ergebnis 4 — ORION Research Session Gap Map

Legende: 🟢 vorhanden und getestet · 🟡 teilweise · 🔵 spezifiziert · 🔴 fehlt · ⚪ historisch/nicht erforderlich.

| Zielschritt | Status | Vorhanden | Exakt fehlend | Owner |
|---|---|---|---|---|
| Human Question / Goal | 🟡 | NEXAHEDRON bounded state/Rest; Lab question records | adoptierter Application Request/Scope/Consent Contract | The EYE + Experience + Thomas |
| Bounded Corpus | 🟡 | Confirmed Material für einzelne lokale Quelle; fixed Photosynthesis packet | Multi-document manifest, normalization, source identity/licence, corpus freeze | ORION Product Authority + Library Steward |
| Representation | 🟢 eng / 🟡 produktweit | ORION immutable structural representation, tested | Corpus orchestration und adopted Interface binding | ORION Product Authority |
| Relations / Structure | 🟢 strukturell / 🟡 semantisch | certified structural/declared relations | Claim-, evidence-, contradiction-, inference- und uncertainty relation contracts | Framework Steward + ORION Product Authority |
| Orientation / Navigation | 🟢 strukturell | certified navigation/map/expression | Research-question-aware selection/profile; kein verstecktes Meaning | ORION Product Authority |
| Evidence / Provenance / Uncertainty | 🟡 | source refs, hashes, Kernel contracts, manual pilot classes | semantic binding, unsupported-claim detector, confidence/unknown policy | Framework Steward + Science Lab + ORION |
| Human-inspectable Result | 🟡 | NEXAHEDRON UI/Alpha artifacts | read-only ORION result adapter, provenance drill-down, report export | Experience + ORION |
| Replay / Session Record | 🟡 | Core byte replay; transient NEXAHEDRON session | end-to-end session manifest, durable privacy-bounded record and verifier | ORION + Experience + Science Lab |
| Human Decision / STOP | 🟡 / 🔵 | UI confirms; Core terminal STOP; canonical human authority | unified, adopted transition/consent gates across interface | Thomas + Experience + ORION; semantics Framework Steward |
| Runtime/API/MCP/model adapter | 🔴 für externes Produkt | historical/candidate Runtime; experimental Ollama | adopted least-privilege execution surface; model adapter only if needed | ORION Product Authority |

**End-to-End-Vertical-Slice:** nein. Der kleinste fehlende Satz ist nicht ein vollständiger Neubau, sondern: (1) adoptierter Application Contract und eindeutige App-ID; (2) bounded corpus manifest/ingest; (3) Claim/Evidence/Inference/Uncertainty-Vertrag; (4) Orchestrator über vorhandene ORION-Stufen; (5) read-only Result Adapter in NEXAHEDRON; (6) Session Record/Replay; (7) explizite Consent-/STOP-Transitions; (8) Lab-Benchmark-Protokoll. Ein LLM-Adapter ist für v0.1 nicht zwingend und sollte nicht vorgezogen werden.

## Ergebnis 5 — Minimal Vertical Slice

### Vorgeschlagener Scope

`ORION Research Session v0.1` darf nur nach Owner-Entscheidung aktiviert werden. Der Zusatz „Application 01“ kollidiert mit der bereits dokumentierten `NEXAH-APP-01 Fixed-Source Evidence-Bounded Reader Orientation`. The EYE/Thomas müssen entweder die bestehende ID beibehalten und den ORION-Slice anders benennen oder die Roadmap ausdrücklich versioniert ersetzen; stilles Umdeuten wäre Statusdrift.

Der kleinste Slice:

1. Mensch gibt eine Frage, Scope, STOP-Rechte und 1–5 lokale, bestätigte Markdown-/Textquellen frei.
2. Ein versioniertes Corpus Manifest fixiert Bytes, Hash, Herkunft, Lizenz-/Nutzungsstatus und Source IDs.
3. Ein enger, deklarierter Claim/Evidence Contract trennt wörtlich gestützte Claims, deklarierte Inferenz, Widerspruch, Unknown und Unsupported; v0.1 darf diese Zuordnung notfalls human-assisted statt LLM-automatisch erzeugen.
4. Vorhandene ORION-Representation-, Inventory-, Relation-, Navigation-, Map- und Expression-Stufen verarbeiten nur zulässige strukturelle Artefakte.
5. Ein Session Manifest bindet Input, Contracts, Code-/Release-IDs, Outputs, Ausschlüsse und jeden Human-Confirm-Schritt.
6. NEXAHEDRON zeigt read-only Quellen, Claims, Relations, Provenienz, Unsicherheit, unsupported items und Orientierungskarte; es interpretiert oder zertifiziert nicht.
7. Replay verifiziert Hashes und erzeugt für deterministische Stufen byte-identische Outputs; non-deterministische/human-assisted Schritte werden als Events mit Input/Entscheidung dokumentiert, nicht als deterministisch behauptet.
8. Jeder Übergang außerhalb freigegebener Scope-, Evidence- oder Authority-Grenzen endet fail-closed. Abschluss ist Human inspection/STOP, keine Entscheidung und keine wissenschaftliche Certification.

### Wiederverwendbar

ORIONs strukturierter Certified Core und Proof-Mechanik; NEXAHEDRON Confirmed Material/Representation Handoff/Authority UI; Kernel-Evidence-/Provenance-/Uncertainty-Verträge und Outcome Firewall als Muster; OLS als normative Grenzquelle; Science-Lab-Preregistration, Register und Labreport; Library Registry für kuratierte Identitäten.

### Nicht als vorhanden anrechnen

Corpus Ingest, semantische Claim Extraction, Full-OLS-Conformance, externe Runtime, MCP/API, Modelladapter, automatische Unsicherheitskalibrierung, wissenschaftliche Certification, dauerhafte User Accounts/Persistence und autonomer Agentenbetrieb.

### Abnahmekriterien v0.1

- mindestens zwei Quellen und sechs vorab gold-markierte Claims;
- 100 % Source/Claim-Referenzen auf Byte-/Abschnittsebene oder explizit `UNSUPPORTED`;
- keine undeclared inferred relation;
- vollständiges Session Manifest und Replay-Bericht;
- sichtbare Unknown/Contradiction/Unsupported-Klassen;
- alle Human-Transitions protokolliert; STOP immer verfügbar;
- keine Netzwerk-/Modellabhängigkeit für die erste Proof-Session;
- Science-Lab-Review und separate Product-Adoption-Entscheidung.

## Ergebnis 6 — Usefulness Benchmark V1

### Design

Vier Bedingungen auf derselben begrenzten Frage und demselben 3–5-Dokument-Korpus: (A) manuelle Orientierung, (B) normale Web-/Dokumentsuche, (C) gewöhnliche LLM-Zusammenfassung mit identischem Material, (D) NEXAH/ORION-orientierte Session. Reihenfolge randomisieren; Zeitlimit und Instruktionen fixieren; mindestens zwei Aufgaben; Goldstandard für Claims/Relations vorab durch unabhängige Reviewer; Nutzerfeedback erst nach objektiver Erhebung. Die LLM-Version, Prompt und Outputs müssen eingefroren werden. Websuche ist wegen Ergebnisdrift separat zu protokollieren.

| Metrik | Typ | Operationalisierung |
|---|---|---|
| Zeit bis brauchbare Orientierung | objektiv + definierter Schwellenwert | Sekunden bis vorab definierte Mindestantwort erreicht |
| Quellenrückverfolgbarkeit | objektiv | Anteil geprüfter Aussagen mit korrekter Source/Locator-Referenz |
| relevante Relationen gefunden/übersehen | objektiv | Precision/Recall gegen reviewer-adjudizierten Relationensatz |
| nicht unterstützte Behauptungen | objektiv | Anzahl/Rate Claims ohne ausreichende Evidenz |
| Unsicherheit sichtbar | objektiv | Anteil vorab markierter Unknown/Conflict-Fälle korrekt gekennzeichnet |
| Provenienzvollständigkeit | objektiv | Pflichtfelder vollständig und hash-/locator-verifizierbar |
| Reproduzierbarkeit | objektiv | Artefakt-/Hash-Gleichheit bzw. dokumentierte Event-Replay-Rate |
| menschliches Verständnis | subjektiv | kurzer validierter Verständnistest plus getrennte Selbsteinschätzung |
| Entscheidungssicherheit | subjektiv | Likert-Wert **und** Kalibrierung gegen Antwortkorrektheit; nicht als Wahrheit behandeln |
| kognitive Last / Nutzbarkeit | subjektiv | kurze standardisierte Skala + qualitative Gründe |

Primärer Nutzenendpunkt sollte Source-Traceability bei unveränderter oder besserer Relation-Recall sein, nicht bloß „gefällt besser“. Vorab definierte Failure Criteria: längere Zeit ohne Traceability-Gewinn; mehr unsupported Claims; versteckte Inferenz; unvollständiger Replay; Nutzer überschätzt Sicherheit. PASS ist Forschungsevidenz, nicht Product Capability oder Adoption.

## Ergebnis 7 — Portfolioentscheidung

| Position | Entscheidung | Begründung |
|---|---|---|
| ORION Research Session v0.1 | `REQUIRES OWNER DECISION + REQUIRES EVIDENCE` | stärkstes Produktpotenzial, reale Bausteine; aber ID-Konflikt, Contract/Corpus/Claim/UI fehlen |
| gezielter Kernel-Ausbau entlang Use Case | `HOLD` | Use Case ist primär ORION/Application/Experience; Kernel erst ändern, wenn ein getesteter Contract eine konkrete Lücke zeigt; „0.8“ nicht vorab setzen |
| NEXAHEDRON als inspizierbare Experience | `GO` innerhalb bestehender Authority Boundary | vorhandene UI/Gates wiederverwenden; zuerst Dependency-Adoption und read-only Result Adapter, keine Semantik im UI |
| Usefulness Benchmark | `GO` als Science-Lab-Protokoll nach App-ID-Entscheid | klein, falsifizierbar, misst den entscheidenden Nutzen; PASS bleibt Nicht-Adoption |
| Pilot mit realen Nutzern/eigenen Fragen | `HOLD` | erst nach v0.1-Abnahme, Privacy/Consent, Preregistration und Review |
| zweite Domain Application: Supply Chain | `PARK` | guter vorhandener Fixture, aber Produktfokus würde vor Nutzwertbeleg fragmentieren; danach bevorzugter Transferfall |
| begrenztes Lunar Time Lab | `PARK + REQUIRES EVIDENCE` | nur als getrennte Ephemeriden-/Bezugsrahmenstudie; keine Produktintegration/Physikbehauptung |
| bestehende Fixed-Source NEXAH-APP-01 | `REQUIRES OWNER DECISION` | nicht still verdrängen; entweder als Vorbenchmark nutzen oder versioniert abgrenzen |
| ORION Runtime 1.1/public deployment | `HOLD` | Current Review `ADOPTED=NO`, Release-/Readiness-Tests nicht grün |
| breiter Outreach/Produktversprechen | `HOLD` | Mission Control erlaubt bounded relationship readiness, nicht neues Produktversprechen |

Empfohlene Reihenfolge nach Freigabe: App-ID/Authority-Entscheid → Contract+Gold Corpus → offline Proof-Slice → NEXAHEDRON read-only Result → Benchmark → erst danach Real-User-Pilot → Supply-Chain-Transfer. Kein Kernel-0.8- oder Runtime-Projekt vor einer nachgewiesenen Lücke.

## Ergebnis 8 — Zuständigkeitsentscheidung

| Bereich | Zuständigkeit | Nicht übertragbar |
|---|---|---|
| Portfolio, Relevanz, Reihenfolge, Budget, Outreach | The EYE | technische Certification oder Human Consent |
| Framework 1.0, OLS-Semantik, Contracts, Conformance-Klassen, Library/Living Atlas, Framework↔ORION-Grenze | Framework & Library Steward | ORION Product Release, wissenschaftliche Wahrheit, Human Meaning |
| Forschungsfrage, Preregistration, Evidence, Review, Labreport, Negativresultat, Adoption-Empfehlung | Science Lab | Product Adoption, Framework-Änderung, Portfolioaktivierung |
| ORION Core, artefaktgebundene Certification, Interface, Runtime, Adapter, Release | ORION Product Authority | OLS neu definieren, Scientific Certification, Human Decision |
| bounded Session, Darstellung, Inspect/Confirm/Submit, read-only Result | NEXAHEDRON/Experience | Evidence erfinden, Meaning ableiten, ORION zertifizieren |
| Intention, Meaning, Consent, Adoption, endgültige Entscheidung und STOP; Aufhebung von EXP-00-R-Hold; App-ID-/Prioritätsfreigabe | Thomas | darf nicht aus PASS, Certification, UI-Klick oder Portfolioempfehlung automatisch abgeleitet werden |

Automatisch unzulässig: `Research → Adoption`, `PASS → Product Capability`, `Labreport → Canonical Architecture`, `Evidence → Authority`, `ORION Certification → scientific truth`, `Experience presentation → meaning`, `Framework freeze → ecosystem readiness`, `The EYE priority → Human consent`.

## Ergebnis 9 — Blind-Spot Report

1. **Kernel 0.7:** reale CLI/Contracts/Firewall, aber falsche pauschale Determinismus- und Generalitätsannahme.
2. **ORION als Software:** Slices II–IV und Proofs sind substanziell; Runtime/Product wurden mit dem Core vermischt.
3. **Application 01:** der Name ist bereits enger vergeben und bislang nur geplant; die neue Research Session wäre eine neue Portfolioentscheidung.
4. **KI-Forschungsorientierung:** Orientation-Translation-Piloten liefern bereits relevante manuelle Evidenz- und Gap-Muster.
5. **Science Lab:** Adoption Gate, Negativresultate und Driftkontrolle sind produktstrategisch zentral, nicht nur Governance-Dekoration.
6. **Supply Chain:** Adapter, synthetischer Datensatz und Showcase existieren; reale Validierung fehlt.
7. **frühere Application-Prototypen:** Lorenz/Rössler/Halvorsen/JANUS und Archive enthalten viel Code/Outputs, aber heterogene Autorität und teils widersprüchliche Versionen.
8. **Lunar Perspective:** kulturell reich und als begrenzte Transformationsfrage prüfbar; gegenwärtig keine neue physikalische Evidenz.
9. **NEXAHEDRON:** Human Gates und immutable handoff sind real; result-seitige ORION-Integration, Persistenz und Evidence binding fehlen.
10. **Adapter/Interfaces:** v0.7 Domain Adapter, NEXAHEDRON Request Mapping, historischer Gateway und experimenteller Ollama-Pfad existieren; kein adoptierter öffentlicher Model/API/MCP-Pfad.
11. **Library/Living Atlas:** maschinenvalidierbares Pilotregister und kuratierte Relationen sind wiederverwendbar, aber nicht automatische Wissensgraphfähigkeit.
12. **Entscheidungsgrenzen:** technische STOPs, Human STOP und Adoption STOP wurden in Statussprache teilweise vermengt.

## Test- und Verifikationsprotokoll

| Prüflauf | Ergebnis | Interpretation |
|---|---|---|
| Framework-Steward Kernel Characterization/Contract Suite | 47 passed, 1 warning | Kernfähigkeiten im begrenzten Scope bestätigt |
| ORION `slice_iv_certification_proof.py` | success; frozen hashes, input unchanged, provenance, byte replay, `at_slice_iv_certified` | Certified Core am aktuellen Checkout weiterhin exakt verifizierbar |
| ORION kompletter unittest discovery | 554 run; 3 failures, 5 errors, 11 skipped | Core-Mehrheit grün; 3 Runtime-Release-/Canary-Fails, 1 Corpus-Revision-Error; 4 HTTP-Errors durch Sandbox-Socketverbot. Kein grüner Gesamtstatus für Runtime |
| NEXAHEDRON gezielter Adapter/Alpha-Test | 3/4 pass | reale Gateway-Teststrecke stoppt korrekt an Commit-Pin-Mismatch; kein Bypass |
| erster NEXAHEDRON-Lauf ohne gesetzten ORION-Pfad | 12/17 pass | Default-Sibling-Pfad verweist nicht auf lokale aktive ORION-Lage; Konfigurations-/Dependency-Gap |

Die Socket-Errors sind Umgebungsrestriktionen und kein Nachweis eines HTTP-Codefehlers; die Release-Identity-/Canary-Fails und Corpus-Revision-Abweichung sind dagegen echte aktuelle Checkout-/Adoptionssignale. Testzahlen belegen den jeweils ausgeführten Scope, nicht Coverage, OLS-Conformance, Nutzwert oder Production Readiness.

## Primäre Evidenz

- [Framework Release Record](/Users/tho2020/Documents/NEXAH%20ECOSYSTEM/10%20NEXAH%20CORE/NEXAH/FRAMEWORK_RELEASE_CANDIDATE.md:3)
- [Framework Scope und Versionsautoritäten](/Users/tho2020/Documents/NEXAH%20ECOSYSTEM/10%20NEXAH%20CORE/NEXAH/RELEASES.md:9)
- [OLS Architektur: deskriptiv vs normativ](/Users/tho2020/Documents/NEXAH%20ECOSYSTEM/10%20NEXAH%20CORE/NEXAH/ORIENTATION_LANGUAGE/ARCHITECTURE.md:3)
- [OLS 1.0 Publication Summary](/Users/tho2020/Documents/NEXAH%20ECOSYSTEM/10%20NEXAH%20CORE/NEXAH/ORIENTATION_LANGUAGE/SPECIFICATION/RELEASES/OLS-RELEASE-1.0.0/PUBLICATION_SUMMARY.md:3)
- [OLS Conformance-Grenzen](/Users/tho2020/Documents/NEXAH%20ECOSYSTEM/10%20NEXAH%20CORE/NEXAH/ORIENTATION_LANGUAGE/SPECIFICATION/RELEASES/OLS-RELEASE-1.0.0/DOCUMENTS/OLS-5_CONFORMANCE_AND_TESTING_V1.0.md:338)
- [Ecosystem Constitution / Human Authority](/Users/tho2020/Documents/NEXAH%20ECOSYSTEM/10%20NEXAH%20CORE/NEXAH/GOVERNANCE/ECOSYSTEM_CONSTITUTION.md:80)
- [Kernel Baseline Status](/Users/tho2020/Documents/NEXAH%20ECOSYSTEM/10%20NEXAH%20CORE/NEXAH/nexah/docs/BASELINE_STATUS.md:1)
- [Kernel CLI/Version](/Users/tho2020/Documents/NEXAH%20ECOSYSTEM/10%20NEXAH%20CORE/NEXAH/pyproject.toml:5)
- [Evidence/Provenance Types](/Users/tho2020/Documents/NEXAH%20ECOSYSTEM/10%20NEXAH%20CORE/NEXAH/nexah/orientation/evidence.py:29)
- [Outcome Firewall](/Users/tho2020/Documents/NEXAH%20ECOSYSTEM/10%20NEXAH%20CORE/NEXAH/nexah/orientation/outcome_firewall.py:268)
- [ORION Certified Baseline](/Users/tho2020/Documents/NEXAH%20ECOSYSTEM/20%20ORION/NEXAH-ORION/docs/releases/ORION_V1_CERTIFIED_BASELINE.md:1)
- [ORION Master Architecture Adoption ADR](/Users/tho2020/Documents/NEXAH%20ECOSYSTEM/20%20ORION/NEXAH-ORION/docs/adr/0009-orion-master-architecture-adoption.md:53)
- [ORION Runtime Working-State Review](/Users/tho2020/Documents/NEXAH%20ECOSYSTEM/20%20ORION/NEXAH-ORION/docs/reviews/ORION_WORKING_STATE_REVIEW_2026-08-14.md:3)
- [NEXAHEDRON Status und Grenzen](/Users/tho2020/Documents/NEXAH%20ECOSYSTEM/40%20EXPERIENCE%20PRODUCTION/NEXAHEDRON/README.md:1)
- [NEXAHEDRON Authority Boundaries](/Users/tho2020/Documents/NEXAH%20ECOSYSTEM/40%20EXPERIENCE%20PRODUCTION/NEXAHEDRON/docs/architecture/AUTHORITY_BOUNDARIES.md:1)
- [Application Roadmap Scope/Freeze](/Users/tho2020/Documents/NEXAH%20ECOSYSTEM/30%20SCIENCE%20LAB/NEXAH-Science-Lab/NEXAH_APPLICATION_AND_USEFULNESS_ROADMAP_V1/00_SCOPE_AND_FREEZE.md:1)
- [Application Roadmap Final Report](/Users/tho2020/Documents/NEXAH%20ECOSYSTEM/30%20SCIENCE%20LAB/NEXAH-Science-Lab/NEXAH_APPLICATION_AND_USEFULNESS_ROADMAP_V1/FINAL_APPLICATION_AND_USEFULNESS_ROADMAP_REPORT.md:8)
- [Science Lab Master Status](/Users/tho2020/Documents/NEXAH%20ECOSYSTEM/30%20SCIENCE%20LAB/NEXAH-Science-Lab/SCIENCE_LAB_MASTER_STATUS.md:1)
- [Research-to-Architecture Adoption Gate](/Users/tho2020/Documents/NEXAH%20ECOSYSTEM/30%20SCIENCE%20LAB/NEXAH-Science-Lab/ORION_MASTER_ARCHITECTURE_BLUEPRINT_PHASE_2_OWNER_ADOPTION/13_RESEARCH_TO_ARCHITECTURE_ADOPTION_GATE.md:1)
- [Rödelheim Formal Orientation Note](/Users/tho2020/Documents/NEXAH%20ECOSYSTEM/00%20EXECUTIVE/NEXAH-Mission-Control/ROEDELHEIM_OBSERVATORY_BUNDLE/ROEDELHEIM_OBSERVATORY_FORMAL_ORIENTATION_NOTE.md:331)
- [historische Lunar Valve Hypothese](/Users/tho2020/Documents/GitHub/NEXAH-CODEX/SYSTEM_8_LUNAR_FORCE/TEHTHY_THE_SECRET_THREAD_OF_THE_MOONS/Moon_Phase_Valve_Logic.md:5)
- [Mission Control Priority/Not-Now Boundary](/Users/tho2020/Documents/NEXAH%20ECOSYSTEM/00%20EXECUTIVE/NEXAH-Mission-Control/MISSION_CONTROL.md:117)

## Konsolidierter Freigabepunkt

Die technische Grundlage rechtfertigt einen **Owner-Entscheid über einen begrenzten Proof-Slice**, nicht die Behauptung eines bestehenden Produkts. Der nächste Freigabepunkt lautet daher:

> Entscheiden, ob eine klar benannte, von der bestehenden NEXAH-APP-01 abgegrenzte `ORION Research Session v0.1 — Knowledge and Research Orientation` aktiviert wird; dabei ausschließlich die in diesem Audit belegten Core-, Contract-, Lab- und Experience-Komponenten wiederverwenden und jede Erweiterung separat autorisieren.

Votum Framework & Library Steward: `REQUIRES EVIDENCE + REQUIRES OWNER DECISION`.
Portfolio-Votum The EYE aus der Evidenz: **primäres Produktpotenzial bestätigen, Aktivierung noch nicht automatisch freigeben**.
Finale Autorität für App-Identität, Consent, Adoption und GO: Thomas.
