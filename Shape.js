class Shape { 
  constructor(vertices, color='hot pink') {
    this.rgba = colors[color];
    this.vertices = vertices;

    // Model matrix stores all the scale/translation/rotation transformations
    this.translationMatrix = new Matrix4();
    this.rotationMatrix = new Matrix4();
    this.scaleMatrix = new Matrix4();
  }

  get modelMatrix() {
    // M = Translate x Rotate x Scale
    // goes to u model matrix
    // these actually happen in reverse (right multiply) so its S, then R, then T
    let M = new Matrix4();
    M.multiply(this.translationMatrix);
    M.multiply(this.rotationMatrix);
    M.multiply(this.scaleMatrix);
    return M;
  }

  translate(x, y, z) { this.translationMatrix.setTranslate(x, y, z); }

  scale(x, y, z) { this.scaleMatrix.setScale(x, y, z); }

  rotateX(angle) { this.rotationMatrix.setRotate(angle, 1, 0, 0); }

  rotateY(angle) { this.rotationMatrix.setRotate(angle, 0, 1, 0); }

  rotateZ(angle) { this.rotationMatrix.setRotate(angle, 0, 0, 1); }

  render(vertices=this.vertices, rgbaMult=1.0) {
    // TODO drop shadow w depth texture
    // Davis has his attribute shit here but i think this is more efficient
    // Right now only triangles I think

    // Write data into the buffer object 
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    
    // Pass the color of a point to u_FragColor variable
    gl.uniform4f(
      u_FragColor, 
      this.rgba[0] * rgbaMult, 
      this.rgba[1] * rgbaMult, 
      this.rgba[2] * rgbaMult, 
      this.rgba[3]
    );

    gl.uniformMatrix4fv(u_ModelMatrix, false, this.modelMatrix.elements);
    // Draw
    gl.drawArrays(gl.TRIANGLES, 0, vertices.length / 3);
  }
}

class Triangle extends Shape {
  constructor(color='hot pink', type='isosceles') {
    let vertices = new Float32Array(shapeTypes[type]);
    super(vertices, color=color);
  }
};

class Cube extends Shape {
  constructor(color='hot pink') {
    let vertices = new Float32Array(shapeTypes['cube']);
    super(vertices, color=color);
  }
  render() {
    // 9 coords per triangle, 18 per square
    // render each square separately so we can fake shading
    const n = 18 // 18 vertices per square
    for (let square=0; square < (this.vertices.length / n); square++) {
      super.render(
        this.vertices.subarray(n * square, n * square + n), 
        1.0 - square * 0.08 // fake shading
      );
    } 
  }
}
