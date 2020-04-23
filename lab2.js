// Lab 2: Blocky Animal

// Vertex shader program
const VSHADER_SOURCE =
  `attribute vec3 a_Position;
  uniform mat4 u_modelMatrix;
  void main() {
    gl_Position = u_modelMatrix * vec4(a_Position, 1.0);
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
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }
  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  return {gl, canvas};
}

connectVariablesToGLSL = (gl) => {
  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    throw 'Failed to intialize shaders.';
    return;
  }

  // Get the storage location of a_Position
  let a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    throw 'Failed to get the storage location of a_Position';
    return;
  }

  // Get the storage location of u_FragColor
  let u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    throw 'Failed to get the storage location of u_FragColor';
    return;
  }
  return {a_Position, u_FragColor}
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
let {a_Position, u_FragColor} = connectVariablesToGLSL(gl);
let u_modelMatrix = gl.getUniformLocation(gl.program, 'u_modelMatrix');

main = () => {
  shapesList = []
  let vertexBuffer = initVertexBuffer(gl);
 
  shapesList.push(new Cube(
    [0, 0, 0],
  ));
  renderAllShapes();

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);
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
  rotationZ += 1;
  renderAllShapes(a_Position, u_FragColor, gl);
  requestAnimationFrame(update);
}

draw = (shape) => {
  // Davis has his attribute shit here but i think this is more efficient
  // he also put this in theclass
  // Right now only triangles I think
  // Write date into the buffer object 
  gl.bufferData(gl.ARRAY_BUFFER, shape.vertices, gl.STATIC_DRAW);

  // Pass the color of a point to u_FragColor variable
  gl.uniform4f(u_FragColor, ...shape.color);
  gl.uniformMatrix4fv(u_modelMatrix, false, shape.modelMatrix.elements);
  // Draw
  gl.drawArrays(gl.TRIANGLES, 0, shape.vertices.length / 3);
}

renderAllShapes = () => {
  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);
 
  shapesList.forEach((s) => {
    s.rotateZ(rotationZ);
    s.scale(0.5, 0.5, 0.5);
    s.translate(0.5, 0, 0);
    s.render();
  })
}
