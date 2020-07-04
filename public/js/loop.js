var deceleration = 0.9;
var maxSpeed = 10;
var jumpPower = 5;
var ray = new BABYLON.Ray(new BABYLON.Vector3(0,1,0),new BABYLON.Vector3(0,1,0),10);
engine.runRenderLoop(function () {
  worldBeforeFrame();
  ray.origin = firstPersonCamera.position;
  ray.direction = firstPersonCamera.getDirection(new BABYLON.Vector3(0,0,1));
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
  let s = maxSpeed;
  if(controls.sprint)s*=1.5
  if(xvel*xvel+zvel*zvel>s*s){
    let f = fisqrt(xvel*xvel+zvel*zvel);
    xvel*=s*f;
    zvel*=s*f;
  }
  player.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(xvel,yvel,zvel));
  scene.render();
});
window.addEventListener("resize", function () {
  engine.resize();
});
