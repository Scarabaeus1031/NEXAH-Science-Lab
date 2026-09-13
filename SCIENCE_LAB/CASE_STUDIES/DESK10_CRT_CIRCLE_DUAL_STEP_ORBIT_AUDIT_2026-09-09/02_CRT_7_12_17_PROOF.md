# CRT 7–12–17 proof

`gcd(7,12)=gcd(7,17)=gcd(12,17)=1`, and (7cdot12cdot17=1428). Also (1428=7cdot204=14cdot102=28cdot51).

For (Phi(x)=(xmod7,xmod12,xmod17)=(a,b,c)), use (M_7=204), (M_{12}=119), (M_{17}=84). Their inverses are (1,11,16), respectively. Therefore

[xequiv204a+1309b+1344cpmod{1428}.]

The exhaustive test covers all 1428 representatives: 0 reconstruction failures, 0 collisions, 1428 unique triples. This is standard CRT and a new bounded NEXAH candidate formalization; exact historical use of this register was not located.
