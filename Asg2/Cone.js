class Cone {
  constructor() {
    this.type = 'cone';
    this.color = [1.0, 1.0, 1.0, 1.0];
    this.radius = 0.3;
    this.height = 0.45;
    this.segments = 8;
    this.matrix = new Matrix4();
    this.childMatrix = new Matrix4();
  }

  render() {
    var rgba = this.color;
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
    gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

    var vertices = [];

    // top vertex
    vertices.push(0.0, this.height, 0.0);

    // bottom vertices
    for (var i = 0; i <= this.segments; i++) {
      var angle = i * 2.0 * Math.PI / this.segments;
      var x = this.radius * Math.cos(angle);
      var y = 0.0;
      var z = this.radius * Math.sin(angle);
      vertices.push(x, y, z);
    }
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(vertices), gl.DYNAMIC_DRAW);

    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Position);

    gl.drawArrays(gl.TRIANGLE_FAN, 0, (vertices.length)/3);
  }

  render_experimental() {
    var rgba = this.color;
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
    gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

    var vertices = [];

    // top vertex
    //vertices.push(0.0, this.height, 0.0);

    // bottom vertices
    for (var i = 0; i <= this.segments; i++) {
      if (i % 2 == 0) {
        vertices.push(0.0, this.height, 0.0);
      }
      var angle = i * 2.0 * Math.PI / this.segments;
      var x = this.radius * Math.cos(angle);
      var y = 0.0;
      var z = this.radius * Math.sin(angle);
      vertices.push(x, y, z);
    }
    //vertices.push(vertices);
    var arrToPass = new Float32Array(vertices);

    gl.bufferData(gl.ARRAY_BUFFER, arrToPass, gl.DYNAMIC_DRAW);
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Position);

    //gl.drawArrays(gl.TRIANGLE_FAN, 0, (vertices.length)/3);
    
    var tris = vertices.length/3;
    for (var i = 0; i < tris; ++i) {
      gl.drawArrays(gl.TRIANGLE, (i*3), 3);
      //console.log((i*3));
    }
    console.log("arrToPass is "+arrToPass.length);
    console.log("vertices len is "+vertices.length);
  }
}