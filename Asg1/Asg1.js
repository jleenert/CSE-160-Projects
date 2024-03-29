// modified from ColoredPoints.js by Jacob Leenerts for UCSC CSE 160
// ColoredPoints.js (c) 2012 matsuda

// Vertex shader program
var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'uniform float u_Size;\n' +
  'void main() {\n' +
  '  gl_Position = a_Position;\n' +
  '  gl_PointSize = u_Size;\n' +
  '}\n';

// Fragment shader program
var FSHADER_SOURCE =
  'precision mediump float;\n' +
  'uniform vec4 u_FragColor;\n' +  // uniform変数
  'void main() {\n' +
  '  gl_FragColor = u_FragColor;\n' +
  '}\n';

  
// Global Variables
let canvas;
let gl;
let a_position;
let u_Size;
let u_FragColor;

function main() {
  
  setupWebGL();

  setupGLSLVars();

  setUpHTMLActions()

  // Register function (event handler) to be called on a mouse press
  canvas.onmousedown = click;
  canvas.onmousemove = function(ev) { if(ev.buttons == 1) { click(ev) } };

  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);
}

function setupWebGL() {
  // Retrieve <canvas> element
  canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  gl = canvas.getContext("webgl", { preserveDrawingBuffer: true });
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

  // Create a buffer object
  vertexBuffer = gl.createBuffer();
  if (!vertexBuffer) {
    console.log('Failed to create the buffer object');
    return -1;
  }

  // Bind the buffer object to target
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
}

function setupGLSLVars() {
  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // Get the storage location of a_Position
  a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return;
  }

  // Get the storage location of u_Size
  u_Size = gl.getUniformLocation(gl.program, 'u_Size');
  if (!u_Size) {
    console.log('Failed to get the storage location of u_Size');
    return;
  }

  // Get the storage location of u_FragColor
  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }
}

const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;
const TRAIL = 3;
let g_selectedColor = [1.0, 0.0, 0.0, 1.0];
let g_selectedSize = 5.0;
let g_selectedType = POINT;
let g_selectedSegments = 4;

function setUpHTMLActions() {
  // user can change values and refresh the page without a return to default slider values
  g_selectedColor[0] = document.getElementById('red').value;
  g_selectedColor[1] = document.getElementById('green').value;
  g_selectedColor[2] = document.getElementById('blue').value;
  g_selectedSize = document.getElementById('size').value;
  g_selectedSegments = document.getElementById('segments').value;

  document.getElementById("pointButton").onclick = function() { g_selectedType = POINT };
  document.getElementById("triangleButton").onclick = function() { g_selectedType = TRIANGLE };
  document.getElementById("circleButton").onclick = function() { g_selectedType = CIRCLE };
  document.getElementById("trailButton").onclick = function() { g_selectedType = TRAIL };
  //document.getElementById("spamButton").onclick = drawSpamton();

  // create events to change slider values
  document.getElementById('red').addEventListener('mouseup', function() { g_selectedColor[0] = parseFloat(this.value); });
  document.getElementById("green").addEventListener('mouseup', function() { g_selectedColor[1] = parseFloat(this.value); });
  document.getElementById("blue").addEventListener('mouseup', function() { g_selectedColor[2] = parseFloat(this.value); });
  document.getElementById("size").addEventListener('mouseup', function() { g_selectedSize = parseFloat(this.value); });
  document.getElementById("segments").addEventListener('mouseup', function() { g_selectedSegments = parseFloat(this.value); })
}

let g_shapesList = [];
function click(ev) {

  let [x,y] = convertCoordinatesEventToGL(ev);
  
  let point;
  if (g_selectedType == POINT) {
    point = new Point();
    point.color = g_selectedColor.slice();
  }
  else if (g_selectedType == TRIANGLE) {
    point = new Triangle();
    point.color = g_selectedColor.slice();
  }
  else if (g_selectedType == CIRCLE) {
    point = new Circle();
    point.segments = g_selectedSegments;
    point.color = g_selectedColor.slice();
  }
  else { // rainbows mfer
    point = new Circle();
    point.segments = 30;
    g_selectedColor = nextRainbowColor(g_selectedColor);
    point.color = g_selectedColor.slice();
  }
  point.position = [x, y];
  point.size = g_selectedSize;
  g_shapesList.push(point);


  point.render();
}

