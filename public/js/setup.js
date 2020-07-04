var canvas = document.getElementById('canvas');
var engine = new BABYLON.Engine(canvas, true);
var scene = new BABYLON.Scene(engine);
var gravityVector = new BABYLON.Vector3(0,-9.81, 0);
var physicsPlugin = new BABYLON.CannonJSPlugin();
scene.enablePhysics(gravityVector, physicsPlugin);

var camera = new BABYLON.ArcRotateCamera("Camera", 0, 0, 10, new BABYLON.Vector3(0, 0, 0), scene);
camera.attachControl(canvas,true);

var ground = BABYLON.Mesh.CreateGroundFromHeightMap("ground", "/public/img/ground_heightmap.png", 200, 200, 250, 0, 10, scene, false)
