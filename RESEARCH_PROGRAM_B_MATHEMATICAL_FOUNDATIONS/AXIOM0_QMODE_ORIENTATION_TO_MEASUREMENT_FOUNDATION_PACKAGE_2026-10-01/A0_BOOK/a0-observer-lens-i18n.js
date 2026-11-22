(() => {
  "use strict";

  const language = new URLSearchParams(window.location.search).get("lang");
  if (language !== "en") return;

  document.documentElement.lang = "en";

  const translations = [
    ["Zerlegung ist nicht Erscheinung.", "Decomposition is not appearance."],
    ["Die Differenz wird zur Spur.", "Difference becomes a trace."],
    ["Keine neue Lichttheorie, sondern eine neu gefügte Vergleichsanordnung: Newton zeigt die spektrale Zerlegung. Die Leibniz-Linse ordnet Verschiedenheit als Relation. Die Goethe-Linse zeigt Farbe als Erscheinung an einer Grenze. Der Observer hält den Vergleichspunkt — er verbindet die drei Fenster, ohne ihre Aussagen gleichzusetzen.", "Not a new theory of light, but a newly arranged comparison: Newton shows spectral decomposition. The Leibniz lens orders difference as relation. The Goethe lens shows colour as an appearance at a boundary. The Observer holds the comparison point—connecting the three windows without equating their claims."],
    ["Geführte Observer-Reise", "Guided Observer journey"],
    ["Die Pyramide führt durch fünf Lesestationen.", "The pyramid leads through five reading stations."],
    ["Die Winkel sind Wegmarken der Oberfläche; sie ersetzen nicht den exakten", "The angles are waypoints on the surface; they do not replace the exact"],
    ["IOTA-Leseuhr: fünf Außenstationen und ein gehaltenes Q im Zentrum", "IOTA reading clock: five outer stations and one held Q at the centre"],
    ["Vorherige Lesestation", "Previous reading station"],
    ["Nächste Lesestation", "Next reading station"],
    ["ZURÜCK", "BACK"],
    ["WEITER", "NEXT"],
    ["ATEM → 3 FENSTER → EINZELN → RETURN", "BREATH → 3 WINDOWS → ONE BY ONE → RETURN"],
    ["TOUR COMPLETE · JETZT SELBST SCROLLEN UND ENTDECKEN", "TOUR COMPLETE · NOW SCROLL AND EXPLORE"],
    ["Quelle · Relation · Erscheinung.", "Source · Relation · Appearance."],
    ["orientiert die projizierte Pyramidenkante,", "orients the projected pyramid edge,"],
    ["den getrennten Observer. Sein Vorzeichen wechselt die Seite.", "the separate Observer. Its sign changes the side."],
    ["ist ein endliches", "is a finite"],
    ["-Display mit vier", "display with four"],
    ["-Richtungen und einem Sichtkegel zum Pink Strip.", "directions and a viewing cone toward the Pink Strip."],
    ["bleibt eine Wellenlängenreferenz; Gradwerte bleiben Winkel.", "remains a wavelength reference; degree values remain angles."],
    ["Darstellungsmodus der drei Fenster", "Display mode for the three windows"],
    ["Ansicht", "View"],
    ["3 Fenster", "3 windows"],
    ["Vertikalschnitt", "Vertical section"],
    ["Lange optische Achse · Navigation bleibt sichtbar", "Long optical axis · navigation remains visible"],
    ["Kompakte Gesamtschau · alle drei Fenster", "Compact overview · all three windows"],
    ["Schematische Newton-Ansicht mit weißem Strahl, Prisma und sieben getrennten Wellenlängen-Samples", "Schematic Newton view with white beam, prism and seven separate wavelength samples"],
    ["Leibniz-Linse als konstruierte Moiré-Differenz mit projizierter Pyramidenkante und optionalem endlichem Geometrie-Overlay", "Leibniz lens as a constructed moiré difference with projected pyramid edge and optional finite geometry overlay"],
    ["Schematische Goethe-Ansicht mit links oder rechts liegendem Q-Observer, vier orthogonalen Orientierungspunkten und Sichtkegel zum Farbstreifen", "Schematic Goethe view with a Q Observer on the left or right, four orthogonal orientation points and a viewing cone toward the colour strip"],
    ["Die Fläche faltet sich zur Gegenansicht.", "The surface folds into the counter-view."],
    ["Zwei Leseseiten teilen eine Naht. Die Schleifen zeigen eine deklarierte Hopf-Fold-Projektion – keine zusätzliche Raumdimension.", "Two reading sides share a seam. The loops show a declared Hopf-fold projection—not an additional spatial dimension."],
    ["Schematische Hopf-Fold- und Return-Schleife", "Schematic Hopf-fold and Return loop"],
    ["Zwei farbige, verschlungene Display-Schleifen schließen sich um einen gehaltenen Q-Anker.", "Two coloured, interlaced display loops close around a held Q anchor."],
    ["Pyramidenkante", "Pyramid edge"],
    ["Phasenversatz", "Phase offset"],
    ["Drei Lesarten. Ein gemeinsamer Beobachtungsrahmen.", "Three readings. One shared observation frame."],
    ["Dies ist keine vierte Theorie des Lichts. Die Bühne legt drei bestehende Perspektiven nebeneinander und macht ihre Unterschiede navigierbar.", "This is not a fourth theory of light. The stage places three existing perspectives side by side and makes their differences navigable."],
    ["hält den Ort des Vergleichs; es vereinigt weder die historischen Positionen noch ihre physikalischen Aussagen.", "holds the site of comparison; it unifies neither the historical positions nor their physical claims."],
    ["Newton: geordnete Zerlegung", "Newton: ordered decomposition"],
    ["Das linke Fenster zeigt die bekannte Darstellungsrichtung: Ein weißer Eingang wird in eine geordnete Folge spektraler Bänder aufgefächert.", "The left window shows the familiar direction of representation: a white input fans out into an ordered sequence of spectral bands."],
    ["Leibniz: Differenz ohne Trennung", "Leibniz: difference without separation"],
    ["Das mittlere Moiré bewahrt beide Eingaben als Verschiedene:", "The middle moiré preserves both inputs as distinct:"],
    ["und Innen ≠ Außen. Sichtbar wird ihre relationale Spur — nicht eine neue Substanz zwischen ihnen.", "and inside ≠ outside. Their relational trace becomes visible—not a new substance between them."],
    ["Goethe: Farbe an der Grenze", "Goethe: colour at the boundary"],
    ["Das rechte Fenster setzt Hell–Dunkel-Grenze und Beobachterlage ins Bild. Es ist eine Vergleichslinse, keine Gleichsetzung mit Newtons Optik.", "The right window pictures the light–dark boundary and the Observer position. It is a comparison lens, not an equation with Newtonian optics."],
    ["Leseschlüssel:", "Reading key:"],
    ["Drei getrennte Perspektiven, ein gemeinsamer Beobachtungsrahmen. Relation ist hier keine Identität; die Darstellung ist keine kalibrierte optische Messung.", "Three distinct perspectives, one shared observation frame. Relation is not identity here; the display is not a calibrated optical measurement."],
    ["Übergang von der Vergleichslinse zur Lichtzeitmessung", "Transition from the comparison lens to light-time measurement"],
    ["Bis hierher lesen wir Licht.", "Up to here, we read light."],
    ["Ab hier messen wir seinen Weg.", "From here on, we measure its path."],
    ["Drei Lichtquellen. Eine Konstante. Mehrere Buchhaltungsraster.", "Three light sources. One constant. Multiple accounting grids."],
    ["Drei Lichtquellen führen durch fünf Lesestationen.", "Three light sources lead through five reading stations."],
    ["Gleiche Lichtlaufzeit liegt auf derselben Anzeigekontur. Die Schlieren zeigen nur Dichte/Nachbild der Projektion; sie sind weder Medium noch Messspur.", "Equal light-time lies on the same display contour. The schlieren show only density/afterimage of the projection; they are neither a medium nor a measurement trace."],
    ["Nur Mond, 1 au und Sirius besitzen hier gebundene Distanzrecords. Der Winkel ordnet Beschriftungen; er behauptet keine Himmelskoordinate.", "Only the Moon, 1 au and Sirius have bound distance records here. The angle arranges labels; it claims no celestial coordinate."],
    ["Die Schlieren sind versetzte Nachbilder deiner letzten Auswahlzustände. Sie speichern keine physische Bewegung, kein Photonpaket und kein Echo.", "The schlieren are offset afterimages of your latest selection states. They store no physical motion, photon packet or echo."],
    ["Übergang von der Messgröße zur typisierten Adresse", "Transition from the measured quantity to the typed address"],
    ["Aus einer Messzahl wird eine Adresse.", "A measured number becomes an address."],
    ["Ohne dass die Adresse zur Physik wird.", "Without the address becoming physics."],
    ["Eine Zahl wird Adresse. Licht bleibt eine Messgröße.", "A number becomes an address. Light remains a measured quantity."],
    ["Gleiche Ziffern. Andere Rolle.", "Same digits. Different role."],
    ["kann als Ziffernfolge gleich aussehen und trotzdem Verschiedenes bedeuten. Entscheidend sind Typ, Einheit und Operation — nicht die optische Ähnlichkeit.", "can look identical as a digit sequence and still mean different things. Type, unit and operation are decisive—not visual similarity."],
    ["Von der physikalischen Messgröße über die Typgrenze zur endlichen Adresse", "From the physical measured quantity across the type boundary to the finite address"],
    ["MESSGRÖSSE", "MEASURED QUANTITY"],
    ["Wert und Einheit gehören zusammen.", "Value and unit belong together."],
    ["Type Gate hält die Einheit zurück", "Type Gate holds the unit back"],
    ["INTEGER-TRÄGER", "INTEGER CARRIER"],
    ["Nur der deklarierte Integer passiert das Gate.", "Only the declared integer passes through the gate."],
    ["Eine endliche Adresse — kein Raum und kein Lichtweg.", "A finite address—not space and not a light path."],
    ["WAS BEREITS FESTSTEHT", "WHAT IS ALREADY FIXED"],
    ["WAS JETZT FOLGT", "WHAT COMES NEXT"],
    ["bleibt die exakte SI-Konstante. Die drei Distanzraster ändern nur die Schreibweise;", "remains the exact SI constant. The three distance grids change only the notation;"],
    ["bleibt gleich.", "remains the same."],
    ["Tour III führt ausschließlich durch", "Tour III leads exclusively through"],
    ["sind getrennte Vertiefungsfenster, keine weiteren Tourstationen.", "are separate deep-dive windows, not additional tour stations."],
    ["Der Codec liefert den Integer", "The codec returns the integer"],
    ["exakt zurück. Er rekonstruiert weder die Einheit noch die physikalische Messgröße.", "exactly. It reconstructs neither the unit nor the physical measured quantity."],
    ["Eine Tour. Drei benachbarte Bereiche.", "One tour. Three adjacent areas."],
    ["Die geführte Tour endet beim exakten Integer-Return. Die folgenden Fenster bleiben prüfbar, gehören aber nicht zu ihrer Mechanik.", "The guided tour ends with the exact integer Return. The following windows remain inspectable but do not belong to its mechanism."],
    ["typisierte Übergabe", "typed handoff"],
    ["deklarierte Verzögerung", "declared delay"],
    ["Am Type Gate bleiben Einheit und SI-Typ links. Nicht „world“, nicht Licht.", "At the Type Gate, unit and SI type remain on the left. Not “world”, not light."],
    ["Was liegt neben der ADDR28-Tour?", "What lies beside the ADDR28 tour?"],
    ["Die Tabs liegen nebeneinander, aber sie behaupten keinen gemeinsamen Mechanismus. Jeder öffnet eine andere, klar begrenzte Frage.", "The tabs sit side by side, but they claim no shared mechanism. Each opens a different, clearly bounded question."],
    ["Zahl → Adresse", "Number → address"],
    ["Ein SI-Wert liefert eine Ziffernfolge. Nach dem Type Gate wird nur der Integer als endlicher Codec-Träger gelesen.", "An SI value yields a digit sequence. After the Type Gate, only the integer is read as a finite codec carrier."],
    ["Drei Energieskalen", "Three energy scales"],
    ["Photonenergie:", "Photon energy:"],
    ["Planck-Konstante", "Planck constant"],
    ["Frequenz", "frequency"],
    ["Thermische Energieskala:", "Thermal energy scale:"],
    ["Boltzmann-Konstante", "Boltzmann constant"],
    ["absolute Temperatur", "absolute temperature"],
    ["Ruheenergie-Äquivalent der gewählten Masse", "Rest-energy equivalent of the selected mass"],
    ["Strahlungsverteilung", "Radiation distribution"],
    ["Die etablierte Planck-Kurve", "The established Planck curve"],
    ["ordnet Schwarzkörperstrahlung nach Frequenz und Temperatur. Hier wird ihre Form normiert gezeigt.", "orders black-body radiation by frequency and temperature. Its form is shown normalized here."],
    ["Synthetische Buchhaltung", "Synthetic accounting"],
    ["trennen Amplitude, deklarierte Verzögerung und Residuum. Das sind Modellkanäle — weder Lichtschichten noch HD/HDL-Zustände.", "separate amplitude, declared delay and residual. These are model channels—neither light layers nor HD/HDL states."],
    ["Nicht addieren:", "Do not add:"],
    ["besitzen dieselbe Einheit Joule, beschreiben aber unterschiedliche physikalische Zuordnungen.", "share the unit joule but describe different physical assignments."],
    ["wird nicht berechnet. Ohne deklarierte Bedeutung und Dimension von", "is not calculated. Without a declared meaning and dimension for"],
    ["ist die Schreibweise keine belastbare Energiegleichung;", "the notation is not a defensible energy equation;"],
    ["ist insbesondere nicht automatisch", "in particular is not automatically"],
    ["Messwert und Einheit bleiben gemeinsam typisiert.", "Measured value and unit remain typed together."],
    ["Bestehender Codec; kein physikalisches Abbild.", "Existing codec; not a physical representation."],
    ["Die Zahlenwerte von", "The numerical values of"],
    ["wechseln gemeinsam mit dem Raster. Die physikalische Strecke, die Konstante und", "change together with the grid. The physical distance, the constant and"],
    ["bleiben dieselben.", "remain the same."],
    ["Eine Zahl kann geprüft, adressiert und erzählt werden.", "A number can be checked, addressed and narrated."],
    ["Matroschka-Lesung: verschachtelte Potenzen, keine verschachtelten Räume.", "Matryoshka reading: nested powers, not nested spaces."],
    ["Die prüfbare Schale", "The verifiable shell"],
    ["exakt", "exact"],
    ["ist keine Neunerpotenz. Die historische Tafel wird hier geprüft, nicht stillschweigend bestätigt.", "is not a power of nine. The historical table is checked here, not silently confirmed."],
    ["Die historische Schale", "The historical shell"],
    ["bleiben auffindbare Marker des vorhandenen GH-/QGR-Korpus.", "remain traceable markers in the existing GH/QGR corpus."],
    ["sind Rechenspuren — noch keine Resonanzgesetze.", "are calculation traces—not resonance laws."],
    ["Adresse heißt hier: wiederfinden, vergleichen, Quelle halten.", "Address here means: retrieve, compare, hold the source."],
    ["Die erzählerische Schale", "The narrative shell"],
    ["dürfen als Denk- und Wortmarker weiterwandern. Sie werden nicht rückwirkend zu Graviton, Higgs-Feld, String-Dimension oder Naturgleichung erklärt.", "may continue as thought and word markers. They are not retroactively declared to be gravitons, Higgs fields, string dimensions or laws of nature."],
    ["Poetische Anschlussfähigkeit bleibt erhalten; wissenschaftliche Bedeutung bleibt offen.", "Poetic connectivity is preserved; scientific meaning remains open."],
    ["Übergang von Messgröße zu Adresse und Bühnengrammatik", "Transition from measured quantity to address and stage grammar"],
    ["Lichtzeit", "Light-time"],
    ["Distanz und Laufzeit behalten ihre physikalischen Typen.", "Distance and travel time retain their physical types."],
    ["Zahl / Integer", "Number / integer"],
    ["wird als endlicher Testträger gelesen.", "is read as a finite test carrier."],
    ["Die Adresse steuert die Ansicht; sie simuliert keine Lichtausbreitung.", "The address controls the view; it does not simulate light propagation."],
    ["Das obere Instrument bleibt Vergleichslinse. Beim Scrollen wird daraus eine endliche Bühnengrammatik: fünf benannte Stationen, vier Quarter-Turn-Lagen und ein gemeinsamer Return nach zwanzig eindeutigen Adressen.", "The upper instrument remains a comparison lens. As you scroll, it becomes a finite stage grammar: five named stations, four quarter-turn orientations and one shared Return after twenty unique addresses."],
    ["besitzt zwanzig Zustandsadressen. Das Zentrum", "has twenty state addresses. The centre"],
    ["bleibt fest; der Gradmarker wandert. Nach je fünf Schritten wechselt die Orientierung:", "remains fixed; the degree marker moves. After every five steps, the orientation changes:"],
    ["Radiale Master-Resonanzrad-Skizze mit farbigen Speichen und konzentrischen, unterbrochenen Ringen", "Radial master resonance-wheel sketch with coloured spokes and concentric broken rings"],
    ["Animierte Drei-mal-drei-Feldskizze mit wechselnden cyanfarbenen, pinken und grauen Zellen", "Animated three-by-three field sketch with changing cyan, pink and grey cells"],
    ["Dieselbe Adresse wird als Faltung gelesen: zwei pentagonale Seiten, eine gemeinsame Naht,", "The same address is read as a fold: two pentagonal sides, one shared seam,"],
    ["als Gegenansicht. Das ist ein Displayvertrag für Innen/Außen und Öffnen/Schließen — keine zusätzliche Raumdimension und kein physikalischer Mechanismus.", "as the counter-view. This is a display contract for inside/outside and opening/closing—not an additional spatial dimension or physical mechanism."],
    ["bleibt ein getrenntes tieferes Fenster im Demonstrator.", "remains a separate deeper window in the demonstrator."],
    ["Die zwei Schichten öffnen sich an der farbigen Fuge. Der Return schließt die Zustandsadresse, nicht die Erfahrung:", "The two layers open at the coloured seam. The Return closes the state address, not the experience:"],
    ["bezeichnet hier Perspektive, Atmosphäre und Relation — nicht ein neues kosmologisches Modell.", "here denotes perspective, atmosphere and relation—not a new cosmological model."],
    ["Leise Ausgänge nach dem Return", "Quiet exits after the Return"],
    ["Bild und gebundener Tour-Score beginnen gemeinsam.", "Image and bound tour score begin together."],
    ["Lichtzeit, Typgrenze und Adresse erneut lesen.", "Read light-time, type boundary and address again."],
    ["Getrennte Fenster behalten ihre eigenen Verträge.", "Distinct windows retain their own contracts."],
    ["Quelle", "Source"],
    ["öffnen", "open"]
  ];

  const translate = (value) => {
    let result = value;
    for (const [source, target] of translations) result = result.split(source).join(target);
    return result;
  };

  const translateElement = (element) => {
    if (!(element instanceof Element)) return;
    for (const attribute of ["aria-label", "alt", "title"]) {
      const value = element.getAttribute(attribute);
      if (value) {
        const translated = translate(value);
        if (translated !== value) element.setAttribute(attribute, translated);
      }
    }
  };

  const translateTree = (root) => {
    if (root.nodeType === Node.TEXT_NODE) {
      const value = root.nodeValue || "";
      const translated = translate(value);
      if (translated !== value) root.nodeValue = translated;
      return;
    }
    if (!(root instanceof Element || root instanceof DocumentFragment || root instanceof Document)) return;
    if (root instanceof Element) translateElement(root);
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      if (node.nodeType === Node.TEXT_NODE) translateTree(node);
      else translateElement(node);
    }
  };

  const observer = new MutationObserver((records) => {
    for (const record of records) {
      if (record.type === "characterData") translateTree(record.target);
      for (const node of record.addedNodes) translateTree(node);
    }
  });

  translateTree(document);
  observer.observe(document.documentElement, { subtree: true, childList: true, characterData: true });
  document.title = "Newton / Leibniz / Goethe Observer Lens · A0 · English";
  document.documentElement.dataset.observerLanguage = "en";
  window.A0ObserverLensLanguage = Object.freeze({ language: "en", projection: "source-bound" });
})();
