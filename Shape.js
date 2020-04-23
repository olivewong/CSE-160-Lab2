const pink = [0.9, 0.0, 0.5, 1.0]

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

  normalizeVertices(r = this.radius) {
    this.vertices.forEach((val, idx) => {
      // Value * radius + where user clicked
      this.vertices[idx] = val * r + (idx % 2 == 0 ? this.pos[0]: this.pos[1]);
    });
  }
}

class Triangle extends Shape {
  constructor(pos, radius=0.5, color=pink) {
    let vertices = new Float32Array([
      0.0, 0.5,  -0.5, -0.5,  0.5, -0.5
    ]);
    super(vertices, pos, radius=0.5, color=pink);
  }
};

class Square extends Shape {
  constructor(pos, radius=0.5, color=pink) {
    let vertices = new Float32Array([
      -0.5, -0.5,  -0.5, 0.5,  0.5, 0.5,
      0.5, -0.5, -0.5, -0.5, 0.5, 0.5
    ]);
    super(vertices, pos, radius=0.5, color=pink);
  }
};