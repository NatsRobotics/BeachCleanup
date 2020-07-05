var controls = {
  forwards:false,
  backwards:false,
  left:false,
  right:false,
  jump:false,
  sprint:false,
  click:false,
  pause:false
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
  'mouse1':'click',
};

var onGround = false;
var onGroundCheckTimer = 0;

document.onkeydown = function(e){
  if(keybinds[e.key])
    controls[keybinds[e.key]] = true;
  if(e.key==='p' || e.key==='P'){
    pause();
  }
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
function pause(){
  if(!paused){
    paused=true;
    engine.stopRenderLoop();
    document.getElementById('game').style.display='none';
    document.exitPointerLock();
    document.getElementById('pause').style.display='block';
  }
}
function unpause(){
  if(paused){
    paused=false;
    engine.runRenderLoop(renderLoop);
    document.getElementById('game').style.display='block';
    canvas.requestPointerLock();
    document.getElementById('pause').style.display='none';
  }
}
