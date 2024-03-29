// modified from ColoredPoints.js by Jacob Leenerts for UCSC CSE 160
// ColoredPoints.js (c) 2012 matsuda

function setupWebGL() {
  // Retrieve <canvas> element
  canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  gl = canvas.getContext("webgl", { preserveDrawingBuffer: true });
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

  gl.enable(gl.DEPTH_TEST);

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

  // Get the storage location of u_ModelMatrix
  u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  if (!u_ModelMatrix) {
    console.log('Failed to get the storage location of u_ModelMatrix');
    return;
  }

  u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrix');
  if (!u_GlobalRotateMatrix) {
    console.log('Failed to get the storage location of u_GlobalRotateMatrix');
    return;
  }

  // Get the storage location of u_FragColor
  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }
}

function setUpHTMLActions() {
  // user can change values and refresh the page without a return to default slider values
  g_xAngle = parseFloat(document.getElementById('xAngle').value);
  g_yAngle = parseFloat(document.getElementById('yAngle').value);

  // button events
  document.getElementById('animOnButton').onclick = function() { g_startAnimation = true; }
  document.getElementById('animOffButton').onclick = function() { g_startAnimation = false; }
  document.getElementById('fpsButton10').onclick = function() { updateFPS(10); }
  document.getElementById('fpsButton24').onclick = function() { updateFPS(24); }
  document.getElementById('fpsButton60').onclick = function() { updateFPS(60); }
  document.getElementById('fpsButton120').onclick = function() { updateFPS(120); }
  document.getElementById('fpsButton165').onclick = function() { updateFPS(165); }

  // create events to change slider values
  document.getElementById('xAngle').addEventListener('input', function() { 
    g_xAngle = parseFloat(this.value); });
  document.getElementById('yAngle').addEventListener('input', function() { 
    g_yAngle = parseFloat(this.value); });
  document.getElementById('frontBodyPos').addEventListener('input', function() { 
    frontBodyPos = parseFloat(this.value); });
  document.getElementById('frontBodyRot').addEventListener('input', function() { 
    frontBodyRot = parseFloat(this.value); });
  document.getElementById('backBodyRot').addEventListener('input', function() { 
    backBodyRot = parseFloat(this.value); });
  document.getElementById('tailRotAng').addEventListener('input', function() { 
    tailRotAng = parseFloat(this.value); });
  document.getElementById('neckRotAng').addEventListener('input', function() { 
    neckRotAng = parseFloat(this.value); });
  document.getElementById('eyesRotAng').addEventListener('input', function() { 
    eyesRotAng = parseFloat(this.value); });
  document.getElementById('eyeScaleVal').addEventListener('input', function() { 
    eyeScaleVal = parseFloat(this.value); });

  var mouseX, mouseY, mouseDown;
  canvas.addEventListener('mousedown', (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
    mouseDown = true;
  });
  canvas.addEventListener('mousemove', (event) => {
    if (mouseDown) {
      const deltaX = event.clientX - mouseX;
      const deltaY = event.clientY - mouseY;
      g_xAngle = g_xAngle + (deltaX * 0.5);
      g_yAngle = g_yAngle + (deltaY * 0.5);
      if (g_yAngle < -180) {
        g_yAngle = -180;
      }
      if (g_yAngle > 180) {
        g_yAngle = 180;
      }
      mouseX = event.clientX;
      mouseY = event.clientY;
    }
  });
  canvas.addEventListener('mouseup', () => {
    mouseDown = false;
  });
  document.addEventListener('mouseup', () => {
    mouseDown = false;
    if (g_startClickAnim) {
      g_startClickAnim = false;
    }
  });
  document.onmousedown = (event) => {
    if (event.shiftKey) {
      if (!g_startClickAnim) {
        g_startClickAnim = true;
      }
    }
  };
}

function convertCoordinatesEventToGL(ev) {
  var x = ev.clientX; // x coordinate of a mouse pointer
  var y = ev.clientY; // y coordinate of a mouse pointer
  var rect = ev.target.getBoundingClientRect();

  x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
  y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);
  return ([x,y]);
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
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  g_shapesList = [];
}

// old professor function
function tick() {
  updateAnimAngles();

  updateSliderVals();
  
  renderAllShapes();

  requestAnimationFrame(tick);
}

// this function updates the image
let fps = 60;
let then = performance.now();
let interval = 1000 / fps;
let curr_frame = 1;
function drawFrame() {
  let now = performance.now();
  let delta = now - then;
  

  if (delta >= interval) {
    curr_frame++;
    if (curr_frame > fps) {
      curr_frame = 1;
    }
    then = now - (delta % interval);
    updateAnimAngles();
    updateSliderVals();
    renderAllShapes();
    requestAnimationFrame(drawFrame);
    var renderTime = performance.now - then;
    sendTextToHTML(
      "Current render speed: " + fps, "fpsCounter");
  } else {
    setTimeout(() => requestAnimationFrame(drawFrame), interval - delta);
  }
}

function updateFPS(newFPS) {
  fps = newFPS;
  interval = 1000 / fps;
}

function updateSliderVals() {
  document.getElementById('xAngle').value = g_xAngle;
  document.getElementById('yAngle').value = g_yAngle;
  document.getElementById('frontBodyPos').value = frontBodyPos;
  document.getElementById('frontBodyRot').value = frontBodyRot;
  document.getElementById('backBodyRot').value = backBodyRot;
  document.getElementById('tailRotAng').value = tailRotAng;
  document.getElementById('neckRotAng').value = neckRotAng;
  document.getElementById('eyesRotAng').value = eyesRotAng;
  document.getElementById('eyeScaleVal').value = eyeScaleVal;
}