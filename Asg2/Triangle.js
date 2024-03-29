// modified from HelloTriangle.js by Jacob Leenerts for UCSC CSE 160
// HelloTriangle.js (c) 2012 matsuda

class Triangle {
  constructor() {
    this.type = 'triangle';
    this.position = [-0.5,-0.5,0.0];
    this.color = [1.0,1.0,1.0,1.0];
    this.matrix = new Matrix4();
  }

  render() {
    var xyz = this.position;
    var rgba = this.color;

    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

    gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

    drawTriangle3D( [xyz[0]+0.5,xyz[1]+0.5,0.0, xyz[0]-0.5,xyz[1]+0.5,0, xyz[0],xyz[1]-0.5,0] );
  }
}

function drawTriangle3D(vertices) {
  var n = 3; // The number of vertices

  //gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

  // Write data into the buffer object
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);

  // Assign the buffer object to a_Position variable
  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);

  // Enable the assignment to a_Position variable
  gl.enableVertexAttribArray(a_Position);

  gl.drawArrays(gl.TRIANGLES, 0, n);
}