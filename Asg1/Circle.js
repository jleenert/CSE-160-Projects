class Circle {
  constructor() {
    this.type = 'circle';
    this.position = [0.0,0.0,0.0];
    this.color = [1.0,1.0,1.0,1.0];
    this.size = 5.0;
    this.segments = 10;
  }

  render() {
    var xy = this.position;
    var rgba = this.color;
    var size = this.size;

    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

    var d = this.size/400.0; // delta
    let angleStep = 360/this.segments;
    let centerPt = [xy[0], xy[1]];
    let angle1, angle2;
    let vec1 = [0.0, 0.0];
    let vec2 = [0.0, 0.0];
    let pt1 = [0.0, 0.0];
    let pt2 = [0.0, 0.0];
    for (var angle = 0; angle < 360; angle=angle+angleStep) {
      angle1 = angle;
      angle2 = angle + angleStep;
      vec1 = [Math.cos(angle1*Math.PI/180)*d, Math.sin(angle1*Math.PI/180)*d];
      vec2 = [Math.cos(angle2*Math.PI/180)*d, Math.sin(angle2*Math.PI/180)*d];
      pt1 = [centerPt[0]+vec1[0], centerPt[1]+vec1[1]];
      pt2 = [centerPt[0]+vec2[0], centerPt[1]+vec2[1]];
      drawTriangle( [xy[0], xy[1], pt1[0], pt1[1], pt2[0], pt2[1]] );
    }
  }
}

function drawTriangle(vertices) {
  var n = 3; // The number of vertices

  // Write data into the buffer object
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);

  // Assign the buffer object to a_Position variable
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

  // Enable the assignment to a_Position variable
  gl.enableVertexAttribArray(a_Position);

  gl.drawArrays(gl.TRIANGLES, 0, n);
}
