// modified from ColoredPoints.js by Jacob Leenerts for UCSC CSE 160
// ColoredPoints.js (c) 2012 matsuda

// Vertex shader program
var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'uniform mat4 u_ModelMatrix;\n' +
  'uniform mat4 u_GlobalRotateMatrix;\n' +
  'void main() {\n' +
  '  gl_Position = u_GlobalRotateMatrix * u_ModelMatrix * a_Position;\n' +
  '}\n';

// Fragment shader program
var FSHADER_SOURCE =
  'precision mediump float;\n' +
  'uniform vec4 u_FragColor;\n' +
  'void main() {\n' +
  '  gl_FragColor = u_FragColor;\n' +
  '}\n';

// Global Variables
let canvas;
let gl;
let a_position;
let u_ModelMatrix;
let u_FragColor;
let u_GlobalRotateMatrix;

// webpage functionality vars
let g_selectedColor = [1.0, 0.0, 0.0, 1.0];


// Matrix rotation vars
let globalRotMat = new Matrix4();
let g_xAngle = 0;
let g_yAngle = 0;

function main() {
  
  setupWebGL();

  setupGLSLVars();

  setUpHTMLActions();

  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  //start click anim variable updates
  setInterval(updateClickVal, 1);
  
  //requestAnimationFrame(tick);
  requestAnimationFrame(drawFrame);
}

// anim vars
let g_animAngle1 = 0;
let g_animAngle2 = 0;
let g_animPos1 = 0;
let g_animPos2 = 0;

// individual body part anim vars
let frontBodyRot = g_animAngle1;
let frontBodyPos = g_animPos1;
let backBodyRot = g_animAngle2;
let neckRotAng = g_animAngle1;
let eyesRotAng = g_animAngle2/4;
let tailRotAng = g_animAngle2/2;
// secondary anim vals
let clickAnimVal = 165;
let eyeScaleVal = 1;

let g_startAnimation = false;
let g_startClickAnim = false;
// objects to be rendered
let frontBody = new Cube();
let midsection = new Cube();
let backBody = new Cube();
let neck = new Cube();
let eye1 = new Cube();
let eye2 = new Cube();
let tailCone = new Cone();
function renderAllShapes() {
  // time at the start of the function
  var startTime = performance.now();

  globalRotMat.setIdentity();
  globalRotMat.rotate(-g_xAngle, 0, 1, 0);
  globalRotMat.rotate(-g_yAngle, 1, 0, 0);
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // front body
  frontBody.color = [0.9, 0.85, 0.0, 1.0];
  frontBody.matrix.setIdentity();
  frontBody.matrix.scale(0.8, 0.5, 0.5);
  frontBody.matrix.translate(-.3, -.6, 0.0);
  frontBody.matrix.translate(0,0,frontBodyPos);
  frontBody.setChildMatrix();
  frontBody.matrix.rotate(frontBodyRot, 0, 1, 0);
  frontBody.render_with_lighting();

  // neck
  neck.color = [1, 0.93, 0.0, 1.0];
  neck.matrix.set(frontBody.childMatrix);
  neck.matrix.rotate(neckRotAng, 1, 0, 0);
  neck.matrix.rotate(90, 0, 0, 1);
  neck.matrix.translate(0.4,0.2,0);
  neck.setChildMatrix();
  neck.matrix.scale(1.5,0.5,0.9);
  neck.render_with_lighting();

  // eye stalk
  eye1.color = [1, 0.93, 0.0, 1.0];
  eye1.matrix.set(neck.childMatrix);
  eye1.matrix.rotate(eyesRotAng, 0,1,0);
  eye1.matrix.scale(1.6,0.1,0.1);
  eye1.matrix.translate(0.27,1,2);
  eye1.matrix.scale(eyeScaleVal, 1, 1);
  eye1.render();

  // second eye stalk
  eye2.color = [1, 0.93, 0.0, 1.0];
  eye2.matrix.set(neck.childMatrix);
  eye2.matrix.rotate(-eyesRotAng, 0,1,0);
  eye2.matrix.scale(1.6,0.1,0.1);
  eye2.matrix.translate(0.27,1,-2); // change first value for vertical
  eye2.matrix.scale(eyeScaleVal, 1, 1);
  eye2.render();

  // back body
  backBody.color = [0.93, 0.93, 0.0, 1.0];
  backBody.matrix.set(frontBody.childMatrix);
  backBody.matrix.rotate(backBodyRot, 0, 1, 0);
  backBody.matrix.translate(.5,-0.005,0.01);
  backBody.setChildMatrix();
  backBody.render_with_lighting();

  // back cone, cone class started by ChatGPT
  tailCone.matrix.set(backBody.childMatrix);
  tailCone.color = [0.83, 0.83, 0.0, 1.0];
  tailCone.matrix.rotate(-95, 0,0,1);
  tailCone.matrix.rotate(tailRotAng, 0, 0, 1);
  tailCone.matrix.translate(0,.25,0);
  tailCone.render();

  // measure time spent
  var duration = performance.now() - startTime;
  sendTextToHTML(
    "Performance - ms: " + Math.floor(duration) + " fps: " +
    Math.floor(10000/duration), "perfCounter");
}

let prevTick = performance.now();
let timeDiff;
function updateAnimAngles() {
  timeDiff = performance.now() - prevTick;
  if (g_startAnimation) {
    curr_sin = Math.sin(performance.now()/1000);
    curr_cos = Math.cos(performance.now()/1000);
    offset_cos = Math.cos((performance.now()/1000)+750);
    g_animAngle1 = (19 * curr_cos);
    g_animAngle2 = -(19 * offset_cos);
    g_animPos1 = (0.3 * curr_sin);

    //update body parts
    frontBodyRot = g_animAngle1;
    frontBodyPos = g_animPos1;
    backBodyRot = g_animAngle2;
    neckRotAng = g_animAngle1;
    eyesRotAng = g_animAngle2/4;
    tailRotAng = g_animAngle2/2;
    eyeScaleVal = clickAnimVal/165;
  }
}

function updateClickVal() {
  if (g_startClickAnim) {
    if (clickAnimVal > 1) {
      clickAnimVal--;
    }
  }
  else {
    if (clickAnimVal < 165) {
      clickAnimVal++;
    }
  }
  console.log(clickAnimVal);
}

