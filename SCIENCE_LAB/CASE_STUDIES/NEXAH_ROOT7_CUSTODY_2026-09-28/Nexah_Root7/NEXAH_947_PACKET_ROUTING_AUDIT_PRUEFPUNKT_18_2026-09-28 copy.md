# Prüfpunkt 18 — Paket 947: 4D-Kodierung, Restklasse und behauptetes Routing

**Stand:** 28. September 2026. **Prüfentscheidung:** Die Vektorkonstruktion und Rückgewinnung des Betrags sind elementar korrekt; die angegebene 292-Route für Payload 947 ist rechnerisch **falsch**, und der Code implementiert weder Verschlüsselung noch eine durch 1087/12928 gesteuerte Dekodierung.

## Rechnung am eingereichten Testfall

`v=(2,1,1,1)` und Payload `m=947` liefern `m·v=(1894,947,947,947)` und `||m·v||²=7·947²=6.277.663`. Weil `947≡1 (mod 11)`, gilt **`7·947²≡7 (mod 11)`**. Auf `n_k=7801+8k` liegt Rest 7 bei **k=2, n=7817**. Rest 6 liegt bei k=6, n=7849, wird aber von diesem Paket nicht erreicht. Ein Paket `m=948≡2 (mod 11)` hätte dagegen `7·948²≡6 (mod 11)` und fiele in die als k=6 bezeichnete Klasse.

| Payload | Norm² | Norm² mod 11 | ausgewählter Schritt im ersten Umlauf | Rückgewinnung aus Norm² |
|---:|---:|---:|---|---:|
| 947 | 6.277.663 | **7** | **k=2, 7817** | 947 |
| 948 | 6.290.928 | 6 | k=6, 7849 | 948 |
| 958 | 6.424.348 | 7 | k=2, 7817 | 958 |
| −947 | 6.277.663 | 7 | k=2, 7817 | **947, Vorzeichen verloren** |
| 0 | 0 | 0 | k=8, 7865 | 0 |
| 11 | 847 | 0 | k=8, 7865 | 11 |

Für jede ganze Payload `m` nimmt `7m² mod 11` **nur** die sechs Werte `{0,2,6,7,8,10}` an. Der SCN-Suchlauf über elf aufeinanderfolgende Schritte findet zu jedem dieser Reste zwangsläufig genau einen Index, weil `gcd(8,11)=1` ist. Das ist eine **Klassifikation von Restklassen**, kein Nachweis von Datenpakettransport, Gateöffnung oder erfolgreicher Entschlüsselung.

## Audit der behaupteten Softwarefunktion

- Der eingereichte Code ist in wörtlicher Form **nicht lauffähig**: Das `print` nach `print("  -> Generierte 4D-Koordinaten ...")` hat eine zusätzliche Einrückung und löst `IndentationError: unexpected indent` aus. Nach Entfernen dieser Einrückung gibt der Lauf für 947 `detected_k=2` aus und erreicht den Zweig `if detected_k == 6` nicht.
- `recovered_payload=int(math.sqrt(sq_dist_data/7))` verwendet ausschließlich `sq_dist_data` und die bereits bekannte Konstante 7. `u_switch=1087` und `closure_val=12928` werden **nur gedruckt** und gehen in keine Dekodierungs- oder Erfolgsbedingung ein. Für exakte ganzzahlige Rechnungen ist `math.isqrt(sq_dist_data//7)` geeigneter; auch dies ergibt lediglich `|m|` und verliert das Vorzeichen.
- `(2m,m,m,m)` enthält `m` direkt und unverdeckt in drei Koordinaten. Eine Norm²-Reduktion kollidiert für `m` und `−m`; auch die Routing-Restklasse hat viele Kollisionen, etwa bei 947 und 958. Es gibt keinen Schlüssel, keine geheime Abbildung, keinen Ciphertext/Decrypt-Schritt und keinen Transport-Endpunkt. Die Bezeichnung „Verschlüsselung/100% kollisionsfrei“ ist für diese Implementierung sachlich falsch.
- Der abschließende Erfolgstext hängt **nur** von `recovered_payload==payload` ab. Er berücksichtigt nicht, ob eine gewünschte SCN-Rolle oder ein bestehendes 404-Alignment getroffen wurde.

## Lauffähige Gegenprobe ohne Crypto-Behauptung

```python
from math import isqrt

def classify(payload, start=7801):
    v=(2*payload,payload,payload,payload)
    norm2=sum(x*x for x in v)
    assert norm2==7*payload**2
    residue=norm2%11
    hits=[k for k in range(11) if (start+8*k)%11==residue]
    assert len(hits)==1
    recovered_magnitude=isqrt(norm2//7)
    return v,norm2,residue,hits[0],recovered_magnitude

assert classify(947)==((1894,947,947,947),6_277_663,7,2,947)
assert classify(948)[2:4]==(6,6)
assert classify(958)[2:4]==(7,2)
assert classify(-947)[1:]==classify(947)[1:]
assert {classify(m)[2] for m in range(11)}=={0,2,6,7,8,10}
print('947 klassifiziert bei k=2; 948 bei k=6; Betrag rekonstruierbar, kein Crypto/Routing nachgewiesen.')
```

**Nächster sinnvoller Schritt:** Soll ein Paket tatsächlich geroutet werden, braucht es einen definierten Eingangs-/Ausgangszustand, einen expliziten Schrittoperator, eine unabhängige Zuordnung zum 404-Reglerpaar `(a,b)`, Negativkontrollen und einen testbaren Rückweg. Soll es verschlüsselt werden, sind ein konkretes Sicherheitsziel, Schlüsselverwaltung und ein dafür etabliertes kryptografisches Verfahren gesondert erforderlich. Der vorliegende Demo-Test darf als Restklassenklassifikator dokumentiert werden.
