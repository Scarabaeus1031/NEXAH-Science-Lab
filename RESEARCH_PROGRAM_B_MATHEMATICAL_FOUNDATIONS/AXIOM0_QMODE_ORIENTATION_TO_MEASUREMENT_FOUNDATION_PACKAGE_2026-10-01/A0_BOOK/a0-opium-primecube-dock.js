(function(root,factory){
  const api=factory(root&&root.A0PrimecubeModel);
  if(typeof module==='object'&&module.exports)module.exports=api;
  if(root)root.A0OpiumPrimecubeDock=api;
})(typeof window!=='undefined'?window:globalThis,function(defaultModel){
  'use strict';

  const IDS=Object.freeze({
    host:'opiumPrimecubeDock',input:'opiumPrimecubeAddress',button:'opiumPrimecubeRead',status:'opiumPrimecubeStatus',
    record:'opiumPrimecubeRecord',base11:'opiumPrimecubeBase11',cube:'opiumPrimecubeCube',grid:'opiumPrimecubeGrid',prime:'opiumPrimecubePrime',return:'opiumPrimecubeReturn'
  });

  function read(n,model=defaultModel,dataset){
    if(!model||typeof model.numberRecord!=='function')throw new Error('Primecube source model unavailable');
    if(!Number.isInteger(n)||n<1||n>1111)throw new RangeError('Record n must be an integer from 1 to 1111');
    return model.numberRecord(n,dataset);
  }

  function mount(doc=typeof document!=='undefined'?document:null,model=defaultModel){
    if(!doc||!model)return null;
    const nodes={};
    for(const [key,id] of Object.entries(IDS))nodes[key]=doc.getElementById(id);
    if(Object.values(nodes).some(node=>!node))return null;
    const dataset=model.buildDataset();
    let current=null;

    function render(raw=nodes.input.value){
      try{
        const n=Number(raw),record=read(n,model,dataset),address=record.sourceAddress,grid=record.gridAddress;
        current=record;
        nodes.input.value=String(n);
        nodes.input.setAttribute('aria-invalid','false');
        nodes.record.textContent=record.recordId;
        nodes.base11.textContent=`${record.base11.number} / ${record.base11.address}`;
        nodes.cube.textContent=`[${address.x}, ${address.y}, ${address.z}]`;
        nodes.grid.textContent=`row ${grid.row} · col ${grid.column}`;
        nodes.prime.textContent=record.primeStatus+(record.primeIndex?` · #${record.primeIndex}`:'');
        nodes.return.textContent=record.return.exact?`EXACT · ${record.return.n}`:'HOLD';
        nodes.status.textContent=`READ HEAD · ${record.recordId} · Q4 mapping NONE`;
        return record;
      }catch(error){
        current=null;
        nodes.input.setAttribute('aria-invalid','true');
        nodes.status.textContent=`HOLD · ${error.message}`;
        return null;
      }
    }

    nodes.button.addEventListener('click',()=>render());
    nodes.input.addEventListener('change',()=>render());
    nodes.input.addEventListener('keydown',event=>{if(event.key==='Enter')render()});
    render();
    return Object.freeze({
      render,
      snapshot:()=>Object.freeze({n:current?current.sourceNumber:null,recordId:current?current.recordId:null,exact:Boolean(current&&current.return.exact),q4Mapping:null,sourceStateTransferred:false,sharedClock:false})
    });
  }

  if(typeof document!=='undefined')mount(document,defaultModel);
  return Object.freeze({IDS,read,mount});
});
