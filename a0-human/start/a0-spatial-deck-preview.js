/* Draft-only CSS-3D adapter. Moves original SVG nodes; never reads/writes player state. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.A0SpatialDeckPreview=api.mount(document,root);})(typeof globalThis==='undefined'?this:globalThis,function(){
 'use strict';
 function mount(doc,win){
  const rotor=doc.getElementById('platterRotor'),svg=doc.getElementById('wheelSvg'),flat=doc.getElementById('spatialFlat'),space=doc.getElementById('spatialSpace'),split=doc.getElementById('spatialSplit'),status=doc.getElementById('spatialStatus');
  if(!rotor||!svg||!flat||!space||!split)return null;
  const sectors=[...svg.querySelectorAll('.wheel-sector')];if(sectors.length!==48)return null;
  const slices=[svg];svg.setAttribute('data-slice','0');
  for(let i=1;i<3;i++){
   const plane=doc.createElementNS('http://www.w3.org/2000/svg','svg');plane.setAttribute('viewBox','0 0 400 400');plane.setAttribute('class','wheel-svg spatial-slice');plane.setAttribute('data-slice',String(i));plane.setAttribute('role','group');plane.setAttribute('aria-label',['Q4−','Q4⁰','Q4+'][i]+' · bestehende Leselage');rotor.append(plane);slices.push(plane);
  }
  for(const sector of sectors)slices[Number(sector.dataset.layer)].append(sector);
  let spatial=false,opened=false;
  function render(){
   doc.body.setAttribute('data-deck-view',spatial?'spatial':'flat');doc.body.setAttribute('data-slices-open',String(opened));
   flat.setAttribute('aria-pressed',String(!spatial));space.setAttribute('aria-pressed',String(spatial));split.setAttribute('aria-pressed',String(opened));split.disabled=!spatial;split.textContent=opened?'Schichten schließen':'Schichten öffnen';
   if(status)status.textContent=!spatial?'Flach · ursprüngliche Bedienebene':opened?'Räumlich · drei getrennte Leselagen. Darstellungsabstand, keine materiellen Schichten.':'Räumlich · schräges Deck, unveränderte Adressen und Leselagen.';
  }
  flat.onclick=()=>{spatial=false;opened=false;render();};space.onclick=()=>{spatial=true;render();};split.onclick=()=>{if(!spatial)return;opened=!opened;render();};
  render();return{snapshot:()=>({spatial,opened,sourceStateTransferred:false,glbExport:false})};
 }
 return{mount};
});
