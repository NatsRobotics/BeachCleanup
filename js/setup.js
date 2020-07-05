var canvas = document.getElementById('canvas');
var engine = new BABYLON.Engine(canvas, true);
var scene = new BABYLON.Scene(engine);
var gravityVector = new BABYLON.Vector3(0,-9.81, 0);
var physicsPlugin = new BABYLON.CannonJSPlugin();
var score = 0;
var trash = 0;
var coins = 0;
var maxTrash = 10;
var maxSpeed = 10;
var jumpPower = 5;
var range = 5;
scene.enablePhysics(gravityVector, physicsPlugin);
scene.ambientColor = new BABYLON.Color3(0.5,0.5,0.5);

//skybox
var skybox = BABYLON.MeshBuilder.CreateBox("skyBox", {size:1000}, scene);
var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
skyboxMaterial.backFaceCulling = false;
skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("img/skybox/bluecloud", scene, ["_ft.jpg", "_up.jpg", "_rt.jpg", "_bk.jpg", "_dn.jpg", "_lf.jpg"]);
skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
skybox.material = skyboxMaterial;


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
player.visibility = 0;
player.isPickable = false;
var jumpCheck = BABYLON.MeshBuilder.CreateCylinder('jumpCheck',{diameter:0.9,height:0.2}, scene);
jumpCheck.visibility = 0;
jumpCheck.isPickable = false;

var mats = [];
for(let i=0;i<=4;i++){
  mats.push(new BABYLON.StandardMaterial('mat',scene));
  mats[i].emissiveColor = new BABYLON.Color3(0,0,0);
  mats[i].diffuseColor = new BABYLON.Color3(0,0,0);
  mats[i].specularColor = new BABYLON.Color3(0,0,0);
  mats[i].ambientColor = new BABYLON.Color3(0,0,0);
}
//road
mats[0].ambientColor = new BABYLON.Color3(0.3,0.3,0.3);
mats[0].diffuseColor = new BABYLON.Color3(0.5,0.5,0.5);
//sand
mats[1].ambientColor = new BABYLON.Color3(0.5,0.5,0.5);
mats[1].diffuseColor = new BABYLON.Color3(1,1,1);
mats[1].diffuseTexture = new BABYLON.Texture('img/textures/sand_COLOR.png',scene);
mats[1].bumpTexture = new BABYLON.Texture('img/textures/sand_Normal.png',scene);
mats[1].bumpTexture.uScale = 5;
mats[1].bumpTexture.vScale = 2.5;
mats[1].diffuseTexture.uScale = 5;
mats[1].diffuseTexture.vScale = 2.5;
//water
mats[2].diffuseColor = new BABYLON.Color3(0,0.3,0.6);
mats[2].specularColor = new BABYLON.Color3(0.1,0.3,0.3);
eval("mats[2].bumpTexture = new BABYLON.Texture('img/textures/water_Normal.jpg',scene);");
mats[2].alpha = 0.5;
mats[2].backFaceCulling = false;
mats[2].bumpTexture.uScale = 5;
mats[2].bumpTexture.vScale = 2.5;
//bins
mats[3].ambientColor = new BABYLON.Color3(0,0.1,0.4);
mats[3].diffuseColor = new BABYLON.Color3(0,0.3,0.8);
mats[3].specularColor = new BABYLON.Color3(0,0.2,0.3);

var sun = new BABYLON.PointLight('sun',new BABYLON.Vector3(0,100,0),scene);

var world=[];
world.push(BABYLON.MeshBuilder.CreateGround('ground',{width:300,height:50},scene));
world[0].material = mats[0];
world[0].physicsImpostor = new BABYLON.PhysicsImpostor(world[0],BABYLON.PhysicsImpostor.BoxImpostor,{mass:0,restitution:0.5},scene);
world[0].isPickable = false;
world.push(BABYLON.MeshBuilder.CreateGround('sand',{width:300,height:200},scene));
world[1].material = mats[1];
world[1].position = new BABYLON.Vector3(0,-14.95,123.7);
world[1].rotation.x=0.15;
world[1].physicsImpostor = new BABYLON.PhysicsImpostor(world[1],BABYLON.PhysicsImpostor.BoxImpostor,{mass:0,restitution:0},scene);
world[1].isPickable = false;

world.push(new BABYLON.MeshBuilder.CreateBox('water',{width:300,height:12,depth:80},scene));
world[2].position = new BABYLON.Vector3(0,-25,185);
world[2].material = mats[2];
world[2].isPickable = false;

function worldBeforeFrame(){
  world[1].position=new BABYLON.Vector3(0,-14.95,123.7);
}

var grounds = [];
grounds.push(world[0]);
grounds.push(world[1]);

var bins = [];
bins.push(BABYLON.MeshBuilder.CreateBox('bin',{},scene));
bins[0].position = new BABYLON.Vector3(0,0.5,-20);

bins.forEach(b=>b.material=mats[3]);

var garbage=[];
for(let i=0;i<100;i++){
  garbage.push(new BABYLON.MeshBuilder.CreateBox('garbage',{width:0.5,height:0.3,depth:1},scene));
  let zyPos = Math.random();
  garbage[i].position = new BABYLON.Vector3(Math.random()*300-150,-zyPos*14.9+1,zyPos*170+25);
  garbage[i].rotation = new BABYLON.Vector3(Math.random(),Math.random(),Math.random());
  garbage[i].physicsImpostor = new BABYLON.PhysicsImpostor(garbage[i],BABYLON.PhysicsImpostor.BoxImpostor,{mass:0.1,restitution:0},scene);
}


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
