// Lab 1
// Heavily borrowed from text

// Vertex shader program
const VSHADER_SOURCE =
  `attribute vec4 a_Position;
  void main() {
    gl_Position = a_Position;
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

initVertexBuffer = (gl, vertices, a_Position) => { 
  // Create a buffer object
  let vertexBuffer = gl.createBuffer(); 
  if (!vertexBuffer) {
    throw 'Failed to create the buffer object';
  }
  // Bind the ARRAY_BUFFER object to target (vertexBuffer)
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  
  // Write date into the buffer object 
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  
  // Assign the buffer object to a_Position variable 
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
  // Enable assignment to an attribute variable so vertex shader can access buffer obj
  gl.enableVertexAttribArray(a_Position);
  return vertexBuffer;
}

var shapesList = [];
var mode = 'triangle';

setDrawingMode = (shape_type) => {
  // Called on button clicks
  mode = shape_type;
}

main = () => {
  const {gl, canvas} = setUpWebGL();
  let {a_Position, u_FragColor} = connectVariablesToGLSL(gl);
  //let vertexBuffer = initVertexBuffer(gl);
  shapesList = []
  // Register function (event handler) to be called on a mouse press
  canvas.onmousedown = (ev) => { 
    click(ev, canvas) 
    renderAllShapes(a_Position, u_FragColor, gl)
  };
  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);
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

renderAllShapes = (a_Position, u_FragColor, gl) => {
  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  // todo make render method
  shapesList.forEach((s) => {
    initVertexBuffer(gl, s.vertices, a_Position);
    // Pass the color of a point to u_FragColor variable
    gl.uniform4f(u_FragColor, ...s.color);
    // Draw
    gl.drawArrays(gl.TRIANGLES, 0, s.vertices.length / 2);
  })
}

click = (ev, canvas) => {
  // All points have to be saved bc the color buffer clears everything
  // So must be re-rendered every mouse click
  let x = ev.clientX; // x coordinate of a mouse pointer
  let y = ev.clientY; // y coordinate of a mouse pointer
  let rect = ev.target.getBoundingClientRect();

  x = ((x - rect.left) - canvas.width / 2) / (canvas.width / 2);
  y = (canvas.height / 2 - (y - rect.top)) / (canvas.height / 2);

  const color = [
    document.getElementById("red").value / 100.0,
    document.getElementById("green").value / 100.0,
    document.getElementById("blue").value / 100.0,
    (100 - document.getElementById("alpha").value) / 100.0,
  ];

  const sizeInput = document.getElementById("size").value / 20.0;
  shapesList.push(new Shape(
    mode,
    color,
    sizeInput,
    [x, y],
    document.getElementById("segments").value
  ));
}