function convertCoordinatesEventToGL(ev) {
  var x = ev.clientX; // x coordinate of a mouse pointer
  var y = ev.clientY; // y coordinate of a mouse pointer
  var rect = ev.target.getBoundingClientRect();

  x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
  y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);
  return ([x,y]);
}

function renderAllShapes() {
  // time at the start of the function
  var startTime = performance.now();

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  var len = g_shapesList.length;
  for(var i = 0; i < len; i++) {
    g_shapesList[i].render();
  }

  // measure time spent
  var duration = performance.now() - startTime;
  //sendTextToHTML("numdot: " + len + " ms: " + Math.floor(duration) + " fps: " + Math.floor(10000/duration), "numdot");
}

function sendTextToHTML(text, htmlID) {
  var htmlElm = document.getElementById(htmlID);
  if (!htmlElm) {
    console.log("Failed to get " + htmlID + " from HTML");
    return;
  }
  htmlElm.innerHTML = text;
}

// button functionality

function tryClear() {
  gl.clear(gl.COLOR_BUFFER_BIT);
  g_shapesList = [];
}

// undo button
// last element of each array is popped
// array pop source: https://www.w3schools.com/jsref/jsref_pop.asp
function undoLastShape() {
  if (g_shapesList.length > 0) {
    g_shapesList.pop();
    renderAllShapes();
  }
}

// rainbow algo
// if red is max + no blue, green increase
// if green full + any red, red decrease
// if green is max + no red, blue increase
// if blue full + any green, green decrease
// if blue is max + no green, increase red
// if red full + any blue, blue decrease
// figured out color calcs thanks to https://www.w3schools.com/colors/colors_hwb.asp
function nextRainbowColor(rgba) {
  answer = [1.0, 0.0, 0.0, 1.0];
  // return red if no hues are saturated
  if (rgba[0] != 1.0 && rgba[1] != 1.0 && rgba[2] != 1.0) { 
    return answer;
  }
  answer = rgba;
  temp = 0.0;
  if (rgba[0] == 1.0) { // red maxed
    if (rgba[2] == 0) { // if no blue, increase green
      if (rgba[1] >= 1) { // wonky bounds fix, thanks floating-point math
        answer[1] = 1;
        answer[0] = 0.99;
        return answer;
      }
      temp = rgba[1] + 0.01;
      temp = Math.round(temp * 100) / 100;
      answer[1] = temp;
      return answer;
    }
    else { // decrease blue
      temp = rgba[2] - 0.01;
      temp = Math.round(temp * 100) / 100;
      answer[2] = temp;
      return answer;
    }
  }
  if (rgba[1] == 1.0) { // green maxed
    if (rgba[0] == 0) { // if no red, increase blue
      if (rgba[2] >= 1) {
        answer[2] = 1;
        answer[1] = 0.99;
        return answer;
      }
      temp = rgba[2] + 0.01;
      temp = Math.round(temp * 100) / 100;
      answer[2] = temp;
      return answer;
    }
    else { // decrease red
      temp = rgba[0] - 0.01;
      temp = Math.round(temp * 100) / 100;
      answer[0] = temp;
      return answer;
    }
  }
  if (rgba[2] == 1.0) { // blue maxed
    if (rgba[1] == 0) { // if no green, increase red
      if (rgba[0] >= 1) {
        answer[0] = 1;
        answer[2] = 0.99;
        return answer;
      }
      temp = rgba[0] + 0.01;
      temp = Math.round(temp * 100) / 100;
      answer[0] = temp;
      return answer;
    }
    else { // decrease green
      temp = rgba[1] - 0.01;
      temp = Math.round(temp * 100) / 100;
      answer[1] = temp;
      return answer;
    }
  }
  return answer;
}


