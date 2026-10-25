NEXAH Fünflaschenkrone 25.10.2026
GLB 2.0, ein Modell, fünf animierte Laschen, Zyklus 8 Sekunden.
Animation gegebenenfalls im 3D Viewer starten. Pink: offene starre Laschen; Gold: Randachsen; Cyan: feste Laternenreferenz; Weiß: fester Pin.
Maßstab: 1 Quelleneinheit entspricht 0,1 m. Native Z Achse wird glTF Y Achse.
Kontakt bei F=151,830500786 Grad; Spitzenhöhe 0,368533211 u über Rand.
Der Dreier/Vierer Kontaktansatz stammt aus A0. Die räumliche Fünfererweiterung ist ein neuer Modellkandidat. Keine integrierte Mechanik, keine Kollisionsfreigabe; Deckel, Antrieb und reale Laschendicke fehlen. Das Visual ist aus denselben exakten Dreieckskoordinaten erzeugt. Die GLB Knoten bewegen sich durch starre Scharnierrotation, nicht durch gedehnte Dreiecke.
Prüfungen: Schenkellängen in 121 Stellungen; zentraler Kontakt aller fünf Spitzen; fünf GLB Quaternionpfade gegen direkte Koordinaten; GLB Header und Puffergrenzen. Kein unabhängiger glTF Validator oder visueller GLB Viewer verwendet.
Reproduktion: Python 3 mit numpy scipy matplotlib; build_crown_visual.py mit models.json und native_contact_results.json im Ordner analysis/koerper_due_diligence ausführen; deliverables als Ausgabeordner.
