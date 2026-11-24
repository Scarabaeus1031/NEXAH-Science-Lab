(()=>{
  const workbench=document.querySelector('#primecube-workbench');
  const millennium=document.querySelector('[data-pc-millennium-grid]');
  const millenniumHome=document.querySelector('[data-pc-millennium-home]');
  const portal=workbench?.querySelector('[data-pc-carrier-portal]');
  if(!workbench||!millennium||!millenniumHome||!portal)return;

  const axisButtons=[...workbench.querySelectorAll('[data-pc-nav-axis]')];
  const axisPanels=[...workbench.querySelectorAll('[data-pc-nav-panel]')];
  const familyButtons=[...workbench.querySelectorAll('[data-pc-view-family]')];
  const familyPanels=[...workbench.querySelectorAll('[data-pc-family-modes]')];
  const carrierButtons=[...workbench.querySelectorAll('[data-pc-carrier]')];
  const viewButtons=[...workbench.querySelectorAll('[data-pc-view]')];
  const navContext=workbench.querySelector('[data-pc-nav-context]');

  const viewFamily={
    grid:'surface',cube:'surface',
    fold:'slice',slice:'slice',orientation:'slice',hinge:'slice',
    root:'root',geometry:'root',measure:'root',
    euler:'orbit',qcube:'orbit',
    plates:'plate',centered:'plate'
  };

  const selectedAxis=()=>axisButtons.find(button=>button.getAttribute('aria-selected')==='true')?.dataset.pcNavAxis||'carrier';

  function selectAxis(axis){
    if(axis!=='carrier'&&workbench.classList.contains('is-decimal-carrier'))setCarrier('primecube');
    axisButtons.forEach(button=>button.setAttribute('aria-selected',String(button.dataset.pcNavAxis===axis)));
    axisPanels.forEach(panel=>panel.hidden=panel.dataset.pcNavPanel!==axis);
    navContext.hidden=axis!=='views';
  }

  function selectFamily(family,{activate=false}={}){
    familyButtons.forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.pcViewFamily===family)));
    familyPanels.forEach(panel=>panel.hidden=panel.dataset.pcFamilyModes!==family);
    if(activate){
      const active=familyPanels.find(panel=>panel.dataset.pcFamilyModes===family)?.querySelector('[data-pc-view]');
      active?.click();
    }
  }

  function setCarrier(carrier){
    const decimal=carrier==='decimal';
    carrierButtons.forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.pcCarrier===carrier)));
    workbench.classList.toggle('is-decimal-carrier',decimal);
    portal.hidden=!decimal;
    navContext.hidden=decimal||selectedAxis()!=='views';
    if(decimal){
      portal.appendChild(millennium);
      millennium.scrollIntoView({block:'nearest'});
    }else{
      millenniumHome.after(millennium);
    }
  }

  axisButtons.forEach(button=>button.addEventListener('click',()=>selectAxis(button.dataset.pcNavAxis)));
  familyButtons.forEach(button=>button.addEventListener('click',()=>selectFamily(button.dataset.pcViewFamily,{activate:true})));
  carrierButtons.forEach(button=>button.addEventListener('click',()=>setCarrier(button.dataset.pcCarrier)));
  viewButtons.forEach(button=>button.addEventListener('click',()=>{
    const family=viewFamily[button.dataset.pcView];
    if(family)selectFamily(family);
  }));

  if(location.hash==='#millennium-decimal-carrier'){
    selectAxis('carrier');
    setCarrier('decimal');
  }else{
    selectAxis(selectedAxis());
    setCarrier('primecube');
  }
})();
