# QRO-01 — Technical QR Baseline

## Neutral account

1. A physical print or digital file carries a visible QR symbol.
2. The symbol is a spatial grid of square modules. Module size and scanner resolution constrain reliable sampling.
3. Position/finder structures support symbol location and orientation. A practical detector may estimate module size, dimension, alignment and a perspective transform before sampling a square bit matrix.
4. Sampled module states are interpreted according to the QR symbology, including format/version information and data/codeword placement.
5. Reed–Solomon error-correction codewords can restore some damaged data within the chosen correction capacity.
6. Decoding produces a payload such as plain text. Interpretation assigns an application-level type. Any execution is a separate optional event requiring a policy and environment.

## Sources and boundaries

| Source | Technical use | Boundary |
|---|---|---|
| [ISO/IEC 18004:2024](https://www.iso.org/standard/83389.html) | Authoritative QR Code symbology specification identity. | The full standard is not reproduced here. |
| [DENSO WAVE — module size](https://www.qrcode.com/en/howto/cell.html) | A module is a square composing the code; printing/scanning resolution affects readability. | Does not define NEXAH types. |
| [DENSO WAVE — error correction](https://www.qrcode.com/en/about/error_correction.html) | QR error correction adds Reed–Solomon codewords; a codeword is 8 bits. | Restoration capacity is bounded; decoding is not execution. |
| [ZXing QR Detector](https://github.com/zxing/zxing/blob/master/core/src/main/java/com/google/zxing/qrcode/detector/Detector.java) | Concrete detector locates finder patterns, estimates module size/dimension, constructs a perspective transform and samples a grid. | Implementation example, not the QR standard itself. |

`SOURCE != MODEL`: the technical sources define QR behavior; NEXAH vocabulary is applied only afterward as a typing control.
