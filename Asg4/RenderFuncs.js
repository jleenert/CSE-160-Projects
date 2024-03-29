const FSIZE = 4;
let g_currFOV = 90;
let g_camera = new Camera();
let g_lightPosition = [0,5,0];
let g_lightColor = [1.0,1.0,1.0];
let g_useLighting = true;
let g_useLightAnim = false;
function renderAllShapes() {
  // time at the start of the function
  var startTime = performance.now();

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  g_camera.projMatrix.setPerspective(g_currFOV, (canvas.width/canvas.height), 0.1, 1000);

  updateCamPosition();
  g_camera.viewMatrix.setLookAt(
    g_camera.eye.elements[0], g_camera.eye.elements[1], g_camera.eye.elements[2],
    g_camera.at.elements[0], g_camera.at.elements[1], g_camera.at.elements[2],
    g_camera.up.elements[0], g_camera.up.elements[1], g_camera.up.elements[2]);
  g_camera.viewMatrix.scale(-1,1,1); // don't know why but the x-axis is reversed
  gl.uniform3f(u_CameraPos, g_camera.eye.elements[0], g_camera.eye.elements[1], g_camera.eye.elements[2]);

  // pass all matrices to GLSL
  gl.uniformMatrix4fv(u_ViewMatrix, false, g_camera.viewMatrix.elements);
  gl.uniformMatrix4fv(u_ProjectionMatrix, false, g_camera.projMatrix.elements);

  if (g_useLighting) {
    gl.uniform1f(u_UseLighting, 1.0);
  }
  else {
    gl.uniform1f(u_UseLighting, 0.0);
  }

  gl.uniform3f(u_LightPos, g_lightPosition[0], g_lightPosition[1], g_lightPosition[2]);
  gl.uniform3f(u_LightColor, g_lightColor[0], g_lightColor[1], g_lightColor[2]);

  //testCube.render_with_UVs();
  floor.render_full_texture();
  sky.render_with_UVs();

  testSphere.render_with_UVs();

  light.matrix.setIdentity();
  light.matrix.translate(g_lightPosition[0], g_lightPosition[1], g_lightPosition[2]);
  light.matrix.scale(-.1,-.1,-.1);
  light.normalMatrix.setInverseOf(light.matrix).transpose();
  light.normalMatrix.scale(-1,-1,-1);
  light.render_with_UVs();

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
  if (g_useLightAnim) {
    g_lightPosition[0] = Math.cos(performance.now()/1000) * 9;
    g_lightPosition[2] = Math.sin(performance.now()/1000) * 9;
  }
  renderAllShapes();
  updateSlugAngles();

  requestAnimationFrame(tick);
}