# Decimal cut type audit

- `"1428" → "14" | "28"`: `DECIMAL_SEGMENTATION`.
- (14	imes28=392): `INTEGER_MULTIPLICATION`.
- (1428=14	imes102=28	imes51).
- (392=400-8).
- mod 1428 and mod 392: `DISTINCT_CARRIERS`.

The string cut does not prove (1428=14	imes28); that equality is false. Since (392
mid1428), reduction ([x]_{1428}mapsto[x]_{392}) is not well-defined. Here (gcd(1428,392)=28), so nontrivial homomorphisms exist only through images of order dividing 28; none preserves step 14 as the same numeric residue, because well-defined maps ([x]mapsto[kx]) require (14mid k), while preserving 14 requires (kequiv1pmod{28}), which is incompatible.
