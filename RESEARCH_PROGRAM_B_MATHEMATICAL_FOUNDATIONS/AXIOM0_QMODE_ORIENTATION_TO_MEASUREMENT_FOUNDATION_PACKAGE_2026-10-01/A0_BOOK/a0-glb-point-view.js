(function(root){
  'use strict';
  async function readPoints(buffer, nodeNames){
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
      if(node.mesh!==undefined&&(!nodeNames||nodeNames.includes(node.name))){
        instances.push({name:node.name,world,accessors:positions(node.mesh)});
      }
      for(const child of node.children||[])visit(child,world);
    }
    for(const id of gltf.scenes[gltf.scene??0].nodes)visit(id,new Matrix4());
    const count=instances.reduce((sum,part)=>sum+part.accessors.reduce((subtotal,a)=>subtotal+a.count,0),0);
    const step=Math.max(1,Math.ceil(count/32000));
    const bounds=new Box3();
    const groups=instances.map(({name,world,accessors})=>{
      const points=[];
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
      return {name,points,pivot:new Vector3().setFromMatrixPosition(world)};
    });
    if(bounds.isEmpty())throw Error('Keine GLB-Punkte gefunden');
    const center=bounds.getCenter(new Vector3());
    const radius=bounds.getSize(new Vector3()).length()/2||1;
    for(const group of groups){
      group.pivot.sub(center).divideScalar(radius);
      for(const point of group.points)point.sub(center).divideScalar(radius);
    }
    return groups;
  }

  function drawPoints(context,groups,{yaw=0.65,tilt=Math.asin(0.37),colors={},scales={}}={}){
    const {width,height}=context.canvas;
    const factor=height*0.39;
    const cosYaw=Math.cos(yaw),sinYaw=Math.sin(yaw);
    const cosTilt=Math.cos(tilt),sinTilt=Math.sin(tilt);
    context.clearRect(0,0,width,height);
    let activeColor;
    for(const {name,points,pivot} of groups){
      const color=Object.hasOwn(colors,name)?colors[name]:'#ffda91';
      const scale=Object.hasOwn(scales,name)?scales[name]:1;
      if(color!==activeColor){
        if(activeColor)context.fill();
        activeColor=color;
        context.fillStyle=color;
        context.beginPath();
      }
      for(const point of points){
        const x=pivot.x+(point.x-pivot.x)*scale;
        const y=pivot.y+(point.y-pivot.y)*scale;
        const z=pivot.z+(point.z-pivot.z)*scale;
        const side=x*cosYaw+z*sinYaw;
        const depth=z*cosYaw-x*sinYaw;
        context.rect(width/2+factor*side,height*0.45-factor*(y*cosTilt-depth*sinTilt),1.6,1.6);
      }
    }
    if(activeColor)context.fill();
  }
  root.A0GLBPointView={readPoints,drawPoints};
})(window);
