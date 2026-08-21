# NEXAH Ecosystem Decision Candidates — Closure Sweep

**Datum:** 2026-08-20
**Rolle:** `01 The EYE · Portfolio Owner_00 Executive · Richtung, Grenzen, Prioritäten`
**Status:** `NON_CANONICAL_WORKING_REGISTER`
**Wirkung:** keine Adoption, keine Aktivierung, keine Tickets, keine Implementierung, keine kanonische Änderung

## 1. Decision Candidate Register

### Scope und Kontrollregel

Der Sweep erfasste die fünf aktiven Ecosystem-Repositories, verschachtelte lokale Checkouts sowie relevante Alt-/Archiv-Repositories unter `Documents`. Die Keyword-Suche fand relevante Marker in 95 Mission-Control-, 1.099 Core-, 181 ORION-, 835 Science-Lab-, 93 NEXAHEDRON-, 141 Are.na-Cleanup- und 171 historischen Codex-/Scarabaeus-Dateien. Diese Rohfunde sind **keine 2.615 Entscheidungen**: Testnamen, historische Next Steps, bereits geschlossene Reparaturlinien und redaktionelle Queue-Einträge wurden gegen aktuelle Status- und Autoritätsdateien dedupliziert.

Repository-Aliase:

- `MC` — `00 EXECUTIVE/NEXAH-Mission-Control`
- `CORE` — `10 NEXAH CORE/NEXAH`
- `ORION` — `20 ORION/NEXAH-ORION`
- `LAB` — `30 SCIENCE LAB/NEXAH-Science-Lab`
- `HEX` — `40 EXPERIENCE PRODUCTION/NEXAHEDRON`
- `ARENA` — `ARE.NA LIBRARY CLEANUP`
- `CODEX-ARCHIVE` — `GitHub/NEXAH-CODEX`

### A. Befund-, Evidenz- und Widerspruchsregister

