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

let g_startAnimation = true;
// objects to be rendered
let frontBody = new Cube();
let backBody = new Cube();
let neck = new Cube();
let eye1 = new Cube();
let eye2 = new Cube();

function setSlugData() {
  frontBody.color = [0.9, 0.85, 0.0, 1.0];
  frontBody.texture = gl.TEXTURE0;
  frontBody.textureNum = 0;

  neck.color = [1, 0.93, 0.0, 1.0];
  neck.texture = gl.TEXTURE0;
  neck.textureNum = 0;

  eye1.color = [1, 0.93, 0.0, 1.0];
  eye1.texture = gl.TEXTURE0;
  eye1.textureNum = 0;

  eye2.color = [1, 0.93, 0.0, 1.0];
  eye2.texture = gl.TEXTURE0;
  eye2.textureNum = 0;

  backBody.color = [0.93, 0.93, 0.0, 1.0];
  backBody.texture = gl.TEXTURE0;
  backBody.textureNum = 0;
}

function renderSlug() {
  // front body
  frontBody.matrix.setIdentity();
  frontBody.matrix.scale(0.8, 0.5, 0.5);
  frontBody.matrix.translate(-8, -.1, -6);
  frontBody.matrix.translate(0,0,frontBodyPos);
  //frontBody.setChildMatrix();
  neck.matrix.set(frontBody.matrix);
  backBody.matrix.set(frontBody.matrix);
  frontBody.matrix.rotate(frontBodyRot, 0, 1, 0);
  frontBody.normalMatrix.setInverseOf(frontBody.matrix).transpose();
  frontBody.render_with_UVs();

  // neck
  //neck.matrix.set(frontBody.childMatrix);
  neck.matrix.rotate(neckRotAng, 1, 0, 0);
  neck.matrix.rotate(90, 0, 0, 1);
  neck.matrix.translate(0.4,0.2,0);
  eye1.matrix.set(neck.matrix);
  eye2.matrix.set(neck.matrix);
  neck.matrix.scale(1.5,0.5,0.8);
  neck.normalMatrix.setInverseOf(neck.matrix).transpose();
  neck.render_with_UVs();

  // eye stalk
  //eye1.matrix.set(neck.childMatrix);
  eye1.matrix.rotate(eyesRotAng, 0,1,0);
  eye1.matrix.scale(1.6,0.1,0.1);
  eye1.matrix.translate(0.27,1,2);
  eye1.matrix.scale(eyeScaleVal, 1, 1);
  eye1.normalMatrix.setInverseOf(eye1.matrix).transpose();
  eye1.render_with_UVs();

  // second eye stalk
  //eye2.matrix.set(neck.childMatrix);
  eye2.matrix.rotate(-eyesRotAng, 0,1,0);
  eye2.matrix.scale(1.6,0.1,0.1);
  eye2.matrix.translate(0.27,1,-2); // change first value for vertical
  eye2.matrix.scale(eyeScaleVal, 1, 1);
  eye2.normalMatrix.setInverseOf(eye2.matrix).transpose();
  eye2.render_with_UVs();

  // back body
  //backBody.matrix.set(frontBody.childMatrix);
  backBody.matrix.rotate(backBodyRot, 0, 1, 0);
  backBody.matrix.translate(.5,-0.005,0.01);
  //backBody.setChildMatrix();
  backBody.normalMatrix.setInverseOf(backBody.matrix).transpose();
  backBody.render_with_UVs();
}

function updateSlugAngles() {
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