// modified from HelloTriangle.js by Jacob Leenerts for UCSC CSE 160
// HelloTriangle.js (c) 2012 matsuda

class Triangle {
  constructor() {
    this.type = 'triangle';
    this.position = [0.0,0.0,0.0];
    this.color = [1.0,1.0,1.0,1.0];
    this.size = 5.0;
  }

  render() {
    var xy = this.position;
    var rgba = this.color;
    var size = this.size;

    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

    gl.uniform1f(u_Size, size);

    var d = this.size/200.0; // delta
    drawTriangle ( [xy[0], xy[1], xy[0]+d, xy[1], xy[0], xy[1]+d] );
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
  //return n;
}