| ID | Titel | Typ | Ursprung | Befund | Evidenz | Widerspruch |
|---|---|---|---|---|---|---|
| EYE-CAND-001 | Verbindliche Identität und Fortbestand von `NEXAH-APP-01` | `PORTFOLIO_DECISION` | `LAB/NEXAH_APPLICATION_AND_USEFULNESS_ROADMAP_V1/FINAL...`; `LAB/NEXAH_APPLICATION_PHASE_1/FINAL...` | Zwei nicht adoptierte Pakete beanspruchen dieselbe erste Application-Identität: Photosynthese-Reader-Test und IEEE Benchmark Replay. | Reader: Roadmap 2026-08-11, D-01 offen; IEEE: Phase-1-Report 2026-08-13, `PROPOSED / NOT_ADOPTED`, 19/19 ausgewählte Tests. | Beide heißen Application 01/001; kein Thomas-Entscheid priorisiert oder supersediert einen davon. |
| EYE-CAND-002 | Identität oder Nichtaktivierung der ORION Research Session | `PORTFOLIO_DECISION` | `LAB/NEXAH_ORION_FULL_AUDIT_2026-08-20.md` | Audit bestätigt Produktpotenzial, aber keine bestehende Application-ID oder Adoption. | ORION Core/Proofs real; Corpus-, Claim-/Evidence-, Interface- und Resultpfad fehlen. | Audit-Empfehlung kann als bestehendes Produkt oder als neue `Application 01` missverstanden werden. |
| EYE-CAND-003 | Kontrollstatus von ORION Runtime 1.1 | `PRODUCT_DECISION` | `ORION/docs/reviews/ORION_WORKING_STATE_REVIEW_2026-08-14.md`; Runtime Release Decision/Certification; `MC/PUBLISHING/PUBLISHING_QUEUE.md#PR-005` | Runtime-Code ist funktional teilweise vorhanden, aber nicht adoptiert und nicht release-ready. | Current review: `RUNTIME_V1_1_ADOPTED=NO`, release-identity fails; Auditlauf 554 Tests, 3 failures, 5 errors, 11 skips; Linux/Deploy nicht verifiziert. | Release-/Certification-Artefakte klingen positiv, aktuelle Kontrollrecords sagen `NOT_ADOPTED/BLOCKED`. |
| EYE-CAND-004 | Behandlung des ORION/NEXAHEDRON Commit-Pin-Konflikts | `ARCHITECTURE_DECISION` | `HEX/docs/upstream/orion-v1/SOURCE.yaml`; `HEX/scripts/verify-orion-dependency.mjs`; App-Phase-1/Audit | HEX erwartet `d34fbb2…`; aktiver ORION-Review-Checkout steht auf `c62a8c…`; Integration stoppt fail-closed. | Gezielter Test 3/4; Failure exakt `revision mismatch`; zertifizierter Slice-IV-Proof am ORION-Checkout grün. | Ältere Berichte nennen zusätzlich `d023b966…` als promoted main; Review-HEAD darf nicht still als Releasepin gelten. |
| EYE-CAND-005 | Aktivierung, Hold oder Park des nächsten Vertical Slice | `PORTFOLIO_DECISION` | App-Roadmaps, Audit, `MC/MISSION_CONTROL.md` | Drei konkurrierende Wege: enger Reader-H1-Lock, IEEE-MUD, ORION Research Session Proof. Aktuelle MC-P1–P3 erlauben kein stilles neues Produktprogramm. | Reader ist kleinster Nutzwerttest; IEEE hat stärkste vorhandene Anwendungskette; ORION hat stärkstes Produktpotenzial, aber größte Integrationslücke. | `APPLICATION_*_READY` ist Planungsstatus, keine Adoption; MC schützt Fokus vor neuen Produktversprechen. |
| EYE-CAND-006 | Governancepaket für den Fixed-Source Reader Study | `RESEARCH_DECISION` | `LAB/NEXAH_APPLICATION_AND_USEFULNESS_ROADMAP_V1/10_OWNER_DECISIONS_AND_BLOCKERS.md` D-02–D-06 | Privacy/Consent, Reviewer/Scorer, HEX-Home, Benchmarkdefaults und lokaler Pilot sind offen. | Fünf echte Blocker, kein target-reader exposure autorisiert. | Roadmap ist „technically actionable“, aber ohne Owner/Privacy/Review nicht ausführbar. |
| EYE-CAND-007 | Usefulness Benchmark und Real-User-Pilot | `RESEARCH_DECISION` | Audit Ergebnis 6/7; App Roadmap | Benchmark ist spezifiziert, aber noch weder preregistriert noch ausgeführt; Real-User-Pilot wäre ein späterer Gate. | Objektive Metriken und Failure Criteria liegen vor; keine Nutzerevidenz existiert. | Ein grüner Softwaretest könnte fälschlich als Usefulness-PASS behandelt werden. |
| EYE-CAND-008 | Fortführung des IEEE Replay/MUD als eigene Application | `PRODUCT_DECISION` | `LAB/NEXAH_APPLICATION_PHASE_1`; Post-Level-1C Discovery | Vollständige Berechnungskette und negativer Evidenzbestand sind stark, aber Application-ID und Implementierungshome nicht adoptiert. | 19/19 ausgewählte Tests; konkrete G1/G2-Lücken; `NOT_ADOPTED`. | Kollision mit Reader-`APP-01`; „READY_TO_BUILD“ ist kein Coding-Auftrag. |
| EYE-CAND-009 | Zweite Domain Application: Supply Chain oder IEEE | `PORTFOLIO_DECISION` | Audit Application Inventory; Core Supply-Chain Showcase; IEEE reports | Supply Chain hat synthetischen Showcase; IEEE hat stärkere Evidenz. Eine zweite Domain vor erstem Nutzwertbeleg fragmentiert Fokus. | Supply Chain Fixture/Adapter; IEEE Validation/negative results. | „vorhandener Code“ wird teils als aktive Application gelesen. |
| EYE-CAND-010 | ORION↔NEXAH Interface V1 Implementierungsauftrag | `IMPLEMENTATION_TASK` | `ORION/docs/adr/0009...` OA-05; `LAB/ORION_NEXAH_INTERFACE_V1_OWNER_REVIEW_FREEZE`; App Roadmap | Interface V1 ist `APPROVED_NOT_IMPLEMENTED`; Rollen, Package-Home, Adapter und Conformance fehlen. | ADR trennt Interface V1 von Legacy Public Contract/Gateway. | „approved“ wird in Roadmaps teils wie vorhandene Schnittstelle verwendet. |
| EYE-CAND-011 | Maschinenlesbare OLS-Conformance | `IMPLEMENTATION_TASK` | `CORE/ORIENTATION_LANGUAGE/.../OLS-RELEASE-1.0.0`; Audit | OLS ist normativ veröffentlicht, aber kein kanonischer Schemaexport oder belegter Kernel-/ORION-Konsum existiert. | OLS-5 prose conformance; keine OLS IDs in Softwaretests. | Framework-/OLS-Release wird stellenweise als technische Conformance gelesen. |
| EYE-CAND-012 | Verwendung der Bezeichnung „Kernel 0.8“ | `ARCHITECTURE_DECISION` | Audit; `CORE/nexah/docs/BASELINE_STATUS.md` | Keine adoptierte 0.8-Spezifikation oder Releasegrundlage. | Kernel 0.7 real, aber begrenzt; Use-Case-Lücke noch nicht einem Kernelchange zugeordnet. | plausible Next-Version-Sprache könnte unautorisiert Roadmapstatus erzeugen. |
| EYE-CAND-013 | Scope und Gate eines öffentlichen NEXAHEDRON Alpha | `PRODUCT_DECISION` | `HEX/NEXAHEDRON_RELEASE_READINESS_REPORT.md`; Alpha Execution Roadmap | Source v1 ist released, vollständiger öffentlicher Understand-Pfad aber durch Runtime, Evidence, Clarification, Privacy/Operations blockiert. | Local build/tests teilweise stark; public smoke/hosted matrix und complete journey fehlen. | ältere „live path/public alpha“-Sprache kollidiert mit aktuellen Blockern und bounded source-release scope. |
| EYE-CAND-014 | Bereinigung supersedierter HEX Release-/Readiness-Aussagen | `MAINTENANCE_TASK` | `HEX/docs/releases/*`, README, V1 Source Release | Einige ältere Completion Reports behaupten fehlendes Repo/Tag, das inzwischen existiert; andere Limitierungen bleiben gültig. | `NEXAHEDRON_V1_SOURCE_RELEASE.md`, tag `v1.0.0`. | zeitliche Statusdokumente ohne eindeutige Prospective-Supersession erzeugen Drift. |
| EYE-CAND-015 | Privates dauerhaftes Storage-Modell für Lab-Daten | `MAINTENANCE_TASK` | `LAB/LAB_DESK/CURRENT_STATE.md`; `CLEANUP_QUEUE.md`; `MC/OPERATIONS/REPOSITORY_HYGIENE_DECISION_GATE...` | Early-Warning- und ORION-Datenartefakte sind lokal deterministisch gepackt; Upload/Deletion nicht autorisiert. | 950.5 MiB tar.zst und 11.2 MiB ORION artifact reproduziert; aktive Gate-Formel vorhanden. | „cleanup complete“ wäre falsch; logische Disposition ist abgeschlossen, durable storage nicht. |
| EYE-CAND-016 | Reopen oder weiterer Hold von EXP-00-R | `RESEARCH_DECISION` | `LAB/SCIENCE_LAB_MASTER_STATUS.md` | Infrastruktur geschlossen; registrierte Evidence, Experiment, P1–P5 und Labreport nicht ausgeführt. Structure Freeze blockiert Aktivierung. | Producer R1/Generator R2 Reviews PASS; exakter Python 3.12.13 Runtime-Gate aktuell nicht erfüllt. | „ready for authorization recheck“ ist weder Reopen noch Resultat. |
| EYE-CAND-017 | Disposition sekundärer Research-Linien | `RESEARCH_DECISION` | Lab Master Status: T02, optical-inertial metrology, EXP-T01, REP-01 | Vier getrennte Linien besitzen spezifische Holds/Parks, aber keine aktive Lab Admission. | T02 externe Gates; metrology `EXTERNAL_REVIEW`; EXP-T01 `SCIENCE_LAB_NOT_ADOPTED`; REP-01 nach EXP-00-R. | historische Next Steps können wie aktive Pipeline wirken. |
| EYE-CAND-018 | Publication Gate für Translation Fidelity RC1 | `PUBLICATION_DECISION` | `MC/PUBLISHING/PUBLISHING_QUEUE.md#PR-007`; Lab final owner publication gate | Publication candidate, aber Authorship/Citation, License und Study-2 replay divergence offen. | Study 1/3 PASS, Study 2 hash mismatch, portable replay blocked. | wissenschaftliche Erhaltung ist nicht Publikationsfreigabe; ältere RC1-Assembly ist teilweise superseded. |
| EYE-CAND-019 | Remote-Preservation des ORION Review-Branches | `MAINTENANCE_TASK` | `MC/OPERATIONS/REPOSITORY_HYGIENE_DECISION_GATE...` D-OPS004-01 | Drei lokale Preservation-Commits sind sauber getrennt; exakter großer Push wurde wegen fehlender Payload-Freigabe gestoppt. | Credential scan begrenzt; keine Vollprüfung jeder Zeile; kein merge/main/adoption. | Remote-Durability könnte als Product Adoption missverstanden werden. |
| EYE-CAND-020 | Dünne Asset-Grenze von Mission Control | `MAINTENANCE_TASK` | D-OPS004-03 | Project binaries, Research drafts und Experience assets liegen teilweise im Control Surface. | klare Zielrollen und hash/provenance-first Regel vorhanden. | Aufräumen darf keine Ownership/Publication/Deletion entscheiden. |
| EYE-CAND-021 | Nächste Track-A-Outreach-Aktion | `OUTREACH_DECISION` | `MC/DECISION_QUEUE.md` Q-001; D-OPS004-04; Mission P1 | Vier 7-August-Events sind noch nicht durable reconciled; neue Aktion wäre nicht evidenzbasiert. | Mission Control P1 und No-unprompted-follow-up boundary. | Q-001 offen, während neuere Operations-Empfehlung bereits „no new action until MC-001“ sagt. |
| EYE-CAND-022 | Bounded Correction oder No Change für öffentliche Entry-Surfaces | `PUBLICATION_DECISION` | `MC/DECISION_QUEUE.md` Q-002; M-WEB01 | Eine First-time-visitor-Beobachtung soll genau eine Korrektur oder `NO CHANGE` auslösen. | live surfaces beobachtet; keine automatische correction authority. | „live“ wird mit „reviewed/correct“ verwechselt. |
| EYE-CAND-023 | HAWIH: Preservation oder neuer Editorial Pass | `PORTFOLIO_DECISION` | `MC/DECISION_QUEUE.md` Q-003; D-003; D-OPS004-04 | Legacy embedded project home ist `DO NOT EXPAND`; nächste autorisierte Stufe offen. | D-003 schützt Home; Operations empfiehlt preservation only. | aktiver Mission-Status kann wie Editorial-Authorization wirken. |
| EYE-CAND-024 | Rödelheim-II-Ordner: Duplicate, bestehender Home oder separates Paket | `ARCHIVE_CLASSIFICATION` | `MC/DECISION_QUEUE.md` Q-005 | Identität des erhaltenen Ordners ist ungeklärt; kein Transfer autorisiert. | bestehender Rödelheim Bundle/Home; comparison-before-transfer empfohlen. | Ähnlicher Name/Material ist keine Identität. |
| EYE-CAND-025 | Rödelheim Observatory Experience: Implementierung/Publikation | `PUBLICATION_DECISION` | `MC/PUBLISHING/PUBLISHING_QUEUE.md#PR-008` | Als Experience-Backlog akzeptiert; Implementation und Publication nicht autorisiert. | acht lokale Stufen, bounded claims, Are.na beobachtet; Manifest/Rights/A11y/Deployment offen. | Backlog acceptance könnte als GO gelesen werden. |
| EYE-CAND-026 | Intake-/Handoff-Klassifikation HP-006–HP-010, Q-006–Q-009 und B_J_M | `ARCHIVE_CLASSIFICATION` | `MC/INTAKE/.../HANDOFF_PENDING_DECISION_QUEUE.md`; `DECISION_QUEUE.md`; M-INC01 | Mehrere visuelle/Library/Research-Pakete benötigen menschliche Identität und Zielhome; die physischen Moves sind nicht freigegeben. | Package counts und bestehende destination candidates vorhanden. | einzelne Qs und HPs überlappen; Post-ledger arrivals werden doppelt geführt. |
| EYE-CAND-027 | Retention oder Entfernung der drei HP-003-Aliase | `MAINTENANCE_TASK` | `MC/DECISION_QUEUE.md` Q-011 | Byte-identische Aliase werden gehalten; retained-source hash recheck und Disposition fehlen. | D-011/D-012 schließen Handoff, nicht Aliasentscheidung. | closed HP-003 könnte fälschlich Q-011 schließen. |
| EYE-CAND-028 | Library Classification, Reader Journeys und Are.na Cleanup Backlog | `MAINTENANCE_TASK` | `CORE/LIBRARY/review`; `ARENA/full_library_classification.yaml`; manual cleanup queues | Dutzende human-decision/pending-Einträge und 16 konkrete cleanup actions existieren. | Pilot Registry/Validator; Reader reviews; explicit pending states. | Alt-Cleanup-Repo und Core enthalten überlappende Kopien; Pending ist keine Portfolioaktivierung. |
| EYE-CAND-029 | Historische Codex-/Prototype-„Active/Future Work“-Ansprüche | `ARCHIVE_CLASSIFICATION` | `CODEX-ARCHIVE/README.md`; nested System 8/9 READMEs; Core archives/ORION nested checkouts | Top-Level ist `Frozen (2025) · Structural Archive`, nested Dokumente nennen sich weiter active/fully integrated/future work. | Audit fand keine heutige Adoption; Lunar code/evidence unzureichend. | nested Selbststatus kollidiert mit controlling archive status. |
| EYE-CAND-030 | LYRA, LUCY, SIRIUS und historische Runtime-/Gateway-Familien | `ARCHITECTURE_DECISION` | ORION ADR 0009; App Roadmap; architecture ledgers | LYRA inactive, LUCY architecture-only, SIRIUS unresolved, ältere Runtime/Gateway historical/separately governed. | aktuelle ADR/ledgers grenzen sie aus. | ältere Blueprints/READMEs können Product-Aktivität suggerieren. |
| EYE-CAND-031 | Mission-Control-P1–P3 operativ schließen | `IMPLEMENTATION_TASK` | `MC/MISSION_CONTROL.md` 117–152 | Relationship reconciliation, citable EXP-00 bundle und 30-minute route sind bereits aktuelle priorisierte Outcomes. | Owner-approved current compass; exact Done-conditions vorhanden. | zusätzliche Produktarbeit könnte WIP-Limit umgehen. |
| EYE-CAND-032 | Stabile deployed NEXAH-Experience Release Identity | `PUBLICATION_DECISION` | `MC/PUBLISHING/PUBLISHING_QUEUE.md#PR-006` | Live deployment beobachtet, exakte Source-to-live identity nicht attestiert. | commit/artifact/deployment/live chain als Closure definiert. | „live“ wird mit released/reproducible verwechselt. |
| EYE-CAND-033 | Begrenztes Lunar Time Lab | `RESEARCH_DECISION` | Audit Lunar Section; historical System 8/9; Rödelheim Formal Note | Eine referenzmodellgebundene Studie ist formulierbar; gegenwärtig keine numerische Abweichung oder neue Physik belegt. | kein JPL/SPICE/Skyfield-Vergleich, keine ausführbare vollständige Rechnung. | kulturelle Originalität und physikalische Evidenz werden in Altmaterial vermischt. |

