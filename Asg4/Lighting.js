// further modified from ColoredPoints.js by Jacob Leenerts for UCSC CSE 160
// ColoredPoints.js (c) 2012 matsuda

// Vertex shader program
var VSHADER_SOURCE =
  'precision mediump float;\n' +
  'attribute vec4 a_Position;\n' +
  'attribute vec2 a_UV;\n' +
  'attribute vec3 a_Normal;\n' +
  'varying vec2 v_UV;\n' +
  'varying vec3 v_Normal;\n' +
  'varying vec4 v_VertPos;\n' +
  'uniform mat4 u_ModelMatrix;\n' +
  'uniform mat4 u_ViewMatrix;\n' +
  'uniform mat4 u_ProjectionMatrix;\n' +
  'uniform mat4 u_NormalMatrix;\n' +
  'void main() {\n' +
  '  gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_ModelMatrix * a_Position;\n' +
  '  v_UV = a_UV;\n' +
  '  //v_Normal = a_Normal;\n' +
  '  v_Normal = normalize(vec3(u_NormalMatrix * vec4(a_Normal, 1)));\n' +
  '  v_VertPos = u_ModelMatrix * a_Position;\n' +
  '}\n';

// Fragment shader program
var FSHADER_SOURCE =
  'precision mediump float;\n' +
  'varying vec2 v_UV;\n' +
  'varying vec3 v_Normal;\n' +
  'varying vec4 v_VertPos;\n' +
  'uniform vec3 u_LightPos;\n' +
  'uniform vec3 u_LightColor;\n' +
  'uniform vec3 u_CameraPos;\n' +
  'uniform vec4 u_FragColor;\n' +
  'uniform float u_UseNormal;\n' +
  'uniform float u_UseLighting;\n' +
  'uniform sampler2D uTexture0;\n' +
  'void main() {\n' +
  '  vec4 image0 = texture2D(uTexture0, v_UV);\n' +
  '  vec3 color = mix(u_FragColor.rgb, image0.rgb, image0.a);\n' +
  '  gl_FragColor = vec4(color, 1.0);\n' +
  '\n' +
  '  // toggle normals by setting alpha value to a passed-in float and mixing\n' +
  '  vec4 visualizeNormals = vec4((v_Normal+1.0)/2.0, u_UseNormal);\n' +
  '  gl_FragColor = vec4(mix(gl_FragColor.rgb, visualizeNormals.rgb, visualizeNormals.a), 1.0);\n' +
  '\n' +
  '  // red/green lighting code to see proximity\n' +
  '  //vec3 lightVector = vec3(v_VertPos) - u_LightPos;\n' +
  '  //float r = length(lightVector);\n' +
  '  //if (r < 1.0) {\n' +
  '  //  gl_FragColor = vec4(1,0,0,1);\n' +
  '  //}\n' +
  '  //else if (r < 2.0) {\n' +
  '  //  gl_FragColor = vec4(0,1,0,1);\n' +
  '  //}\n' +
  '\n' +
  '  // light falloff visualization 1/r^2\n' +
  '  //vec3 lightVector = vec3(v_VertPos) - u_LightPos;\n' +
  '  //float r = length(lightVector);\n' +
  '  //gl_FragColor =  vec4(vec3(gl_FragColor)/(r*r), 1);\n' +
  '\n' +
  '  vec3 lightVector = u_LightPos - vec3(v_VertPos);\n' +
  '  float r = length(lightVector);\n' +
  '\n' +
  '  // N dot L\n' +
  '  vec3 L = normalize(lightVector);\n' +
  '  vec3 N = normalize(v_Normal);\n' +
  '  float nDotL = max(dot(N,L), 0.0);\n' +
  '\n' +
  '  // Reflection\n' +
  '  vec3 R = reflect(-L, N);\n' +
  '\n' +
  '  // eye\n' +
  '  vec3 E = normalize(u_CameraPos - vec3(v_VertPos));\n' +
  '\n' +
  '  vec3 specular = (pow(max(dot(E,R), 0.0), 10.0)) * u_LightColor;\n' +
  '  vec3 diffuse = vec3(gl_FragColor) * nDotL * 0.7 * u_LightColor;\n' +
  '  vec3 ambient = vec3(gl_FragColor) * 0.3;\n' +
  '  vec4 lightingColor = vec4((diffuse + ambient + specular), u_UseLighting);\n' +
  '\n' +
  '  // set alpha on lighting to zero and mix colors, which enables turning off lighting\n' +
  '  gl_FragColor = vec4(mix(gl_FragColor.rgb, lightingColor.rgb, lightingColor.a), 1.0);\n' +
  '}\n';

