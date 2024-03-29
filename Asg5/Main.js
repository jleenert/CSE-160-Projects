// modified by Jacob Leenerts for UCSC CSE 160
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

const container = document.querySelector('#cvs');
const renderer = new THREE.WebGLRenderer({antialias: true, alpha:true, container});
const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 300);
const camControls = new OrbitControls(camera, container);
const scene = new THREE.Scene();

const loader = new THREE.TextureLoader();
const objLoader = new OBJLoader();
const mtlLoader = new MTLLoader();

const ambient = new THREE.AmbientLight(0xFFFFFF, 2);
const sunlight = new THREE.DirectionalLight(0x00ffdd, 1);
const trafficLight = new THREE.SpotLight(0x00ff00, 5, 20, 0.3926, 1);

// post processing
let clock = new THREE.Clock();
const renderScene = new RenderPass(scene, camera);
const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
const outputPass = new OutputPass(THREE.ReinhardToneMapping);
let composer = new EffectComposer(renderer);

//var shapes = [];
var light;
var sign;
var roadAlias;
var trees = [];
function init() {
  // window settings
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
  container.appendChild( renderer.domElement );
  window.addEventListener('resize', resize);

  // camera settings + controls
  camera.position.set(0, 6, -15);
  camControls.target.set(0, 4, 0);
  camControls.update();

  setSceneGeo();

  // lights
  scene.add(ambient);
  sunlight.position.set(0, 2, 4);
  scene.add(sunlight);
  trafficLight.position.set(light.position);
  trees.push(trafficLight);
  scene.add(trafficLight);

  scene.fog = new THREE.Fog(0xff8000, 20, 40);

  //post processing setup
  setupBloomEffects()

  // time to render this bitch, oh yeah
  requestAnimationFrame(render);
}

