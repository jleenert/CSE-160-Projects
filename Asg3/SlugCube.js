class SlugCube {
  static VERTICES = new Float32Array(
    [ // front face
      -0.3,-0.3,-0.3,   0.5,0.25,  //a
      0.3,-0.3,-0.3,    0.75,0.25, //b
      -0.3,0.3,-0.3,    0.5,0.5,   //c

      -0.3,0.3,-0.3,    0.5,0.5,   //c
      0.3,-0.3,-0.3,    0.75,0.25, //b
      0.3,0.3,-0.3,     0.75,0.5,  //d
      
      // back face
      0.3,-0.3,0.3,     0.0,0.25,  //h
      -0.3,-0.3,0.3,    0.25,0.25, //g
      0.3,0.3,0.3,      0.0,0.5,   //f

      0.3,0.3,0.3,      0.0,0.5,   //f
      -0.3,-0.3,0.3,    0.25,0.25, //g
      -0.3,0.3,0.3,     0.25,0.5,  //e

      // left face
      -0.3,-0.3,0.3,    0.25,0.25, //g
      -0.3,0.3,-0.3,    0.5,0.5,   //c
      -0.3,-0.3,-0.3,   0.5,0.25,  //a

      -0.3,0.3,-0.3,    0.5,0.5,   //c
      -0.3,-0.3,0.3,    0.25,0.25, //g
      -0.3,0.3,0.3,     0.25,0.5,  //e

      // right face
      0.3,-0.3,-0.3,    0.75,0.25, //b
      0.3,0.3,-0.3,     0.75,0.5,  //d
      0.3,-0.3,0.3,     1,0.25,    //h

      0.3,-0.3,0.3,     1,0.25,    //h
      0.3,0.3,-0.3,     0.75,0.5,  //d
      0.3,0.3,0.3,      1.0,0.5,   //f

      // top face
      -0.3,0.3,-0.3,    0.5,0.5,   //c
      0.3,0.3,-0.3,     0.75,0.5,  //d
      -0.3,0.3,0.3,     0.5,0.75,  //e

      -0.3,0.3,0.3,     0.5,0.75,  //e
      0.3,0.3,-0.3,     0.75,0.5,  //d
      0.3,0.3,0.3,      0.75,0.75, //f

      // bottom face
      -0.3,-0.3,-0.3,   0.5,0.25,  //a
      0.3,-0.3,-0.3,    0.75,0.25, //b
      -0.3,-0.3,0.3,    0.5,0,     //g

      -0.3,-0.3,0.3,    0.5,0,     //g
      0.3,-0.3,-0.3,    0.75,0.25, //b
      0.3,-0.3,0.3,     0.75,0,    //h
      ]
  );
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

    gl.bufferData(gl.ARRAY_BUFFER, SlugCube.VERTICES, gl.DYNAMIC_DRAW);

    // Assign the buffer object to a_Position variable
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE*5, 0);

    // Enable the assignment to a_Position variable
    gl.enableVertexAttribArray(a_Position);

    // change the current texture to be transparent
    gl.activeTexture(gl.TEXTURE0);
    gl.uniform1i(uTexture0, 0);

    gl.drawArrays(gl.TRIANGLES, 0, 36);
  }

  render_with_lighting2() {
    var rgba = this.color;

    // color shader
    gl.uniform4f(u_FragColor, this.color[0], this.color[1], this.color[2], this.color[3]);

    // pass the matrix to a u_ModelMatrix attribute
    gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

    gl.bufferData(gl.ARRAY_BUFFER, SlugCube.VERTICES, gl.DYNAMIC_DRAW);

    // Assign the buffer object to a_Position variable
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE*5, 0);

    // Enable the assignment to a_Position variable
    gl.enableVertexAttribArray(a_Position);

    // change the current texture to be transparent
    gl.activeTexture(gl.TEXTURE0);
    gl.uniform1i(uTexture0, 0);

    gl.drawArrays(gl.TRIANGLES, 0, 36);
  }

  render_with_lighting() {
    var rgba = this.color;

    // pass the matrix to a u_ModelMatrix attribute
    gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

    gl.bufferData(gl.ARRAY_BUFFER, SlugCube.VERTICES, gl.DYNAMIC_DRAW);

    // Assign the buffer object to a_Position variable
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE*5, 0);

    // Enable the assignment to a_Position variable
    gl.enableVertexAttribArray(a_Position);

    // change the current texture to be transparent
    gl.activeTexture(gl.TEXTURE0);
    gl.uniform1i(uTexture0, 0);

    // front face
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
    gl.drawArrays(gl.TRIANGLES, 0, 6);

    // left face
    gl.uniform4f(u_FragColor, rgba[0]*0.9, rgba[1]*0.9, rgba[2]*0.9, rgba[3]);
    gl.drawArrays(gl.TRIANGLES, 12, 6);

    // right face
    gl.drawArrays(gl.TRIANGLES, 18, 6);
    
    // bottom face
    gl.uniform4f(u_FragColor, rgba[0]*0.5, rgba[1]*0.5, rgba[2]*0.5, rgba[3]);
    gl.drawArrays(gl.TRIANGLES, 30, 6);
    
    // back face
    gl.uniform4f(u_FragColor, rgba[0]*0.8, rgba[1]*0.8, rgba[2]*0.8, rgba[3]);
    gl.drawArrays(gl.TRIANGLES, 6, 6);
    
    // top face
    gl.uniform4f(u_FragColor, rgba[0]*0.85, rgba[1]*0.85, rgba[2]*0.85, rgba[3]);
    gl.drawArrays(gl.TRIANGLES, 24, 6);
  }

  setChildMatrix() {
    this.childMatrix.set(this.matrix);
  }
}
