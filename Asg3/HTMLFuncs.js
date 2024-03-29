// further modified from ColoredPoints.js by Jacob Leenerts for UCSC CSE 160
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
    console.log('Failed to create the vertex buffer object');
    return -1;
  }

  UVBuffer = gl.createBuffer();
  if (!UVBuffer) {
    console.log('Failed to create the UV buffer object');
    return -1;
  }

  // Bind the buffer object to target
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bindBuffer(gl.ARRAY_BUFFER, UVBuffer);
}

let a_Position;
let a_UV;
let u_FragColor;
let u_Size;
let u_ModelMatrix;
let u_ProjectionMatrix;
let u_ViewMatrix;
let u_GlobalRotateMatrix;
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

  a_UV = gl.getAttribLocation(gl.program, 'a_UV');
  if (a_UV < 0) {
    console.log('Failed to get the storage location of a_UV');
    return;
  }

  
  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }

  u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  if (!u_ModelMatrix) {
    console.log('Failed to get the storage location of u_ModelMatrix');
    return;
  }

  u_ProjectionMatrix = gl.getUniformLocation(gl.program, 'u_ProjectionMatrix');
  if (!u_ProjectionMatrix) {
    console.log('Failed to get the storage location of u_ProjectionMatrix');
    return;
  }

  u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
  if (!u_ViewMatrix) {
    console.log('Failed to get the storage location of u_ViewMatrix');
    return;
  }

  u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrix');
  if (!u_GlobalRotateMatrix) {
    console.log('Failed to get the storage location of u_GlobalRotateMatrix');
    return;
  }
}

function setUpHTMLActions() {
  // button events
  //document.getElementById('texButton0').onclick = function() { texNum = 1; console.log(1); };

  // create events to change slider values
  document.getElementById('fovSlider').addEventListener('input', function() { g_currFOV = this.value; });

  canvas.onmousemove = mouseMove;

  canvas.addEventListener("contextmenu", (ev) => {ev.preventDefault(); setCube(g_camera, false);});
  canvas.addEventListener("auxclick", (ev) => {
    if (ev.button == 1) {
      setCube(g_camera, true);
    }
  });

  document.onkeydown = keydown;
  document.onkeyup = keyup;
}

function mouseMove(ev) {
  if (ev.buttons == 1) {
    g_camera.panCam(-ev.movementX/2, -ev.movementY/2);
  }
}


g_forward = false;
g_backward = false;
g_left = false;
g_right = false;
g_upward = false;
g_downward = false;
g_panUp = false;
g_panDown = false;
g_panLeft = false;
g_panRight = false;
function updateCamPosition() {
  if (g_forward) {
    g_camera.forward();
  }
  if (g_backward) {
    g_camera.backward();
  }
  if (g_left) {
    g_camera.left();
  }
  if (g_right) {
    g_camera.right();
  }
  if (g_upward) {
    g_camera.upwards();
  }
  if (g_downward) {
    g_camera.downwards();
  }
  if (g_panUp) {
    g_camera.panCam(0, 1);
  }
  if (g_panDown) {
    g_camera.panCam(0, -1);
  }
  if (g_panLeft) {
    g_camera.panCam(1, 0);
  }
  if (g_panRight) {
    g_camera.panCam(-1, 0);
  }
}

function keydown(ev) {
  if (ev.keyCode == 39 || ev.keyCode == 68) { // left arrow, A
    g_right = true;
  }
  else if (ev.keyCode == 37 || ev.keyCode == 65) { // right arrow, D
    g_left = true;
  }
  else if (ev.keyCode == 38 || ev.keyCode == 87) { // up arrow, W
    g_forward = true;
  }
  else if (ev.keyCode == 40 || ev.keyCode == 83) { // down arrow, S
    g_backward = true;
  }
  else if (ev.keyCode == 81) { // Q
    //g_camera.panLeft();
    //g_camera.panCam(1, 0);
    g_panLeft = true;
  }
  else if (ev.keyCode == 69) { // E
    //g_camera.panRight();
    //g_camera.panCam(-1, 0);
    g_panRight = true;
  }
  else if (ev.keyCode == 90) { // Z
    g_upward = true;
  }
  else if (ev.keyCode == 67) { // C
    g_downward = true;
  }
  else if (ev.keyCode == 82) { // R
    //g_camera.panCam(0, 1);
    g_panUp = true;
  }
  else if (ev.keyCode == 70) { // F
    g_panDown = true;
  }
  //console.log(ev.keyCode);
}

