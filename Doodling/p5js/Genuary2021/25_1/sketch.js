let gfx;
const startupParameters = {
  xSize: 600,
  ySize: 600,
  resizeCanvas: function() {
    createCanvas(startupParameters.xSize, startupParameters.ySize);
    gfx = createGraphics(startupParameters.xSize, startupParameters.ySize)
    gfx.background(options.background);
  }
}
const options = {
  background: '#2dabc4',
  foreground: '#b1ebe6',
  startsize: 40,
  numberOfSquares: 7,
  maxRotation: Math.PI,
  autiodraw: false,
  redraw: function () {
    gfx.reset();
    randomSeed(Math.random() * 100000);
    gfx.background(options.background);
    const numberOfSquareCount = options.numberOfSquares * options.numberOfSquares;
    const xStepWidth = startupParameters.xSize / options.numberOfSquares;
    const yStepWidth = startupParameters.ySize / options.numberOfSquares;
    for (let i = 0; i < numberOfSquareCount; i++) {
      const xMiddle = i % options.numberOfSquares * xStepWidth - xStepWidth / 2 + xStepWidth;
      const yMiddle = parseInt(i / options.numberOfSquares) * yStepWidth - yStepWidth / 2 + yStepWidth;
      drawSquares(xMiddle, yMiddle, options.startsize, i % options.numberOfSquares, parseInt(i / options.numberOfSquares), gfx);
    }
  },
  save: function () {
    saveCanvas('Genuary25_1_' + Date.now(), 'png');
  }
}

// Creating a GUI with options.
var gui = new dat.GUI({name: 'Customization'});
var startupParameterFolder = gui.addFolder('canvas options');
gui.remember(startupParameters);
startupParameterFolder.add(startupParameters, 'xSize', 200);
startupParameterFolder.add(startupParameters, 'ySize', 200);
startupParameterFolder.add(startupParameters, 'resizeCanvas');
var folder1 = gui.addFolder('Setup options');
gui.remember(options);
folder1.addColor(options, 'background');
folder1.addColor(options, 'foreground');
folder1.add(options, 'startsize', 1);
folder1.add(options, 'autiodraw', false, true);
folder1.add(options, 'numberOfSquares', 1).step(1);
folder1.add(options, 'maxRotation', 0, Math.PI * 2);
folder1.open();
gui.add(options, 'redraw');
gui.add(options, 'save');

function setup() {
  createCanvas(startupParameters.xSize, startupParameters.ySize);
  gfx = createGraphics(startupParameters.xSize, startupParameters.ySize)
  gfx.background(options.background);
  options.redraw();
}

function draw() {
  if (options.autiodraw) {
    options.redraw();
  }
  image(gfx, 0, 0);
}

function drawSquares(middleX, middleY, startsize, points, intensity, gfx) {
  let currentHalfSize = startsize / 2;
  gfx.push();
  gfx.translate(middleX, middleY);
  gfx.rotate(map(intensity, 0, options.numberOfSquares - 1, 0, options.maxRotation));
  gfx.noFill();
  gfx.stroke(options.foreground);
  gfx.strokeWeight((points + intensity + 1) / options.numberOfSquares);
  gfx.curveTightness(points);
  gfx.beginShape();
  gfx.curveVertex(-currentHalfSize, -currentHalfSize);
  gfx.curveVertex(currentHalfSize, -currentHalfSize);
  gfx.curveVertex(-currentHalfSize, currentHalfSize);
  gfx.curveVertex(currentHalfSize, currentHalfSize);
  
  gfx.curveVertex(-currentHalfSize, -currentHalfSize);
  gfx.curveVertex(currentHalfSize, -currentHalfSize);
  // gfx.curveVertex(-currentHalfSize, currentHalfSize);
  // gfx.curveVertex(currentHalfSize, currentHalfSize);
  // gfx.curveVertex(-currentHalfSize, -currentHalfSize);
  // gfx.curveVertex(-currentHalfSize, currentHalfSize);
  // gfx.curveVertex(currentHalfSize, -currentHalfSize);
  // gfx.curveVertex(-currentHalfSize, -currentHalfSize);
  gfx.endShape();
  gfx.pop();
}