### B. Optionen, Empfehlung und Closure

| ID | Optionen (max. 3; empfohlen zuerst) | Empfehlung und konkrete Konsequenz | Owner | Human Decision | Dringlichkeit | Blockiert | Vorgeschlagener Status | Closure Condition |
|---|---|---|---|---|---|---|---|---|
| 001 | **A Reader bleibt `NEXAH-APP-01`, IEEE wird unnummerierter Candidate**; B IEEE übernimmt APP-01, Reader superseded; C beide ohne Nummer parken | **A:** schließt Namenskollision ohne Aktivierung und bewahrt älteren exakten Namen. B priorisiert technische Reife; C vermeidet Priorität, lässt aber App-ID frei. | The EYE / Thomas | ja | NOW | 002, 005, 008 | `DECIDE_NOW` | eine Decision nennt genau eine APP-01-Identität, Status und Disposition des anderen Pakets. |
| 002 | **A descriptive ORION-RS-Bezeichnung ohne Application-ID, `NOT_ACTIVATED`**; B neue separate App-ID; C Candidate schließen | **A:** bewahrt Produktpotenzial ohne Scheinautorität. B erlaubt spätere Aktivierung, setzt aber erst eindeutige ID voraus. C beendet Produktpfad. | The EYE / Thomas | ja | NOW | 005, 010, 013 | `DECIDE_NOW` | Decision nennt Name, ID/keine ID, Aktivierungsstatus und Relation zu APP-01. |
| 003 | **A `HOLD_UNTIL` Release-Identity + grüner Suite + Linux/Security/Deploy-Evidence**; B Candidate archivieren; C bounded local runtime adoptieren | **A:** Code bleibt reviewbar, keine Capability-Behauptung. B beendet 1.1. C schafft neue operative Verantwortung trotz roter Gates. | ORION Product Authority / Thomas | ja | NOW | 004, 013 | `DECIDE_NOW` | Statusrecord enthält Owner, exact gates und Event-Trigger; keine offene `DEFERRED`-Formel. |
| 004 | **A Pin `d34fbb2…` behalten und exact release checkout verwenden**; B nach neuer Core-Certification repinnen; C Integration parken | **A:** wahrt frozen dependency und macht lokalen HEAD irrelevant. B erweitert akzeptierte Basis; C hält HEX bei representation STOP. | ORION Verification + Experience / Thomas | ja | NOW | 013; ggf. 005-B | `DECIDE_NOW` | ein akzeptierter Dependency-Record nennt exact commit/fingerprint und Checkout-/Upgrade-Regel. |
| 005 | **A Reader-APP-01: nur H1 Contract/Prereg aktivieren**; B ORION-RS: nur offline Contract/Proof aktivieren; C alle neuen Slices parken und MC P1–P3 schließen | **A:** kleinster falsifizierbarer Nutzwertpfad, kein Code/Participant. B priorisiert stärkstes Produktpotenzial mit größerer Lücke. C schützt bestehenden Fokus. | The EYE / Thomas | ja | NOW | 006–010; Portfolio-WIP | `DECIDE_NOW` | Decision nennt genau einen Slice oder `NONE`, erlaubte Phase, WIP-Slot, Owner und STOP. |
| 006 | **A bis 005-A halten, dann Rollen/Privacy einzeln entscheiden**; B Study ohne Minderjährige redesignen; C Study schließen | **A:** nutzt frozen plan; keine Datenerhebung. B reduziert Consent-Komplexität, ändert Population und erfordert prereg revision. | Science Lab + Thomas | ja | NEXT | Reader H1/pilot | `HOLD_UNTIL` | Trigger `EYE-CAND-005=A`; danach D-02–D-06 mit Namen/Policies geschlossen oder Study geparkt. |
| 007 | **A Benchmark nach Contract-/Privacy-Lock, Pilot danach**; B mechanics-only dry run ohne Nutzer; C parken | **A:** echte Nutzwertmessung. B prüft Mechanik, nicht Nutzen. | Science Lab / Thomas | ja | NEXT | Adoption claim, real-user pilot | `HOLD_UNTIL` | adopted protocol, named reviewers, consent/privacy und immutable manifest; Resultat als Evidence, nicht Adoption. |
| 008 | **A unnummeriert halten bis APP-01 Resultat**; B nach 001 als APP-01; C schließen | **A:** erhält starken Transfercandidate ohne WIP. B priorisiert IEEE sofort. | The EYE / Thomas | ja | NEXT | IEEE wrapper/tickets | `HOLD_UNTIL` | Trigger: erster Usefulness-Entscheid oder explizite Repriorisierung; exakte App-ID dann dokumentiert. |
| 009 | **A PARK bis erster Benchmark abgeschlossen**; B IEEE als zweite Domain; C Supply Chain als zweite Domain | **A:** verhindert Fragmentierung. B hat stärkere Evidenz; C prüft Transfer mit synthetischem Fixture. | The EYE / Thomas | ja | LATER | zweite Domain | `PARK` | Rückkehrtrigger: validierter erster Benchmark + freier Portfolio-WIP-Slot. |
| 010 | **A an ORION Verification delegieren, nur bei gewähltem Slice**; B allgemeines Interface-Programm starten; C approved-only beibehalten | **A:** use-case-bound, kein Architekturprogramm. | ORION Verification + Framework Steward | nein, bis Implementierungsautorisation | NEXT | ORION-RS E2E | `HOLD_UNTIL` | Trigger 005-B oder konkreter adopted consumer contract; Ticket hat Schema, tests, owner, STOP. |
| 011 | **A Framework Steward erstellt Gap-/Conformance-Proposal nur bei Consumerbedarf**; B jetzt Full-Suite bauen; C prose-only dauerhaft akzeptieren | **A:** vermeidet ungerichteten Ausbau. | Framework & Library Steward | nein | LATER | Full-OLS claim | `HOLD_UNTIL` | ein adopted consumer requirement nennt benötigte Conformance-Klasse; sonst bleibt Status `specified only`. |
| 012 | **A Bezeichnung schließen; nächste Version erst aus evidenced change**; B 0.8 reservieren; C 0.8 sofort roadmappen | **A:** verhindert Versionsfiktion. | Framework Steward | nein | NOW | Kernel roadmap drift | `CLOSE` | alle aktuellen Portfoliofiles verwenden 0.7; keine 0.8 bis separate version decision. |
| 013 | **A HOLD bis fünf Public-Alpha-Gates grün**; B Readiness-only public evaluation; C Public Alpha schließen | **A:** Scope ehrlich. B erlaubt begrenzte Oberfläche ohne complete journey, benötigt klare Benennung. | Experience + ORION + Thomas | ja | NEXT | public claims/deploy | `HOLD_UNTIL` | Runtime/evidence/clarification/privacy/deploy gates mit owners und proof grün oder Alpha formal beendet. |
| 014 | **A Maintenance-Ticket für prospective supersession labels**; B alte Reports löschen; C nichts tun | **A:** erhält Provenienz und stoppt Drift. | Experience | nein | NEXT | Statusklarheit | `DELEGATE` | aktuelle README/Release Index weist controlling record und superseded records aus; keine History deletion. |
| 015 | **A privates content-addressed Object Storage wählen**; B weiter lokal halten mit festem Reviewdatum; C ordinary Git/Git-LFS | **A:** entspricht verified split. B ist zulässig nur mit Datum/Backup owner. C widerspricht Größen-/Boundarybefund. | Science Lab Operations / Thomas | ja | NEXT | Lab cleanup, durable evidence | `DECIDE_NOW` | Provider/URI, cost/owner, privacy/license, upload proof, retrieval proof und local-copy trigger dokumentiert. |
| 016 | **A HOLD bis Structure Freeze + runtime/storage gates, dann separater recheck**; B jetzt reopen; C Experiment parken/archivieren | **A:** bewahrt frozen chain ohne voreilige Execution. | Science Lab / Thomas | ja | LATER | EXP-00-R result | `HOLD_UNTIL` | Structure Freeze aufgehoben, exact 3.12.13, current-chain authorization recheck und explicit one-operation grant. |
| 017 | **A jede Linie mit vorhandenem Trigger halten/parken**; B eine Linie jetzt aktivieren; C alle archivieren | **A:** T02=external gates; metrology=external review; T01=Lab admission; REP01=nach EXP-00-R. | Science Lab / Thomas bei Aktivierung | ja, später | LATER | Research pipeline | `PARK` / `REQUIRES_EXTERNAL_EVIDENCE` | jede Linie besitzt im Lab Register Owner, Rückkehrereignis und `NOT_ACTIVE`; keine Sammelaktivierung. |
| 018 | **A HOLD bis Authorship/License/Study-2-Disposition geschlossen**; B divergence transparent publizieren; C Candidate zurückziehen | **A:** schützt Reproduzierbarkeitsclaim. B möglich nur mit explizitem bounded claim. | Publication Owner / Thomas | ja | NEXT | MC P2 citable object | `HOLD_UNTIL` | drei owner actions entschieden; final publication gate `GO/NO-GO`; DOI/release nur nach GO. |
| 019 | **A exact drei Commits nur auf Review-Branch remote sichern**; B lokal behalten mit Datum/backup; C merge main | **A:** durable, weiterhin non-adopted. C unzulässig ohne separate adoption. | Mission Control + ORION repo owner / Thomas | ja | NEXT | loss risk/review | `DECIDE_NOW` | payload approval, remote refs verified, no merge/capability claim, decision logged. |
| 020 | **A packageweise an Fachhomes delegieren**; B assets in MC behalten; C bulk move/delete | **A:** bewahrt dünne Control Surface. | Mission Control | nein, außer high-materiality identity | NEXT | repo hygiene | `DELEGATE` | jedes Paket hat hash, provenance, accepting owner und move/retain disposition; kein orphan. |
| 021 | **A HOLD bis Kontaktlog reconciled, dann echte Signalentscheidung**; B jetzt neue Aktion; C Track schließen | **A:** neuer Outreach ohne State wäre unbegründet. | Mission Control / Thomas | ja nach Trigger | NOW | Track A next action | `HOLD_UNTIL` | Trigger: vier Events + 11/12 conflict im durable log; danach one-action/none Decision. |
| 022 | **A First-time observation, dann genau `ONE CORRECTION` oder `NO CHANGE`**; B Redesign; C indefinite open | **A:** existing bounded gate. | Website Owner / Thomas | ja | NEXT | M-WEB01 closure | `HOLD_UNTIL` | dated observation record plus exact correction/no-change Decision. |
| 023 | **A Preservation/navigation only**; B bounded editorial pass; C archive mission | **A:** entspricht D-003 und Fokus. | The EYE / Thomas | ja | NEXT | M-HAW01 | `DECIDE_NOW` | Mission card erhält genau einen scope und review trigger; kein `ACTIVE` ohne next gate. |
| 024 | **A compare and classify as duplicate/existing home**; B separate package; C unverändert halten bis named review date | **A:** keine neue Identität ohne Difference evidence. | Rödelheim Owner / Thomas | ja | NEXT | transfer/archive | `DELEGATE` then `DECIDE_NOW` | hash/content comparison abgeschlossen; Thomas wählt eine der drei Dispositionen. |
| 025 | **A PARK als accepted Experience backlog**; B implementation prep; C publication GO | **A:** dependencies offen, kulturelles Objekt bleibt erhalten. | Experience + Publication / Thomas | ja bei Aktivierung | LATER | route/publication | `PARK` | Rückkehrtrigger: manifest, rights, filename mapping, accessibility, public scope und freier WIP-Slot. |
| 026 | **A MC bereitet pro Paket max. 3 disposition options vor**; B bulk classify; C indefinite incoming | **A:** Human entscheidet Meaning/Identity, MC liefert Evidence. | Mission Control + Fachowner + Thomas | ja | NEXT | HP-006–010/Q-006–009/BJM | `DELEGATE` | jedes Subitem hat eigene Identity/Home/Archive decision oder dated hold; doppelte Q/HP links gesetzt. |
| 027 | **A hash recheck delegieren, danach recoverable removal decision**; B dauerhaft als provenance aliases; C jetzt löschen | **A:** reversible, evidence-first. | Mission Control / Thomas | ja nach recheck | NEXT | Q-011 | `HOLD_UNTIL` | retained-source hashes independently equal; Thomas decides retain/archive/trash; Q-011 closed. |
| 028 | **A Steward führt eine controlling Queue zusammen und eskaliert nur Materiality exceptions**; B alle pending items zu Thomas; C Backlog löschen | **A:** redaktionelle Tasks sind keine Portfolioentscheidungen. | Framework & Library Steward | nein, außer Work identity/publication | LATER | Library cleanup | `DELEGATE` | jede ARENA/Core pending row hat controlling ID, owner, trigger/status; duplicates linked, no ownerless `pending`. |
| 029 | **A nested Future Work als `OBSOLETE/ARCHIVE_CONTEXT` behandeln**; B reaktivieren; C löschen | **A:** controlling top-level archive status gilt; einzelne Revival-Idee braucht neue Lab Admission. | Archive Owner / Science Lab | nein | NOW | false active claims | `CLOSE` / `OBSOLETE` | Archive index erklärt, dass nested status nicht aktiv ist; revival only by new decision. |
| 030 | **A PARK mit explicit activation trigger**; B eine Familie aktivieren; C als gelöscht behandeln | **A:** bewahrt Lineage, verhindert Phantom-WIP. | jeweilige Product/Architecture Owner + Thomas | ja bei Aktivierung | LATER | architecture drift | `PARK` | Ledger: LYRA inactive, LUCY architecture-only, SIRIUS unresolved, legacy runtime historical; trigger = adopted use-case + evidence + owner. |
| 031 | **A an Mission Control ausführen lassen**; B durch neuen Slice verdrängen; C schließen | **A:** bereits entschiedene operative Outcomes, keine neue Portfoliofrage. | Mission Control | nein | NOW | outreach readiness | `DELEGATE` | P1–P3 exact Done-conditions erfüllt oder Thomas entscheidet ausdrücklich Repriorisierung. |
| 032 | **A HOLD bis source/artifact/deploy/live chain übereinstimmt**; B current live state als release erklären; C Experience publication parken | **A:** verhindert unverified deployed identity. | Experience/Publication / Thomas final | ja bei Release | NEXT | PR-006 | `HOLD_UNTIL` | immutable chain verifiziert und final release decision logged. |
| 033 | **A PARK als separate Ephemeriden-/Referenzrahmenstudie**; B jetzt Lab aktivieren; C wissenschaftlich schließen, kulturell archivieren | **A:** hält prüfbare Frage ohne Physikclaim. | Science Lab / Thomas | ja bei Admission | LATER | kein Product-Slice | `REQUIRES_EXTERNAL_EVIDENCE` | preregistered question, reference ephemeris, code/error budget, reviewer und Lab Admission; sonst archive only. |

