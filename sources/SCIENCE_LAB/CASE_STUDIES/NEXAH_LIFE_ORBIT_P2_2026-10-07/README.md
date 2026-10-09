# NEXAH LIFE//ORBIT — P2 local browser instrument

Status: `P2 IMPLEMENTED / P1-PARITY CHECKED / DIRECT-FILE HTML`

Open [`index.html`](index.html) directly in a current browser. No server,
package installation or network connection is required.

## Included views

- `V1 Field` — current 2D state with projected births and deaths;
- `V2 Space-time Body` — stacked generation planes;
- `V3 Slice` — synchronized generation slider;
- `V6 Causal Inspector` — selected cell, neighbour count, B3/S23 branch and
  next state;
- Return display — fixed, exact-periodic, translated, extinction or open
  transient.

The seed selector provides block, blinker and glider. At generation zero, a
cell click edits the seed. Playback records up to 64 layers.

## Validation

```bash
npm test
npm run audit
npm run receipts
```

The browser engine is independently parity-tested against every state and
return event in the sealed P1 block, blinker and glider run records.
`npm run receipts` writes the P2 validation report and SHA-256 manifest.

## Boundary

P2 is a local explanatory and inspection instrument. It does not yet produce
GLB, include an E8/ADE adapter, modify the Science Navigator or authorize
publication and deployment. The compact browser signature shown in the UI is
not the authoritative SHA-256 receipt; P1 retains that authority.
