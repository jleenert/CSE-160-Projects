const FSIZE = 4;
// Matrix rotation vars
let globalRotMat = new Matrix4();
let g_xAngle = 0;
let g_yAngle = 0;
let g_currFOV = 90;

let g_camera = new Camera();

function renderAllShapes() {
  // time at the start of the function
  var startTime = performance.now();

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  globalRotMat.setIdentity();
  globalRotMat.rotate(g_xAngle, 0, 1, 0);
  globalRotMat.rotate(g_yAngle, 1, 0, 0);

  g_camera.projMatrix.setPerspective(g_currFOV, (canvas.width/canvas.height), 0.1, 1000);

  updateCamPosition();
  g_camera.viewMatrix.setLookAt(
    g_camera.eye.elements[0], g_camera.eye.elements[1], g_camera.eye.elements[2],
    g_camera.at.elements[0], g_camera.at.elements[1], g_camera.at.elements[2],
    g_camera.up.elements[0], g_camera.up.elements[1], g_camera.up.elements[2]);
  g_camera.viewMatrix.scale(-1,1,1); // don't know why but the x-axis is reversed

  // pass all matrices to GLSL
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);
  gl.uniformMatrix4fv(u_ViewMatrix, false, g_camera.viewMatrix.elements);
  gl.uniformMatrix4fv(u_ProjectionMatrix, false, g_camera.projMatrix.elements);

  //testCube.render_with_UVs();
  floor.render_full_texture();
  sky.render_with_UVs();

  renderSlug();
  drawMap();

  // measure time spent
  var duration = performance.now() - startTime;
  sendTextToHTML(
    "Performance - ms: " + Math.floor(duration) + " fps: " +
    Math.floor(10000/duration), "perfCounter");
}

function drawMap() {
  for (let i = 0; i < mapCubes.length; ++i) {
    mapCubes[i].render_with_UVs();
  }
}

// modified professor function
var coordinates = null;
var position = null;
function tick() {
  position = g_camera.at.elements;
  if (!foundSlug) {
    if (position[0] < 7 && position[0] > 5) {
      if (position[2] < -1 && position[2] > -4) {
        foundSlug = true;
        clearEnding();
        clearEnd = true;
        sendTextToHTML("You found the slug! Now make it to the end!", "instructions");
      }
    }
  }

  if (clearEnd) {
    if (position[0] > -3 && position[0] < 0) {
      if (position[2] > 12 && position[2] < 14) {
        sendTextToHTML("You made it to the end!", "instructions");
        clearEnd = false;
      }
    }
  }

  renderAllShapes();
  updateSlugAngles();

  requestAnimationFrame(tick);
}