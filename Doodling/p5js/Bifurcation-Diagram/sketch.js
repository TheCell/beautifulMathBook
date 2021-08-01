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
  background: '#46495D',
  foreground: '#92b6b1',
  shadedforeground: '#46495D',
  stabilizeForYears: 400,
  stepsPerIncrement: 50,
  drawPixelPerFrame: 5,
  startingPopulation: 0.6,
  drawXSubpixels: 20,
  startAt: 2.9,
  endAt: 4,
  drawShaded: true,
  shadedNumberForMax: 10,
  restart: function () {
    foregroundC = color(options.foreground);
    shadedC = color(options.shadedforeground);
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
folder1.addColor(options, 'background');
folder1.addColor(options, 'foreground');
folder1.addColor(options, 'shadedforeground');
folder1.add(options, 'stabilizeForYears', 0, 1000).step(1);
folder1.add(options, 'drawPixelPerFrame', 1, startupParameters.xSize).step(10);
folder1.add(options, 'stepsPerIncrement', 1, 200).step(1);
folder1.add(options, 'drawXSubpixels', 0).step(1);
folder1.add(options, 'startAt', -2, 4).step(0.001).onChange(() => {
    if (options.startAt >= options.endAt) {
    options.endAt = options.startAt + 0.1;
  }
}).listen();
folder1.add(options, 'endAt', 0, 4).step(0.001).onChange(() => {
  if (options.startAt >= options.endAt) {
    options.endAt = options.startAt + 0.1;
  }
}).listen();
folder1.add(options, 'drawShaded').onChange(() => {
})
folder1.add(options, 'shadedNumberForMax').step(1);
folder1.open();
gui.add(options, 'restart');
gui.add(options, 'save');

let foregroundC;
let shadedC;
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
      if (options.drawShaded) {
        drawSmoothStep(gfx);
      } else {
        drawStep(gfx);
      }
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
      currentPopulationPercent = complexQuadraticPolynomial(currentPopulationPercent, currentR);
      if (i >= options.stabilizeForYears) {
        canvas.point(currentPixel, startupParameters.ySize - (currentPopulationPercent * startupParameters.ySize));
      }
    }
  }
}

function drawSmoothStep(canvas) {
  let currentPopulationPercent = options.startingPopulation;
  let pixelArray = [startupParameters.ySize];
  gfx.stroke(options.background);
  
  const currentPixel = currentX;
  for (let subpixels = 0; subpixels < options.drawXSubpixels; subpixels++) {
    const currentR = (options.endAt - options.startAt) / startupParameters.xSize * currentPixel + options.startAt;

    for (let i = 0; i < options.stabilizeForYears + options.stepsPerIncrement; i++) {
      currentPopulationPercent = complexQuadraticPolynomial(currentPopulationPercent, currentR);
      if (i >= options.stabilizeForYears) {
        const index = Math.round(startupParameters.ySize - (currentPopulationPercent * startupParameters.ySize));
        pixelArray[index] = typeof pixelArray[index] === 'undefined' ? 1 : pixelArray[index] + 1;
      }
    }
  }

  for(let yPixel = 0; yPixel < startupParameters.ySize; yPixel++)
  {
    const count = typeof pixelArray[yPixel] === 'undefined' ? 0 : pixelArray[yPixel];
    const lerpAmount = (1 / options.shadedNumberForMax) * count;
    if (lerpAmount == 0)
    {
      gfx.stroke(options.background);

    } else if (lerpAmount > 1)
    {
      gfx.stroke(foregroundC);
    }
    else
    {
      gfx.stroke(lerpColor(shadedC, foregroundC, lerpAmount));
    }
    canvas.point(currentPixel, yPixel);
  }
}

function complexQuadraticPolynomial(xVal, r) {
  return r * xVal * (1 - xVal);
}