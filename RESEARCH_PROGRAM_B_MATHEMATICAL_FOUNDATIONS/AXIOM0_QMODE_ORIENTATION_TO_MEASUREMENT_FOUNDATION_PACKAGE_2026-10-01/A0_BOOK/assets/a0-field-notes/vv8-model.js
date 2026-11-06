(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  else root.A0VV8=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  const TAU=Math.PI*2;
  const clamp=(value,min,max)=>Math.min(max,Math.max(min,value));
  const clean=value=>Math.abs(value)<1e-10?0:value;
  function state(phase,amplitude=1){
    const k=((Math.trunc(Number(phase)||0)%8)+8)%8;
    const A=clamp(Number(amplitude)||0,0,1);
    const theta=k*Math.PI/4;
    const up=clean(A*Math.sin(theta));
    const down=clean(-up);
    return Object.freeze({k,A,theta,up,down,sum:clean(up+down),difference:clean(up-down),opposite:(k+4)%8,returnsTo:(k+1)%8});
  }
  const DIRECTIONS=Object.freeze(['MW','MA','OJ','KK']);
  const VIEWS=Object.freeze(['M','E','Σ','∑','Euler Disc','World View']);
  const VIEW_BY_PHASE=Object.freeze([0,1,2,3,4,4,5,5]);
  function shellState(phase){
    const k=((Math.trunc(Number(phase)||0)%8)+8)%8;
    const directionIndex=Math.floor(k/2),viewIndex=VIEW_BY_PHASE[k];
    return Object.freeze({k,directionIndex,direction:DIRECTIONS[directionIndex],viewIndex,view:VIEWS[viewIndex]});
  }
  function counterState(value){
    const n=Math.max(0,Math.trunc(Number(value)||0));
    const q8=Math.floor(n/8),r8=n%8,q5=Math.floor(n/5),r5=n%5,q40=Math.floor(n/40),r40=n%40;
    return Object.freeze({n,q8,r8,q5,r5,q40,r40,decimal8:n/8,spoke:r5,phase:r8,jointReturn:r40===0});
  }
  function pascalRow(value){
    const n=Math.max(0,Math.min(40,Math.trunc(Number(value)||0))),row=[1n];
    for(let k=1;k<=n;k++)row.push(row[k-1]*BigInt(n-k+1)/BigInt(k));
    return Object.freeze(row);
  }
  function pascalState(value,mode='value',modulus=8){
    const n=Math.max(0,Math.trunc(Number(value)||0)),r40=n%40;
    const row=n===0?0:(r40===0?40:r40),cycle=n===0?0:Math.floor((n-1)/40),coefficients=pascalRow(row);
    const normalizedMode=['value','parity','residue'].includes(mode)?mode:'value';
    const normalizedModulus=[5,8,40].includes(Number(modulus))?Number(modulus):8;
    return Object.freeze({n,row,cycle,mode:normalizedMode,modulus:normalizedModulus,coefficients,odd:coefficients.filter(value=>value%2n===1n).length});
  }
  function radialState(binaryExponent=8,ternaryExponent=4){
    const b=Math.max(0,Math.min(16,Math.trunc(Number(binaryExponent)||0)));
    const t=Math.max(0,Math.min(12,Math.trunc(Number(ternaryExponent)||0)));
    const binary=2n**BigInt(b),binaryOuter=2n**BigInt(b+1),ternary=3n**BigInt(t);
    return Object.freeze({binaryExponent:b,ternaryExponent:t,binary,binaryOuter,ternary,innerRatio:Number(binary)/Number(ternary),outerRatio:Number(binaryOuter)/Number(ternary)});
  }
  function jCalibrationState(value=0){
    const units=Math.max(0,Math.min(24000,Math.trunc(Number(value)||0)));
    return Object.freeze({units,degrees:units/24000*360,quarter:Math.floor(units/6000),phase8:units===24000?0:Math.floor(units/3000)%8,spoke5:units===24000?0:Math.floor(units/4800)%5,fullReturn:units===24000,unitsPerDegree:24000/360});
  }
  function cockpitState(value=0){
    const j=jCalibrationState(value),outer=j.fullReturn?0:Math.floor(j.units/2000)%12,pentagon=j.fullReturn?0:Math.floor(j.units/4800)%5,fine=j.fullReturn?0:Math.floor(j.units/400)%60;
    const orientations=['1','i','j','k'];
    const reverse=(12-outer)%12,activeFace=fine%2===0?'A':'B',kbv=true,kuv=true,kcv=true,eBit=Number(kbv&&kuv&&kcv),dataAddress='A'+outer+'|B'+reverse+'|P'+(pentagon+1)+'|F'+fine;
    const preReturn=j.units>=22800&&!j.fullReturn,toleranceStatus=j.fullReturn?'EXACT RETURN':preReturn?'PRE-RETURN · 5%':'OPEN';
    return Object.freeze({j,forward:outer,reverse,pentagon,fine,orientation:orientations[Math.min(3,Math.floor((j.fullReturn?0:j.units)/6000))],activeFace,band:'CC · HELD',preReturn,toleranceStatus,microBracket:Object.freeze({left:22.80,pivot:22.81,right:22.82,width:0.02}),gates:Object.freeze({kbv,kuv,kcv,eBit,dataAddress}),jointReturn:j.fullReturn});
  }
  const I_ADDRESSES=Object.freeze(['ALU','ARU','ARO','ALO','ILU','IRU','IRO','ILO']);
  function iAxisState(value=0,mode='register'){
    const j=jCalibrationState(value),normalizedMode=['register','witness','cut'].includes(mode)?mode:'register',index=j.phase8,address=I_ADDRESSES[index];
    const labels={register:'8 · REGISTER',witness:'8+1 · WITNESS',cut:'8−1 · ACTIVE CUT'};
    return Object.freeze({j,mode:normalizedMode,modeLabel:labels[normalizedMode],index,address,witness:normalizedMode==='witness',cut:normalizedMode==='cut',fieldCount:normalizedMode==='register'?'8/8':normalizedMode==='witness'?'8 + I':'7 + 1 CUT'});
  }
  function radialFromJState(value=0){
    const j=jCalibrationState(value);
    return radialState(Math.floor(j.units/3000),Math.floor(j.units/6000));
  }
  function driveState(value=0,mode='2wd'){
    const j=jCalibrationState(value),normalizedMode=mode==='4wd'?'4wd':'2wd';
    const wheels=Object.freeze([0,1,2,3].map(index=>Object.freeze({index,active:normalizedMode==='4wd'||index<2,degrees:normalizedMode==='4wd'||index<2?j.degrees:0})));
    return Object.freeze({mode:normalizedMode,j,wheels,axleA:'DRIVE',axleB:normalizedMode==='4wd'?'DRIVE':'WITNESS',zither:normalizedMode==='4wd'?'COUPLED':'OPEN'});
  }
  const signed=value=>(value>0?'+':'')+value.toFixed(3);
  function mount(doc){
    const root=doc.getElementById('vv8-model');
    if(!root)return null;
    const phaseButtons=[...root.querySelectorAll('[data-vv8-phase]')];
    const nodes=[...root.querySelectorAll('[data-vv8-node]')];
    const play=root.querySelector('[data-vv8-play]');
    const step=root.querySelector('[data-vv8-step]');
    const amplitude=root.querySelector('[data-vv8-amplitude]');
    const amplitudeLabel=root.querySelector('[data-vv8-amplitude-label]');
    const upMarker=root.querySelector('[data-vv8-up-marker]');
    const downMarker=root.querySelector('[data-vv8-down-marker]');
    const upPath=root.querySelector('[data-vv8-up-path]');
    const downPath=root.querySelector('[data-vv8-down-path]');
    const hand=root.querySelector('[data-vv8-hand]');
    const discHand=root.querySelector('[data-vv8-disc-hand]');
    const corners=[...root.querySelectorAll('[data-vv8-corner]')];
    const viewStages=[...root.querySelectorAll('[data-vv8-view-stage]')];
    const directionOutput=root.querySelector('[data-vv8-direction]');
    const viewOutput=root.querySelector('[data-vv8-view]');
    const spokes=[...root.querySelectorAll('[data-vv8-spoke]')];
    const carrierPoints=[...root.querySelectorAll('[data-vv8-carrier-point]')];
    const counterOutputs=[...root.querySelectorAll('[data-vv8-counter]')];
    const add25=root.querySelector('[data-vv8-add25]');
    const reset=root.querySelector('[data-vv8-reset]');
    const pascalGrid=root.querySelector('[data-vv8-pascal-grid]');
    const pascalModes=[...root.querySelectorAll('[data-vv8-pascal-mode]')];
    const pascalModulus=root.querySelector('[data-vv8-pascal-modulus]');
    const pascalOutputs=[...root.querySelectorAll('[data-vv8-pascal-output]')];
    const radialGrids=[...root.querySelectorAll('[data-vv8-radix-grid]')];
    const radialOutputs=[...root.querySelectorAll('[data-vv8-radix-output]')];
    const jHand=root.querySelector('[data-vv8-j-hand]');
    const jOutputs=[...root.querySelectorAll('[data-vv8-j-output]')];
    const jAddButtons=[...root.querySelectorAll('[data-vv8-j-add]')];
    const jReset=root.querySelector('[data-vv8-j-reset]');
    const cockpitHands=[...root.querySelectorAll('[data-vv8-cockpit-hand]')];
    const cockpitAddresses=[...root.querySelectorAll('[data-vv8-cockpit-address]')];
    const cockpitPentagons=[...root.querySelectorAll('[data-vv8-cockpit-pent]')];
    const cockpitAnnulusTicks=[...root.querySelectorAll('[data-vv8-cockpit-annulus]')];
    const cockpitFaces=[...root.querySelectorAll('[data-vv8-cockpit-face]')];
    const cockpitBand=root.querySelector('[data-vv8-cockpit-band]');
    const cockpitOrientation=root.querySelector('[data-vv8-cockpit-orientation]');
    const cockpitOutputs=[...root.querySelectorAll('[data-vv8-cockpit-output]')];
    const iAxis=root.querySelector('.vv8-i-axis');
    const iModeButtons=[...root.querySelectorAll('[data-vv8-i-mode]')];
    const iAddresses=[...root.querySelectorAll('[data-vv8-i-address]')];
    const iPointer=root.querySelector('[data-vv8-i-pointer]');
    const iWitness=root.querySelector('[data-vv8-i-witness]');
    const iWitnessLabel=root.querySelector('[data-vv8-i-witness-label]');
    const iCutMark=root.querySelector('[data-vv8-i-cut-mark]');
    const iCutAddress=root.querySelector('[data-vv8-i-cut-address]');
    const iOutputs=[...root.querySelectorAll('[data-vv8-i-output]')];
    const iReceipt=root.querySelector('[data-vv8-i-receipt]');
    const driveModeButtons=[...root.querySelectorAll('[data-vv8-drive-mode]')];
    const driveWheels=[...root.querySelectorAll('[data-vv8-drive-wheel]')];
    const driveHands=[...root.querySelectorAll('[data-vv8-drive-hand]')];
    const driveAxles=[...root.querySelectorAll('[data-vv8-drive-axle]')];
    const driveZither=root.querySelector('[data-vv8-drive-zither]');
    const driveOutputs=[...root.querySelectorAll('[data-vv8-drive-output]')];
    const outputs=Object.fromEntries(['phase','theta','up','down','sum','difference','return'].map(key=>[key,root.querySelector('[data-vv8-output="'+key+'"]')]));
    let k=0,steps=0,jUnits=0,timer=null,pascalMode='value',driveMode='2wd',iMode='register';
    const stop=()=>{if(timer!==null){clearInterval(timer);timer=null;}play?.setAttribute('aria-pressed','false');if(play)play.textContent='Puls starten';};
    function render(next=k){
      k=((Math.trunc(next)%8)+8)%8;
      const s=state(k,amplitude?.value??1);
      const shell=shellState(k);
      if(amplitudeLabel)amplitudeLabel.textContent=s.A.toFixed(2);
      const yUp=210-s.up*92,yDown=210-s.down*92;
      upMarker?.setAttribute('cy',yUp.toFixed(2));
      downMarker?.setAttribute('cy',yDown.toFixed(2));
      upPath?.setAttribute('d','M150 '+yUp.toFixed(2)+' L400 210');
      downPath?.setAttribute('d','M650 '+yDown.toFixed(2)+' L400 210');
      const hx=400+Math.cos(s.theta)*92,hy=210-Math.sin(s.theta)*92;
      hand?.setAttribute('x2',hx.toFixed(2));hand?.setAttribute('y2',hy.toFixed(2));
      const dx=400+Math.cos(s.theta)*40,dy=126-Math.sin(s.theta)*40;
      discHand?.setAttribute('x2',dx.toFixed(2));discHand?.setAttribute('y2',dy.toFixed(2));
      corners.forEach(corner=>corner.classList.toggle('active',Number(corner.dataset.vv8Corner)===shell.directionIndex));
      viewStages.forEach(stage=>{const active=Number(stage.dataset.vv8ViewStage)===shell.viewIndex;stage.classList.toggle('active',active);if(active)stage.setAttribute('aria-current','step');else stage.removeAttribute('aria-current');});
      if(directionOutput)directionOutput.textContent=shell.direction;
      if(viewOutput)viewOutput.textContent=shell.view;
      phaseButtons.forEach(button=>button.setAttribute('aria-pressed',String(Number(button.dataset.vv8Phase)===s.k)));
      nodes.forEach(node=>{const n=Number(node.dataset.vv8Node);node.classList.toggle('active',n===s.k);node.classList.toggle('opposite',n===s.opposite);});
      outputs.phase.textContent=s.k+'/8';outputs.theta.textContent=s.k+'π/4';outputs.up.textContent=signed(s.up);outputs.down.textContent=signed(s.down);outputs.sum.textContent=signed(s.sum);outputs.difference.textContent=signed(s.difference);outputs.return.textContent=s.k===7?'7 → 0 · 2π':'→ '+s.returnsTo+'/8';
      const count=counterState(steps);
      spokes.forEach(spoke=>spoke.classList.toggle('active',Number(spoke.dataset.vv8Spoke)===count.spoke));
      carrierPoints.forEach(point=>point.classList.toggle('active',Number(point.dataset.vv8CarrierPoint)===count.spoke));
      const values={steps:String(count.n),spoke:String(count.spoke+1),decimal8:count.decimal8.toFixed(3),register8:count.q8+' · R'+count.r8,register5:count.q5+' · R'+count.r5,register40:count.q40+' · R'+count.r40,offset:count.r8+'/8 ↔ '+count.r5+'/5',division:count.n+'/8 = '+count.decimal8.toFixed(3)+' = '+count.q8+' + '+count.r8+'/8'};
      counterOutputs.forEach(output=>{const value=values[output.dataset.vv8Counter];if(value!==undefined)output.textContent=value;});
      const pascal=pascalState(steps,pascalMode,pascalModulus?.value??8);
      pascalModes.forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.vv8PascalMode===pascal.mode)));
      const pascalValues={cycle:String(pascal.cycle),row:String(pascal.row),cells:String(pascal.row+1),sum:'2^'+pascal.row,odd:String(pascal.odd)};
      pascalOutputs.forEach(output=>{const value=pascalValues[output.dataset.vv8PascalOutput];if(value!==undefined)output.textContent=value;});
      if(pascalGrid){
        const fragment=doc.createDocumentFragment();
        for(let rowIndex=0;rowIndex<=pascal.row;rowIndex++){
          const row=pascalRow(rowIndex),maxLog=Math.max(1,rowIndex);
          row.forEach((coefficient,column)=>{
            const circle=doc.createElementNS('http://www.w3.org/2000/svg','circle');
            const residue=Number(coefficient%BigInt(pascal.modulus));
            let opacity=Math.max(.12,Math.log2(Number(coefficient)+1)/(maxLog+1));
            if(pascal.mode==='parity')opacity=coefficient%2n===1n?1:.07;
            if(pascal.mode==='residue')opacity=residue===0?.07:.25+.75*residue/(pascal.modulus-1);
            circle.setAttribute('cx',(400+(column-rowIndex/2)*18).toFixed(2));
            circle.setAttribute('cy',(24+rowIndex*12).toFixed(2));
            circle.setAttribute('r',rowIndex>32?'3.3':'4.1');
            circle.setAttribute('class','vv8-pascal-dot spoke-'+(column%5)+(coefficient%2n===1n?' odd':' even'));
            circle.setAttribute('fill-opacity',opacity.toFixed(3));
            const title=doc.createElementNS('http://www.w3.org/2000/svg','title');
            title.textContent='P('+rowIndex+','+column+') = '+coefficient+' · Phase '+(column%8)+'/8 · T'+(column%5+1)+(pascal.mode==='residue'?' · R'+residue+' mod '+pascal.modulus:'');
            circle.appendChild(title);fragment.appendChild(circle);
          });
        }
        pascalGrid.replaceChildren(fragment);
      }
      const j=jCalibrationState(jUnits);
      const radial=radialFromJState(jUnits);
      const radialValues={expression:'2^'+radial.binaryExponent+' / 3^'+radial.ternaryExponent,binaryLabel:'2^'+radial.binaryExponent,binaryOuterLabel:'2^'+(radial.binaryExponent+1),ternaryLabel:'3^'+radial.ternaryExponent,innerExpression:'2^'+radial.binaryExponent+' / 3^'+radial.ternaryExponent,outerExpression:'2^'+(radial.binaryExponent+1)+' / 3^'+radial.ternaryExponent,binary:String(radial.binary),binaryOuter:String(radial.binaryOuter),ternary:String(radial.ternary),innerRatio:radial.innerRatio.toFixed(5),outerRatio:radial.outerRatio.toFixed(5)};
      radialOutputs.forEach(output=>{const value=radialValues[output.dataset.vv8RadixOutput];if(value!==undefined)output.textContent=value;});
      radialGrids.forEach(group=>{
        const binary=group.dataset.vv8RadixGrid==='binary',levels=binary?radial.binaryExponent+1:radial.ternaryExponent;
        const fragment=doc.createDocumentFragment();
        for(let level=1;level<=levels;level++){
          const y=40+level*(binary?21:45),half=18+level*(binary?13:28);
          const tier=doc.createElementNS('http://www.w3.org/2000/svg','path');
          tier.setAttribute('d','M'+(180-half)+' '+y+' L180 '+(y-(binary?13:25))+' L'+(180+half)+' '+y);
          tier.setAttribute('class','vv8-radix-tier '+(binary?(level===levels?'gold':'cyan'):(level===levels?'gold':'violet')));
          const title=doc.createElementNS('http://www.w3.org/2000/svg','title');
          title.textContent=(binary?'2':'3')+'^'+level+' = '+String(BigInt(binary?2:3)**BigInt(level));
          tier.appendChild(title);fragment.appendChild(tier);
        }
        group.replaceChildren(fragment);
      });
      const jAngle=-Math.PI/2+j.degrees*Math.PI/180;
      jHand?.setAttribute('x2',(300+Math.cos(jAngle)*155).toFixed(2));jHand?.setAttribute('y2',(220+Math.sin(jAngle)*155).toFixed(2));
      const jValues={units:String(j.units),degrees:j.degrees.toFixed(j.degrees%1?1:0)+'°',quarter:Math.min(4,j.quarter)+'/4',phase8:j.phase8+'/8',spoke5:'T'+(j.spoke5+1),status:j.fullReturn?'FULL RETURN':j.units===0?'START':'OPEN',binaryCount:j.units.toString(2)+'₂',ternaryCount:j.units.toString(3)+'₃'};
      jOutputs.forEach(output=>{const value=jValues[output.dataset.vv8JOutput];if(value!==undefined)output.textContent=value;});
      jAddButtons.forEach(button=>button.disabled=j.fullReturn);
      const cockpit=cockpitState(jUnits);
      cockpitHands.forEach(line=>{const sign=line.dataset.vv8CockpitHand==='reverse'?-1:1,angle=-Math.PI/2+sign*j.degrees*Math.PI/180;line.setAttribute('x2',(360+Math.cos(angle)*172).toFixed(2));line.setAttribute('y2',(260+Math.sin(angle)*172).toFixed(2));});
      cockpitAddresses.forEach(address=>{const value=Number(address.dataset.vv8CockpitAddress);address.classList.toggle('forward',value===cockpit.forward);address.classList.toggle('reverse',value===cockpit.reverse);});
      cockpitPentagons.forEach(point=>point.classList.toggle('active',Number(point.dataset.vv8CockpitPent)===cockpit.pentagon));
      cockpitAnnulusTicks.forEach(tick=>tick.classList.toggle('active',Number(tick.dataset.vv8CockpitAnnulus)===cockpit.fine));
      cockpitFaces.forEach(face=>face.classList.toggle('active',face.dataset.vv8CockpitFace===cockpit.activeFace));
      if(cockpitBand)cockpitBand.classList.toggle('held',cockpit.gates.kcv);
      if(cockpitOrientation)cockpitOrientation.textContent=cockpit.orientation;
      const cockpitValues={forward:'A'+cockpit.forward,reverse:'B'+cockpit.reverse,pentagon:'P'+(cockpit.pentagon+1),fine:cockpit.fine+'/60',orientation:cockpit.orientation,activeFace:cockpit.activeFace,band:cockpit.band,eBit:String(cockpit.gates.eBit),dataAddress:cockpit.gates.dataAddress,tolerance:cockpit.toleranceStatus,status:cockpit.jointReturn?'FULL RETURN':cockpit.j.units===0?'START':'OPEN'};
      cockpitOutputs.forEach(output=>{const value=cockpitValues[output.dataset.vv8CockpitOutput];if(value!==undefined)output.textContent=value;});
      const iState=iAxisState(jUnits,iMode);
      iModeButtons.forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.vv8IMode===iState.mode)));
      iAddresses.forEach(group=>{const index=Number(group.dataset.vv8IAddress),active=index===iState.index;group.classList.toggle('active',active);group.classList.toggle('cut',active&&iState.cut);});
      const activeIAddress=iAddresses[iState.index]?.querySelector('circle');
      if(activeIAddress&&iPointer){iPointer.setAttribute('x2',activeIAddress.getAttribute('cx'));iPointer.setAttribute('y2',activeIAddress.getAttribute('cy'));}
      iWitness?.classList.toggle('active',iState.witness);iWitnessLabel?.classList.toggle('active',iState.witness);
      iCutMark?.classList.toggle('active',iState.cut);if(iCutAddress){iCutAddress.textContent=iState.address;iCutAddress.classList.toggle('active',iState.cut);}
      if(iAxis)iAxis.dataset.mode=iState.mode;
      const iValues={modeLabel:iState.modeLabel,mode:iState.mode==='register'?'REGISTER':iState.mode==='witness'?'WITNESS':'ACTIVE CUT',address:iState.address,fieldCount:iState.fieldCount,witness:iState.witness?'I · ON':'OFF',phase:iState.index+'/8'};
      iOutputs.forEach(output=>{const value=iValues[output.dataset.vv8IOutput];if(value!==undefined)output.textContent=value;});
      if(iReceipt)iReceipt.innerHTML='J '+iState.index+'/8 · I → '+iState.address+'<br>Layer: CORNER · Mode: '+iValues.mode+'<br>Return: '+(iState.j.fullReturn?'FULL RETURN':iState.j.units===0?'START':'OPEN');
      const drive=driveState(jUnits,driveMode);
      driveModeButtons.forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.vv8DriveMode===drive.mode)));
      driveWheels.forEach(wheel=>{const item=drive.wheels[Number(wheel.dataset.vv8DriveWheel)];wheel.classList.toggle('active',item.active);wheel.classList.toggle('witness',!item.active);});
      driveHands.forEach(line=>{const item=drive.wheels[Number(line.dataset.vv8DriveHand)],cx=Number(line.getAttribute('x1')),cy=Number(line.getAttribute('y1')),angle=-Math.PI/2+item.degrees*Math.PI/180;line.setAttribute('x2',(cx+Math.cos(angle)*36).toFixed(2));line.setAttribute('y2',(cy+Math.sin(angle)*36).toFixed(2));});
      driveAxles.forEach(axle=>{const active=axle.dataset.vv8DriveAxle==='a'||drive.mode==='4wd';axle.classList.toggle('active',active);axle.classList.toggle('witness',!active);});
      driveZither?.classList.toggle('active',drive.mode==='4wd');
      const driveValues={mode:drive.mode.toUpperCase(),degrees:j.degrees.toFixed(j.degrees%1?1:0)+'°',axleA:drive.axleA,axleB:drive.axleB,zither:drive.zither};
      driveOutputs.forEach(output=>{const value=driveValues[output.dataset.vv8DriveOutput];if(value!==undefined)output.textContent=value;});
      root.dataset.phase=String(s.k);
      root.dataset.steps=String(count.n);
      root.dataset.pascalMode=pascal.mode;
      return s;
    }
    const advance=(amount=1)=>{steps=Math.max(0,steps+Math.trunc(Number(amount)||0));return render(steps%8);};
    phaseButtons.forEach(button=>button.addEventListener('click',()=>{stop();const target=Number(button.dataset.vv8Phase),distance=(target-k+8)%8;if(distance)advance(distance);else render(k);}));
    step?.addEventListener('click',()=>{stop();advance(1);});
    add25?.addEventListener('click',()=>{stop();advance(25);});
    reset?.addEventListener('click',()=>{stop();steps=0;render(0);});
    pascalModes.forEach(button=>button.addEventListener('click',()=>{pascalMode=button.dataset.vv8PascalMode;render(k);}));
    pascalModulus?.addEventListener('change',()=>render(k));
    jAddButtons.forEach(button=>button.addEventListener('click',()=>{stop();jUnits=Math.min(24000,jUnits+Number(button.dataset.vv8JAdd));render(k);}));
    jReset?.addEventListener('click',()=>{stop();jUnits=0;render(k);});
    iModeButtons.forEach(button=>button.addEventListener('click',()=>{iMode=button.dataset.vv8IMode;render(k);}));
    driveModeButtons.forEach(button=>button.addEventListener('click',()=>{driveMode=button.dataset.vv8DriveMode;render(k);}));
    amplitude?.addEventListener('input',()=>render(k));
    play?.addEventListener('click',()=>{if(timer!==null){stop();return;}play.setAttribute('aria-pressed','true');play.textContent='Puls halten';timer=setInterval(()=>advance(1),620);});
    render(0);
    return{render,advance,stop,getState:()=>state(k,amplitude?.value??1),getShellState:()=>shellState(k),getCounterState:()=>counterState(steps),getPascalState:()=>pascalState(steps,pascalMode,pascalModulus?.value??8),getRadialState:()=>radialFromJState(jUnits),getJCalibrationState:()=>jCalibrationState(jUnits),getCockpitState:()=>cockpitState(jUnits),getIAxisState:()=>iAxisState(jUnits,iMode),getDriveState:()=>driveState(jUnits,driveMode),tau:TAU};
  }
  return Object.freeze({TAU,DIRECTIONS,VIEWS,I_ADDRESSES,state,shellState,counterState,pascalRow,pascalState,radialState,jCalibrationState,cockpitState,iAxisState,radialFromJState,driveState,mount});
});