function setSceneGeo() {
  // bottom plane
  const planeGeo = new THREE.PlaneGeometry(100, 100);
  const planeMat = new THREE.MeshBasicMaterial({
    color: 0x595959,
    side: THREE.DoubleSide
  });
  const planeMesh = new THREE.Mesh(planeGeo, planeMat);
  planeMesh.receiveShadow = true;
  planeMesh.rotation.x = Math.PI * -.5;
  planeMesh.position.y = -.12;
  scene.add(planeMesh);
  for (var i = -1; i <= 1; i+=2) {
    const fogGeo = new THREE.PlaneGeometry(100, 5);
    const fogMat = new THREE.MeshBasicMaterial({
      color: 0x595959,
      side: THREE.DoubleSide
    });
    const fogMesh = new THREE.Mesh(fogGeo, fogMat);
    fogMesh.position.z += i * 50;
    scene.add(fogMesh);
  }
  for (var i = -1; i <= 1; i+=2) {
    const fogGeo = new THREE.PlaneGeometry(100, 5);
    const fogMat = new THREE.MeshBasicMaterial({
      color: 0x595959,
      side: THREE.DoubleSide
    });
    const fogMesh = new THREE.Mesh(fogGeo, fogMat);
    fogMesh.position.x += i * 50;
    fogMesh.rotation.y = Math.PI * -.5;
    scene.add(fogMesh);
  }

  // road grid
  const gridTexture = loader.load('./textures/purp-grid.jpg');
  gridTexture.wrapS = THREE.RepeatWrapping;
  gridTexture.wrapT = THREE.RepeatWrapping;
  gridTexture.repeat.set(3,11);
  gridTexture.minFilter = THREE.LinearMipmapLinearFilter;
  gridTexture.magFilter = THREE.NearestFilter;
  const gridGeo = new THREE.PlaneGeometry(20, 100);
  const gridMat = new THREE.MeshBasicMaterial({
    map: gridTexture,
    side: THREE.DoubleSide,
  });
  const gridMesh = new THREE.Mesh(gridGeo, gridMat);
  gridMesh.receiveShadow = true;
  gridMesh.rotation.x = Math.PI * -.5;
  gridMesh.position.y = -.11;
  scene.add(gridMesh);
  roadAlias = gridMesh;

  // car
  mtlLoader.load('models/testarossa/Testarossa.mtl', (mtl) => {
    mtl.preload();
    for (const material of Object.values(mtl.materials)) {
      material.side = THREE.DoubleSide;
    }
    objLoader.setMaterials(mtl);
    objLoader.load('models/testarossa/Testarossa.obj', (root) => {
      root.position.x = 2;
      scene.add(root);
    });
  });

  // city background
  const cityMtlLoader = new MTLLoader();
  const cityObjLoader = new OBJLoader();
  cityMtlLoader.load('models/Blocks_Skyline/materials.mtl', (mtl) => {
    mtl.preload();
    // thanks chatGPT for below loop
    Object.keys(mtl.materials).forEach(function (materialName) {
      const material = mtl.materials[materialName];
      material.fog = false; // Set fog to false for each material
    });
    for (const material of Object.values(mtl.materials)) {
      material.side = THREE.DoubleSide;
    }
    cityObjLoader.setMaterials(mtl);
    cityObjLoader.load('models/Blocks_Skyline/model.obj', (root) => {
      root.position.x = -94;
      root.position.y = 10;
      root.rotation.y = Math.PI * -.5;
      root.scale.set(15,15,15);
      scene.add(root);
    });
  });

  cityMtlLoader.load('models/Blocks_Skyline/materials.mtl', (mtl) => {
    mtl.preload();
    // thanks chatGPT for below loop
    Object.keys(mtl.materials).forEach(function (materialName) {
      const material = mtl.materials[materialName];
      material.fog = false; // Set fog to false for each material
    });
    for (const material of Object.values(mtl.materials)) {
      material.side = THREE.DoubleSide;
    }
    cityObjLoader.setMaterials(mtl);
    cityObjLoader.load('models/Blocks_Skyline/model.obj', (root) => {
      root.position.x = 94;
      root.position.y = 10;
      root.rotation.y = Math.PI * .5;
      root.scale.set(15,15,15);
      scene.add(root);
    });
  });

  //trees
  createTree(8.5,3,0);
  createTree(8.5,3,7);
  createTree(8.5,3,-7);
  createTree(8.5,3,14);
  createTree(8.5,3,-14);
  createTree(8.5,3,21);
  createTree(8.5,3,-21);
  createTree(8.5,3,28);
  createTree(8.5,3,-28);
  createTree(8.5,3,35);
  createTree(-8.5,3,0);
  createTree(-8.5,3,7);
  createTree(-8.5,3,-7);
  createTree(-8.5,3,14);
  createTree(-8.5,3,-14);
  createTree(-8.5,3,21);
  createTree(-8.5,3,-21);
  createTree(-8.5,3,28);
  createTree(-8.5,3,-28);
  createTree(-8.5,3,35);
  createDivider(0,0.3,0);
  createDivider(0,0.3,3.5);
  createDivider(0,0.3,7);
  createDivider(0,0.3,10.5);
  createDivider(0,0.3,14);
  createDivider(0,0.3,17.5);
  createDivider(0,0.3,-32);
  createDivider(0,0.3,-28.5);
  createDivider(0,0.3,-25);
  createDivider(0,0.3,-21.5);
  createDivider(0,0.3,-18);
  createDivider(0,0.3,-14.5);
  
  // set rest of geo manually
  const sphereGeo = new THREE.SphereGeometry(0.2, 21, 15);
  const sphereMat = new THREE.MeshPhongMaterial({
    color: 0x00ff00
  });
  const sphere = new THREE.Mesh(sphereGeo, sphereMat);
  sphere.position.set(2, 5, -0.1);
  trees.push(sphere);
  scene.add(sphere);
  light = sphere;

  const cylinderGeo = new THREE.CylinderGeometry(0.1,0.3,7,18);
  const cylinderMat = new THREE.MeshBasicMaterial({
    color: 0x0039a3
  });
  const cylinder = new THREE.Mesh(cylinderGeo, cylinderMat);
  cylinder.position.set(5, 3.4, 0);
  trees.push(cylinder);
  scene.add(cylinder);

  const cylinderGeo2 = new THREE.CylinderGeometry(0.1,0.1,4,18);
  const cylinder2 = new THREE.Mesh(cylinderGeo2, cylinderMat);
  cylinder2.position.set(3, 6.5, 0);
  cylinder2.rotation.z = Math.PI * 0.5;
  trees.push(cylinder2);
  scene.add(cylinder2);

  const signGeo = new THREE.BoxGeometry(0.7, 1.4, 0.5);
  const box = new THREE.Mesh(signGeo, cylinderMat);
  box.position.set(2, 5.3, 0);
  trees.push(box);
  scene.add(box);
  sign = box;
  
  
  // background
  const cubeLoader = new THREE.CubeTextureLoader();
  const texture = cubeLoader.load(
    ['./textures/outrun-bg/bg-3.jpg',
    './textures/outrun-bg/bg-2.jpg',
    './textures/outrun-bg/bg-5.jpg',
    './textures/outrun-bg/bg-4.jpg',
    './textures/outrun-bg/bg-1.jpg',
    './textures/outrun-bg/bg-6.jpg']);
  texture.magFilter = THREE.NearestFilter;
  scene.background = texture;
}