## 2. Dependency- und Deduplikationsübersicht

### Entscheidungsabhängigkeiten

```text
EYE-CAND-001  APP-01 identity
      ├── EYE-CAND-002  ORION-RS identity/non-activation
      └── EYE-CAND-005  next Vertical Slice
              ├── A Reader H1 → 006 governance → 007 benchmark/pilot → 008/009 later apps
              ├── B ORION proof → 010 Interface need → 004 dependency → 013 public alpha later
              └── C no slice → 031 Mission-Control P1–P3 remain sole WIP

EYE-CAND-003  Runtime 1.1 disposition
      └── EYE-CAND-004  exact ORION dependency
              └── EYE-CAND-013  public NEXAHEDRON gate

EYE-CAND-015  durable Lab storage
      └── EYE-CAND-016  EXP-00-R re-open eligibility
              └── EYE-CAND-017/033 later Research admissions

EYE-CAND-018  RC1 publication gate
      └── Mission-Control P2 citable evidence object
```

### Deduplikationsgruppen

| Gruppe | Zusammengeführte Funde | Controlling Candidate / Behandlung |
|---|---|---|
| Application-01-Dreifachkonflikt | Reader `NEXAH-APP-01`; IEEE `APPLICATION 001`; Audit-Vorschlag ORION `Application 01` | 001 trennt die zwei bestehenden Claims; 002 hält ORION separat; 005 entscheidet Aktivierung. |
| ORION Runtime | roadmap „complete“, release candidate, certification, PR-005, Working-State Review | 003; controlling status bis Decision: `NOT_ADOPTED / BLOCKED`. |
| ORION↔HEX currentness | App Phase 1, Audit, HEX adapter test, SOURCE.yaml, Release docs | 004; ein Pin-Problem, nicht fünf verschiedene Architekturdefekte. |
| Interface V1 | ADR, Lab membrane freeze, App roadmap, architecture visuals | 010; `APPROVED_NOT_IMPLEMENTED`; visual references sind duplicates/information only. |
| Public NEXAHEDRON | source release, Alpha roadmap, readiness report, old V1 completion reports | 013 hält Product Gate; 014 reconciled stale documentation. |
| Lab cleanup/storage | OPS-004 residual model, Lab Current State, Cleanup Queue, 11 artifact residues | 015; packageweise Maintenance bleibt unter demselben durable-storage gate. |
| Research activation | EXP-00-R old authorizations, Generator/Producer lineage, historical „next steps“ | 016; alte Authorization/repair steps sind `OBSOLETE` oder provenance, nicht neue Candidates. |
| App usefulness | Reader D-02–D-06, benchmark defaults, pilot/local/public questions | 006 Governance; 007 Execution/Benchmark. |
| Mission Control intake | Q-006–Q-009, HP-006–HP-010, S-001–S-004/B_J_M | 026 mit Subitem-links; keine bulk Identity. |
| Library pending | ARENA classification, Core copies, Reader Journey states, manual cleanup ACQ-001–016 | 028; operative rows werden in eine Steward-Queue dedupliziert. |
| Historical future work | Codex System 8/9, old prototypes, nested checkouts, old Blueprints | 029/030; archive context oder parked component, keine aktive Roadmap. |

