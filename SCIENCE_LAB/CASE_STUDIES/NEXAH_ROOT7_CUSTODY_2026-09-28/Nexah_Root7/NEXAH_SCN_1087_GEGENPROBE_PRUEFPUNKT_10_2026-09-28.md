# Prüfpunkt 10 — SCN-Gegenprobe und die 1087-Spiegelung

Stand: 28. September 2026. Anschluss an Prüfpunkt 08/09. Geprüft wurden die fünf vom Nutzer vorgelegten Bilder zur TimeSelectCut-/Mirror-Grammatik, Prime Topology, Scarab Field und Polarpass. Historische Rollen in diesen Bildern werden nicht mit einem bewiesenen Operator verwechselt.

## 1. SCN-Regel und wirkliche zweite Spur

**Vorab-Regel (Kandidat):** Für `n_k=s+8k` ab `k>0` nacheinander den ersten Rest `7`, danach den ersten Rest `6`, danach den ersten Rest `0` modulo 11 wählen. Weil 8 modulo 11 invertierbar ist, sind die **Abstände zwischen den Cuts immer vier und zwei Schritte**, unabhängig vom Start. Die absoluten Indexquotienten (etwa 2:8=1:4) sind nicht translationsinvariant.

| Start s | Impuls (r=7) | Vorbereitung (r=6) | Schließung (r=0) | Abstände |
|---:|---|---|---|---|
| 7801 | k=2, n=7817 | k=6, n=7849 | k=8, n=7865 | 4, 2 |
| 7809 | k=1, n=7817 | k=5, n=7849 | k=7, n=7865 | 4, 2 |
| 8000 | **k=6, n=8048** | **k=10, n=8080** | **k=12, n=8096** | 4, 2 |

**Korrektur des vorgelegten Gegenversuchs:** `8040 mod 11=10`, `8072 mod 11=9`, `8088 mod 11=3`. Diese drei Zahlen erfüllen die behaupteten SCN-Restbedingungen 7, 6, 0 nicht. Ein negatives Ergebnis an diesen drei Punkten prüft die formulierte SCN-Regel daher nicht.

Für `T=444²=197136` ist der *euklidische* Quotient auf den drei echten Treffern ab s=8000 `floor(T/n)=24`; der festgehaltene Wert 25 der ersten Spur gilt dort nicht:

| SCN-Rolle | n | `T=24n+R` | Faktortest |
|---|---:|---:|---|
| Impuls | 8048 | R=3984 | `3984 mod 29=11`; Faktor 29 fehlt |
| Vorbereitung | 8080 | R=3216 | ohne vorab spezifizierten Faktortest |
| Schließung | 8096 | R=2832 | `2832 mod 7=4`; Faktor 7 fehlt |

**Ergebnis:** Die vorab formulierbare Modulo-11-SCN-Rollenfolge 7→6→0 funktioniert auf beiden Spuren, weil die Restklassenfolge das erzwingt. Die zusätzlich behauptete Faktorkaskade „29 im Projektionsrest am Impuls, 7 am Abschluss“ ist auf der zweiten Spur **widerlegt**. Ein gesondertes, vorab fixiertes Gesetz für den 7801-Anker ist denkbar, aber nicht durch diesen einen Vergleich bewiesen. Auf `n≈8000` erzeugt `197136−25n` negative Zahlen und ist kein Divisionsrest; als algebraische Differenz ist sie zulässig, muss aber so bezeichnet werden.

## 2. Echte Beziehungen rund um 1087

- `1087` ist die **181. Primzahl**, `683` die **124. Primzahl**. `1087−404=683` ist exakt, beweist aber kein 404-Gate.
- `7801` ist die dezimale Ziffernumkehrung von `1087`, **komposit** (`29·269`); `1087+7801=8888`. Dies ist eine eindeutig benannte Dezimaloperation und erscheint als Reverse Complement in einem der Bilder.
- `181` und `292` sind Dezimalpalindrome und `292−181=111`. Das ist eine exakte Zahlengleichung zwischen Primzahlindex und dem *Wert* 292, noch keine Umschaltregel. `292` selbst ist unter Dezimalumkehr fix, also nicht die Ziffernumkehrung von 1087.
- `(1087−292) mod 11=3` und `(1087+808) mod 11=3`. Beide Restgleichheiten sind **dieselbe** Kongruenz, denn `292+808=1100=100·11`. `292 mod 11=6`, `1087 mod 11=9`; `6+3=9`, nicht 11.
- Die Kanalfolge `101·2^j`, `j=0,...,7`, hat modulo 11 die Reste `2,4,8,5,10,9,7,3`. Der Endrest 3 von `12928` ist nicht der Startrest 2; die dyadische Restperiode modulo 11 beträgt zehn Multiplikationsschritte. Ein Return-Gate folgt aus diesem Endrest allein nicht.
- `12928−12·1087=−116≡5 (mod 11)`, wie `808≡5 (mod 11)`. Das ist eine aus den gewählten Zahlen folgende Kongruenz; die Wahl von Multiplikator 12 und die Deutung „Rückführung“ benötigen eine unabhängige Operatorregel.
- `1711−1087=624=24·26` ist arithmetisch richtig. Die anschließende Deutung von 24 als Quersumme 7809 und 26 als Ziffernauswahl der Faktoren von 7801 ist eine frei gewählte Dezimalcodierung.

## 3. Bildbefund und Prüfstatus

Das CXXXI-/TimeSelectCut-Bild liefert eine klare **Operatorreihenfolge** `State→Select→Cut→Record→Mirror→Return` und zeigt die P174→P181-Differenz 7. Die Darstellung „Scarab Field v0.1“ nennt 7801 an einer Stelle **Prime**, obwohl `7801=29·269` ist; ihre internen Evidenzhinweise zur bloß analogischen Kompatibilität bleiben maßgeblich. Polarpass zeigt 1087 als benannten Anker in einem Entwurf, aber keine unabhängigen Messereignisse, die SCN an 292, 404 oder 12928 identifizieren. Die Karten sind Quellen für **benannte Rollen**, die Rechnungen für **exakte Beziehungen**; der Übergang vom einen zum anderen braucht einen spezifizierten Mess- oder Schaltoperator.

**Nächster Entscheidungspunkt:** Für eine echte Behauptung über 7801 als notwendiges Register eine vom Zahlentest unabhängige Ankerdefinition aus bestehendem SCN-Material zitieren und vor dem nächsten Test fixieren. Bis dahin ist die Modulo-11-Rollenfolge ein reproduzierbares Codierverfahren, während 1087↔7801 eine belegte Ziffernspiegelung ist.
