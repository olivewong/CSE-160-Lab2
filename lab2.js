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
  gl.enable(gl.DEPTH_TEST);
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
    throw 'Failed to create the vertex buffer object';
  }
  // Bind buffer to a_Position attribute in the vertex shader
  // First bind the ARRAY_BUFFER object to target (vertexBuffer)
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  /*
  // Create index buffer 
  let indexBuffer = gl.createBuffer();
  if (!indexBuffer) {
    throw 'Failed to create the index buffer object';
  }

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);*/

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

let jointAngles = {
  'thigh': document.getElementById('thighSlider').value,
  'knee': document.getElementById('kneeSlider').value,
  'ankle': document.getElementById('ankleSlider').value,
  'metacarpus': document.getElementById('metacarpusSlider').value,
}
main = () => {
  initVertexBuffer(gl);

  document.getElementById('angleSlider').addEventListener('mouseup', (e) => {
    g_GlobalAngle = e.target.value;
    renderAllShapes();
  });
  document.getElementById('thighSlider').addEventListener('mouseup', (e) => {
    jointAngles['thigh'] = parseFloat(e.target.value);
    renderAllShapes();
  });
  document.getElementById('kneeSlider').addEventListener('mouseup', (e) => {
    jointAngles['knee'] = parseFloat(e.target.value);
    renderAllShapes();
  });
  document.getElementById('ankleSlider').addEventListener('mouseup', (e) => {
    jointAngles['ankle'] = parseFloat(e.target.value);
    renderAllShapes();
  });
  document.getElementById('metacarpusSlider').addEventListener('mouseup', (e) => {
    jointAngles['metacarpus'] = parseFloat(e.target.value);
    renderAllShapes();
  });

  renderAllShapes();
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
/*
let rotationZ = 0;

update = () => {
  rotationZ += 1;
  renderAllShapes(a_Position, u_FragColor, gl);
  requestAnimationFrame(update);
}*/

inchesToGl = (inches, mode='scalar') => {
  // Given a value in inches, approximates a webgl coordinates
  // For scalar mode, output is 0.0 - 1.0
  // For coordinates mode, output is -1.0 - 1.0
  // Loaf is ~22 inches long
  const screenLengthIn = 30.0;
  if (inches > screenLengthIn) throw 'too long';
  if (mode == 'scalar') return inches / screenLengthIn;
  else if (mode == 'coordinates') return ((2 * inches) / (screenLengthIn) - 1.0); //test 
}

renderAllShapes = () => {
  let startTime = performance.now();

  console.log("Knee: " + jointAngles['knee']);
  console.log("Thigh: " + jointAngles['thigh']);
  console.log("Ankle: " + jointAngles['ankle']);

  // Pass the matrix to u_GlobalRotateMatrix attribute
  let globalRotationMatrix = new Matrix4().rotate(g_GlobalAngle, 0, 1, 0);
  //globalRotationMatrix.rotate(-5, 1, 0, 0); // arbitrary, just for perspective
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotationMatrix.elements);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Loaf body 
  let body = new Cube(color='loaf white');
 // body.modelMatrix.translate(0.1, 0.0, 0.0);
  body.modelMatrix.scale(
    inchesToGl(16), // long
    inchesToGl(5.5),  // tall
    inchesToGl(7) // wide
  ) 
   body.render();
 
  // Head
  let head = new Cube(color='soft ginger');
  head.modelMatrix.translate(-0.6, 0.1, 0.0);
  head.modelMatrix.scale(
    inchesToGl(4), 
    inchesToGl(4), 
    inchesToGl(4),
  );
  head.render();

  let legBones = []

  for (leg = 0; leg < 4; leg++) {
    // 4 legs
    // Make thigh, knee for each
    // Thigh

    const foreHind = leg < 2 ? 'fore': 'hind';
    const LR = leg % 2 == 0 ? 'left': 'right';

    let thigh = new Cube(color='loaf white');
    thigh.modelMatrix.translate( // move her
      foreHind == 'fore' ? -0.35 : 0.35, 
      -inchesToGl(3), 
      LR == 'left' ? 0.2 : -0.2
    ) 
    thigh.modelMatrix.rotate(jointAngles['thigh'], 0, 0, 1);
    let kneeCoordMat = new Matrix4(thigh.modelMatrix);
    thigh.modelMatrix.scale(
      inchesToGl(1.5), 
      inchesToGl(2), 
      inchesToGl(1.5),
    );
    legBones.push(thigh)

    // Calf
    // todo fix z fighting by changing z to like -.001
    let calf = new Cube(color='soft ginger');
    calf.modelMatrix = kneeCoordMat;
    calf.modelMatrix.translate(0, -inchesToGl(3), -0.001); // move her
    calf.modelMatrix.rotate(jointAngles['knee'], 0, 0, 1);
    let carpusCoordMat = new Matrix4(calf.modelMatrix);
    calf.modelMatrix.scale(
      inchesToGl(1.5), 
      inchesToGl(2), 
      inchesToGl(1.5),
    );
    legBones.push(calf)

   // metatarsal
   let metatarsal = new Cube();
   metatarsal.modelMatrix = carpusCoordMat;
   metatarsal.modelMatrix.translate(0, -inchesToGl(3.5), 0);
   metatarsal.modelMatrix.rotate(jointAngles['ankle'], 0, 0, 1);
   let ankleCoordMat = new Matrix4(metatarsal.modelMatrix);
   metatarsal.modelMatrix.scale(
    inchesToGl(1.5), 
    inchesToGl(1), 
    inchesToGl(1.5),
  );
  legBones.push(metatarsal);

  // Foot
  let foot = new Cube('loaf white');
 
  foot.modelMatrix = ankleCoordMat;
  foot.modelMatrix.translate(0, -inchesToGl(1.5), 0);
  foot.modelMatrix.rotate(jointAngles['metacarpus'], 0, 0, 1);
  foot.modelMatrix.scale(
  inchesToGl(1.5), 
  inchesToGl(1), 
  inchesToGl(1.5),
  );
  legBones.push(foot);

}
legBones.map( (leg) => {
  leg.modelMatrix.translate(0, -1, 0) // change origin
  leg.render();
});
}

   //head.rotateZ(25);
  /*
  shapesList.forEach((s) => {
    s.rotateZ(rotationZ);
    s.scale(0.5, 0.5, 0.5);
    s.translate(0.5, 0, 0);
    s.render();
  })*/