function setupBloomEffects() {
  bloomPass.threshhold = 0;
  bloomPass.strength = 0.7;
  bloomPass.radius = 0;

  composer.addPass(renderScene);
  composer.addPass(bloomPass);
  composer.addPass(outputPass);
  composer.setSize(window.innerWidth, window.innerHeight);

  outputPass.toneMappingExposure = Math.pow(0.95, 4.0);
}

function createTree(x, y, z) {
  const texture = loader.load('./textures/scaled_tree.png');
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.NearestFilter;
  const treeMat = new THREE.SpriteMaterial({
    map:texture,
    transparent: true
  });
  const tree = new THREE.Sprite(treeMat);
  tree.position.set(x, y, z);
  tree.scale.x = 6.5;
  tree.scale.y = 6.5;
  trees.push(tree);
  scene.add(tree);
}

function createDivider(x, y, z) {
  const texture = loader.load('./textures/cement.jpg');
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.NearestFilter;
  const material = new THREE.MeshBasicMaterial({
    map: texture,
  });
  const geo = new THREE.BoxGeometry(0.4,0.8,3);
  const divider = new THREE.Mesh(geo, material);
  divider.position.set(x, y, z);
  trees.push(divider);
  scene.add(divider);
}

var now;
var angle;
var radian;
var sinTheta;
var cosTheta;
console.log(Math.sin(45));
function updateSign() {
  now = performance.now()/1000;
  angle = Math.sin(now)*45;
  radian = (angle * Math.PI)/180;
  sinTheta = -Math.sin(radian);
  cosTheta = -Math.cos(radian);
  light.position.x = 2 + 1.6*sinTheta;
  light.position.y = 6.5 + 1.6*cosTheta;
  sign.position.x = 2 + 1.3*sinTheta;
  sign.position.y = 6.5 + 1.3*cosTheta;
  sign.rotation.z = -radian;
}

var last = performance.now();
var now = performance.now();
var delta;
function render() {

  now = performance.now();
  delta = (performance.now()-last)/100;

  
  roadAlias.position.z = roadAlias.position.z - delta;
  if (roadAlias.position.z <= -10) {
    roadAlias.position.z += 20;
  }
  trees.forEach((obj) => {
    obj.position.z = obj.position.z - delta;
    if (obj.position.z <= -35) {
      obj.position.z += 70;
    }
  });
  last = now;
  updateSign();
 
  composer.render();
  //renderer.render(scene, camera);
  
 
  requestAnimationFrame(render);
}

// handle browser resize
function resize(ev) {
  const width = window.innerWidth;
  const height = window.innerHeight;

  camera.aspect = width/height;
	camera.updateProjectionMatrix();
	renderer.setSize(width, height);
  composer.setSize(width, height);
}

init();