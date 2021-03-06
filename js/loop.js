var deceleration = 0.9;
var paused = false;
var ray = new BABYLON.Ray(new BABYLON.Vector3(0,1,0),new BABYLON.Vector3(0,1,0),range);

function renderLoop() {
  worldBeforeFrame();
  ray.origin = firstPersonCamera.position;
  ray.direction = firstPersonCamera.getDirection(new BABYLON.Vector3(0,0,1));
  if(controls.click){
    let cast = scene.pickWithRay(ray);
    if(cast.distance>0){
      if(cast.pickedMesh.name==='garbage'){
        if(trash<maxTrash){
          trash++;
          cast.pickedMesh.physicsImpostor.dispose();
          let zyPos = Math.random();
          cast.pickedMesh.rotation=new BABYLON.Vector3(Math.random(),Math.random(),Math.random());
          cast.pickedMesh.position=new BABYLON.Vector3(Math.random()*300-150,-zyPos*14.9+1,zyPos*170+25);
          cast.pickedMesh.physicsImpostor = new BABYLON.PhysicsImpostor(cast.pickedMesh,BABYLON.PhysicsImpostor.BoxImpostor,{mass:0.1,restitution:0},scene);
          document.getElementById('trash').textContent = 'Trash: '+trash+'/'+maxTrash;
        }
      }else if(cast.pickedMesh.name==='bin'){
        this.score+=this.trash;
        this.coins+=this.trash;
        this.trash=0;
        document.getElementById('score').textContent = 'Score: '+score;
        document.getElementById('coins').textContent = 'Coins: $'+coins;
        document.getElementById('trash').textContent = 'Trash: '+trash+'/'+maxTrash;
      }
    }
  }
  firstPersonCamera.position.x = player.position.x;
  firstPersonCamera.position.y = player.position.y+0.8;
  firstPersonCamera.position.z = player.position.z;
  jumpCheck.position.x = player.position.x;
  jumpCheck.position.y = player.position.y-1.1;
  jumpCheck.position.z = player.position.z;
  if(onGroundCheckTimer<=0){
    if(controls.jump){
      onGroundCheckTimer = 10;
      onGround = false;
      for(let i in grounds){
        if(jumpCheck.intersectsMesh(grounds[i], true)){
          onGround = true;
          break;
        }
      }
    }
  }else
    onGroundCheckTimer--;
    player.rotation.y = firstPersonCamera.rotation.y;
    var forwards = {x:Math.cos(player.rotation.y)*5,z:Math.sin(player.rotation.y)*5};
    let movement = false;
    if(controls.forwards){
      player.applyImpulse(new BABYLON.Vector3(forwards.z,0,forwards.x), new BABYLON.Vector3(0,1,0));
      movement = true;
    }else if(controls.backwards){
      player.applyImpulse(new BABYLON.Vector3(-forwards.z,0,-forwards.x), new BABYLON.Vector3(0,1,0));
      movement = true;
    }
    if(controls.right){
    player.applyImpulse(new BABYLON.Vector3(forwards.x,0,-forwards.z), new BABYLON.Vector3(0,1,0));
    movement = true;
  }else if(controls.left){
    player.applyImpulse(new BABYLON.Vector3(-forwards.x,0,forwards.z), new BABYLON.Vector3(0,1,0));
    movement = true;
  }
  let vel = player.physicsImpostor.getLinearVelocity();
  let yvel = vel.y;
  let xvel = vel.x;
  let zvel = vel.z;
  if(onGround && controls.jump){
    onGround = false;
    yvel = jumpPower;
  }
  if(!movement){
    xvel*=deceleration;
    zvel*=deceleration;
  }
  if(player.intersectsMesh(world[2])){
    xvel*=0.5;
    yvel*=0.9;
    zvel*=0.5;
    if(controls.jump){
      yvel+=1;
    }
  }
  let s = maxSpeed;
  if(controls.sprint){
    s*=1.5;
    firstPersonCamera.fov=0.7;
  }else firstPersonCamera.fov=0.8;
  if(xvel*xvel+zvel*zvel>s*s){
    let f = fisqrt(xvel*xvel+zvel*zvel);
    xvel*=s*f;
    zvel*=s*f;
  }
  player.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(xvel,yvel,zvel));
  garbage.forEach((g)=>{
    if(g.intersectsMesh(world[2])){
      let vel = g.physicsImpostor.getLinearVelocity();
      vel.x*=0.8;
      vel.y*=0.8;
      vel.z*=0.8;
      vel.y+=-(g.position.y*0.1)-1.8;
      g.physicsImpostor.setLinearVelocity(vel);
      if(g.hasPreferedRotation){
        let aVel = g.physicsImpostor.getAngularVelocity();
        aVel.x*=0.5;
        aVel.y*=0.5;
        aVel.z*=0.5;
        aVel.x-=g.rotationQuaternion.x*0.1;
        aVel.z-=g.rotationQuaternion.z*0.1;
        g.physicsImpostor.setAngularVelocity(aVel);
      }
    }
  });
  scene.render();
}

engine.runRenderLoop(renderLoop);
window.addEventListener("resize", function () {
  engine.resize();
});
