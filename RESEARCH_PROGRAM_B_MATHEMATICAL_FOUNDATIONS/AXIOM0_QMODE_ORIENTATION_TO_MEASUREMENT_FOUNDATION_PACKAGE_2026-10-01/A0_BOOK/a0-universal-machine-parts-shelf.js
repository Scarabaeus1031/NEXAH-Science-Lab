(function(root){
  'use strict';
  const MODELS=[
    ['clockwork','clockwork','Clockwork · Monogold','large addressable assembly / copper-wire and generator reading','clockwork_static_monogold.glb',4921,4920,297744,'793ed2c3'],
    ['wheel','nested','Atomic Matroschka · Triple Wheel','nested wheel / helix / semantic component assembly','atomic_matroschka_triplewheel_helix_words.glb',500,499,110552,'1b66873d'],
    ['cross','radial','Cosmic Resonance · Cross Sorting Wheel','radial cross / sorting-wheel component field','cosmic_resonance_cross_sorting_wheel.glb',282,281,null,'c962d9a6'],
    ['spiral','radial','Universal Spiral · Field Art','dense ring and spiral component field','universal_spiral_field_art.glb',1402,1401,189600,'69f953bf'],
    ['flip','surface','Flip / Breath / Wobble · Static','single baked surface for aperture and silhouette reading','universal_flip_breath_wobble_static.glb',2,1,87088,'fabfd46d'],
    ['portal','surface','Arrokoth Portal · Glow Neon','compact gate and aperture body','arrokoth_portal_glow_neon.glb',2,1,null,'9d5cb731'],
    ['fold','components','Field Art · Tessarec Fold v3','fold and field component assembly','Universal_FieldArt_TessarecFold_v3.glb',708,707,29496,'2aeefecb'],
    ['panel','components','Numbermagic · Panel Field Art','dense grid and panel component pack','numbermagic_panel_fieldart_pack.glb',241,240,298812,'62a8ba05'],
    ['gallery','components','Universal Gallery · Curved Banners','only textured GLB in the audited collection','universal_gallery_curved_banners.glb',8,7,null,'aecc5ec1']
  ].map(([id,group,label,role,file,nodes,meshes,triangles,hash])=>({id,group,label,role,file,nodes,meshes,triangles,hash}));
  const fmt=n=>n==null?'—':new Intl.NumberFormat('de-DE').format(n);
  function mount(doc=document){
    const host=doc.getElementById('universalMachinePartsShelf');
    if(!host)return null;
    const grid=host.querySelector('[data-ums-grid]');
    const stage=host.querySelector('[data-ums-stage]');
    const status=host.querySelector('[data-ums-status]');
    const title=host.querySelector('[data-ums-title]');
    const meta=host.querySelector('[data-ums-meta]');
    const rotate=host.querySelector('[data-ums-rotate]');
    const message=host.querySelector('[data-ums-message]');
    const download=host.querySelector('[data-ums-download]');
    const canvas=host.querySelector('[data-ums-points]');
    const context=canvas.getContext('2d');
    const viewerTemplate=stage.querySelector('model-viewer');
    const webGLAvailable=Boolean(doc.createElement('canvas').getContext('webgl2'));
    let viewer, request, points, frame;
    let angle=0.65;
    viewerTemplate.remove();
    grid.innerHTML=MODELS.map((m,i)=>`<article class="ums-card" data-group="${m.group}" data-model="${m.id}" style="--ums-accent:${['#f4b942','#64d8ef','#ef62b2','#8de36d'][i%4]}"><small>${String(i+1).padStart(2,'0')} · ${m.group.toUpperCase()}</small><h3>${m.label}</h3><p>${m.role}</p><dl><div><dt>Nodes</dt><dd>${fmt(m.nodes)}</dd></div><div><dt>Meshes</dt><dd>${fmt(m.meshes)}</dd></div><div><dt>Triangles</dt><dd>${fmt(m.triangles)}</dd></div></dl><button type="button" data-load="${m.id}">3D laden · ${m.hash}</button></article>`).join('');

    function draw(){
      root.A0GLBPointView.drawPoints(context,points,{yaw:angle});
    }

    function setRotation(on){
      cancelAnimationFrame(frame);
      rotate.setAttribute('aria-pressed',String(on));
      rotate.textContent=on?'Ansichtsrotation stoppen':'Ansichtsrotation';
      if(viewer&&!points)viewer.toggleAttribute('auto-rotate',on);
      if(on&&points){
        let previous;
        function tick(now){
          if(previous!==undefined)angle+=(now-previous)*0.00045;
          previous=now;
          draw();
          frame=requestAnimationFrame(tick);
        }
        frame=requestAnimationFrame(tick);
      }
    }

    async function showPoints(src,signal){
      viewer?.remove();
      viewer=null;
      message.hidden=false;
      message.textContent='Punktansicht wird aus der GLB gelesen …';
      try{
        const response=await fetch(src,{signal});
        if(!response.ok)throw Error(`GLB-Abruf fehlgeschlagen (HTTP ${response.status})`);
        const geometry=await root.A0GLBPointView.readPoints(await response.arrayBuffer());
        if(signal.aborted)return;
        if(!context)throw Error('Canvas ist in diesem Browser nicht verfügbar');
        points=geometry;
        angle=0.65;
        draw();
        canvas.hidden=false;
        message.hidden=true;
        rotate.disabled=false;
        status.textContent='GLB-Punktansicht · ohne Texturen und Beleuchtung';
      }catch(error){
        if(signal.aborted)return;
        message.textContent=error.message;
        status.textContent='GLB-Ansicht nicht verfügbar · Download siehe Modellleiste';
      }
    }

    function select(id){
      const m=MODELS.find(model=>model.id===id);
      if(!m)return;
      setRotation(false);
      request?.abort();
      request=new AbortController();
      const {signal}=request;
      const src=`assets/universal-machine-fam009/${m.file}`;
      viewer?.remove();
      viewer=null;
      points=null;
      canvas.hidden=true;
      message.hidden=false;
      message.textContent='GLB wird geladen …';
      rotate.disabled=true;
      title.textContent=m.label;
      meta.textContent=`${fmt(m.nodes)} nodes · ${fmt(m.meshes)} meshes · SHA-256 ${m.hash}…`;
      download.href=src;
      download.hidden=false;
      canvas.setAttribute('aria-label',`${m.label} · GLB-Punktansicht`);
      status.textContent=`LOADING · ${m.label.toUpperCase()} · SOURCE-BOUND COPY`;
      grid.querySelectorAll('.ums-card').forEach(el=>el.classList.toggle('is-current',el.dataset.model===id));
      if(!webGLAvailable||!root.customElements.get('model-viewer')){
        return showPoints(src,signal);
      }
      viewer=viewerTemplate.cloneNode();
      viewer.alt=`${m.label}, source-bound FAM-009 GLB presentation copy`;
      viewer.setAttribute('loading','eager');
      viewer.addEventListener('load',()=>{
        if(signal.aborted)return;
        message.hidden=true;
        rotate.disabled=false;
        status.textContent='3D-Ansicht bereit · Ansichtsrotation ist NOT NATIVE ANIMATION';
      },{once:true});
      viewer.addEventListener('error',()=>{
        if(!signal.aborted)showPoints(src,signal);
      },{once:true});
      stage.prepend(viewer);
      viewer.src=src;
    }
    grid.addEventListener('click',event=>{const button=event.target.closest('[data-load]');if(button)select(button.dataset.load)});
    host.querySelector('[data-ums-filters]').addEventListener('click',event=>{
      const button=event.target.closest('[data-filter]');
      if(!button)return;
      const filter=button.dataset.filter;
      host.querySelectorAll('[data-filter]').forEach(el=>el.setAttribute('aria-pressed',String(el===button)));
      grid.querySelectorAll('.ums-card').forEach(card=>card.hidden=filter!=='all'&&card.dataset.group!==filter);
    });
    rotate.addEventListener('click',()=>setRotation(rotate.getAttribute('aria-pressed')!=='true'));
    return {models:MODELS.slice(),select};
  }
  root.A0UniversalMachinePartsShelf={mount,models:MODELS.slice()};
})(window);