function drawSpamton() {
  // for some reason, this function does not inherit the global scope with gl variable
  // if called with onclick in JS versus onclick in HTML
  tryClear();
  
  //draw hair
  gl.uniform4f(u_FragColor, 40/255, 40/255, 40/255, 1);
  drawTriangle([-0.8, 0.63,   -0.7, 0.8,   -0.7, 0.45]);
  drawTriangle([-0.7, 0.8,    0.5, 0.8,   -0.7, 0.45]);
  drawTriangle([-0.7, 0.45,   0.5, 0.45,  0.5, 0.8]);
  drawTriangle([0.6, 0.63,   0.5, 0.8,   0.5, 0.45]);
  drawTriangle([0.67, 0.87,   0.5, 0.8,   0.5, 0.7]); // tip 1
  drawTriangle([0.74, 0.85,   0.5, 0.75,   0.5, 0.6]); // tip 2
  drawTriangle([0.72, 0.74,   0.45, 0.75,   0.5, 0.6]); // tip 3

  //draw face
  gl.uniform4f(u_FragColor, 1, 1, 1, 1);
  drawTriangle([-0.7, 0.45,    0.5, 0.45,   -0.8, 0.1]); // upper trapezoid
  drawTriangle([-0.8, 0.1,    0.6, 0.1,   0.5, 0.45]);
  drawTriangle([-0.8, 0.1,    0.6, 0.1,   -0.55, -0.6]); // lower trap
  drawTriangle([0.6, 0.1,    0.35, -0.6,   -0.55, -0.6]);
  gl.uniform4f(u_FragColor, 1, 0, 0, 1);
  drawTriangle([-0.5, 0.05,  -0.55, 0,   -0.45, 0]); // left cheek
  drawTriangle([-0.5, -0.05,  -0.55, 0,   -0.45, 0]);
  drawTriangle([0.3, 0.05,  0.25, 0,   0.35, 0]); // right cheek
  drawTriangle([0.3, -0.05,  0.25, 0,   0.35, 0]);

  // draw black highlights
  gl.uniform4f(u_FragColor, 0, 0, 0, 1);
  drawTriangle([-0.4, 0.45,  -0.59, 0.26,   -0.21, 0.26]); // left glass black
  drawTriangle([-0.4, 0.07,  -0.59, 0.26,   -0.21, 0.26]);
  drawTriangle([0.2, 0.45,    0.01, 0.26,   0.39, 0.26]); // right glass black
  drawTriangle([0.2, 0.07,    0.01, 0.26,   0.39, 0.26]);
  drawTriangle([0.05, 0.29,   0.05, 0.22,   -0.26, 0.29]); // connecting rim
  drawTriangle([-0.26, 0.29,  -0.26, 0.22,  0.05, 0.22]);
  drawTriangle([-0.1, 0.05,  -0.1, -0.2,  -0.95, -0.2]); // nose outline
  drawTriangle([-0.5, 0,  -0.3, -0.4,  -0.22, -0.4]); // grin lines
  drawTriangle([0.3, 0,  0.1, -0.4,  0.02, -0.4]);
  drawTriangle([-0.36, -0.2,  -0.22, -0.4,  0.02, -0.4]); // mouth
  drawTriangle([-0.36, -0.2,  0.02, -0.4,  0.16, -0.2]);

  // glasses
  gl.uniform4f(u_FragColor, 234/255, 148/255, 1, 1);
  drawTriangle([-0.4, 0.41,  -0.55, 0.26,   -0.25, 0.26]); // left glass color
  drawTriangle([-0.4, 0.11,  -0.55, 0.26,   -0.25, 0.26]);
  gl.uniform4f(u_FragColor, 1, 1, 0, 1);
  drawTriangle([0.2, 0.41,    0.05, 0.26,   0.35, 0.26]); // right glass color
  drawTriangle([0.2, 0.11,    0.05, 0.26,   0.35, 0.26]);

  // mouth and nose
  gl.uniform4f(u_FragColor, 1, 1, 1, 1);
  drawTriangle([-0.1, 0.03,  -0.1, -0.18,  -0.83, -0.18]); // nose
  drawTriangle([-0.35, -0.23,  -0.28, -0.37,  0.07, -0.37]); //mouth
  drawTriangle([-0.35, -0.23,  0.14, -0.23,  0.07, -0.37]);
}