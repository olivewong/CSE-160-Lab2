const pink = [0.9, 0.0, 0.5, 1.0]
const shapeTypes = {
  'isosceles': [
    -0.5, -0.5, 0.0, // a: bottom left
    0.5, -0.5, 0.0, // b: bottom right
    0.0, 0.5, 0.0 // c: top point
  ],
  'square': [
    0.0, 0.0, 0.0, // Triangle 1
    1.0, 1.0, 0.0,
    1.0, 0.0, 0.0,
    0.0, 0.0, 0.0, // Triangle 2
    0.0, 1.0, 0.0,
    1.0, 1.0, 0.0
  ]
}

class Shape {
  constructor(vertices, pos, radius=0.5, color=pink) {
    this.color = color;
    this.radius = radius;
    this.pos = pos;
    this.vertices = vertices;
    this.normalizeVertices();

    // Model matrix stores all the scale/translation/rotation transformations
    this.translationMatrix = new Matrix4();
    this.rotationMatrix = new Matrix4();
    this.scaleMatrix = new Matrix4();
  }

  get modelMatrix() {
    // M = Translate x Rotate x Scale
    let M = new Matrix4();
    M.multiply(this.translationMatrix);
    M.multiply(this.rotationMatrix);
    M.multiply(this.scaleMatrix);
    return M;
  }

  translate(x, y, z) {
    this.translationMatrix.setTranslate(x, y, z);
  }

  scale(x, y, z) {
    this.scaleMatrix.setScale(x, y, z);
  }

  rotateX(angle) {
    this.rotationMatrix.setRotate(angle, 1, 0, 0);
  }

  rotateY(angle) {
    this.rotationMatrix.setRotate(angle, 0, 1, 0);
  }

  rotateZ(angle) {
    this.rotationMatrix.setRotate(angle, 0, 0, 1);
  }
  render() {
    // Davis has his attribute shit here but i think this is more efficient
    // he also put this in theclass
    // Right now only triangles I think
    // Write date into the buffer object 
    gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.STATIC_DRAW);
  
    // Pass the color of a point to u_FragColor variable
    gl.uniform4f(u_FragColor, ...this.color);
    gl.uniformMatrix4fv(u_modelMatrix, false, this.modelMatrix.elements);
    // Draw
    gl.drawArrays(gl.TRIANGLES, 0, this.vertices.length / 3);
  }

  normalizeVertices(r = this.radius) {
    this.vertices.forEach((val, idx) => {
      // Value * radius + where user clicked
      // TODO: modify when we get to 3d location
      let pos;
      if(idx % 3 == 0) {
        pos = this.pos[0];
      } else if (idx % 3 == 1) {
        pos = this.pos[1];
      } else {
        pos = this.pos[2];
      }
      this.vertices[idx] = val * r + pos;
    });
  }
}

class Triangle extends Shape {
  constructor(pos, radius=0.5, color=pink, type='isosceles') {
    let vertices = new Float32Array(shapeTypes[type]);
    super(vertices, pos, radius=0.5, color=pink);
  }
};

class Cube extends Shape {
  constructor(pos, radius=0.5, color=pink) {
    let vertices = new Float32Array(shapeTypes['square']);
    super(vertices, pos, radius=0.5, color=pink);
  }
}
/* TODO: make 3d
class Square extends Shape {
  constructor(pos, radius=0.5, color=pink) {
    let vertices = new Float32Array([
      -0.5, -0.5,  -0.5, 0.5,  0.5, 0.5,
      0.5, -0.5, -0.5, -0.5, 0.5, 0.5
    ]);
    super(vertices, pos, radius=0.5, color=pink);
  }
};
*/