(function(){
  'use strict';
  const M=globalThis.A0PrimecubeModel,root=document.querySelector('[data-pc-wg13]');
  if(!M||!root)return;
  const svg=root.querySelector('[data-pc-wg13-svg]'),slider=root.querySelector('[data-pc-wg13-step]'),out=root.querySelector('[data-pc-wg13-step-out]'),status=root.querySelector('[data-pc-wg13-status]');
  const regs={wheel7:root.querySelector('[data-pc-wg13-w7]'),wheel8:root.querySelector('[data-pc-wg13-w8]'),gate13:root.querySelector('[data-pc-wg13-g13]')};
  let timer=null,view='TOP_IJ';
  const esc=value=>String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const p=(cx,cy,rx,ry,i,n,phase=-Math.PI/2)=>{const a=phase+2*Math.PI*i/n;return [cx+rx*Math.cos(a),cy+ry*Math.sin(a)]};
  function topRing(n,r,key,label,color,direction){
    let s=`<circle class="pc-wg13-ring" cx="360" cy="290" r="${r}"/><text x="360" y="${290-r-24}" class="pc-wg13-center-title" fill="${color}">${label} · ${direction}</text>`;
    for(let i=0;i<n;i++){const [x,y]=p(360,290,r,r,i,n);s+=`<line class="pc-wg13-spoke" x1="360" y1="290" x2="${x}" y2="${y}"/><circle data-ring="${key}" data-i="${i}" class="pc-wg13-node ${key}" cx="${x}" cy="${y}" r="13"/><text data-label="${key}" data-i="${i}" class="pc-wg13-label" x="${x}" y="${y}">${i}</text>`}return s;
  }
  function sideRing(n,rx,ry,key,label,color,direction,cy=290){
    let s=`<ellipse class="pc-wg13-ring" cx="360" cy="${cy}" rx="${rx}" ry="${ry}"/><text x="360" y="${cy-ry-22}" class="pc-wg13-center-title" fill="${color}">${label} · ${direction}</text>`;
    for(let i=0;i<n;i++){const [x,y]=p(360,cy,rx,ry,i,n);s+=`<line class="pc-wg13-spoke" x1="360" y1="${cy}" x2="${x}" y2="${y}"/><circle data-ring="${key}" data-i="${i}" class="pc-wg13-node ${key}" cx="${x}" cy="${y}" r="13"/><text data-label="${key}" data-i="${i}" class="pc-wg13-label" x="${x}" y="${y}">${i}</text>`}return s;
  }
  function frame(){
    const balloon='<g class="pc-wg13-balloon" aria-label="RED BALLOON selected observer"><path d="M593 170 C575 140 583 108 612 98 C643 88 670 108 672 137 C674 167 649 189 620 188 L610 205 Z"/><circle cx="625" cy="139" r="30"/><path class="pc-wg13-balloon-string" d="M611 199 C592 232 631 246 610 280"/><text x="625" y="142">RB</text></g>';
    if(view==='TOP_IJ')return `<g class="pc-wg13-cube top"><path d="M165 95H555V485H165Z M215 145H505V435H215Z"/></g>${topRing(7,220,'wheel7','W7','#ffca3a','+1')}${topRing(8,163,'wheel8','W8','#ef67b0','−1')}${topRing(13,103,'gate13','G13','#4ddbc7','+1')}<line class="pc-wg13-axis axis-i" x1="95" y1="290" x2="625" y2="290"/><line class="pc-wg13-axis axis-j" x1="360" y1="42" x2="360" y2="538"/><text class="pc-wg13-axis-name" x="628" y="284">i</text><text class="pc-wg13-axis-name" x="370" y="48">j</text>${balloon}`;
    if(view==='SIDE_IK')return `<g class="pc-wg13-cube side"><path d="M145 165 L360 80 575 165 575 405 360 500 145 405Z M145 165 L360 260 575 165 M360 260V500"/></g>${sideRing(7,220,74,'wheel7','W7','#ffca3a','+1',250)}${sideRing(8,174,60,'wheel8','W8','#ef67b0','−1',330)}${sideRing(13,105,38,'gate13','G13','#4ddbc7','+1',290)}<line class="pc-wg13-axis axis-i" x1="88" y1="290" x2="632" y2="290"/><line class="pc-wg13-axis axis-k" x1="360" y1="42" x2="360" y2="540"/><text class="pc-wg13-axis-name" x="636" y="284">i</text><text class="pc-wg13-axis-name" x="370" y="48">k</text>${balloon}`;
    return `<g class="pc-wg13-cube transverse"><path d="M165 110 L545 150 555 470 175 430Z"/></g><path class="pc-wg13-plane" d="M90 245 L570 205 635 350 155 390 Z"/><text class="pc-wg13-plane-label" x="112" y="236">ΠT · z=0 · SAMPLING / RETURN</text>${sideRing(7,220,60,'wheel7','W7','#ffca3a','+1',286)}${sideRing(8,170,48,'wheel8','W8','#ef67b0','−1',300)}${sideRing(13,104,30,'gate13','G13','#4ddbc7','+1',293)}<line class="pc-wg13-axis axis-k" x1="360" y1="44" x2="360" y2="535"/><text class="pc-wg13-axis-name" x="370" y="52">k</text>${balloon}`;
  }
  function draw(record){
    svg.dataset.view=view;
    svg.innerHTML=`<title>${esc(view)} projection of the same W7 W8 G13 state at step ${record.displayStep}; RED BALLOON is display-only</title>${frame()}<circle class="pc-wg13-center" cx="360" cy="290" r="58"/><text x="360" y="278" class="pc-wg13-center-title">STEP</text><text data-pc-wg13-center x="360" y="316" class="pc-wg13-center-step">${record.displayStep}</text>`;
  }
  function applyState(record){
    Object.entries(record.state).forEach(([key,val])=>{regs[key].textContent=val;root.querySelectorAll(`[data-ring="${key}"],[data-label="${key}"]`).forEach(el=>el.classList.toggle('active',Number(el.dataset.i)===val))});
  }
  function render(value){
    const record=M.wheelGate13Record(value);slider.value=record.displayStep;out.textContent=`${record.displayStep} / 729`;status.textContent=record.classification.replaceAll('_',' · ');status.dataset.state=record.classification;
    draw(record);applyState(record);
    root.querySelectorAll('[data-pc-wg13-preset]').forEach(button=>button.setAttribute('aria-pressed',String(Number(button.dataset.pcWg13Preset)===record.displayStep)));
  }
  function stop(){if(timer){clearInterval(timer);timer=null}root.querySelector('[data-pc-wg13-play]').textContent='PLAY'}
  root.addEventListener('click',event=>{
    const button=event.target.closest('button');if(!button)return;
    if(button.matches('[data-pc-wg13-view]')){view=button.dataset.pcWg13View;root.querySelectorAll('[data-pc-wg13-view]').forEach(item=>item.setAttribute('aria-pressed',String(item===button)));render(Number(slider.value));return}
    if(button.matches('[data-pc-wg13-preset]')){stop();render(Number(button.dataset.pcWg13Preset))}
    else if(button.matches('[data-pc-wg13-prev]')){stop();render(Math.max(0,Number(slider.value)-1))}
    else if(button.matches('[data-pc-wg13-next]')){stop();render(Math.min(729,Number(slider.value)+1))}
    else if(button.matches('[data-pc-wg13-play]')){if(timer){stop();return}button.textContent='PAUSE';timer=setInterval(()=>{const next=Number(slider.value)+1;if(next>728){stop();render(728)}else render(next)},55)}
  });
  slider.addEventListener('input',()=>{stop();render(Number(slider.value))});render(0);
})();
