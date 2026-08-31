# Representation-Capacity Control

WNI-01 is used only for its general distinction between representation quality and recoverability.

## Controls

1. A low-resolution table can preserve exact IDs and adjacency better than a visually rich graph embedding that omits them.
2. The 3D surface looks richer than the heatmap but does not add scalar samples; it adds a height encoding and view-dependent depth cues.
3. The heatmap can preserve the full sampled matrix more uniformly on screen while lacking literal height.
4. A graph layout can be radically changed while node/edge structure remains identical.
5. A nearly identical-looking grid can conceal changed residue values or adjacency.

## Result

`BETTER_RECONSTRUCTION_IMPLIES_MORE_INVARIANT=NO`

Representation capacity is relation-specific. Recoverability depends on whether the chosen encoding and retained metadata carry the tested relation, not on visual realism or complexity.
