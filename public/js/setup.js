var canvas = document.getElementById('canvas');
var engine = new BABYLON.Engine(canvas, true);
var scene = new BABYLON.Scene(engine);
var gravityVector = new BABYLON.Vector3(0,-9.81, 0);
var physicsPlugin = new BABYLON.CannonJSPlugin();
scene.enablePhysics(gravityVector, physicsPlugin);
scene.clearColor=new BABYLON.Color3(0,0.5,0.9);
scene.ambientColor = new BABYLON.Color3(0.5,0.5,0.5);

var firstPersonCamera = new BABYLON.UniversalCamera("FirstPersonCamera", new BABYLON.Vector3(0, 0, 0), scene);
firstPersonCamera.inertia = 0;
firstPersonCamera.angularSensibility = 200;

firstPersonCamera.keysLeft = [];
firstPersonCamera.keysRight = [];
firstPersonCamera.keysUp = [];
firstPersonCamera.keysDown = [];

firstPersonCamera.attachControl(canvas);
firstPersonCamera.minZ = 0.05;


var player = BABYLON.MeshBuilder.CreateSphere('player',{diameterY:2}, scene);
player.position.y=2;
player.physicsImpostor = new BABYLON.PhysicsImpostor(player, BABYLON.PhysicsImpostor.SphereImpostor, {mass:1,restitution:0,friction:0.5}, scene);
let body = player.physicsImpostor.physicsBody;
body.shapes = [];
body.shapeOffsets = [];
body.addShape(new CANNON.Sphere(0.45), new CANNON.Vec3(0,0.55,0));
body.addShape(new CANNON.Sphere(0.5), new CANNON.Vec3(0,0,0));
body.addShape(new CANNON.Sphere(0.45), new CANNON.Vec3(0,-0.55,0));
player.physicsImpostor.executeNativeFunction(function (world, body) {
  body.fixedRotation = true;
  body.updateMassProperties();
});
var jumpCheck = BABYLON.MeshBuilder.CreateCylinder('jumpCheck',{diameter:0.9,height:0.2}, scene);
jumpCheck.visibility = 0;

var mats = [];
for(let i=0;i<=4;i++){
  mats.push(new BABYLON.StandardMaterial('mat',scene));
  mats[i].emissiveColor = new BABYLON.Color3(0,0,0);
  mats[i].diffuseColor = new BABYLON.Color3(0,0,0);
  mats[i].specularColor = new BABYLON.Color3(0,0,0);
  mats[i].ambientColor = new BABYLON.Color3(0,0,0);
}
mats[0].ambientColor = new BABYLON.Color3(0.3,0.3,0.3);
mats[0].diffuseColor = new BABYLON.Color3(0.5,0.5,0.5);
mats[1].ambientColor = new BABYLON.Color3(0.5,0.5,0);
mats[1].diffuseColor = new BABYLON.Color3(1,1,0);

var sun = new BABYLON.PointLight('sun',new BABYLON.Vector3(0,100,0),scene);
var camera = new BABYLON.ArcRotateCamera("Camera", 0, 0, 10, new BABYLON.Vector3(0, 0, 0), scene);
camera.attachControl(canvas,true);

var world=[];
world.push(BABYLON.MeshBuilder.CreateGround('ground',{width:400,height:150},scene));
world[0].material = mats[0];
world.push(BABYLON.MeshBuilder.CreateGround('sand',{width:400,height:200},scene));
world[1].material = mats[1];
world[1].position = new BABYLON.Vector3(0,-20,173);
world[1].rotation.x=0.2;
world.forEach((m, i) => {
  m.physicsImpostor = new BABYLON.PhysicsImpostor(m,BABYLON.PhysicsImpostor.BoxImpostor,{mass:0,restitution:0.5},scene);
});

var grounds = [];
grounds.push(world[0]);
grounds.push(world[1]);

function fisqrt(number){
    var i;
    var x2, y;
    const threehalfs = 1.5;

    x2 = number * 0.5;
    y = number;
    //evil floating bit level hacking
    var buf = new ArrayBuffer(4);
    (new Float32Array(buf))[0] = number;
    i =  (new Uint32Array(buf))[0];
    i = (0x5f3759df - (i >> 1)); //What the f*ck?
    (new Uint32Array(buf))[0] = i;
    y = (new Float32Array(buf))[0];
    y  = y * ( threehalfs - ( x2 * y * y ) );   // 1st iteration
//  y  = y * ( threehalfs - ( x2 * y * y ) );   // 2nd iteration, this can be removed

    return y;
}