### Harte Closure-Abdeckung

| Fundklasse | Behandlung |
|---|---|
| Echte Thomas-Entscheidung NOW | 001–005 in Runde 1. |
| Echte Thomas-Entscheidung NEXT/LATER | 006–009, 013, 015–019, 021–027, 032–033; jeweils mit Eventtrigger/Closure Condition. |
| Fachowner-Task, keine Portfolioentscheidung | 010–011, 014, 020, 028, 031 → `DELEGATE` bzw. `HOLD_UNTIL`. |
| Unbegründete Versions-/Aktivsprache | 012, 029 → `CLOSE/OBSOLETE`. |
| Bewusst nicht aktive Komponenten/Forschung | 017, 025, 030, 033 → `PARK` oder `REQUIRES_EXTERNAL_EVIDENCE` mit Rückkehrtrigger. |
| bereits geschlossene Lab-/Repair-Linien | `INFORMATION_ONLY/OBSOLETE`; controlling Master Status bleibt maßgeblich, kein eigener Candidate. |
| Test-TODOs/FIXMEs innerhalb bereits gewählter Tickets | `IMPLEMENTATION_TASK`; erst nach Parent Decision in Mission Control, kein The-EYE-Ledger-Eintrag. |
| Kommentare, Beispiele und Begriffe „open“ ohne Statuswirkung | `INFORMATION_ONLY`. |

