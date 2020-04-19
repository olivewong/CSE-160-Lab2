class Shape {
  constructor(shape_type, color, size, pos, numTriangles) {
    this.shape_type = shape_type;
    this.color = color;
    this.size = size;
    this.pos = pos;
    this.numTriangles = numTriangles;
    this.initVertices(shape_type);
  }

  normalizeVertices = () => {
    this.vertices.forEach((val, idx) => {
      // Value * size + where user clicked
      this.vertices[idx] = val * this.size + (idx % 2 == 0 ? this.pos[0]: this.pos[1]);
    });
  }
  initVertices = (shape_type) => {
    let alpha, radius, idx;
    switch (shape_type) {
      case 'triangle':
        this.vertices = new Float32Array([
          0.0, 0.5,  -0.5, -0.5,  0.5, -0.5
        ]);
        break;
      case 'square':
        this.vertices = new Float32Array([
          -0.5, -0.5,  -0.5, 0.5,  0.5, 0.5,
          0.5, -0.5, -0.5, -0.5, 0.5, 0.5
        ]);
        break;
      case 'circle':
        this.vertices = new Float32Array(6 * this.numTriangles);
        alpha = (2.0 * Math.PI) / this.numTriangles; // Radians
        radius = 0.5;
        idx = 0;
        for (let ang = 0; idx < this.vertices.length; ang += alpha) {
          this.vertices.set([
            0.0, 0.0,
            Math.cos(ang) * radius, Math.sin(ang) * radius,  
            Math.cos(ang + alpha) * radius, Math.sin(ang + alpha) * radius, 
          ], idx);
          idx += 6;
        }
        break;
      case 'chaos':
        this.vertices = new Float32Array(3 * this.numTriangles);
        alpha = (2.0 * Math.PI) / this.numTriangles; // Radians
        radius = Math.random() + Math.random() - 0.5;
        idx = 0;
        for (let ang = 0; ang < (2.0 * Math.PI - alpha); ang += alpha) {
          this.vertices.set([
            0.0 + Math.random(), 0.0 + Math.random(),
            Math.cos(ang) * radius + Math.random(), Math.sin(Math.random()) * radius * Math.random(),
            Math.cos(ang + alpha - Math.random()) + Math.random(), Math.sin(ang + alpha) + Math.random()
          ], idx);
          idx += 3;
        }
        break;
      default:
        throw 'initVertices: not a valid shape';
    }
    
    this.vertices.forEach((val, idx) => {
      // Value * size + where user clicked
      this.vertices[idx] = val * this.size + (idx % 2 == 0 ? this.pos[0]: this.pos[1]);
    });
  }
}

class Triangle extends Shape {
  constructor() {
    super();
    this.vertices = new Float32Array([
      0.0, 0.5,  -0.5, -0.5,  0.5, -0.5
    ]);
    this.normalizeVertices();
  }
};