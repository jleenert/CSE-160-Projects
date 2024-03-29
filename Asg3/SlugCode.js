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
let frontBody = new SlugCube();
let midsection = new SlugCube();
let backBody = new SlugCube();
let neck = new SlugCube();
let eye1 = new SlugCube();
let eye2 = new SlugCube();

function setSlugData() {
  frontBody.color = [0.9, 0.85, 0.0, 1.0];
  neck.color = [1, 0.93, 0.0, 1.0];
  eye1.color = [1, 0.93, 0.0, 1.0];
  eye2.color = [1, 0.93, 0.0, 1.0];
  backBody.color = [0.93, 0.93, 0.0, 1.0];
}

function renderSlug() {
  // front body
  frontBody.matrix.setIdentity();
  frontBody.matrix.scale(0.8, 0.5, 0.5);
  frontBody.matrix.translate(-8, -.1, -6);
  frontBody.matrix.translate(0,0,frontBodyPos);
  frontBody.setChildMatrix();
  frontBody.matrix.rotate(frontBodyRot, 0, 1, 0);
  frontBody.render_with_lighting();

  // neck
  neck.matrix.set(frontBody.childMatrix);
  neck.matrix.rotate(neckRotAng, 1, 0, 0);
  neck.matrix.rotate(90, 0, 0, 1);
  neck.matrix.translate(0.4,0.2,0);
  neck.setChildMatrix();
  neck.matrix.scale(1.5,0.5,0.9);
  neck.render_with_lighting();

  // eye stalk
  eye1.matrix.set(neck.childMatrix);
  eye1.matrix.rotate(eyesRotAng, 0,1,0);
  eye1.matrix.scale(1.6,0.1,0.1);
  eye1.matrix.translate(0.27,1,2);
  eye1.matrix.scale(eyeScaleVal, 1, 1);
  eye1.render();

  // second eye stalk
  eye2.matrix.set(neck.childMatrix);
  eye2.matrix.rotate(-eyesRotAng, 0,1,0);
  eye2.matrix.scale(1.6,0.1,0.1);
  eye2.matrix.translate(0.27,1,-2); // change first value for vertical
  eye2.matrix.scale(eyeScaleVal, 1, 1);
  eye2.render();

  // back body
  backBody.matrix.set(frontBody.childMatrix);
  backBody.matrix.rotate(backBodyRot, 0, 1, 0);
  backBody.matrix.translate(.5,-0.005,0.01);
  backBody.setChildMatrix();
  backBody.render_with_lighting();
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