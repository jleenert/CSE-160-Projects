// further modified from ColoredPoints.js by Jacob Leenerts for UCSC CSE 160
// ColoredPoints.js (c) 2012 matsuda

// Vertex shader program
var VSHADER_SOURCE =
  'precision mediump float;\n' +
  'attribute vec4 a_Position;\n' +
  'attribute vec2 a_UV;\n' +
  'varying vec2 v_UV;\n' +
  'uniform mat4 u_ModelMatrix;\n' +
  'uniform mat4 u_GlobalRotateMatrix;\n' +
  'uniform mat4 u_ViewMatrix;\n' +
  'uniform mat4 u_ProjectionMatrix;\n' +
  'void main() {\n' +
  '  gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_GlobalRotateMatrix * u_ModelMatrix * a_Position;\n' +
  '  v_UV = a_UV;' +
  '}\n';

// Fragment shader program
var FSHADER_SOURCE =
  'precision mediump float;\n' +
  'uniform sampler2D uTexture0;\n' +
  'varying vec2 v_UV;\n' +
  'uniform vec4 u_FragColor;\n' +
  'void main() {\n' +
  '  vec4 image0 = texture2D(uTexture0, v_UV);\n' +
  '  vec3 color = mix(u_FragColor.rgb, image0.rgb, image0.a);\n' +
  '  gl_FragColor = vec4(color, 1.0);\n' +
  '}\n';

// Global Variables
let canvas;
let gl;
let foundSlug = false;
let clearEnd = false;

function main() {
  
  setupWebGL();

  setupGLSLVars();

  setUpHTMLActions();

  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // initialize all textures
  setImage(gl, "media/transparency.png", 0);
  setImage(gl, "media/test_cube_num_texture_v2.png", 1);
  setImage(gl, "media/brick_floor.png", 2);
  setImage(gl, "media/uvgrid1024-colour.png", 3);
  setImage(gl, "media/tileable_grey_brick_wall_texture_full.png", 4);
  setImage(gl, "media/jail-bars.png", 5);

  /*
  testCube = new Cube();
  testCube.texture = gl.TEXTURE1;
  testCube.textureNum = 1;*/

  floor = new Cube();
  floor.texture = gl.TEXTURE2;
  floor.textureNum = 2;
  floor.color = [1.0,0.0,0.0,1.0];
  floor.matrix.translate(0,-0.2,1);
  floor.matrix.scale(32,0.001,32);
  
  sky = new Cube();
  sky.texture = gl.TEXTURE0;
  sky.textureNum = 0;
  sky.color = [0.25,0.76,1.0,1.0];
  sky.matrix.scale(1000,1000,1000);

  setSlugData();
  setupMap();

  sendTextToHTML("Find the slug and make it to the end!", "instructions");

  requestAnimationFrame(tick);
}