Damit besitzt jede relevante Fundgruppe eine von: Decision, Delegation, triggergebundener Hold, Park, Close, Obsolete, Duplicate-Link oder Information-only. Ein unqualifiziertes `OPEN/HOLD/LATER/DEFERRED` bleibt in diesem Arbeitsregister nicht zurück.

## 3. Erste Decision Queue für Thomas — Runde 1 (maximal fünf)

### Q1 — Welche Identität behält `NEXAH-APP-01`?

1. **Empfohlen: `NEXAH-APP-01` bleibt der Fixed-Source Evidence-Bounded Reader Test; der IEEE Replay bleibt zunächst unnummerierter Candidate.**
   Folge: Namenskollision geschlossen, aber weder H1 noch Code aktiviert.
2. `NEXAH-APP-01` wird der IEEE Benchmark Geometry Replay; der Reader-Plan wird `SUPERSEDED`.
   Folge: technisch reifster Anwendungspfad erhält Priorität; der kleine Reader-Nutzwerttest entfällt als erster Slice.
3. Keine Application erhält derzeit die ID `APP-01`; beide werden geparkt.
   Folge: Identitätsdrift endet, aber es gibt keine primäre Application.

### Q2 — Erhält die ORION Research Session jetzt eine Application-Identität?

1. **Empfohlen: descriptive Bezeichnung `ORION Research Session v0.1 — Knowledge and Research Orientation`, aber `NOT_ACTIVATED` und ohne nummerierte Application-ID.**
   Folge: Produktpotenzial bleibt sichtbar, ohne Audit in Adoption umzuwandeln.
