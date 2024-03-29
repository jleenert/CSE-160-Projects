class Cube {
  static VERTICES = new Float32Array(
      [ // front face
      -0.5,-0.5,-0.5,   0.5,0.25,  //a
      0.5,-0.5,-0.5,    0.75,0.25, //b
      -0.5,0.5,-0.5,    0.5,0.5,   //c

      -0.5,0.5,-0.5,    0.5,0.5,   //c
      0.5,-0.5,-0.5,    0.75,0.25, //b
      0.5,0.5,-0.5,     0.75,0.5,  //d
      
      // back face
      0.5,-0.5,0.5,     0.0,0.25,  //h
      -0.5,-0.5,0.5,    0.25,0.25, //g
      0.5,0.5,0.5,      0.0,0.5,   //f

      0.5,0.5,0.5,      0.0,0.5,   //f
      -0.5,-0.5,0.5,    0.25,0.25, //g
      -0.5,0.5,0.5,     0.25,0.5,  //e

      // left face
      -0.5,-0.5,0.5,    0.25,0.25, //g
      -0.5,0.5,-0.5,    0.5,0.5,   //c
      -0.5,-0.5,-0.5,   0.5,0.25,  //a

      -0.5,0.5,-0.5,    0.5,0.5,   //c
      -0.5,-0.5,0.5,    0.25,0.25, //g
      -0.5,0.5,0.5,     0.25,0.5,  //e

      // right face
      0.5,-0.5,-0.5,    0.75,0.25, //b
      0.5,0.5,-0.5,     0.75,0.5,  //d
      0.5,-0.5,0.5,     1,0.25,    //h

      0.5,-0.5,0.5,     1,0.25,    //h
      0.5,0.5,-0.5,     0.75,0.5,  //d
      0.5,0.5,0.5,      1.0,0.5,   //f

      // top face
      -0.5,0.5,-0.5,    0.5,0.5,   //c
      0.5,0.5,-0.5,     0.75,0.5,  //d
      -0.5,0.5,0.5,     0.5,0.75,  //e

      -0.5,0.5,0.5,     0.5,0.75,  //e
      0.5,0.5,-0.5,     0.75,0.5,  //d
      0.5,0.5,0.5,      0.75,0.75, //f

      // bottom face
      -0.5,-0.5,-0.5,   0.5,0.25,  //a
      0.5,-0.5,-0.5,    0.75,0.25, //b
      -0.5,-0.5,0.5,    0.5,0,     //g

      -0.5,-0.5,0.5,    0.5,0,     //g
      0.5,-0.5,-0.5,    0.75,0.25, //b
      0.5,-0.5,0.5,     0.75,0]    //h
  );
  static VERTICES_FULLUVS = new Float32Array(
    [ // front face
      -0.5,-0.5,-0.5,   0.0,0.0, //a
      0.5,-0.5,-0.5,    1.0,0.0, //b
      -0.5,0.5,-0.5,    0.0,1.0, //c

      -0.5,0.5,-0.5,    0.0,1.0, //c
      0.5,-0.5,-0.5,    1.0,0.0, //b
      0.5,0.5,-0.5,     1.0,1.0, //d
      
      // back face
      0.5,-0.5,0.5,     0.0,0.0, //h
      -0.5,-0.5,0.5,    1.0,0.0, //g
      0.5,0.5,0.5,      0.0,1.0, //f

      0.5,0.5,0.5,      0.0,1.0, //f
      -0.5,-0.5,0.5,    1.0,0.0, //g
      -0.5,0.5,0.5,     1.0,1.0, //e

      // left face
      -0.5,-0.5,0.5,    0.0,0.0, //g
      -0.5,0.5,-0.5,    1.0,0.0, //c
      -0.5,-0.5,-0.5,   0.0,1.0, //a

      -0.5,0.5,-0.5,    0.0,1.0, //c
      -0.5,-0.5,0.5,    1.0,0.0, //g
      -0.5,0.5,0.5,     1.0,1.0, //e

      // right face
      0.5,-0.5,-0.5,    0.0,0.0, //b
      0.5,0.5,-0.5,     1.0,0.0, //d
      0.5,-0.5,0.5,     0.0,1.0, //h

      0.5,-0.5,0.5,     0.0,1.0, //h
      0.5,0.5,-0.5,     1.0,0.0, //d
      0.5,0.5,0.5,      1.0,1.0, //f

      // top face
      -0.5,0.5,-0.5,    0.0,0.0, //c
      0.5,0.5,-0.5,     1.0,0.0, //d
      -0.5,0.5,0.5,     0.0,1.0, //e

      -0.5,0.5,0.5,     0.0,1.0, //e
      0.5,0.5,-0.5,     1.0,0.0, //d
      0.5,0.5,0.5,      1.0,1.0, //f

      // bottom face
      -0.5,-0.5,-0.5,   0.0,0.0, //a
      0.5,-0.5,-0.5,    1.0,0.0, //b
      -0.5,-0.5,0.5,    0.0,1.0, //g

      -0.5,-0.5,0.5,    0.0,1.0, //g
      0.5,-0.5,-0.5,    1.0,0.0, //b
      0.5,-0.5,0.5,     1.0,1.0] //h
  );
  constructor() {
    this.type = 'cube';
    this.color = [1.0,1.0,1.0,1.0];
    this.matrix = new Matrix4();
    this.mapPos = null;
    this.texture = null;
    this.textureNum = 0;
  }

  render_with_UVs() {
    var rgba = this.color;

    // color data
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

    // pass the matrix to a u_ModelMatrix attribute
    gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

    gl.bufferData(gl.ARRAY_BUFFER, Cube.VERTICES, gl.DYNAMIC_DRAW);

    // Assign the position data to a_Position variable
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE*5, 0);

    // Enable the assignment to a_Position variable
    gl.enableVertexAttribArray(a_Position);

    // Assign UV position data
    gl.vertexAttribPointer(a_UV, 2, gl.FLOAT, false, FSIZE*5, FSIZE*3);

    // Enable the assignment to a_UV variable
    gl.enableVertexAttribArray(a_UV);

    // change the current texture to be used on the cube
    gl.activeTexture(this.texture);
    gl.uniform1i(uTexture0, this.textureNum);

    // draw all cube faces
    gl.drawArrays(gl.TRIANGLES, 0, 36);
  }

  render_full_texture() {
    var rgba = this.color;

    // color data
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

    // pass the matrix to a u_ModelMatrix attribute
    gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

    gl.bufferData(gl.ARRAY_BUFFER, Cube.VERTICES_FULLUVS, gl.DYNAMIC_DRAW);

    // Assign the position data to a_Position variable
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE*5, 0);

    // Enable the assignment to a_Position variable
    gl.enableVertexAttribArray(a_Position);

    // Assign UV position data
    gl.vertexAttribPointer(a_UV, 2, gl.FLOAT, false, FSIZE*5, FSIZE*3);

    // Enable the assignment to a_UV variable
    gl.enableVertexAttribArray(a_UV);

    // change the current texture to be used on the cube
    gl.activeTexture(this.texture);
    gl.uniform1i(uTexture0, this.textureNum);

    // draw all cube faces
    gl.drawArrays(gl.TRIANGLES, 0, 36);
  }
  
}