function keyup(ev) {
  if (ev.keyCode == 39 || ev.keyCode == 68) { // left arrow, A
    g_right = false;
  }
  else if (ev.keyCode == 37 || ev.keyCode == 65) { // right arrow, D
    g_left = false;
  }
  else if (ev.keyCode == 38 || ev.keyCode == 87) { // up arrow, W
    g_forward = false;
  }
  else if (ev.keyCode == 40 || ev.keyCode == 83) { // down arrow, S
    g_backward = false;
  }
  else if (ev.keyCode == 81) { // Q
    //g_camera.panLeft();
    //g_camera.panCam(1, 0);
    g_panLeft = false;
  }
  else if (ev.keyCode == 69) { // E
    //g_camera.panRight();
    //g_camera.panCam(-1, 0);
    g_panRight = false;
  }
  else if (ev.keyCode == 90) { // Z
    g_upward = false;
  }
  else if (ev.keyCode == 67) { // C
    g_downward = false;
  }
  else if (ev.keyCode == 82) { // R
    //g_camera.panCam(0, 1);
    g_panUp = false;
  }
  else if (ev.keyCode == 70) { // F
    g_panDown = false;
  }
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

function updateSliderVals() {
  document.getElementById('fovSlider').value = g_currFOV;
}

let texture0 = null;
let texture1 = null;
let texture2 = null;
let texture3 = null;
let texture4 = null;
let texture5 = null;
let texture6 = null;
let texture7 = null;
let uTexture0 = null;
function setImage(gl, imagePath, index) {
  uTexture0 = gl.getUniformLocation(gl.program, "uTexture0");
  if (uTexture0 < 0) {
    console.warn("could not get uniform location");
  }
  if (index === 0) {
    if (texture0 === null) {
      texture0 = gl.createTexture();
    }
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

    const img = new Image();

    img.onload = () => {
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, texture0);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
      gl.generateMipmap(gl.TEXTURE_2D);
      gl.uniform1i(uTexture0, 0);
    };

    img.crossOrigin = "anonymous";
    img.src = imagePath;
  }
  else if (index === 1) {
    if (texture1 === null) {
      texture1 = gl.createTexture();
    }

    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);

    const img = new Image();

    img.onload = () => {
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, texture1);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
      gl.generateMipmap(gl.TEXTURE_2D);
      gl.uniform1i(uTexture0, 1); // this matches the texture slot #
    };

    img.crossOrigin = "anonymous";
    img.src = imagePath;
  }
  else if (index === 2) {
    if (texture2 === null) {
      texture2 = gl.createTexture();
    }

    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);

    const img = new Image();

    img.onload = () => {
      gl.activeTexture(gl.TEXTURE2);
      gl.bindTexture(gl.TEXTURE_2D, texture2);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
      gl.generateMipmap(gl.TEXTURE_2D);
      gl.uniform1i(uTexture0, 2); // this matches the texture slot #
    };

    img.crossOrigin = "anonymous";
    img.src = imagePath;
  }
  else if (index === 3) {
    if (texture3 === null) {
      texture3 = gl.createTexture();
    }

    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);

    const img = new Image();

    img.onload = () => {
      gl.activeTexture(gl.TEXTURE3);
      gl.bindTexture(gl.TEXTURE_2D, texture3);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
      gl.generateMipmap(gl.TEXTURE_2D);
      gl.uniform1i(uTexture0, 3); // this matches the texture slot #
    };

    img.crossOrigin = "anonymous";
    img.src = imagePath;
  }
  else if (index === 4) {
    if (texture4 === null) {
      texture4 = gl.createTexture();
    }

    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);

    const img = new Image();

    img.onload = () => {
      gl.activeTexture(gl.TEXTURE4);
      gl.bindTexture(gl.TEXTURE_2D, texture4);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
      gl.generateMipmap(gl.TEXTURE_2D);
      gl.uniform1i(uTexture0, 4); // this matches the texture slot #
    };

    img.crossOrigin = "anonymous";
    img.src = imagePath;
  }
  else if (index === 5) {
    if (texture5 === null) {
      texture5 = gl.createTexture();
    }

    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);

    const img = new Image();

    img.onload = () => {
      gl.activeTexture(gl.TEXTURE5);
      gl.bindTexture(gl.TEXTURE_2D, texture5);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
      gl.generateMipmap(gl.TEXTURE_2D);
      gl.uniform1i(uTexture0, 5); // this matches the texture slot #
    };

    img.crossOrigin = "anonymous";
    img.src = imagePath;
  }
  else if (index === 6) {
    if (texture6 === null) {
      texture6 = gl.createTexture();
    }

    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);

    const img = new Image();

    img.onload = () => {
      gl.activeTexture(gl.TEXTURE6);
      gl.bindTexture(gl.TEXTURE_2D, texture6);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
      gl.generateMipmap(gl.TEXTURE_2D);
      gl.uniform1i(uTexture0, 6); // this matches the texture slot #
    };

    img.crossOrigin = "anonymous";
    img.src = imagePath;
  }
  else if (index === 7) {
    if (texture7 === null) {
      texture7 = gl.createTexture();
    }

    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);

    const img = new Image();

    img.onload = () => {
      gl.activeTexture(gl.TEXTURE7);
      gl.bindTexture(gl.TEXTURE_2D, texture7);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
      gl.generateMipmap(gl.TEXTURE_2D);
      gl.uniform1i(uTexture0, 7); // this matches the texture slot #
    };

    img.crossOrigin = "anonymous";
    img.src = imagePath;
  }
};