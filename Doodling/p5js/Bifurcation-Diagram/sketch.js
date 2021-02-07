let gfx;
let currentR;
let currentX;
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
  background: '#282729',
  foreground: '#4F90C2',
  stabilizeForYears: 150,
  stepsPerIncrement: 50,
  drawPixelPerFrame: 50,
  startingPopulation: 0.6,
  drawXSubpixels: 2,
  startAt: 2.9,
  endAt: 4,
  restart: function () {
    gfx.reset();
    gfx.background(options.background);
    currentR = options.startAt;
    currentX = 0;
    currentValue = 1;
  },
  save: function () {
    saveCanvas('Bifurcation-Diagram_' + Date.now(), 'png');
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
folder1.add(options, 'stabilizeForYears', 0, 600).step(1);
folder1.add(options, 'drawPixelPerFrame', 1, startupParameters.xSize).step(10);
folder1.add(options, 'stepsPerIncrement', 1, 200).step(1);
folder1.add(options, 'drawXSubpixels', 0, 50).step(1);
folder1.add(options, 'startAt', -2, 4).step(0.001);
folder1.add(options, 'endAt', 0, 4).step(0.001);
folder1.addColor(options, 'background');
folder1.addColor(options, 'foreground');
folder1.open();
gui.add(options, 'restart');
gui.add(options, 'save');

function setup() {
  startupParameters.resizeCanvas();
  options.restart();
  
  gfx.strokeWeight(0);
}

function draw() {
  gfx.stroke(options.foreground);

  for (let i = 0; i < options.drawPixelPerFrame; i++)
  {
    if (currentX < startupParameters.xSize) {
      drawStep(gfx);
      currentX ++;
    }
  }
  
  image(gfx, 0, 0);
}

function drawStep(canvas) {
  let currentPopulationPercent = options.startingPopulation;

  for (let subpixels = 0; subpixels < options.drawXSubpixels; subpixels++) {
    const currentPixel = currentX + (1 / options.drawXSubpixels) * subpixels;
    const currentR = (options.endAt - options.startAt) / startupParameters.xSize * currentPixel + options.startAt;

    for (let i = 0; i < options.stabilizeForYears + options.stepsPerIncrement; i++) {
      currentPopulationPercent = complexQuadratixPolynomial(currentPopulationPercent, currentR);
      if (i >= options.stabilizeForYears) {
        canvas.point(currentPixel, startupParameters.ySize - currentPopulationPercent * startupParameters.ySize);
      }
    }
  }
  
}

function complexQuadratixPolynomial(xVal, r) {
  return r * xVal * (1 - xVal);
}