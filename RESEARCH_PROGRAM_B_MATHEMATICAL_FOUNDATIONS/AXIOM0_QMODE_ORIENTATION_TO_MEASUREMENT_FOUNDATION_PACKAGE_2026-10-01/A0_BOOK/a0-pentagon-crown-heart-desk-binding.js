(()=>{
  'use strict';
  const target='A0_PENTAGON_CROWN_RETURN_DEMONSTRATOR.html';
  const records=[
    'body-crown-module-intake-20261025',
    'fam002-a0-orientation-intake-handoff-20261028',
    'lantern-heart-color-bridge-return-20261029',
    'lantern-crown-source-replay-return-20261029',
    'pulse-grammar-clp-shared-desk-return-20261028'
  ];
  records.forEach(id=>{
    const section=document.getElementById(id),buttons=section?.querySelector('.btns');
    if(!buttons||buttons.querySelector(`a[href="${target}"]`))return;
    const link=document.createElement('a');
    link.className='btn';link.href=target;link.textContent='Pentagon Crown · Heart-Pulse';
    link.setAttribute('aria-label','Pentagon Crown Return Demonstrator mit Digital Dodeca Heart öffnen');
    buttons.append(link);
  });
  const referenceButtons=document.getElementById('lantern-heart-color-bridge-return-20261029')?.querySelector('.btns');
  const referenceTarget='assets/a0-dodeka-joint-6i6-hypercube-reference-2026-10-29.json';
  if(referenceButtons&&!referenceButtons.querySelector(`a[href="${referenceTarget}"]`)){
    const reference=document.createElement('a');
    reference.className='btn';reference.href=referenceTarget;reference.textContent='6‑I‑6 · Hypercube Reference';
    reference.setAttribute('aria-label','Source-bound external Hypercube projection reference and historical 6-I-6 sources öffnen');
    referenceButtons.append(reference);
  }
  const harmonicTarget='assets/a0-c-pin-ioi-harmonic-reference-2026-10-29.json';
  if(referenceButtons&&!referenceButtons.querySelector(`a[href="${harmonicTarget}"]`)){
    const harmonic=document.createElement('a');
    harmonic.className='btn';harmonic.href=harmonicTarget;harmonic.textContent='C‑Pin · I–O–I · Harmonic Boundary';
    harmonic.setAttribute('aria-label','C-Pin 101-state control and external spherical-harmonics comparison öffnen');
    referenceButtons.append(harmonic);
  }
})();
