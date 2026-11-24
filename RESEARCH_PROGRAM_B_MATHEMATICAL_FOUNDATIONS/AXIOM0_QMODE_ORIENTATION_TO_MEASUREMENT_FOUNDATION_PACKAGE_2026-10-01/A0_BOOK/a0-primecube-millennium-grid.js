(function(root,factory){
  const api=factory(root&&root.A0PrimecubeModel);
  if(typeof module==='object'&&module.exports)module.exports=api;
  if(root)root.A0PrimecubeMillenniumGrid=api;
})(typeof window!=='undefined'?window:globalThis,function(Model){
  'use strict';
  const COLORS={bg:'#09131f',grid:'#1c344b',cyan:'#55dcef',blue:'#70a8ff',gold:'#f0c84b',red:'#ff5f61',text:'#dbe8f8',muted:'#71849d'};
  const fmt=n=>Number(n).toLocaleString('de-DE');
  const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));

  function setupCanvas(canvas,height){
    const dpr=Math.min(2,window.devicePixelRatio||1),width=Math.max(320,canvas.clientWidth||900);
    canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);
    const ctx=canvas.getContext('2d');ctx.setTransform(dpr,0,0,dpr,0,0);return {ctx,width,height};
  }
  function line(ctx,x1,y1,x2,y2,color,width=1,dash=[]){ctx.beginPath();ctx.setLineDash(dash);ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.strokeStyle=color;ctx.lineWidth=width;ctx.stroke();ctx.setLineDash([])}
  function text(ctx,value,x,y,color=COLORS.text,size=11,align='left'){ctx.fillStyle=color;ctx.font=`700 ${size}px ui-monospace,monospace`;ctx.textAlign=align;ctx.fillText(value,x,y)}

  function drawMacro(canvas,record){
    const {ctx,width,height}=setupCanvas(canvas,440),p={l:54,r:22,t:28,b:40},w=width-p.l-p.r,h=height-p.t-p.b;
    ctx.fillStyle=COLORS.bg;ctx.fillRect(0,0,width,height);
    ctx.fillStyle='#0b1725';ctx.fillRect(p.l,p.t,w,h);
    for(let i=0;i<=10;i++){const x=p.l+w*i/10,y=p.t+h*i/10;line(ctx,x,p.t,x,p.t+h,COLORS.grid);line(ctx,p.l,y,p.l+w,y,COLORS.grid)}
    const d=record.cut.divisor;
    if(d===5040){
      for(let b=1;b<=198;b++){
        const n=b*d,y=Math.floor((n-1)/1000),x=(n-1)%1000;
        const px=p.l+w*x/1000,py=p.t+h*y/1000;
        if(b%25===0)line(ctx,p.l,py,p.l+w,py,'#6c8098',1,[5,5]);
        line(ctx,px,Math.max(p.t,py-h*5.04/1000),px,py,b%25===0?COLORS.gold:'#335f7a',b%25===0?1.5:.7);
      }
      ctx.fillStyle='rgba(255,95,97,.34)';ctx.fillRect(p.l+w*.92,p.t+h*.997,w*.08,h*.001);ctx.fillRect(p.l,p.t+h*.998,w,h*.002);
      text(ctx,'25 blocks → +1000 columns → sync',p.l+12,p.t+19,COLORS.gold,11);
    }else if(d===108000){
      for(let b=1;b<=9;b++){const py=p.t+h*(b*108/1000);line(ctx,p.l,py,p.l+w,py,COLORS.blue,1.5);text(ctx,`B${b}`,p.l+7,py-5,COLORS.blue,9)}
      ctx.fillStyle='rgba(255,95,97,.3)';ctx.fillRect(p.l,p.t+h*.972,w,h*.028);text(ctx,'28.000 residual',p.l+w-10,p.t+h*.986,COLORS.red,11,'right');
    }else{
      for(let y=0;y<=1000;y+=25)line(ctx,p.l,p.t+h*y/1000,p.l+w,p.t+h*y/1000,y%100===0?COLORS.gold:'#29445c',y%100===0?1.1:.55);
      text(ctx,'1000 × 1000 · exact rows · residual 0',p.l+12,p.t+19,COLORS.gold,11);
    }
    const sx=p.l+w*record.squareAddress.x/999,sy=p.t+h*record.squareAddress.y/999;
    ctx.beginPath();ctx.arc(sx,sy,5,0,Math.PI*2);ctx.fillStyle='#fff';ctx.fill();ctx.beginPath();ctx.arc(sx,sy,10,0,Math.PI*2);ctx.strokeStyle=COLORS.cyan;ctx.lineWidth=2;ctx.stroke();
    for(let i=0;i<=4;i++){text(ctx,String(i*250),p.l+w*i/4,height-14,COLORS.muted,9,'center');text(ctx,String(i*250),p.l-8,p.t+h*i/4,COLORS.muted,9,'right')}
  }

  function drawLoupe(canvas,record){
    const {ctx,width,height}=setupCanvas(canvas,230),p={l:62,r:20,t:20,b:34},w=width-p.l-p.r,h=height-p.t-p.b;
    ctx.fillStyle=COLORS.bg;ctx.fillRect(0,0,width,height);
    const rows=[996,997,998,999,1000],rh=h/5,d=record.cut.divisor;
    rows.forEach((label,i)=>{const y=p.t+i*rh;ctx.fillStyle=i<2?'rgba(77,137,219,.26)':'rgba(255,95,97,.26)';ctx.fillRect(p.l,y,w,rh);line(ctx,p.l,y,p.l+w,y,COLORS.grid);text(ctx,`Z ${label}`,p.l-8,y+rh*.58,COLORS.muted,9,'right')});
    if(d===5040){ctx.fillStyle='rgba(77,137,219,.42)';ctx.fillRect(p.l,p.t+2*rh,w*.92,rh);line(ctx,p.l+w*.92,p.t+2*rh,p.l+w*.92,p.t+3*rh,COLORS.red,3);text(ctx,'920 covered',p.l+w*.46,p.t+2.6*rh,COLORS.blue,11,'center');text(ctx,'80',p.l+w*.96,p.t+2.6*rh,COLORS.red,11,'center')}
    else if(d===108000){ctx.fillStyle='rgba(255,95,97,.25)';ctx.fillRect(p.l,p.t,w,h);text(ctx,'residual extends through last 28 rows',p.l+w/2,p.t+h/2,COLORS.red,11,'center')}
    else{text(ctx,'exact 1000-address rows · no residual',p.l+w/2,p.t+h/2,COLORS.gold,11,'center')}
    const x=p.l+w*record.squareAddress.x/999,y=p.t+(record.squareAddress.y-995)*rh+rh/2;
    if(y>=p.t&&y<=p.t+h){ctx.beginPath();ctx.arc(x,y,6,0,Math.PI*2);ctx.fillStyle='#fff';ctx.fill();ctx.beginPath();ctx.arc(x,y,11,0,Math.PI*2);ctx.strokeStyle=COLORS.cyan;ctx.lineWidth=2;ctx.stroke()}
    [0,250,500,750,920,1000].forEach(v=>text(ctx,String(v),p.l+w*v/1000,height-11,COLORS.muted,9,'center'));
  }

  function init(scope){
    if(!Model||!Model.millenniumGridRecord)return;
    const q=s=>scope.querySelector(s),qa=s=>Array.from(scope.querySelectorAll(s));
    const input=q('[data-mg-address]'),macro=q('[data-mg-macro]'),loupe=q('[data-mg-loupe]');
    let divisor=5040,playing=false,timer=null;
    const out={record:q('[data-mg-record]'),role:q('[data-mg-role]'),square:q('[data-mg-square]'),cube:q('[data-mg-cube]'),cut:q('[data-mg-cut]'),residual:q('[data-mg-residual]'),crosswalk:q('[data-mg-crosswalk]'),ret:q('[data-mg-return]')};
    function render(){
      const rec=Model.millenniumGridRecord(Number(input.value),divisor);input.value=rec.sourceNumber;
      out.record.textContent=rec.recordId;out.role.textContent=divisor===5040?'5040 DRIFT / 126-ROW SYNC':divisor===108000?'108.000 CUT / 28-ROW RESIDUAL':'1000 ROW BLOCK / EXACT CLOSE';
      out.square.textContent=`[${rec.squareAddress.x}, ${rec.squareAddress.y}]`;out.cube.textContent=`[${rec.cubeAddress.a}, ${rec.cubeAddress.b}, ${rec.cubeAddress.c}]`;
      out.cut.textContent=`${rec.cut.fullBlocks} × ${fmt(divisor)} = ${fmt(rec.cut.covered)}`;out.residual.textContent=fmt(rec.cut.residual);
      out.crosswalk.textContent=`n₀=${fmt(rec.zeroBasedCrosswalk.n0)} · NP=${rec.zeroBasedCrosswalk.np} · RR=${rec.zeroBasedCrosswalk.rr}`;
      out.ret.textContent=`RETURN ${rec.return.squareExact&&rec.return.cubeExact?'EXACT':'FAIL'} · ${fmt(rec.return.n)}`;
      qa('[data-mg-divisor]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.mgDivisor)===divisor)));
      drawMacro(macro,rec);drawLoupe(loupe,rec);
    }
    input.addEventListener('change',render);input.addEventListener('input',render);
    qa('[data-mg-divisor]').forEach(b=>b.addEventListener('click',()=>{divisor=Number(b.dataset.mgDivisor);render()}));
    qa('[data-mg-preset]').forEach(b=>b.addEventListener('click',()=>{input.value=b.dataset.mgPreset;render()}));
    macro.addEventListener('click',event=>{const r=macro.getBoundingClientRect(),x=clamp(Math.floor((event.clientX-r.left)/r.width*1000),0,999),y=clamp(Math.floor((event.clientY-r.top)/r.height*1000),0,999);input.value=1+x+1000*y;render()});
    const play=q('[data-mg-play]');play.addEventListener('click',()=>{playing=!playing;play.setAttribute('aria-pressed',String(playing));play.textContent=playing?'Ⅱ Pause':'▶ Residual tour';clearInterval(timer);if(playing){const seq=[1,126000,882000,972000,997920,997921,1000000];let i=0;timer=setInterval(()=>{input.value=seq[i++%seq.length];render()},850)}});
    window.addEventListener('resize',render,{passive:true});render();
  }
  function initAll(){document.querySelectorAll('[data-pc-millennium-grid]').forEach(init)}
  if(typeof document!=='undefined'){if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initAll);else initAll()}
  return Object.freeze({initAll,drawMacro,drawLoupe});
});
