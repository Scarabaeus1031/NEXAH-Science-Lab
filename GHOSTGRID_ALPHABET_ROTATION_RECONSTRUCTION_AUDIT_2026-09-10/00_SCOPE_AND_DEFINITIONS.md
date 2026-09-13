# Scope and definitions

Bounded deterministic arithmetic, information-theoretic, and raster-transformation audit dated 2026-09-10.

The numerical source is the included generator: G(i,j)=(i+j) mod 2 for 0<=i,j<1000. Generated arrays, declared Pillow transforms, and their hashes are evidence; rendered pixels are not independent evidence.

Runtime: Python 3.12.14, NumPy 2.3.5, Pillow 12.3.0. Random control: NumPy Generator(PCG64), seed 20260910, exactly 500000 zeros and 500000 ones.

Raster rotation uses Pillow rotate with center=None, expand=True, fill=0, nearest or bilinear interpolation. Inverse comparison rotates back with the same method and center-crops to 1000x1000. Bilinear histograms and entropies refer to quantized uint8 samples, not binary entropy.

Scaling values are dimensionless output scale factors relative to 1000x1000. Block-majority ties map to zero. Block-average retains floating means. Reconstruction repeats downsampled cells to original dimensions.

The six requested legacy visual names were searched exactly in Desktop/00_INCOMING and the current repository; none was located. This does not block numerical claims because the independent generator is complete.

No prior audit was reopened or modified. No physical, biological, quantum, resonance, memory, consciousness, or shadow-field claim. No commit or push.