2. Eine neue, von APP-01 getrennte Application-ID wird reserviert, weiterhin ohne Implementierungsfreigabe.
   Folge: Portfolioidentität entsteht; Contract und Activation bleiben separate Gates.
3. Der Candidate wird geschlossen.
   Folge: keine Research-Session-Produktlinie; ORION bleibt struktureller Core.

### Q3 — Wie wird ORION Runtime 1.1 geführt?

1. **Empfohlen: `HOLD_UNTIL` exact release identity, vollständig grüne Release-Suite, target-Linux/Security/Isolation und immutable deployment evidence vorliegen.**
   Folge: Candidate bleibt reviewbar, aber nicht adoptiert oder öffentlich claimbar; ORION Verification Engineer besitzt die Gates.
2. Runtime 1.1 wird als historischer/gescheiterter Candidate archiviert.
   Folge: keine weitere 1.1-Arbeit; neuer Runtime-Versuch bräuchte neue Entscheidung.
3. Runtime 1.1 wird als bounded local-only Runtime adoptiert.
   Folge: operative Verantwortung entsteht trotz nicht grüner Release-/Deployment-Gates; keine Public-Alpha-Freigabe.

### Q4 — Wie wird der ORION/NEXAHEDRON Commit-Pin behandelt?

1. **Empfohlen: NEXAHEDRON behält den zertifizierten Pin `d34fbb2…`; Tests und lokale Nutzung erhalten einen separaten exakten Release-Checkout statt des ORION-Review-HEADs.**
   Folge: fail-closed-Reproduzierbarkeit bleibt erhalten; kein Repin und keine Core-Neuzertifizierung.
2. Der Pin wird erst nach einer neuen, explizit zertifizierten ORION-Core-Releaseentscheidung angehoben.
   Folge: Integration bleibt bis dahin blockiert; späterer Upgrade-Pfad ist klar.
3. Die ORION-Ausführung in NEXAHEDRON wird geparkt.
   Folge: HEX endet beim Confirmed-Material-/Representation-Handoff.

### Q5 — Welcher Vertical Slice wird als nächstes aktiviert?

1. **Empfohlen: Nur H1 für den bestehenden Reader-APP-01 aktivieren: Application Contract und Preregistration; noch kein Code und keine Teilnehmer.**
   Folge: kleinster falsifizierbarer Nutzwertpfad; ORION Research Session und IEEE bleiben Candidates; danach separate Privacy-/Review-Entscheidung.
2. Stattdessen nur einen offline ORION-Research-Session Contract/Proof aktivieren.
   Folge: strategisches Produktpotenzial wird priorisiert; keine Runtime, kein LLM, kein Public Alpha; Interface-/Claim-Contract-Lücken werden Fachowner-Tickets.
3. Kein neuer Slice; alle drei Candidates parken und Mission-Control-P1–P3 schließen.
   Folge: aktuelles WIP-Limit bleibt unverändert; keine neue Product-Arbeit.

Antwortformat für Thomas kann knapp sein: `Q1: 1, Q2: 1, Q3: 1, Q4: 1, Q5: 1` — jede Abweichung kann mit einem Satz begründet werden.

## 4. Geplanter Handoff nach bestätigter Runde — noch nicht ausführen

| Decision | Späterer Mission-Control-Handoff | Ticket/Fachowner | Science-Lab-Evidence bleibt | Alte Marker, die danach markierbar wären |
|---|---|---|---|---|
| Q1 APP-01 identity | Decision Log + Portfolio/Status-Sync-Ticket | The EYE; Lab Application records; MC tracking | beide Application Reports bleiben unverändert als Evidence | unterlegener ID-Claim `SUPERSEDED` oder `PARKED`; kein Löschen |
| Q2 ORION-RS identity | Candidate-/Activation-State-Ticket, nur wenn Identität vergeben | ORION Product Authority + Framework Steward + Experience | Audit bleibt Evidence Input | Auditformulierungen `Application 01` als non-authoritative Hinweis verlinken |
| Q3 Runtime 1.1 | ein Gate-Ticket mit vier überprüfbaren Gates, kein Sammelbacklog | ORION Verification Engineer; Security/Operations nur bei Adoption | Runtime test/review reports bleiben Evidence | PR-005 `DEFERRED` durch triggergebundenes `HOLD_UNTIL` ersetzen; duplicate runtime TODOs linken |
| Q4 Commit pin | Dependency-Reproduction- oder Upgrade-Ticket | ORION Verification Engineer + NEXAHEDRON/Experience | fehlgeschlagener Pin-Test bleibt Evidence | generische „current ORION checkout“-TODOs `DUPLICATE`; Bypass-Ideen `CLOSE` |
| Q5 next slice | genau ein WIP-Ticket für die erlaubte Phase; andere Candidates explizit PARK/HOLD | bei Reader: Science Lab; bei ORION: ORION+Framework+Experience; bei none: MC | alle PASS/negative results bleiben Evidence, keine Product Adoption | konkurrierende „next implementation task“-Texte `SUPERSEDED` oder triggergebunden halten |

