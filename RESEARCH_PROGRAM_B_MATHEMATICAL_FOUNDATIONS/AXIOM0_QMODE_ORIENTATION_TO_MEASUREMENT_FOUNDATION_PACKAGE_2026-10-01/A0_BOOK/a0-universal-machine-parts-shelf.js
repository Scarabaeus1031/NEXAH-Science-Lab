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
  async function readPoints(buffer){
    const data=new DataView(buffer);
    if(data.getUint32(0,true)!==0x46546c67||data.getUint32(4,true)!==2){
      throw Error('Ungültige GLB-Datei');
    }
    const jsonLength=data.getUint32(12,true);
    const gltf=JSON.parse(new TextDecoder().decode(new Uint8Array(buffer,20,jsonLength)));
    const binaryStart=28+jsonLength;
    if(!root.THREE)await import('./assets/game-of-worlds-play/vendor/three-0.147.0/three.min.js');
    const {Matrix4,Vector3,Quaternion,Box3}=root.THREE;
    const positions=mesh=>gltf.meshes[mesh].primitives.map(primitive=>gltf.accessors[primitive.attributes.POSITION]);
    const instances=[];
    function visit(id,parent){
      const node=gltf.nodes[id];
      const local=new Matrix4();
      if(node.matrix)local.fromArray(node.matrix);
      else local.compose(
        new Vector3(...(node.translation||[0,0,0])),
        new Quaternion(...(node.rotation||[0,0,0,1])),
        new Vector3(...(node.scale||[1,1,1]))
      );
      const world=new Matrix4().multiplyMatrices(parent,local);
      if(node.mesh!==undefined)instances.push({world,accessors:positions(node.mesh)});
      for(const child of node.children||[])visit(child,world);
    }
    for(const id of gltf.scenes[gltf.scene??0].nodes)visit(id,new Matrix4());
    const count=instances.reduce((sum,part)=>sum+part.accessors.reduce((subtotal,a)=>subtotal+a.count,0),0);
    const step=Math.max(1,Math.ceil(count/32000));
    const bounds=new Box3();
    const points=[];
    for(const {world,accessors} of instances){
      for(const accessor of accessors){
        if(accessor.type!=='VEC3'||accessor.componentType!==5126||accessor.sparse){
          throw Error('Positionsformat für die Punktansicht nicht unterstützt');
        }
        const view=gltf.bufferViews[accessor.bufferView];
        const base=binaryStart+(view.byteOffset||0)+(accessor.byteOffset||0);
        for(let index=0;index<accessor.count;index+=step){
          const offset=base+index*(view.byteStride||12);
          const point=new Vector3(data.getFloat32(offset,true),data.getFloat32(offset+4,true),data.getFloat32(offset+8,true)).applyMatrix4(world);
          bounds.expandByPoint(point);
          points.push(point);
        }
      }
    }
    if(!points.length)throw Error('Keine GLB-Punkte gefunden');
    const center=bounds.getCenter(new Vector3());
    const radius=bounds.getSize(new Vector3()).length()/2||1;
    return points.map(point=>point.sub(center).divideScalar(radius));
  }

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
      const {width,height}=canvas;
      const scale=height*0.39;
      const cos=Math.cos(angle), sin=Math.sin(angle);
      context.clearRect(0,0,width,height);
      context.fillStyle='#ffda91';
      context.beginPath();
      for(const {x,y,z} of points){
        const side=x*cos+z*sin;
        const depth=z*cos-x*sin;
        context.rect(width/2+scale*side,height*0.45-scale*(y*0.93-depth*0.37),1.6,1.6);
      }
      context.fill();
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
        const geometry=await readPoints(await response.arrayBuffer());
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
