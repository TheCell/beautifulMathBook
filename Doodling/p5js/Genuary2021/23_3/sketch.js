let gfx;
const startupParameters = {
  xSize: 400,
  ySize: 400,
  resizeCanvas: function() {
    createCanvas(startupParameters.xSize, startupParameters.ySize);
    gfx = createGraphics(startupParameters.xSize, startupParameters.ySize)
    gfx.background(options.background);
  }
}
const options = {
  background: '#000000',
  c1: '#264653',
  c2: '#2a9d8f',
  c3: '#e9c46a',
  c4: '#f4a261',
  c5: '#e76f51',
  squareCountPerCall: 10,
  startsize: 50,
  rotationDivider: 16,
  numberOfSquares: 4,
  reducerFactor: 0.9,
  startOffset: 0,
  autiodraw: false,
  redraw: function () {
    gfx.reset();
    gfx.background(options.background);
    const numberOfSquareCount = options.numberOfSquares * options.numberOfSquares;
    const xStepWidth = startupParameters.xSize / options.numberOfSquares;
    const yStepWidth = startupParameters.ySize / options.numberOfSquares;
    for (let i = 0; i < numberOfSquareCount; i++) {
      const xMiddle = i % options.numberOfSquares * xStepWidth - xStepWidth / 2 + xStepWidth;
      const yMiddle = parseInt(i / options.numberOfSquares) * yStepWidth - yStepWidth / 2 + yStepWidth;
      drawSquares(xMiddle, yMiddle, options.startsize, gfx);
    }
  },
  save: function () {
    saveCanvas('Genuary23_3_' + Date.now(), 'png');
  }
}

// Creating a GUI with options.
var gui = new dat.GUI({name: 'Customization'});
var startupParameterFolder = gui.addFolder('canvas options');
gui.remember(startupParameters);
startupParameterFolder.add(startupParameters, 'xSize', 400);
startupParameterFolder.add(startupParameters, 'ySize', 400);
startupParameterFolder.add(startupParameters, 'resizeCanvas');
var folder1 = gui.addFolder('Setup options');
gui.remember(options);
folder1.addColor(options, 'background');
folder1.addColor(options, 'c1');
folder1.addColor(options, 'c2');
folder1.addColor(options, 'c3');
folder1.addColor(options, 'c4');
folder1.addColor(options, 'c5');
folder1.add(options, 'squareCountPerCall', 1, 100);
folder1.add(options, 'startsize', 1);
folder1.add(options, 'rotationDivider', -128, 128).step(0.1);
folder1.add(options, 'autiodraw', false, true);
folder1.add(options, 'numberOfSquares', 1, 16).step(1);
folder1.add(options, 'reducerFactor', 0.01, 2);
folder1.add(options, 'startOffset', 0, Math.PI * 2);
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

function drawSquares(middleX, middleY, startsize, gfx) {
  let currentHalfSize = startsize / 2;
  let rotation = PI / options.rotationDivider;
  const colors = [options.c1, options.c2, options.c3, options.c4, options.c5];
  gfx.push();
  gfx.translate(middleX, middleY);
  gfx.rotate(options.startOffset);
  gfx.noFill();
  for (let i = 0; i < options.squareCountPerCall; i++) {
    gfx.stroke(random(colors));
    gfx.square(-currentHalfSize, -currentHalfSize, currentHalfSize * 2);
    gfx.rotate(rotation);
    currentHalfSize = currentHalfSize * options.reducerFactor;
  }
  gfx.pop();
}