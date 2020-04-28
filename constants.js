
const colors = { // rgba
  'hot pink':   [1, 0.7, 0.7, 1],
  'lavender':     [0.94, 0.74, 1, 1],
  'indiger': [0.75, 0.74, 0.9, 1],
  'yellow':     [1, 0.6, 0.19, 1],
  'white':      [1.0, 1.0, 1.0, 1],
  'blue':       [0.2, 0.1, 0.9, 1],
  'loaf white': [1.0, 0.93, 0.90, 1],
  'loaf darker': [0.98, 0.88, 0.86, 1],
  'softer ginger': [0.86, 0.61, 0.47, 0.8],
  'soft ginger': [0.86, 0.61, 0.47, 1],
  'nose brown': [0.37, 0.22, 0.07, 1 ]
}

const shapeTypes = {
  'isosceles': [
    -0.5, -0.5, 0.0, // a: bottom left
    0.5, -0.5, 0.0, // b: bottom right
    0.0, 0.5, 0.0 // c: top point
  ],
  'square': [
    0, 0, 0, // Triangle 1
    1, 1, 0,
    1, 0, 0,
    0, 0, 0, // Triangle 2
    0, 1, 0,
    1, 1, 0
  ],'cube': [
    // Right face
    1, -1, 1,  1, -1, -1,  1, 1, -1, // Triangle 1
    1, -1, 1,  1, 1, -1,  1, 1, 1, // Triangle 2
    // Left face
    -1, -1, -1,  -1, -1, 1,  -1, 1, 1, 
    -1, -1, -1,  -1, 1, 1,  -1, 1, -1,
    // Back face
    1, 1, 1,  -1, 1, 1,  -1, -1, 1,
    1, 1, 1,  -1, -1, 1,  1, -1, 1,
    // Front face
    1, -1, -1,  -1, -1, -1,  -1, 1, -1,
    1, -1, -1,  -1, 1, -1,  1, 1, -1,
    // Top face
    1, 1, -1,  -1, 1, -1,  -1, 1, 1,
    1, 1, -1,  1, 1, 1,  -1, 1, 1,
    // Bottom face
    1, -1, -1,  -1, -1, -1,  -1, -1, 1,
    1, -1, -1,  1, -1, 1,  -1, -1, 1
  ]
}

/*
cubeVertices = new Uint8Array([ // Vertex coordinates (from text)
  1, 1, 1,  0, 1, 1,  0, 0, 1,  1, 0, 1,    // v0-v1-v2-v3 front
  1, 1, 1,  1, 0, 1,  1, 0, 0,  1, 1, 0,    // v0-v3-v4-v5 right
  1, 1, 1,  1, 1, 0,  0, 1, 0,  0, 1, 1,    // v0-v5-v6-v1 up
  0, 1, 1,  0, 1, 0,  0, 0, 0,  0, 0, 1,    // v1-v6-v7-v2 left
  0, 0, 0,  1, 0, 0,  1, 0, 1,  0, 0, 1,    // v7-v4-v3-v2 down
  1, 0, 0,  0, 0, 0,  0, 1, 0,  1, 1, 0     // v4-v7-v6-v5 back
]);

cubeIndices = new Uint8Array([       // Indices of the vertices
  0, 1, 2,   0, 2, 3,    // front
  4, 5, 6,   4, 6, 7,    // right
  8, 9,10,   8,10,11,    // up
 12,13,14,  12,14,15,    // left
 16,17,18,  16,18,19,    // down
 20,21,22,  20,22,23     // back
]);
*/