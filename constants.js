
const colors = { // rgba
  'hot pink': [0.9, 0.0, 0.5, 1.0],
  'white':    [1.0, 1.0, 1.0, 1.0]
}
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