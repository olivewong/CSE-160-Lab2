// Lab 2: Blocky Animal

// Vertex shader program
const VSHADER_SOURCE =
  `attribute vec4 a_Position;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_GlobalRotateMatrix;
  void main() {
    gl_Position = u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
  }`;

// Fragment shader program
const FSHADER_SOURCE =
  `precision mediump float;
  uniform vec4 u_FragColor;
  void main() {
    gl_FragColor = u_FragColor;
  }`;

setUpWebGL = () => {
  // Retrieve <canvas> element
  const canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  const gl = getWebGLContext(canvas);
  if (!gl) throw 'Failed to get the rendering context for WebGL';

  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  return {gl, canvas};
}

connectVariablesToGLSL = (gl) => {
  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) throw 'Failed to intialize shaders.';

  // Get the storage location of a_Position
  let a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) throw 'Failed to get the storage location of a_Position';

  // Get the storage location of u_FragColor
  let u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) throw 'Failed to get the storage location of u_FragColor';

  // Holds all the transformations and pass when drawing
  let u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  if (!u_ModelMatrix) throw 'Failed to get the storage location of u_ModelMatrix';

  // Camera angle
  let u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrix');
  if (!u_GlobalRotateMatrix) throw 'Failed to get the storage location of u_GlobalRotateMatrix';

  return {a_Position, u_FragColor, u_ModelMatrix, u_GlobalRotateMatrix}
}

initVertexBuffer = () => { 
  // Create a WebGL buffer (array in GPU memory)
  let vertexBuffer = gl.createBuffer(); 
  if (!vertexBuffer) {
    throw 'Failed to create the buffer object';
  }
  // Bind buffer to a_Position attribute in the vertex shader
  // First bind the ARRAY_BUFFER object to target (vertexBuffer)
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

  // Get memory location of attribute a_Position (var in GPU memory)
  a_Position = gl.getAttribLocation(gl.program, 'a_Position');

  // Assign the buffer object to a_Position variable 
  // Size = 3 bc 3d
  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);

  // Enable assignment to an attribute variable so vertex shader can access buffer obj
  gl.enableVertexAttribArray(a_Position);

  return vertexBuffer;
}

let shapesList = [];
const {gl, canvas} = setUpWebGL();
let {a_Position, u_FragColor, u_ModelMatrix, u_GlobalRotateMatrix} = connectVariablesToGLSL(gl);
let g_GlobalAngle = document.getElementById('angleSlider').value;

main = () => {
  initVertexBuffer(gl);

  document.getElementById('angleSlider').addEventListener('mouseup', (e) => {
    g_GlobalAngle = e.target.value;
    renderAllShapes();
  });

  renderAllShapes();
  update(a_Position, u_FragColor, gl);
}

clearCanvas = () => {
  // Retrieve <canvas> element
  let canvas = document.getElementById('webgl');
  // Get the rendering context for WebGL
  let gl = getWebGLContext(canvas);
  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);
  shapesList = [];
}

let rotationZ = 0;

update = () => {
  /*
  rotationZ += 1;
  renderAllShapes(a_Position, u_FragColor, gl);
  requestAnimationFrame(update);*/
}

renderAllShapes = () => {
  let startTime = performance.now();

  // Pass the matrix to u_GlobalRotateMatrix attribute
  
  let globalRotationMatrix = new Matrix4().rotate(g_GlobalAngle, 0, 1, 0);
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotationMatrix.elements);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  let body = new Cube(color='white');
  body.translate(-.25, -.5, 0);
  body.scale(0.5, 1, 0.5)
  body.render();

  let leftArm = new Cube(color='hot pink');
  leftArm.translate(.7, 0, 0);
  leftArm.rotateZ(45);
  leftArm.scale(0.25, .7, .5);
  leftArm.render();
 
  /*
  shapesList.forEach((s) => {
    s.rotateZ(rotationZ);
    s.scale(0.5, 0.5, 0.5);
    s.translate(0.5, 0, 0);
    s.render();
  })*/
}
