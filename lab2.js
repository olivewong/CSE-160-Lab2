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
let animate = false;
let g_GlobalAngle = document.getElementById('angleSlider').value;
let startTime = performance.now();


let jointAnglesAnimation = {
  // thigh, knee, ankle, metacarpus
  'foreL': [
    [27, -39, 0, 11], [32, -13, -39, 20], [41, -4, -19, 8], [48, -6, -7, 8],
    [52, -24, 29, -6], [52, -16, 29, 17], [52, -48, 30, 17], [52, -83, 82, 17],
    [27, -83, 68, 40], [13, -52, 57, 24], [-5, -71, 20, 24], [-11, -56, 44, 8],
    [0, -34, 3, 36]
   ],
  'foreR': [
    [27, -39, 0, 11], [32, -13, -39, 20], [41, -4, -19, 8], [48, -6, -7, 8],
    [52, -24, 29, -6], [52, -16, 29, 17], [52, -48, 30, 17], [52, -83, 82, 17],
    [27, -83, 68, 40], [13, -52, 57, 24], [-5, -71, 20, 24], [-11, -56, 44, 8],
    [0, -34, 3, 36]
   ],
  'hindL': [
    [18, 21, 28, 0], [23, 17, 28, 0],  [39, 35, 12, 0], [37, 26, 25, -5],
    [35, 18, 30, -5], [35, 6, 40, 0], [35, -14, 41, 12], [35, -32, 46, 26],
    [32, -57, 8, 33], [25, -69, 39, 33], [23, -78, 39, 33], [23, -80, 25, 27], 
    [23, 4, 20, 16]
  ],
  'hindR': [
    [23, 4, 20, 16], [18, 21, 28, 0], [23, 17, 28, 0],  [39, 35, 12, 0], [37, 26, 25, -5],
    [35, 18, 30, -5], [35, 6, 40, 0], [37, -14, 41, 12], [40, -32, 46, 26],
    [32, -57, 8, 33], [25, -69, 39, 33], [23, -78, 39, 33], [23, -80, 25, 27], 
  ],
}


let jointAngles = {
  // thigh, knee, ankle, metacarpus
  'foreL': [],
  'foreR': [],
  'hindL': [],
  'hindR': []
}


toggleAnimation = () => {
  animate = !animate;
  // If turned on animation, start calling tick function
  if (animate) {
    startTime = performance.now();
    tick();
  }
}

tick = () => {
  renderAllShapes();
  if (animate) {
    updateJointAnglesByAnimation();
    requestAnimationFrame(tick);
  }
}

updateJointAnglesByAnimation = () => {
  const numFrames = 13;
  const theTime = parseInt((performance.now() - startTime) / 100); // the divisor slows it down 
  const frame = theTime % numFrames;
  for (const [legName, val] of Object.entries(jointAngles)) {
    jointAngles[legName] = jointAnglesAnimation[legName][frame];
  }

}

updateJointAnglesByInput = (joint=undefined, slider=undefined) => {
  // update using the sliders, rather than animating them
  for (const [legName, val] of Object.entries(jointAngles)) {
    // Update each leg
    if (joint) jointAngles[legName][joint] = parseInt(document.getElementById(slider).value);
    // Update each joint
    else jointAngles[legName] = [
      parseInt(document.getElementById('thighSlider').value),
      parseInt(document.getElementById('kneeSlider').value),
      parseInt(document.getElementById('ankleSlider').value),
      parseInt(document.getElementById('metacarpusSlider').value)
    ]
  }
  renderAllShapes();
}

main = () => {
  initVertexBuffer(gl);
  document.getElementById('angleSlider').addEventListener('input', (e) => {
    g_GlobalAngle = e.target.value;
    renderAllShapes();
  });
  updateJointAnglesByInput();
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
  let head = new Cube(color='loaf white');
  head.modelMatrix.translate(-0.6, 0.1, 0.0);
  head.modelMatrix.scale(
    inchesToGl(3), 
    inchesToGl(3), 
    inchesToGl(3),
  );
  head.render();
  let headCoordMat2 = new Matrix4(head.modelMatrix);

  // Snoot
  let headCoordMat = new Matrix4(head.modelMatrix);
  let snoot = new Cube('soft ginger');
  snoot.modelMatrix = headCoordMat;
  snoot.modelMatrix.translate(-0.8, -0.3, 0.0);
  snoot.modelMatrix.rotate(10, 0, 0, 1);
  snoot.modelMatrix.scale(
    1, 
    0.5, 
    0.5,
  );
  snoot.modelMatrix.rotate(10, 0, 0, 1);
  snoot.render();
/*
  // Snoot
  let nose = new Cube('nose brown');
  nose.modelMatrix = headCoordMat2;
  nose.modelMatrix.translate(-0.1, 0.5, 0.0);
  nose.modelMatrix.scale(
    1, 
    0.25, 
    0.25,
  );
  nose.modelMatrix.rotate(90, 0, 1, 0);
  nose.render();
*/
  let legBones = []

  for (l = 0; l < 4; l++) {
    // 4 legs
    // Make thigh, knee for each
    // Thigh

    const foreHind = l < 2 ? 'fore': 'hind';
    const LR = l % 2 == 0 ? 'L': 'R';
    let leg = foreHind + LR;
    //debugger;

    let thigh = new Cube('loaf white');
    thigh.modelMatrix.translate( // move her
      foreHind == 'fore' ? -0.35 : 0.35, 
      -inchesToGl(2), 
      LR == 'L' ? 0.2 : -0.2
    ) 
    thigh.modelMatrix.rotate(jointAngles[leg][0], 0, 0, 1);
    let kneeCoordMat = new Matrix4(thigh.modelMatrix);
    thigh.modelMatrix.scale(
      inchesToGl(1.7), 
      inchesToGl(3), 
      inchesToGl(1.5),
    );
    legBones.push(thigh)

    // Calf
    // todo fix z fighting by changing z to like -.001
    let calf = new Cube(color='loaf white');
    calf.modelMatrix = kneeCoordMat;
    calf.modelMatrix.translate(0, -inchesToGl(4.5), -0.001); // move her
    calf.modelMatrix.rotate(jointAngles[leg][1], 0, 0, 1);
    let carpusCoordMat = new Matrix4(calf.modelMatrix);
    calf.modelMatrix.scale(
      inchesToGl(1.5), 
      inchesToGl(2), 
      inchesToGl(1.5),
    );
    legBones.push(calf)

   // metatarsal
   let metatarsal = new Cube('loaf darker');
   metatarsal.modelMatrix = carpusCoordMat;
   metatarsal.modelMatrix.translate(0, -inchesToGl(3.5), 0);
   metatarsal.modelMatrix.rotate(jointAngles[leg][2], 0, 0, 1);
   let ankleCoordMat = new Matrix4(metatarsal.modelMatrix);
   metatarsal.modelMatrix.scale(
    inchesToGl(1.5), 
    inchesToGl(1.2), 
    inchesToGl(1.5),
  );
  legBones.push(metatarsal);

  // Foot
  let foot = new Cube('soft ginger');
  foot.modelMatrix = ankleCoordMat;
  foot.modelMatrix.translate(-inchesToGl(0.3), -inchesToGl(1.7), -0.001);
  foot.modelMatrix.rotate(jointAngles[leg][3], 0, 0, 1);
  foot.modelMatrix.scale(
    inchesToGl(1.8), 
    inchesToGl(0.7), 
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