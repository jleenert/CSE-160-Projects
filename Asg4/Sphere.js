class Sphere {
  constructor() {
    this.type = 'sphere';
    this.color = [1.0,1.0,1.0,1.0];
    this.matrix = new Matrix4();
    this.normalMatrix = new Matrix4();
    this.vertices = null;
    this.texture = null;
    this.textureNum = 0;
  }

  generate_Vertices(divisor=15) {
    var d = Math.PI/divisor;
    var dd = Math.PI/divisor;
    var arrayData = [];
    for (var t = 0; t < Math.PI; t += d) {
      for (var r = 0; r < (2*Math.PI); r += d) {
        var p1 = [Math.sin(t) * Math.cos(r), Math.sin(t) * Math.sin(r), Math.cos(t)];
        var p2 = [Math.sin(t+dd) * Math.cos(r), Math.sin(t+dd) * Math.sin(r), Math.cos(t+dd)];
        var p3 = [Math.sin(t) * Math.cos(r+dd), Math.sin(t) * Math.sin(r+dd), Math.cos(t)];
        var p4 = [Math.sin(t+dd) * Math.cos(r+dd), Math.sin(t+dd) * Math.sin(r+dd), Math.cos(t+dd)];

        var uv1 = [t/Math.PI, r/(2*Math.PI)];
        var uv2 = [(t+dd)/Math.PI, r/(2*Math.PI)];
        var uv3 = [t/Math.PI, (r+dd)/(2*Math.PI)];
        var uv4 = [(t+dd)/Math.PI, (r+dd)/(2*Math.PI)];

        // vertex, UV, normal
        arrayData = arrayData.concat(p1);
        arrayData = arrayData.concat(uv1);
        arrayData = arrayData.concat(p1);
        arrayData = arrayData.concat(p2);
        arrayData = arrayData.concat(uv2);
        arrayData = arrayData.concat(p2);
        arrayData = arrayData.concat(p4);
        arrayData = arrayData.concat(uv4);
        arrayData = arrayData.concat(p4);

        arrayData = arrayData.concat(p1);
        arrayData = arrayData.concat(uv1);
        arrayData = arrayData.concat(p1);
        arrayData = arrayData.concat(p4);
        arrayData = arrayData.concat(uv4);
        arrayData = arrayData.concat(p4);
        arrayData = arrayData.concat(p3);
        arrayData = arrayData.concat(uv3);
        arrayData = arrayData.concat(p3);
      }
    }
    this.vertices = new Float32Array(arrayData);
  }

  render_with_UVs() {
    var rgba = this.color;

    // color data
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

    // pass the matrix to a u_ModelMatrix attribute
    gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);
    gl.uniformMatrix4fv(u_NormalMatrix, false, this.normalMatrix.elements);
    
    gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.DYNAMIC_DRAW);

    // Assign the position data to a_Position variable
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE*8, 0);

    // Enable the assignment to a_Position variable
    gl.enableVertexAttribArray(a_Position);

    // Assign UV position data
    gl.vertexAttribPointer(a_UV, 2, gl.FLOAT, false, FSIZE*8, FSIZE*3);

    // Enable the assignment to a_UV variable
    gl.enableVertexAttribArray(a_UV);

    // new a_Normal data
    gl.vertexAttribPointer(a_Normal, 3, gl.FLOAT, false, FSIZE*8, FSIZE*5);
    gl.enableVertexAttribArray(a_Normal);

    // change the current texture to be used on the cube
    gl.activeTexture(this.texture);
    gl.uniform1i(uTexture0, this.textureNum);

    // draw all faces
    gl.drawArrays(gl.TRIANGLES, 0, (this.vertices.length*(1/8)));
  }
  
}
