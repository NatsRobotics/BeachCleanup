var canvas = document.getElementById('canvas');
var engine = new BABYLON.Engine(canvas, true);
var scene = new BABYLON.Scene(engine);
var gravityVector = new BABYLON.Vector3(0,-9.81, 0);
var physicsPlugin = new BABYLON.CannonJSPlugin();
scene.enablePhysics(gravityVector, physicsPlugin);
scene.clearColor=new BABYLON.Color3(0,0.5,0.9);
scene.ambientColor = new BABYLON.Color3(0.5,0.5,0.5);

var mats = [];
for(let i=0;i<=4;i++){
  mats.push(new BABYLON.StandardMaterial('mat',scene));
  mats[i].emissiveColor = new BABYLON.Color3(0,0,0);
  mats[i].diffuseColor = new BABYLON.Color3(0,0,0);
  mats[i].specularColor = new BABYLON.Color3(0,0,0);
  mats[i].ambientColor = new BABYLON.Color3(0,0,0);
}
mats[0].ambientColor = new BABYLON.Color3(0.5,0.5,0.5);
mats[1].ambientColor = new BABYLON.Color3(1,1,0);


var sun = new BABYLON.PointLight('sun',new BABYLON.Vector3(0,10,0));

var camera = new BABYLON.ArcRotateCamera("Camera", 0, 0, 10, new BABYLON.Vector3(0, 0, 0), scene);
camera.attachControl(canvas,true);

var world=[];
world.push(BABYLON.MeshBuilder.CreateGround('ground',{width:200,height:100},scene));
world[0].material = mats[0];
world.push(BABYLON.MeshBuilder.CreateGround('sand',{width:200,height:100},scene));
world[1].material = mats[1];
world[1].position = new BABYLON.Vector3(0,-10,99);
world[1].rotation.x=0.2;