Nach Runde 1 wären weitere geplante Handoffs:

- `EYE-CAND-015`: Storage-Selection-Decision → Science Lab Operations; Upload, Retrieval und Local-Copy-Disposition als getrennte Tickets.
- `EYE-CAND-018`: Publication Gate → Publication Owner; Authorship, License und Study-2-Divergence als drei Preconditions, nicht drei Portfolioentscheidungen.
- `EYE-CAND-019`: exact remote-preservation approval → ORION repository owner; keine merge/adoption task.
- `EYE-CAND-021–027`: bestehende Mission-Control-Queue in maximal fünf Thomas-Fragen pro späterer Runde; vorher MC-Evidence/Comparisons vervollständigen.
- `EYE-CAND-028`: Library Steward erstellt eine controlling Dedupe-Queue; nur Work identity, deletion oder publication geht zu Thomas.

## 5. Dateien, die erst nach Entscheidungen später aktualisiert werden müssten

### The EYE / Mission Control

- `MC/DECISION_LOG.md` — bestätigte semantische Decisions eintragen.
- `MC/DECISION_QUEUE.md` — entschiedene Qs schließen, neue Runde höchstens fünf Human Decisions.
- `MC/MISSION_CONTROL.md` — aktive Portfolio-/WIP-Lage und exact next human decision synchronisieren.
- `MC/OPERATIONS/REPOSITORY_HYGIENE_DECISION_GATE_2026-08-14.md` — D-OPS004-01/02/03/04 mit triggergebundener Disposition versehen.
- `MC/PUBLISHING/PUBLISHING_QUEUE.md` — PR-005, PR-006, PR-007 und PR-008 nur nach jeweiligem Decision/Gate aktualisieren.
- `MC/INTAKE/M-INC01_DESKTOP_INCOMING_RECONCILIATION/HANDOFF_PENDING_DECISION_QUEUE.md` — HP-/Q-Duplikate und konkrete Paketdispositionen verlinken.

### Science Lab

- `LAB/NEXAH_APPLICATION_AND_USEFULNESS_ROADMAP_V1/10_OWNER_DECISIONS_AND_BLOCKERS.md` — Q1/Q5-Decision pointer; Evidence-Text nicht rückwirkend umschreiben.
- `LAB/NEXAH_APPLICATION_AND_USEFULNESS_ROADMAP_V1/FINAL_APPLICATION_AND_USEFULNESS_ROADMAP_REPORT.md` — prospective status/supersession pointer.
- `LAB/NEXAH_APPLICATION_PHASE_1/FINAL_APPLICATION_PHASE_1_REPORT.md` — IEEE-ID-Disposition als prospective pointer.
- `LAB/SCIENCE_LAB_MASTER_STATUS.md` und `LAB/SCIENCE_LAB/ACTIVE_WORK.md` — nur bei Research-Reopen/Admission.
- `LAB/SCIENCE_LAB/LAB_REGISTER.md` — nur für tatsächlich zugelassene Studie/Experiment.
- `LAB/LAB_DESK/CURRENT_STATE.md` und `LAB_DESK/CLEANUP_QUEUE.md` — Storage-/Cleanup-Decision und Eventtrigger.
- `LAB/TRANSLATION_FIDELITY_TECHNICAL_REPORT_RC1/FINAL_OWNER_PUBLICATION_GATE.md` — nur nach Q zu PR-007.

### ORION

- `ORION/docs/reviews/ORION_WORKING_STATE_REVIEW_2026-08-14.md` — prospective link zum Runtime-Decision, nicht historische Befunde überschreiben.
- `ORION/docs/reviews/ORION_RUNTIME_RELEASE_DECISION.md` und `...CERTIFICATION.md` — controlling disposition/next gate verlinken.
- `ORION/docs/adr/0009-orion-master-architecture-adoption.md` — nur wenn eine neue Architekturentscheidung tatsächlich OA-05/OA-17 ändert; sonst unverändert.
- `ORION/docs/governance/OWNERSHIP.md` — nur bei benannter Interface-/Runtime-Verantwortung.
- Runtime Release Manifest/Review-Index — nur nach grünem Verification- und Adoption-Gate.

### NEXAH Core / Framework / Library

- `CORE/README.md`, `CORE/RELEASES.md` oder Framework Release Record — **nicht** für Portfolioentscheidungen ändern; nur bei separatem Framework-/Kernel-Release.
- OLS-Release 1.0.0 — niemals nachträglich verändern; mögliche maschinenlesbare Conformance als neue versionierte Extension/Implementation record.
- `CORE/LIBRARY/review/*` und controlling manual cleanup queue — nach Steward-Deduplikation, nicht als The-EYE-Decision-Log.

### NEXAHEDRON / Experience

- `HEX/docs/upstream/orion-v1/SOURCE.yaml` — nur wenn Q4 Option 2 und neue Certification gewählt wird; bei Option 1 unverändert.
- `HEX/README.md`, Release/Integration Index und Testkonfiguration — exact checkout/reproduction guidance bzw. parked integration status.
- `HEX/NEXAHEDRON_RELEASE_READINESS_REPORT.md` — Public-Alpha-Gates nach Q3/Q4/Q13 synchronisieren.
- `HEX/docs/governance/NEXAHEDRON_ARCHITECTURE_ALIGNMENT_ADOPTION.md` — nur bei echter Änderung der sechs adoptierten Entscheidungen; Implementierungstickets ändern dieses Record nicht.

### Archive

- `CODEX-ARCHIVE/README.md` bzw. ein bestehender Archive Index — nested „Active/Future Work“-Status als historical context erklären; keine historischen Dateien umschreiben.
- lokale verschachtelte/alte Checkouts — später nur in einem Repository-Inventory als `HISTORICAL/DUPLICATE/REFERENCE_ONLY` klassifizieren; nicht löschen ohne separate Entscheidung.

## Closure Statement dieses Sweeps

Dieser Sweep trifft keine der oben stehenden Decisions. Er schließt ausschließlich die **Discovery- und Deduplikationsarbeit**: Jeder relevante offene Fund ist einem Candidate, einem Fachowner-Task, einem triggergebundenen Hold/Park, einer Obsolete-/Duplicate-Behandlung oder Information-only zugeordnet. Die nächste zulässige Aktion ist Thomas' Antwort auf Q1–Q5; erst danach dürfen The EYE und Mission Control die genannten kanonischen Records bzw. Tickets vorbereiten.
