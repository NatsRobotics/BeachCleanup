var controls = {
  forwards:false,
  backwards:false,
  left:false,
  right:false,
  jump:false,
};
var keybinds = {
  'w':'forwards',
  's':'backwards',
  'a':'left',
  'd':'right',
  ' ':'jump'
};

var onGround = false;
var onGroundCheckTimer = 0;

document.onkeydown = function(e){
  if(keybinds[e.key])
    controls[keybinds[e.key]] = true;
}
document.onkeyup = function(e){
  if(keybinds[e.key])
    controls[keybinds[e.key]] = false;
}
canvas.oncontextmenu = function(){
  canvas.requestPointerLock();
  return false;
}
