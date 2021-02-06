let gfx;
let currentR;
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
  background: '#212121',
  foreground: '#ffae23',
  stepsPerFrame: 30,
  stepsPerIncrement: 30,
  warmupsPerRound: 20,
  rIncrement: 0.01,
  startAt: 0,
  endAt: 4,
  restart: function () {
    gfx.reset();
    gfx.background(options.background);
    currentR = options.startAt;
    currentValue = 1;
  },
  save: function () {
    saveCanvas('Feigenbaum-Constant_' + Date.now(), 'png');
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
folder1.add(options, 'stepsPerFrame', 1, 200).step(1);
folder1.add(options, 'stepsPerIncrement', 1, 200).step(1);
folder1.add(options, 'warmupsPerRound', 1, 100).step(1);
folder1.add(options, 'startAt', 0, 5);
folder1.add(options, 'rIncrement', 0, 0.1);
folder1.add(options, 'endAt', 0, 5);
folder1.addColor(options, 'background');
folder1.addColor(options, 'foreground');
folder1.open();
gui.add(options, 'restart');
gui.add(options, 'save');

function setup() {
  startupParameters.resizeCanvas();
  options.restart();
}

function draw() {
  if (currentR < options.endAt)
  {
    drawStep(gfx);
    currentR += options.rIncrement;
  }
  gfx.fill(options.foreground);
  gfx.strokeWeight(0);
  gfx.stroke(options.foreground);
  // gfx.circle(100, 100, 2);
  image(gfx, 0, 0);
}

function drawStep(canvas) {
  for (let j = currentR; j < currentR + options.rIncrement; j += (options.rIncrement / options.stepsPerFrame))
  {
    let currentX = 0.8;

    for (let i = 0; i < options.stepsPerIncrement + options.warmupsPerRound; i++) {
      currentX = complexQuadratixPolynomial(currentX, j);
      if (i > options.warmupsPerRound)
      {
        canvas.point(currentR * (startupParameters.xSize / options.endAt), startupParameters.ySize - currentX * startupParameters.ySize);
      }
    }
  }
  // console.log(currentX, currentR);
}

function complexQuadratixPolynomial(xVal, r) {
  return xVal * r * (1 - xVal);
}