let mapData = [
  [4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4],
  [4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4],
  [4,4,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,4,4],
  [4,4,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,4,4],
  [4,4,0,0,0,0,3,3,3,3,3,3,3,3,3,3,3,0,0,3,3,3,3,3,3,3,0,0,0,0,4,4],
  [4,4,0,0,0,0,3,0,0,0,2,0,0,0,0,0,2,0,0,2,0,0,0,0,0,3,0,0,0,0,4,4],
  [4,4,0,0,0,0,3,0,0,0,2,0,0,0,0,0,2,0,0,2,0,0,0,0,0,3,0,0,0,0,4,4],
  [4,4,0,0,0,0,3,0,0,0,2,0,0,2,0,0,2,0,0,2,0,0,2,0,0,3,0,0,0,0,4,4],
  [4,4,0,0,0,0,3,0,0,0,0,0,0,2,0,0,2,0,0,2,0,0,2,0,0,3,0,0,0,0,4,4],
  [4,4,0,0,0,0,3,0,0,2,2,2,2,2,0,0,2,0,0,2,0,0,2,0,0,3,0,0,0,0,4,4],
  [4,4,0,0,0,0,3,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,2,0,0,3,0,0,0,0,4,4],
  [4,4,0,0,0,0,3,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,2,0,0,3,0,0,0,0,4,4],
  [4,4,0,0,0,0,3,2,2,0,0,2,2,2,0,0,2,2,2,2,2,2,2,0,0,3,0,0,0,0,4,4],
  [4,4,0,0,0,0,3,0,0,0,0,0,0,2,0,0,2,0,0,0,0,0,0,0,0,3,0,0,0,0,4,4],
  [4,4,0,0,0,0,3,0,0,0,0,0,0,2,0,0,2,0,0,0,0,0,0,0,0,3,0,0,0,0,4,4],
  [4,4,0,0,0,0,3,0,0,2,2,2,2,2,2,2,2,0,0,2,2,2,2,2,2,3,0,0,0,0,4,4],
  [4,4,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,3,0,0,0,0,4,4],
  [4,4,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,3,0,0,0,0,4,4],
  [4,4,0,0,0,0,3,2,2,2,2,2,0,0,2,2,2,2,2,2,0,0,2,0,0,3,0,0,0,0,4,4],
  [4,4,0,0,0,0,3,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,2,0,0,3,0,0,0,0,4,4],
  [4,4,0,0,0,0,3,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,2,0,0,3,0,0,0,0,4,4],
  [4,4,0,0,0,0,3,0,0,2,2,2,0,0,2,2,2,2,2,2,2,2,2,0,0,3,0,0,0,0,4,4],
  [4,4,0,0,0,0,3,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,4,4],
  [4,4,0,0,0,0,3,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,4,4],
  [4,4,0,0,0,0,3,3,3,3,3,3,3,3,3,0,0,3,3,3,3,3,3,3,3,3,0,0,0,0,4,4],
  [4,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,4],
  [4,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,4],
  [4,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,4],
  [4,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,4],
  [4,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,4],  
  [4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4],
  [4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4]
];
let mapCubes = [];
// assumes the map is the same length and width
function setupMap() {
  var len = mapData.length;
  var currCube;
  var height = 0;
  var mapX;
  var mapY;
  for (let y = 0; y < len; ++y) {
    for (let x = 0; x < len; ++x) {
      if (mapData[x][y] > 0) {
        height = mapData[x][y];
        while (height > 0) {
          currCube = new Cube();
          mapX = -1*(x-(len/2));
          mapY = y-(len/2);
          currCube.mapPos = [y, height, x];
          currCube.matrix.translate(mapY, -.2, mapX);
          currCube.matrix.translate(0.5, -0.5, 0.5);
          currCube.matrix.translate(0, height, 0);
          currCube.matrix.scale(0.99999,0.99999,0.99999);
          currCube.texture = gl.TEXTURE4;
          currCube.textureNum = 4;
          mapCubes.push(currCube);
          height--;
        }
      }
    }
  }
  
  let x = 4;
  for (let h = 1; h < 4; ++h) {
    for (let y = 17; y < 19; ++y) {
      mapData[x][y]++;
      currCube = new Cube();
      mapX = -1*(4-(len/2));
      mapY = y-(len/2);
      currCube.mapPos = [y, h, x];
      currCube.matrix.translate(mapY, -.2, mapX);
      currCube.matrix.translate(0.5, -0.5, 0.5);
      currCube.matrix.translate(0, h, 0);
      currCube.matrix.scale(0.99999,0.99999,0.99999);
      currCube.texture = gl.TEXTURE5;
      currCube.textureNum = 5;
      mapCubes.push(currCube);
    }
  }
}

let newCube;
function setCube(g_camera, operation=false) {
  var d = new Vector3();
  d.set(g_camera.at);
  d.sub(g_camera.eye);
  d.normalize();
  var checker = new Vector3();
  checker.set(d);
  checker.add(g_camera.at);
  var cubePos = g_camera.getWorldPosition(checker);
  var mapPos = [-1*(cubePos[0]-16), -1*(cubePos[2]-16)];
  
  if (operation) {
    if (mapData[mapPos[1]][mapPos[0]] < 4) {
      mapData[mapPos[1]][mapPos[0]]++;
      newCube = new Cube();
      newCube.mapPos = [mapPos[0], mapData[mapPos[1]][mapPos[0]], mapPos[1]];
      newCube.matrix.translate(mapPos[0]-16, -.2, -1*(mapPos[1]-16));
      newCube.matrix.translate(0.5, -0.5, 0.5);
      newCube.matrix.translate(0, mapData[mapPos[1]][mapPos[0]], 0);
      newCube.matrix.scale(0.99999,0.99999,0.99999);
      newCube.texture = gl.TEXTURE1;
      newCube.textureNum = 1;
      mapCubes.push(newCube);
    }
    
  }
  else {
    if (mapData[mapPos[1]][mapPos[0]] > 0) {
      var cubeToDel = [mapPos[0], mapData[mapPos[1]][mapPos[0]], mapPos[1]];
      var arrCubePos = [];
      for (let i = mapCubes.length-1; i > 0; --i) {
        arrCubePos = mapCubes[i].mapPos;
        if (arrCubePos.every((value, index) => value === cubeToDel[index])) {
          mapCubes.splice(i, 1);
          mapData[mapPos[1]][mapPos[0]]--;
          return;
        }
      }
    }
  }
}

function clearEnding() {
  var cubesToDel = [
    [17, 1, 4],
    [17, 2, 4],
    [17, 3, 4],
    [18, 1, 4],
    [18, 2, 4],
    [18, 3, 4]
  ];
  let i = 0;
  let mapLen = mapCubes.length;
  while (i < mapLen) {
    for (let j = 0; j < cubesToDel.length; ++j) {
      var cubeToDel = cubesToDel[j];
      var cubeToCheck = mapCubes[i].mapPos;
      if (cubeToDel.every((value, index) => value === cubeToCheck[index])) {
        mapCubes.splice(i, 1);
        --mapLen;
        --i;
        mapData[cubeToDel[2]][cubeToDel[0]]--;
      }
    }
    ++i;
  }
}