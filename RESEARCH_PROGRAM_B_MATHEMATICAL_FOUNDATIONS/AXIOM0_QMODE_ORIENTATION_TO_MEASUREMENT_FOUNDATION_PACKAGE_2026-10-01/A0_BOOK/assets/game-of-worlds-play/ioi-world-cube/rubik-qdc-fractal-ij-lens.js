(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  else{root.RubikQdcFractalIjLens=api;if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',api.mount);else api.mount();}
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const MAX_ITERATIONS=72;
  const DEFAULT_PHASE=111;
  const VIEW_MODES=Object.freeze(['mandelbrot','hinge','julia','split']);
  const clamp=(value,min,max)=>Math.max(min,Math.min(max,value));
  const phaseParameter=(degrees=DEFAULT_PHASE)=>{
    const phase=clamp(Number(degrees),0,360),angle=phase*Math.PI/180;
    return Object.freeze({phase,degrees:phase,pi:phase/180,re:-.55+.32*Math.cos(angle),im:.32*Math.sin(angle)});
  };
  const orbit=(zr,zi,cr,ci,maxIterations=MAX_ITERATIONS)=>{
    let iteration=0;
    while(iteration<maxIterations&&zr*zr+zi*zi<=4){const nextR=zr*zr-zi*zi+cr;zi=2*zr*zi+ci;zr=nextR;iteration+=1;}
    return Object.freeze({iteration,bounded:iteration===maxIterations,magnitude2:zr*zr+zi*zi});
  };
  const mandelbrotSample=(cr,ci,maxIterations=MAX_ITERATIONS)=>orbit(0,0,cr,ci,maxIterations);
  const juliaSample=(zr,zi,parameter,maxIterations=MAX_ITERATIONS)=>orbit(zr,zi,parameter.re,parameter.im,maxIterations);
  const relationRecord=(degrees=DEFAULT_PHASE)=>{
    const parameter=phaseParameter(degrees);
    return Object.freeze({
      parameter,
      mandelbrot:Object.freeze({plane:'C',role:'PARAMETER_SPACE',criticalOrbit:'z0=0'}),
      julia:Object.freeze({plane:'Z',role:'DYNAMICAL_SPACE',map:'z->z^2+c'}),
      markers:Object.freeze({I:'IMAGINARY_AXIS',J:'JULIA_FAMILY',L:'LOTUS_VIEW',pi:'PHASE_DISPLAY'}),
      shared:'PARAMETER_C_ONLY',
      identity:false,
      navigatorEffect:Object.freeze({nodes:0,relations:0,operators:0})
    });
  };
  const color=(iteration,bounded,maxIterations)=>{
    if(bounded)return [8,20,27,255];
    const t=iteration/maxIterations,glow=Math.pow(t,.55);
    return [Math.round(38+196*glow),Math.round(18+196*Math.max(0,1-Math.abs(t-.58)*2)),Math.round(88+156*(1-t)),255];
  };
  const renderFractal=(canvas,mode,parameter=phaseParameter(),maxIterations=MAX_ITERATIONS)=>{
    if(!canvas||typeof canvas.getContext!=='function')return false;
    const context=canvas.getContext('2d'),width=canvas.width,height=canvas.height,image=context.createImageData(width,height),pixels=image.data;
    for(let y=0;y<height;y+=1){
      const im=1.35-(y/(height-1))*2.7;
      for(let x=0;x<width;x+=1){
        const re=-2+(x/(width-1))*3;
        const sample=mode==='julia'?juliaSample(re,im,parameter,maxIterations):mandelbrotSample(re,im,maxIterations);
        const rgba=color(sample.iteration,sample.bounded,maxIterations),offset=(y*width+x)*4;
        pixels[offset]=rgba[0];pixels[offset+1]=rgba[1];pixels[offset+2]=rgba[2];pixels[offset+3]=255;
      }
    }
    context.putImageData(image,0,0);
    if(mode==='mandelbrot'){
      const px=(parameter.re+2)/3*width,py=(1.35-parameter.im)/2.7*height;
      context.beginPath();context.arc(px,py,5,0,Math.PI*2);context.fillStyle='#ec4d55';context.fill();context.strokeStyle='#fff0b5';context.lineWidth=2;context.stroke();
    }
    return true;
  };
  const formatSigned=value=>(value<0?'−':'+')+Math.abs(value).toFixed(4);
  const render=(root,degrees=DEFAULT_PHASE,view='split')=>{
    if(!VIEW_MODES.includes(view))throw new Error('Unknown Visual-2 view');
    const record=relationRecord(degrees),parameter=record.parameter;
    root.dataset.activeView=view;
    root.querySelectorAll('[data-rqdc-fij-view]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.rqdcFijView===view)));
    root.querySelector('[data-rqdc-fij-phase]').textContent=parameter.pi.toFixed(3)+'π';
    root.querySelector('[data-rqdc-fij-c]').textContent='c = '+parameter.re.toFixed(4)+' '+formatSigned(parameter.im)+'i';
    root.querySelector('[data-rqdc-fij-j]').textContent='Jc · z↦z²+c · same c';
    root.querySelector('[data-rqdc-fij-record]').textContent='c('+parameter.degrees+'°) · '+parameter.re.toFixed(3)+' '+formatSigned(parameter.im)+'i';
    root.querySelector('[data-rqdc-fij-status]').textContent=view.toUpperCase()+' · SAME c / DISTINCT PLANES';
    renderFractal(root.querySelector('[data-rqdc-fij-canvas="mandelbrot"]'),'mandelbrot',parameter);
    renderFractal(root.querySelector('[data-rqdc-fij-canvas="julia"]'),'julia',parameter);
    return record;
  };
  const mount=()=>{
    document.querySelectorAll('[data-rqdc-fractal-ij]').forEach(root=>{
      if(root.dataset.fijMounted==='true')return;
      root.dataset.fijMounted='true';
      const slider=root.querySelector('[data-rqdc-fij-slider]');
      root.querySelectorAll('[data-rqdc-fij-view]').forEach(button=>button.addEventListener('click',()=>render(root,slider.value,button.dataset.rqdcFijView)));
      slider.addEventListener('input',()=>render(root,slider.value,root.dataset.activeView||'split'));
      render(root,slider.value,'split');
    });
  };
  return {MAX_ITERATIONS,DEFAULT_PHASE,VIEW_MODES,clamp,phaseParameter,orbit,mandelbrotSample,juliaSample,relationRecord,color,renderFractal,render,mount};
});
