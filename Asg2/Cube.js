class Cube {
  constructor() {
    this.type = 'cube';
    this.color = [1.0,1.0,1.0,1.0];
    this.matrix = new Matrix4();
    this.childMatrix = new Matrix4();
  }

  render() {
    var rgba = this.color;

    // color shader
    gl.uniform4f(u_FragColor, this.color[0], this.color[1], this.color[2], this.color[3]);

    // pass the matrix to a u_ModelMatrix attribute
    gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

    var vertices = new Float32Array(
      [ -0.3,-0.3,-0.3, //a
        0.3,-0.3,-0.3,  //b
        -0.3,-0.3,0.3,  //g
        0.3,-0.3,0.3,   //h
        -0.3,0.3,0.3,   //e
        0.3,0.3,0.3,    //f
        -0.3,0.3,-0.3,  //c
        0.3,0.3,-0.3,   //d
        -0.3,-0.3,-0.3, //a
        0.3,-0.3,-0.3,  //b

        0.3,-0.3,-0.3,  //b
        0.3,-0.3,0.3,   //h
        0.3,0.3,-0.3,   //d
        0.3,0.3,0.3,    //f

        -0.3,-0.3,0.3,  //g
        -0.3,-0.3,-0.3, //a
        -0.3,0.3,0.3,   //e
        -0.3,0.3,-0.3   //c
        ]
    );

    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.DYNAMIC_DRAW);

    // Assign the buffer object to a_Position variable
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);

    // Enable the assignment to a_Position variable
    gl.enableVertexAttribArray(a_Position);

    // front face
    gl.drawArrays(gl.TRIANGLE_STRIP, 6, 4);

    // left face
    gl.drawArrays(gl.TRIANGLE_STRIP, 10, 4);

    // right face
    gl.drawArrays(gl.TRIANGLE_STRIP, 14, 4);
    
    // bottom face
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    
    // back face
    gl.drawArrays(gl.TRIANGLE_STRIP, 2, 4);
    
    // top face
    gl.drawArrays(gl.TRIANGLE_STRIP, 4, 4);
  }

  render_with_lighting() {
    var rgba = this.color;

    // color shader
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

    // pass the matrix to a u_ModelMatrix attribute
    gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

    // cube coordinates
    var vertices = new Float32Array(
      [ -0.3,-0.3,-0.3, //a
        0.3,-0.3,-0.3,  //b
        -0.3,-0.3,0.3,  //g
        0.3,-0.3,0.3,   //h
        -0.3,0.3,0.3,   //e
        0.3,0.3,0.3,    //f
        -0.3,0.3,-0.3,  //c
        0.3,0.3,-0.3,   //d
        -0.3,-0.3,-0.3, //a
        0.3,-0.3,-0.3,  //b

        0.3,-0.3,-0.3,  //b
        0.3,-0.3,0.3,   //h
        0.3,0.3,-0.3,   //d
        0.3,0.3,0.3,    //f

        -0.3,-0.3,0.3,  //g
        -0.3,-0.3,-0.3, //a
        -0.3,0.3,0.3,   //e
        -0.3,0.3,-0.3   //c
        ]
    );

    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.DYNAMIC_DRAW);

    // Assign the buffer object to a_Position variable
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);

    // Enable the assignment to a_Position variable
    gl.enableVertexAttribArray(a_Position);

    // front face
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
    gl.drawArrays(gl.TRIANGLE_STRIP, 6, 4);

    // left face
    gl.uniform4f(u_FragColor, rgba[0]*0.9, rgba[1]*0.9, rgba[2]*0.9, rgba[3]);
    gl.drawArrays(gl.TRIANGLE_STRIP, 10, 4);

    // right face
    gl.drawArrays(gl.TRIANGLE_STRIP, 14, 4);
    
    // bottom face
    gl.uniform4f(u_FragColor, rgba[0]*0.5, rgba[1]*0.5, rgba[2]*0.5, rgba[3]);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    
    // back face
    gl.uniform4f(u_FragColor, rgba[0]*0.8, rgba[1]*0.8, rgba[2]*0.8, rgba[3]);
    gl.drawArrays(gl.TRIANGLE_STRIP, 2, 4);
    
    // top face
    gl.uniform4f(u_FragColor, rgba[0]*0.85, rgba[1]*0.85, rgba[2]*0.85, rgba[3]);
    gl.drawArrays(gl.TRIANGLE_STRIP, 4, 4);
  }

  setChildMatrix() {
    this.childMatrix.set(this.matrix);
  }
}
