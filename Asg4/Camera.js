class Camera {
  constructor() {
    this.eye = new Vector3([0, 1.3, -2.5]);
    this.at = new Vector3([0, 1.3, -1.5]);
    this.up = new Vector3([0, 1, 0]);

    this.viewMatrix = new Matrix4();
    this.projMatrix = new Matrix4();
  }

  forward() {
    var d = new Vector3();
    d.set(this.at);
    d.sub(this.eye);
    d.normalize();
    d.div(30);
    this.at.add(d);
    this.eye.add(d);
  }

  backward() {
    var d = new Vector3();
    d.set(this.at);
    d.sub(this.eye);
    d.normalize();
    d.div(30);
    this.at.sub(d);
    this.eye.sub(d);
  }

  left() {
    var d = new Vector3();
    d.set(this.eye);
    d.sub(this.at);
    d.normalize();
    var l = Vector3.cross(d, this.up);
    l.normalize();
    l.div(30);
    this.at.add(l);
    this.eye.add(l);
  }

  right() {
    var d = new Vector3();
    d.set(this.eye);
    d.sub(this.at);
    d.normalize();
    var r = Vector3.cross(d, this.up);
    r.normalize();
    r.div(30);
    r.mul(-1);
    this.at.add(r);
    this.eye.add(r);
  }

  upwards() {
    var div = new Vector3;
    div.set(this.up);
    div.div(20);
    this.at.add(div);
    this.eye.add(div);
  }

  downwards() {
    var div = new Vector3;
    div.set(this.up);
    div.div(20);
    this.at.sub(div);
    this.eye.sub(div);
  }

  panLeft(alpha=1) {
    var atP = new Vector3();
    atP.set(this.at);
    atP.sub(this.eye);
    
    var rotationMatrix = new Matrix4();
    rotationMatrix.setRotate(alpha, this.up.elements[0], this.up.elements[1], this.up.elements[2]);
    
    var f_prime = rotationMatrix.multiplyVector3(atP);
    this.at.set(f_prime);
    this.at.add(this.eye);
  }

  panRight(alpha=1) {
    var atP = new Vector3();
    atP.set(this.at);
    atP.sub(this.eye);
    
    var rotationMatrix = new Matrix4();
    rotationMatrix.setRotate(-alpha, this.up.elements[0], this.up.elements[1], this.up.elements[2]);
    
    var f_prime = rotationMatrix.multiplyVector3(atP);
    this.at.set(f_prime);
    this.at.add(this.eye);
  }

  // this function taken from https://people.ucsc.edu/~sgonza85/CSE160/asgn3/BlockyWorld.html
  panCam(alphaX=1, alphaY=1) {
    var f = new Vector3();
    f.set(this.at);
    f.sub(this.eye);
    var rot = new Matrix4();
    rot.setRotate(alphaX, this.up.elements[0], this.up.elements[1], this.up.elements[2]);
    var f_prime = rot.multiplyVector3(f);
    var d = Vector3.cross(f_prime, this.up);
    rot.setRotate(alphaY, d.elements[0], d.elements[1], d.elements[2]);
    var d_prime = rot.multiplyVector3(f_prime);
    d_prime.add(this.eye);
    this.at = d_prime;
  }

  // get the nice xyz coordinates
  getWorldPosition(position=this.at) {
    var result = [];
    result.push(Math.ceil(position.elements[0]));
    result.push(Math.ceil(position.elements[1]));
    result.push(Math.ceil(position.elements[2])-1);
    return result;
  }

  checkBounds(position) {
    //console.log(this.getWorldPosition());
    //var newPosition = position;
    var newPosition = this.getWorldPosition(position);
    if (newPosition[0] > 16 || newPosition[0] < -15) {
      return false;
    }
    if (newPosition[1] > 7 || newPosition[1] < 2) {
      return false;
    }
    if (newPosition[2] > 16 || newPosition[2] < -15) {
      return false;
    }

    var mapPos = [-1*(newPosition[0]-16), -1*(newPosition[2]-16)];
    //console.log(mapPos);
    //console.log(mapData[mapPos[1]][mapPos[0]]);
    if (mapData[mapPos[1]][mapPos[0]] != 0) {
      if (newPosition[1] <= (mapData[mapPos[1]][mapPos[0]]+1)) {
        return false;
      }
    }
    return true;
  }
}