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
  background: '#131200',
  foreground: '#AF3E4D',
  blendToColor: '#9D8420',
  blendStepPerIteration: 0.00015,
  maxStartNumber: 1000000,
  lineLenght: 2.2,
  amountOfBranches: 50,
  angle1: 0.04,
  angle2: -0.07,
  restart: function () {
    gfx.reset();
    gfx.background(options.background);
    
    let lineColor = color(options.foreground);
    let blendToColor = color(options.blendToColor);
    for (let i = 0; i < options.amountOfBranches; i++) {
      drawBranch(Math.round(Math.random() * options.maxStartNumber), lineColor, blendToColor);
    }
  },
  save: function () {
    saveCanvas('Collatz-Conjecture-Trees_' + Date.now(), 'png');
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
folder1.addColor(options, 'background').onChange(() => {
  options.restart();
});
folder1.addColor(options, 'foreground').onChange(() => {
  options.restart();
});
folder1.addColor(options, 'blendToColor').onChange(() => {
  options.restart();
});
folder1.add(options, 'blendStepPerIteration').min(0).max(0.001).onChange(() => {
  options.restart();
});
folder1.add(options, 'maxStartNumber').onChange(() => {
  options.restart();
});
folder1.add(options, 'lineLenght').onChange(() => {
  options.restart();
});
folder1.add(options, 'amountOfBranches').onChange(() => {
  options.restart();
});
folder1.add(options, 'angle1').min(-Math.PI / 16).max(Math.PI / 16).onChange(() => {
  options.restart();
});
folder1.add(options, 'angle2').min(-Math.PI / 16).max(Math.PI / 16).onChange(() => {
  options.restart();
});
folder1.open();
gui.add(options, 'restart');
gui.add(options, 'save');

function setup() {
  startupParameters.resizeCanvas();
  options.restart();
}

function draw() {
  image(gfx, 0, 0);
}

function drawBranch(startNumber, startcolor, blendColor) {
  gfx.push();
  gfx.translate(gfx.width / 2, gfx.height);
  let currentLerp = 0;

  while (startNumber > 1) {
    gfx.stroke(startcolor);

    if (startNumber % 2 == 0) {
      startNumber /= 2;
      gfx.rotate(options.angle1);
      gfx.line(0, 0, 0, -options.lineLenght);
      gfx.translate(0, -options.lineLenght);
    } else {
      startNumber = startNumber * 3 + 1;
      gfx.rotate(options.angle2);
      gfx.line(0, 0, 0, -options.lineLenght);
      gfx.translate(0, -options.lineLenght);
    }
    currentLerp = Math.min(1, currentLerp + options.blendStepPerIteration);
    startcolor = lerpColor(startcolor, blendColor, currentLerp);
  }

  gfx.pop();
}