var controls = {
  forwards:false,
  backwards:false,
  left:false,
  right:false,
  jump:false,
  sprint:false,
  click:false
};
var keybinds = {
  'w':'forwards',
  's':'backwards',
  'a':'left',
  'd':'right',
  'W':'forwards',
  'S':'backwards',
  'A':'left',
  'D':'right',
  ' ':'jump',
  'Shift':'sprint',
  'mouse1':'click'
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
document.onmousedown = function(e){
  if(keybinds['mouse'+e.which])
    controls[keybinds['mouse'+e.which]] = true;
}
document.onmouseup = function(e){
  if(keybinds['mouse'+e.which])
    controls[keybinds['mouse'+e.which]] = false;
}
canvas.oncontextmenu = function(){
  canvas.requestPointerLock();
  return false;
}