// Global Variables
let canvas;
let gl;

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
  floor.normalMatrix.setInverseOf(floor.matrix).transpose();
  
  sky = new Sphere();
  sky.generate_Vertices(10);
  sky.texture = gl.TEXTURE0;
  sky.textureNum = 0;
  sky.color = [0.25,0.76,1.0,1.0];
  sky.matrix.scale(-50,-50,-50);
  sky.matrix.translate(0,0.25,0);
  sky.normalMatrix.setInverseOf(sky.matrix).transpose();
  sky.normalMatrix.scale(-1,-1,-1);

  testSphere = new Sphere();
  testSphere.generate_Vertices();
  testSphere.texture = gl.TEXTURE3;
  testSphere.textureNum = 3;
  testSphere.color = [1,0,0,1];
  testSphere.matrix.translate(4,1,5);
  testSphere.normalMatrix.setInverseOf(testSphere.matrix).transpose();

  light = new Cube();
  light.color = [1,1,0,1];
  light.texture = gl.TEXTURE0;
  light.textureNum = 0;
  

  setSlugData();
  setupMap();

  requestAnimationFrame(tick);
}

let mapData = [
  [4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4],
  [4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4],
  [4,4,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,4,4],
  [4,4,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,4,4],
  [4,4,0,0,0,0,3,3,3,3,3,3,3,3,3,3,3,0,0,3,3,3,3,3,3,3,0,0,0,0,4,4],
  [4,4,0,0,0,0,3,0,0,0,0,0,0,0,2,0,0,0,0,2,0,0,0,0,0,3,0,0,0,0,4,4],
  [4,4,0,0,0,0,3,0,0,0,0,0,0,0,2,0,0,0,0,2,0,0,0,0,0,3,0,0,0,0,4,4],
  [4,4,0,0,0,0,3,0,0,0,0,0,0,0,2,0,0,2,2,2,0,0,0,0,0,3,0,0,0,0,4,4],
  [4,4,0,0,0,0,3,0,0,0,0,0,0,0,2,0,0,2,0,0,0,0,0,0,0,3,0,0,0,0,4,4],
  [4,4,0,0,0,0,3,0,0,0,0,0,0,0,2,0,0,2,0,0,0,0,0,0,0,3,0,0,0,0,4,4],
  [4,4,0,0,0,0,3,0,0,0,0,0,0,0,2,0,0,2,0,0,0,0,0,0,0,3,0,0,0,0,4,4],
  [4,4,0,0,0,0,3,0,0,0,0,0,0,0,2,0,0,2,0,0,0,0,0,0,0,3,0,0,0,0,4,4],
  [4,4,0,0,0,0,3,0,0,0,0,0,0,0,2,0,0,2,0,0,0,0,0,0,0,3,0,0,0,0,4,4],
  [4,4,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,4,4],
  [4,4,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,4,4],
  [4,4,0,0,0,0,3,2,2,2,2,2,2,2,2,0,0,2,2,2,2,2,2,2,2,3,0,0,0,0,4,4],
  [4,4,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,4,4],
  [4,4,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,4,4],
  [4,4,0,0,0,0,3,0,0,0,0,0,0,0,2,0,0,2,0,0,0,0,0,0,0,3,0,0,0,0,4,4],
  [4,4,0,0,0,0,3,0,0,0,0,0,0,0,2,0,0,2,0,0,0,0,0,0,0,3,0,0,0,0,4,4],
  [4,4,0,0,0,0,3,0,0,0,0,0,0,0,2,0,0,2,0,0,0,0,0,0,0,3,0,0,0,0,4,4],
  [4,4,0,0,0,0,3,0,0,0,0,0,0,0,2,0,0,2,0,0,0,0,0,0,0,3,0,0,0,0,4,4],
  [4,4,0,0,0,0,3,0,0,0,0,0,0,0,2,0,0,2,0,0,0,0,0,0,0,3,0,0,0,0,4,4],
  [4,4,0,0,0,0,3,0,0,0,0,0,0,0,2,0,0,2,0,0,0,0,0,0,0,3,0,0,0,0,4,4],
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
          currCube.normalMatrix.setInverseOf(currCube.matrix).transpose();
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
      currCube.normalMatrix.setInverseOf(currCube.matrix).transpose();
      currCube.texture = gl.TEXTURE5;
      currCube.textureNum = 5;
      mapCubes.push(currCube);
    }
  }
}