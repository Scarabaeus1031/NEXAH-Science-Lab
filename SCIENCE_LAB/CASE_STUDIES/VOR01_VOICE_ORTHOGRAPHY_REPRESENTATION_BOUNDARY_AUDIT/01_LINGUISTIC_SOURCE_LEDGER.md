# 01 — Linguistic Source Ledger

## Evidence classes

- `A_ATTESTED_BY_AUTHORITATIVE_SOURCE`: directly stated in a cited dictionary or linguistic reference.
- `B_STANDARD_LINGUISTIC_ANALYSIS`: bounded analysis using established terminology and cited observations.
- `C_PLAUSIBLE_BUT_NOT_ESTABLISHED_HERE`: not promoted to a historical claim.
- `D_USER_SUPPLIED_ASSOCIATION`: preserved as provenance only.
- `E_UNSUPPORTED`: no supporting authority located within the bounded source pass.

## Sources and bounded use

| ID | Authority | Item / fact used | Class | Boundary |
|---|---|---|---|---|
| S1 | [Merriam-Webster — vowel](https://www.merriam-webster.com/dictionary/vowel) | English meaning, pronunciation and Latin/French history of *vowel*. | A | Does not make the string identical to German *Vokal*. |
| S2 | [Duden — Vokal](https://www.duden.de/rechtschreibung/Vokal) | German meaning and Latin `vocalis (littera)` / `vox` history. | A | Cross-language equivalence is not string or pronunciation identity. |
| S3 | [Merriam-Webster — consonant](https://www.merriam-webster.com/dictionary/consonant) | English meaning, pronunciation and Latin/French history. | A | Similarity alone was not used as ancestry evidence. |
| S4 | [Duden — Konsonant](https://www.duden.de/rechtschreibung/Konsonant) | German meaning and Latin `(littera) consonans` history. | A | German spelling is language-specific. |
| S5 | [Duden — Laute und Buchstaben](https://shop.duden.de/media/05/35/e5/1746663329/Leseprobe_9783411056132_Schulduden_Grammatik.pdf?ts=1746663329) | German `ei/ai` and `eu/äu` spelling contrasts; selected pronunciation relations. | A | Examples do not define universal letter values. |
| S6 | [Duden — Aussprache](https://www.duden.de/hilfe/aussprache) | Duden IPA convention and German pronunciation example. | A | IPA transcribes pronunciation; it is not the physical sound event. |
| S7 | [Larousse — moi](https://www.larousse.fr/dictionnaires/college/moi/26497) | French *moi* pronunciation `[mwa]`, lexical category and history. | A | No letter-by-letter English/German derivation is used. |
| S8 | [Le Robert — vous](https://dictionnaire.lerobert.com/definition/vous) | French *vous* supplies a bounded `ou` pronunciation example. | A | One word does not exhaust French `ou` behavior. |
| S9 | [Cambridge — content pronunciation](https://dictionary.cambridge.org/us/pronunciation/english/content) | English *content* has documented stress/pronunciation differences by reading. | A | Same spelling does not select a reading without context. |
| S10 | [Cambridge — content](https://dictionary.cambridge.org/us/dictionary/english/content) | Lexical categories and meanings for information/material and satisfied readings. | A | Does not claim unrelated histories for every reading. |
| S11 | [Merriam-Webster — content](https://www.merriam-webster.com/dictionary/content) | Etymological entries for the noun and satisfied senses. | A | Historical relation is taken from the entry, not inferred from spelling. |
| S12 | [Merriam-Webster — contempt](https://www.merriam-webster.com/dictionary/contempt) | Pronunciation, meaning and Latin `contemnere` history. | A | Similarity to *content* does not establish the same lexical item or etymon. |
| S13 | [Merriam-Webster — continent](https://www.merriam-webster.com/dictionary/continent) | Meaning and attested history through Latin `continēre`, “hold together.” | A | Does not attest `CON|TIN|ENT`, land/water encoding, ocean boundary or `LM`. |
| S14 | [Merriam-Webster — glottochronology](https://www.merriam-webster.com/dictionary/glottochronology) | Method estimates divergence time using vocabulary replacement. | A | VOR-01 performs none of those operations. |
| S15 | [Larousse — glottochronologie](https://www.larousse.fr/encyclopedie/divers/glottochronologie/55633) | Swadesh-associated lexical-retention/rate premise. | A | Definition only; no dating is attempted. |
| S16 | [Cambridge pronunciation entries](https://dictionary.cambridge.org/pronunciation/english/) | Bounded English word pronunciations used in the matrix. | A | Word examples establish context dependence, not a complete English phonology. |

## Historical-claim ledger

| Claim | Class | Decision |
|---|---|---|
| *vowel* and *Vokal* denote corresponding linguistic categories and have documented Latin-derived histories. | B, based on S1–S2 | Supported within cited dictionary scope. |
| *consonant* and *Konsonant* denote corresponding categories and have documented Latin-derived histories. | B, based on S3–S4 | Supported within cited dictionary scope. |
| *content* readings have documented lexical and pronunciation distinctions. | A, S9–S11 | Supported. |
| *contempt* shares an etymon with *content* because the strings look similar. | E; contradicted by S11–S12 | Rejected. |
| `CON|TIN|ENT` is the historical morphology of *continent*. | D/E, S13 | Not supported. |
| `CON|TIN|ENT` encodes land/ocean or `LM`. | D/E | Not supported. |

`RECONSTRUCTABLE != ATTESTED` and `PHONETICALLY_PLAUSIBLE != HISTORICALLY_ATTESTED` remain mandatory.
